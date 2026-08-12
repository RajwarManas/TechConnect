import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { getDashboard } from "../../api/dashboard"
import { AuthContext } from "../../contexts/AuthContext"
import StatCard from "../../components/dashboard/statCard"
import CreateProject from "../../routes/AppRoutes"
import "./Home.css"


function Home(){
    const[dashboard, setDashboard] = useState(null)
    const[loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    console.log("Home Mounted")

    useEffect(() => {
        async function loadDashboard() {
            console.log("Loading Dashboard...")
            try {
                const data = await getDashboard()
                console.log("Dashboard:", data);
                setDashboard(data)
            } catch(error) {
                console.error(error.data)
            } finally {
                setLoading(false)
            }
        }
        loadDashboard()
    }, [])

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!dashboard) {
        return <h2>Unable to load dashboard.</h2>;
    }

    return (
        <div className="home-container">
            <h1>Welcome, {user.username}</h1>
            <p>
                Find teammates and collaborate on exciting projects.
            </p>
            <div className="quick-actions">
                <button
                    className="action-btn"
                    onClick={() => navigate("/projects/create")}
                >
                    + Create Project
                </button>

                <button
                    className="action-btn"
                    onClick={() => navigate("/projects")}
                >
                    Browse Projects
                </button>

                <button
                    className="action-btn"
                    onClick={() => navigate("/profiles")}
                >
                    Browse Developers
                </button>

                <button
                    className="action-btn"
                    onClick={() => navigate("/join-requests/my")}
                >
                    My Join Requests
                </button>
            </div>
            <div className="stats-grid">
                <StatCard
                    title="Projects Created"
                    value={dashboard.projects_owned}
                />
                <StatCard
                    title="Projects Joined"
                    value={dashboard.projects_joined}
                />
                <StatCard
                    title="Pending Received"
                    value={dashboard.pending_requests_received}
                />
                <StatCard
                    title="Pending Sent"
                    value={dashboard.pending_requests_sent}
                />
                <StatCard
                    title="Recruiting Projects"
                    value={dashboard.recruiting_projects}
                />
                <StatCard
                    title="Completed Projects"
                    value={dashboard.completed_projects}
                />
            </div>
            <h2>Projects Needing Your Attention</h2>

            {dashboard.projects_needing_attention.length === 0 ? (
                <p>No projects need your attention.</p>
            ) : (
                dashboard.projects_needing_attention.map(project => (
                    <div key={project.id}>
                        <h3>{project.title}</h3>

                        <p>
                            {project.pending_count} pending request(s)
                        </p>

                        <button
                            onClick={() =>
                                navigate(`/projects/${project.id}/join-requests`)
                            }
                        >
                            Review Requests
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}

export default Home