import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "ast-secret - Anonymous Messages",
  description: "Send and receive anonymous messages securely",
  manifest: "/manifest.json",
  themeColor: "#4ecdc4",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ast-secret",
  },
  icons: {
    apple: "/icon-192.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4ecdc4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ast-secret" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${poppins.variable} antialiased font-poppins`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
