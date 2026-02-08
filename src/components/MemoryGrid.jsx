import React, { useState } from 'react';
import { useDrive } from '../hooks/useDrive';
import { useAuth } from './AuthProvider'; // For logout
import UploadButton from './UploadButton';
import MemoryItem from './MemoryItem';
import { motion } from 'framer-motion';
import { LogOut, Image as ImageIcon, Video, Folder, ArrowLeft } from 'lucide-react';
import ProtectedImage from './ProtectedImage';

import logo from '../assets/logo.svg';

const MemoryGrid = () => {
    const { files, loading, error, refreshFiles, openFolder, goBack, canGoBack, currentFolderId } = useDrive();
    const { logout, user, accessToken, revokeAccess } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);

    if (loading && files.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="loading-spinner" style={{ width: 48, height: 48 }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>
                <h2>Aw snap! Something went wrong.</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="glass-btn" style={{ marginTop: '1rem' }}>
                    Reload
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img src={logo} alt="MMH Logo" style={{
                        height: '4rem',
                        width: '4rem',
                        filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.2))'
                    }} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {canGoBack && (
                                <button onClick={goBack} className="glass-btn" style={{ padding: '0.5rem' }}>
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(to right, #38bdf8, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Memories
                            </h1>
                        </div>
                        <p style={{ margin: 0, opacity: 0.6, marginLeft: canGoBack ? '3rem' : 0 }}>Our Community Year in Review</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="https://ui-avatars.com/api/?name=User&background=random" style={{ width: 40, height: 40, borderRadius: '50%' }} alt="User" />

                    <button
                        onClick={() => {
                            if (confirm('Disconnect Google Drive access?')) revokeAccess();
                        }}
                        className="glass-btn"
                        style={{ padding: '0.5rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
                        title="Disconnect App"
                    >
                        <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
                    </button>

                    <button onClick={logout} className="glass-btn" style={{ padding: '0.5rem' }} title="Sign Out">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {files.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.6)' }}>
                    <h3>It's quiet here...</h3>
                    <p>No photos or folders found in this directory.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Folder ID: {currentFolderId || 'N/A'}</p>
                </div>
            )}

            <div className="grid-gallery">
                {files.map((file, index) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                    return (
                        <motion.div
                            layoutId={file.id}
                            key={file.id}
                            className="glass-panel"
                            style={{
                                overflow: 'hidden',
                                cursor: 'pointer',
                                aspectRatio: '1',
                                position: 'relative'
                            }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => isFolder ? openFolder(file.id) : setSelectedFile(file)}
                        >
                            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 4 }}>
                                {isFolder ? <Folder size={16} color="white" /> :
                                    file.mimeType.includes('video') ? <Video size={16} color="white" /> : <ImageIcon size={16} color="white" />}
                            </div>

                            {isFolder ? (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255, 255, 255, 0.05)'
                                }}>
                                    <Folder size={64} className="text-blue-400" style={{ opacity: 0.7 }} />
                                </div>
                            ) : (
                                <ProtectedImage
                                    file={file}
                                    accessToken={accessToken}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    alt={file.name}
                                    className="memory-img"
                                />
                            )}

                            <div className="overlay" style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                padding: '1rem',
                                opacity: isFolder ? 1 : 0, // Always show name for folders
                                transition: 'opacity 0.2s'
                            }}>
                                <p style={{ margin: 0, color: 'white', fontSize: '0.9rem', truncate: true }}>{file.name}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <UploadButton />

            {selectedFile && (
                <MemoryItem file={selectedFile} onClose={() => setSelectedFile(null)} accessToken={accessToken} />
            )}

            {/* Styles for hover effect manually injected for now */}
            <style>{`
        .glass-panel:hover .overlay {
          opacity: 1 !important;
        }
      `}</style>
        </div>
    );
};

export default MemoryGrid;
