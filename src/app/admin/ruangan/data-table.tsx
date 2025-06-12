"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  return (
    <div className="container mx-auto px-4 text-black">
      <div className="w-full overflow-auto text-black">
        <div className="inline-block min-w-full align-middle text-black">
          <div className="overflow-hidden border rounded-md">
            <Table className="table-auto">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="font-bold whitespace-nowrap max-w-[300px] text-black"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap max-w-[300px] text-black"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 flex-wrap gap-2">
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
              {[5, 10, 20].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>baris</span>
        </div>

        <div className="flex items-center space-x-1 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous Page"
            className="bg-white border border-black text-black"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {Array.from({ length: table.getPageCount() }, (_, i) => {
            const isActive = i === table.getState().pagination.pageIndex;
            return (
              <Button
                key={i}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(i)}
                className={`bg-white border border-black text-black ${
                  isActive ? "bg-gray-200" : ""
                }`}
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
            aria-label="Next Page"
            className="bg-white border border-black text-black"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
