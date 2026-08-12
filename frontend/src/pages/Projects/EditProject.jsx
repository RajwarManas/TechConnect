import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProject, updateProject } from "../../api/projects";
import ProjectForm from "../../components/projects/ProjectForm";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProject() {
            try {
                const data = await getProject(id);
                setProject(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    }, [id]);

    async function handleUpdate(projectData) {
        try {
            await updateProject(id, projectData);
            navigate(`/projects/${id}`);
        } catch (error) {
            console.error(error.response?.data || error);
        }
    }

    function handleCancel() {
        navigate(`/projects/${id}`);
    }

    if (loading) {
        return <p>Loading...</p>;
    }
    if (!project) {
        return <p>Project Not Found.</p>
    }

    return (
        <ProjectForm
            project={project}
            onSave={handleUpdate}
            onCancel={handleCancel}
        />
    );
}

export default EditProject;