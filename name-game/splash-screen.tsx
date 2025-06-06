"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles, ArrowRight, Play } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500)
    const timer2 = setTimeout(() => setShowButton(true), 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse-slow fun-shadow game-bounce">
            <div className="text-6xl">🎯</div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Title Animation */}
        <div
          className={`transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-5xl font-bold gradient-text mb-4 animate-float">The Name Game</h1>
          <p className="text-xl text-gray-600 font-medium">Fast-paced word association fun!</p>
        </div>

        {/* Features */}
        <div
          className={`transition-all duration-1000 delay-300 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Fill categories with creative words</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Race against time and friends</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Unique words earn maximum points</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div
          className={`transition-all duration-1000 delay-500 ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Button
            onClick={onComplete}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg fun-shadow hover:scale-105 transition-transform game-pulse"
          >
            <Play className="mr-2 w-5 h-5" />
            Start Playing
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {/* Click anywhere hint */}
          <p className="text-sm text-gray-500 mt-4 animate-pulse">Click the button above to begin your adventure!</p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">ast-secret games</span>
          </div>
          <p>Powered by creativity and fun! 🎮</p>
        </div>
      </div>
    </div>
  )
}
