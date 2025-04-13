
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import { PublicRoutes } from './routes/PublicRoute';
import { UserRoutes } from './routes/UserRoutes';

function App() {

  return (
    <Router>
    <ToastContainer />
    <Toaster />
    <Routes>
    <Route path='/*'  element={  <PublicRoutes />} />
    <Route path="/user/*" element={ <UserRoutes /> } />
    
    <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
  )
}

export default App
