import { useState, useEffect, useCallback } from 'react';
import { listFiles, uploadFile } from '../services/googleDrive';
import { useAuth } from '../components/AuthProvider';

const FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID;

export const useDrive = () => {
    const { accessToken } = useAuth();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentFolderId, setCurrentFolderId] = useState(FOLDER_ID);
    const [folderStack, setFolderStack] = useState([]); // Track history for 'Back' button

    const refreshFiles = useCallback(async () => {
        if (!accessToken) return;

        setLoading(true);
        try {
            if (!currentFolderId) return;
            const data = await listFiles(accessToken, currentFolderId);
            setFiles(data.files || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [accessToken, currentFolderId]);

    const openFolder = (folderId) => {
        setFolderStack(prev => [...prev, currentFolderId]);
        setCurrentFolderId(folderId);
    };

    const goBack = () => {
        if (folderStack.length === 0) return;
        const previousId = folderStack[folderStack.length - 1];
        setFolderStack(prev => prev.slice(0, -1));
        setCurrentFolderId(previousId);
    };

    const upload = async (file) => {
        if (!accessToken) return;

        if (!currentFolderId) return;
        try {
            const newFile = await uploadFile(accessToken, currentFolderId, file);
            refreshFiles(); // Reload list after upload
            return newFile;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    useEffect(() => {
        if (accessToken) {
            refreshFiles();
        }
    }, [accessToken, refreshFiles]);

    return {
        files,
        loading,
        error,
        upload,
        refreshFiles,
        openFolder,
        goBack,
        currentFolderId: currentFolderId,
        canGoBack: folderStack.length > 0
    };
};
