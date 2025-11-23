import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestoreDb } from '../../config/FirebaseConfig';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTasks, faCheckCircle, faChartLine, faTags } from "@fortawesome/free-solid-svg-icons";
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

// Giao diện cho Dữ liệu Người dùng (Đã thêm startDateTs)
interface UserDoc {
    id: string;
    email: string;
    name: string;
    startDateTs?: any; // Giả định đây là trường lưu timestamp đăng ký
    // ... các trường khác
}

// Giao diện cho Dữ liệu Task (Tối thiểu cần thiết)
interface TaskDoc {
    id: string;
    category?: any;
    createdAt?: any;
    completed?: boolean | string;
    createdBy?: string;
    dueDate?: any;
}

// Giao diện cho Người dùng Đang hoạt động/Top Users
interface ActiveUser {
    id: string; 
    name: string; 
    tasksDue: number; // TỔNG số task có dueDate trong tháng này
    completedDue: number; // Số task đã hoàn thành trong số đó
}

const Dashboard: React.FC = () => {

    // --- State cho Dữ liệu Firebase ---
    interface Category {
        id: string;
        name: string;
        color: string;
    }

    const [categories, setCategories] = useState<Category[]>([]);
    const [tasks, setTasks] = useState<TaskDoc[]>([]);
    const [users, setUsers] = useState<UserDoc[]>([]);
    const [pieData, setPieData] = useState<{ name: string; value: number; color?: string }[]>([]);
    const [monthlyUserData, setMonthlyUserData] = useState<{ day: number; count: number }[]>([]); // State mới cho biểu đồ đường
    const [kpi, setKpi] = useState({ 
        totalUsers: 0, 
        newTasks: 0, 
        avgCompletionRate: 0, 
        activeUsers: 0 
    });
    const [topUsersData, setTopUsersData] = useState<ActiveUser[]>([]);

    // --- Hàm tiện ích cho Ngày Tháng ---
    // Xử lý cả Timestamp, Firestore Timestamp object, và Date String
    const parseDate = (v: any): Date | null => {
        if (v == null) return null;
        if (typeof v === 'object' && typeof v.toDate === 'function') return v.toDate();
        if (typeof v === 'number') return new Date(v);
        if (typeof v === 'string') {
            const d = new Date(v);
            return isNaN(d.getTime()) ? null : d;
        }
        return null;
    };

    // --- useEffect 1: Fetch Dữ liệu (Tasks, Categories, Users) ---
    useEffect(() => {
        // 1. Listen to categories collection
        const catCol = collection(firestoreDb, 'category');
        const unsubCat = onSnapshot(catCol, (snap) => {
            const items = snap.docs.map((d) => ({ 
                id: d.id, 
                ...(d.data() as any) 
            } as Category));
            setCategories(items);
        });

        // 2. Listen to tasks collection
        const taskCol = collection(firestoreDb, 'tasks');
        const unsubTask = onSnapshot(taskCol, (snap) => {
            const items = snap.docs.map((d) => ({ 
                id: d.id, 
                ...(d.data() as any) 
            } as TaskDoc));
            setTasks(items);
        });

        // 3. Listen to users collection
        const userCol = collection(firestoreDb, 'users');
        const unsubUser = onSnapshot(userCol, (snap) => {
            const items = snap.docs.map((d) => ({ 
                id: d.id, 
                ...(d.data() as any) 
            } as UserDoc));
            setUsers(items);
            // KPI 1: Total Users (Không quan tâm thời gian)
            setKpi(prev => ({ ...prev, totalUsers: items.length }));
        });

        return () => {
            unsubCat();
            unsubTask();
            unsubUser();
        };
    }, []);

    // --- useEffect 2: Tính toán KPI, Top Users, Pie Chart & User Growth Data ---
    useEffect(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Khởi tạo các biến tính toán
        let newTasksCount = 0;
        const activeUserIds = new Set<string>();
        let totalTasksWithDueDateInMonth = 0;
        let completedTasksWithDueDateInMonth = 0;
        
        const userDueTasksCounts = new Map<string, { total: number, completed: number }>();
        const categoryCounts = new Map<string, number>();
        
        // Tính toán New User Growth Chart (MỚI)
        const dailyUserCounts = new Array(daysInMonth).fill(0);


        tasks.forEach((t) => {
            const createdAt = parseDate(t.createdAt);
            const dueDate = parseDate(t.dueDate);
            const hasCompletedFlag = t.completed === true || String(t.completed) === 'true';

            // --- A. Tính New Tasks & Active Users (dựa trên createdAt) ---
            if (createdAt && createdAt.getTime() >= startOfMonth && createdAt.getTime() <= endOfMonth) {
                // KPI 2: New Tasks
                newTasksCount++;
                
                // KPI 4: Active Users (Người tạo task mới trong tháng)
                if (t.createdBy) {
                    activeUserIds.add(t.createdBy);
                }
            }

            // --- B. Tính Avg. Completion Rate & Top Users (dựa trên dueDate trong tháng) ---
            if (dueDate) {
                const dueMonth = dueDate.getMonth();
                const dueYear = dueDate.getFullYear();

                if (dueMonth === currentMonth && dueYear === currentYear) {
                    
                    // 1. Tính toán Avg. Completion Rate (của tổ chức)
                    totalTasksWithDueDateInMonth++;

                    if (hasCompletedFlag) {
                        completedTasksWithDueDateInMonth++;
                    }

                    // 2. Tính toán Top Users (cá nhân)
                    if (t.createdBy) {
                         const currentCounts = userDueTasksCounts.get(t.createdBy) || { total: 0, completed: 0 };
                    
                        currentCounts.total++; // Tasks (Due this Month)

                        if (hasCompletedFlag) {
                            currentCounts.completed++; // Completed (Due this Month)
                        }
                        
                        userDueTasksCounts.set(t.createdBy, currentCounts);
                    }
                }
            }
            
            // --- C. Logic Category Distribution (Giữ nguyên) ---
            const categoryValue = String(t.category || '').trim();
            let catKey: string;
            
            if (categoryValue.length > 0) {
                catKey = categoryValue;
            } else {
                catKey = '__uncat__';
            }
            categoryCounts.set(catKey, (categoryCounts.get(catKey) || 0) + 1);
        });
        
        // --- D. Tính toán New User Growth Chart Data (Giữ nguyên) ---
        users.forEach((u) => {
            const userCreateDate = parseDate(u.startDateTs); 
            
            if (userCreateDate && 
                userCreateDate.getMonth() === currentMonth && 
                userCreateDate.getFullYear() === currentYear
            ) {
                // Day of month is 1-based, array is 0-based
                const dayOfMonth = userCreateDate.getDate(); 
                if (dayOfMonth >= 1 && dayOfMonth <= daysInMonth) {
                    dailyUserCounts[dayOfMonth - 1] += 1;
                }
            }
        });
        
        // Format data for Recharts
        const userGrowthData = dailyUserCounts.map((count, index) => ({
            day: index + 1, // Day number (1, 2, 3, ...)
            count: count,   // Number of users registered on that day
        }));
        setMonthlyUserData(userGrowthData);


        // 4. Final Calculations
        
        // Tính Avg Completion Rate
        const avgCompletionRate = totalTasksWithDueDateInMonth === 0 
            ? 0 
            : Math.round((completedTasksWithDueDateInMonth / totalTasksWithDueDateInMonth) * 100);

        // Cập nhật KPI
        setKpi(prev => ({ 
            ...prev, 
            newTasks: newTasksCount, 
            avgCompletionRate: avgCompletionRate, 
            activeUsers: activeUserIds.size 
        }));

        // --- Xử lý Top Users (Giữ nguyên) ---
        const userMap = new Map(users.map(u => [u.id, u.name]));
        
        const topUsersResult: ActiveUser[] = Array.from(userDueTasksCounts.entries())
            .map(([userId, counts]) => ({
                id: userId,
                name: userMap.get(userId) || `Unknown User (${userId})`,
                tasksDue: counts.total, 
                completedDue: counts.completed, 
            }))
            .sort((a, b) => b.completedDue - a.completedDue)
            .slice(0, 5);
            
        setTopUsersData(topUsersResult);
        
        // --- Xử lý Pie Chart (Giữ nguyên) ---
        const pieChartResult: { name: string; value: number; color?: string }[] = [];
        const categoryNameMap = new Map(categories.map(c => [c.name, c]));

        categoryCounts.forEach((value, catKey) => {
            if (catKey === '__uncat__') return;

            let foundCategory = categories.find(c => c.id === catKey);

            if (!foundCategory) {
                foundCategory = categoryNameMap.get(catKey);
            }

            if (foundCategory) {
                pieChartResult.push({ name: foundCategory.name, value, color: foundCategory.color });
            } else {
                pieChartResult.push({ name: catKey, value, color: undefined });
            }
        });

        const uncategorizedCount = categoryCounts.get('__uncat__') || 0;
        if (uncategorizedCount > 0) {
            pieChartResult.push({ name: 'Uncategorized', value: uncategorizedCount, color: '#9CA3AF' });
        }

        setPieData(pieChartResult);
        
    }, [categories, tasks, users]);


    return (
        <>
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* 1. Total Users */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between border-l-4 border-blue-500">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase">Total Users</p>
                        <p className="text-3xl font-bold">{kpi.totalUsers}</p>
                        <p className="text-gray-600 text-sm">Total registered users</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-3xl" />
                    </div>
                </div>

                {/* 2. New Tasks (This Month) */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between border-l-4 border-green-500">
                    <div>
                        <p className="text-xs font-semibold text-green-600 uppercase">New Tasks</p>
                        <p className="text-3xl font-bold">{kpi.newTasks}</p>
                        <p className="text-gray-600 text-sm">tasks created since month start</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faTasks} className="text-green-600 text-3xl" />
                    </div>
                </div>

                {/* 3. Avg Completion Rate (By Due Date) */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between border-l-4 border-purple-500">
                    <div>
                        <p className="text-xs font-semibold text-purple-600 uppercase">Avg. Completion Rate</p>
                        <p className="text-3xl font-bold">{kpi.avgCompletionRate}%</p>
                        <p className="text-gray-600 text-sm">of tasks due this month</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-500 text-3xl" />
                    </div>
                </div>

                {/* 4. Active Users (This Month) */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between border-l-4 border-orange-500">
                    <div>
                        <p className="text-xs font-semibold text-orange-600 uppercase">Active Users</p>
                        <p className="text-3xl font-bold">{kpi.activeUsers}</p>
                        <p className="text-gray-600 text-sm">created tasks this month</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faTags} className="text-orange-500 text-3xl" />
                    </div>
                </div>

            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-4">
                {/* New User Growth Chart */}
                <div>
                     <div className="card shadow mb-4 bg-white rounded-lg">
                        <div className="card-header py-3 pl-3">
                            <h6 className="m-0 fw-bold text-primary">New User Growth Chart (This Month)</h6>
                        </div>
                        <div className="card-body p-4" style={{ minHeight: '300px' }}>
                            {monthlyUserData.reduce((s, d) => s + d.count, 0) === 0 ? (
                                <p className="text-center text-muted pt-5">No new users registered this month.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={monthlyUserData}>
                                        <defs>
                                            <linearGradient id="colorUserCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" label={{ value: 'Day of Month', position: 'bottom' }} />
                                        <YAxis allowDecimals={false}/>
                                        <Tooltip />
                                        <Area type="monotone" dataKey="count" stroke="#2ecc71" fillOpacity={1} fill="url(#colorUserCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
                {/* Task Distribution by Category */}
                <div>
                     <div className="card shadow mb-4 bg-white rounded-lg">
                        <div className="card-header py-3 pl-3">
                            <h6 className="m-0 fw-bold text-primary">Task Distribution by Category</h6>
                        </div>
                        <div className="card-body pl-3" style={{ minHeight: '300px' }}>
                            {pieData.reduce((s, p) => s + p.value, 0) === 0 ? (
                                <p className="text-center text-muted pt-5">No task distribution data available.</p>
                            ) : (
                                <TaskDistributionPieChart data={pieData} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Top 5 Users by Performance Table */}
            <div className="bg-white rounded-lg shadow px-4 mt-2">
                <div className="card-header py-3">
                    <h6 className="m-0 fw-bold text-primary">Top 5 Users by Performance (Due This Month)</h6>
                </div>
                <div className="p-4 space-y-3">
                    {topUsersData.length === 0 ? (
                        <p className="text-center text-muted pt-3">No tasks due this month were found.</p>
                    ) : (
                        topUsersData.map((user, index) => {
                            // Tính toán tỷ lệ phần trăm hoàn thành
                            const completionPercentage = user.tasksDue === 0 
                                ? 0 
                                : Math.round((user.completedDue / user.tasksDue) * 100);

                            return (
                                <div
                                    key={user.id}
                                    className="bg-gray-100 p-3 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition duration-150 shadow-sm"
                                >
                                    {/* Cột 1: Tên Người Dùng + Progress Bar */}
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-base font-medium text-orange-700 truncate">
                                            {user.name}
                                        </p>
                                        
                                        {/* Progress Bar */}
                                        <div className="mt-1 flex items-center">
                                            <div className="w-full bg-gray-300 rounded-full h-2.5">
                                                <div 
                                                    className="bg-purple-600 h-2.5 rounded-full" 
                                                    style={{ width: `${completionPercentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-xs font-semibold text-gray-700">
                                                {completionPercentage}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cột 2: Tasks (Due this Month) */}
                                    <div className="flex-shrink-0 mx-4 text-center">
                                        <p className="text-xs text-gray-500 uppercase">Tasks</p>
                                        <p className="text-lg font-semibold text-indigo-700">
                                            {user.tasksDue}
                                        </p>
                                    </div>

                                    {/* Cột 3: Completed Task Count */}
                                    <div className="flex-shrink-0 mx-4 text-center">
                                        <p className="text-xs text-gray-500 uppercase">Completed</p>
                                        <p className="text-lg font-semibold text-green-700">
                                            {user.completedDue}
                                        </p>
                                    </div>
                                </div>
                            );
                        }))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;