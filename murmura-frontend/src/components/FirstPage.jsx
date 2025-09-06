import '../assets/css/FirstPage.css'
import Footer from './Footer'
import {Link} from "react-router-dom"

const FirstPage = () => {
  return (
    <div className="page-wrapper">
      <div className="first-page-container">
        <h3 className="first-page-title">
          Welcome to Murmura
        </h3>
        <p className="first-page-explain">
          "Murmura is a place where you can freely express yourself, confess, and share any kind of secret or story — all anonymously. All we ask from you is your email address and a password of your choice. Your data will always stay private with us. Your secret is our secret."
        </p>
        <div className="first-page-buttons">
          <Link to="/register">
              <button className="btn-primary" type='button'>Register</button>
          </Link>
          <Link to="/login">
          <button className="btn-secondary" type='button'>Login</button>
          </Link>
          
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default FirstPage
