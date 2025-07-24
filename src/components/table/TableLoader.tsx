export function TableLoader({ colSpan }: { colSpan: number }) {
  return (
      <tr>
        <td colSpan={colSpan} className="text-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Loading data...</span>
          </div>
        </td>
      </tr>
  )
}