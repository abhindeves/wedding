# Deployment Guide: Forever Captured

This guide provides instructions on how to deploy the "Forever Captured" Next.js application to Vercel.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Vercel Account:** A Vercel account (free tier is sufficient for testing).
2.  **GitHub Account:** A GitHub account with the project repository.
3.  **MongoDB Atlas Account:** A MongoDB Atlas account with a cluster set up.
4.  **Firebase Project:** A Firebase project with Firebase Storage enabled.

## Step 1: Set up MongoDB Atlas

1.  **Create a Cluster:** If you don't have one, create a new MongoDB Atlas cluster.
2.  **Create a Database User:** Create a database user with read and write access to your database.
3.  **Allow Network Access:** Configure network access to allow connections from anywhere (for testing) or specific IP addresses/Vercel's IP ranges for production.
4.  **Get Connection String:** Obtain your MongoDB connection string. It will look something like:
    `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`

## Step 2: Set up Firebase Storage

1.  **Create a Firebase Project:** If you don't have one, create a new Firebase project.
2.  **Enable Firebase Storage:** In your Firebase project, navigate to "Storage" and enable it.
3.  **Configure Storage Rules:** Update your Firebase Storage rules to allow read and write access. For testing, you can use:

    ```firebase
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read, write: if true; // ⚠️ Open access for testing only. Restrict in production!
        }
      }
    }
    ```
    **Important:** For production, you should implement more secure rules based on Firebase Authentication.
4.  **Get Firebase Configuration:** Go to "Project settings" (the gear icon next to "Project overview"). Under "Your apps", select your web app and copy the Firebase SDK snippet (the `firebaseConfig` object).

## Step 3: Prepare Your Project for Deployment

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env.local` file:**
    Create a file named `.env.local` in the root of your project and add the following environment variables. Replace the placeholder values with your actual credentials obtained from MongoDB Atlas and Firebase.

    ```
    MONGODB_URI=your_mongodb_connection_string

    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    ```
    *   `NEXT_PUBLIC_` prefix is crucial for variables that need to be exposed to the client-side (like Firebase config).

## Step 4: Deploy to Vercel

1.  **Connect Vercel to GitHub:**
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click "Add New..." -> "Project".
    *   Select your Git provider (GitHub, GitLab, Bitbucket) and connect your repository.
2.  **Import Your Project:**
    *   Choose the repository for "Forever Captured" and click "Import".
3.  **Configure Project Settings:**
    *   **Framework Preset:** Vercel should automatically detect Next.js.
    *   **Root Directory:** Ensure this is correctly set if your project is in a monorepo (otherwise, leave as default).
    *   **Environment Variables:** This is critical. Add all the variables from your `.env.local` file to Vercel's project settings. Go to "Settings" -> "Environment Variables" and add each one individually.
        *   Make sure to mark `NEXT_PUBLIC_` variables as "Development, Preview, Production" if they are needed on the client-side.
4.  **Deploy:**
    *   Once all settings and environment variables are configured, click "Deploy".

Vercel will now build and deploy your application. You can monitor the deployment progress in the Vercel dashboard.

## Post-Deployment

*   After successful deployment, Vercel will provide you with a unique URL for your application.
*   Any subsequent pushes to your connected Git branch will automatically trigger a new deployment on Vercel.

If you encounter any issues, check the deployment logs in Vercel for detailed error messages. Good luck!
