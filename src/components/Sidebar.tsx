import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faUsers,
    faListCheck,
    faTag,
    type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

// Định nghĩa TypeScript Interface cho props
interface SidebarProps {
    activePage:
        | 'Dashboard'
        | 'UserManagement'
        | 'TaskReports'
        | 'LabelManagement';
    onNavigate: (page: string) => void;
}

// Định nghĩa cấu trúc menu
interface MenuItem {
    name: string;
    path: string;
    icon: IconDefinition;
}

const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/', icon: faTachometerAlt },
    { name: 'User Management', path: '/users', icon: faUsers },
    { name: 'Task Reports', path: '/tasks', icon: faListCheck },
    { name: 'Label Management', path: '/labels', icon: faTag },
];

const Sidebar: React.FC<SidebarProps> = () => {
    return (
        <div className="w-[250px] h-screen bg-[#266B1C] flex flex-col shadow-lg">
            <h3 className="text-white text-center mb-4 border-b border-white/20 pb-3 pt-5">
                FRUVIA MANAGEMENT
            </h3>

            <nav className="flex-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block px-5 py-4 text-[#d8ead5] no-underline transition-all ${
                                isActive
                                    ? 'bg-[#3D8C2A] text-white'
                                    : 'hover:bg-[#3D8C2A] hover:text-white'
                            }`
                        }>
                        {({ isActive }) => (
                            <>
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    fixedWidth
                                    className="me-2"
                                />
                                {item.name}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
