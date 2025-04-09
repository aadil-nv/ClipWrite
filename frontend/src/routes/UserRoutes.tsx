import { Route, Routes } from "react-router-dom";
import { Dashboard404 } from "../components/Error/Dashboard404";
import {UserPrivateRoute} from "./UserPrivateRoute";
import { Dashboard404 } from "../components/Error/Dashboard404";
import { Home } from "lucide-react";
// import {DashBoardLayout} from "../components/dashboard/Main"
// import { Dashboard } from "../components/dashboard/Dashboard";
// import { Customers } from "../components/dashboard/Customers";
// import { Products } from "../components/dashboard/Products";
// import { Sales } from "../components/dashboard/Sales";



export const UserRoutes = () => {



  return (
    <Routes>
      <Route element={<UserPrivateRoute />}>
        
          <Route path="dashboard" element={<Home />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />

          <Route path="*" element={<Dashboard404 />} /> 

      </Route>
    </Routes>
  );
};

