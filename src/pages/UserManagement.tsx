import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

// Định nghĩa Interface
interface UserData {
    id: string;
    name: string;
    email: string;
    reg_date: string;
    tasks_created: number;
    completion_rate: string;
    status: 'Active' | 'Banned';
}

// Mock Data - matching the image
const initialUserData: UserData[] = [
    {
        id: '#001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        reg_date: '15-03-2024',
        tasks_created: 42,
        completion_rate: '85%',
        status: 'Active',
    },
    {
        id: '#002',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        reg_date: '12-03-2024',
        tasks_created: 28,
        completion_rate: '65%',
        status: 'Banned',
    },
    {
        id: '#003',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        reg_date: '10-03-2024',
        tasks_created: 56,
        completion_rate: '92%',
        status: 'Active',
    },
    {
        id: '#004',
        name: 'James Wilson',
        email: 'james.wilson@email.com',
        reg_date: '08-03-2024',
        tasks_created: 33,
        completion_rate: '45%',
        status: 'Active',
    },
    {
        id: '#005',
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        reg_date: '05-03-2024',
        tasks_created: 71,
        completion_rate: '78%',
        status: 'Active',
    },
];

const UserManagement: React.FC = () => {
    const [userData] = useState<UserData[]>(initialUserData);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Logic tìm kiếm và lọc dữ liệu
    const filteredUsers = useMemo(() => {
        return userData.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus =
                statusFilter === 'All Status' || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [userData, searchText, statusFilter]);

    return (
        <div className="w-full">
            {/* Header with Search and Filter */}
            <div className="mb-6">
                <div className="flex justify-between items-center gap-5">
                    {/* Search Box */}
                    <div className="relative flex-1 max-w-md">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Search user name..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj48cGF0aCBmaWxsPSIjMzMzIiBkPSJNNiA5TDEgNGgxMHoiLz48L3N2Zz4=')] bg-no-repeat bg-[right_12px_center] pr-10">
                            <option value="All Status">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Banned">Banned</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto mb-5">
                <table className="w-full min-w-[900px] border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                ID
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                User Name
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                Email
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                Registration Date
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                Task Created
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                Completion Rate
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                Status
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 border-b-2 border-gray-200">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-gray-500">
                                    No matching users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                                        {user.id}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {user.reg_date}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {user.tasks_created}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {user.completion_rate}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                user.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                                title="View Details">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                                title="Delete User">
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 py-5">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="min-w-[36px] h-9 px-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    &lt;
                </button>
                <button
                    onClick={() => setCurrentPage(1)}
                    className={`min-w-[36px] h-9 px-3 border rounded-md transition-all ${
                        currentPage === 1
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-primary'
                    }`}>
                    1
                </button>
                <button
                    onClick={() => setCurrentPage(2)}
                    className={`min-w-[36px] h-9 px-3 border rounded-md transition-all ${
                        currentPage === 2
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-primary'
                    }`}>
                    2
                </button>
                <button
                    onClick={() => setCurrentPage(3)}
                    className={`min-w-[36px] h-9 px-3 border rounded-md transition-all ${
                        currentPage === 3
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-primary'
                    }`}>
                    3
                </button>
                <span className="text-gray-400 px-1">...</span>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="min-w-[36px] h-9 px-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 hover:border-primary transition-all">
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
