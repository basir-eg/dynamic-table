import { DynamicDataTable } from "@/components/table/DynamicDataTable.tsx";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {useURLParams} from "@/hooks/useURLParams.ts";

export const App = () => {

  const {getParam} = useURLParams()
  const layoutIsHided = Boolean(getParam("hide_layout") ?? false);

  return (
    <div className="min-h-screen flex flex-col">
     {!layoutIsHided && <Header />}
      <main className="flex-1 w-full">
        <DynamicDataTable />
      </main>
      {!layoutIsHided && <Footer />}
    </div>
  )
}