import Footer from './Footer'
import {Link} from "react-router-dom"

const FirstPage = () => {
  const userToken = window.localStorage.getItem("activeUser")
  if(!userToken){
    return(
    <div className="min-h-screen flex flex-col bg-background-primary">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-text-primary mb-6 sm:mb-8 tracking-wide">
          Welcome to Murmura
        </h3>
        <p className="text-base sm:text-xl lg:text-2xl text-center text-text-secondary max-w-4xl leading-relaxed mb-8 sm:mb-12 px-4">
          "Murmura is a place where you can freely express yourself, confess, and share any kind of secret or story — all anonymously. All we ask from you is your email address and a password of your choice. Your data will always stay private with us. Your secret is our secret."
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full max-w-sm sm:max-w-none px-4">
          <Link to="/register" className="w-full sm:w-auto">
              <button className="text-lg sm:text-xl lg:text-2xl px-6 py-3 sm:px-8 sm:py-4 w-full sm:min-w-[150px] bg-accent-primary text-background-primary border-2 border-accent-secondary rounded-xl cursor-pointer transition-all duration-200 hover:bg-accent-tertiary hover:text-text-primary font-semibold" type='button'>Register</button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
          <button className="text-lg sm:text-xl lg:text-2xl px-6 py-3 sm:px-8 sm:py-4 w-full sm:min-w-[150px] bg-accent-primary text-background-primary border-2 border-accent-secondary rounded-xl cursor-pointer transition-all duration-200 hover:bg-accent-tertiary hover:text-text-primary font-semibold" type='button'>Login</button>
          </Link>
          
        </div>
      </div>
      <Footer/>
    </div>
    )
  }
  else{
    window.location.replace("/home")
  }
}

export default FirstPage
