import NavBar from "./NavBar"
import PostGallery from "./PostGallery"
import { useState } from "react"

const HomePage = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    const handlePostCreated = () => {
        setRefreshTrigger(prev => prev + 1); // Increment to trigger re-fetch
    };
    
    return(
    <div className="flex min-h-screen bg-background-primary">
        <NavBar onPostCreated={handlePostCreated}/>
        <main className="ml-64 flex-1">
            <PostGallery refreshTrigger={refreshTrigger}/>
        </main>
    </div>   
    )
}

export default HomePage
