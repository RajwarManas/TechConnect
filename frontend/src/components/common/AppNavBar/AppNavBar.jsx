import {NavLink} from "react-router-dom"
import { PATHS } from  "../../../routes/paths"
import "./AppNavBar.css"

function AppNavBar() {
    return (
        <nav className="navbar">
            <NavLink className="logo" to={PATHS.HOME}>
                TechConnect
            </NavLink>
            <div className="nav-links">
                <NavLink to={PATHS.HOME}>
                    Home
                </NavLink>
                <NavLink to={PATHS.PROFILE}>
                    Profile
                </NavLink>
            </div>
        </nav>
    )
}

export default AppNavBar