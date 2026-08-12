import { createContext, useState, useEffect } from "react"
import {login as loginRequest, logout as logoutRequest} from "../api/auth"
import { getMyProfile } from "../api/profile"

export const AuthContext = createContext()

export function AuthProvider ({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function login(credentials){
        try {
            const tokens = await loginRequest(credentials);
            localStorage.setItem("access", tokens.access);
            localStorage.setItem("refresh", tokens.refresh);
            const profile = await getMyProfile();
            setUser(profile);
        } catch (error) {
            console.log("LOGIN FAILED:", error);
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setUser(null);
            throw error;
        }
    }

    async function logout() {
        try {
            console.log("logout() called")
            await logoutRequest()
        } finally {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            setUser(null)   
        }
    }

    async function loadUser(){
        const token = localStorage.getItem("access")
        if (!token){
            setLoading(false)
            return 
        }
        try{
            const profile = await getMyProfile()
            setUser(profile)
        } catch (error) {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            setUser(null)
        } finally {
            setLoading(false)
        }
    } 
    useEffect(() => {
        loadUser()
    }, [])

    const isAuthenticated = user !== null

    return(
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}   