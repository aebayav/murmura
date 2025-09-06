import { useState } from "react"
import '../assets/css/RegisterPage.css'
const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const handleRegister = (event) =>{
        event.preventDefault()
        console.log(username,password,email,birthDate)
        
    }   
    return(
        <div className="register-form-container">
            <form className="register-form" onSubmit={handleRegister}>
                <label className="register-form-label">
                    Username
                    <input className="register-form-input" value={username} type="text" onChange={(event) => {setUsername(event.target.value)}}/>
                </label><br/>
                <label>
                    Password
                    <input className="register-form-input" value={password} type="password" onChange={(event) => {setPassword(event.target.value)}}/>
                </label><br/>
                <label>
                    E-mail
                    <input className="register-form-input" value= {email} type="email" onChange={(event) => {setEmail(event.target.value)}}/>
                </label><br/>
                <label>
                    Birth Date
                    <input className="register-form-input" value={birthDate} type="date" onChange={(event) => {setBirthDate(event.target.value)}}/>
                </label><br/>
                <input className= "btn-submit" type="submit" value={"Submit"}/>
            </form>
        </div>
    )
}

export default RegisterPage