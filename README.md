# 🐾 PawFinds - A Pet Adoption System

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-4A90A4?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Last%20Updated-April%202026-blue?style=for-the-badge" alt="Last Updated">
</p>

---

## 📥 Quick Clone

```bash
# Clone the repository
git clone https://github.com/your-username/PawFinds-A-Pet-Adoption-System.git

# Navigate to project folder
cd PawFinds-A-Pet-Adoption-System
```

---

## 🌟 Project Overview

**PawFinds** is a full-stack, responsive web application designed to modernize and streamline the pet adoption process. Our mission is to connect prospective pet parents with shelters and rescue organizations through an intuitive, user-friendly platform.

By centralizing pet listings and digitizing the adoption workflow, PawFinds aims to:
- 🔍 Increase visibility of adoptable animals
- ⏱️ Reduce time-to-adoption
- 📋 Provide a transparent and engaging experience

---

## 🚀 Key Features

### 👤 User Features
| Feature | Description |
|---------|-------------|
| **🔐 Secure Authentication** | JWT-based login with OTP email verification |
| **🐕 Pet Browsing** | Browse and filter pets by species, breed, age, and location |
| **📝 Adoption Requests** | Submit adoption requests online |
| **👤 User Profile** | Manage your profile and track adoption status |
| **🔎 ML-Powered Predictions** | AI-powered adoption likelihood predictions |

### ⚙️ Admin Features
| Feature | Description |
|---------|-------------|
| **📊 Dashboard** | View statistics and user registrations |
| **📋 Request Management** | Review, approve, or reject pet adoption requests |
| **🐾 Pet Management** | Post new pets for adoption |
| **📈 Adoption History** | Track adopted pets and their new owners |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        TECH STACK                               │
├─────────────────┬─────────────────┬───────────────────────────┤
│    Frontend     │     Backend     │        Database           │
├─────────────────┼─────────────────┼───────────────────────────┤
│  React.js      │  Node.js        │  MongoDB                  │
│  Context API   │  Express.js     │  Mongoose ODM             │
│  React Router  │  RESTful APIs   │  MongoDB Atlas            │
│  CSS Modules   │  JWT Auth       │                           │
│                │  Nodemailer     │                           │
└─────────────────┴─────────────────┴───────────────────────────┘
```

### Additional Technologies
- **ML Service**: Python (Flask) + TensorFlow for adoption prediction
- **Authentication**: JWT tokens, bcryptjs password hashing
- **Email**: Nodemailer for OTP verification
- **Validation**: Validator.js for email validation

---

## 📁 Project Structure

```
PawFinds-A-Pet-Adoption-System/
│
├── 📂 Client/                    # React Frontend
│   ├── src/
│   │   ├── Components/           # React components
│   │   │   ├── AdminPanel/       # Admin dashboard
│   │   │   ├── Auth/             # Login/Signup with OTP
│   │   │   ├── Home/             # Landing page
│   │   │   ├── NavBar/           # Navigation
│   │   │   ├── Pets/             # Pet browsing
│   │   │   ├── Profile/          # User profile
│   │   │   └── ...
│   │   ├── Context/              # Auth context
│   │   ├── hooks/                # Custom React hooks
│   │   └── ...
│   └── package.json
│
├── 📂 server/                    # Node.js Backend
│   ├── Controller/               # Route handlers
│   ├── Model/                    # Mongoose schemas
│   ├── Routes/                   # API routes
│   ├── Middleware/              # Auth middleware
│   ├── images/                  # Uploaded images
│   └── server.js
│
├── 📂 ml_service/                # Python ML Service
│   ├── app.py                    # Flask API
│   ├── train_adoption_model.py   # Model training
│   └── requirements.txt
│
├── 📂 Prediction_Model/          # ML Notebooks
│   └── pets-adoption-classifier-ml-neural-networks.ipynb
│
├── docker-compose.yml            # Docker setup
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed:

| Requirement | Version |
|-------------|---------|
| Node.js | v18+ |
| npm | v9+ |
| MongoDB | v6+ |
| Python | v3.8+ (for ML) |

---

### 🗄️ MongoDB Setup (Step by Step)

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for free

2. **Create Cluster**:
   - Click "Build a Cluster" → Choose "Free" tier
   - Select provider (AWS/Google Cloud/Azure) and region
   - Click "Create Cluster" (wait 1-2 minutes)

3. **Create Database User**:
   - Go to "Database Access" → "Add New User"
   - Username: `<username>` | Password: `<password>`
   - Click "Add User"

4. **Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Click "Database" → "Connect" → "Drivers"
   - Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?appName=Cluster0
   ```

#### Option B: Local MongoDB

1. **Install MongoDB**:
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   ```

2. **Connection String** (local):
   ```
   mongodb://localhost:27017/pawfinds
   ```

---

### 🖥️ Installation Steps

#### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=4000

# MongoDB Connection
dburl=your_mongodb_connection_string

# JWT Secret
SECRET=your_jwt_secret_key

# Email Configuration (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASS=your_app_password
```

Start the server:

```bash
node server.js
# OR
npm start
```

Server will run at: `http://localhost:4000`

#### 2. Frontend Setup

```bash
cd ../Client
npm install
```

Create a `.env` file in the `Client/` directory:

```env
REACT_APP_API_URL=http://localhost:4000
```

Start the client:

```bash
npm start
```

Client will run at: `http://localhost:3000`

#### 3. ML Service (Optional)

```bash
cd ../ml_service
pip install -r requirements.txt
python app.py
```

ML service will run at: `http://localhost:8000`

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User login |
| POST | `/signup` | User registration |
| POST | `/api/send-otp` | Send OTP for verification |
| POST | `/api/verify-otp` | Verify OTP |
| PUT | `/update` | Update user profile |
| PUT | `/update-password` | Change password |

### Pets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/requests` | Get pending pet requests |
| GET | `/approvedPets` | Get approved pets |
| GET | `/adoptedPets` | Get adopted pets |
| POST | `/services` | Post new pet |
| PUT | `/approving/:id` | Approve pet request |
| DELETE | `/delete/:id` | Delete pet |

### Adoption Forms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/form/getForms` | Get all adoption forms |
| POST | `/form/save` | Submit adoption form |
| DELETE | `/form/delete/many/:id` | Delete forms |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get admin statistics |

---

## 🤖 ML Adoption Prediction

PawFinds includes an AI-powered feature that predicts the likelihood of a pet being adopted based on:

- 🐾 Pet type (Dog, Cat, etc.)
- 🐶 Breed
- 📅 Age
- 📍 Location

The ML model is trained using neural networks and exposed via a Flask API.

### Running ML Service

```bash
cd ml_service
pip install -r requirements.txt
python app.py
```

---

## 📸 Screenshots

> Add your project screenshots here!

---

## 🧪 Testing

```bash
# Test backend
cd server
npm test

# Test frontend
cd Client
npm test
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `dburl` | MongoDB connection string | Yes |
| `SECRET` | JWT secret key | Yes |
| `EMAIL_USER` | Gmail for sending OTP | Yes |
| `EMAIL_APP_PASS` | App password for Gmail | Yes |

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Contributors

- **Amit Rawat** - *Initial work*

---

## 🙏 Acknowledgments

- [MERN Stack Documentation](https://www.mongodb.com/mern-stack)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/your-username">Amit Rawat</a>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=your-username&label=Views&color=green&style=flat" alt="profile views">
</p>