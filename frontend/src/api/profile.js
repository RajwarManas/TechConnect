import api from "./axios"

export async function getMyProfile(){
    const response = await api.get("auth/profile/")
    return response.data
}

export async function updateProfile(profileData) {
    const response = await api.patch("auth/profile/", profileData)
    return response.data
}

export async function getProfiles(params = {}) {
    const response = await api.get("auth/profiles/" , {
        params,
        paramsSerializer: {
            indexes: null,
        },
    })
    return response.data
}

export async function getProfileById(id) {
    const response = await api.get(`auth/profiles/${id}/`);
    return response.data;
}