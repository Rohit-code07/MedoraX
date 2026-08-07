# MedoraX ⚕️ — Intelligent Clinical Medication Coordinator & AI Health Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Engine-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**MedoraX** is a HIPAA-compliant, enterprise-grade medication management and clinical decision-support ecosystem. Built with a high-performance **React + Vite** frontend and a robust **Spring Boot 3 REST API**, MedoraX incorporates **Google Gemini Multimodal AI** and **OCR Scanner Engines** to eliminate prescription mismatch risks, calculate patient adherence metrics, and deliver automated medication reminders.

🌐 **Live Application**: [https://medora-x-five.vercel.app](https://medora-x-five.vercel.app)  
⚙️ **Backend Production Service**: `https://medorax-0.onrender.com`

---

## 🏗️ System Architecture

MedoraX follows a decoupled, microservices-ready Client-Server architecture with decoupled presentation, application logic, and persistence layers.

```mermaid
graph TD
    subgraph Client Layer (React 18 + Vite SPA)
        UI[User Interface & Dashboard]
        AuthModule[Auth & OAuth2 Handler]
        Store[AppContext & Local State]
        Axios[Axios API Interceptor]
    end

    subgraph API Gateway & Security Layer (Spring Boot 3)
        CORS[CORS Preflight & Origin Filter]
        JWTFilter[JWT Authentication Filter]
        OAuth2Handler[OAuth2 Success/Failure Handler]
        Security[Spring Security Filter Chain]
    end

    subgraph Business Logic & Controllers
        AuthCtrl[Auth Controller]
        MedCtrl[Medicine Controller]
        ProfileCtrl[Profile Controller]
        LogCtrl[Analytics & Log Controller]
        RemCtrl[Reminder Controller]
        MismatchCtrl[Mismatch & OCR Controller]
    end

    subgraph External AI Services & Data Engine
        Gemini[Google Gemini AI API]
        OCR[Tesseract OCR Engine]
    end

    subgraph Persistence Layer
        JPA[Spring Data JPA / Hibernate]
        DB[(MySQL Database)]
    end

    UI --> Store
    Store --> Axios
    Axios --> CORS
    AuthModule --> OAuth2Handler
    CORS --> JWTFilter
    JWTFilter --> Security
    Security --> AuthCtrl
    Security --> MedCtrl
    Security --> ProfileCtrl
    Security --> LogCtrl
    Security --> RemCtrl
    Security --> MismatchCtrl

    MedCtrl --> Gemini
    MismatchCtrl --> OCR
    MismatchCtrl --> Gemini

    AuthCtrl --> JPA
    MedCtrl --> JPA
    ProfileCtrl --> JPA
    LogCtrl --> JPA
    RemCtrl --> JPA
    JPA --> DB
```

### Data Flow & Request Lifecycle
1. **Authentication Flow**: Users log in via JWT credentials (`/auth/login`) or Google OAuth2 (`/oauth2/authorization/google`). On OAuth success, the server redirects back to the SPA frontend with signed tokens.
2. **API Interception**: All protected frontend requests attach `Authorization: Bearer <token>` headers via Axios interceptors.
3. **Stateless Processing**: Spring Security verifies JWT claims, populating `SecurityContextHolder` with `userId` for thread-safe access.
4. **AI & Vision Pipeline**: Optical Character Recognition extracts raw text from uploaded physical prescription images. Google Gemini AI compares the extracted text against active database records to detect dosage conflicts and drug-drug interactions.

---

## ✨ Key Features

### 1. 📊 Interactive Dashboard & Adherence Hub
- **Real-Time Streak Tracker**: Computes consecutive compliant intake days without missed doses.
- **Daily Compliance Rate**: Calculates percentage of completed vs. missed doses dynamically.
- **Weekly Adherence Graph**: Interactive Area & Bar charts powered by Recharts.
- **Active Shelf Catalog**: Instant overview of current prescriptions, dosage strengths, and remaining pill counts.

### 2. 📸 AI Prescription Mismatch & OCR Vision Scanner
- **Multimodal AI Analysis**: Scans uploaded physical prescription documents alongside pill packaging.
- **Conflict Identification**: Automatically flags drug mismatches, improper dosage frequencies, and dangerous drug-drug interactions using Google Gemini 1.5 Flash.
- **Automated Structuring**: Converts unstructured medical handwriting and printed text into structured data.

### 3. 🗓️ Intelligent Reminder Timeline & Schedule Engine
- **Horizontal Date Navigator**: 7-day calendar strip allowing historical review and future intake planning.
- **Hourly Medication Timeline**: Chronological event sequence showing exact dosage times, food constraints (*Before Meals, With Food, After Meals*), and administration notes.
- **Compliance Toggles**: One-click action buttons to mark doses as **Taken**, **Missed**, or **Reset**.

### 4. 📈 Analytics & Heatmap Visualization
- **GitHub-Style Compliance Heatmap**: 6-month density matrix visualizing long-term intake consistency.
- **Per-Medication Adherence Rates**: Individual breakdown of compliance percentages across every active treatment.
- **Most Consistent & Needs Attention Highlights**: Identifies top-performing medications and items requiring supervisory intervention.

### 5. 🤖 MedoraX AI Health Assistant
- **Clinical Knowledge Engine**: Interactive AI copilot for answering medical questions, explaining side effects, and verifying food/beverage interactions.
- **Predefined Clinical Prompts**: Quick-access prompt chips for rapid guidance on common pharmaceutical questions.

### 6. 👤 Patient Profile & Emergency Contact Escalation
- **Demographic Vitals**: Blood group, height, weight, and allergy records.
- **Emergency Guardian Contact**: Stores emergency contact details for automated alert escalation if high-priority doses are missed.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite 6 |
| **Styling & Design System** | Vanilla CSS, Tailwind CSS 3, Glassmorphism, Dark Mode |
| **Animations & UI Components** | Framer Motion, Lucide Icons, React Hot Toast |
| **Data Visualization** | Recharts (Area, Bar, & Line Charts) |
| **HTTP & State Management** | Axios, React Context API, React Hook Form |
| **Backend Framework** | Java 21, Spring Boot 3.x, Spring MVC |
| **Security & Auth** | Spring Security 6, JWT (io.jsonwebtoken), Google OAuth2 |
| **Database & ORM** | MySQL 8.0 / PostgreSQL, Spring Data JPA, Hibernate |
| **AI Services & OCR** | Google Gemini AI API (Gemini 1.5 Flash / Vision), Tesseract OCR |
| **Build & Deployment** | Maven (Backend), Vite (Frontend), Vercel (SPA Hosting), Render (Backend API) |

---

## 📂 Project Directory Structure

```bash
MedoraX/
├── vercel.json                           # Root Vercel SPA routing rules
├── README.md                             # Architecture & Documentation
├── frontend/                             # React + Vite Frontend Application
│   ├── public/                           # Static assets, vercel.json, _redirects
│   ├── src/
│   │   ├── api/                          # Axios API clients
│   │   │   ├── analytics.api.ts          # Analytics & Heatmap endpoints
│   │   │   ├── auth.api.ts               # Login, Signup, OAuth endpoints
│   │   │   ├── axios.ts                  # Interceptor & dynamic baseURL setup
│   │   │   ├── medicine.api.ts           # Medicine CRUD & AI endpoints
│   │   │   ├── mismatch.api.ts           # OCR & Prescription Scanner endpoints
│   │   │   ├── profile.api.ts            # Patient profile API
│   │   │   └── reminder.api.ts           # Scheduled reminder API
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── ui/                       # Button, Card, Input, Select, Badge, Tabs
│   │   │   └── Header.tsx / Sidebar.tsx  # Layout Header and Navigation Sidebar
│   │   ├── context/
│   │   │   └── AppContext.tsx            # Global application state & API synchronization
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx       # Protected layout container
│   │   ├── pages/                        # View Pages
│   │   │   ├── AIAssistant.tsx           # AI Copilot Assistant page
│   │   │   ├── AddMedicine.tsx           # Multi-step medication setup wizard
│   │   │   ├── Analytics.tsx             # Adherence Heatmap & Analytics page
│   │   │   ├── Auth.tsx                  # Login / Signup & OAuth callback page
│   │   │   ├── Dashboard.tsx             # Core Patient Dashboard
│   │   │   ├── LandingPage.tsx           # Public Hero & Features page
│   │   │   ├── MedicineManagement.tsx    # Shelf catalog & active management
│   │   │   ├── PrescriptionMismatch.tsx  # AI OCR & Vision Scanner page
│   │   │   ├── ProfilePage.tsx           # Patient Vitals & Emergency Contacts page
│   │   │   ├── ReminderTimeline.tsx      # Daily Calendar Schedule Timeline
│   │   │   └── SettingsPage.tsx          # App Preferences & Notification page
│   │   ├── types/                        # TypeScript Interfaces & Models
│   │   ├── App.tsx                       # React Router configuration
│   │   └── main.tsx                      # Vite entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json
│
└── backend/                              # Spring Boot Java Backend Service
    └── medicineRemainder/
        └── medicineRemainder/
            ├── src/main/java/com/project/medicineRemainder/
            │   ├── Security/             # JWT Filter, Util, & OAuth2 Success Handler
            │   │   ├── SecurityConfig.java
            │   │   ├── OAuth2AuthenticationSuccessHandler.java
            │   │   ├── jwt.java
            │   │   └── jwtUtil.java
            │   ├── config/               # Web & CORS Configurations
            │   ├── controller/           # REST API Controllers
            │   │   ├── Authcontroller.java
            │   │   ├── ReminderController.java
            │   │   ├── medicineController.java
            │   │   ├── medicineLogController.java
            │   │   ├── profileController.java
            │   │   └── userController.java
            │   ├── dto/                  # Data Transfer Objects
            │   ├── Entity/               # JPA Entities (User, Medicine, profile, Remainder, medicineLog)
            │   ├── repository/           # Spring Data JPA Repositories
            │   └── service/              # Business Logic Services
            │       ├── GeminiServices.java
            │       ├── OCRservices.java
            │       ├── medicineLogServices.java
            │       ├── medicineServices.java
            │       ├── profileServices.java
            │       └── remainderServices.java
            ├── src/main/resources/
            │   └── application.properties# Spring Configuration & Database Credentials
            └── pom.xml
```

---

## 📡 REST API Reference

### 🔐 Authentication (`/auth`, `/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/signup` | Register a new user account | ❌ |
| `POST` | `/auth/login` | Log in and receive JWT token | ❌ |
| `GET` | `/oauth2/authorization/google` | Trigger Google OAuth2 Sign-In | ❌ |
| `GET` | `/api/auth/me` | Fetch authenticated user details | ✅ |
| `POST` | `/api/auth/logout` | Revoke session and log out | ✅ |

### 💊 Medicines (`/api/medicines`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/medicines` | Get all active medicines for authenticated user | ✅ |
| `POST` | `/api/medicines` | Add a new medicine item | ✅ |
| `GET` | `/api/medicines/{id}` | Get medicine details by ID | ✅ |
| `PUT` | `/api/medicines/{id}` | Update medicine properties | ✅ |
| `DELETE` | `/api/medicines/{id}` | Delete a medicine item | ✅ |
| `PUT` | `/api/medicines/{id}/taken` | Mark dose as taken today | ✅ |
| `PUT` | `/api/medicines/{id}/missed` | Mark dose as missed today | ✅ |
| `POST` | `/api/medicines/explain` | Explain medicine details via Gemini AI | ✅ |
| `POST` | `/api/medicines/process-prescription` | Process prescription image via OCR + Gemini | ✅ |

### 🗓️ Reminders (`/remainder`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/remainder/all` | Fetch scheduled reminders | ✅ |
| `POST` | `/remainder/create` | Create a scheduled reminder | ✅ |
| `PUT` | `/remainder/update-status/{id}?st=TAKEN` | Update reminder status (`TAKEN`, `MISSED`, `PENDING`) | ✅ |

### 📊 Analytics & Heatmap (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/analytics/{userId}` | Get full user analytics breakdown | ✅ |
| `GET` | `/api/analytics/{userId}/streak` | Fetch day streak count | ✅ |
| `GET` | `/api/analytics/{userId}/weekly-rate` | Fetch weekly compliance rate (%) | ✅ |
| `GET` | `/api/analytics/heatmap` | Fetch 6-month compliance heatmap data | ✅ |

### 👤 Profile (`/api/profile`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/profile?userId={id}` | Get patient medical profile | ✅ |
| `POST` | `/api/profile?userId={id}` | Create patient profile | ✅ |
| `PUT` | `/api/profile?userId={id}` | Update patient profile vitals & contacts | ✅ |

---

## ⚡ Local Setup & Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Java JDK**: 21
- **Maven**: 3.8+
- **MySQL**: 8.0+

### 1. Clone the Repository
```bash
git clone https://github.com/Rohit-code07/MedoraX.git
cd MedoraX
```

### 2. Configure Backend Service
Navigate to the Spring Boot project directory:
```bash
cd backend/medicineRemainder/medicineRemainder
```

Configure `src/main/resources/application.properties` (or export environment variables):
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/medorax_db?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Frontend Origin URL
app.frontend.url=http://localhost:5173

# Gemini AI API Key
gemini.api.key=YOUR_GEMINI_API_KEY

# Google OAuth2 Credentials
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=email,profile
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google
```

Compile and run the Spring Boot server:
```bash
./mvnw spring-boot:run
```
The backend server will start on `http://localhost:8080`.

### 3. Configure Frontend Client
In a new terminal window, navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment

### Frontend Deployment (Vercel)
The project includes a root `vercel.json` and `frontend/public/vercel.json` configuring Single Page Application rewrites so all route requests (`/auth`, `/dashboard`, `/analytics`, `/timeline`) route back to `index.html`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend Deployment (Render / Docker)
The Spring Boot backend can be deployed using the provided `Dockerfile` or Maven build pack on Render:
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/medicineRemainder-0.0.1-SNAPSHOT.jar`

---

## 📜 License & Acknowledgements

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **[Rohit Verma](https://github.com/Rohit-code07)**.
