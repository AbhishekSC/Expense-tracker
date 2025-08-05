Expense Tracker (MERN Stack)

This is a full-stack Expense Tracker web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The app features role-based authentication for Parents and Children, allowing budget management and transaction tracking.

## 🚀 Features

### Parent Capabilities:

- Create and manage child accounts

- Set monthly budgets per child and per category

- View each child's transaction history and budget usage

### Child Capabilities:

- Add, edit, and delete their own transactions

- View assigned monthly budgets and limits

- Alerts on nearing or exceeding budget

### Tech Stack:

- **Backend**: Node.js, Express.js, MongoDB, JWT

- **Frontend**: React.js, Redux Toolkit, React Router, Axios (Work in progress)

---

## 🔗 Postman Collection
- To easily access and test the API endpoints with payloads, use the Postman collection below:
- 👉 Expense Tracker API Collection - Postman
- ⚠️ https://tinyurl.com/y636xpwd
### This collection contains:
- • Auth (Signup/Login)
- • Child & Parent APIs
- • Budget and Transaction APIs
- • Dashboard data

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash

git clone https://github.com/your-username/expense-tracker.git

cd expense-tracker

```

### 2. Backend Setup

```bash

cd server

npm install

```

#### ➕ Create a `.env` file inside `server/` with the following:

```

PORT=5001

MONGO_URI=mongodb://localhost:27017/yourdbname

JWT_SECRET=your_jwt_secret_key

```

#### Start the backend server:

```bash

npm run dev

```

### 3. Frontend Setup (Work in progress)

```bash

cd ../client

npm install

```

#### Start the frontend: (Work in progress)

```bash

npm start

```

---

## 📂 Folder Structure

```

/server         - Node.js Express backend

/client         - React frontend

```

---

## 🧪 Bonus Features

- Export transactions to CSV (optional)

---

## 📝 Deliverables

- GitHub repo with source code

- README with:

  - Setup instructions

  - Any assumptions or extra features

---

## ⏱ Timeline

- Suggested time to complete: **3 days**
 
