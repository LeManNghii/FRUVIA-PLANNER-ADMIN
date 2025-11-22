import React from 'react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    ResponsiveContainer, 
    Legend 
} from 'recharts';

// Định nghĩa kiểu dữ liệu (interface) cho mỗi phần tử dữ liệu
interface PieChartData {
    name: string; // Tên nhãn (ví dụ: "Meeting", "Personal")
    value: number; // Số lượng nhiệm vụ (tasks)
    color?: string; // Màu sắc cho nhãn (nếu có)
}

// Định nghĩa Props cho component
interface TaskDistributionPieChartProps {
    data: PieChartData[];
}

// Màu sắc cho các lát cắt của biểu đồ tròn (Bạn có thể tùy chỉnh hoặc mở rộng)
const COLORS = [
    '#0088FE', // Màu Xanh Dương
    '#00C49F', // Màu Xanh Lục
    '#FFBB28', // Màu Vàng
    '#FF8042', // Màu Cam
    '#8884d8', // Màu Tím Nhạt
    '#82ca9d'  // Màu Xanh Lá Nhạt
];

const TaskDistributionPieChart: React.FC<TaskDistributionPieChartProps> = ({ data }) => {

    // Hàm render label tùy chỉnh để hiển thị phần trăm trên biểu đồ
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        // Tính toán vị trí để đặt văn bản (phần trăm)
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        // Chỉ hiển thị phần trăm nếu nó đủ lớn để văn bản không bị chồng lên nhau
        if (percent * 100 < 5) return null;

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize={12} // Kích thước chữ
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        // ResponsiveContainer giúp biểu đồ tự điều chỉnh kích thước theo thẻ cha
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data as any}
                    dataKey="value" // Trường chứa giá trị (số lượng task)
                    nameKey="name"  // Trường chứa tên nhãn (hiển thị trong Tooltip/Legend)
                    cx="50%"        // Vị trí trung tâm X
                    cy="50%"        // Vị trí trung tâm Y
                    outerRadius={100} // Bán kính ngoài của biểu đồ
                    fill="#8884d8"
                    labelLine={false}
                    label={renderCustomizedLabel} // Áp dụng label tùy chỉnh
                >
                    {/* Áp dụng màu sắc cho từng lát cắt (Cell) */}
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                
                {/* Tooltip hiển thị thông tin khi di chuột */}
                <Tooltip />
                
                {/* Legend (Chú giải) hiển thị các nhãn và màu tương ứng */}
                <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default TaskDistributionPieChart;