export function EmptyState() {
  return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">No Data Found</h3>
        <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-relaxed">
          Check your link parameters or try again with different filters
        </p>
      </div>
  )
}

export function ErrorState({ error }: { error: string }) {
  return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-destructive">Error Occurred</h3>
        <p className="text-muted-foreground text-xs max-w-md mx-auto leading-relaxed bg-destructive/5 p-3 rounded-lg border border-destructive/10">
          {error}
        </p>
        <button
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-xs font-medium"
        >
          Try Again
        </button>
      </div>
  )
}