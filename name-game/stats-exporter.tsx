"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Trophy, Star, Medal } from "lucide-react"

export interface GameStats {
  playerName: string
  totalScore: number
  rank: number
  totalPlayers: number
  uniqueWords: number
  rareWords: number
  fastestSubmission: number // in seconds
  mostAlliteration: number
  longestWord: string
  categories: string[]
  lettersMastered: string[]
  perfectRounds: number
  totalRounds: number
}

interface StatsExporterProps {
  stats: GameStats
  onClose?: () => void
}

export function StatsExporter({ stats, onClose }: StatsExporterProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate the stats image
  const generateStatsImage = async () => {
    setIsGenerating(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size - optimized for both desktop and mobile sharing
    const isMobile = window.innerWidth < 768
    const width = isMobile ? 800 : 1200
    const height = isMobile ? 1400 : 1200

    canvas.width = width
    canvas.height = height

    // Fill with white background
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)

    // Draw header with subtle gradient
    const headerGradient = ctx.createLinearGradient(0, 0, width, 150)
    headerGradient.addColorStop(0, "#ff6b6b10")
    headerGradient.addColorStop(1, "#4ecdc410")
    ctx.fillStyle = headerGradient
    ctx.fillRect(0, 0, width, 150)

    // Draw game title
    ctx.fillStyle = "#333333"
    ctx.textAlign = "center"
    ctx.font = `bold ${isMobile ? 48 : 56}px Poppins, sans-serif`
    ctx.fillText("The Name Game", width / 2, 80)

    // Draw player name and stats title
    ctx.font = `bold ${isMobile ? 32 : 40}px Poppins, sans-serif`
    ctx.fillText(`${stats.playerName}'s Game Stats`, width / 2, 140)

    // Function to draw achievement card
    const drawAchievementCard = (
      x: number,
      y: number,
      width: number,
      height: number,
      icon: string,
      value: string,
      label: string,
      gradientColors: { from: string; to: string },
    ) => {
      // Card background with gradient
      const cardGradient = ctx.createLinearGradient(x, y, x + width, y + height)
      cardGradient.addColorStop(0, gradientColors.from)
      cardGradient.addColorStop(1, gradientColors.to)
      ctx.fillStyle = cardGradient

      // Draw rounded rectangle
      const radius = 16
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()

      // Draw icon
      ctx.fillStyle = "#333333"
      ctx.font = `${isMobile ? 32 : 36}px sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(icon, x + width / 2, y + 50)

      // Draw value
      ctx.font = `bold ${isMobile ? 48 : 56}px Poppins, sans-serif`
      ctx.fillText(value, x + width / 2, y + 110)

      // Draw label
      ctx.font = `${isMobile ? 20 : 24}px Poppins, sans-serif`
      ctx.fillStyle = "#555555"
      ctx.fillText(label, x + width / 2, y + 150)
    }

    // Calculate card dimensions and spacing
    const cardWidth = isMobile ? width - 60 : (width - 80) / 3
    const cardHeight = 180
    const cardMargin = 20

    // Draw first row of achievement cards
    if (isMobile) {
      // Mobile layout - stack cards vertically
      drawAchievementCard(30, 180, cardWidth, cardHeight, "🏆", stats.totalScore.toString(), "Total Score", {
        from: "#fff0f3",
        to: "#ffe5ec",
      })

      drawAchievementCard(
        30,
        180 + cardHeight + cardMargin,
        cardWidth,
        cardHeight,
        "🥈",
        `#${stats.rank}`,
        `of ${stats.totalPlayers} Players`,
        { from: "#e6f9ff", to: "#e0f7fa" },
      )

      drawAchievementCard(
        30,
        180 + (cardHeight + cardMargin) * 2,
        cardWidth,
        cardHeight,
        "⭐",
        stats.uniqueWords.toString(),
        "Unique Words",
        { from: "#f0fff4", to: "#e6ffec" },
      )

      // Second row of achievements
      drawAchievementCard(
        30,
        180 + (cardHeight + cardMargin) * 3,
        cardWidth,
        cardHeight,
        "💎",
        stats.rareWords.toString(),
        "Rare Words",
        { from: "#f0f7ff", to: "#e6f0ff" },
      )

      drawAchievementCard(
        30,
        180 + (cardHeight + cardMargin) * 4,
        cardWidth,
        cardHeight,
        "⚡",
        `${stats.fastestSubmission}s`,
        "Fastest Submission",
        { from: "#fff9e6", to: "#fff5d6" },
      )

      drawAchievementCard(
        30,
        180 + (cardHeight + cardMargin) * 5,
        cardWidth,
        cardHeight,
        "📝",
        stats.mostAlliteration.toString(),
        "Alliterations",
        { from: "#f9f0ff", to: "#f5e6ff" },
      )
    } else {
      // Desktop layout - 3x2 grid
      // First row
      drawAchievementCard(20, 180, cardWidth, cardHeight, "🏆", stats.totalScore.toString(), "Total Score", {
        from: "#fff0f3",
        to: "#ffe5ec",
      })

      drawAchievementCard(
        40 + cardWidth,
        180,
        cardWidth,
        cardHeight,
        "🥈",
        `#${stats.rank}`,
        `of ${stats.totalPlayers} Players`,
        { from: "#e6f9ff", to: "#e0f7fa" },
      )

      drawAchievementCard(
        60 + cardWidth * 2,
        180,
        cardWidth,
        cardHeight,
        "⭐",
        stats.uniqueWords.toString(),
        "Unique Words",
        { from: "#f0fff4", to: "#e6ffec" },
      )

      // Second row
      drawAchievementCard(
        20,
        180 + cardHeight + cardMargin,
        cardWidth,
        cardHeight,
        "💎",
        stats.rareWords.toString(),
        "Rare Words",
        { from: "#f0f7ff", to: "#e6f0ff" },
      )

      drawAchievementCard(
        40 + cardWidth,
        180 + cardHeight + cardMargin,
        cardWidth,
        cardHeight,
        "⚡",
        `${stats.fastestSubmission}s`,
        "Fastest Submission",
        { from: "#fff9e6", to: "#fff5d6" },
      )

      drawAchievementCard(
        60 + cardWidth * 2,
        180 + cardHeight + cardMargin,
        cardWidth,
        cardHeight,
        "📝",
        stats.mostAlliteration.toString(),
        "Alliterations",
        { from: "#f9f0ff", to: "#f5e6ff" },
      )
    }

    // Draw additional stats section
    const additionalStatsY = isMobile
      ? 180 + (cardHeight + cardMargin) * 6 + 20
      : 180 + (cardHeight + cardMargin) * 2 + 40

    // Section title
    ctx.fillStyle = "#333333"
    ctx.font = `bold ${isMobile ? 32 : 36}px Poppins, sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("More Achievements", width / 2, additionalStatsY)

    // Additional stats box
    const statsBoxY = additionalStatsY + 20
    const statsBoxHeight = isMobile ? 300 : 250

    // Stats box background
    const statsGradient = ctx.createLinearGradient(20, statsBoxY, width - 20, statsBoxY + statsBoxHeight)
    statsGradient.addColorStop(0, "#f8f9fa")
    statsGradient.addColorStop(1, "#f1f3f5")
    ctx.fillStyle = statsGradient

    // Draw rounded rectangle for stats box
    const boxRadius = 16
    ctx.beginPath()
    ctx.moveTo(20 + boxRadius, statsBoxY)
    ctx.lineTo(width - 20 - boxRadius, statsBoxY)
    ctx.quadraticCurveTo(width - 20, statsBoxY, width - 20, statsBoxY + boxRadius)
    ctx.lineTo(width - 20, statsBoxY + statsBoxHeight - boxRadius)
    ctx.quadraticCurveTo(width - 20, statsBoxY + statsBoxHeight, width - 20 - boxRadius, statsBoxY + statsBoxHeight)
    ctx.lineTo(20 + boxRadius, statsBoxY + statsBoxHeight)
    ctx.quadraticCurveTo(20, statsBoxY + statsBoxHeight, 20, statsBoxY + statsBoxHeight - boxRadius)
    ctx.lineTo(20, statsBoxY + boxRadius)
    ctx.quadraticCurveTo(20, statsBoxY, 20 + boxRadius, statsBoxY)
    ctx.closePath()
    ctx.fill()

    // Draw additional stats content
    const statsPadding = 30
    const statsLineHeight = isMobile ? 50 : 40
    const statsStartY = statsBoxY + 50

    ctx.textAlign = "left"
    ctx.fillStyle = "#333333"
    ctx.font = `${isMobile ? 22 : 24}px Poppins, sans-serif`

    // Longest word
    ctx.fillText(`📚 Longest Word: "${stats.longestWord}"`, statsPadding + 20, statsStartY)

    // Perfect rounds
    ctx.fillText(
      `🎯 Perfect Rounds: ${stats.perfectRounds}/${stats.totalRounds}`,
      statsPadding + 20,
      statsStartY + statsLineHeight,
    )

    // Categories
    ctx.fillText(
      `🏅 Categories Mastered: ${stats.categories.join(", ")}`,
      statsPadding + 20,
      statsStartY + statsLineHeight * 2,
    )

    // Letters
    ctx.fillText(
      `🔤 Letters Mastered: ${stats.lettersMastered.join(", ")}`,
      statsPadding + 20,
      statsStartY + statsLineHeight * 3,
    )

    // Draw CTA section
    const ctaY = statsBoxY + statsBoxHeight + 40

    // CTA background
    const ctaGradient = ctx.createLinearGradient(20, ctaY, width - 20, ctaY + 120)
    ctaGradient.addColorStop(0, "#ff6b6b30")
    ctaGradient.addColorStop(1, "#4ecdc430")
    ctx.fillStyle = ctaGradient

    // Draw rounded rectangle for CTA
    ctx.beginPath()
    ctx.moveTo(20 + boxRadius, ctaY)
    ctx.lineTo(width - 20 - boxRadius, ctaY)
    ctx.quadraticCurveTo(width - 20, ctaY, width - 20, ctaY + boxRadius)
    ctx.lineTo(width - 20, ctaY + 120 - boxRadius)
    ctx.quadraticCurveTo(width - 20, ctaY + 120, width - 20 - boxRadius, ctaY + 120)
    ctx.lineTo(20 + boxRadius, ctaY + 120)
    ctx.quadraticCurveTo(20, ctaY + 120, 20, ctaY + 120 - boxRadius)
    ctx.lineTo(20, ctaY + boxRadius)
    ctx.quadraticCurveTo(20, ctaY, 20 + boxRadius, ctaY)
    ctx.closePath()
    ctx.fill()

    // CTA text
    ctx.fillStyle = "#333333"
    ctx.textAlign = "center"
    ctx.font = `bold ${isMobile ? 28 : 32}px Poppins, sans-serif`
    ctx.fillText("Think you can beat me?", width / 2, ctaY + 50)
    ctx.font = `${isMobile ? 22 : 24}px Poppins, sans-serif`
    ctx.fillText("Play The Name Game now at ast-secret.app/name-game", width / 2, ctaY + 90)

    // Draw footer
    ctx.fillStyle = "#777777"
    ctx.font = `${isMobile ? 16 : 18}px Poppins, sans-serif`
    ctx.fillText("ast-secret games • Fast-paced word association fun!", width / 2, height - 30)

    // Convert to URL
    try {
      const url = canvas.toDataURL("image/png")
      setImageUrl(url)
    } catch (error) {
      console.error("Error generating image:", error)
    }

    setIsGenerating(false)
  }

  // Generate image on component mount
  useEffect(() => {
    generateStatsImage()
  }, [])

  // Download the image
  const handleDownload = () => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `name-game-stats-${stats.playerName}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Share the image (if Web Share API is available)
  const handleShare = async () => {
    if (!imageUrl || !navigator.share) return

    try {
      // Convert data URL to blob
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], `name-game-stats-${stats.playerName}.png`, { type: "image/png" })

      await navigator.share({
        title: "My Name Game Stats",
        text: `Check out my score of ${stats.totalScore} in The Name Game!`,
        files: [file],
      })
    } catch (error) {
      console.error("Error sharing:", error)
      // Fallback to download if sharing fails
      handleDownload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 bg-white/80 backdrop-blur-sm fun-shadow">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Game Stats Ready to Share!
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Preview */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {isGenerating ? (
              <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-purple-700">Generating your stats image...</p>
                </div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Game Stats"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="aspect-square w-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">Failed to generate image</p>
              </div>
            )}

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalScore}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <Medal className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800">#{stats.rank}</div>
              <div className="text-sm text-gray-600">of {stats.totalPlayers} Players</div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-2">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.uniqueWords}</div>
              <div className="text-sm text-gray-600">Unique Words</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownload}
              disabled={!imageUrl || isGenerating}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold fun-shadow hover:scale-105 transition-transform"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Stats Image
            </Button>

            {navigator.share && (
              <Button
                onClick={handleShare}
                disabled={!imageUrl || isGenerating}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold fun-shadow hover:scale-105 transition-transform"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Stats
              </Button>
            )}

            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </Button>
            )}
          </div>

          {/* Tips */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>💡 Tip: Share your stats on social media to challenge your friends!</p>
            <p>🎮 Play again to improve your score and climb the leaderboard!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
