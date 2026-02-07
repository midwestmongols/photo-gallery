import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useDrive } from '../hooks/useDrive';

const UploadButton = () => {
    const { upload } = useDrive();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await upload(file);
            // Success notification could go here
        } catch (err) {
            alert('Upload failed!');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*,video/*"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="glass-btn"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    padding: 0,
                    background: 'var(--accent-blue)',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(56, 189, 248, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50
                }}
                disabled={uploading}
            >
                {uploading ? <Loader2 className="loading-spinner" /> : <Upload size={24} />}
            </button>
        </>
    );
};

export default UploadButton;
