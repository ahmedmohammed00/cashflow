"use client";

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { CATEGORY_LABELS, COLUMN_LABELS } from './types';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SearchInput<TData>({ table }: { table: Table<TData> }) {
    return (
        <Input
            placeholder="تصفية المنتجات حسب الاسم..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
        />
    );
}

function CategoryFilter<TData>({
                                   table,
                                   categories,
                               }: {
    table: Table<TData>;
    categories: string[];
}) {
    return (
        <Select
            onValueChange={(value) => {
                table
                    .getColumn('category')
                    ?.setFilterValue(value === 'all' ? undefined : [value]);
            }}
        >
            <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="تصفية حسب الفئة" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat] ?? cat}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function ResetFiltersButton<TData>({ table }: { table: Table<TData> }) {
    return (
        <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
        >
            إعادة تعيين
            <X className="mr-2 h-4 w-4" />
        </Button>
    );
}

function ColumnVisibilityToggle<TData>({ table }: { table: Table<TData> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                    الأعمدة
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                    .getAllColumns()
                    .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide())
                    .map((col) => (
                        <DropdownMenuCheckboxItem
                            key={col.id}
                            className="capitalize"
                            checked={col.getIsVisible()}
                            onCheckedChange={(value) => col.toggleVisibility(!!value)}
                        >
                            {COLUMN_LABELS[col.id] ?? col.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    products: Product[];
}

export function DataTableToolbar<TData>({
                                            table,
                                            products,
                                        }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const categories = Array.from(new Set(products.map((p) => p.category))).sort();

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <SearchInput table={table} />
                <CategoryFilter table={table} categories={categories} />
                {isFiltered && <ResetFiltersButton table={table} />}
            </div>
            <ColumnVisibilityToggle table={table} />
        </div>
    );
}