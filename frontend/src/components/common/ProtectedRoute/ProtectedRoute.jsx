import { useContext, useState } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"

export default function ProtectedRoute({children}) {
    const { isAuthenticated, loading } = useContext(AuthContext)
    if (loading) {
        return <p>Loading...</p>
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }
    return children
}