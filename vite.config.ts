import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is set for GitHub Pages project deployment.
// Change '/material-schedule-calculator-pro/' to match your repo name,
// or set to '/' if deploying to Vercel/Netlify or a custom domain.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/material-schedule-calculator-pro/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
