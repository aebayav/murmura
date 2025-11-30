import axiosInstance from "./axiosInstance.js"

const baseUrl = '/posts'

const getAll = async () => {
    try {
        const response = await axiosInstance.get(baseUrl)
        return response.data
    } catch (err) {
        console.error("Error fetching posts:", err)
        throw err
    }
}

const create = async newObject => {
    const response = await axiosInstance.post(baseUrl, newObject)
    return response.data
}

const edit = async (editedObject, postId)=> {
    const response = await axiosInstance.put(`${baseUrl}/${postId}`, editedObject)
    return response.data
}

const deletePost = async (postId) => {
    const response = await axiosInstance.delete(`${baseUrl}/${postId}`)
    return response.data
}

const like = async (postId) => {
    const response = await axiosInstance.post(`${baseUrl}/${postId}/like`)
    return response.data
}

export default {getAll, create, edit, deletePost, like}