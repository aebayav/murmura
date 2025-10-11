import { Link } from "react-router-dom"
import '../assets/css/NavBar.css'
const NavBar = () => {
    const userToken = window.localStorage.getItem('activeUser')
    const logOut = () => {
        window.localStorage.removeItem("activeUser")
        window.location.reload()
    }
    if(userToken){
     return(
        <nav className="nav-bar"> 
            <div className="home">
                <Link to="/home">Home</Link>
            </div>
            <div className="account">
                <Link to="/account">Account</Link>
            </div>
            <div className="Support">
                <Link to="/support">Support</Link>
            </div>
            <button onClick={logOut} className="logout-btn">Log Out</button>
        </nav>
        )   
    }
    else{
        window.location.replace("http://localhost:5173/login")
    }
    
}
export default NavBar