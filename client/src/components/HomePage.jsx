import NavBar from "./NavBar"
import PostGallery from "./PostGallery"

const HomePage = () => {
    return(
    <div className="flex min-h-screen bg-background-primary">
        <NavBar/>
        <main className="ml-64 flex-1">
            <PostGallery/>
        </main>
    </div>   
    )
}

export default HomePage
