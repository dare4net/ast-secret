"use client"

import { useState } from "react"
import { SplashScreen } from "@/name-game/splash-screen"
import { MainMenu } from "@/name-game/main-menu"
import { GameLobby } from "@/name-game/game-lobby"
import { GameBoard } from "@/name-game/game-board"
import { LetterSelection } from "@/name-game/letter-selection"
import { NameValidation } from "@/name-game/name-validation"
import { Scoreboard } from "@/name-game/scoreboard"
import { GameHeader } from "@/name-game/game-header"
import { GameMenu } from "@/name-game/game-menu"

type GamePhase = "splash" | "menu" | "lobby" | "letter-selection" | "playing" | "validation" | "results" | "finished"

function GameContent() {
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
  const showMenu = !["splash", "menu"].includes(currentPhase)

  return (
    <div className="min-h-screen">
      {showHeader && <GameHeader />}
      {showMenu && <GameMenu />}
      {renderCurrentPhase()}

      {/* Demo Navigation - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-purple-200">
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

export default function NameGamePage() {
  return <GameContent />
}
