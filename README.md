# NetTrack: IT Device Register

NetTrack is a modern, full-stack MERN (MongoDB, Express, React, Node.js) web application designed for IT infrastructure installation companies to track hardware equipment deployed at client offices. 

This project replaces manual, error-prone spreadsheet tracking with a centralized, real-time digital register.

---

## 🚀 Features

*   **Real-time Metrics Dashboard:** Shows total active devices, broken/inactive devices, and devices with warranties expiring within 30 days.
*   **Dynamic Inventory Table:** A clean, searchable table that displays device details (Name, Type, Client, Status, Location).
*   **Search & Multi-Filters:** Search by name or client and filter by status (Active, Broken, Maintenance) or type (Router, Switch, IP Phone, AV Equipment).
*   **Complete CRUD Operations:** Users can create (add), read (fetch), update (edit), and delete devices directly to/from the database.
*   **Sleek Dark Mode UI:** Built with custom Tailwind CSS v4 and responsive design.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js (Vite compiler) + Tailwind CSS v4
*   **Backend:** Node.js + Express.js
*   **Database:** MongoDB + Mongoose (ODM)
*   **Development Tools:** Concurrently (run frontend & backend together)

---

## 📂 Project Structure

```text
NetTrack/
├── Backend/                 # Express Server & DB connection
│   ├── models/              # Mongoose DB schema (Device.js)
│   ├── routes/              # Express Router API endpoints (deviceRoutes.js)
│   ├── server.js            # Node server entry point
│   └── .env                 # Database credentials (hidden)
│
├── frontend/                # React Vite client
│   ├── src/
│   │   ├── components/      # Reusable UI (Stats.jsx, DeviceTable.jsx, AddDeviceModal.jsx)
│   │   ├── App.jsx          # React state controller & main layout
│   │   └── main.jsx         # React root renderer
│   └── vite.config.js       # Vite configuration
│
├── package.json             # Root npm scripts & concurrently config
└── README.md                # Project documentation
```

---

## 💻 Getting Started

### Prerequisites
*   Node.js installed on your local machine.
*   A MongoDB Atlas connection string.

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ashiyag1/NetTracker.git
    cd NetTracker
    ```

2.  **Configure Backend Environment Secrets:**
    Create a `.env` file inside the `Backend/` folder and add your MongoDB connection string and server port:
    ```env
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.net/nettrack?appName=Cluster0
    PORT=5000
    ```

3.  **Install Dependencies:**
    Run this command in the **root** project directory to install all runner dependencies:
    ```bash
    npm install
    ```
    Then, install backend packages:
    ```bash
    cd Backend && npm install
    ```
    And frontend packages:
    ```bash
    cd ../frontend && npm install && npm install @tailwindcss/vite
    ```

4.  **Run the Application:**
    Go back to the **root** folder and run the unified developer script:
    ```bash
    cd ..
    npm run dev
    ```

    *   Your React app will run on: **`http://localhost:5173`**
    *   Your Backend API will run on: **`http://localhost:5000`**

---

## 💡 Key Coding Concepts Implemented

*   **Cross-Origin Resource Sharing (CORS):** Configured on the backend to allow safe communication between ports `5173` and `5000`.
*   **Asynchronous JavaScript:** Used `async/await` and Promises for non-blocking database queries.
*   **React State & Hooks:** Utilized `useState` for UI changes and `useEffect` for fetching API data when components mount.
*   **Component Composition:** Structured reusable React child components using props to pass data down.
