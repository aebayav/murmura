import axios from "axios"
import config from "../config.js"

const baseUrl = `${config.apiUrl}/users/login`

let token
const login = async credentials=> {
    try {
        const response = await axios.post(baseUrl, credentials)
        token = response.data
        
        if(token !== null){
            window.localStorage.setItem("activeUser", JSON.stringify(token))
            window.location.replace("/home")
        }
        return token
    }
    catch(error) {
        // Axios stores the response in error.response
        console.log("Login error:", error.response?.data); // Debug log
        
        const errorMessage = error.response?.data?.message 
                          || error.response?.data?.error 
                          || (error.response?.status === 401 ? "Invalid username or password" : null)
                          || error.message 
                          || "Login failed. Please try again."
        throw new Error(errorMessage)
    }
}

export default {login}