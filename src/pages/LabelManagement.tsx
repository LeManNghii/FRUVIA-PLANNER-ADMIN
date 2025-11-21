import React, { useState, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// 1. Định nghĩa Interface
interface Label {
    id: number;
    name: string;
    color: string;
    usage: number;
}

// Mock Data
const initialLabels: Label[] = [
    { id: 1, name: 'Work', color: '#007bff', usage: 15000 },
    { id: 2, name: 'Personal', color: '#28a745', usage: 8000 },
    { id: 3, name: 'Study', color: '#ffc107', usage: 4500 },
    { id: 4, name: 'Health', color: '#dc3545', usage: 2100 },
];

const LabelManagement: React.FC = () => {
    const [labels, setLabels] = useState<Label[]>(initialLabels);
    let nextId = Math.max(...labels.map(l => l.id), 0) + 1;

    // State để quản lý dữ liệu trong form (dùng cho cả Add và Edit)
    const [formData, setFormData] = useState<Omit<Label, 'usage'> & { id: number | null }>({
        id: null,
        name: '',
        color: '#007bff',
    });

    // Hàm thay đổi trạng thái Form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Hàm xử lý Submit Form
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (formData.id !== null) {
            // Update
            setLabels(prevLabels => 
                prevLabels.map(label => label.id === formData.id ? { ...label, name: formData.name, color: formData.color } : label)
            );
            // Sử dụng console.log thay cho alert()
            console.log('Label updated successfully!');
        } else {
            // Create
            const newLabel: Label = {
                id: nextId++,
                name: formData.name,
                color: formData.color,
                usage: 0,
            };
            setLabels(prevLabels => [...prevLabels, newLabel]);
            console.log('New label added successfully!');
        }
        resetForm();
    };

    // Hàm xóa nhãn
    const deleteLabel = (id: number) => {
        // Thay thế window.confirm bằng modal UI
        if (window.confirm('Are you sure you want to delete this label?')) {
            setLabels(prevLabels => prevLabels.filter(label => label.id !== id));
            console.log('Label deleted successfully!');
        }
    };

    // Hàm tải dữ liệu vào form (Edit)
    const editLabel = (id: number) => {
        const labelToEdit = labels.find(l => l.id === id);
        if (labelToEdit) {
            setFormData({
                id: labelToEdit.id,
                name: labelToEdit.name,
                color: labelToEdit.color,
            });
        }
    };

    // Hàm reset form
    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            color: '#007bff',
        });
    };

    const formTitle = formData.id !== null ? `Edit Label: ${formData.name}` : 'Add New Label';
    const submitText = formData.id !== null ? 'Update' : 'Add Label';
    
    return (
        <>
            <h1 className="mb-4">Label/Category Management</h1>

            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">{formTitle}</h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" id="labelId" value={formData.id ?? ''} />
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Label Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="color" className="form-label">Color Code (Hex)</label>
                                    <input 
                                        type="color" 
                                        className="form-control form-control-color" 
                                        id="color" 
                                        value={formData.color} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">{submitText}</button>
                                <button 
                                    type="button" 
                                    className={`btn btn-secondary ms-2 ${formData.id === null ? 'd-none' : ''}`} 
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Current Label List</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Label</th>
                                            <th>Color Code</th>
                                            <th>Usage Frequency (Mock)</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labels.map(label => (
                                            <tr key={label.id}>
                                                <td>{label.id}</td>
                                                <td><span className="badge" style={{ backgroundColor: label.color, color: '#fff' }}>{label.name}</span></td>
                                                <td>{label.color}</td>
                                                <td>{label.usage.toLocaleString()}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-warning me-1" onClick={() => editLabel(label.id)}><FontAwesomeIcon icon={faEdit} /> Edit</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => deleteLabel(label.id)}><FontAwesomeIcon icon={faTrash} /> Delete</button>
                                                </td>
                                            </tr>
                                        ))}
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

export default LabelManagement;