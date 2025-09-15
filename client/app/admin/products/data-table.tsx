"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, ChevronDown, ChevronUp, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const clearNameFilter = () => {
        table.getColumn("name")?.setFilterValue(undefined);
    };

    return (
        <div className="flex flex-col space-y-4">
            {/* Filter and controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 py-4">
                <div className="relative w-full sm:max-w-sm">
                    <Input
                        placeholder="تصفية المنتجات حسب الاسم..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                        aria-label="تصفية المنتجات حسب الاسم"
                        className="pr-10"
                    />
                    {(table.getColumn("name")?.getFilterValue() as string)?.length > 0 && (
                        <button
                            onClick={clearNameFilter}
                            aria-label="مسح الفلتر"
                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 transition"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full sm:w-auto gap-2 ml-auto rtl:ml-0 rtl:mr-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto" aria-label="تحديد الأعمدة">
                                الأعمدة
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-h-60 overflow-auto">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id === "name"
                                            ? "الاسم"
                                            : column.id === "category"
                                                ? "الفئة"
                                                : column.id === "price"
                                                    ? "السعر"
                                                    : column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button asChild className="w-full sm:w-auto" aria-label="إضافة منتج جديد">
                        <Link href="/admin/products/new" className="flex items-center justify-center gap-1">
                            <PlusCircle className="ml-1 h-4 w-4" />
                            إضافة منتج
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Table with horizontal scroll on small screens */}
            <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    const sortDirection = header.column.getIsSorted();

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-right cursor-pointer select-none"
                                            onClick={canSort ? () => header.column.toggleSorting() : undefined}
                                            tabIndex={canSort ? 0 : undefined}
                                            onKeyDown={(e) => {
                                                if (canSort && (e.key === "Enter" || e.key === " ")) {
                                                    e.preventDefault();
                                                    header.column.toggleSorting();
                                                }
                                            }}
                                            aria-sort={
                                                sortDirection === "asc"
                                                    ? "ascending"
                                                    : sortDirection === "desc"
                                                        ? "descending"
                                                        : "none"
                                            }
                                            role={canSort ? "button" : undefined}
                                        >
                                            <div className="flex items-center justify-end gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {sortDirection === "asc" && <ChevronUp className="h-4 w-4 text-primary" />}
                                                {sortDirection === "desc" && <ChevronDown className="h-4 w-4 text-primary" />}
                                                {!sortDirection && canSort && (
                                                    <ChevronUp className="h-4 w-4 text-muted-foreground opacity-30 rotate-180" />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-right">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    لا توجد نتائج.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 rtl:space-x-reverse">
                <div className="text-sm text-muted-foreground">
                    الصفحة {table.getState().pagination.pageIndex + 1} من {table.getPageCount()} -{" "}
                    {table.getFilteredRowModel().rows.length} نتيجة
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="الصفحة السابقة"
                    >
                        السابق
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="الصفحة التالية"
                    >
                        التالي
                    </Button>
                </div>
            </div>
        </div>
    );
}
