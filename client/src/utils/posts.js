import axios from "axios";
import config from "../config.js";

const baseUrl = `${config.apiUrl}/posts`

let token = null

const decoder = () => {
  const userToken = window.localStorage.getItem('activeUser')
  return JSON.parse(userToken)
}

const getAll = async () => {
    try {
        const userToken = decoder()
        
        const response = await axios.get(baseUrl, {
            params: { 
                userToken: userToken?.token  // Send token as query param
            }
        })
        
        return response.data
    } catch (err) {
        // If not logged in, get posts without user context
        const response = await axios.get(baseUrl)
        return response.data
    }
}


const create = async newObject => {
  // Get token from localStorage
  const userToken = decoder()
  
  const postData = {
    ...newObject,
    userToken: userToken.token
  };
  
  const response = await axios.post(baseUrl, postData)
  return response.data
}

const edit = async (editedObject, postId)=> {
  const userToken = decoder()
  const editedData = {
    ...editedObject,
    userToken: userToken.token
  }

  const response = axios.put(`${baseUrl}/${postId}`, {userToken, editedData})
  return response.data

}

const deletePost = async (postId) => {
  const userToken = decoder()
  console.log("Deleting post ID:", postId)
  console.log("Delete URL:", `${baseUrl}/${postId}`)
  const response = await axios.delete(`${baseUrl}/${postId}`, {
    data: {userToken: userToken.token}  // Send the token string
  })
  return response.data
}

const like = async (postId) => {
  const userToken = decoder()
  
  const responce = await axios.post(`${baseUrl}/${postId}/like `, {
    userToken: userToken.token
  })
}
export default {getAll, create,edit, deletePost, like}