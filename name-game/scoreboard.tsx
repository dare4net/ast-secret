"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  Medal,
  Award,
  RotateCcw,
  Home,
  CheckCircle,
  XCircle,
  ArrowRight,
  StopCircle,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Scoreboard() {
  // Mock data for demo
  const gameState = {
    phase: "results",
    currentRound: 2,
    players: [
      { id: "1", name: "You", score: 145 },
      { id: "2", name: "Alice", score: 132 },
      { id: "3", name: "Bob", score: 98 },
    ],
    roundResults: [
      {
        letter: "S",
        submissions: [
          { playerId: "1", category: "names", word: "Sarah", isValid: true, points: 10 },
          { playerId: "1", category: "places", word: "Spain", isValid: true, points: 5 },
          { playerId: "2", category: "names", word: "Steve", isValid: true, points: 10 },
          { playerId: "2", category: "places", word: "Spain", isValid: true, points: 5 },
        ],
      },
    ],
    categories: [
      { id: "names", name: "Names", enabled: true },
      { id: "places", name: "Places", enabled: true },
      { id: "things", name: "Things", enabled: true },
      { id: "animals", name: "Animals", enabled: true },
    ],
  }

  const handleRestartGame = () => {
    console.log("Restarting game...")
  }

  const handleLeaveGame = () => {
    console.log("Leaving game...")
  }

  const handleContinueToNextRound = () => {
    console.log("Continuing to next round...")
  }

  const handleEndGame = () => {
    console.log("Ending game...")
  }

  if (gameState.phase !== "results" && gameState.phase !== "finished") {
    return null
  }

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)
  const isGameFinished = gameState.phase === "finished"
  const winner = sortedPlayers[0]
  const roundNumber = gameState.currentRound

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{index + 1}</div>
    }
  }

  const getPositionColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-yellow-600"
      case 1:
        return "from-gray-300 to-gray-500"
      case 2:
        return "from-amber-400 to-amber-600"
      default:
        return "from-pink-400 to-purple-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ast-secret games</span>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card
          className={cn(
            "border-0 text-white fun-shadow",
            isGameFinished
              ? "bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500"
              : "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600",
          )}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">
              {isGameFinished ? "🎉 Game Complete!" : `Round ${roundNumber} Results`}
            </CardTitle>
            {isGameFinished && winner && (
              <p className="text-xl opacity-90">
                🏆 {winner.name} wins with {winner.score} points!
              </p>
            )}
            {!isGameFinished && (
              <p className="text-lg opacity-90">
                Letter: {gameState.roundResults[gameState.roundResults.length - 1]?.letter} | Round {roundNumber} of 26
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Overall Scores - Prominently Displayed */}
        <Card className="border-0 border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 fun-shadow">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-gray-800">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Overall Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-all duration-300",
                    `bg-gradient-to-r ${getPositionColor(index)}`,
                    index === 0 && "ring-2 ring-yellow-400 ring-offset-2 scale-105",
                    "text-white shadow-lg",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getPositionIcon(index)}
                    <div>
                      <div className="font-bold text-xl">{player.name}</div>
                      <div className="text-sm opacity-90">{gameState.roundResults.length} rounds played</div>
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="text-3xl font-bold">{player.score}</div>
                    <div className="text-sm opacity-90">total points</div>
                    {index === 0 && isGameFinished && (
                      <Badge variant="secondary" className="bg-white/20 text-white mt-1 border-white/30">
                        Winner! 🎉
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Round Results */}
        {gameState.roundResults.length > 0 && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Badge variant="outline" className="text-lg px-3 py-1 border-purple-300 text-purple-700">
                  {gameState.roundResults[gameState.roundResults.length - 1]?.letter}
                </Badge>
                Round {roundNumber} Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gameState.categories
                  .filter((cat) => cat.enabled)
                  .map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-gray-800">{category.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {gameState.players.map((player) => {
                          const submission = gameState.roundResults[
                            gameState.roundResults.length - 1
                          ]?.submissions.find((s) => s.playerId === player.id && s.category === category.id)

                          return (
                            <div key={player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="font-medium text-gray-800">{player.name}:</span>
                              <div className="flex items-center gap-2">
                                <span className={cn(submission?.word ? "text-gray-900" : "text-gray-400")}>
                                  {submission?.word || "—"}
                                </span>
                                {submission?.isValid !== undefined && submission?.word && (
                                  <div className="flex items-center gap-1">
                                    {submission.isValid ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                )}
                                {submission?.points !== undefined && (
                                  <Badge
                                    variant={submission.points > 0 ? "default" : "secondary"}
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                  >
                                    +{submission.points}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          {isGameFinished ? (
            <>
              <Button
                onClick={handleRestartGame}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-full sm:w-auto text-white font-semibold fun-shadow hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={handleLeaveGame}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Home className="w-5 h-5 mr-2" />
                Main Menu
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleContinueToNextRound}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-full sm:w-auto text-white font-semibold fun-shadow hover:scale-105 transition-transform"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Continue to Next Round
              </Button>
              <Button
                onClick={handleEndGame}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-red-600 border-2 border-red-300 hover:bg-red-50"
              >
                <StopCircle className="w-5 h-5 mr-2" />
                End Game
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
