import { Route, Routes } from "react-router-dom";
import { Login } from "../components/auth/Login";
import { Signup } from "../components/auth/Signup";
import Page404 from "../components/Error/Page404";
import PrivateRoute from "./PrivateRoute";


export const PublicRoutes = () => {
  const routes = [
    { path: "/", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "*", element: <Page404 /> }
  ];
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
      ))}
    </Routes>
  );
};

