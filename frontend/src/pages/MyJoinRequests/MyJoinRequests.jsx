import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { getMyJoinRequests } from "../../api/joinRequests"

import "./MyJoinRequests.css"

function MyJoinRequests() {

    const [requests, setRequests] = useState([])

    const navigate = useNavigate()

    useEffect(() => {

        async function loadMyRequests() {

            try {
                const data = await getMyJoinRequests()
                setRequests(data.results)
            } catch (error) {
                console.error(error)
            }

        }

        loadMyRequests()

    }, []);

    if (requests.length === 0) {
        return (
            <div className="my-requests-page">

                <div className="empty-state">

                    <h2>No Join Requests</h2>

                    <p>
                        You haven't applied to any projects yet.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="my-requests-page">

            <h1>My Join Requests</h1>

            <div className="requests-list">

                {requests.map(request => (

                    <div
                        key={request.id}
                        className="request-card"
                        onClick={() => navigate(`/projects/${request.project.id}`)}
                    >

                        <div className="request-header">

                            <h2>{request.project.title}</h2>

                            <span
                                className={`status-badge ${request.status.toLowerCase()}`}
                            >
                                {request.status}
                            </span>

                        </div>
                    </div>

                ))}

            </div>

        </div>
    );
}

export default MyJoinRequests