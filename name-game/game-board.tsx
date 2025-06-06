"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Timer, Users, Send, CheckCircle, Trophy, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function GameBoard() {
  const [submissions, setSubmissions] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  // Mock data for demo
  const gameState = {
    phase: "playing",
    currentLetter: "S",
    currentRound: 0,
    timeLeft: 30,
    settings: { roundTime: 45 },
    categories: [
      { id: "names", name: "Names", enabled: true },
      { id: "places", name: "Places", enabled: true },
      { id: "things", name: "Things", enabled: true },
      { id: "animals", name: "Animals", enabled: true },
    ],
    players: [
      { id: "1", name: "You", score: 85 },
      { id: "2", name: "Player 2", score: 72 },
    ],
  }

  const currentPlayer = { id: "1", name: "You" }
  const enabledCategories = gameState.categories.filter((cat) => cat.enabled)
  const timeProgress = (gameState.timeLeft / gameState.settings.roundTime) * 100

  useEffect(() => {
    if (gameState.phase === "playing") {
      setSubmitted(false)
      setSubmissions({})
    }
  }, [gameState.phase, gameState.currentLetter])

  const handleInputChange = (categoryId: string, value: string) => {
    setSubmissions((prev) => ({
      ...prev,
      [categoryId]: value.trim(),
    }))
  }

  const handleSubmit = () => {
    if (submitted) return
    setSubmitted(true)
    console.log("Submitting words:", submissions)
  }

  const isValidInput = (value: string) => {
    if (!value || !gameState.currentLetter) return false
    return value.toLowerCase().startsWith(gameState.currentLetter.toLowerCase())
  }

  const getFilledCount = () => {
    return Object.values(submissions).filter((word) => word.trim().length > 0).length
  }

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 p-2 sm:p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ast-secret games</span>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="border-0 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white fun-shadow">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-base sm:text-lg md:text-2xl font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-white/20 text-white border-white/30"
                >
                  {gameState.currentLetter}
                </Badge>
                <span className="text-xs sm:text-sm md:text-lg">Round {gameState.currentRound + 1}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span className="text-xs sm:text-sm md:text-base">{gameState.players.length}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Timer className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span
                    className={cn(
                      "text-sm sm:text-lg md:text-xl font-mono",
                      gameState.timeLeft <= 10 && "text-red-300 animate-pulse",
                    )}
                  >
                    {gameState.timeLeft}s
                  </span>
                </div>
              </div>
            </div>
            <Progress
              value={timeProgress}
              className={cn("h-1.5 sm:h-2 md:h-3 bg-white/20", gameState.timeLeft <= 10 && "bg-red-200")}
            />

            {/* Progress indicator */}
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm opacity-90">
              {submitted ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  Words submitted! Waiting for time to end...
                </div>
              ) : (
                <div>
                  {getFilledCount()}/{enabledCategories.length} categories filled
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {enabledCategories.map((category) => (
            <Card
              key={category.id}
              className="border-0 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-lg fun-shadow"
            >
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center justify-between text-gray-800">
                  {category.name}
                  {submissions[category.id] && isValidInput(submissions[category.id]) && (
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                      ✓
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder={`Enter a ${category.name.toLowerCase()} starting with "${gameState.currentLetter}"`}
                  value={submissions[category.id] || ""}
                  onChange={(e) => handleInputChange(category.id, e.target.value)}
                  disabled={submitted}
                  className={cn(
                    "text-xs sm:text-sm md:text-lg h-8 sm:h-10 md:h-12 border-2 border-purple-200 focus:border-purple-400",
                    submissions[category.id] &&
                      !isValidInput(submissions[category.id]) &&
                      "border-red-500 focus:border-red-500",
                    submitted && "bg-gray-100",
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !submitted) {
                      handleSubmit()
                    }
                  }}
                />
                {submissions[category.id] && !isValidInput(submissions[category.id]) && (
                  <p className="text-xs text-red-500 mt-1">Must start with "{gameState.currentLetter}"</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={submitted || gameState.timeLeft === 0}
            size="lg"
            className={cn(
              "px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-lg transition-all duration-200 font-semibold",
              submitted
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105 fun-shadow",
              "text-white",
            )}
          >
            {submitted ? (
              <>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                Submitted! ({getFilledCount()}/{enabledCategories.length})
              </>
            ) : (
              <>
                <Send className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                Submit Words ({getFilledCount()}/{enabledCategories.length})
              </>
            )}
          </Button>
        </div>

        {/* Current Scores Display */}
        <Card className="border-0 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 fun-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base md:text-lg flex items-center justify-center gap-1 sm:gap-2 text-gray-800">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-500" />
              Current Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200",
                    player.id === currentPlayer?.id
                      ? "bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-purple-300"
                      : "bg-white border border-gray-200",
                    index === 0 && "ring-1 sm:ring-2 ring-yellow-400 ring-offset-1",
                  )}
                >
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 overflow-hidden">
                    {index === 0 && <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />}
                    <span
                      className={cn(
                        "font-medium text-xs sm:text-sm md:text-base truncate",
                        player.id === currentPlayer?.id && "text-purple-700",
                      )}
                      title={player.name}
                    >
                      {player.name}
                    </span>
                    {player.id === currentPlayer?.id && (
                      <Badge variant="outline" className="text-xs flex-shrink-0 ml-1 border-purple-300 text-purple-700">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2 min-w-[3rem] sm:min-w-[4rem]">
                    <div className="font-bold text-sm sm:text-base md:text-lg text-gray-800">{player.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
