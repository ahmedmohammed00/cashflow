
"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { Coupon } from "@/lib/types"
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
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function DeleteAction({ coupon }: { coupon: Coupon }) {
    const router = useRouter();

    const handleDelete = () => {
        // In a real app, call an API to delete the coupon
        console.log(`Deleting coupon ${coupon.id}`);
        toast.error("تم حذف الكوبون", {
            description: `تم حذف الكوبون ${coupon.code} بنجاح.`,
        });
        // In a real app, you would likely refetch data here.
        router.refresh();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => e.preventDefault()} // Prevents dropdown from closing
                >
                    حذف الكوبون
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                    <AlertDialogDescription>
                        هذا الإجراء سيحذف الكوبون بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleDelete}
                    >
                        نعم، احذف الكوبون
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const columns: ColumnDef<Coupon>[] = [
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
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    الرمز
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link href={`/admin/coupons/${row.original.id}`} className="hover:underline">
                    <Badge variant="secondary" className="font-mono">{row.original.code}</Badge>
                </Link>
            )
        }
    },
    {
        accessorKey: "discount",
        header: "الخصم (%)",
        cell: ({ row }) => {
            return <div>%{row.original.discount}</div>
        }
    },
    {
        accessorKey: "active",
        header: "الحالة",
        cell: ({ row }) => {
            const isActive = row.getValue("active");
            return <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "نشط" : "غير نشط"}</Badge>
        }
    },
    {
        accessorKey: "usageCount",
        header: "الاستخدام",
        cell: ({ row }) => {
            const { usageCount, usageLimit } = row.original;
            if (usageLimit === null) {
                return <span>{usageCount} / &infin;</span>
            }
            return <span>{usageCount} / {usageLimit}</span>
        }
    },
    {
        accessorKey: "expiresAt",
        header: "تاريخ الانتهاء",
        cell: ({ row }) => {
            const expiresAt = row.original.expiresAt;
            if (!expiresAt) {
                return <span>أبداً</span>
            }
            return <span>{format(expiresAt, "PPP", { locale: ar })}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const coupon = row.original

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(coupon.id)}
                        >
                            نسخ معرف الكوبون
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/coupons/${coupon.id}`}>تعديل الكوبون</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteAction coupon={coupon} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
