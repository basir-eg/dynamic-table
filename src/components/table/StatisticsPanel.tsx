
export function StatisticsPanel({
                                  statistics,
                                }: {
  statistics: {
    label: string
    value: any
    details?: { label: string; value: any }[]
  }[]
}) {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {statistics.map((stat, index) => (
            <div
                key={index}
                className="bg-background border rounded-2xl p-6 transition-colors hover:bg-muted/50"
            >
              <div className="mb-4 flex flex-row justify-baseline items-center">
               <div className={"w-1/2"}>
                 <h3 className="text-sm font-medium text-muted-foreground mb-1">
                   {stat.label}
                 </h3>
               </div>
                <div className={"w-1/2" }>
                  <p className="text-3xl font-bold text-foreground text-right">
                    {stat.value}
                  </p>
                </div>
              </div>

              {stat.details?.length ? (
                  <div className="space-y-2 pt-3 border-t mt-4">
                    {stat.details.map((detail, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                        >
                  <span className="text-muted-foreground">
                    {detail.label}
                  </span>
                          <span className="font-medium text-foreground">
                    {detail.value}
                  </span>
                        </div>
                    ))}
                  </div>
              ) : null}
            </div>
        ))}
      </div>
  )
}
