import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faHourglassHalf, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const TaskReports: React.FC = () => {

    return (
        <>
            <h1 className="mb-4">Task Reports</h1>

            {/* KPI Cards Section */}
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card kpi-card-report border-danger h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-danger text-uppercase mb-1">
                                        Overdue Tasks (Total)
                                    </div>
                                    <div className="h5 mb-0 fw-bold text-gray-800">1,250</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon={faClock} size="2x" className="text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card kpi-card-report border-warning h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-warning text-uppercase mb-1">
                                        Tasks Due Soon (24h)
                                    </div>
                                    <div className="h5 mb-0 fw-bold text-gray-800">450</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon={faHourglassHalf} size="2x" className="text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card kpi-card-report border-primary h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                                        On-Time Completion Rate (Monthly)
                                    </div>
                                    <div className="h5 mb-0 fw-bold text-gray-800">75% <small className="text-success">(Up 2% from last month)</small></div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon={faCalendarCheck} size="2x" className="text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Critical Overdue Tasks Table */}
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-danger">List of Critical Overdue Tasks</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Task ID</th>
                                            <th>Task Name</th>
                                            <th>Deadline</th>
                                            <th>User</th>
                                            <th>Label</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>T001</td>
                                            <td>Complete Quarterly Report</td>
                                            <td className="text-danger">2025-11-15</td>
                                            <td>Nguyen Van A</td>
                                            <td><span className="badge bg-primary">Work</span></td>
                                            <td>6 days overdue</td>
                                        </tr>
                                        <tr>
                                            <td>T002</td>
                                            <td>Schedule Health Check-up</td>
                                            <td className="text-danger">2025-11-20</td>
                                            <td>Tran Thi B</td>
                                            <td><span className="badge bg-success">Health</span></td>
                                            <td>1 day overdue</td>
                                        </tr>
                                        <tr>
                                            <td>T003</td>
                                            <td>Mobile App Project Phase 1</td>
                                            <td className="text-danger">2025-11-05</td>
                                            <td>Le Van C</td>
                                            <td><span className="badge bg-secondary">Project</span></td>
                                            <td>16 days overdue</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskReports;