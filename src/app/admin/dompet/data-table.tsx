"use client"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading?: boolean
}

export function DataTable<TData, TValue>({ columns, data, isLoading = false }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    })

    return (
        <div className="rounded-xl border border-slate-200/80 bg-white w-full overflow-x-auto shadow-sm">
            <Table className="min-w-full table-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b-slate-200/80 hover:bg-white">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="font-semibold text-slate-600">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        [...Array(table.getState().pagination.pageSize)].map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((_, colIndex) => (
                                    <TableCell key={colIndex} className="py-4">
                                        <Skeleton className="h-5 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow 
                                key={row.id}
                                className="border-b-slate-200/50 hover:bg-slate-50/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-2 text-slate-800">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                                Tidak ada data dompet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/80">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>Tampilkan</span>
                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="w-[80px] h-8 bg-white border-slate-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-slate-800/80 border border-slate-200">
                            {[5, 10, 20, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={String(pageSize)}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>baris</span>
                </div>

                <div className="flex items-center justify-end space-x-1 flex-wrap gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous page"
                        className="h-8 w-8 p-0 bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
            
                    {Array.from({ length: table.getPageCount() }).map((_, i) => {
                        const isActive = i === table.getState().pagination.pageIndex;
                        return (
                            <Button
                                key={i}
                                variant={isActive ? "outline" : "ghost"}
                                size="sm"
                                onClick={() => table.setPageIndex(i)}
                                className={`h-8 w-8 p-0 ${
                                    isActive 
                                        ? "bg-slate-100 border-slate-400 font-semibold text-slate-900" 
                                        : "text-slate-600"
                                }`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {i + 1}
                            </Button>
                        );
                    })}
            
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next page"
                        className="h-8 w-8 p-0 bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}