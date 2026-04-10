#!/usr/bin/env python3
"""
Train adoption likelihood model with realistic patterns.
Run this to generate a better model: python train_adoption_model.py
"""
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import warnings
warnings.filterwarnings('ignore')

print("="*70)
print("🚀 Training Adoption Likelihood Model (Realistic Patterns)")
print("="*70)

# Define realistic breed and pet type data
pet_types = ["Dog", "Cat", "Bird", "Fish", "Rabbit"]
breed_mapping = {
    "Dog": ["Beagle", "Bulldog", "German Shepherd", "Golden Retriever", "Labrador Retriever", "Pug"],
    "Cat": ["Bengal", "Maine Coon", "Persian", "Ragdoll", "Siamese"],
    "Bird": ["Budgerigar", "Cockatiel", "Lovebird", "Parrot"],
    "Fish": ["Angelfish", "Betta", "Goldfish", "Guppy", "Tetra"],
    "Rabbit": ["Lionhead", "Lop", "Mini Rex", "Netherland Dwarf"]
}
health_status = ["Pending", "Adopted", "Rejected", "Donated"]

# Generate synthetic training data with realistic patterns
np.random.seed(42)
n_samples = 500

data = []

for _ in range(n_samples):
    pet_type = np.random.choice(pet_types)
    breed = np.random.choice(breed_mapping[pet_type])
    age_months = np.random.randint(1, 180)  # 1 month to 15 years
    status = np.random.choice(health_status, p=[0.4, 0.3, 0.2, 0.1])
    
    # Create adoption likelihood based on realistic patterns
    # Younger pets are more adoptable
    age_factor = 1 - (age_months / 180)  # Higher score for younger pets
    
    # Some types are more adoptable
    type_factor = {
        "Dog": 0.9,
        "Cat": 0.8,
        "Rabbit": 0.7,
        "Bird": 0.6,
        "Fish": 0.5
    }[pet_type]
    
    # Status affects adoptability
    status_factor = {
        "Pending": 0.7,
        "Adopted": 0.95,  # Already adopted = highly adoptable
        "Rejected": 0.2,
        "Donated": 0.8
    }[status]
    
    # Calculate adoption likelihood (0 to 1)
    score = (age_factor * 0.3 + type_factor * 0.4 + status_factor * 0.3)
    score = np.clip(score + np.random.normal(0, 0.1), 0, 1)  # Add some noise
    
    # Convert to binary (adopted or not)
    adopted = 1 if score > 0.5 else 0
    
    data.append({
        "type": pet_type,
        "breed": breed,
        "AgeMonths": age_months,
        "status": status,
        "adopted": adopted
    })

df = pd.DataFrame(data)

print(f"\n📊 Generated {len(df)} training samples")
print(f"📈 Adoption rate: {df['adopted'].mean()*100:.1f}%")
print(f"🏷️  Pet types: {df['type'].unique().tolist()}")
print(f"\n🔍 Sample data:")
print(df.head(10))

# Define feature columns
categorical_cols = ["type", "breed", "status"]
numeric_cols = ["AgeMonths"]
target = "adopted"

# Label encode categorical features
label_encoders = {}
df_encoded = df.copy()

for col in categorical_cols:
    le = LabelEncoder()
    df_encoded[col] = le.fit_transform(df[col])
    label_encoders[col] = le.classes_.tolist()

print(f"\n🔧 Encoding categorical features...")
print(f"   Type values: {label_encoders['type']}")
print(f"   Breed samples: {label_encoders['breed'][:5]}... ({len(label_encoders['breed'])} total)")
print(f"   Status values: {label_encoders['status']}")

# Prepare training data
X = df_encoded[numeric_cols + categorical_cols]
y = df_encoded[target]

# Split into train and test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print(f"\n📚 Training on {len(X_train)} samples, testing on {len(X_test)} samples")

# Scale numeric features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest model
print(f"\n🤖 Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"\n✅ Model Performance:")
print(f"   Accuracy:  {accuracy:.2%}")
print(f"   Precision: {precision:.2%}")
print(f"   Recall:    {recall:.2%}")
print(f"   F1 Score:  {f1:.2%}")

# Save model and preprocessor
joblib.dump(model, 'adoption_model.pkl')
print(f"✅ Saved adoption_model.pkl")

joblib.dump(scaler, 'preprocessor.pkl')
print(f"✅ Saved preprocessor.pkl")

# Create metadata
metadata = {
    "model_type": "RandomForestClassifier",
    "scaler_type": "StandardScaler",
    "features": numeric_cols + categorical_cols,
    "numeric_cols": numeric_cols,
    "categorical_cols": categorical_cols,
    "label_encoders": label_encoders,
    "training_samples": len(X_train),
    "test_samples": len(X_test),
    "accuracy": float(accuracy),
    "precision": float(precision),
    "recall": float(recall),
    "f1_score": float(f1),
    "adoption_rate": float(df['adopted'].mean()),
    "version": "2.0_realistic_patterns"
}

with open('metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print(f"✅ Saved metadata.json")

print(f"\n" + "="*70)
print(f"✨ Model trained successfully!")
print(f"🚀 Start the ML service: uvicorn app:app --reload --port 8000")
print("="*70)

# Test predictions on sample data
print(f"\n🧪 Testing predictions on diverse samples:")
test_samples = [
    {"type": "Dog", "breed": "Golden Retriever", "AgeMonths": 12, "status": "Pending"},
    {"type": "Dog", "breed": "Golden Retriever", "AgeMonths": 120, "status": "Pending"},
    {"type": "Cat", "breed": "Persian", "AgeMonths": 24, "status": "Adopted"},
    {"type": "Fish", "breed": "Betta", "AgeMonths": 6, "status": "Pending"},
]

for sample in test_samples:
    sample_df = pd.DataFrame([sample])
    for col in categorical_cols:
        le_classes = label_encoders[col]
        sample_df[col] = sample_df[col].apply(lambda x: le_classes.index(x) if x in le_classes else 0)
    
    X_sample_scaled = scaler.transform(sample_df[numeric_cols + categorical_cols])
    proba = model.predict_proba(X_sample_scaled)[0][1]
    likelihood = int(proba * 100)
    
    print(f"   {sample['type']} ({sample['breed']}) - {sample['AgeMonths']} months: {likelihood}% adoption likelihood")
