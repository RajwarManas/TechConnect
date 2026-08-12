import api from "./axios"

export async function getDashboard() {
    const response = await api.get("/auth/dashboard/")
    return response.data
}