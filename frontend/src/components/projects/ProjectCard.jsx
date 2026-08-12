import { useNavigate } from "react-router-dom"
import "./ProjectCard.css"

function ProjectCard({ project }) {

    const navigate = useNavigate();

    const truncatedDescription =
        project.description.length > 120
            ? project.description.slice(0, 120) + "..."
            : project.description;

    return (
        <div className="project-card">

            <div className="project-card-header">

                <h2>{project.title}</h2>

                <span className={`status-badge ${project.status.toLowerCase()}`}>
                    {project.status}
                </span>

            </div>

            <p className="project-owner">
                Owner: <strong>{project.owner.username}</strong>
            </p>

            <p className="project-description">
                {truncatedDescription}
            </p>

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

            <button
                className="view-btn"
                onClick={() => navigate(`/projects/${project.id}`)}
            >
                View Project
            </button>

        </div>
    );
}

export default ProjectCard