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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Product } from "@/lib/types";
import { DataTableToolbar } from "./data-table-toolbar";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
    if (direction === "asc") return <ChevronUp className="h-4 w-4 text-primary" />;
    if (direction === "desc") return <ChevronDown className="h-4 w-4 text-primary" />;
    return <ChevronUp className="h-4 w-4 text-muted-foreground opacity-30 rotate-180" />;
}

function EmptyRow({ colSpan }: { colSpan: number }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
                لا توجد نتائج.
            </TableCell>
        </TableRow>
    );
}

function PaginationControls<TData>({ table }: { table: ReturnType<typeof useReactTable<TData>> }) {
    const { pageIndex } = table.getState().pagination;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 rtl:space-x-reverse">
      <span className="text-sm text-muted-foreground">
        الصفحة {pageIndex + 1} من {table.getPageCount()}
      </span>
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
    );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends Product, TValue>({
                                                             columns,
                                                             data,
                                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} products={data} />

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
                                                {canSort && <SortIcon direction={sortDirection} />}
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
                            <EmptyRow colSpan={columns.length} />
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationControls table={table} />
        </div>
    );
}