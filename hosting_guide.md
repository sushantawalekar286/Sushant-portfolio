# Step-by-Step Hosting Guide for MERN Portfolio

This guide explains how to deploy your portfolio application for free using **MongoDB Atlas** (for the database) and **Render** (for hosting the frontend and backend).

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a new project (e.g. `Portfolio`) and click **Create a Cluster**.
3. Choose the **M0 (Free)** tier cluster, select your nearest provider/region, and click **Create**.
4. In the **Security Quickstart**:
   - Create a database user. Save the **Username** and **Password** (you will need this in your backend environment variables).
   - In the IP Access List, add `0.0.0.0/0` (allows connection from Render servers).
5. Once the cluster is ready, click **Connect** -> **Drivers**.
6. Copy the **Connection String**. It will look similar to this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   *(Replace `<username>` and `<password>` with the database credentials you created in step 4).*

---

## Step 2: Prepare Backend for Deployment

Before deploying, ensure you have these files set up:
- `.gitignore` containing `node_modules` (in both root, backend, and frontend).
- A valid `package.json` in your backend folder with a start script (`node server.js`).

---

## Step 3: Deploy Backend on Render (Web Service)

1. Go to [Render](https://render.com/) and register/login with your GitHub account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`Sushant-portfolio`).
4. Set the following configuration values:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Free**
5. Click **Advanced** and add the following **Environment Variables**:
   - `PORT`: `10000` (or leave empty, Render assigns it automatically)
   - `MONGO_URI`: *(Your MongoDB Atlas connection string from Step 1)*
   - `JWT_SECRET`: *(A long, secure random string for signing admin tokens)*
   - `JWT_REFRESH_SECRET`: *(Another random string for signing refresh tokens)*
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: *(Leave this blank for now, you will update it once the frontend is deployed)*
   - `INITIAL_ADMIN_USER`: *(The username you want for admin, e.g. `admin`)*
   - `INITIAL_ADMIN_PASS`: *(The password you want for admin, e.g. `mysecurepassword123`)*
   - `INITIAL_ADMIN_EMAIL`: *(Your email address, e.g. `yourname@example.com`)*
6. Click **Create Web Service**. Wait for the logs to say `Server running on port 10000` and `Database connected`.
7. Copy the **Web Service URL** generated at the top of the dashboard page (e.g. `https://portfolio-backend-xxxx.onrender.com`). This is your backend URL.

---

## Step 4: Deploy Frontend on Render (Static Site)

1. In the Render Dashboard, click **New +** and select **Static Site**.
2. Connect your GitHub repository.
3. Set the following configuration values:
   - **Name**: `portfolio-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Instance Type**: **Free**
4. Click **Advanced** and add the following **Environment Variables**:
   - `VITE_API_URL`: *(Your Backend Web Service URL followed by `/api`, e.g. `https://portfolio-backend-xxxx.onrender.com/api`)*
5. Scroll down to **Redirects/Rewrites**:
   - Add a rule to handle client-side routing:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
6. Click **Create Static Site**.
7. Once the build completes, copy the **Static Site URL** (e.g. `https://portfolio-frontend-xxxx.onrender.com`). This is your public website URL!

---

## Step 5: Update CORS & Final Settings

1. Go back to your backend **Web Service** on Render -> **Environment**.
2. Update the `FRONTEND_URL` variable to be your frontend static site URL (e.g., `https://portfolio-frontend-xxxx.onrender.com`).
3. Render will automatically redeploy the backend with the updated environment variable to allow your frontend access to the APIs.

---

## Step 6: Log In and Change Admin Password

1. Visit your frontend URL at `https://your-frontend-url.onrender.com/admin`.
2. Log in using the `INITIAL_ADMIN_USER` and `INITIAL_ADMIN_PASS` you configured in Step 3.
3. Once logged in, click **Config Settings** on the sidebar.
4. Select the **Security & Profile** tab.
5. You can update your username, email, and password directly here. Click **Update Credentials** to save.
