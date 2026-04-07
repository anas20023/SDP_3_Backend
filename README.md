# 🖥️ Suggestion Sharing Platform – Backend

This repository contains the **backend service** of the **Suggestion Sharing Platform**, built with **Node.js, Express.js, and MongoDB**.
It provides RESTful APIs for authentication, suggestion management, user interaction, and admin moderation.

---

## 🚀 Project Overview

The backend acts as the core system responsible for:

* Business logic processing
* Database operations
* Authentication & authorization
* Secure communication with frontend applications

---

## 🎯 Objectives

* Provide secure REST APIs
* Handle authentication and authorization
* Manage suggestions and user interactions
* Enable admin moderation
* Ensure data integrity and security

---

## ✨ Features

### 🔐 Authentication & Users

* User registration and login
* JWT-based authentication
* Role-based access (User / Admin)
* User profile management

### 💡 Suggestions

* Create, read, update, delete suggestions
* Category-based organization
* Search and filtering

### 📈 Engagement

* Like / upvote system
* Comment system
* Suggestion status tracking

### 🛠️ Admin Features

* User management
* Category management
* Suggestion approval / rejection
* Content moderation

### 🔒 Security

* JWT authentication
* Input validation
* Protected routes

---

## 🏗️ Tech Stack

| Layer          | Technology |
| -------------- | ---------- |
| Runtime        | Node.js    |
| Framework      | Express.js |
| Database       | MongoDB    |
| ODM            | Mongoose   |
| Authentication | JWT        |
| API Style      | REST       |
| Environment    | dotenv     |

---

## 📂 Project Structure

```
src/
│
├── config/
│   ├── db.js
│   ├── env.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── suggestion.controller.js
│   ├── admin.controller.js
│
├── models/
│   ├── user.model.js
│   ├── suggestion.model.js
│   ├── category.model.js
│   ├── comment.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── suggestion.routes.js
│   ├── admin.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│
├── utils/
│   ├── response.js
│
├── app.js
├── server.js
```

---

## 🔌 API Overview

### 🔑 Auth Routes

* POST /api/auth/register
* POST /api/auth/login

### 💡 Suggestion Routes

* GET /api/suggestions
* POST /api/suggestions
* PUT /api/suggestions/:id
* DELETE /api/suggestions/:id

### 📊 Engagement

* POST /api/suggestions/:id/like
* POST /api/suggestions/:id/comment

### 🛠️ Admin Routes

* GET /api/admin/users
* PUT /api/admin/suggestions/:id/approve
* DELETE /api/admin/suggestions/:id

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB
* npm or yarn

### Installation

```bash
# Clone repo
git clone https://github.com/your-repo/suggestion_sharing_platform_backend.git

# Go to project folder
cd suggestion_sharing_platform_backend

# Install dependencies
npm install

# Setup env
cp .env.example .env

# Run server
npm run dev
```

---

## 🔐 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/suggestion_platform
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

---

## 🧪 Testing

* Postman / Insomnia for API testing
* Manual endpoint testing
* Error handling validation

---

## ⚠️ Limitations

* No real-time updates
* Manual moderation
* Performance depends on indexing

---

## 🔮 Future Improvements

* WebSocket / real-time updates
* Redis caching
* Advanced analytics
* Microservices architecture

---

## 👥 Team

| Name                     | Role              |
| ------------------------ | ----------------- |
| Anas Ibn Belal           | Backend Developer |
| Miel Mahmud Sifat        | Flutter Developer |
| Ratul Hossain Sadi       | Flutter Developer |
| Abdullah Al Masum Badhon | Tester            |
| Arif Billah Rifat        | UI/UX Designer    |

---

## 📄 License

Educational project. Open-source technologies used.
