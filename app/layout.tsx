import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { PostHogProvider } from "../components/PostHogProvider"

export const metadata: Metadata = {
  title: "Active Listening Dojo - Master Active Listening Through AI Conversations",
  description:
    "Learn active listening skills through interactive AI-powered conversations. Practice with diverse personalities and get personalized feedback to improve your communication.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>        
        <PostHogProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  )
}