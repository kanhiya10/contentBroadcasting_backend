# 📚 Content Broadcasting System

## 🚀 Overview

This system allows teachers to upload subject-based content, which is reviewed by a principal before being scheduled for broadcast. Students can access approved and scheduled content via public APIs.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT
* **File Uploads:** Multer (local storage)
* **Architecture:** Layered (routes → controllers → services → models)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/kanhiya10/contentBroadcasting_backend.git
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
PORT=3000
DATABASE_URL=your_postgres_connection
JWT_SECRET=your_secret_key
```

### 4. Run database

Make sure PostgreSQL is running and create required tables.

### 5. Start server

```bash
npm run dev
```

---

## 📁 Folder Structure

```
src/
  controllers/
  routes/
  services/
  models/
  middlewares/
  utils/
  config/
uploads/
  app.js
  index.js
architecture-notes.txt
```

---

## 🔐 Authentication & Roles

* JWT-based authentication
* Roles:

  * **Teacher** → Upload & schedule content
  * **Principal** → Approve/reject content
  * **Student** → Consume public API

---

## 🔄 Content Lifecycle

```
uploaded → pending → approved / rejected
```

* Rejected content includes a rejection reason
* Approved content is only visible if scheduled and within time window

---

## 📤 APIs

### 🔹 Auth

* `POST /api/users/register`
* `POST /api/users/login`

---

### 🔹 Content (Teacher)

* `POST /api/content/upload`
  Upload content (multipart/form-data)

* `GET /api/content/my-content`
  View own uploaded content

---

### 🔹 Approval (Principal)

* `PATCH /api/content/:id/approve`
  
* `PATCH /api/content/:id/reject`
  
*  PATCH /api/content/
  View all uploaded content or pending status content

---

### 🔹 Scheduling

* `POST /api/content/schedule`
  Assign content to rotation (requires approval)

---

### 🔹 Public API (Student)

* `GET api/content/live/maths`
  Fetch approved + time-valid content
  *(Rotation logic partially implemented)*

---

## 📦 File Upload Rules

* Supported formats: JPG, PNG, GIF
* Max size: 10MB
* Stored locally in `/uploads`

---

## ⚠️ Key Design Decisions

* Separation of concerns: content vs scheduling
* RBAC enforced via middleware
* Stateless rotation logic (computed dynamically)
* Teacher restricted to assigned subjects

---

## 🚧 Current Limitations

* Rotation logic (time-based content switching) not fully implemented
* Public API currently subject-based (not teacher-specific)

---

## ✅ Future Improvements

* Full rotation engine implementation
* Cloud storage (S3) integration
* Caching layer (Redis)
* Queue-based processing (Kafka)

---

## 👨‍💻 Author

Kanhaiya Gandhi
