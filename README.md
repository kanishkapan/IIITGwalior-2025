# Arogya Vault - Digital Healthcare Management System for Educational Institutions

"The absence of a centralized healthcare management system in educational institutions for managing student health records leads to delays in processing medical leave requests and restricted access to student health records. This impacts timely decision-making and efficient healthcare service delivery."

Our aim is to make a Healthcare Management System to reduce inefficiencies caused due to paperwork, increase accessiblity for student and create a one-stop healthcare solution targeted for college/school going students

## Features
- Health Record Management – Securely store, search, and retrieve health records with keyword-based search.
- Appointment Scheduling – Book doctor consultations through the platform with in-app video calls.
- Seamless Leave Application – Apply for leave effortlessly with a paperless, online system.
- Voice-Enabled Assistance – Book appointments and apply for leave using voice commands.
- Real-Time Notifications – Stay updated with alerts and reminders for appointments and leave requests.
- AI-Powered Symptom Diagnosis – Get instant health insights with an AI bot that analyzes symptoms.
- AI Bots for Assistance – Dedicated AI bots to handle medical leave concerns and appointment queries.
- Blockchain-Based Certificate Storage – Ensure tamper-proof medical certificates using the Polygon blockchain.

## Project Setup (Local Development)

This guide provides step-by-step instructions for setting up the project locally. The project consists of separate frontend and backend servers.

## Prerequisites
Make sure you have the following installed:
- Node.js (latest LTS version recommended)
- npm (comes with Node.js)
- MongoDB (local or cloud instance)
- Python (latest version)

## Technologies Used

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- AI Server: Python, Flask
- IDE: VS Code, PyCharm

## Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm i
   ```
3. Create a `.env` file in the `frontend` directory and add the following:
   ```env
   VITE_API_URL=<YOUR_BACKEND_URL>
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm i
   ```
3. Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=<YOUR_PORT>
   MONGO_URI=<YOUR_MONGO_URI>
   JWT_SECRET=<YOUR_JWT_SECRET>
   
   # Cloudinary
   API_KEY=<YOUR_CLOUDINARY_API_KEY>
   API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
   CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
   
   # Gemini API
   GEMINI_API=<YOUR_GEMINI_API_KEY>

   # Email id to send Email Notifications
   EMAIL_USER=<YOUR_EMAIL_ID>
   EMAIL_PASS=<YOUR_PASSWORD>
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

## AI Setup
1. Navigate to the backend directory:
   ```sh
   cd backend/ai
   ```
2. Install dependencies:
   ```sh
   python -r requirements.txt
   ```
3. Start the ai server :
   ```sh
   python app.py
   ```


## Running the Project
Ensure all three servers (frontend, backend, and AI) are running simultaneously. The frontend will communicate with the backend via the API URL specified in `.env`.
You're now set up to develop and test the project locally!

