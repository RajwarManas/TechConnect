import api from "./axios"

export async function getSkills() {
    const response = await api.get("auth/skills/")
    return response.data
}