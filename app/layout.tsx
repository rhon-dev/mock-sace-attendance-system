import type { Metadata, Viewport } from "next"
import { Cinzel, Cormorant_Garamond, Geist_Mono } from "next/font/google"
import { ToastProvider } from "@/components/toast-provider"
import "./globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "SACE Scarlet Protocol - Attendance System",
  description:
    "The official attendance management system of the SACE Council. Track, manage, and monitor member attendance with theatrical precision.",
}

export const viewport: Viewport = {
  themeColor: "#4a0404",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
