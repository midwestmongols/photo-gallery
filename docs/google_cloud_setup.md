# Google Cloud Setup Guide

To build this app, we need permission to talk to Google Drive. This permission comes in the form of a **Client ID**. Here is how to get one, step-by-step.

## Step 1: Create a Project
> [!TIP]
> **Which Google Account?**
> You can use **ANY** Google Account to create this Client ID (e.g., your personal developer account). It does **NOT** have to be the `mim@gmail.com` account. The `mim@gmail.com` account is only needed later to create the Drive Folder.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. In the top bar, click the project dropdown (it might say "Select a project").
4. Click **"New Project"**.
5. Name it `Mim-Gallery` (or anything you like) and click **Create**.
6. Wait a moment, then **select** the new project you just created.

## Step 2: Enable Google Drive API
1. In the search bar at the very top, type **"Google Drive API"**.
2. Click on "Google Drive API" in the Marketplace results.
3. Click the blue **Enable** button.

## Step 3: Configure Consent Screen
1. On the left sidebar (click the hamburger menu ≡ if you don't see it), go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** (this allows any Google user to log in, but during "Testing" mode, you must invite them).
3. Click **Create**.
4. **App Information**:
   - App name: `Mim Gallery`
   - User support email: Select your email.
   - Developer contact info: Enter your email.
5. Click **Save and Continue**.
   - Search for `drive` and select:
     - `.../auth/drive.file` (Required to view/upload files to the app's folder)
     - **Crucial**: You must also select `userinfo.profile` and `userinfo.email`.
   - Click **Update**.
7. Click **Save and Continue**.
8. **Test Users**:
   - Click **Add Users**.
   - Enter your own email address (and anyone else you want to test with right now).
   - Click **Save and Continue**.

## Step 4: Create Credentials (The Client ID)
1. On the left sidebar, click **Credentials**.
2. Click **+ CREATE CREDENTIALS** at the top.
3. Select **OAuth client ID**.
4. **Application type**: Select **Web application**.
5. **Name**: `Mim Web Client`.
6. **Authorized JavaScript origins**:
   - Click **ADD URI**.
   - Type: `http://localhost:5173` (This is for our local development).
   - Click **ADD URI** again.
   - Type: `https://<your-username>.github.io` (Replace `<your-username>` with your actual GitHub username. This is for the live site later).
7. **Authorized redirect URIs**:
   - You can usually leave this blank for the popup flow we are using, or add `http://localhost:5173` and `https://<your-username>.github.io`.
8. Click **Create**.

## Step 5: Copy the Client ID
1. A popup will appear saying "OAuth client created".
2. You will see "Your Client ID" (a long string of random characters ending in `.apps.googleusercontent.com`).
3. **Copy this string**.
4. Paste it into the chat for me!

> [!NOTE]
> You do **not** need the "Client Secret" for this frontend-only app. Just the Client ID.
