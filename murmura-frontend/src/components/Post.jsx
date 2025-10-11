const Post = ({post}) => {
    if (!post || !post.content) {
        return null; // or return a fallback UI
    }
    return (
        <div className="post-container">
            <p>{post.content}</p>
            <p>{post.created_at}</p>
            <p>{post.likes_count}</p>
            <button type="button">Like</button>
        </div>
    );
}

export default Post