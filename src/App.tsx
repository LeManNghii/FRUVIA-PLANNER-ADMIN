import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TaskReports from './pages/TaskReports';
import LabelManagement from './pages/LabelManagement';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Login Route - No Layout */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes - With Layout */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

// Layout Component with Sidebar and Header
const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar activePage="Dashboard" onNavigate={() => {}} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/tasks" element={<TaskReports />} />
                        <Route path="/labels" element={<LabelManagement />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default App;
