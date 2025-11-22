import React, { useState } from 'react';
// Import các component trang
import Dashboard from './pages/Dashboard.tsx';
import UserManagement from './pages/UserManagement.tsx';
import TaskReports from './pages/TaskReports.tsx';
import LabelManagement from './pages/LabelManagement.tsx';
// Import Sidebar component
import Sidebar from './components/Sidebar.tsx';

// Định nghĩa Type cho các trang có thể có
type PageName =
    | 'Dashboard'
    | 'UserManagement'
    | 'TaskReports'
    | 'LabelManagement';

const App: React.FC = () => {
    // State để theo dõi trang hiện tại
    const [currentPage, setCurrentPage] = useState<PageName>('Dashboard');

    const renderPage = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard />;
            case 'UserManagement':
                return <UserManagement />;
            case 'TaskReports':
                return <TaskReports />;
            case 'LabelManagement':
                return <LabelManagement />;
            default:
                // Xử lý trường hợp không tìm thấy trang
                return (
                    <h1 style={{ marginLeft: '270px', marginTop: '50px' }}>
                        404 | Page Not Found
                    </h1>
                );
        }
    };

    // Style cho phần nội dung chính
    const mainContentStyle: React.CSSProperties = {
        marginLeft: '250px', // Bù trừ cho Sidebar
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#ebe9e9ff', // Background trắng
    };

    return (
        <div className="d-flex">
            {/* Component Sidebar */}
            <Sidebar
                activePage={currentPage}
                onNavigate={(page) => setCurrentPage(page as PageName)}
            />

            {/* Content Container */}
            <div style={mainContentStyle} className="flex-grow-1">
                {renderPage()}
            </div>
        </div>
    );
};

export default App;
