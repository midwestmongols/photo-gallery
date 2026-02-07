# Architecture Desision: "Who holds the keys?"

You are asking a very important security question.

The current design is **Option A (Client-Side)**.
You are describing **Option B (Server-Side / Service Account)**.

Here is the difference:

## Option A: Client-Side (Current Plan)
*   **Hosting**: GitHub Pages (Free, Static).
*   **The Logic**: The App runs **in the User's browser**.
*   **How it works**:
    1.  User logs in.
    2.  App asks User: "Can I use *your* hands to put a photo in the Community Box?"
    3.  User says "Yes".
    4.  App uses User's credentials to upload to the Shared Folder.
*   **The Scope**: We use `drive.file`. This limits the app. It **CANNOT** see the User's personal files. It can *only* see files the App created or the specific Community Folder if opened.
*   **Pros**: Free, Easiest Setup, No Server maintenance.
*   **Cons**: User sees a permission screen asking for Drive access.

## Option B: Server-Side Project (What you might want)
*   **Hosting**: Requires a **Backend Server** (Node.js/Python on Render/Heroku/AWS). **Not** just GitHub Pages.
*   **The Logic**: The App sends photos to *Your Server*. *Your Server* talks to Google.
*   **How it works**:
    1.  User logs in (Just for Identity "I am Bat").
    2.  User sends photo to Your Server.
    3.  Your Server (which holds a secret "Service Account Key" for `mim@gmail.com`) uploads the photo.
*   **The Scope**: User *never* gives Drive permission. They just sign in.
*   **Pros**: User never sees "Google Drive" permissions. Feels more "Professional".
*   **Cons**:
    *   **Cost**: You likely have to pay for the server ($7-20/month).
    *   **Complexity**: You must maintain a server, handle file upload streams, and secure the Service Account Key.

## The Verdict
If you want to host on **GitHub Pages (Free)**, you **MUST** use Option A.
We cannot safely put the "Community Account Keys" (Service Account) in the frontend code, because anyone could steal them and delete your entire Drive.

**For a simpler "Community" feel with Option A:**
We can change the scope to just `drive.file`. The permission screen will say: "View and manage Google Drive files and folders that you have opened or created with this app". It sounds much less scary than "Full Drive Access".
