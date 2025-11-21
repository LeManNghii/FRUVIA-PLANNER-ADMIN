import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Đã thêm từ khóa 'type' vào IconDefinition để giải quyết lỗi Vite/Runtime
import { faTachometerAlt, faUsers, faListCheck, faTag, type IconDefinition } from '@fortawesome/free-solid-svg-icons';

// Định nghĩa TypeScript Interface cho props
interface SidebarProps {
    activePage: 'Dashboard' | 'UserManagement' | 'TaskReports' | 'LabelManagement';
    // Hàm xử lý chuyển trang
    onNavigate: (page: string) => void; 
}

// Định nghĩa cấu trúc menu
interface MenuItem {
    name: string;
    page: SidebarProps['activePage'];
    icon: IconDefinition; // Dùng Type đã import
}

const menuItems: MenuItem[] = [
    { name: 'Dashboard', page: 'Dashboard', icon: faTachometerAlt },
    { name: 'User Management', page: 'UserManagement', icon: faUsers },
    { name: 'Task Reports', page: 'TaskReports', icon: faListCheck },
    { name: 'Label Management', page: 'LabelManagement', icon: faTag },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
    
    // Color #388A2C is applied for the Sidebar
    const sidebarStyle: React.CSSProperties = {
        height: '100vh',
        width: '250px',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#388A2C', 
        paddingTop: '20px',
        zIndex: 1000,
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    };

    const linkStyle: React.CSSProperties = {
        color: '#d8ead5',
        padding: '15px 20px',
        textDecoration: 'none',
        display: 'block',
        transition: 'background-color 0.3s, color 0.3s',
    };

    const activeLinkStyle: React.CSSProperties = {
        backgroundColor: '#4CAF50', // Lighter color for active
        color: '#fff',
    };

    return (
        <div style={sidebarStyle} className="d-flex flex-column">
            <h3 className="text-white text-center mb-4 border-bottom pb-3">FRUVIA MANAGEMENT</h3>
            
            <nav className="flex-grow-1">
                {menuItems.map((item) => {
                    const isActive = item.page === activePage;
                    const combinedStyle: React.CSSProperties = {
                        ...linkStyle,
                        ...(isActive ? activeLinkStyle : {})
                    };

                    return (
                        <a
                            key={item.page}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate(item.page);
                            }}
                            className={isActive ? 'active' : ''}
                            style={combinedStyle}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = '#4CAF50';
                                    e.currentTarget.style.color = '#fff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#d8ead5';
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={item.icon} fixedWidth className="me-2" />
                            {item.name}
                        </a>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;