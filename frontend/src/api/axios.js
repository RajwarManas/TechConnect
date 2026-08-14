import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})
api.interceptors.request.use(
    function(config){
        console.log("➡️ Request:", config.url);
        const token = localStorage.getItem("access")
        if (token){
            config.headers.Authorization = `Bearer ${token}`
            }
            return config
    }
)
 
api.interceptors.response.use(
    function(response){
        return response
    },
    async function (error){
        console.log("Response error:", error.response?.status, error.config?.url);
        const originalRequest = error.config
        if (error.response && error.response.status === 401 && !originalRequest._retry){
            try {
                originalRequest._retry = true
                const refresh = localStorage.getItem("refresh")
                console.log("🔄 Refreshing token...");
                const response = await axios.post(
                    "auth/token/refresh/",
                    {
                        refresh,
                    }
                )
                console.log("Refresh successful")
                console.log("New access:", response.data.access)
                localStorage.setItem("access", response.data.access)
                console.log("Stored access:", localStorage.getItem("access"))
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`
                console.log(
                    "Retry header:",
                    originalRequest.headers.Authorization
                )
                return api(originalRequest)
            } catch (refreshError) {
                console.log("Refresh failed", refreshError)
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api