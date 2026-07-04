import { Outlet } from "react-router-dom"
import GuestNavBar from "../components/common/GuestNavBar/GuestNavBar"

function GuestLayout() {
    return (
        <div>
            <GuestNavBar />
            <Outlet />
        </div>
    )
}

export default GuestLayout