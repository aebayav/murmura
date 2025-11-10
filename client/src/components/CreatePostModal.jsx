import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import postsService from "../utils/posts.js"

const CreatePostModal = ({ isOpen, onClose, onPostCreated, existingPost = null }) => {
    const [content, setContent] = useState(existingPost?.content || '');
    const [category, setCategory] = useState(existingPost?.category || '');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isEditMode = !!existingPost

    useEffect(() => {
        if (existingPost) {
            setContent(existingPost.content);
            setCategory(existingPost.category || '');
        }
    }, [existingPost]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create post (token is handled inside posts.js)
            const newPost = {
                content: content,
                category: category
            };
            
            if (isEditMode) {
                await postsService.edit(existingPost.id, newPost);
            } else {
                await postsService.create(newPost);
            }
            console.log('Post created successfully!');
            
            // Refresh posts after creation
            if (onPostCreated) {
                onPostCreated();
            }
            
            // Clear form and close modal
            handleClose();
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.message || 'Failed to create post. Please try again.');
        }
    };

    const handleClose = () => {
        setContent('');
        setCategory('');
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-background-primary flex items-center justify-center z-[9999]" onClick={onClose}>
            <div className="bg-surface-primary rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">{isEditMode ? 'Edit Post' : 'Create Post'}</h2>
                    <button onClick={onClose} className="text-text-tertiary hover:text-accent-primary transition-colors">
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-text-primary text-lg mb-2">
                            What's on your mind?
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full h-32 px-4 py-3 text-lg rounded-lg border border-border-primary bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-text-primary text-lg mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g., Confession, Story, Question"
                            className="w-full px-4 py-3 text-lg rounded-lg border border-border-primary bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary" 
                            required
                        />
                    </div>

                    {/* Character count */}
                    <div className="mb-4 text-right">
                        <span className={`text-sm ${content.length > 500 ? 'text-red-400' : 'text-text-tertiary'}`}>
                            {content.length} / 500
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-lg font-semibold rounded-full border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:bg-opacity-10 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim() || content.length > 500}
                            className="px-6 py-3 text-lg font-semibold rounded-full bg-accent-primary text-background-primary hover:bg-accent-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEditMode ? 'Update' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CreatePostModal;
