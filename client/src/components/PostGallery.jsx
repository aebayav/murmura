import Post from "./Post"
import InfiniteScroll from "react-infinite-scroll-component"
import postService from "../utils/posts.js"

import { useEffect, useState } from "react";

const PostGallery = ({ refreshTrigger }) => {
    
    const [posts, setPosts] = useState([]);
    
    const fetchPosts = () => {
        postService.getAll().then(posts => setPosts(posts));
    };
    
    useEffect(() => {
        fetchPosts();
    }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

    return(
        <div className="bg-background-primary min-h-screen p-3 sm:p-6">
            <InfiniteScroll
                dataLength={posts.length}
                next={() => {}} 
                hasMore={false}
                loader={<h4 className="text-text-secondary text-center">Loading...</h4>}
                pullDownToRefreshContent={<Post post={{ content: "Loading..." }} />}
                className="max-w-3xl mx-auto w-full"
            >
                {posts.map(post => (
                    <Post key={post.id} post={post} onPostUpdated={fetchPosts} className={post.id}/>
                ))}
            </InfiniteScroll>  
        </div>
    );
}

export default PostGallery