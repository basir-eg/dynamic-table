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
import {Badge} from "@/components/ui/badge"
import {
  ArrowUpDown,
  Search,
  Settings2,
  Eye,
  EyeOff,
  X
} from "lucide-react"
import {Input} from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react"
import {useURLParams} from "@/hooks/useURLParams"
import {StatisticsPanel} from "./StatisticsPanel"
import {TableLoader} from "./TableLoader"
import {EmptyState, ErrorState} from "./TableStates"
import {TablePagination} from "./TablePagination"

export function DynamicDataTable() {
  const {getParam} = useURLParams()

  const message = getParam("message")
  const headerMessage = getParam("header_message")

  const [data, setData] = React.useState<any[]>([])
  const [statistics, setStatistics] = React.useState<
      { label: string; value: any; details?: { label: string; value: any }[] }[]
  >([])
  const [columns, setColumns] = React.useState<ColumnDef<any>[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
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
            setStatistics([])
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
              className="h-auto p-0 hover:bg-transparent group -ml-3 font-medium text-left justify-start"
              onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
              }
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <ArrowUpDown className="ml-1.5 h-2.5 w-2.5 transition-all duration-300 group-hover:text-blue-500 opacity-50 group-hover:opacity-100"/>
          </Button>
      ),
      cell: ({row}: any) => {
        const value = row.getValue(key)

        if (typeof value === 'boolean') {
          return (
              <Badge
                  variant={value ? "default" : "secondary"}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      value
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
              >
                {value ? "Active" : "Inactive"}
              </Badge>
          )
        }

        if (typeof value === 'number') {
          return (
              <div className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
                {value.toLocaleString()}
              </div>
          )
        }

        if (typeof value === 'string' && value.includes('@')) {
          return (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md">
                {value}
              </div>
          )
        }

        return (
            <div className="text-xs text-slate-700 dark:text-slate-300 max-w-[200px] truncate font-medium" title={value}>
              {value}
            </div>
        )
      },
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
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const clearSearch = () => {
    setGlobalFilter("")
  }

  // Handle ESC key press to clear search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && globalFilter) {
        clearSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [globalFilter])

  if (error) {
    return <ErrorState error={error} />
  }

  return (
      <div className="w-full space-y-4 p-4">
        {/* Header Section */}
        <div className="flex flex-col space-y-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">{headerMessage}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {message}
            </p>
          </div>

          {/* Statistics Panel */}
          {statistics.length > 0 && (
              <StatisticsPanel statistics={statistics}/>
          )}
        </div>

        {/* Search and Controls */}
        {!loading && data.length > 0 && (
            <div className="bg-card rounded-lg border p-4">
              <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                <div className="flex items-center justify-between gap-3 flex-1">
                  {/* Professional Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                      <div className="relative bg-background rounded-lg border border-border transition-all duration-200 group-focus-within:border-primary/50">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                        <Input
                            placeholder="Search across all columns..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-8 pr-8 h-9 text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                        />
                        {globalFilter && (
                            <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2">
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={clearSearch}
                                  className="h-6 w-6 p-0 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Search Helper Text */}
                    {globalFilter && (
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground">
                              ESC
                            </kbd>
                            <span>to clear</span>
                          </div>
                          <div className="w-0.5 h-0.5 bg-muted-foreground/50 rounded-full"></div>
                          <span>{table.getFilteredRowModel().rows.length} results</span>
                        </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                          variant="outline"
                          className="h-9 px-3 gap-1.5 text-xs hover:bg-accent border-border"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Columns</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {table
                          .getAllColumns()
                          .filter((column) => column.getCanHide())
                          .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize text-xs"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                            <span className="flex items-center gap-1.5">
                              {column.getIsVisible() ? (
                                  <Eye className="h-2.5 w-2.5" />
                              ) : (
                                  <EyeOff className="h-2.5 w-2.5" />
                              )}
                              {column.id}
                            </span>
                                </DropdownMenuCheckboxItem>
                            )
                          })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
        )}

        {/* Table Container */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b bg-muted/50 hover:bg-muted/70">
                      {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="h-10 px-4">
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
                            className={`
                              transition-all duration-200 cursor-pointer group border-b
                              hover:bg-muted/50
                              ${row.getIsSelected()
                                ? 'bg-primary/10 border-primary/20'
                                : ''
                            }
                            `}
                        >
                          {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="px-4 py-2.5">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                          ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32">
                        <EmptyState />
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && table.getRowModel().rows.length > 0 && (
            <div className="bg-card rounded-lg border">
              <TablePagination table={table} />
            </div>
        )}
      </div>
  )
}