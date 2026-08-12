import { useNavigate } from "react-router-dom"

import { createProject } from "../../api/projects"
import ProjectForm from "../../components/projects/ProjectForm"
import "./CreateProject.css"

function CreateProject() {
    let navigate = useNavigate()
    async function handleCreate(projectData) {
        try {
            await createProject(projectData);
            navigate("/projects");
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div className="create-project-page">
    
            <div className="create-project-card">
    
                <h1>Create Project</h1>
    
                <p>
                    Fill in the details below to start recruiting teammates.
                </p>
    
                <ProjectForm
                    onSave={handleCreate}
                />
    
            </div>
    
        </div>
    )
}

export default CreateProject