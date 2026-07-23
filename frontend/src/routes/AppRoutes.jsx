import { Routes, Route} from "react-router-dom"
import Home from "../pages/Home/Home"
import Login from "../pages/Login/Login"
import NotFound from "../pages/NotFound/NotFound"
import Profile from "../pages/Profile/Profile"
import Register from "../pages/Register/Register"
import MainLayout from "../layouts/MainLayout"
import GuestLayout from "../layouts/GuestLayout"
import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute"
import PublicRoute from "../components/common/PublicRoute/PublicRoute"

function AppRoutes(){
    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
            </Route>
            <Route 
                element={
                    <PublicRoute>
                        <GuestLayout />
                    </PublicRoute>
                }
            >
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
            </Route>
            <Route path="*" element={<NotFound />}/>
        </Routes>
    )
}

export default AppRoutes