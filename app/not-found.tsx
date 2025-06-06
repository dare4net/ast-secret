"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        {/* Header */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ast-secret</span>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardContent className="p-8 text-center">
            {/* 404 Animation */}
            <div className="relative mb-6">
              <div className="text-8xl font-bold gradient-text animate-pulse">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full animate-ping"></div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the link might be
              incorrect.
            </p>

            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>

              <Link href="/create" className="block">
                <Button
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Create Your Link
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Need help?</p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <span>🔗 Check your link</span>
            <span>📱 Try refreshing</span>
            <span>🏠 Go to homepage</span>
          </div>
        </div>
      </div>
    </div>
  )
}
