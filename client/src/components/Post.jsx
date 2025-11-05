import { GoKebabHorizontal } from "react-icons/go";
import { useState } from "react";

const Post = ({post}) => {

    const [isDropdown, setIsDropdown] = useState(false)

    if (!post || !post.content) {
        return null; // or return a fallback UI
    }
    
    // Format date to dd-mm-yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="relative bg-surface-primary rounded-xl p-6 mb-4 shadow-lg border border-border-primary hover:border-accent-primary transition-all duration-200">
            
            {/* Kebab Button */}
            <button 
                className="absolute top-4 right-4 p-2 hover:bg-surface-secondary rounded-full transition-colors text-text-secondary hover:text-text-primary"
                onClick={() => setIsDropdown(!isDropdown)}
            >
                <GoKebabHorizontal />
            </button>
            
            {/* Dropdown Menu - only shows when isDropdown is true */}
            {isDropdown && (
                <div className="absolute top-12 right-4 bg-surface-secondary rounded-lg shadow-xl border border-border-primary py-2 min-w-[120px] z-10">
                    <button className="w-full text-left px-4 py-2 hover:bg-surface-primary text-text-primary transition-colors">
                        Edit
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-surface-primary text-text-primary transition-colors">
                        Delete
                    </button>
                </div>
            )}
            
            {/* Post Content */}
            <p className="text-text-primary text-lg mb-3">{post.content}</p>
            <p className="text-text-tertiary text-sm mb-2">{formatDate(post.created_at)}</p>
            
            {/* Like Section */}
            <div className="flex items-center gap-4">
                <p className="text-pastel-pink font-semibold">❤️ {post.likes_count}</p>
                <button type="button" className="px-4 py-2 bg-pastel-purple text-background-primary rounded-lg hover:bg-pastel-blue transition-colors duration-200 font-semibold cursor-pointer">
                    Like
                </button>
            </div>
        </div>
    );
}

export default Post