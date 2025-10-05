'use client'

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { deleteProduct } from "@/lib/products" // import API helper

function DeleteAction({ product, token }: { product: Product, token: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!token) return;
        const success = await deleteProduct(product.id, token);
        if (success) {
            toast.success("تم حذف المنتج", { description: `تم حذف المنتج ${product.name} بنجاح.` });
            router.refresh();
        } else {
            toast.error("فشل حذف المنتج", { description: "الرجاء المحاولة مرة أخرى." });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => e.preventDefault()} // Prevents dropdown from closing
                >
                    حذف المنتج
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                    <AlertDialogDescription>
                        هذا الإجراء سيحذف المنتج بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleDelete}
                    >
                        نعم، احذف المنتج
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="تحديد الكل"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="تحديد الصف"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                الاسم
                <ArrowUpDown className="mr-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <Link href={`/admin/products/${row.original.id}`} className="hover:underline">{row.original.name}</Link>
    },
    {
        accessorKey: "category",
        header: "الفئة",
        cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                السعر
                <ArrowUpDown className="mr-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(amount)
            return <div className="text-left font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    المخزون
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const stock = row.original.stock;
            const variant = stock === 0 ? "destructive" : stock < 10 ? "secondary" : "default";
            return <div className="text-center"><Badge variant={variant} className={variant === 'default' ? 'bg-green-100 text-green-800' : ''}>{stock}</Badge></div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;
            const token = localStorage.getItem("token"); // fetch token here

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">فتح القائمة</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                            نسخ معرف المنتج
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>تعديل المنتج</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* Delete action with confirmation */}
                        {token && <DeleteAction product={product} token={token} />}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
