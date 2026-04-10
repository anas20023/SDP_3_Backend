# 🖥️ Suggestion Sharing Platform – Backend

This repository contains the **backend service** of the **Suggestion Sharing Platform**, built with **Node.js, Express.js, and MongoDB**.
It provides RESTful APIs for authentication, suggestion management, user interaction, subscriptions, feedback, and comprehensive admin moderation.

---

## 🚀 Project Overview

The backend acts as the core system responsible for:

* Business logic processing
* Database operations via MongoDB/Mongoose
* Authentication & authorization using JWT
* Cloud storage integration (S3/Cloudflare R2) for media and file attachments
* Secure communication with frontend applications and email notifications

---

## 🎯 Objectives

* Provide secure REST APIs documented with Swagger
* Handle complex role-based authentication and authorization
* Manage suggestions, user interactions, and robust subscriptions
* Enable full admin visibility via dashboards and analytics
* Facilitate real feedback ticketing & automated email flows
* Ensure data integrity and scalability

---

## ✨ Features

### 🔐 Authentication & Users

* User registration and login
* JWT-based security and profile updates (including Cloudflare avatar uploads)
* Role-based access (Student, Teacher, Admin, Mod)
* Change password features

### 💡 Suggestions

* Create, read, update, delete suggestions
* Category-based organization and attachments
* Approval flow for Admins

### 📈 Engagement & Support

* Like / upvote system & real-time tracking
* Subscription plans for premium users / alert downloads
* Dynamic Feedback ticketing system integrating with automatic emails
* In-app analytics

### 🛠️ Admin Features

* Granular user management (Update roles, permissions natively)
* Suggestions bulk management
* Deep dives into platform analytics and activity
* Advanced file management (Uploads using Multer, moderation controls)

---

## 🏗️ Tech Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Runtime        | Node.js                        |
| Framework      | Express.js                     |
| Database       | MongoDB (Mongoose)             |
| Authentication | JWT                            |
| Cloud Storage  | AWS SDK (S3 / Cloudflare R2)   |
| API Documentation| Swagger (swagger-jsdoc & ui)|
| Communications | Nodemailer                     |
| Testing (API)  | Jest, Supertest                |
| Testing (DB)   | MongoDB Memory Server          |
| Testing (Load) | k6                             |

---

## 📂 Project Structure

```text
src/
│
├── config/
│   ├── db.js (MongoDB Connection)
│   ├── swagger.js (API Documentation Specs)
│
├── controllers/
│   ├── auth.controller.js
│   ├── suggestion.controller.js
│   ├── manage.controller.js
│   ├── feedback.controller.js
│   ├── subscription.controller.js
│
├── model/
│   ├── users.js
│   ├── suggestions.js
│   ├── Feedbacks.js
│   ├── subscription.js
│   ├── subscriptionPlan.js
│
├── routes/
│   ├── index.js (API Router aggregations, sets /api prefix)
│   ├── auth.routes.js (/api/auth)
│   ├── manage.routes.js (/api/manage)
│   ├── suggestion.routes.js (/api/suggestions)
│   ├── feedback.routes.js (/api/feedback)
│   ├── subscription.routes.js (/api/subsc)
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── requireRole.middleware.js
│   ├── upload.middleware.js (Multer)
│
├── services/ & templates/
│   ├── logger.service.js
│   ├── (Email Templates & Services)
│
├── tests/
│   ├── auth.test.js (Auth flow tests)
│   ├── suggestions.test.js (Submission/Voting tests)
│   ├── setup.js (Memory Server global setup)
│   ├── stress_test.js (k6 load testing script)
│
├── app.js / index.js (Main Entry Points)
```

---

## 🔌 API Overview

Explore full interactive documentation locally by firing up the server and visiting: `/api-docs`

**Sample Endpoints:**

**Authentication (`/api/auth`)**
* `POST /auth/register` : Create Account
* `POST /auth/login` : Authenticate User
* `GET /auth/me` : Get logged in user profile
* `PUT /auth/update-profile` : Modify user info / profile picture
* `POST /auth/change-password` : Update security credentials

**Suggestions (`/api/suggestions`)**
* `GET /suggestions` : View all verified suggestions
* `POST /suggestions` : Upload a new suggestion doc

**Manage / Admin (`/api/manage`)**
* `GET /manage/users` : Retrieve user pools by role
* `PUT /manage/users/:id` : Restrict/Update user capabilities
* `GET /manage/analytics` : Fetch system stats

**Feedbacks (`/api/feedback`)**
* `POST /feedback` : Log a complaint/suggestion (triggers email flows)

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB Instance (Local/Atlas)
* Application credentials for remote S3 buckets / Cloudflare R2 / Email SMTP

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

# Run server in dev mode
npm run dev
```

---

## 🔐 Environment Variables

Ensure the following variables are set in your `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_cluster_uri
JWT_SECRET=your_secret_key
# Email service options
SMTP_HOST=your_host
SMTP_PASS=your_pass
# Cloudflare S3 configs for images
S3_BUCKET=bucket_name
S3_ENDPOINT=your_r2_endpoint
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx

# Testing
DATABASE_TEST_URL=mongodb://localhost:27017/sdp3_test
```

---

## 🧪 Testing

The project uses a two-tier testing strategy: **Automated Blackbox Testing** for logic/integration and **Stress Testing** for performance.

### 1. Automated API Tests (Jest)
Located in `tests/`, these tests use `mongodb-memory-server` to provide a dedicated, isolated database environment.

**Test Cases Covered:**
- **Authentication**: Successful registration (mocked student verification), valid/invalid login, and credential validation (regex).
- **Suggestions**: Public viewing of suggestions, protected creation, and unauthorized voting constraints.

**Run Instructions:**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### 2. Stress Testing (k6)
Located at `tests/stress_test.js`, this script simulates real-world load.

**Scenarios:**
- **Ramp-up**: 1 to 20 users over 30s.
- **Sustained Load**: 20 concurrent users for 1 minute.
- **Endpoints**: `GET /api/suggestions` and `POST /api/auth/login`.

**Run Instructions:**
*(Requires [k6](https://k6.io/docs/getting-started/installation/) installed on your machine)*
```bash
k6 run tests/stress_test.js
```

### 3. API Documentation (Swagger)
Explore interactive documentation at: `http://localhost:5000/api-docs`

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
