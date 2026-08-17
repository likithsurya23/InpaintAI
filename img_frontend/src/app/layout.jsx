import React from 'react'
import { ThemeProvider } from '../components/context/ThemeContext'
import '../styles/main.css'

export const metadata = {
  title: 'InpaintAI - AI Image Inpainting Studio',
  description: 'Professional AI-Powered Object Removal using Generative Adversarial Networks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
