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
        <InfiniteScroll
            dataLength={posts.length}
            next={() => {}} 
            hasMore={false}
            loader={<h4>Loading...</h4>}
            pullDownToRefreshContent={<Post post={{ content: "Loading..." }} />}
        >
            {posts.map(post => (
                <Post key={post.id} {...post} />
            ))}
        </InfiniteScroll>
    );
}

export default PostGallery