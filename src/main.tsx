import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DynamicDataTable} from "@/App.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className={"h-screen w-full flex p-4"}>
      <DynamicDataTable/>
    </div>
  </StrictMode>,
)
