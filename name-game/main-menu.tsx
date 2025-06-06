"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Bot, Trophy, Sparkles, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MainMenuProps {
  onStartGame: (mode: "solo" | "multiplayer") => void
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  const [playerName, setPlayerName] = useState("")
  const [gameId, setGameId] = useState("")
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["names", "places", "things", "animals"])

  const availableCategories = [
    { id: "names", name: "Names" },
    { id: "places", name: "Places" },
    { id: "things", name: "Things" },
    { id: "animals", name: "Animals" },
    { id: "food", name: "Food" },
    { id: "colors", name: "Colors" },
    { id: "movies", name: "Movies" },
  ]

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        if (prev.length <= 3) return prev
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleCreateGame = () => {
    if (!playerName.trim()) return
    // createGame?.(playerName.trim(), selectedCategories)
    onStartGame("multiplayer")
  }

  const handleJoinGame = () => {
    if (!playerName.trim() || !gameId.trim()) return
    // joinGame?.(gameId.trim(), playerName.trim())
    onStartGame("multiplayer")
  }

  const handleSoloGame = () => {
    if (!playerName.trim()) return
    // startSoloGame?.(difficulty, newPlayer, selectedCategories)
    onStartGame("solo")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ast-secret games</span>
          </div>
        </div>

        {/* Title */}
        <Card className="border-0 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white fun-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
              🎯 <span>The Name Game</span>
            </CardTitle>
            <p className="text-lg opacity-90">Fast-paced word association fun!</p>
          </CardHeader>
        </Card>

        {/* Player Name Input */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Enter Your Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Your display name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="text-lg h-12 border-2 border-purple-200 focus:border-purple-400"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playerName.trim()) {
                  handleSoloGame()
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Categories Configuration */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Choose Categories ({selectedCategories.length}/7)</CardTitle>
            <p className="text-sm text-gray-600">Select at least 3 categories for your game</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:scale-105",
                    selectedCategories.includes(category.id)
                      ? "bg-gradient-to-r from-pink-50 to-purple-50 border-purple-300 text-purple-700"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100",
                  )}
                >
                  <span className="font-medium text-sm">{category.name}</span>
                  <div
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center",
                      selectedCategories.includes(category.id)
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 border-purple-500"
                        : "border-gray-300",
                    )}
                  >
                    {selectedCategories.includes(category.id) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                </div>
              ))}
            </div>
            {selectedCategories.length < 3 && (
              <p className="text-xs text-red-500 mt-2">Please select at least 3 categories</p>
            )}
          </CardContent>
        </Card>

        {/* Game Options */}
        <div className="space-y-3">
          {/* Create Game */}
          <Button
            onClick={handleCreateGame}
            disabled={!playerName.trim() || selectedCategories.length < 3}
            className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold fun-shadow hover:scale-105 transition-transform"
          >
            <Users className="w-6 h-6 mr-3" />
            Create Multiplayer Game
          </Button>

          {/* Join Game */}
          {!showJoinForm ? (
            <Button
              onClick={() => setShowJoinForm(true)}
              variant="outline"
              className="w-full h-14 text-lg border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Users className="w-6 h-6 mr-3" />
              Join Game
            </Button>
          ) : (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <Input
                  placeholder="Game ID"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="h-12 border-2 border-purple-200 focus:border-purple-400"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleJoinGame}
                    disabled={!playerName.trim() || !gameId.trim()}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  >
                    Join
                  </Button>
                  <Button onClick={() => setShowJoinForm(false)} variant="outline" className="flex-1 border-gray-300">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solo Game */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Solo vs AI</span>
                <div className="flex gap-1">
                  {(["easy", "medium", "hard"] as const).map((level) => (
                    <Badge
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        difficulty === level
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "border-purple-300 text-purple-700 hover:bg-purple-50",
                      )}
                      onClick={() => setDifficulty(level)}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleSoloGame}
                disabled={!playerName.trim() || selectedCategories.length < 3}
                variant="outline"
                className="w-full h-12 border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              >
                <Bot className="w-5 h-5 mr-2" />
                Play vs AI ({difficulty})
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Rules */}
        <Card className="border-0 bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <Trophy className="w-5 h-5 text-yellow-500" />
              How to Play
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>• Select a letter and fill categories with words starting with that letter</p>
            <p>• 45 seconds per round</p>
            <p>• Unique words = 10 points</p>
            <p>• Shared words = split points</p>
            <p>• Names require player validation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
