# Mim - Google Drive Photo Gallery

## Goal Description
Build a "Community Memory" web application for a Mongolian community to share photos and videos from the past year. The app will allow users to view, upload, and **comment** on memories. All data (including comments) will be stored in Google Drive to maintain a single permission model.

## User Review Required
> [!IMPORTANT]
> **Google Cloud Console Setup**: Still strictly required. Please provide a **Client ID** for a Web Application with the following scopes enabled:
> - `https://www.googleapis.com/auth/drive.readonly`
> - `https://www.googleapis.com/auth/userinfo.profile`

> [!IMPORTANT]
> **Shared Folder ID**: You must create a folder in the `mim@gmail.com` Drive and **share** it with your community members (or "Anyone with the link" if suitable).
> - I will need the **Folder ID** (the string of characters at the end of the folder's URL) to hardcode into the app so everyone sees the same content.

> [!NOTE]
> **Comments Strategy**: We will use the native **Google Drive Comments API**. This means comments made in the app will appear on the file if viewed in Google Drive, and vice versa.

## Proposed Changes

### Tech Stack
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS. Design will feature "Glassmorphism" with a warm, welcoming community feel.
- **State Management**: React Context
- **Google Integration**: 
    - `@react-oauth/google`
    - Google Drive API v3 (Files & Comments resources)

### Project Structure
```text
mim/
├── src/
│   ├── components/
│   │   ├── AuthProvider.jsx
│   │   ├── MemoryGrid.jsx       <-- Renamed from PhotoGrid
│   │   ├── MemoryItem.jsx       <-- Renamed from PhotoItem (handles Video too)
│   │   ├── CommentSection.jsx   <-- NEW
│   │   ├── UploadButton.jsx
│   │   └── Login.jsx
│   ├── hooks/
│   │   ├── useDrive.js
│   │   └── useComments.js       <-- NEW
│   ├── services/
│   │   └── googleDrive.js
│   ├── App.jsx
│   └── index.css
├── index.html
└── vite.config.js
```

### Components

#### [NEW] [App.jsx](file:///c:/Users/Dalai/dev/tmp/mim/src/App.jsx)
Main entry point.

#### [NEW] [AuthProvider.jsx](file:///c:/Users/Dalai/dev/tmp/mim/src/components/AuthProvider.jsx)
Wraps the app with `GoogleOAuthProvider`.

#### [NEW] [Login.jsx](file:///c:/Users/Dalai/dev/tmp/mim/src/components/Login.jsx)
Login card.

#### [NEW] [MemoryGrid.jsx](file:///c:/Users/Dalai/dev/tmp/mim/src/components/MemoryGrid.jsx)
Displays photos, videos, AND folders.
- **Folders**: Render as clickable albums. Clicking enters the folder.
- **Breadcrumbs**: Shows current path / navigation to go back.

#### [NEW] [MemoryItem.jsx](file:///c:/Users/Dalai/dev/tmp/mim/src/components/MemoryItem.jsx)
A modal or expanded view for a specific photo/video.
- **Video Support**: Uses HTML5 `<video>` tag for playback.
- **Integration**: Includes `CommentSection`.

#### [NEW] [CommentSection.jsx](file:///c:/Users/Dalai/dev/tmp/mim/src/components/CommentSection.jsx)
Lists existing comments and provides an input to add new ones. Uses `useComments` hook.

#### [MODIFY] [useDrive.js](file:///c:/Users/Dalai/dev/tmp/mim/src/hooks/useDrive.js)
- **State**: Tracks `currentFolderId` (starts at env var).
- **Navigation**: methods to `openFolder` and `goBack`.
- **Fetching**: Fetches both files and `application/vnd.google-apps.folder`.

#### [NEW] [useComments.js](file:///c:/Users/Dalai/dev/tmp/mim/src/hooks/useComments.js)
Handles `list` and `create` operations for Drive Comments.

## Verification Plan
### Automated Tests
- Build verification.

### Manual Verification
1.  **Auth**: Login successfully.
2.  **View**: Ensure both images and videos load from the Drive folder.
3.  **Upload**: Upload a video file and ensure it appears.
4.  **Comments**: 
    - Open a photo/video.
    - Post a comment.
    - Verify the comment appears in the UI.
    - (Optional) Check Google Drive native interface to see the comment synced there.

## Deployment Strategy (GitHub Pages)
This app can be hosted on GitHub Pages.
1.  **Vite Config**: We will set `base: '/repo-name/'` in `vite.config.js`.
2.  **Routing**: We will use `HashRouter` (or no router if single view) to avoid 404 errors on refresh, as GitHub Pages doesn't support history API fallback natively without configuration.
3.  **Google Console**: You must add your GitHub Pages URL (e.g., `https://yourname.github.io`) to the **Authorized Javascript Origins** in the Google Cloud Console for the Client ID.
