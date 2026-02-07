import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useSheets } from './useSheets';

export const useComments = (fileId) => {
    const { user, accessToken } = useAuth();
    const { isReady, getCommentsFromSheet, addCommentToSheet } = useSheets();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadComments = useCallback(async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            if (accessToken === 'DEMO_TOKEN') {
                const { MOCK_COMMENTS } = await import('../services/mockData');
                setComments(MOCK_COMMENTS);
            } else if (isReady) {
                const allComments = await getCommentsFromSheet();
                // Filter for current file
                const fileComments = allComments.filter(c => c.fileId === fileId);
                setComments(fileComments);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [accessToken, fileId, isReady, getCommentsFromSheet]);

    const postComment = async (content) => {
        if (!accessToken) return;
        if (accessToken === 'DEMO_TOKEN') {
            setComments(prev => [...prev, {
                id: 'temp-' + Date.now(),
                content,
                author: { displayName: 'You (Demo)', photoLink: '' },
                createdTime: new Date().toISOString()
            }]);
            return;
        }

        if (!isReady) {
            console.warn("Sheets not ready yet");
            return;
        }

        try {
            const newComment = await addCommentToSheet(fileId, user, content);
            setComments(prev => [...prev, newComment]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    useEffect(() => {
        if (accessToken && fileId && (isReady || accessToken === 'DEMO_TOKEN')) {
            loadComments();
        }
    }, [accessToken, fileId, isReady, loadComments]);

    return { comments, loading, postComment };
};
