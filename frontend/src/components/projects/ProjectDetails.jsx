import { useState, useEffect, useContext} from "react"
import { useParams, useNavigate } from "react-router-dom"

import { getProject } from "../../api/projects"
import { deleteProject } from "../../api/projects"
import { sendJoinRequest } from "../../api/joinRequests"

import { AuthContext } from "../../contexts/AuthContext"
import "./ProjectDetails.css"


function ProjectDetails() {
    const {id} = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProject() {
            try {
                const data = await getProject(id)
                setProject(data)
            } catch (error) {
                console.error(error.response?.data)
            } finally {
                setLoading(false)
            }
        }
        loadProject()
    }, [id])

    function handleEdit() {
        navigate("edit")
    }

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project"
        )
        if (!confirmed) return

        await deleteProject(id)
        navigate("/projects")
    }
    function handleViewJoinRequests() {
        navigate(`/projects/${project.id}/join-requests`)
    }
    async function handleJoinRequest() {
        try {
            await sendJoinRequest(id)
            setProject(prev => ({
                ...prev,
                has_pending_request: true,
            }))
        } catch (error) {
            console.error(error.response?.data || error)
        }

    }

    const isOwner = project.owner.id === user.id

    return (
        <div className="project-details-page">
    
            <div className="project-details-card">
    
                <div className="project-header">
    
                    <div>
                        <h1>{project.title}</h1>
    
                        <p className="project-owner">
                            by <strong>{project.owner.username}</strong>
                        </p>
                    </div>
    
                    <span className={`status-badge ${project.status.toLowerCase()}`}>
                        {project.status}
                    </span>
    
                </div>
    
                <section className="details-section">
    
                    <h3>Description</h3>
    
                    <p>{project.description}</p>
    
                </section>
    
                <section className="details-section">
    
                    <h3>Required Skills</h3>
    
                    <div className="skills-container">
    
                        {project.required_skills.map(skill => (
                            <span
                                key={skill.id}
                                className="skill-tag"
                            >
                                {skill.name}
                            </span>
                        ))}
    
                    </div>
    
                </section>
    
                <div className="project-meta">
    
                    <div>
                        <strong>Max Members</strong>
                        <p>{project.max_members}</p>
                    </div>
    
                    <div>
                        <strong>Created</strong>
                        <p>
                            {new Date(project.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
    
                </div>
    
                <div className="project-actions">
    
                    {isOwner ? (
                        <>
                            <button
                                className="primary-btn"
                                onClick={handleEdit}
                            >
                                Edit Project
                            </button>
    
                            <button
                                className="secondary-btn"
                                onClick={handleViewJoinRequests}
                            >
                                Join Requests
                            </button>
    
                            <button
                                className="danger-btn"
                                onClick={handleDelete}
                            >
                                Delete Project
                            </button>
                        </>
                    ) : (
                        <button
                            className="primary-btn"
                            onClick={handleJoinRequest}
                            disabled={project.has_pending_request}
                        >
                            {project.has_pending_request
                                ? "Request Sent"
                                : "Join Project"}
                        </button>
                    )}
    
                </div>
    
            </div>
    
        </div>
    )
}

export default ProjectDetails