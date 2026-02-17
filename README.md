# 🎓 MUJ EVENTS  
### Centralized University Event Management Platform  

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)
![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-blue)
![Status](https://img.shields.io/badge/Project-Active-success)

---

## 📌 Overview

MUJ EVENTS is a full-stack web application developed under Project Based Learning (PBL-3) at Manipal University Jaipur.

The platform provides a centralized digital system for managing university events, student registrations, and club activities.

It eliminates fragmented communication methods such as WhatsApp groups, emails, and posters by replacing them with a secure and scalable web-based solution.

---

## 🚀 Features

### 👤 User Features

- Secure MUJ email-based authentication using Supabase Auth  
- User registration and login  
- Browse upcoming university events  
- View detailed event information  
- Real-time event registration  
- Participation tracking  
- Fully responsive UI (Mobile + Desktop)  

---

### 🏫 Organizer Features

- Event creation and management  
- Participant tracking  
- Database-driven insights  
- Secure backend API architecture  
- Structured event capacity management  

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React.js  
- React Router  
- CSS3  
- JavaScript (ES6+)  

### ⚙️ Backend
- Node.js  
- Express.js  
- RESTful APIs  
- Environment-based configuration (.env)  

### 🗄️ Database & Authentication
- Supabase (PostgreSQL)  
- Supabase Auth (Email-based login)  
- Real-time database updates  

### 🧪 Tools & Deployment
- Git & GitHub  
- Postman (API Testing)  
- Netlify (Frontend Deployment – Planned)  
- Render / Heroku (Backend Deployment – Planned)  

---

## 🗂️ Project Structure

```
muj-events/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── app.js
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/muj-events.git
cd muj-events
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npx nodemon app.js
```

Server runs at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

⚠️ Do NOT push `.env` to GitHub.  
Add this to `.gitignore`:

```
backend/.env
```

---

## 📊 Database Design

### 🔹 profiles
- user_id (Primary Key)  
- name  
- email  
- created_at  

### 🔹 events
- event_id (Primary Key)  
- title  
- description  
- date  
- location  
- capacity  

### 🔹 clubs
- club_id (Primary Key)  
- name  
- description  

### 🔹 bookings
- booking_id (Primary Key)  
- user_id (Foreign Key)  
- event_id (Foreign Key)  
- registration_timestamp  

---

## 🧪 Testing

- Functional Testing  
- API Testing (Postman / curl)  
- Cross-browser Testing  
- Security Testing (JWT + Email Validation)  
- Performance Testing  

---

## 📈 Future Enhancements

- Admin Dashboard  
- Email Notifications   
- Waitlist System  
- Media Uploads (Supabase Storage)  
- Event Analytics Dashboard  

---

## 🎯 Project Impact

MUJ EVENTS improves:

- Student engagement  
- Event visibility  
- Registration efficiency  
- Organizer workflow management  

The system is modular, scalable, and cloud-deployment ready.

---

## 👩‍💻 Authors

Ishika  
Registration No: 23FE10CSE00102  

Arshi Mathur  
Registration No: 23FE10CSE00002  

Department of Computer Science & Engineering  
Manipal University Jaipur  


---

⭐ If you found this project helpful, don’t forget to star the repository!

