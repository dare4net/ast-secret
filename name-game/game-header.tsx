"use client"

import { MessageCircle } from "lucide-react"

export function GameHeader() {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b border-purple-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center h-12 sm:h-16">
          {/* Center: Game Title */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">🎯 The Name Game</span>
          </div>
        </div>
      </div>
    </div>
  )
}
