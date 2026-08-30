# 🦁 LION GROUP MAHARASHTRA RAJYA (लायन ग्रुप महाराष्ट्र राज्य)

Official public website and REST API system for **LION GROUP MAHARASHTRA RAJYA** — a premier socio-cultural and social-service organization conducting blood donation camps, environmental tree plantation, free health checkups, food relief, and youth empowerment across all 36 districts of Maharashtra.

---

## 🏗️ Architecture & Technology Stack

* **Frontend:** React 18, Vite 5, React Router 6, Axios, Lucide Icons, Custom Lion-Themed CSS design system (Royal Deep Blue `#070D1E` & Gold `#D4AF37`).
* **Backend:** ASP.NET Core Web API (.NET 10 / C#), Entity Framework Core, SQL Server, Dependency Injection, DTOs, UTF-8 Unicode support, Swagger UI.
* **Localization:** Full bilingual Marathi (मराठी) and English support with instant client-side toggle.

---

## 📁 Project Structure

```
LionGroupMaharashtra/
├── backend/
│   └── LionGroup.API/          # ASP.NET Core Web API (.NET 10 / C#)
│       ├── Controllers/        # REST Endpoints (Home, About, Members, Activities, Events, Gallery, Contact)
│       ├── Services/           # Domain business logic & EF Core access
│       ├── Interfaces/         # Service contracts for Dependency Injection
│       ├── Data/               # ApplicationDbContext & DbInitializer (Bilingual seed data)
│       ├── Models/             # Database entities (Member, Designation, Activity, Event, GalleryAlbum, etc.)
│       ├── DTOs/               # Request & response data transfer objects
│       └── Middleware/         # Global Exception Handling Middleware
│
└── frontend/
    └── lion-group-web/         # React + Vite Single Page Application
        ├── src/
        │   ├── components/     # Reusable UI components (Navbar, Footer, Cards, Modal, Spinners)
        │   ├── pages/          # Public pages (Home, About, Leadership, Members, Activities, Events, Gallery, Contact)
        │   ├── context/        # LanguageContext for instant EN/MR switching
        │   ├── services/       # Axios API client modules
        │   └── index.css       # Lion Royal Theme design tokens
        └── package.json
```

---

## 🚀 How to Run Locally

### Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* [Node.js (v18+)](https://nodejs.org/)
* [SQL Server](https://www.microsoft.com/sql-server/) (LocalDB, Express, or standard Developer edition)

---

### Step 1: Start the Backend API

```bash
cd backend/LionGroup.API
dotnet run --launch-profile http
```
* **API Base URL:** `http://localhost:5128`
* **Interactive Swagger UI:** `http://localhost:5128/swagger`

---

### Step 2: Start the Frontend React App

```bash
cd frontend/lion-group-web
npm install
npm run dev
```
* **Frontend Web Application:** `http://localhost:5173`

---

## 🌐 Key Features

1. **Dual Language Toggle:** Instant switching between **मराठी (Marathi Unicode)** and **English**.
2. **Impact Counters:** Live metrics for blood units, trees planted, active members, and beneficiaries.
3. **Core Social Pillars:** Dedicated sections for Blood Donation, Afforestation, Healthcare, and Food Relief.
4. **Leadership & Members Directory:** State Executive Committee roster with search by name and 36 Maharashtra district filters.
5. **Photo Gallery:** Curated albums with fullscreen Lightbox photo viewer.
6. **24x7 Blood Helpline & Contact Form:** Emergency helpline and interactive inquiry submission.

---

## 📄 License
This project is developed for **Lion Group Maharashtra Rajya**. All rights reserved.
