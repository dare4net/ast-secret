"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, HelpCircle, Bot, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function NameValidation() {
  const [votedNames, setVotedNames] = useState<Set<string>>(new Set())
  const [votedPlayers, setVotedPlayers] = useState<Set<string>>(new Set())

  // Mock data for demo
  const gameState = {
    phase: "validation",
    nameValidations: [
      {
        word: "Samantha",
        playerId: "player2",
        votes: { player1: "yes" },
        aiOpinion: "valid" as const,
        finalResult: null,
      },
      {
        word: "Superman",
        playerId: "player3",
        votes: { player1: "no", player2: "idk" },
        aiOpinion: "invalid" as const,
        finalResult: null,
      },
    ],
    players: [
      { id: "player1", name: "You" },
      { id: "player2", name: "Alice" },
      { id: "player3", name: "Bob" },
    ],
  }

  const currentPlayer = { id: "player1", name: "You" }

  useEffect(() => {
    setVotedPlayers(new Set())
  }, [gameState.phase])

  const handleVote = (word: string, vote: "yes" | "no" | "idk", votedPlayer: string) => {
    setVotedNames((prev) => new Set([...prev, word]))
    setVotedPlayers((prev) => new Set([...prev, votedPlayer]))
    console.log(`Voted ${vote} on ${word} by ${votedPlayer}`)
  }

  if (gameState.phase !== "validation" || gameState.nameValidations.length === 0) {
    return null
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
        <Card className="border-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white fun-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Name Validation</CardTitle>
            <p className="text-lg opacity-90">Vote on whether these names are valid</p>
          </CardHeader>
        </Card>

        {gameState.nameValidations.map((validation) => {
          const totalVotes = Object.keys(validation.votes).length
          const yesVotes = Object.values(validation.votes).filter((v) => v === "yes").length
          const noVotes = Object.values(validation.votes).filter((v) => v === "no").length
          const idkVotes = Object.values(validation.votes).filter((v) => v === "idk").length

          const submittedByCurrentPlayer = validation.playerId === currentPlayer?.id
          const hasVotedPlayer = votedPlayers.has(validation.playerId)
          const canVote = !submittedByCurrentPlayer && !hasVotedPlayer

          return (
            <Card
              key={validation.playerId}
              className="border-0 bg-white/80 backdrop-blur-sm transition-all duration-200 fun-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-800">"{validation.word}"</CardTitle>
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    {gameState.players.find((p) => p.id === validation.playerId)?.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voting Buttons */}
                {canVote && (
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => handleVote(validation.word, "yes", validation.playerId)}
                      variant="outline"
                      className="flex-1 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:scale-105 transition-transform"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      onClick={() => handleVote(validation.word, "no", validation.playerId)}
                      variant="outline"
                      className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:scale-105 transition-transform"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      No
                    </Button>
                    <Button
                      onClick={() => handleVote(validation.word, "idk", validation.playerId)}
                      variant="outline"
                      className="flex-1 border-2 border-gray-500 text-gray-600 hover:bg-gray-50 hover:scale-105 transition-transform"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      IDK
                    </Button>
                  </div>
                )}

                {/* Vote Results */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Yes: {yesVotes}</span>
                    <span>No: {noVotes}</span>
                    <span>IDK: {idkVotes}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 h-2">
                    <div className="bg-green-500 rounded-l" style={{ opacity: yesVotes / Math.max(totalVotes, 1) }} />
                    <div className="bg-red-500" style={{ opacity: noVotes / Math.max(totalVotes, 1) }} />
                    <div className="bg-gray-400 rounded-r" style={{ opacity: idkVotes / Math.max(totalVotes, 1) }} />
                  </div>
                </div>

                {/* AI Opinion */}
                {validation.aiOpinion && (
                  <div
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg",
                      validation.aiOpinion === "valid"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : validation.aiOpinion === "invalid"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200",
                    )}
                  >
                    <Bot className="w-5 h-5" />
                    <span className="font-medium">AI thinks this name is {validation.aiOpinion}</span>
                  </div>
                )}

                {/* Final Result */}
                {validation.finalResult && (
                  <Badge
                    variant={validation.finalResult === "valid" ? "default" : "destructive"}
                    className="w-full justify-center py-2"
                  >
                    {validation.finalResult === "valid" ? "VALID NAME" : "INVALID NAME"}
                  </Badge>
                )}

                {/* Status Messages */}
                {submittedByCurrentPlayer && (
                  <p className="text-sm text-gray-500 text-center">This is your submission - you cannot vote</p>
                )}

                {hasVotedPlayer && !submittedByCurrentPlayer && (
                  <p className="text-sm text-green-600 text-center">✓ You have voted on this name</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
