import { GoKebabHorizontal } from "react-icons/go";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal.jsx";
import postService from "../utils/posts.js"
import logger from "../../../server/utils/logger.js";

const Post = ({ post, onPostUpdated }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [likes_count, setLikesCount] = useState(post.likes_count || 0)
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user || false)  // ✅ Use from backend
  const [isLiking, setIsLiking] = useState(false)

  if (!post || !post.content) {
    return null;
  }

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePostUpdated = () => {
    setIsEditModalOpen(false);  // Close modal
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdown(false);
    setShowDeleteConfirm(true);  // Show custom confirm modal
  };

  const confirmDelete = () => {
    console.log("Attempting to delete post:", post.id);
    
    postService.deletePost(post.id)
      .then(() => {
        setShowDeleteConfirm(false);
        if (onPostUpdated) {
          onPostUpdated();
        }
      })
      .catch((error) => {
        console.error("Delete failed:", error);
        alert("Failed to delete post. Please try again.");
        setShowDeleteConfirm(false);
      });
  };

  const handleLike = async (e) => {
    if(isLiking) return;

    setIsLiking(true);

    const wasLiked = isLiked;

    setIsLiked(!isLiked)
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1)

    try{
      await postService.like(post.id)
    }
    catch (error) {
      console.log("Like failed:", error);
      
      setIsLiked(wasLiked)
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1)
      alert("failed to like post")
    }
    finally{
      setIsLiking(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative bg-surface-primary rounded-xl p-6 mb-4 shadow-lg border border-border-primary hover:border-accent-primary transition-all duration-200">
      {/* Kebab Button */}
      <button
        className="absolute top-4 right-4 p-2 hover:bg-surface-secondary rounded-full transition-colors text-text-secondary hover:text-text-primary"
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdown(!isDropdown);
        }}
      >
        <GoKebabHorizontal />
      </button>

      {/* Dropdown Menu */}
      {isDropdown && (
        <div 
          className="absolute top-12 right-4 bg-surface-secondary rounded-lg shadow-xl border border-border-primary py-2 min-w-[120px] z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdown(false);
              setIsEditModalOpen(true);
            }}
            className="w-full text-left px-4 py-2 hover:bg-surface-primary text-text-primary transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 hover:bg-surface-primary text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {/* Post Content */}
      <p className="text-text-primary text-lg mb-3">{post.content}</p>
      <p className="text-text-tertiary text-sm mb-2">
        {formatDate(post.created_at)}
      </p>

      {/* Like Section */}
      <div className="flex items-center gap-4">
        <p className="text-pastel-pink font-semibold">
        ❤️ {likes_count}
      </p>
      <button
        type="button"
        onClick={handleLike}
        disabled={isLiking}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 font-semibold cursor-pointer ${
          isLiked 
            ? 'bg-pastel-pink text-white' 
            : 'bg-pastel-purple text-background-primary hover:bg-pastel-blue'
        } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLiked ? 'Unlike' : 'Like'}
      </button>
    </div>

      {/* Edit Post Modal */}
      <CreatePostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onPostCreated={handlePostUpdated}
        existingPost={post}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-surface-primary rounded-xl p-6 max-w-md w-full mx-4 border border-border-primary">
            <h3 className="text-text-primary text-xl font-semibold mb-4">Delete Post</h3>
            <p className="text-text-secondary mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-surface-secondary text-text-primary rounded-lg hover:bg-surface-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;