const Post = ({post}) => {
    if (!post || !post.content) {
        return null; // or return a fallback UI
    }
    return (
        <div className="bg-surface-primary rounded-xl p-6 mb-4 shadow-lg border border-border-primary hover:border-accent-primary transition-all duration-200">
            <p className="text-text-primary text-lg mb-3">{post.content}</p>
            <p className="text-text-tertiary text-sm mb-2">{post.created_at}</p>
            <div className="flex items-center gap-4">
                <p className="text-pastel-pink font-semibold">❤️ {post.likes_count}</p>
                <button type="button" className="px-4 py-2 bg-pastel-purple text-background-primary rounded-lg hover:bg-pastel-blue transition-colors duration-200 font-semibold">Like</button>
            </div>
        </div>
    );
}

export default Post