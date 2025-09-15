'use client';

import * as React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, Users, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { TopProducts } from '@/components/dashboard/top-products';


function KpiCard({
                     title,
                     icon: Icon,
                     value,
                     change,
                     dateRange,
                 }: {
    title: string;
    icon: React.ElementType;
    value: string;
    change: string;
    dateRange?: DateRange;
}) {
    const [displayValue, setDisplayValue] = React.useState(value);
    const [changePercentage, setChangePercentage] = React.useState(
        parseFloat(change.replace(/[^0-9.-]+/g, ''))
    );

    React.useEffect(() => {
        // Simulate fetching new data based on the date range
        const randomValue = Math.floor(Math.random() * 5000) + 1000;
        const randomChange = parseFloat((Math.random() * 40 - 20).toFixed(1));

        if (title === 'إجمالي الإيرادات') {
            setDisplayValue(
                `$${(randomValue * 10).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`
            );
        } else {
            setDisplayValue(`+${randomValue.toLocaleString()}`);
        }
        setChangePercentage(randomChange);
    }, [dateRange, title]);

    const isPositive = changePercentage >= 0;

    return (
        <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-extrabold">{displayValue}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span
              className={`flex items-center gap-1 ${
                  isPositive ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(changePercentage)}%
          </span>
                    <span className="mr-1">من الفترة الماضية</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);

    React.useEffect(() => {
        setDate({
            from: subDays(new Date(), 29),
            to: new Date(),
        });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
                <DateRangePicker date={date} onDateChange={setDate} />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="إجمالي الإيرادات"
                    icon={DollarSign}
                    value="$45,231.89"
                    change="+20.1%"
                    dateRange={date}
                />
                <KpiCard
                    title="المبيعات"
                    icon={CreditCard}
                    value="+2350"
                    change="+180.1%"
                    dateRange={date}
                />
                <KpiCard
                    title="عملاء جدد"
                    icon={Users}
                    value="+120"
                    change="-15%"
                    dateRange={date}
                />
                <KpiCard
                    title="المنتجات المباعة"
                    icon={Package}
                    value="+573"
                    change="+19%"
                    dateRange={date}
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <Card className="col-span-1 lg:col-span-4 rounded-lg shadow-md">
                    <CardHeader>
                        <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
                    <CardDescription>
                        أفضل 5 منتجات مبيعاً هذا الشهر.
                    </CardDescription>

                    </CardHeader>
                    <CardContent className="p-4">
                        <TopProducts />
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-3 rounded-lg shadow-md flex flex-col">
                    <CardHeader>
                        <CardTitle>المبيعات الأخيرة</CardTitle>
                        <CardDescription>لقد قمت بـ 265 عملية بيع هذا الشهر.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-auto flex-1 p-4">
                        <RecentSales />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

