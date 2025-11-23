import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { firestoreDb } from '../../config/FirebaseConfig';

// 1. Định nghĩa Interface
interface Category {
    id: string; // Document ID từ Firebase
    name: string; // Từ field "title" trong Firebase
    color: string; // Từ field "color" trong Firebase
}

const LabelManagement: React.FC = () => {
    // State quản lý categories/labels từ Firebase
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

    // State search
    const [searchTerm, setSearchTerm] = useState<string>('');

    // State để quản lý dữ liệu trong form (dùng cho cả Add và Edit)
    const [formData, setFormData] = useState<{
        id: string | null;
        name: string;
        color: string;
    }>({
        id: null,
        name: '',
        color: '#EF4444',
    });

    // useEffect: Lắng nghe realtime categories từ Firebase
    useEffect(() => {
        console.log('🔥 Setting up Firebase listener for categories...');
        const colRef = collection(firestoreDb, 'category');

        const unsub = onSnapshot(
            colRef,
            (snapshot) => {
                const items = snapshot.docs.map((d) => {
                    const data = d.data() as any;
                    return {
                        id: d.id, // Lấy document ID từ Firebase
                        name: data.title || 'Untitled',
                        color: data.color || '#3D8BFF',
                    };
                });
                console.log(
                    `✅ Loaded ${items.length} categories from Firebase:`,
                    items
                );
                setCategories(items);
                setLoadingCategories(false);
            },
            (err) => {
                console.error('Category snapshot error:', err);
                setLoadingCategories(false);
            }
        );

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up Firebase listener');
            unsub();
        };
    }, []);

    // Hàm thay đổi trạng thái Form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Hàm xử lý Submit Form - Thêm label mới vào Firebase
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            alert('Please enter a label name!');
            return;
        }

        if (!formData.color) {
            alert('Please select a color!');
            return;
        }

        try {
            console.log('Adding new label to Firebase:', formData);

            // Thêm document mới vào collection 'category'
            const docRef = await addDoc(collection(firestoreDb, 'category'), {
                title: formData.name.trim(),
                color: formData.color,
            });

            console.log('Label added successfully with ID:', docRef.id);
            alert(`Label "${formData.name}" added successfully!`);

            // Reset form sau khi thêm thành công
            resetForm();
        } catch (error) {
            console.error('Error adding label:', error);
            alert('Failed to add label. Please try again.');
        }
    };

    // Hàm reset form
    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            color: '#EF4444',
        });
    };

    // Filter categories theo search term
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories;

        const lowerSearch = searchTerm.toLowerCase();
        return categories.filter(
            (cat) =>
                cat.name.toLowerCase().includes(lowerSearch) ||
                cat.color.toLowerCase().includes(lowerSearch)
        );
    }, [categories, searchTerm]);

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
        <div className="w-full">
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
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
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
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loadingCategories ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-8 text-center">
                                                <p className="text-gray-500">
                                                    Loading data from
                                                    Firebase...
                                                </p>
                                            </td>
                                        </tr>
                                    ) : filteredCategories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-8 text-center">
                                                <p className="text-gray-500">
                                                    {searchTerm
                                                        ? `No labels found matching "${searchTerm}"`
                                                        : 'No labels found.'}
                                                </p>
                                                {!searchTerm && (
                                                    <p className="text-sm text-gray-400 mt-2">
                                                        Create categories in
                                                        Firebase collection
                                                        "category"
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map(
                                            (category, index) => (
                                                <tr
                                                    key={category.id}
                                                    className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color,
                                                            }}>
                                                            {category.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-6 h-6 rounded border border-gray-300"
                                                                style={{
                                                                    backgroundColor:
                                                                        category.color,
                                                                }}
                                                            />
                                                            <span className="text-sm text-gray-600 font-mono">
                                                                {category.color}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-400 italic">
                                                            N/A
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
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
