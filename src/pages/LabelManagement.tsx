import React, { useState, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

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
    let nextId = Math.max(...labels.map((l) => l.id), 0) + 1;

    // State để quản lý dữ liệu trong form (dùng cho cả Add và Edit)
    const [formData, setFormData] = useState<
        Omit<Label, 'usage'> & { id: number | null }
    >({
        id: null,
        name: '',
        color: '#007bff',
    });

    // Hàm thay đổi trạng thái Form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Hàm xử lý Submit Form
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.id !== null) {
            // Update
            setLabels((prevLabels) =>
                prevLabels.map((label) =>
                    label.id === formData.id
                        ? {
                              ...label,
                              name: formData.name,
                              color: formData.color,
                          }
                        : label
                )
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
            setLabels((prevLabels) => [...prevLabels, newLabel]);
            console.log('New label added successfully!');
        }
        resetForm();
    };

    // Hàm xóa nhãn
    const deleteLabel = (id: number) => {
        // Thay thế window.confirm bằng modal UI
        if (window.confirm('Are you sure you want to delete this label?')) {
            setLabels((prevLabels) =>
                prevLabels.filter((label) => label.id !== id)
            );
            console.log('Label deleted successfully!');
        }
    };

    // Hàm tải dữ liệu vào form (Edit)
    const editLabel = (id: number) => {
        const labelToEdit = labels.find((l) => l.id === id);
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

    const predefinedColors = [
        '#EF4444',
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#A855F7',
        '#EC4899',
        '#6366F1',
        '#F97316',
        '#14B8A6',
    ];

    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Label Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Create and manage task labels
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Add New Label */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                                +
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Add New Label
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="hidden"
                                id="labelId"
                                value={formData.id ?? ''}
                            />

                            {/* Label Name Input */}
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Label Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter label name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Label Color Picker */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Label Color
                                </label>
                                <div className="grid grid-cols-5 gap-2 mb-3">
                                    {predefinedColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    color,
                                                })
                                            }
                                            className={`w-10 h-10 rounded-lg transition-all ${
                                                formData.color === color
                                                    ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                                                    : 'hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    {/* Custom Color Picker */}
                                    <label
                                        htmlFor="color"
                                        className={`w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-all ${
                                            !predefinedColors.includes(
                                                formData.color
                                            )
                                                ? 'ring-2 ring-offset-2 ring-gray-400'
                                                : ''
                                        }`}
                                        style={{
                                            background:
                                                !predefinedColors.includes(
                                                    formData.color
                                                )
                                                    ? `linear-gradient(135deg, ${formData.color} 0%, ${formData.color} 100%)`
                                                    : 'conic-gradient(from 90deg, red, yellow, lime, aqua, blue, magenta, red)',
                                        }}>
                                        <input
                                            type="color"
                                            id="color"
                                            value={formData.color}
                                            onChange={handleInputChange}
                                            className="w-0 h-0 opacity-0"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Create Button */}
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all shadow-sm flex items-center justify-center gap-2">
                                <span className="text-lg">+</span>
                                {formData.id !== null
                                    ? 'Update Label'
                                    : 'Create Label'}
                            </button>

                            {/* Cancel Button */}
                            {formData.id !== null && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full mt-2 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-all">
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right Panel - Current Label List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md">
                        {/* Header with Search */}
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Current Label List
                            </h2>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Search labels..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Label
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Color Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Usage Frequency
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {labels.map((label, index) => (
                                        <tr
                                            key={label.id}
                                            className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white"
                                                    style={{
                                                        backgroundColor:
                                                            label.color,
                                                    }}>
                                                    {label.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded border border-gray-300"
                                                        style={{
                                                            backgroundColor:
                                                                label.color,
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-600 font-mono">
                                                        {label.color}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {label.usage}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-1">
                                                    tasks
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="bg-white p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit">
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
                                                            className="w-4 h-4"
                                                        />
                                                    </button>
                                                    <button
                                                        className="bg-white p-2 text-red-600 hover:bg-red-50 hover:border-red-600 rounded-lg transition-colors"
                                                        title="Delete">
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            className="w-4 h-4"
                                                        />
                                                    </button>
                                                </div>
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
    );
};

export default LabelManagement;
