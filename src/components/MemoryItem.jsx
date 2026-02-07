import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import CommentSection from './CommentSection';
import ProtectedImage from './ProtectedImage';
import { useSheets } from '../hooks/useSheets';
import { useAuth } from './AuthProvider';

const MemoryItem = ({ file, onClose, accessToken }) => {
    const isVideo = file.mimeType.includes('video');
    const { user } = useAuth();
    const { addLike, getLikes, isReady } = useSheets();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!isReady || !user) return;
            const allLikes = await getLikes();
            const fileLikes = allLikes.filter(l => l.fileId === file.id);
            setLikeCount(fileLikes.length);

            const hasLiked = fileLikes.some(l => l.userId === (user.email || user.id));
            setLiked(hasLiked);
        };
        checkLikeStatus();
    }, [file.id, isReady, user, getLikes]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (liked) return; // Prevent duplicate likes for now

        try {
            setLiked(true);
            setLikeCount(prev => prev + 1);
            await addLike(file.id, user);
        } catch (err) {
            console.error("Failed to like:", err);
            setLiked(false);
            setLikeCount(prev => prev - 1);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div
                onClick={onClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            />

            <motion.div
                layoutId={file.id}
                className="glass-panel"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Prevent outer scroll
                    background: '#0f172a'
                }}
            >
                <div style={{ background: '#000', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', flex: 1, overflow: 'hidden' }}>
                    <AuthenticatedMedia file={file} isVideo={isVideo} accessToken={accessToken} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--glass-bg)', padding: '0', flexShrink: 0 }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {file.owners?.[0]?.displayName?.charAt(0) || 'U'}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                Shared by <span style={{ fontWeight: 600, color: 'white' }}>{file.owners?.[0]?.displayName}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={handleLike}
                                className="glass-btn"
                                style={{
                                    padding: '0.5rem 0.8rem',
                                    background: liked ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                                    borderColor: liked ? '#ef4444' : 'var(--glass-border)',
                                    color: liked ? '#ef4444' : 'white',
                                    cursor: liked ? 'default' : 'pointer'
                                }}
                            >
                                <Heart size={18} fill={liked ? "#ef4444" : "none"} />
                                {likeCount > 0 && <span style={{ fontSize: '0.8rem', marginLeft: '0.3rem' }}>{likeCount}</span>}
                            </button>

                            <button
                                onClick={() => setShowComments(!showComments)}
                                className="glass-btn"
                                style={{ padding: '0.5rem 0.8rem', background: showComments ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                            >
                                <MessageSquare size={18} />
                                <span style={{ fontSize: '0.8rem', marginLeft: '0.3rem' }}>Comments</span>
                                {showComments ? <ChevronUp size={14} style={{ marginLeft: 4 }} /> : <ChevronDown size={14} style={{ marginLeft: 4 }} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showComments && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '50vh' }}
                            >
                                <div style={{ padding: '0 1rem 1rem 1rem', flex: 1, overflowY: 'auto', borderTop: '1px solid var(--glass-border)' }}>
                                    <CommentSection fileId={file.id} embedded={true} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X size={24} />
                </button>
            </motion.div>
        </div >
    );
};

// Helper component to fetch protected media
const AuthenticatedMedia = ({ file, isVideo, accessToken }) => {
    if (isVideo) {
        return (
            <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
                <p>Video playback requires direct stream.</p>
                <a href={file.webViewLink} target="_blank" rel="noreferrer" className="glass-btn">
                    Open in Drive to Watch
                </a>
            </div>
        );
    }

    return (
        <ProtectedImage
            file={file}
            accessToken={accessToken}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            alt={file.name}
        />
    );
};



export default MemoryItem;
