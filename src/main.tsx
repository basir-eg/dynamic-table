import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {DynamicTablePage} from "@/dynamicTablePage.tsx";
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicTablePage/>
  </StrictMode>,
)
