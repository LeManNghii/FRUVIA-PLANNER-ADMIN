import React from 'react';

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

    return (
        <>
            <h1 className="mb-4">Overview Dashboard</h1>

            {/* KPI Cards Section */}
            <div className="row">
                {/* Total Users Card */}
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-primary h-100 py-2 kpi-card">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-primary text-uppercase mb-1">Total Users</div>
                                    <div className="h5 mb-0 fw-bold text-gray-800">15,480</div>
                                    <small className="text-success">+5.2% last month</small>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-user-group fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Các KPI Cards khác tương tự... */}
            </div>
            
            {/* Charts Section */}
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">New User Growth Chart (Mock)</h6>
                        </div>
                        <div className="card-body" style={{ minHeight: '300px' }}>
                            <p className="text-center text-muted pt-5">[Placeholder for Line Chart]</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Task Distribution by Label (Mock)</h6>
                        </div>
                        <div className="card-body" style={{ minHeight: '300px' }}>
                            <p className="text-center text-muted pt-5">[Placeholder for Pie/Bar Chart]</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Top Active Users Table */}
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Top 5 Most Active Users This Month</h6>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Tasks Created</th>
                                        <th>Completion Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topUsers.map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.name}</td>
                                            <td>{user.tasksCreated}</td>
                                            <td><span className={`badge ${user.badgeColor}`}>{user.completionRate}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;