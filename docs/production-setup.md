# Production Setup Guide

This guide ensures the Photo Gallery app works correctly on GitHub Pages with Google Authentication.

## 1. GitHub Secrets Configuration (Required)

Vite needs environment variables at **build time**. Since we don't commit `.env` files, you must add these to GitHub:

1.  Navigate to your repository: `https://github.com/midwestmongols/photo-gallery`
2.  Go to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret** for each of the following:

| Secret Name | Description |
| :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | Your OAuth 2.0 Client ID from Google Cloud Console |
| `VITE_DRIVE_FOLDER_ID` | The ID of the Google Drive folder to display |

## 2. Google Cloud Console Configuration

To prevent `origin_mismatch` errors, you must authorize your GitHub Pages URL:

1.  Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
2.  Select your OAuth 2.0 Client ID.
3.  **Authorized JavaScript origins**:
    - Add `https://midwestmongols.github.io`
4.  **Authorized redirect URIs**:
    - Add `https://midwestmongols.github.io/photo-gallery/`
5.  Click **Save**.

## 3. GitHub Pages Settings

1.  Go to **Settings** > **Pages**.
2.  Under **Build and deployment** > **Source**, ensure **GitHub Actions** is selected.

## 4. Troubleshooting

- **Direct page refresh 404**: GitHub Pages doesn't support SPA routing out of the box. If you add multiple pages, refreshing on `/photo-gallery/login` might show a 404. Currently, the app is a single-route dashboard.
- **Login fails**: Check the Developer Console (F12) for `idpiframe_initialization_failed`. This usually means the JavaScript Origin isn't matching perfectly in Google Cloud Console.
- **Assets not loading**: Ensure `vite.config.js` has `base: '/photo-gallery/'`.
