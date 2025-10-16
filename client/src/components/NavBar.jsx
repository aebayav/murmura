import { Link } from "react-router-dom"

const NavBar = () => {
    const userToken = window.localStorage.getItem('activeUser')
    const logOut = () => {
        window.localStorage.removeItem("activeUser")
        window.location.reload()
    }
    if(userToken){
     return(
        <nav className="flex items-center bg-surface-primary px-8 py-4 border-b-2 border-border-primary shadow-lg"> 
            <div className="mr-6">
                <Link to="/home" className="text-text-primary no-underline text-lg hover:text-accent-primary transition-colors duration-200">Home</Link>
            </div>
            <div className="mr-6">
                <Link to="/account" className="text-text-primary no-underline text-lg hover:text-accent-primary transition-colors duration-200">Account</Link>
            </div>
            <div className="mr-6">
                <Link to="/support" className="text-text-primary no-underline text-lg hover:text-accent-primary transition-colors duration-200">Support</Link>
            </div>
            <button onClick={logOut} className="ml-auto bg-accent-primary text-background-primary border-2 border-accent-secondary rounded-lg px-6 py-2 font-bold transition-all duration-200 hover:bg-accent-tertiary hover:text-text-primary cursor-pointer">Log Out</button>
        </nav>
        )   
    }
    else{
        window.location.replace("http://localhost:5173/login")
    }
    
}
export default NavBar