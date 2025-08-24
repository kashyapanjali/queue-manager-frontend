# Queue Manager Frontend

A React-based frontend application for managing queues, tokens, and analytics.  
This project is built with **React**, **Context API**, and **React Router**, and styled using **CSS** and **Lucide Icons**.

---

## Features

- User authentication (login)
- Create and manage multiple queues
- Assign and complete tokens
- Real-time dashboard with analytics:
  - Average wait time
  - Total tokens
  - Waiting / Serving / Completed counts
- Clean and responsive UI

---

## Tech Stack

- **React** (with hooks & context API)
- **React Router v6**
- **Axios** (for API calls)
- **Lucide-react** (icons)
- **CSS Modules** / custom styles

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/queue-manager-frontend.git
   cd queue-manager-frontend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

The app will run at **[http://localhost:3000](http://localhost:3000)**

---

## Project Structure

```
src/
│── components/       # Reusable UI components (Login, Dashboard, QueueList, etc.)
│── styles/           # CSS files
│── App.js            # Main app router
│── index.js          # Entry point
```

---

## Available Scripts

* `npm start` → Run the app in development
* `npm run build` → Build production-ready app
* `npm test` → Run tests (if added)

---

## Screens

* **Login Page** → Authenticate user
* **Dashboard** → View analytics
* **Queue Management** → Assign & complete tokens

---




