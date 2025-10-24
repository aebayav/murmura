import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import postsService from "../utils/posts.js"

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create post (token is handled inside posts.js)
            const newPost = {
                content: content,
                category: category
            };
            
            await postsService.create(newPost);
            console.log('Post created successfully!');
            
            // Refresh posts after creation
            if (onPostCreated) {
                onPostCreated();
            }
            
            // Clear form and close modal
            setContent('');
            setCategory('');
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.message || 'Failed to create post. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background-primary bg-opacity-95 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-surface-primary rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Create Post</h2>
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
                            Category (optional)
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g., Confession, Story, Question"
                            className="w-full px-4 py-3 text-lg rounded-lg border border-border-primary bg-background-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
