import { NavLink } from "react-router-dom"
import { useContext } from "react"

import { PATHS } from "../../../routes/paths"
import { AuthContext } from "../../../contexts/AuthContext"

import "./AppNavBar.css"

function AppNavBar() {

    const { logout } = useContext(AuthContext);

    async function handleLogout() {
        try {
            await logout()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <nav className="navbar">

            <NavLink
                className="logo"
                to={PATHS.HOME}
            >
                TechConnect
            </NavLink>

            <div className="nav-links">

                <NavLink to={PATHS.HOME}>
                    Home
                </NavLink>

                <NavLink to={"/projects/me"}>
                    Your Projects
                </NavLink>

                <NavLink to={PATHS.PROFILE}>
                    Profile
                </NavLink>

                <NavLink to="/join-requests/my">
                    Requests
                </NavLink>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>
    )
}

export default AppNavBar