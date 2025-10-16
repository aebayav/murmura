import { Route, Router, Routes } from "react-router-dom"
import FirstPage from "./components/FirstPage"
import RegisterPage from "./components/RegisterPage"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import register from "./utils/register"
import login from "./utils/login"

function App() {
  return(
      <Routes>
        <Route exact path="/" element = {<FirstPage/>}/>
        <Route path="/register" element = {<RegisterPage handleRegister={register.register}/>}/>
        <Route path="/login" element = {<LoginPage handleLogin={login.login}/>}/>
        <Route path="/home" element = {<HomePage/>}/>
      </Routes>
  )
}
export default App
