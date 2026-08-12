import api from "./axios"

export async function getProjects(filters = {}) {
    const params = new URLSearchParams()
    if (filters.search) {
        params.append("search", filters.search);
    }
    if (filters.status) {
        params.append("status", filters.status)
    }
    if (filters.ordering) {
        params.append("ordering", filters.ordering)
    }
    if (filters.requiredSkills?.length > 0) {
        filters.requiredSkills.forEach(skill => {
            params.append("required_skills", skill);
        });
    }
    const response = await api.get("auth/projects/", {
        params,
    })
    return response.data
}

export async function getProject(id) {
    const response = await api.get(`auth/projects/${id}/`)
    return response.data
}

export async function createProject(projectData) {
    const response = await api.post("auth/projects/create/", projectData)
    return response.data
}

export async function updateProject(id, projectData) {
    const response = await api.patch(`auth/projects/${id}/`, projectData)
    return response.data
}

export async function deleteProject(id) {
    await api.delete(`auth/projects/${id}/`)
}


export async function  getMyProjects() {
    const response = await api.get(`auth/projects/me`)
    return response.data
}
