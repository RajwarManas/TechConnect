import { Outlet } from "react-router-dom"
import AppNavBar from "../components/common/AppNavBar/AppNavBar"

function MainLayout() {
    return (
        <div>
            <AppNavBar />
            <Outlet />
        </div>
    )
}

export default MainLayout