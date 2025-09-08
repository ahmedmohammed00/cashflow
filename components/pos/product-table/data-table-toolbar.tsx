"use client";

import { Column, Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Product } from '@/lib/types';


interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    products: Product[];
}

export function DataTableToolbar<TData>({
                                            table,
                                            products
                                        }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const categories = Array.from(
        new Set(products.map((p) => p.category))
    ).sort();

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="تصفية المنتجات حسب الاسم..."
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                <Select
                    onValueChange={(value) => {
                        if (value === 'all') {
                            table.getColumn('category')?.setFilterValue(undefined);
                        } else {
                            table.getColumn('category')?.setFilterValue(value ? [value] : undefined);
                        }
                    }}
                >
                    <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="تصفية حسب الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category === 'Drinks' ? 'مشروبات' :
                                    category === 'Snacks' ? 'وجبات خفيفة' :
                                        category === 'Electronics' ? 'إلكترونيات' :
                                            category === 'Apparel' ? 'ملابس' :
                                                category === 'Books' ? 'كتب' :
                                                    category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        إعادة تعيين
                        <X className="mr-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                        الأعمدة
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter(
                            (column: Column<TData, unknown>) =>
                                typeof column.accessorFn !== 'undefined' && column.getCanHide()
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {
                                        column.id === 'name' ? 'الاسم' :
                                            column.id === 'category' ? 'الفئة' :
                                                column.id === 'stock' ? 'المخزون' :
                                                    column.id === 'price' ? 'السعر' :
                                                        column.id}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
