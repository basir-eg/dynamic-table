import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  server:{
    allowedHosts: ['pour-oz-significant-iraqi.trycloudflare.com']
  },
  plugins: [react(), tailwindcss()],
  base: "/dynamic-table",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

