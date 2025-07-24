import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight} from "lucide-react";

export function TablePagination({table}: { table: any }) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const totalRows = table.getFilteredRowModel().rows.length

  return (
      <div className="flex items-center justify-between p-3 gap-3">
        {/* Left: Items count */}
        <div className="text-xs text-muted-foreground font-medium">
          {totalRows} {totalRows === 1 ? 'item' : 'items'}
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center gap-2">
          <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          <div className="text-xs font-semibold px-2.5 py-1 bg-muted/50 rounded-md border text-foreground min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </div>

          <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Right: Empty space for balance */}
        <div className="w-12"></div>
      </div>
  )
}