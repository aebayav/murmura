import axios from "axios"
import config from "../config.js"

const axiosInstance = axios.create({
    baseURL: config.apiUrl
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    
    failedQueue = []
}

// Request interceptor - add access token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const userData = window.localStorage.getItem('activeUser')
        if (userData) {
            try {
                const parsed = JSON.parse(userData)
                if (parsed.accessToken) {
                    config.headers['Authorization'] = `Bearer ${parsed.accessToken}`
                }
            } catch (error) {
                console.error('Failed to parse user data:', error)
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        
        // Check if error is due to expired token
        if (error.response?.status === 401 && error.response?.data?.expired && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`
                    return axiosInstance(originalRequest)
                }).catch(err => {
                    return Promise.reject(err)
                })
            }
            
            originalRequest._retry = true
            isRefreshing = true
            
            const userData = window.localStorage.getItem('activeUser')
            if (!userData) {
                isRefreshing = false
                window.location.replace('/login')
                return Promise.reject(error)
            }
            
            try {
                const parsed = JSON.parse(userData)
                
                if (!parsed.refreshToken) {
                    throw new Error('No refresh token available')
                }
                
                // Call refresh endpoint
                const response = await axios.post(`${config.apiUrl}/users/refresh`, {
                    refreshToken: parsed.refreshToken
                })
                
                const { accessToken } = response.data
                
                // Update stored tokens
                const updatedUserData = {
                    ...parsed,
                    accessToken: accessToken
                }
                window.localStorage.setItem('activeUser', JSON.stringify(updatedUserData))
                
                // Update the authorization header
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
                
                // Process queued requests
                processQueue(null, accessToken)
                
                isRefreshing = false
                
                // Retry the original request
                return axiosInstance(originalRequest)
                
            } catch (refreshError) {
                processQueue(refreshError, null)
                isRefreshing = false
                
                // Clear storage and redirect to login
                window.localStorage.removeItem('activeUser')
                window.location.replace('/login')
                
                return Promise.reject(refreshError)
            }
        }
        
        return Promise.reject(error)
    }
)

export default axiosInstance
