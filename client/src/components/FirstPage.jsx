import Footer from './Footer'
import {Link} from "react-router-dom"

const FirstPage = () => {
  const userToken = window.localStorage.getItem("activeUser")
  if(!userToken){
    return(
    <div className="min-h-screen flex flex-col bg-background-primary">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <h3 className="text-5xl font-bold text-center text-text-primary mb-8 tracking-wide">
          Welcome to Murmura
        </h3>
        <p className="text-2xl text-center text-text-secondary max-w-4xl leading-relaxed mb-12 px-4">
          "Murmura is a place where you can freely express yourself, confess, and share any kind of secret or story — all anonymously. All we ask from you is your email address and a password of your choice. Your data will always stay private with us. Your secret is our secret."
        </p>
        <div className="flex gap-6 items-center justify-center flex-wrap">
          <Link to="/register">
              <button className="text-2xl px-8 py-4 min-w-[150px] bg-accent-primary text-background-primary border-2 border-accent-secondary rounded-xl cursor-pointer transition-all duration-200 hover:bg-accent-tertiary hover:text-text-primary font-semibold" type='button'>Register</button>
          </Link>
          <Link to="/login">
          <button className="text-2xl px-8 py-4 min-w-[150px] bg-accent-primary text-background-primary border-2 border-accent-secondary rounded-xl cursor-pointer transition-all duration-200 hover:bg-accent-tertiary hover:text-text-primary font-semibold" type='button'>Login</button>
          </Link>
          
        </div>
      </div>
      <Footer/>
    </div>
    )
  }
  else{
    window.location.replace("http://localhost:5173/home")
  }
}

export default FirstPage
