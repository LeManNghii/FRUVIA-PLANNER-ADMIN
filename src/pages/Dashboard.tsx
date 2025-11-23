import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestoreDb } from '../../config/FirebaseConfig';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTasks, faCheckCircle, faTags } from "@fortawesome/free-solid-svg-icons";
import TaskDistributionPieChart from '../components/TaskDistributionPieChart';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Dữ liệu mô phỏng cho bảng Top Active Users
interface ActiveUser {
    name: string;
    tasksCreated: number;
    completionRate: string;
    badgeColor: string;
}

const topUsers: ActiveUser[] = [
    { name: 'Nguyen Van A', tasksCreated: 580, completionRate: '95%', badgeColor: 'bg-success' },
    { name: 'Tran Thi B', tasksCreated: 510, completionRate: '88%', badgeColor: 'bg-info' },
    { name: 'Phan Van C', tasksCreated: 490, completionRate: '92%', badgeColor: 'bg-success' },
    { name: 'Hoang Thi D', tasksCreated: 450, completionRate: '78%', badgeColor: 'bg-warning' },
    { name: 'Le Van E', tasksCreated: 400, completionRate: '85%', badgeColor: 'bg-info' },
];

const Dashboard: React.FC = () => {

    // Categories and tasks state fetched from Firebase
    interface Category {
        id: string;
        name: string;
        color: string;
    }

    interface TaskDoc {
        id: string;
        category?: any;
    }

    const [categories, setCategories] = useState<Category[]>([]);
    const [tasks, setTasks] = useState<TaskDoc[]>([]);
    const [pieData, setPieData] = useState<{ name: string; value: number; color?: string }[]>([]);

    useEffect(() => {
        // Listen to categories collection (collection name: 'category')
        const catCol = collection(firestoreDb, 'category');
        const unsubCat = onSnapshot(
            catCol,
            (snap) => {
                const items = snap.docs.map((d) => {
                    const data = d.data() as any;
                    return {
                        id: d.id,
                        name: data.title || 'Untitled',
                        color: data.color || '#3D8BFF',
                    } as Category;
                });
                setCategories(items);
            },
            (err) => {
                console.error('Category snapshot error', err);
            }
        );

        // Listen to tasks collection (collection name: 'task')
        const taskCol = collection(firestoreDb, 'tasks');
        const unsubTask = onSnapshot(
            taskCol,
            (snap) => {
                const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as TaskDoc));
                setTasks(items);
            },
            (err) => {
                console.error('Task snapshot error', err);
            }
        );

        return () => {
            unsubCat();
            unsubTask();
        };
    }, []);

    // Recompute pie data whenever categories or tasks change
    useEffect(() => {
        const counts = new Map<string, number>();

        tasks.forEach((t) => {
            let catId: string;
            if (!t.category && t.category !== 0) {
                catId = '__uncat__';
            } else if (typeof t.category === 'string') {
                catId = t.category;
            } else if (typeof t.category === 'object') {
                // If stored as reference-like object or nested object
                catId = (t.category.id as string) || (t.category.title as string) || JSON.stringify(t.category);
            } else {
                catId = String(t.category);
            }

            counts.set(catId, (counts.get(catId) || 0) + 1);
        });

        const result: { name: string; value: number; color?: string }[] = [];

        // Map known categories
        categories.forEach((c) => {
            const value = counts.get(c.id) || 0;
            if (value > 0) {
                result.push({ name: c.name, value, color: c.color });
                counts.delete(c.id);
            }
        });

        // Any remaining counts are uncategorized (or category stored by title/id not matching documents)
        const uncategorizedCount = counts.get('__uncat__') || 0;
        // Also include any other leftover keys as separate slices if they look like category titles
        counts.forEach((v, k) => {
            if (k === '__uncat__') return;
            // try to find by title matching
            const found = categories.find((c) => c.name === k);
            if (!found) {
                // represent leftover category as its key
                result.push({ name: k, value: v, color: undefined });
            }
        });

        if (uncategorizedCount > 0) {
            result.push({ name: 'Uncategorized', value: uncategorizedCount, color: '#9CA3AF' });
        }

        setPieData(result);
        console.log("Task Counts:", counts); // Kiểm tra số lượng đếm được theo ID
        console.log("Pie Data Result:", result); // Kiểm tra kết quả cuối cùng
    }, [categories, tasks]);

    return (
        <>
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* Total Users */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase">Total Users</p>
                        <p className="text-3xl font-bold">2,847</p>
                        <p className="text-green-600 text-sm">+12% from last month</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-3xl" />
                    </div>
                </div>

                {/* New Tasks */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-green-600 uppercase">New Tasks</p>
                        <p className="text-3xl font-bold">1,234</p>
                        <p className="text-green-600 text-sm">+8% from last week</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faTasks} className="text-green-600 text-3xl" />
                    </div>
                </div>

                {/* Avg Completion Rate */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-purple-600 uppercase">Avg. Completion Rate</p>
                        <p className="text-3xl font-bold">89%</p>
                        <p className="text-red-500 text-sm">-3% from last week</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-500 text-3xl" />
                    </div>
                </div>

                {/* Daily Active Users */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-orange-600 uppercase">Active Users</p>
                        <p className="text-3xl font-bold">156</p>
                        <p className="text-green-600 text-sm">+5% from last month</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faTags} className="text-orange-500 text-3xl" />
                    </div>
                </div>

            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <div className="card shadow mb-4 bg-white rounded-lg">
                        <div className="card-header py-3 pl-3">
                            <h6 className="m-0 fw-bold text-primary">New User Growth Chart (Mock)</h6>
                        </div>
                        <div className="card-body" style={{ minHeight: '300px' }}>
                            <p className="text-center text-muted pt-5">[Placeholder for Line Chart]</p>
                        </div>
                    </div>
                </div>
                <div>
                     <div className="card shadow mb-4 bg-white rounded-lg">
                        <div className="card-header py-3 pl-3">
                            <h6 className="m-0 fw-bold text-primary">Task Distribution by Category</h6>
                        </div>
                        <div className="card-body" style={{ minHeight: '300px' }}>
                            {pieData.length === 0 ? (
                                <p className="text-center text-muted pt-5">No task distribution data available.</p>
                            ) : (
                                <TaskDistributionPieChart data={pieData} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Top Recent Active Users Table */}
            <div className="bg-white rounded-lg shadow px-4 mt-2">
                <div className="card-header py-3">
                    <h6 className="m-0 fw-bold text-primary">Top 5 Recent Active Users</h6>
                </div>
                <div className="p-4 space-y-3">
                    {topUsers.map((user, index) => {
                    // 1. Trích xuất giá trị số từ chuỗi (ví dụ: "95%" -> 95)
                    // Dùng parseFloat để đảm bảo xử lý cả số thập phân nếu có
                    const completionValue = parseFloat(user.completionRate); 

                    // 2. Xác định class màu dựa trên giá trị
                    let badgeClass = '';
                    
                    if (completionValue >= 90) {
                    // >= 90% -> Xanh lá
                    badgeClass = 'bg-green-500';
                    } else if (completionValue >= 70 && completionValue < 90) {
                    // 70% <= x < 90% -> Vàng
                    badgeClass = 'bg-yellow-500';
                    } else {
                    // < 70% -> Đỏ
                    badgeClass = 'bg-red-500';
                    }

                    return (
                    <div
                        key={index}
                        className="bg-gray-100 p-3 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition duration-150 shadow-sm"
                    >
                        {/* Cột 1: Tên Người Dùng */}
                        <div className="flex-1 min-w-0 pr-4">
                        <p className="text-base font-medium text-gray-800 truncate">
                            {user.name}
                        </p>
                        </div>

                        {/* Cột 2: Tasks Created */}
                        <div className="flex-shrink-0 mx-4 text-center hidden sm:block">
                        <p className="text-xs text-gray-500 uppercase">Tasks</p>
                        <p className="text-lg font-semibold text-indigo-700">
                            {user.tasksCreated}
                        </p>
                        </div>

                        {/* Cột 3: Completion Rate (Badge) */}
                        <div className="flex-shrink-0 ml-4">
                        <p className="text-xs text-gray-500 uppercase">Completed</p>
                        <p
                            // Áp dụng class màu đã tính toán
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${badgeClass} text-white text-center`}
                        >
                            {user.completionRate}
                        </p>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
        </>
    );
};

export default Dashboard;