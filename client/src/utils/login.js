import axios from "axios"
import config from "../config.js"

const baseUrl = `${config.apiUrl}/users`

export const login = async credentials=> {
    try {
        const response = await axios.post(`${baseUrl}/login`, credentials)
        const { accessToken, refreshToken, user } = response.data
        
        const tokenData = {
            accessToken,
            refreshToken,
            user
        }
        
        window.localStorage.setItem("activeUser", JSON.stringify(tokenData))
        window.location.replace("/home")
        
        return tokenData
    }
    catch(error) {
        console.log("Login error:", error.response?.data); 
        
        const errorMessage = error.response?.data?.message 
                          || error.response?.data?.error 
                          || (error.response?.status === 401 ? "Invalid username or password" : null)
                          || error.message 
                          || "Login failed. Please try again."
        throw new Error(errorMessage)
    }
}

export const logout = async tokenData => {
    try{
        // Send refresh token to be revoked
        await axios.post(`${baseUrl}/logout`, {
            refreshToken: tokenData?.refreshToken
        })
    }
    catch(error){
        console.log("Error logging out from server:", error)
    }
    finally {
        window.localStorage.removeItem("activeUser")
        window.location.replace("/login")
    }
}
