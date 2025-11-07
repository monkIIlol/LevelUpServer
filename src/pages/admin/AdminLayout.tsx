
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/SideBar'; 
import '../../css/admin.css'; 

const AdminLayout = () => {
  return (
    <div className="admin">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;