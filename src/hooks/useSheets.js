import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../components/AuthProvider';
import { findOrCreateSheet, appendRow, fetchSheetData } from '../services/googleSheets';

const LIKES_SHEET = 'Likes';
const COMMENTS_SHEET = 'Comments';

const FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID;

export const useSheets = () => {
    const { accessToken } = useAuth();
    const [spreadsheetId, setSpreadsheetId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initializing = useRef(false);

    // Initialize sheet on load
    useEffect(() => {
        const initSheet = async () => {
            if (!accessToken) return;
            if (initializing.current || spreadsheetId) return;

            initializing.current = true;
            try {
                const id = await findOrCreateSheet(accessToken, FOLDER_ID);
                setSpreadsheetId(id);
            } catch (err) {
                setError(err);
            } finally {
                initializing.current = false;
            }
        };
        initSheet();
    }, [accessToken, spreadsheetId]);

    const addLike = useCallback(async (fileId, user) => {
        if (!spreadsheetId || !accessToken) return;
        const row = [fileId, user.email || user.id, user.name, new Date().toISOString()];
        await appendRow(accessToken, spreadsheetId, LIKES_SHEET, row);
    }, [accessToken, spreadsheetId]);

    const getLikes = useCallback(async () => {
        if (!spreadsheetId || !accessToken) return [];
        const rows = await fetchSheetData(accessToken, spreadsheetId, LIKES_SHEET);
        // Map rows to objects: fileId, userId, userName, timestamp
        return rows.map(row => ({
            fileId: row[0],
            userId: row[1],
            userName: row[2],
            timestamp: row[3]
        }));
    }, [accessToken, spreadsheetId]);

    const addCommentToSheet = useCallback(async (fileId, user, content) => {
        if (!spreadsheetId || !accessToken) return;
        const id = 'c-' + Date.now();
        const row = [
            id,
            fileId,
            user.email || user.id,
            user.name,
            user.picture || '',
            content,
            new Date().toISOString()
        ];
        await appendRow(accessToken, spreadsheetId, COMMENTS_SHEET, row);
        return {
            id,
            fileId,
            author: { displayName: user.name, photoLink: user.picture },
            content,
            createdTime: row[6]
        };
    }, [accessToken, spreadsheetId]);

    const getCommentsFromSheet = useCallback(async () => {
        if (!spreadsheetId || !accessToken) return [];
        const rows = await fetchSheetData(accessToken, spreadsheetId, COMMENTS_SHEET);
        // Map rows: id, fileId, userId, userName, userPhoto, content, timestamp
        return rows.map(row => ({
            id: row[0],
            fileId: row[1],
            author: {
                displayName: row[3],
                photoLink: row[4]
            },
            content: row[5],
            createdTime: row[6]
        }));
    }, [accessToken, spreadsheetId]);

    return {
        loading,
        error,
        isReady: !!spreadsheetId,
        addLike,
        getLikes,
        addCommentToSheet,
        getCommentsFromSheet
    };
};
