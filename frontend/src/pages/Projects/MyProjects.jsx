import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProjects } from "../../api/projects";

import ProjectList from "../../components/projects/ProjectList";

import "./MyProjects.css";

function MyProjects() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadProjects() {

            try {

                const data = await getMyProjects();
                setProjects(data.results);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadProjects();

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="my-projects-page">

            <div className="page-header">

                <div>

                    <h1>My Projects</h1>

                    <p>
                        Manage the projects you've created.
                    </p>

                </div>

                <button
                    className="create-btn"
                    onClick={() => navigate("/projects/create")}
                >
                    + Create Project
                </button>

            </div>

            {projects.length === 0 ? (

                <div className="empty-state">

                    <h2>No projects yet</h2>

                    <p>
                        Create your first project and start recruiting teammates.
                    </p>

                    <button
                        className="create-btn"
                        onClick={() => navigate("/projects/create")}
                    >
                        Create Project
                    </button>

                </div>

            ) : (

                <ProjectList projects={projects} />

            )}

        </div>

    );

}

export default MyProjects;