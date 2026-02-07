/**
 * Google Drive API Service
 * Handles direct interactions with the Drive API v3
 */

const BASE_URL = 'https://www.googleapis.com/drive/v3';
const UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

/**
 * List files (photos and videos) from a specific folder
 * @param {string} accessToken - OAuth access token
 * @param {string} folderId - ID of the shared folder
 * @param {string} query - Optional search query
 */
export const listFiles = async (accessToken, folderId) => {
    const q = `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/' or mimeType = 'application/vnd.google-apps.folder') and trashed = false`;
    const fields = 'files(id, name, mimeType, webContentLink, webViewLink, thumbnailLink, createdTime, owners)';

    const response = await fetch(`${BASE_URL}/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&pageSize=100&orderBy=createdTime desc`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to list files');
    }

    return await response.json();
};

/**
 * Upload a file to the specified folder
 */
export const uploadFile = async (accessToken, folderId, file) => {
    const metadata = {
        name: file.name,
        parents: [folderId],
        mimeType: file.type,
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    return await response.json();
};

/**
 * List comments for a specific file
 */
export const listComments = async (accessToken, fileId) => {
    const fields = 'comments(id, content, createdTime, author(displayName, photoLink))';
    const response = await fetch(`${BASE_URL}/files/${fileId}/comments?fields=${encodeURIComponent(fields)}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to load comments');
    }

    return await response.json();
};

/**
 * Add a comment to a file
 */
export const addComment = async (accessToken, fileId, content) => {
    const response = await fetch(`${BASE_URL}/files/${fileId}/comments?fields=id,content,author,createdTime`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });

    if (!response.ok) {
        throw new Error('Failed to post comment');
    }

    return await response.json();
};
