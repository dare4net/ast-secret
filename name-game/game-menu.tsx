"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Menu, RotateCcw, Home, Trophy, StopCircle, Volume2, VolumeX, Clock, Users, X, Gamepad2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function GameMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"main" | "settings" | "scores">("main")
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolume] = useState(0.7)

  // Mock data for demo
  const gameState = {
    phase: "playing",
    currentRound: 2,
    currentLetter: "S",
    timeLeft: 25,
    players: [
      { id: "1", name: "You", score: 85 },
      { id: "2", name: "Player 2", score: 72 },
    ],
    settings: { roundTime: 45, maxPlayers: 6 },
    categories: [
      { id: "names", name: "Names", enabled: true },
      { id: "places", name: "Places", enabled: true },
      { id: "things", name: "Things", enabled: true },
      { id: "animals", name: "Animals", enabled: false },
    ],
    usedLetters: ["A", "B", "S"],
    roundResults: [{ letter: "A" }, { letter: "B" }],
  }

  const gameMode = "multiplayer"

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const testSound = () => {
    console.log("Test sound played")
  }

  const handleEndGame = () => {
    if (confirm("Are you sure you want to end the current game?")) {
      console.log("Ending game...")
      setIsOpen(false)
    }
  }

  const handleRestartGame = () => {
    if (confirm("Are you sure you want to restart the game? All progress will be lost.")) {
      console.log("Restarting game...")
      setIsOpen(false)
    }
  }

  const handleLeaveGame = () => {
    if (confirm("Are you sure you want to leave the game?")) {
      console.log("Leaving game...")
      setIsOpen(false)
    }
  }

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)
  const isGameActive = gameState.phase === "playing" || gameState.phase === "letter-selection"

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
      >
        <Menu className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden border-0 bg-white/90 backdrop-blur-sm fun-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardTitle className="text-xl">Game Menu</CardTitle>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <Button
              onClick={() => setActiveTab("main")}
              variant={activeTab === "main" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-1",
                activeTab === "main"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-100",
              )}
            >
              <Gamepad2 className="w-4 h-4 mr-1" />
              Game
            </Button>
            <Button
              onClick={() => setActiveTab("settings")}
              variant={activeTab === "settings" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-1",
                activeTab === "settings"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-100",
              )}
            >
              <Volume2 className="w-4 h-4 mr-1" />
              Audio
            </Button>
            <Button
              onClick={() => setActiveTab("scores")}
              variant={activeTab === "scores" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-1",
                activeTab === "scores"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-100",
              )}
            >
              <Trophy className="w-4 h-4 mr-1" />
              Scores
            </Button>
          </div>

          {/* Main Tab */}
          {activeTab === "main" && (
            <div className="space-y-4">
              {/* Game Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Game Mode:</span>
                  <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">
                    {gameMode === "solo" ? "Solo vs AI" : "Multiplayer"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Round:</span>
                  <span className="font-semibold text-gray-800">{gameState.currentRound + 1}/26</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phase:</span>
                  <Badge variant="secondary" className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700">
                    {gameState.phase}
                  </Badge>
                </div>
                {gameState.currentLetter && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current Letter:</span>
                    <Badge className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                      {gameState.currentLetter}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Players:</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-gray-800">{gameState.players.length}</span>
                  </div>
                </div>
                {isGameActive && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time Left:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className={cn("font-semibold", gameState.timeLeft <= 10 && "text-red-500 animate-pulse")}>
                        {gameState.timeLeft}s
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Game Actions */}
              <div className="space-y-2">
                {isGameActive && (
                  <Button
                    onClick={handleEndGame}
                    variant="outline"
                    className="w-full text-red-600 border-2 border-red-300 hover:bg-red-50"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    End Game
                  </Button>
                )}

                <Button
                  onClick={handleRestartGame}
                  variant="outline"
                  className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart Game
                </Button>

                <Button
                  onClick={handleLeaveGame}
                  variant="outline"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Leave Game
                </Button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              {/* Sound Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {enabled ? (
                      <Volume2 className="w-4 h-4 text-purple-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-800">Sound Effects</span>
                  </div>
                  <Switch checked={enabled} onCheckedChange={setEnabled} />
                </div>

                {enabled && (
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Volume</span>
                      <span className="text-sm text-purple-600 font-semibold">{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <Button
                      onClick={testSound}
                      variant="outline"
                      size="sm"
                      className="w-full border-2 border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                    >
                      Test Sound
                    </Button>
                  </div>
                )}
              </div>

              {/* Game Settings Info */}
              <div className="space-y-2 pt-4 border-t border-purple-200">
                <h4 className="font-medium text-sm text-gray-800">Game Settings</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Round Time:</span>
                    <span className="font-semibold">{gameState.settings.roundTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Players:</span>
                    <span className="font-semibold">{gameState.settings.maxPlayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-semibold">{gameState.categories.filter((cat) => cat.enabled).length}</span>
                  </div>
                </div>
              </div>

              {/* Sound Effects Info */}
              <div className="space-y-2 pt-4 border-t border-purple-200">
                <h4 className="font-medium text-sm text-gray-800">Sound Effects Include:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Timer ticks (last 10 seconds)</div>
                  <div>• Word submission confirmation</div>
                  <div>• Round start/end notifications</div>
                  <div>• Game start sounds</div>
                </div>
              </div>
            </div>
          )}

          {/* Scores Tab */}
          {activeTab === "scores" && (
            <div className="space-y-4">
              {gameState.players.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Current Standings</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {sortedPlayers.map((player, index) => (
                      <div
                        key={player.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg",
                          index === 0
                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300"
                            : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                              index === 0
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                : index === 1
                                  ? "bg-gradient-to-r from-gray-400 to-gray-600"
                                  : index === 2
                                    ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                    : "bg-gradient-to-r from-pink-500 to-purple-600",
                            )}
                          >
                            {index + 1}
                          </div>
                          <span className="font-medium text-sm text-gray-800">{player.name}</span>
                          {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">{player.score}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No scores yet</p>
                  <p className="text-xs">Start playing to see scores!</p>
                </div>
              )}

              {/* Game Progress */}
              {gameState.roundResults.length > 0 && (
                <div className="pt-4 border-t border-purple-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-800">Game Progress</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Rounds Played:</span>
                      <span className="font-semibold">{gameState.roundResults.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Letters Used:</span>
                      <span className="font-semibold">{gameState.usedLetters.length}/26</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion:</span>
                      <span className="font-semibold">{Math.round((gameState.usedLetters.length / 26) * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
