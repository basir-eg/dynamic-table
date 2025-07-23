import { useURLParams } from "@/hooks/useURLParams"
import {DynamicDataTable} from "@/components/table/DynamicDataTable.tsx";

export const App = () => {
  const { getParam } = useURLParams()
  const message = getParam("message")

  return (
      <div className={"h-full w-full p-4"}>
        <h1 className="h-12 font-bold text-center">{message || "Dynamic Table"}</h1>
        <DynamicDataTable/>
      </div>
  )
}