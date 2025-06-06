"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Clock, Users, Bot, User, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export function LetterSelection() {
  // Mock data for demo
  const gameState = {
    phase: "letter-selection",
    id: "demo-game",
    currentRound: 0,
    usedLetters: ["A", "B", "C"],
    players: [
      { id: "1", name: "You" },
      { id: "2", name: "Player 2" },
    ],
    nextTurn: { id: "1", name: "You" },
  }

  const currentPlayer = { id: "1", name: "You" }

  const handleLetterSelect = (letter: string) => {
    console.log(`Letter selected: ${letter}`)
  }

  const getRandomAvailableLetter = () => {
    const available = ALPHABET.filter((letter) => !gameState.usedLetters.includes(letter))
    if (available.length === 0) return null
    return available[Math.floor(Math.random() * available.length)]
  }

  const handleRandomSelect = () => {
    const randomLetter = getRandomAvailableLetter()
    if (randomLetter) {
      handleLetterSelect(randomLetter)
    }
  }

  const getCurrentTurn = () => "human"
  const currentTurn = getCurrentTurn()
  const isHumanTurn = currentTurn === "human"
  const isCurrentPlayerTurn =
    (isHumanTurn && gameState.id === "solo-game") || gameState.nextTurn.id === currentPlayer.id
  const availableLetters = ALPHABET.filter((letter) => !gameState.usedLetters.includes(letter))
  const usedLetters = gameState.usedLetters

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

      <div className="w-full max-w-6xl mx-auto">
        <Card className="border-0 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 text-white fun-shadow">
          <CardHeader className="text-center pb-2 sm:pb-4">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-4">
              {gameState.id === "solo-game" ? (
                isHumanTurn ? (
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    <span className="text-base sm:text-lg md:text-3xl">🎯 Your Turn - Choose Your Letter!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    <span className="text-base sm:text-lg md:text-3xl">🤖 AI is thinking...</span>
                  </div>
                )
              ) : isCurrentPlayerTurn ? (
                "🎯 Choose Your Letter!"
              ) : (
                "⏳ Waiting for Letter Selection..."
              )}
            </CardTitle>

            {/* Game Progress */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm md:text-lg flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Round {gameState.currentRound + 1}/26</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>{gameState.players.length} Players</span>
              </div>
              {gameState.id === "solo-game" && (
                <div className="flex items-center gap-1 sm:gap-2">
                  {isHumanTurn ? (
                    <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  ) : (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  )}
                  <span>{isHumanTurn ? "Your Turn" : "AI Turn"}</span>
                </div>
              )}
            </div>

            {/* Used Letters Display */}
            {usedLetters.length > 0 && (
              <div className="mt-2 sm:mt-4">
                <p className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">Used Letters:</p>
                <div className="flex justify-center gap-1 flex-wrap">
                  {usedLetters.map((letter) => (
                    <Badge
                      key={letter}
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 text-xs px-1 py-0.5"
                    >
                      {letter}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-2 sm:p-4 md:p-6">
            {isCurrentPlayerTurn ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Available Letters Grid */}
                <div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4 text-center">
                    Available Letters ({availableLetters.length} remaining)
                  </h3>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-1 sm:gap-2 max-w-full">
                    {ALPHABET.map((letter) => {
                      const isUsed = usedLetters.includes(letter)
                      const isAvailable = !isUsed

                      return (
                        <Button
                          key={letter}
                          onClick={() => isAvailable && handleLetterSelect(letter)}
                          disabled={isUsed}
                          variant={isUsed ? "outline" : "secondary"}
                          className={cn(
                            "aspect-square text-xs sm:text-sm md:text-lg font-bold transition-all duration-200 relative p-0.5 sm:p-1",
                            "min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem]",
                            "min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem]",
                            isAvailable && "hover:scale-110 hover:bg-white hover:text-purple-600 hover:shadow-lg",
                            isUsed && "opacity-30 cursor-not-allowed bg-gray-500/50",
                          )}
                        >
                          {letter}
                          {isUsed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-red-400 rotate-45"></div>
                            </div>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                  <Button
                    onClick={handleRandomSelect}
                    variant="outline"
                    size="lg"
                    disabled={availableLetters.length === 0}
                    className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-purple-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base"
                  >
                    <Shuffle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2" />
                    Random Letter
                  </Button>

                  <div className="text-center text-xs sm:text-sm opacity-90">
                    <p>💡 Tip: Choose wisely! Each letter can only be used once per game.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                {gameState.id === "solo-game" && !isHumanTurn ? (
                  <div className="animate-pulse">
                    <div className="text-3xl sm:text-4xl md:text-6xl mb-2">🤖</div>
                    <div className="text-base sm:text-lg md:text-xl">AI is thinking...</div>
                    <div className="text-xs sm:text-sm opacity-75 mt-2">
                      Available letters: {availableLetters.length}
                    </div>
                    <div className="text-xs opacity-50 mt-1">Will select in exactly 3 seconds</div>
                  </div>
                ) : (
                  <div className="animate-pulse">
                    <div className="text-3xl sm:text-4xl md:text-6xl mb-2">⏳</div>
                    <div className="text-base sm:text-lg md:text-xl">
                      Waiting for {gameState.nextTurn.name || "host"} to select a letter...
                    </div>
                  </div>
                )}

                {/* Show available letters for reference */}
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm opacity-75 mb-2 sm:mb-3">Available Letters:</p>
                  <div className="flex justify-center gap-1 flex-wrap">
                    {availableLetters.map((letter) => (
                      <Badge
                        key={letter}
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white text-xs px-1 py-0.5"
                      >
                        {letter}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
