import axios from "axios"

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
})
api.interceptors.request.use(
    function(config){
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
        const originalRequest = error.config
        if (error.response && error.response.status === 401 && !originalRequest._retry){
            try {
                originalRequest._retry = true
                const refresh = localStorage.getItem("refresh")
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/auth/token/refresh/",
                    {
                        refresh,
                    }
                )
                localStorage.setItem("acess", response.data.access)
                originalRequest.headers.Authorization = `Bearer $(response.data.access)`
                return api(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api