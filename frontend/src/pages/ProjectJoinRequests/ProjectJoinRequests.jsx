import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { getProjectJoinRequest, acceptJoinRequest, rejectJoinRequest } from "../../api/joinRequests"
function ProjectJoinRequests() {
    const { id} = useParams()
    const [ requests, setRequests] = useState([])
    const [ loading, setLoading] = useState(true)
    useEffect(() => {
        async function loadRequests() {
            try {
                const data = await getProjectJoinRequest(id)
                console.log(data.results)
                setRequests(data.results)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        loadRequests()
    }, [id]) 

    async function handleAccept(requestId) {
        try {
            await acceptJoinRequest(requestId)
            setRequests(prev =>
                prev.filter(request => request.id !== requestId)
            )
        } catch (error) {
            console.error(error)
        }
    }

    async function handleReject(requestId) {
        try {
            await rejectJoinRequest(requestId)
            setRequests(prev =>
                prev.filter(request => request.id !== requestId)
            )
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return <h2>Loading...</h2>
    }
    return (
        <>
            {requests.map(request => (
                <div key={request.id}>  
                    <h3>{request.user.username}</h3>
                    <p>Status: {request.status}</p>

                    <button onClick={() => handleAccept(request.id)}>
                        Accept
                    </button>
                    <button onClick={() => handleReject(request.id)}>
                        Reject
                    </button>
                </div>
            ))}
        </>
    )
}

export default ProjectJoinRequests