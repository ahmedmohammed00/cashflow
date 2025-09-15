"use client";

import * as React from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Label,
} from "recharts";
import type { DateRange } from "react-day-picker";

const initialData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
];

interface OverviewChartProps {
    dateRange?: DateRange;
}

function formatYAxisTick(value: number) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm">
                <p className="font-semibold mb-1">{label}</p>
                <p>{`الإجمالي: $${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
}

export function OverviewChart({ dateRange }: OverviewChartProps) {
    const [data, setData] = React.useState(initialData);

    React.useEffect(() => {
        setData(
            initialData.map((item) => ({
                ...item,
                total: Math.floor(Math.random() * 5000) + 1000,
            }))
        );
    }, [dateRange]);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart
                data={data}
                margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
                barCategoryGap="25%"
                barGap={6}
            >
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />

                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={14}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 15, right: 15 }}
                >
                    <Label
                        value="الشهر"
                        position="bottom"
                        offset={25}
                        fill="#666"
                        fontSize={14}
                        fontWeight="bold"
                    />
                </XAxis>

                <YAxis
                    stroke="#888888"
                    fontSize={14}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatYAxisTick}
                    width={70}
                    minTickGap={20}
                    domain={[0, 'dataMax + 1000']}
                >
                    <Label
                        value="الإيرادات"
                        angle={-90}
                        position="insideLeft"
                        offset={-10}
                        fill="#666"
                        fontSize={14}
                        fontWeight="bold"
                    />
                </YAxis>

                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.1)" }}
                    animationDuration={300}
                />

                <Bar
                    dataKey="total"
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    onMouseEnter={(e) => {
                        // Optional: add hover effect logic here if needed
                    }}
                    onMouseLeave={(e) => {
                        // Optional: add hover effect logic here if needed
                    }}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
