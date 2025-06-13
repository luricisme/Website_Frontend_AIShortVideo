import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface ViewsTrendChartProps {
    data: Array<{
        day: string;
        views: number;
        engagement: number;
    }>;
    dateRange?: string;
}

export const ViewsTrendChart = ({ data }: ViewsTrendChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                    }}
                    formatter={(value) => [value.toLocaleString(), "Lượt xem"]}
                    labelFormatter={(label) => `${label}`}
                />
                <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    name="Lượt xem"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

interface PlatformPieChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

export const PlatformPieChart: React.FC<PlatformPieChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                    contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                    }}
                    itemStyle={{
                        color: "#F3F4F6",
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
