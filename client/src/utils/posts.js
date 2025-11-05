import axios from "axios";
const baseUrl = "http://localhost:3000/api/posts"

let token = null

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}


const create = async newObject => {
  // Get token from localStorage
  const userToken = decoder()
  
  const postData = {
    ...newObject,
    userToken: tokenData.token
  };
  
  const response = await axios.post(baseUrl, postData)
  return response.data
}

const decoder = () => {
  const userToken = window.localStorage.getItem('activeUser')
  return JSON.parse(userToken)
}


const edit = async (editedObject, postId)=> {
  const userToken = decoder()
  const editedData = {
    ...editedObject,
    userToken: userToken.token
  }

  const response = axios.put(`${baseUrl}/${id}`, {userToken, editedData})
  return response.data

}

export default {getAll, create,edit}