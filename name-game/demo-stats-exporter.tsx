"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsExporter, type GameStats } from "./stats-exporter"
import { Trophy, Share2 } from "lucide-react"

// Demo stats for testing
const demoStats: GameStats = {
  playerName: "WordMaster",
  totalScore: 450,
  rank: 2,
  totalPlayers: 8,
  uniqueWords: 14,
  rareWords: 5,
  fastestSubmission: 2.3,
  mostAlliteration: 3,
  longestWord: "Spectacular",
  categories: ["Names", "Places", "Animals", "Things"],
  lettersMastered: ["S", "T", "P", "M"],
  perfectRounds: 3,
  totalRounds: 5,
}

export function DemoStatsExporter() {
  const [showExporter, setShowExporter] = useState(false)

  if (showExporter) {
    return <StatsExporter stats={demoStats} onClose={() => setShowExporter(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm fun-shadow">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            Game Complete!
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Great job, WordMaster!</h3>
            <p className="text-gray-600">You scored 450 points and ranked #2 of 8 players</p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setShowExporter(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold fun-shadow hover:scale-105 transition-transform"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Your Stats
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
