import axios from "axios"
const baseUrl = "http://localhost:3000/api/users"

const register = async credentials => {
    const response = await axios.post(`${baseUrl}/register`, credentials)
    console.log(response)
    return response
    
}

export default {register}