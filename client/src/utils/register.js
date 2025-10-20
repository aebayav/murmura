import axios from "axios"
const baseUrl = "http://localhost:3000/api/users"

const register = async credentials => {
    try {
        const response = await axios.post(`${baseUrl}/register`, credentials)
        return response.data
    }
    catch(error) {
        // Axios stores the response in error.response
        console.log("Register error:", error.response?.data); // Debug log
        
        const errorMessage = error.response?.data?.message 
                          || error.response?.data?.error 
                          || (error.response?.status === 409 ? "Username or email already exists" : null)
                          || (error.response?.status === 400 ? "Please fill all required fields" : null)
                          || error.message 
                          || "Registration failed. Please try again."
        throw new Error(errorMessage)
    }
}

export default {register}