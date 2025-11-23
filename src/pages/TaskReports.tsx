import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faWarning } from '@fortawesome/free-solid-svg-icons';
import { faTasks, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestoreDb } from '../../config/FirebaseConfig';
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

const TaskReports: React.FC = () => {
    type TaskDoc = {
        id: string;
        title?: string;
        dueDate?: any;
        createdAt?: any;
        completedAt?: any;
        status?: string;
        [k: string]: any;
    };

    const [tasks, setTasks] = useState<TaskDoc[]>([]);
    const [kpi, setKpi] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
    const [pieData, setPieData] = useState<{ name: string; value: number; color?: string }[]>([]);
    const [weekData, setWeekData] = useState<{ day: string; count: number }[]>([]);

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

    useEffect(() => {
        const col = collection(firestoreDb, 'tasks');
        const unsub = onSnapshot(col, (snap) => {
            const docs: TaskDoc[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as TaskDoc));
            setTasks(docs);

            // compute month range
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

            let total = 0;
            let completed = 0;
            let pending = 0;
            let overdue = 0;

            const combineDateAndTime = (dateObj: Date, timeObj: Date): Date => {
                // Combine local date (Y/M/D) from dateObj and local time (H/M/S/ms) from timeObj
                const y = dateObj.getFullYear();
                const m = dateObj.getMonth();
                const d = dateObj.getDate();
                const hh = timeObj.getHours();
                const mm = timeObj.getMinutes();
                const ss = timeObj.getSeconds();
                const ms = timeObj.getMilliseconds();
                return new Date(y, m, d, hh, mm, ss, ms);
            };

            docs.forEach((t) => {
                const createdAt = parseDate(t.createdAt);
                const dueTime = parseDate(t.dueTime);
                const dueDate = parseDate(t.dueDate);

                const hasCompletedFlag = t.completed === true || String(t.completed) === 'true';

                // Consider tasks created in the current month for KPI
                if (createdAt && createdAt.getTime() >= startOfMonth && createdAt.getTime() <= endOfMonth) {
                    total++;

                    if (hasCompletedFlag) {
                        completed++;
                    } else {
                        // Determine deadline by combining date from dueDate and time from dueTime
                        let compare: Date | null = null;
                        if (dueDate && dueTime) {
                            compare = combineDateAndTime(dueDate, dueTime);
                        } else if (dueDate) {
                            compare = dueDate;
                        } else if (dueTime) {
                            compare = dueTime;
                        }

                        if (!compare) {
                            // No due info -> consider pending
                            pending++;
                        } else {
                            const dt = compare.getTime();
                            if (Date.now() < dt) {
                                pending++;
                            } else {
                                overdue++;
                            }
                        }
                    }
                }
            });

            setKpi({ total, completed, pending, overdue });

            const pie = [
                { name: 'Completed', value: completed, color: '#2ecc71' },
                { name: 'Pending', value: pending, color: '#f1c40f' },
                { name: 'Overdue', value: overdue, color: '#e74c3c' },
            ];
            setPieData(pie);

            // week data (Mon-Sun) for dueDate in current week
            const today = new Date();
            const dayIdx = (today.getDay() + 6) % 7; // 0=Mon
            const startOfWeekDate = new Date(today);
            startOfWeekDate.setDate(today.getDate() - dayIdx);
            startOfWeekDate.setHours(0, 0, 0, 0);
            const startMs = startOfWeekDate.getTime();
            const counts = new Array(7).fill(0);
            const msInDay = 24 * 60 * 60 * 1000;
            docs.forEach((t) => {
                const dueDateObj = parseDate(t.dueDate);
                const dueTimeObj = parseDate(t.dueTime);
                if (!dueDateObj && !dueTimeObj) return;

                let deadline: Date | null = null;
                if (dueDateObj && dueTimeObj) {
                    deadline = combineDateAndTime(dueDateObj, dueTimeObj);
                } else {
                    deadline = dueDateObj || dueTimeObj;
                }

                if (!deadline) return;

                const dms = deadline.getTime();
                const diff = dms - startMs;
                if (diff >= 0 && diff < 7 * msInDay) {
                    const idx = Math.floor(diff / msInDay);
                    counts[idx] = (counts[idx] || 0) + 1;
                }
            });
            const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const weekArr = labels.map((lab, i) => ({ day: lab, count: counts[i] || 0 }));
            setWeekData(weekArr);
        });

        return () => unsub();
    }, []);

    return (
        <>
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase">Total Tasks (this month)</p>
                        <p className="text-3xl font-bold">{kpi.total}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faTasks} className="text-blue-600 text-3xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-green-600 uppercase">Completed (this month)</p>
                        <p className="text-3xl font-bold">{kpi.completed}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-3xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-yellow-600 uppercase">Pending (this month)</p>
                        <p className="text-3xl font-bold">{kpi.pending}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faClock} className="text-yellow-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-red-600 uppercase">Over Due (this month)</p>
                        <p className="text-3xl font-bold">{kpi.overdue}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faWarning} className="text-red-500 text-3xl" />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="card shadow mb-4 bg-white rounded-lg">
                        <div className="card-header py-3 pl-3">
                            <h6 className="m-0 fw-bold text-primary">Workload Over Time (Due this week)</h6>
                        </div>
                        <div className="card-body p-4" style={{ minHeight: 400 }}>
                            {weekData.length === 0 ? (
                                <p className="text-center text-muted pt-5">No due-date data for this week.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={weekData}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="count" stroke="#2ecc71" fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card shadow mb-4 bg-white rounded-lg">
                        <div className="card-header py-3 pl-3">
                            <h6 className="m-0 fw-bold text-primary">Task Distribution (this month)</h6>
                        </div>
                        <div className="card-body p-4" style={{ minHeight: 400 }}>
                            {pieData.reduce((s, p) => s + p.value, 0) === 0 ? (
                                <p className="text-center text-muted pt-5">No task distribution data available.</p>
                            ) : (
                                <TaskDistributionPieChart data={pieData} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskReports;