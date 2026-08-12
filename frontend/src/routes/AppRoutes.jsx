import { Routes, Route} from "react-router-dom"
import Home from "../pages/Home/Home"
import Login from "../pages/Login/Login"
import Register from "../pages/Register/Register"
import NotFound from "../pages/NotFound/NotFound"
import Profile from "../pages/Profile/Profile"
import Projects from "../pages/Projects/Projects"
import ProjectDetails from "../components/projects/ProjectDetails"
import EditProject from "../pages/Projects/EditProject"
import MainLayout from "../layouts/MainLayout"
import GuestLayout from "../layouts/GuestLayout"
import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute"
import PublicRoute from "../components/common/PublicRoute/PublicRoute"
import MyJoinRequests from "../pages/MyJoinRequests/MyJoinRequests"
import ProjectJoinRequests from "../pages/ProjectJoinRequests/ProjectJoinRequests"
import CreateProject from "../pages/Projects/CreateProject"
import MyProjects from "../pages/Projects/MyProjects"
import Profiles from "../pages/Profiles/Profiles"
import ProfileView from "../components/ProfileList/ProfileView"

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
                <Route path="profile/" element={<Profile />} />
                <Route path="profiles/" element={<Profiles />} />
                <Route path="profiles/:id/" element={<ProfileView />} />
                <Route path="projects/" element={<Projects />} />
                <Route path="projects/create/" element={<CreateProject />} />
                <Route path="projects/:id/" element={<ProjectDetails />} />
                <Route path="projects/:id/edit/" element={<EditProject />} />
                <Route path="projects/me/" element={<MyProjects />} />
                <Route path="projects/" element={<Profiles />} />
                <Route path="join-requests/my" element={<MyJoinRequests />} />
                <Route path="projects/:id/join-requests/" element={<ProjectJoinRequests />} />

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