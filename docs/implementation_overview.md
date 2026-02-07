# Mim Gallery - Implementation Documentation

## Overview
Mim Gallery is a client-side React application that functions as a community photo album. It leverages **Google Drive** for file storage and **Google Sheets** as a lightweight database for metadata (likes and comments), creating a completely "serverless" architecture where user data remains within their own (or the community's) Google ecosystem.

## Architecture

### Backend: Google Drive & Sheets
Instead of a traditional database and backend API, the application directly interacts with Google APIs:
1.  **File Storage**: All photos and videos are stored in a designated Google Drive folder.
2.  **Metadata Storage**: Likes and comments are stored in a Google Sheet named `mim-data-photo-gallery` located within that same folder.
3.  **Authentication**: Users log in with their Google Account via OAuth 2.0. The app requests scoped access to read Drive files and edit Spreadsheets.

### Frontend: React + Vite
The frontend is built with React, using Hooks to manage state and API interactions. It is styled with plain CSS/Inline Styles following a "Glassmorphism" design language.

## Data Model

### Google Sheet Structure
The application automatically creates and manages a spreadsheet with two tabs:

#### 1. Likes Sheet
Tracks user likes on specific files.
| Column | Description |
|---|---|
| `fileId` | Google Drive ID of the liked file |
| `userId` | Google Email or User ID of the liker |
| `userName` | Display Name of the liker |
| `timestamp` | ISO Date string of when the like occurred |

*Note: The application currently supports adding likes. Totals are calculated by aggregating rows matching a `fileId`.*

#### 2. Comments Sheet
Tracks user comments.
| Column | Description |
|---|---|
| `id` | Unique ID for the comment (generated client-side) |
| `fileId` | Google Drive ID of the commented file |
| `userId` | Google Email or User ID of the commenter |
| `userName` | Display Name of the commenter |
| `userPhoto` | URL to the commenter's profile photo |
| `content` | The comment text |
| `timestamp` | ISO Date string of when the comment was posted |

## Key Components & Services

### Services (`src/services/`)
-   **`googleDrive.js`**: Handles listing files from the shared folder and uploading new media.
-   **`googleSheets.js`**:
    -   `findOrCreateSheet(accessToken, folderId)`: Checks for the existence of the metadata sheet in the specific folder. If missing, creates it and initializes headers.
    -   `appendRow(...)`: Adds a new row to the specified sheet (Likes or Comments).
    -   `fetchSheetData(...)`: Retrieves all rows to be filtered client-side.

### Custom Hooks (`src/hooks/`)
-   **`useDrive.js`**: Manages the list of files, handles folder navigation, and file uploads.
-   **`useSheets.js`**: Initializes the connection to the Google Sheet on load. Exposes methods `addLike`, `getLikes`, `addCommentToSheet`, `getCommentsFromSheet`.
-   **`useComments.js`**: specific hook for the CommentSection component to manage fetching/posting comments for a single file.

### Environment Variables
The application requires the following `.env` variables:
-   `VITE_GOOGLE_CLIENT_ID`: OAuth 2.0 Client ID for the application.
-   `VITE_DRIVE_FOLDER_ID`: The ID of the root shared Folder in Google Drive where all files and the metadata sheet are stored.

## Authentication Scopes
The application requests the following scopes:
-   `https://www.googleapis.com/auth/drive.readonly`: To view photos/videos.
-   `https://www.googleapis.com/auth/userinfo.profile`: To get user name and photo.
-   `https://www.googleapis.com/auth/spreadsheets`: To read validity of and write to the metadata sheet.
