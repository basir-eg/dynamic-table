import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import * as React from "react"

export function DynamicDataTable() {
  const [data, setData] = React.useState<any[]>([])
  const [footerData, setFooterData] = React.useState<Record<string, any[]>>({})
  const [columns, setColumns] = React.useState<ColumnDef<any>[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const currentUrl = window.location.href
    const prefix = "link="
    const index = currentUrl.indexOf(prefix)
    let extractedLink = ""

    if (index !== -1) {
      extractedLink = currentUrl.slice(index + prefix.length)
    }

    if (!extractedLink) {
      setError("Missing 'link' query parameter is required.")
      setLoading(false)
      return
    }

    fetch(extractedLink)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch data")
          return res.json()
        })
        .then(json => {
          if (json.rows && Array.isArray(json.rows)) {
            setData(json.rows)

            if (json.footer && Array.isArray(json.footer)) {
              const footerObj: Record<string, any[]> = {}

              json.footer.forEach((item: any) => {
                if (typeof item === 'object') {
                  Object.keys(item).forEach(key => {
                    if (item[key] !== null && item[key] !== undefined) {
                      if (!footerObj[key]) {
                        footerObj[key] = []
                      }
                      footerObj[key].push(item[key])
                    }
                  })
                }
              })

              setFooterData(footerObj)
            }
          } else {
            setData(json)
            setFooterData({})
          }
          setLoading(false)
        })
        .catch(err => {
          setError(err.message || "Failed to fetch data")
          setLoading(false)
        })
  }, [])

  React.useEffect(() => {
    if (data.length === 0) return

    const generated = Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: ({ column }: any) => (
          <Button
              variant="ghost"
              className="px-0"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="capitalize">{key}</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      ),
      cell: ({ row }: any) => <div>{row.getValue(key)}</div>,
      footer: () => {
        if (footerData[key] && footerData[key].length > 0) {
          return (
              <div className="font-bold text-left space-y-1">
                {footerData[key].map((value, index) => (
                    <div key={index}>{value}</div>
                ))}
              </div>
          )
        }
        return null
      },
    }))

    setColumns(generated)
  }, [data, footerData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (error) {
    return (
        <div className="p-4 text-red-600 font-medium text-center">
          Error: {error}
        </div>
    )
  }

  const hasFooterData = Object.keys(footerData).length > 0

  return (
      <div className="w-full space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                          )}
                        </TableHead>
                    ))}
                  </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length || 1} className="h-32 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-gray-500"></span>
                        <span className="text-sm text-gray-600">Loading data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
              ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length || 1} className="text-center">
                      No results.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>

            {!loading && hasFooterData && (
                <TableFooter>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    {table.getFooterGroups().map((footerGroup) =>
                        footerGroup.headers.map((header) => (
                            <TableCell key={header.id} className="font-bold">
                              {header.isPlaceholder ? null : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                              )}
                            </TableCell>
                        ))
                    )}
                  </TableRow>
                </TableFooter>
            )}
          </Table>
        </div>

        {!loading && (
            <div className="flex justify-end items-center space-x-2">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
        )}
      </div>
  )
}