import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

// Định nghĩa Interface (giả sử đã được đặt trong src/interfaces/User.ts)
interface UserData {
    id: string;
    name: string;
    email: string;
    reg_date: string;
    tasks_created: number;
    completion_rate: string;
    status: 'Active' | 'Banned';
}

// Mock Data
const initialUserData: UserData[] = [
    { id: 'U001', name: 'Nguyen Van A', email: 'nva@example.com', reg_date: '2023-01-15', tasks_created: 580, completion_rate: '95%', status: 'Active' },
    { id: 'U002', name: 'Tran Thi B', email: 'ttb@example.com', reg_date: '2023-03-20', tasks_created: 510, completion_rate: '88%', status: 'Active' },
    { id: 'U003', name: 'Le Van C', email: 'lvc@example.com', reg_date: '2023-11-01', tasks_created: 12, completion_rate: '50%', status: 'Banned' },
    { id: 'U004', name: 'Hoang Thi D', email: 'htd@example.com', reg_date: '2024-05-10', tasks_created: 350, completion_rate: '92%', status: 'Active' },
    // ... thêm dữ liệu mock
];

// Styles cho trạng thái (dùng inline hoặc CSS Modules)
const statusStyles = {
    active: { backgroundColor: '#d4edda', color: '#155724' },
    banned: { backgroundColor: '#f8d7da', color: '#721c24' }
};


const UserManagement: React.FC = () => {
    const [userData, setUserData] = useState<UserData[]>(initialUserData);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Hàm mô phỏng Ban/Unban account
    const toggleStatus = (userId: string) => {
        setUserData(prevUsers => 
            prevUsers.map(user => {
                if (user.id === userId) {
                    const newStatus = user.status === 'Active' ? 'Banned' : 'Active';
                    // Sử dụng modal hoặc notification thay vì alert()
                    console.log(`Account ${user.name} has been ${newStatus === 'Banned' ? 'banned' : 'unbanned'}.`);
                    return { ...user, status: newStatus };
                }
                return user;
            })
        );
    };

    // Logic tìm kiếm và lọc dữ liệu (tối ưu bằng useMemo)
    const filteredUsers = useMemo(() => {
        return userData.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) || 
                                  user.email.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = !statusFilter || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [userData, searchText, statusFilter]);


    return (
        <>
            <h1 className="mb-4">User Management</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 fw-bold text-primary">System User List</h6>
                </div>
                <div className="card-body">
                    
                    {/* Search and Filter Inputs */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search by Name or Email..." 
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select" 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Filter by Status</option>
                                <option value="Active">Active</option>
                                <option value="Banned">Banned</option>
                            </select>
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Registration Date</th>
                                    <th>Tasks Created</th>
                                    <th>Completion Rate</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center">No matching users found.</td></tr>
                                ) : (
                                    filteredUsers.map(user => {
                                        const isBanned = user.status === 'Banned';
                                        const statusStyle = isBanned ? statusStyles.banned : statusStyles.active;
                                        const actionText = isBanned ? 'Unban' : 'Ban';
                                        const actionIcon = isBanned ? faLockOpen : faLock;
                                        const actionColor = isBanned ? 'btn-success' : 'btn-danger';

                                        return (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.reg_date}</td>
                                                <td>{user.tasks_created}</td>
                                                <td>{user.completion_rate}</td>
                                                <td><span className="badge" style={statusStyle}>{user.status}</span></td>
                                                <td>
                                                    <button className="btn btn-sm btn-info me-1"><FontAwesomeIcon icon={faEye} /> Details</button>
                                                    <button 
                                                        className={`btn btn-sm ${actionColor} action-btn`}
                                                        onClick={() => toggleStatus(user.id)}
                                                    >
                                                        <FontAwesomeIcon icon={actionIcon} /> {actionText}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination (Tĩnh) */}
                    <nav>
                        <ul className="pagination justify-content-end">
                            <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item disabled"><a className="page-link" href="#">...</a></li>
                            <li className="page-item"><a className="page-link" href="#">Next</a></li>
                        </ul>
                    </nav>

                </div>
            </div>
        </>
    );
};

export default UserManagement;