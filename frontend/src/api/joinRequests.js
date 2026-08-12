import api from "./axios"

export async function sendJoinRequest(id) {
    const response = await api.post(`auth/projects/${id}/join/`)
    return response.data
}

export async function getMyJoinRequests() {
    const response = await api.get("auth/join-requests/my/")
    return response.data
}

export async function getProjectJoinRequest(id) {
    console.log(`auth/projects/${id}/join-requests/`);
    const response = await api.get(`auth/projects/${id}/join-requests/`)
    return response.data
}

export async function acceptJoinRequest(id) {
    const response = await api.patch(`auth/join-requests/${id}/accept/`)
    return response.data
}

export async function rejectJoinRequest(id) {
    const response = await api.patch(`auth/join-requests/${id}/reject/`)
    return response.data
}