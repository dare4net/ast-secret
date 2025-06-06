"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Users, Settings, Play, Copy, Check, Sparkles, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function GameLobby() {
  const [copiedGameId, setCopiedGameId] = useState(false)

  // Mock data for demo
  const gameState = {
    id: "DEMO123",
    phase: "lobby",
    players: [
      { id: "1", name: "You", isHost: true },
      { id: "2", name: "Player 2", isHost: false },
    ],
    categories: [
      { id: "names", name: "Names", enabled: true, autoValidate: false },
      { id: "places", name: "Places", enabled: true, autoValidate: true },
      { id: "things", name: "Things", enabled: true, autoValidate: true },
      { id: "animals", name: "Animals", enabled: false, autoValidate: true },
    ],
    settings: { maxPlayers: 6, roundTime: 45 },
  }

  const currentPlayer = gameState.players[0]

  const handleCopyGameId = async () => {
    try {
      await navigator.clipboard.writeText(gameState.id)
      setCopiedGameId(true)
      setTimeout(() => setCopiedGameId(false), 2000)
    } catch (err) {
      console.error("Failed to copy game ID:", err)
    }
  }

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    console.log(`Toggle category ${categoryId}: ${enabled}`)
  }

  const handleStartGame = () => {
    console.log("Starting game...")
  }

  const isHost = currentPlayer?.isHost || false
  const enabledCategories = gameState.categories.filter((cat) => cat.enabled)
  const playerCount = gameState.players.length
  const minPlayersRequired = 2
  const canStart = playerCount >= minPlayersRequired && enabledCategories.length >= 3
  const playersNeeded = Math.max(minPlayersRequired - playerCount, 0)

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
        <Card className="border-0 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white fun-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Game Lobby
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>
                      {playerCount}/{gameState.settings.maxPlayers} Players
                    </span>
                  </div>
                  {gameState.id && gameState.id !== "solo-game" && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-90">Game ID:</span>
                      <Button
                        onClick={handleCopyGameId}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-purple-600"
                      >
                        {copiedGameId ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            {gameState.id}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {isHost && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Host ({currentPlayer?.name})
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Players List */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Users className="w-5 h-5 text-purple-600" />
                Players ({playerCount} / {minPlayersRequired} minimum)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gameState.players.map((player, index) => (
                  <div
                    key={player.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-all",
                      player.id === currentPlayer?.id
                        ? "bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-purple-300"
                        : "bg-gray-50 border border-gray-200",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                          index === 0
                            ? "bg-gradient-to-r from-pink-500 to-purple-600"
                            : index === 1
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                              : index === 2
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : "bg-gradient-to-r from-orange-500 to-red-500",
                        )}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{player.name}</div>
                        {player.id === currentPlayer?.id && <div className="text-sm text-purple-600">You</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {player.isHost && (
                        <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                          Host
                        </Badge>
                      )}
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                ))}

                {/* Show slots for missing players */}
                {playersNeeded > 0 && (
                  <div className="flex items-center justify-center p-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        Need {playersNeeded} more player{playersNeeded > 1 ? "s" : ""}
                      </div>
                      <div className="text-xs">Share the Game ID with friends!</div>
                    </div>
                  </div>
                )}

                {playerCount >= minPlayersRequired && playerCount < gameState.settings.maxPlayers && (
                  <div className="flex items-center justify-center p-3 border-2 border-dashed border-green-300 rounded-lg text-green-600">
                    <div className="text-center">
                      <div className="text-sm font-medium">✓ Ready to start!</div>
                      <div className="text-xs">More players can still join</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Settings */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Settings className="w-5 h-5 text-purple-600" />
                Categories
                {!isHost && (
                  <Badge variant="outline" className="text-xs ml-2 border-gray-300 text-gray-600">
                    Host Only
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gameState.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{category.name}</div>
                      <div className="text-sm text-gray-500">
                        {category.autoValidate ? "Auto-validated" : "Player-validated"}
                      </div>
                    </div>
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={(enabled) => handleCategoryToggle(category.id, enabled)}
                      disabled={!isHost}
                    />
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <strong>{enabledCategories.length}</strong> categories selected
                    <br />
                    <span className="text-xs">Minimum 3 categories required</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="flex gap-4 justify-center">
          {isHost ? (
            <Button
              onClick={handleStartGame}
              disabled={!canStart}
              size="lg"
              className={cn(
                "px-8 py-4 text-lg transition-all duration-200 font-semibold",
                canStart
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 text-white fun-shadow"
                  : "bg-gray-400 cursor-not-allowed text-white",
              )}
            >
              <Play className="w-6 h-6 mr-2" />
              {canStart ? "Start Game" : `Need ${playersNeeded} More Player${playersNeeded > 1 ? "s" : ""}`}
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-2">Waiting for host to start the game...</p>
              <div className="animate-pulse text-lg font-semibold gradient-text">
                {gameState.players.find((p) => p.isHost)?.name} will start when ready
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg border-2 border-red-300 text-red-600 hover:bg-red-50"
          >
            Leave Game
          </Button>
        </div>

        {/* Game Rules Reminder */}
        <Card className="border-0 bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardContent className="p-4">
            <div className="text-center text-sm text-blue-800">
              <strong>Quick Reminder:</strong> Fill categories with words starting with the selected letter. You have{" "}
              {gameState.settings.roundTime} seconds per round. Unique words = 10 points!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
