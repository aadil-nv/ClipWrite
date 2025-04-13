import { Route, Routes } from "react-router-dom";
import { UserPrivateRoute } from "./UserPrivateRoute";
import ProfileDashboard from "../components/home/Profile";
import HomeLayout from "../components/home/HomeLayout";
import Blogs from "../components/home/Bloggs";
import { Dashboard404 } from "../components/Error/Dashboard404";
import NewBlog from "../components/home/NewBlog";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserPrivateRoute />}>
        <Route element={<HomeLayout />}>

          
          <Route path="blogs" element={<Blogs />} />
          <Route path="profile" element={<ProfileDashboard />} />
          <Route path="add-blogs" element={<NewBlog />} />
          
          {/* Catch-all route for dashboard */}
          <Route path="*" element={<Dashboard404/>} />
        </Route>
      </Route>
    </Routes>
  );
};