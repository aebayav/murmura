import axios from "axios"
const baseUrl = "http://localhost:3000/api/users/login"

let token
const login = async credentials=> {
    try {
        const response = await axios.post(baseUrl, credentials)
        token = response.data
        
        if(token !== null){
            window.localStorage.setItem("activeUser", JSON.stringify(token))
            window.location.replace("http://localhost:5173/home")
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