import {DynamicDataTable} from "@/App.tsx";

export const DynamicTablePage = () => {
  const message = new URLSearchParams(window.location.search).get("message")

  return (
      <div className={"h-full w-full p-4"}>
        <h1 className="h-12 text-2xl font-bold text-center">{message}</h1>
        <DynamicDataTable/>
      </div>
  )
};