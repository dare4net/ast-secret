"use client"

import { useState } from "react"
import { SplashScreen } from "./splash-screen"
import { MainMenu } from "./main-menu"
import { GameLobby } from "./game-lobby"
import { LetterSelection } from "./letter-selection"
import { GameBoard } from "./game-board"
import { NameValidation } from "./name-validation"
import { Scoreboard } from "./scoreboard"
import { GameHeader } from "./game-header"

type GamePhase = "splash" | "menu" | "lobby" | "letter-selection" | "playing" | "validation" | "results" | "finished"

export function NameGame() {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("splash")
  const [gameMode, setGameMode] = useState<"solo" | "multiplayer" | null>(null)

  const handleSplashComplete = () => {
    setCurrentPhase("menu")
  }

  const handleStartGame = (mode: "solo" | "multiplayer") => {
    setGameMode(mode)
    setCurrentPhase("lobby")
  }

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />
      case "menu":
        return <MainMenu onStartGame={handleStartGame} />
      case "lobby":
        return <GameLobby />
      case "letter-selection":
        return <LetterSelection />
      case "playing":
        return <GameBoard />
      case "validation":
        return <NameValidation />
      case "results":
      case "finished":
        return <Scoreboard />
      default:
        return <MainMenu onStartGame={handleStartGame} />
    }
  }

  // Show header for all phases except splash and menu
  const showHeader = !["splash", "menu"].includes(currentPhase)

  return (
    <div className="min-h-screen">
      {showHeader && <GameHeader />}
      {renderCurrentPhase()}

      {/* Demo Navigation - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-purple-200">
          <div className="text-xs font-semibold text-gray-600 mb-2">Demo Navigation:</div>
          <div className="flex flex-wrap gap-1">
            {["splash", "menu", "lobby", "letter-selection", "playing", "validation", "results"].map((phase) => (
              <button
                key={phase}
                onClick={() => setCurrentPhase(phase as GamePhase)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  currentPhase === phase ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
