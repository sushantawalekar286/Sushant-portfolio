# Modern MERN Stack Developer Portfolio 🚀

A high-performance, modern, and secure full-stack Developer Portfolio built using React 19, Vite, Tailwind CSS, Framer Motion, Node.js, Express, and MongoDB Atlas. It features a stunning glassmorphic UI, responsive layouts, a fully integrated visitor counter, automatic email notifications, public API integrations, and a powerful, protected Admin Dashboard for CRUD management of all content.

---

## 🏗️ Architecture & Features

### Frontend (SPA)
- **Vite & React 19**: Lightning-fast builds and state-of-the-art virtual DOM rendering.
- **Tailwind CSS & Glassmorphism**: Premium responsive styling with backdrop blurs, radial gradients, and dark/light theme switching.
- **Zustand & React Query**: Clean global UI state (Theme, Auth) and query caching with auto-token-refreshes.
- **Framer Motion**: Fluid timeline fades, modal springs, typing loops, and button hover micro-interactions.
- **Forms & Notifiers**: Structured data validations using `react-hook-form` and colored alerts via `react-toastify`.

### Backend (REST API)
- **Node.js & Express (ES6)**: Modular, route-split architecture using ES Modules.
- **JWT Session Security**: Access (15m) and Refresh (7d) tokens stored in secure `HttpOnly` cookie wrappers.
- **Cloudinary Storage**: Direct uploading and deleting of media files (photos, resumes, certificates) using stream pipes.
- **Rate Limiters & Helmet**: Protects routes against brute-force attacks and scans header parameters for vulnerabilities.
- **Database Seeder**: Populates all categories, default hero values, social items, and a default admin credentials account on first boot.

---

## 📁 Repository Directory Structure

```
portfolio/
├── frontend/                # Vite React 19 Client
│   ├── src/
│   │   ├── api/             # Axios configs and interceptors
│   │   ├── components/      # UI Cards, Skeletons, Navbar, Footer
│   │   ├── pages/           # Landing sections and Admin dashboard manager views
│   │   ├── layouts/         # Public & Protected Admin wraps
│   │   ├── store/           # Zustand states (Auth, Theme)
│   │   ├── routes/          # Code-splitted lazy routers
│   │   ├── utils/           # Icon resolvers and helper utilities
│   │   └── App.jsx          # Providers & Main entry
│   └── Dockerfile           # Nginx SPA multi-stage builder
│
├── backend/                 # Node.js Express REST API Server
│   ├── config/              # MongoDB and Cloudinary setups
│   ├── controllers/         # Request controllers (CRUD logic)
│   ├── middleware/          # JWT check guards, rate-limiters, logger
│   ├── models/              # Mongoose database schemas
│   ├── routes/              # Express API route endpoints
│   ├── validators/          # Input checking rules schemas
│   ├── server.js            # Database initializer & server listen
│   └── Dockerfile           # Production Node build image
│
├── .github/workflows/       # GitHub Actions automated lint & build checks
├── docker-compose.yml       # Docker orchestrator mapping all containers
└── README.md                # General user setup documentation
```

---

## ⚙️ Environment Configurations (`.env`)

Create a `.env` file inside `backend/` and populate it with the following configurations:

```env
# Server configs
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://127.0.5.1:27017/portfolioDB   # Use MongoDB Atlas string in production

# Security
JWT_ACCESS_SECRET=your_jwt_access_secret_key_change_me
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_me
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary uploads (Obtained from Cloudinary Console dashboard)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP Email alerts (E.g. Gmail App passwords)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_gmail_app_password
NOTIFICATION_EMAIL=recipient_email@gmail.com

# First-time seeder account details
INITIAL_ADMIN_USER=admin
INITIAL_ADMIN_PASS=admin123
INITIAL_ADMIN_EMAIL=admin@example.com
```

Create a `.env` file inside `frontend/` and configure:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Local Development Setup

### Prerequisite
Ensure you have **Node.js (v18+)** and a local **MongoDB** database running.

1. **Clone the repository** and navigate to root:
   ```bash
   cd portfolio
   ```

2. **Launch the Backend API Server**:
   ```bash
   cd backend
   # Environment settings
   cp .env.example .env # or copy configurations listed above
   # Run server in dev mode (nodemon)
   npm run dev
   ```

3. **Launch the Frontend Client**:
   ```bash
   cd ../frontend
   # Configure environment API target
   echo VITE_API_URL=http://localhost:5000/api > .env
   # Start Vite dev server
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Sign In to Dashboard**:
   - Navigate to `/admin/login`
   - Sign in using seeded credentials: Username: `admin`, Password: `admin123`
   - Immediately navigate to **Config Settings** to change the password and update social anchors.

---

## 🐳 Docker Deployment (Compose)

Build and run all services (Frontend, Backend, and MongoDB Database volume) with a single command from the root folder:

```bash
docker-compose up --build
```
- Frontend will be reachable on [http://localhost:80](http://localhost:80)
- Backend REST API will run on [http://localhost:5000/api](http://localhost:5000/api)
- MongoDB daemon mounts on standard container port `27017`

---

## 📑 REST API Documentation

### 🔓 Public Endpoints
| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| **GET** | `/api/settings/hero` | Retrieve Hero configs & social links |
| **GET** | `/api/settings/about` | Retrieve Bio paragraphs and counters |
| **GET** | `/api/settings/visitor-count` | Fetch visitor hits counts |
| **GET** | `/api/projects` | Query paginated projects (filters: search, category, sort) |
| **GET** | `/api/skills` | List skills grouped by categories |
| **GET** | `/api/experiences` | Fetch work history timeline |
| **GET** | `/api/educations` | Fetch academic degrees |
| **GET** | `/api/certificates` | Fetch certificates checklist |
| **GET** | `/api/achievements` | Fetch list of honors and awards |
| **GET** | `/api/resumes/active` | Retrieve link to active resume document |
| **POST** | `/api/messages` | Submit contact form inquiry (emails alert admin) |

### 🔐 Protected Admin Endpoints (JWT Guarded)
| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Log in and receive access/refresh credentials |
| **POST** | `/api/auth/refresh` | Renew expired Access tokens |
| **POST** | `/api/auth/logout` | End session and clear cookies |
| **PUT** | `/api/auth/profile` | Update admin username, email, and password |
| **GET** | `/api/settings/stats` | Compile dashboard aggregates & view graphs |
| **POST** | `/api/projects` | Upload image banner and create project |
| **PUT** | `/api/projects/:id` | Update project parameters |
| **DELETE** | `/api/projects/:id` | Delete project and clean up Cloudinary asset |
| **POST** | `/api/skills` | Create skill with name, level, and logo |
| **DELETE** | `/api/skills/:id` | Remove skill from dashboard |
| **POST** | `/api/resumes` | Upload new PDF resume and register label |
| **PUT** | `/api/resumes/:id/active` | Select active resume reference |
| **GET** | `/api/messages` | List all contact form inbox messages |
| **PUT** | `/api/messages/:id/read` | Mark message status as read |
| **DELETE** | `/api/messages/:id` | Delete message |

---

## ☁️ Deployment Guidelines

- **Frontend**: SPA builds compiles to a flat `dist/` index package. It can be easily deployed to **Vercel**, **Netlify**, or **GitHub Pages** by setting the output directory to `dist` and redirect mapping rules (`/* /index.html 200` on netlify/vercel configuration).
- **Backend API**: Can be hosted on **Render.com**, **Railway.app**, or **Heroku** by connecting the GitHub repository, setting environment variables, and defining the start command `node server.js`.
- **Database**: Configure a free cloud cluster on **MongoDB Atlas**, whitelist server IP addresses, and set the connection link as `MONGO_URI` in the backend dashboard environments.
