import axios from "axios"
const baseUrl = "http://localhost:3000/api/users/login"

let token
const login = async credentials=> {
    const response = await axios.post(baseUrl, credentials)
    token = response.data
    if(token !== null){
        window.localStorage.setItem("activeUser", JSON.stringify(token))
        window.location.replace("http://localhost:5173/home")
    }
    return token
}

export default {login}