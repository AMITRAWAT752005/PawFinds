from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import joblib
import pandas as pd
import os

app = FastAPI(title="PawFinds Adoption Likelihood Microservice")

MODEL_PATH = os.environ.get('MODEL_PATH', 'adoption_model.pkl')
PREPROCESSOR_PATH = os.environ.get('PREPROCESSOR_PATH', 'preprocessor.pkl')
METADATA_PATH = os.environ.get('METADATA_PATH', 'metadata.json')

# Define a permissive input model. Real schema should match metadata.json produced at training time.
class PetData(BaseModel):
    PetType: Optional[str] = None
    Breed: Optional[str] = None
    AgeMonths: Optional[float] = None
    Color: Optional[str] = None
    Vaccinated: Optional[bool] = None
    HealthCondition: Optional[str] = None
    AdoptionFee: Optional[float] = None
    PreviousOwner: Optional[bool] = None
    # Accept additional arbitrary fields
    extra: Optional[Dict[str, Any]] = None


def load_artifacts():
    model = None
    preprocessor = None
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            app.log_warning = f"Model file not found at {MODEL_PATH}, using fallback."
        if os.path.exists(PREPROCESSOR_PATH):
            preprocessor = joblib.load(PREPROCESSOR_PATH)
        else:
            app.log_warning = getattr(app, 'log_warning', '') + f" Preprocessor not found at {PREPROCESSOR_PATH}."
        # load metadata if available
        metadata = None
        if os.path.exists(METADATA_PATH):
            try:
                import json
                with open(METADATA_PATH, 'r') as f:
                    metadata = json.load(f)
                app.metadata = metadata
            except Exception as e:
                app.log_warning = getattr(app, 'log_warning', '') + f" Error loading metadata: {e}"
        else:
            app.metadata = None
    except Exception as e:
        # keep None and fallback later
        app.log_warning = getattr(app, 'log_warning', '') + f" Error loading artifacts: {e}"
    return model, preprocessor


MODEL, PREPROCESSOR = load_artifacts()


@app.get('/health')
def health():
    status = {"status": "ok", "model_loaded": bool(MODEL), "preprocessor_loaded": bool(PREPROCESSOR)}
    if hasattr(app, 'log_warning'):
        status['warning'] = app.log_warning
    return status


@app.post('/predict')
def predict(payload: Dict[str, Any]):
    """Accepts a JSON payload and returns an adoption likelihood percentage.

    This endpoint expects the incoming JSON to contain the features used during training.
    If model or preprocessor are not present, returns a conservative default (50%).
    Now includes robust error handling for missing/incorrect keys and returns clear error messages.
    """
    try:
        # Attempt to convert to DataFrame with a single row
        if isinstance(payload, dict):
            # Map payload to metadata feature order if metadata is present
            if hasattr(app, 'metadata') and app.metadata and 'features' in app.metadata:
                cols = app.metadata['features']
                row = {}
                # helper to normalize keys for flexible matching
                def _norm(s):
                    return ''.join([c.lower() for c in str(s) if c.isalnum()])

                payload_norm = { _norm(k): v for k, v in payload.items() }

                for c in cols:
                    # try several common variants: exact, lowercase, PetType, etc.
                    candidates = [c, c.lower(), c.title(), 'pet' + c, 'pet' + c.lower()]
                    value = None
                    for cand in candidates:
                        v = payload.get(cand)
                        if v is not None:
                            value = v
                            break
                    if value is None:
                        # try normalized matching against any payload key
                        norm_c = _norm(c)
                        if norm_c in payload_norm:
                            value = payload_norm[norm_c]
                        else:
                            # try matching keys that end or start with same token
                            for k_norm, v in payload_norm.items():
                                if k_norm.endswith(norm_c) or k_norm.startswith(norm_c) or norm_c in k_norm:
                                    value = v
                                    break
                    # final assignment (may be None)
                    row[c] = value
                df = pd.DataFrame([row])
            else:
                df = pd.DataFrame([payload])
        else:
            raise HTTPException(status_code=400, detail='Invalid payload format')

        # Encode categorical features if needed
        if hasattr(app, 'metadata') and app.metadata:
            meta = app.metadata
            for col in meta.get('categorical_cols', []):
                if col in df.columns:
                    encoder = meta.get('label_encoders', {}).get(col)
                    if encoder:
                        # Map string to integer label
                        df[col] = df[col].apply(lambda x: encoder.index(x) if x in encoder else None)
        # Fill any NaN values with safe defaults (0 for numeric, 0 for categorical)
        df = df.fillna(0)
        # If preprocessor exists, use it; otherwise try to pass raw features
        if PREPROCESSOR is not None:
            try:
                X = PREPROCESSOR.transform(df)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Preprocessing error: {e}. Input: {df.to_dict()}")
        else:
            # try to select numeric columns only
            X = df.select_dtypes(include=['number']).fillna(0).values

        # Ensure no NaN in X
        import numpy as np
        if np.isnan(X).any():
            X = np.nan_to_num(X, nan=0)

        if MODEL is not None:
            # scikit-learn style predict_proba
            try:
                prob = float(MODEL.predict_proba(X)[0][1])
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Model prediction error: {e}")
        else:
            # fallback default
            prob = 0.5

        percentage = round(prob * 100)
        return {"likelihood_percentage": percentage, "probability": prob, "model_version": os.environ.get('MODEL_VERSION', 'unknown')}
    except HTTPException as he:
        # Return error with clear message
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Prediction error: {e}')
