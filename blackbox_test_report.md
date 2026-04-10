# Blackbox Test Cases Report

**Project:** SDP 3 Backend
**Role:** Senior Software Tester
**Date:** April 10, 2026

## 1. Introduction
This document contains blackbox test cases for the SDP 3 Backend API. The testing focuses on functional requirements, input validation, and security (Role-Based Access Control) without internal knowledge of the code implementation.

---

## 2. Test Cases

### 2.1 Authentication & Profile Module (`/api/auth`)

| TC ID | Feature | Description | Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| AUTH-01 | Register | Successful registration with valid data | Valid name, user_id, email, password, dept, intake, section | 201 Created, "User registered successfully" |
| AUTH-02 | Register | Registration with missing required fields | Missing 'email' or 'password' | 400 Bad Request, "Required fields are missing" |
| AUTH-03 | Register | Registration with invalid email format | "invalid-email" | 422 Unprocessable Entity, "Invalid email address" |
| AUTH-04 | Register | Registration with weak password | "12345" | 422 Unprocessable Entity, Password validation error |
| AUTH-05 | Register | Registration with existing email/user_id | Already registered data | 409 Conflict, "User already exists" |
| AUTH-06 | Login | Successful login | Valid email and password | 200 OK, User object + Auth Cookie |
| AUTH-07 | Login | Login with incorrect password | Valid email, wrong password | 401 Unauthorized, "Invalid email or password" |
| AUTH-08 | Profile | Access profile while logged in | Valid JWT/Cookie | 200 OK, Current user data |
| AUTH-09 | Profile | Access profile while logged out | No token | 401 Unauthorized |
| AUTH-10 | Password | Change password successfully | Correct old password, matching new/confirm passwords | 200 OK, "Password changed successfully" |
| AUTH-11 | Update | Update profile with image | Multipart/form-data with image | 200 OK, Updated user profile |

### 2.2 Suggestions Module (`/api/suggestions`)

| TC ID | Feature | Description | Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| SUG-01 | Create | Create suggestion with valid data | Course data + file attachment | 201 Created |
| SUG-02 | Vote | Vote for a suggestion (first time) | SuggestionID | 200 OK, stars count incremented |
| SUG-03 | Vote | Vote for the same suggestion twice | Same SuggestionID | 400 Bad Request, "User has already voted" |
| SUG-04 | AI | Get AI Analysis for suggestion | Suggestion content | 200 OK, AI generated response |
| SUG-05 | Delete | Delete own suggestion | Owner's token | 200 OK |
| SUG-06 | Delete | Delete someone else's suggestion | Other user's token | 403 Forbidden |

### 2.3 Feedback Module (`/api/feedback`)

| TC ID | Feature | Description | Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| FEED-01 | Submit | Submit feedback with valid data | category, subject, message | 201 Created |
| FEED-02 | View | Admin viewing all feedbacks | Admin token | 200 OK, List of feedbacks |
| FEED-03 | View | Student viewing all feedbacks | Student token | 403 Forbidden |

### 2.4 Administration & Management (`/api/manage`)

| TC ID | Feature | Description | Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| ADMIN-01 | Users | Get all users (Admin) | Admin token | 200 OK, List of all users |
| ADMIN-02 | Users | Get all users (Student) | Student token | 403 Forbidden |
| ADMIN-03 | Update | Admin updating user role | UserID, new role "mod" | 200 OK |
| ADMIN-04 | Analytics| View system analytics | Admin/Teacher token | 200 OK, Analytics data |
| ADMIN-05 | Suggest| Admin reject a suggestion | SuggestionID, status="reject" | 200 OK |

### 2.5 Subscription Module (`/api/subsc`)

| TC ID | Feature | Description | Inputs | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| SUB-01 | Create | Admin create subscription | valid planId | 201 Created |
| SUB-02 | Delete | Admin delete subscription | subscription id | 200 OK |
| SUB-03 | Get | View subscriptions | Any authenticated user | 200 OK |

---

## 3. Conclusion
These test cases cover the primary happy paths and edge cases for the SDP 3 Backend. Execution of these tests ensures that the API maintains integrity across user roles and data validation layers.
