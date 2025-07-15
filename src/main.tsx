import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DynamicDataTable} from "@/App.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className={"h-full w-full flex items-center justify-center"}>
      <DynamicDataTable/>
    </div>
  </StrictMode>,
)
