# NetTrack: Secure IT Asset Registry & Ticket Manager

NetTrack is a deployment-ready, full-stack MERN (MongoDB, Express, React, Node.js) web application built for IT infrastructure firms like **MVD Technologies** to manage hardware assets deployed across client office environments.

This system replaces manual, error-prone spreadsheet tracking with a highly secure, real-time digital register featuring **Role-Based Access Control (RBAC)**, **Multi-Tenant Data Isolation**, and **Automated Maintenance Triggers**.

> **Note:** To add screenshots to this README, place your image files (e.g., `dashboard.png`) into the `frontend/public/` folder, and then use this exact syntax right here in the text: 
> `![Dashboard Screenshot](./frontend/public/dashboard.png)`

---

## 🚀 Enterprise Architecture & Features

### 1. Robust MVC Backend Architecture
The Node/Express backend strictly follows the **Model-View-Controller (MVC)** design pattern. All database logic and business rules are decoupled into a dedicated `controllers/` layer, ensuring the HTTP `routes/` layer remains clean, modular, and highly testable.

### 2. Frontend API Service Layer
The React frontend completely abstracts raw network calls away from UI components. A dedicated API Service Layer (`services/api.js`) centralizes all `fetch()` logic, error handling, and `Authorization: Bearer` token injection. 

### 3. Load-Tested Scalability & Client-Side Pagination
The MongoDB database was successfully load-tested with **10,000+ synthetic hardware records**. To maintain perfectly accurate aggregate analytics (Total Active, Broken, Expiring) without crushing browser performance, the React frontend uses **Client-Side UI Pagination**, slicing the 10,000-record array to only render 50 active DOM rows at any given time.

### 4. Role-Based Access Control (RBAC) & Data Isolation
* **`admin`**: Full authority to create, edit, view, and delete hardware records.
* **`technician`**: Authority to add and edit records (resolving tickets), but cannot delete records.
* **`client`**: Strict, multi-tenant data isolation. Clients can **only** view devices installed at their specific company. They are restricted to a single action: flagging a device as "Broken" to report an issue.

### 5. Secure Authentication System
* **30-Day JWT Sessions:** Token-based sessions balanced for high-security and low-friction usability.
* **Google OAuth 2.0:** Passwordless social authentication. New sign-ins are dynamically prompted to select their Client Company during a two-step registration flow.

### 6. Automated Lifecycle Tracking (Serverless Cron)
A Vercel Serverless Cron Job executes a headless script every night at midnight. It securely queries the database (authenticated via `CRON_SECRET`) for devices whose manufacturer warranties are expiring within 30 days, flagging them for immediate hardware replacement.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js (Vite compiler) + Tailwind CSS v4 compiler.
*   **Backend:** Node.js + Express.js (ES6 Modules).
*   **Database:** MongoDB Atlas (Mongoose ODM).
*   **Authentication & Tokens:** Edge-compatible **`jose`** library (JWT signature signing and verification).
*   **Security:** Password hashing via `bcryptjs`.

---

## 📂 Project Structure

```text
NetTrack/
├── api/                     # Vercel Serverless Function entry points
├── Backend/                 # Express Server & DB connection (ES Modules)
│   ├── controllers/         # MVC Business Logic (authController, deviceController)
│   ├── middleware/          # Security checks (authMiddleware.js)
│   ├── models/              # Mongoose Schemas (Device.js, User.js)
│   ├── routes/              # Clean API Endpoints mapped to controllers
│   ├── seed.js              # 10,000 Record Synthetic Data Generator
│   ├── security-audit.js    # Security integration test suite
│   ├── vercel.json          # Serverless routing & Cron Job schedules
│   └── server.js            # Local Node server entry point
│
├── frontend/                # React Vite client
│   ├── src/
│   │   ├── services/        # Centralized API Service Layer (api.js)
│   │   ├── components/      # UI Views (DeviceTable, AddDeviceModal, Login)
│   │   ├── App.jsx          # Root view controller
│   │   └── main.jsx         # React DOM renderer
│   └── vite.config.js       # Vite configuration
│
└── package.json             # Root npm scripts & concurrently configuration
```

---

## 💻 Getting Started

### Prerequisites
*   Node.js (v18+) installed locally.
*   A MongoDB Atlas database cluster setup.

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ashiyag1/NetTracker.git
    cd NetTracker
    ```

2.  **Configure Backend Environment Secrets:**
    Create a `.env` file inside the `Backend/` folder:
    ```env
    MONGO_URI=mongodb+srv://<db_user>:<db_password>@cluster0.ksgy8ak.mongodb.net/nettrack
    PORT=5000
    JWT_SECRET=your_super_secure_jwt_secret_key
    CRON_SECRET=your_vercel_cron_scheduler_passkey
    ```

3.  **Configure Google Sign-In Credentials:**
    *   Go to the Google Cloud Console, create a project, and generate an **OAuth Client ID** for a Web Application.
    *   Set the Authorized JavaScript Origins to `http://localhost:5173`.
    *   Create a `.env` file inside the `frontend/` directory and paste your client ID:
        ```env
        VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
        ```

4.  **Install Dependencies:**
    Run this command in the **root** folder to install the development runner (`concurrently`):
    ```bash
    npm install
    ```
    Then, install backend packages:
    ```bash
    cd Backend && npm install
    ```
    And frontend packages:
    ```bash
    cd ../frontend && npm install
    ```

5.  **Run the Application:**
    Navigate back to the **root** folder and start both servers simultaneously:
    ```bash
    cd ..
    npm run dev
    ```
    *   React Client: `http://localhost:5173`
    *   Express API: `http://localhost:5000`

6.  **Load Test the Database (Optional):**
    To inject 10,000 synthetic devices into your cluster for performance testing:
    ```bash
    cd Backend
    node seed.js
    ```
