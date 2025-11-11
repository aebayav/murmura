import { Link } from "react-router-dom"
import { FaHome, FaUser, FaQuestionCircle, FaSignOutAlt, FaPlus, FaDoorOpen, FaBars, FaTimes } from "react-icons/fa"
import { useState } from "react"
import CreatePostModal from "./CreatePostModal"

const NavBar = ({ onPostCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const userToken = window.localStorage.getItem('activeUser')
    
    const logOut = () => {
        window.localStorage.removeItem("activeUser")
        window.location.reload()
    }
    
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }
    
    if(userToken){
     return(
        <>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-surface-primary border-b-2 border-border-primary px-4 py-3 flex items-center justify-between z-50">
            <h1 className="text-xl font-bold text-accent-primary">Murmura</h1>
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-2xl text-text-primary hover:text-accent-primary transition-colors"
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={closeMobileMenu}
            />
        )}

        {/* Mobile Sidebar */}
        <nav className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-surface-primary border-r-2 border-border-primary flex flex-col px-4 py-6 z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Logo/Brand Section */}
            <div className="mb-8 px-3">
                <h1 className="text-2xl font-bold text-accent-primary">Murmura</h1>
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-col gap-2 flex-1">
                <Link to="/home" onClick={closeMobileMenu} className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaHome className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Home</span>
                </Link>
                
                <Link to="/account" onClick={closeMobileMenu} className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaUser className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Account</span>
                </Link>
                
                <Link to="/rooms" onClick={closeMobileMenu} className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaDoorOpen className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Rooms</span>
                </Link>
                
                <Link to="/support" onClick={closeMobileMenu} className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaQuestionCircle className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Support</span>
                </Link>
                
                {/* Create Post Button */}
                <button onClick={() => { setIsModalOpen(true); closeMobileMenu(); }} className="mt-4 w-full bg-accent-primary text-background-primary font-bold text-lg px-6 py-3 rounded-full hover:bg-accent-secondary transition-all duration-200 shadow-lg hover:shadow-xl">
                    <span className="flex items-center justify-center gap-2">
                        <FaPlus />
                        <span>Create Post</span>
                    </span>
                </button>
            </div>
            
            {/* Logout Button at Bottom */}
            <button onClick={logOut} className="flex items-center gap-4 text-text-primary text-xl px-4 py-3 rounded-full hover:bg-red-900 hover:bg-opacity-20 transition-all duration-200 group mt-auto">
                <FaSignOutAlt className="text-2xl group-hover:text-red-400 transition-colors" />
                <span className="font-semibold group-hover:text-red-400 transition-colors">Log Out</span>
            </button>
        </nav>

        {/* Desktop Sidebar */}
        <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-surface-primary border-r-2 border-border-primary flex-col px-4 py-6">
            {/* Logo/Brand Section */}
            <div className="mb-8 px-3">
                <h1 className="text-2xl font-bold text-accent-primary">Murmura</h1>
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-col gap-2 flex-1">
                <Link to="/home" className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaHome className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Home</span>
                </Link>
                
                <Link to="/account" className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaUser className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Account</span>
                </Link>
                
                <Link to="/rooms" className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaDoorOpen className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Rooms</span>
                </Link>
                
                <Link to="/support" className="flex items-center gap-4 text-text-primary no-underline text-xl px-4 py-3 rounded-full hover:bg-surface-secondary transition-all duration-200 group">
                    <FaQuestionCircle className="text-2xl group-hover:text-accent-primary transition-colors" />
                    <span className="font-semibold group-hover:text-accent-primary transition-colors">Support</span>
                </Link>
                
                {/* Create Post Button */}
                <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full bg-accent-primary text-background-primary font-bold text-lg px-6 py-3 rounded-full hover:bg-accent-secondary transition-all duration-200 shadow-lg hover:shadow-xl">
                    <span className="flex items-center justify-center gap-2">
                        <FaPlus />
                        <span>Create Post</span>
                    </span>
                </button>
            </div>
            
            {/* Logout Button at Bottom */}
            <button onClick={logOut} className="flex items-center gap-4 text-text-primary text-xl px-4 py-3 rounded-full hover:bg-red-900 hover:bg-opacity-20 transition-all duration-200 group mt-auto">
                <FaSignOutAlt className="text-2xl group-hover:text-red-400 transition-colors" />
                <span className="font-semibold group-hover:text-red-400 transition-colors">Log Out</span>
            </button>
        </nav>
            
        {/* Create Post Modal */}
        <CreatePostModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onPostCreated={onPostCreated}
        />
        </>
        )   
    }
    else{
        window.location.replace("/login")
    }
    
}
export default NavBar