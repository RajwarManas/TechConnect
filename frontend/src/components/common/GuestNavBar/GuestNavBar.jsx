import { NavLink } from "react-router-dom"
import { PATHS } from "../../../routes/paths"
import "./GuestNavBar.css"

function GuestNavBar() {
    return (
        <nav className="navbar">
            <NavLink className="logo" to={PATHS.HOME}>
                TechConnect
            </NavLink>
            <div className="nav-links">
                <NavLink to={PATHS.LOGIN}>
                    Login
                </NavLink>
                <NavLink to={PATHS.REGISTER}>
                    Register
                </NavLink>
            </div>
        </nav>
    )
}

export default GuestNavBar