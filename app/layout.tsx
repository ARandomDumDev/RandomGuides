import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalChat } from "@/components/global-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RandomGuides - Guides 4 Gen Z",
  description: "The ultimate guide collection for Gen Z",
  manifest: "/manifest.json",
  themeColor: "#ec4899",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RandomGuides",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RandomGuides" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <GlobalChat />
        </ThemeProvider>
      </body>
    </html>
  )
}
