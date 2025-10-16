import Post from "./Post"
import InfiniteScroll from "react-infinite-scroll-component"
import postService from "../utils/posts.js"

import { useEffect, useState } from "react";

const PostGallery = () => {
    
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        postService.getAll().then(posts => setPosts(posts));
    }, []);

    return(
        <div className="bg-background-primary min-h-screen p-6">
            <InfiniteScroll
                dataLength={posts.length}
                next={() => {}} 
                hasMore={false}
                loader={<h4 className="text-text-secondary text-center">Loading...</h4>}
                pullDownToRefreshContent={<Post post={{ content: "Loading..." }} />}
                className="max-w-3xl mx-auto"
            >
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export default PostGallery