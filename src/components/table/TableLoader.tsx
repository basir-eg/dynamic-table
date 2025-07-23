export function TableLoader({ colSpan }: { colSpan: number }) {
  return (
      <tr>
        <td colSpan={colSpan} className="text-center py-10">
          <div className="flex justify-center items-center gap-2">
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-gray-500" />
            <span className="text-sm text-gray-600">Loading data...</span>
          </div>
        </td>
      </tr>
  )
}
