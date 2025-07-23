import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {Button} from "@/components/ui/button"
import {ArrowUpDown} from "lucide-react"
import * as React from "react"
import {useURLParams} from "@/hooks/useURLParams"
import {StatisticsPanel} from "./StatisticsPanel"
import {TableLoader} from "./TableLoader"

export function DynamicDataTable() {
  const {getParam} = useURLParams()

  const [data, setData] = React.useState<any[]>([])
  const [statistics, setStatistics] = React.useState<
      { label: string; value: any; details?: { label: string; value: any }[] }[]
  >([])
  const [columns, setColumns] = React.useState<ColumnDef<any>[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const extractedLink = getParam("link")
    if (!extractedLink) {
      setError("Missing 'link' query parameter.")
      setLoading(false)
      return
    }


    fetch(extractedLink)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch data")
          return res.json()
        })
        .then((json) => {
          if (Array.isArray(json.rows)) {
            setData(json.rows)
            setStatistics(Array.isArray(json.statistics) ? json.statistics : [])
          } else {
            setData(json)
            setStatistics([]
            )
          }
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message || "Unexpected error")
          setLoading(false)
        })

  }, [getParam])

  React.useEffect(() => {
    if (data.length === 0 || typeof data[0] !== "object") return

    const generated = Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: ({column}: any) => (
          <Button
              variant="ghost"
              className="px-0"
              onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
              }
          >
            <span className="capitalize">{key}</span>
            <ArrowUpDown className="ml-2 h-4 w-4"/>
          </Button>
      ),
      cell: ({row}: any) => <div>{row.getValue(key)}</div>,
    }))

    setColumns(generated)
  }, [data])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        <div className="flex justify-center items-center h-64 text-red-500 font-semibold">
          {error}
        </div>
    )
  }

  return (
      <div className="w-full">

        {statistics.length > 0 && (
            <StatisticsPanel statistics={statistics}/>
        )}

        <div className="my-10 rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
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
              {loading ? (
                  <TableLoader colSpan={columns.length || 1}/>
              ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-10">
                      No results.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
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
