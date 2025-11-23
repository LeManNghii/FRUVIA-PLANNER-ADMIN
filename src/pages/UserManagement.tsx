import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestoreDb } from '../../config/FirebaseConfig';

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

// Interface cho Task
interface TaskDoc {
    id: string;
    createdBy?: string;
    completed?: boolean | string;
}

const UserManagement: React.FC = () => {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [tasks, setTasks] = useState<TaskDoc[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect 1: Lắng nghe realtime users và tasks từ Firebase
    useEffect(() => {
        console.log('🔥 Setting up Firebase listeners for users and tasks...');

        // Listen to users collection
        const usersColRef = collection(firestoreDb, 'users');
        const unsubscribeUsers = onSnapshot(
            usersColRef,
            (snapshot) => {
                const users = snapshot.docs.map((doc) => {
                    const data = doc.data() as any;

                    // Format registration date - Sử dụng startDate (đã có sẵn định dạng dd/mm/yyyy)
                    let regDate = 'N/A';
                    if (data.startDate) {
                        regDate = data.startDate;
                    } else if (data.startDateTs) {
                        // Fallback: Nếu không có startDate, dùng startDateTs
                        const date = new Date(data.startDateTs);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0'
                        );
                        const year = date.getFullYear();
                        regDate = `${day}/${month}/${year}`;
                    }

                    return {
                        id: doc.id,
                        name: data.name || 'Unknown User',
                        email: data.email || 'No email',
                        reg_date: regDate,
                        tasks_created: 0, // Sẽ tính toán sau
                        completion_rate: '0%', // Sẽ tính toán sau
                        status: (data.status || 'Active') as
                            | 'Active'
                            | 'Banned',
                    };
                });

                console.log(`✅ Loaded ${users.length} users from Firebase`);
                setUserData(users);
                setLoading(false);
            },
            (error) => {
                console.error('❌ User snapshot error:', error);
                setLoading(false);
            }
        );

        // Listen to tasks collection
        const tasksColRef = collection(firestoreDb, 'tasks');
        const unsubscribeTasks = onSnapshot(
            tasksColRef,
            (snapshot) => {
                const tasksData = snapshot.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...(doc.data() as any),
                        } as TaskDoc)
                );

                console.log(
                    `✅ Loaded ${tasksData.length} tasks from Firebase`
                );
                setTasks(tasksData);
            },
            (error) => {
                console.error('❌ Tasks snapshot error:', error);
            }
        );

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up Firebase listeners');
            unsubscribeUsers();
            unsubscribeTasks();
        };
    }, []);

    // useEffect 2: Tính toán tasks_created và completion_rate cho mỗi user
    useEffect(() => {
        if (userData.length === 0 || tasks.length === 0) return;

        console.log(
            '📊 Calculating tasks_created and completion_rate for each user...'
        );

        // Tạo Map để đếm tasks cho mỗi user
        const userTasksMap = new Map<
            string,
            { total: number; completed: number }
        >();

        // Đếm tasks cho mỗi user
        tasks.forEach((task) => {
            if (!task.createdBy) return;

            const userId = task.createdBy;
            const current = userTasksMap.get(userId) || {
                total: 0,
                completed: 0,
            };

            current.total++;

            // Kiểm tra task đã hoàn thành
            const isCompleted =
                task.completed === true || String(task.completed) === 'true';
            if (isCompleted) {
                current.completed++;
            }

            userTasksMap.set(userId, current);
        });

        // Cập nhật userData với tasks_created và completion_rate
        setUserData((prevUsers) =>
            prevUsers.map((user) => {
                const userTasks = userTasksMap.get(user.id);

                if (!userTasks) {
                    return {
                        ...user,
                        tasks_created: 0,
                        completion_rate: '0%',
                    };
                }

                const completionRate =
                    userTasks.total === 0
                        ? 0
                        : Math.round(
                              (userTasks.completed / userTasks.total) * 100
                          );

                return {
                    ...user,
                    tasks_created: userTasks.total,
                    completion_rate: `${completionRate}%`,
                };
            })
        );

        console.log('✅ Tasks calculation completed');
    }, [userData.length, tasks]);

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

    // Pagination logic
    const USERS_PER_PAGE = 8;
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, statusFilter]);

    // Lấy users cho trang hiện tại
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        const endIndex = startIndex + USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage]);

    // Tạo danh sách số trang để hiển thị
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            // Nếu <= 5 trang, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Nếu > 5 trang, hiển thị 1 2 3 ... lastPage
            pages.push(1, 2, 3);
            if (totalPages > 3) {
                pages.push('...');
            }
        }

        return pages;
    };

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
                                No.
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
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center">
                                    <p className="text-gray-500">
                                        Loading users from Firebase...
                                    </p>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-gray-500">
                                    {searchText || statusFilter !== 'All Status'
                                        ? 'No matching users found.'
                                        : 'No users found in Firebase.'}
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user, index) => {
                                // Tính số thứ tự dựa trên trang hiện tại
                                const rowNumber =
                                    (currentPage - 1) * USERS_PER_PAGE +
                                    index +
                                    1;

                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                                            {rowNumber}
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
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
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
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Chỉ hiển thị khi có nhiều hơn 8 users */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-5">
                    {/* Previous Button */}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="min-w-[36px] h-9 px-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        &lt;
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="text-gray-400 px-1">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page as number)}
                                className={`min-w-[36px] h-9 px-3 border rounded-md transition-all ${
                                    currentPage === page
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-primary'
                                }`}>
                                {page}
                            </button>
                        );
                    })}

                    {/* Next Button */}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="min-w-[36px] h-9 px-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
