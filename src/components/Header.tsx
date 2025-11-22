import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faSignOutAlt,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsDropdownOpen(false);
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left side - Logo/Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Fruvia Planner
                            </h1>
                            <p className="text-xs text-gray-500">Admin Dashboard</p>
                        </div>
                    </div>

                    {/* Right side - User Menu */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            {/* User Avatar */}
                            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-white text-sm"
                                />
                            </div>

                            {/* User Info */}
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email || ''}
                                </p>
                            </div>

                            {/* Dropdown Icon */}
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`text-gray-400 text-sm transition-transform ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                {/* User Info in Dropdown (mobile) */}
                                <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.email || ''}
                                    </p>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600">
                                    <FontAwesomeIcon
                                        icon={faSignOutAlt}
                                        className="text-sm"
                                    />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

