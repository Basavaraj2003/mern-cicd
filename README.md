# 🚦 Matric-Code

## 📌 Overview

**Matric-Code** is a MERN stack web application that automates code quality and standards compliance analysis. It helps developers and organizations ensure their code meets company-specific coding and architectural standards by validating code during development, testing, and release phases. The app generates detailed reports highlighting critical issues, warnings, and violations-ensuring only clean, compliant code gets deployed.

---

## ✅ Features

- 🧠 Real-time analysis of pasted or uploaded code  
- ⚠️ Detects:
  - Critical errors
  - Standard violations
  - Non-blocking warnings  
- 📊 Detailed, interactive analysis reports  
- 🚫 Blocks deployment if critical issues exist  
- 🧩 Customizable rules and standards  
- 💡 Improves code quality and organizational compliance  

---

## 🛠️ Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Code Analysis:** ESLint with custom linting rules (extendable)  
- **Other Tools:** Prettier, Husky (optional for Git hooks)  

---

## 🚀 Getting Started

### ✅ Prerequisites

- **Node.js** (v14 or later recommended)  
  👉 [Download Node.js](https://nodejs.org/)  
- **MongoDB Atlas Account** or **Local MongoDB**  
  👉 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
  👉 [MongoDB Community Edition](https://www.mongodb.com/try/download/community)  
- **Git** (optional)  
  👉 [Download Git](https://git-scm.com/downloads)  

---

### 🛠️ Installation & Running

1. **Clone the Repository**
```bash
git clone https://github.com/manvithrai24/Matric-Code.git
cd Matric-Code/server
```

2. **Install Backend Dependencies**
```bash
npm install
```


3. **Setup Environment Variables**

Create a `.env` file inside the `server` folder with the following:
```bash
MONGODB_URI=your_mongodb_connection_string_here
PORT=3001
```


🔒 Replace `your_mongodb_connection_string_here` with your actual MongoDB URI.

4. **(Windows Only) Allow Running Scripts in PowerShell**

If you see this error:

```bash
running scripts is disabled on this system
```

Open PowerShell as Administrator and run:
```bash
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Press `Y` and Enter to confirm.

5. **Start the Backend Server**
```bash
npm start
```
Or if you have nodemon installed:
```bash
npm run dev
```

You should see:
```bash
✅ Connected to MongoDB
🚀 Server running on port 3001
```

6. **Verify Backend API**

Open your browser or API tool (Postman) and visit:
```bash
http://localhost:3001/api/analyses
```

You should receive a JSON response (empty if no data).

7. **Run the Frontend**

Open a new terminal, navigate to the frontend folder, then:
```bash
cd ..
npm install
npm start
```
The frontend will open automatically at:
```bash
http://localhost:3000
```

#   m e r n - c i c d  
 