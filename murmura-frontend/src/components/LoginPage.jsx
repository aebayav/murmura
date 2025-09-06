import '../assets/css/LoginPage.css';
import { useState } from 'react';



const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (event) => {
        event.preventDefault()
        console.log(username,password)
    }

    return(
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleLogin}>
                <label className="login-form-label">
                    Username
                    <input className="login-form-input"type="text" value={username} onChange={(event) => {setUsername(event.target.value)}}/>
                </label><br/>
                <label className="login-form-label">
                    Password
                    <input className="login-form-input" type="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>
                </label>
                <button className="btn-submit" type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginPage