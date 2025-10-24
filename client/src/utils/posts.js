import axios from "axios";
const baseUrl = "http://localhost:3000/api/posts"

let token = null

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const create = async newObject => {
  // Get token from localStorage
  const userToken = window.localStorage.getItem('activeUser');
  const tokenData = JSON.parse(userToken);
  
  const postData = {
    ...newObject,
    userToken: tokenData.token
  };
  
  const response = await axios.post(baseUrl, postData)
  return response.data
}



export default {getAll, setToken, create}