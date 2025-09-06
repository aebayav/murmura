import { Link } from "react-router-dom"
import '../assets/css/NavBar.css'
const NavBar = () => {
    return(
        <nav className="nav-bar">
            <div className="home">
                <Link to="/home">Home</Link>
            </div>
            <div className="account">
                <Link to="/account">Account</Link>
            </div>
        </nav>
    )
}
export default NavBar