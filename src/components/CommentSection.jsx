import React, { useState } from 'react';
import { useComments } from '../hooks/useComments';
import { Send, User } from 'lucide-react';
import { motion } from 'framer-motion';

const CommentSection = ({ fileId, embedded = false }) => {
    const { comments, loading, postComment } = useComments(fileId);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setPosting(true);
        try {
            await postComment(newComment);
            setNewComment('');
        } catch (err) {
            alert('Failed to post comment');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className={embedded ? '' : "glass-panel"} style={embedded ? { padding: 0, marginTop: 0 } : { padding: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Community Thoughts</h3>

            <div style={{ maxHeight: embedded ? 'none' : '300px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading && comments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>Loading...</div>
                ) : comments.length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: 0.6, fontStyle: 'italic' }}>No memories shared yet. Be the first!</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                {comment.author?.photoLink ? (
                                    <img src={comment.author.photoLink} alt="User" style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <User size={16} />
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                                    {comment.author?.displayName || 'Anonymous'}
                                </div>
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{comment.content}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem' }}>
                                    {new Date(comment.createdTime).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share a memory..."
                    className="glass-input"
                    disabled={posting}
                />
                <button type="submit" className="glass-btn" disabled={posting || !newComment.trim()} style={{ padding: '0.75rem' }}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
