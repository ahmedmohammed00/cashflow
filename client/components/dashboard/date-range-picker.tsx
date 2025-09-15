
'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';


interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({ className, date, onDateChange }: DateRangePickerProps) {
    const handlePresetChange = (preset: string) => {
        const now = new Date();
        switch(preset) {
            case 'today':
                onDateChange({ from: now, to: now });
                break;
            case 'yesterday':
                onDateChange({ from: addDays(now, -1), to: addDays(now, -1) });
                break;
            case 'last7':
                onDateChange({ from: addDays(now, -6), to: now });
                break;
            case 'last30':
                onDateChange({ from: addDays(now, -29), to: now });
                break;
            case 'thisMonth':
                onDateChange({ from: new Date(now.getFullYear(), now.getMonth(), 1), to: now });
                break;
            case 'lastMonth':
                onDateChange({ from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) });
                break;
        }
    }


    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} -{' '}
                                    {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <div className="flex items-center justify-center p-2">
                        <Select onValueChange={handlePresetChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a preset" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="yesterday">Yesterday</SelectItem>
                                <SelectItem value="last7">Last 7 days</SelectItem>
                                <SelectItem value="last30">Last 30 days</SelectItem>
                                <SelectItem value="thisMonth">This month</SelectItem>
                                <SelectItem value="lastMonth">Last month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="p-2">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={onDateChange}
                            numberOfMonths={2}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
