/**
 * Google Sheets API Service
 * Handles interactions with the Google Sheets API v4
 */

const SPREADSHEETS_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const DRIVE_URL = 'https://www.googleapis.com/drive/v3/files';

const SHEET_TITLE = 'mim-data-photo-gallery';
const LIKES_SHEET_TITLE = 'Likes';
const COMMENTS_SHEET_TITLE = 'Comments';

/**
 * Find or create the Mim Community Data spreadsheet
 */
export const findOrCreateSheet = async (accessToken, folderId) => {
    // 1. Search for existing file in the specific folder
    const q = `name = '${SHEET_TITLE}' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
    const searchResponse = await fetch(`${DRIVE_URL}?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!searchResponse.ok) throw new Error('Failed to search for spreadsheet');
    const searchData = await searchResponse.json();

    if (searchData.files && searchData.files.length > 0) {
        return searchData.files[0].id;
    }

    // 2. Create new spreadsheet using Drive API to place it in the folder
    const metadata = {
        name: SHEET_TITLE,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [folderId]
    };

    const createResponse = await fetch(DRIVE_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
    });

    if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error('Failed to create spreadsheet: ' + (errorData.error?.message || 'Unknown error'));
    }
    const createData = await createResponse.json();
    const newSpreadsheetId = createData.id;

    // 3. Initialize Sheets (tabs) structure
    // Newly created sheet has "Sheet1". Rename it and add "Comments".
    const requests = [
        {
            updateSheetProperties: {
                properties: { sheetId: 0, title: LIKES_SHEET_TITLE },
                fields: 'title'
            }
        },
        {
            addSheet: {
                properties: { title: COMMENTS_SHEET_TITLE }
            }
        }
    ];

    const setupResponse = await fetch(`${SPREADSHEETS_URL}/${newSpreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
    });

    if (!setupResponse.ok) {
        const err = await setupResponse.json();
        throw new Error('Failed to setup sheet structure: ' + (err.error?.message || 'Unknown'));
    }

    // Initialize headers data
    await initializeHeaders(accessToken, newSpreadsheetId);

    return newSpreadsheetId;
};

const initializeHeaders = async (accessToken, spreadsheetId) => {
    const values = [
        { range: `${LIKES_SHEET_TITLE}!A1:D1`, values: [['fileId', 'userId', 'userName', 'timestamp']] },
        { range: `${COMMENTS_SHEET_TITLE}!A1:G1`, values: [['id', 'fileId', 'userId', 'userName', 'userPhoto', 'content', 'timestamp']] }
    ];

    const batchUpdateUrl = `${SPREADSHEETS_URL}/${spreadsheetId}/values:batchUpdate`;
    const response = await fetch(batchUpdateUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            valueInputOption: 'RAW',
            data: values
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error('Failed to initialize headers: ' + (err.error?.message || 'Unknown'));
    }
};

/**
 * Append a row to a sheet
 */
export const appendRow = async (accessToken, spreadsheetId, sheetName, rowData) => {
    const range = `${sheetName}!A1`;
    const url = `${SPREADSHEETS_URL}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            values: [rowData]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error('Failed to append row: ' + JSON.stringify(err));
    }
    return await response.json();
};

/**
 * Fetch all rows from a sheet
 */
export const fetchSheetData = async (accessToken, spreadsheetId, sheetName) => {
    const range = `${sheetName}!A2:Z`; // Skip header
    const url = `${SPREADSHEETS_URL}/${spreadsheetId}/values/${range}`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error('Failed to fetch sheet data');
    const data = await response.json();
    return data.values || [];
};
