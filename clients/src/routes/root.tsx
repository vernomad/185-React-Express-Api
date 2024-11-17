import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import Admin from '../pages/Admin.tsx'
import Login from '../pages/Login.tsx'
import PrivateRoute from "../components/PrivateRoutes.tsx";

export default function RootRoutes() {
  return (

    <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/admin/*" element={<PrivateRoute element={<Admin/>} />} />
        {/* <Route path="/admin/*" element={<Admin />} /> */}
        <Route path="/login/*" element={<Login />} />
    </Routes>

  )
}
