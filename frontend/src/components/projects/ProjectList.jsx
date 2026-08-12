import ProjectCard from "./ProjectCard"
import "./ProjectList.css"

function ProjectList({ projects }) {

    if (projects.length === 0) {
        return (
            <div className="empty-projects">
                <h2>No projects found</h2>
                <p>
                    Try adjusting your search or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="project-list">
            {projects.map(project => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            ))}
        </div>
    );
}

export default ProjectList