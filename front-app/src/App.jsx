import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home.jsx';
import PatientList from './pages/Patients/PatientList.jsx';
import PatientDetail from './pages/Patients/PatientDetail.jsx';
import PatientAdd from './pages/Patients/PatientAdd.jsx';
import AvatarList from './pages/Avatars/AvatarList.jsx';
import AvatarDetail from './pages/Avatars/AvatarDetail.jsx';
import AvatarAdd from './pages/Avatars/AvatarAdd.jsx';
import { useEffect, useState } from 'react';

function App() {
  // 登录状态管理
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 登录/注册后回调
  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
        {isAuthenticated && (
          <>
            <Route path="/" element={<DashboardLayout onLogout={handleLogout} />}>
              <Route index element={<Home />} />
              <Route path="patients" element={<PatientList />} />
              <Route path="patients/add" element={<PatientAdd />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="avatars" element={<AvatarList />} />
              <Route path="avatars/add" element={<AvatarAdd />} />
              <Route path="avatars/:id" element={<AvatarDetail />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
