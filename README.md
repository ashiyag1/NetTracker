# NetTrack: Secure IT Asset Registry & Ticket Manager

NetTrack is a deployment-ready, full-stack MERN (MongoDB, Express, React, Node.js) web application built for IT infrastructure firms like **MVD Technologies** to manage hardware assets deployed across client office environments.

This system replaces manual, error-prone spreadsheet tracking with a highly secure, real-time digital register featuring **Role-Based Access Control (RBAC)**, **Multi-Tenant Data Isolation**, and **Automated Maintenance Triggers**.

---

## 🚀 Enterprise Features

1.  **Role-Based Access Control (RBAC):**
    *   `admin`: Full authority to create, edit, view, and delete hardware records.
    *   `technician`: Authority to add and edit records (resolving tickets), but cannot delete records.
    *   `client`: Read-only access to their inventory. They cannot add, edit, or delete items.
2.  **Google OAuth 2.0 Integration (Login with Google):**
    *   Full support for passwordless social authentication. Features Google Identity Services on the frontend and secure Google Tokeninfo validation on the backend.
    *   *Security Rule:* New Google sign-ins are automatically registered as `client` users mapped to `MVD Headquarters` to prevent unauthorized admin access.
3.  **Multi-Tenant Data Partitioning:**
    *   Strict security boundaries. Clients logged into the portal can **only view assets installed at their specific company** (e.g. HDFC client users cannot see Cisco devices). Admins/Technicians maintain visibility across the entire multi-client register.
4.  **MyGate-style Issue Reporting:**
    *   Clients have a single active action: **`Report Issue`**. Clicking this sends a sanitized request to the backend that flags the device as **`Broken`** and freezes other fields. Technicians are immediately notified on their dashboard and mark it back to **`Active`** upon resolution.
5.  **Vercel Cron Job Warranty Scanner:**
    *   An automated, time-based scheduler running every night at 12:00 AM. It queries the database for devices whose manufacturer warranties are expiring in 30 days and logs them for replacement alerts.
6.  **Audit-Ready CSV Export:**
    *   One-click client-side export allows administrators to download the currently filtered list of inventory directly into standard CSV spreadsheets.


---

## 🛠️ Technology Stack

*   **Frontend:** React.js (Vite compiler) + Tailwind CSS v4 compiler (modern CSS imports, `@tailwindcss/vite` plugin).
*   **Backend:** Node.js + Express.js (Refactored completely to modern **ES6 ES Modules**).
*   **Database:** MongoDB Atlas (Mongoose ODM).
*   **Authentication & Tokens:** Edge-compatible **`jose`** library (TextEncoder-based JWT signature signing and verification).
*   **Security:** Password hashing via `bcryptjs`.

---

## 📂 Project Structure

```text
NetTrack/
├── Backend/                 # Express Server & DB connection (ES Modules)
│   ├── middleware/          # Security checks (authMiddleware.js with protect & authorize)
│   ├── models/              # Mongoose Schemas (Device.js, User.js)
│   ├── routes/              # API Endpoints (deviceRoutes.js, authRoutes.js, cronRoutes.js)
│   ├── security-audit.js    # Security integration test suite (10/10 tests passed)
│   ├── vercel.json          # Serverless routing & Cron Job schedules
│   ├── server.js            # Node server entry point
│   └── .env                 # Port, MongoDB URI, and secrets (gitignored)
│
├── frontend/                # React Vite client
│   ├── src/
│   │   ├── assets/          # Static assets (hero.jpg backdrop)
│   │   ├── components/      # Stats, DeviceTable, AddDeviceModal, Login, Landing, ExtraTabs
│   │   ├── App.jsx          # Root view controller & global state
│   │   └── main.jsx         # React DOM renderer
│   └── vite.config.js       # Vite configuration
│
├── package.json             # Root npm scripts & concurrently configuration
└── README.md                # Main documentation
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

6.  **Run Security Audits:**
    Verify your API security boundaries (JWT checks, RBAC restrictions, and data partitioning) by running our security test script from the root directory:
    ```bash
    npm run audit
    ```


