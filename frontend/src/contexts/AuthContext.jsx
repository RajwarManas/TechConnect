import { createContext, useState, useEffect } from "react"
import {login as loginRequest, logout as logoutRequest, getProfile} from "../api/auth"

export const AuthContext = createContext()

export function AuthProvider ({children}){
    const [user, setUser] = useState(null)

    async function login(credentials){
        try {
            const tokens = await loginRequest(credentials)
            localStorage.setItem("access", tokens.access)
            localStorage.setItem("refresh", tokens.refresh)
            const profile = await getProfile()
            setUser(profile)
        } catch (error){
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            setUser(null)

            throw error
        }
    }

    async function logout() {
        try {
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
            return 
        }
        try{
            const profile = await getProfile()
            setUser(profile)
        } catch (error) {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            setUser(null)
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
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}   