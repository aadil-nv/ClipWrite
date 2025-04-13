import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"

export interface PrivateRouteProps {
    children: React.ReactNode;
  }
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();
  const isUser = user.isAuthenticated
  console.log("isUser===>",isUser);


  if (isUser) {
    return <Navigate to="/user/blogs" />;  
  }else{
    return <>{children}</>;
  }

};

export default PrivateRoute;