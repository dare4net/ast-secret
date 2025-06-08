import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cookie utilities for temporary accounts
export function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function generateUsername(): string {
  const adjectives = ["Cool", "Happy", "Bright", "Swift", "Clever", "Bold", "Kind", "Wise", "Fun", "Nice"]
  const nouns = ["Star", "Moon", "Sun", "Wave", "Fire", "Wind", "Rain", "Snow", "Sky", "Sea"]
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 999) + 1
  return `${adj}${noun}${num}`
}

export function setCookie(name: string, value: string, hours = 24) {
  const expires = new Date()
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function deleteCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
}

// Image generation for messages
export function generateMessageImage(
  message: string,
  username: string,
  timestamp: string,
  reply?: string,
  reactions?: { heart: number; fire: number; laugh: number }
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Set canvas size - make it taller if there's a reply
    canvas.width = 600
    canvas.height = reply ? 500 : 400

    // Create gradient background (matching app style)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#fce7f3") // pink-100
    gradient.addColorStop(0.5, "#f3e8ff") // purple-50
    gradient.addColorStop(1, "#cffafe") // cyan-100

    // Fill background
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw elevated white card with shadow
    const cardMargin = 40
    const cardWidth = canvas.width - (cardMargin * 2)
    const cardHeight = canvas.height - (cardMargin * 2)
    
    // Draw card shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 4
    
    // Draw white card background
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fillRect(cardMargin, cardMargin, cardWidth, cardHeight)
    
    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    
    // Draw logo/title
    ctx.fillStyle = "#6b21a8" // purple-800
    ctx.textAlign = "center"
    ctx.font = "bold 24px Poppins, sans-serif"
    ctx.fillText("ast-secret", canvas.width / 2, cardMargin + 40)

    // Draw username
    ctx.font = "18px Poppins, sans-serif"
    ctx.fillStyle = "#9333ea" // purple-600
    ctx.fillText(`@${username}`, canvas.width / 2, cardMargin + 70)

    // Draw message (with text wrapping)
    ctx.font = "bold 20px Poppins, sans-serif"
    ctx.fillStyle = "#1f2937" // gray-800
    const maxWidth = cardWidth - 60
    const lineHeight = 30
    const words = message.split(" ")
    let line = ""
    let y = cardMargin + 140

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " "
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y)
        line = words[n] + " "
        y += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, canvas.width / 2, y)

    // Draw reactions if they exist
    if (reactions) {
      const reactionY = y + 40
      ctx.font = "16px Poppins, sans-serif"
      ctx.fillStyle = "#6b7280" // gray-500
      
      // Draw heart reaction
      if (reactions.heart > 0) {
        ctx.fillStyle = "#ec4899" // pink-500
        ctx.fillText(`❤️ ${reactions.heart}`, canvas.width / 2 - 80, reactionY)
      }
      
      // Draw fire reaction
      if (reactions.fire > 0) {
        ctx.fillStyle = "#f97316" // orange-500
        ctx.fillText(`🔥 ${reactions.fire}`, canvas.width / 2, reactionY)
      }
      
      // Draw laugh reaction
      if (reactions.laugh > 0) {
        ctx.fillStyle = "#eab308" // yellow-500
        ctx.fillText(`😂 ${reactions.laugh}`, canvas.width / 2 + 80, reactionY)
      }
      
      y = reactionY + 20
    }

    // Draw reply if exists
    if (reply) {
      // Draw separator line
      ctx.strokeStyle = "#e5e7eb" // gray-200
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cardMargin + 40, y + 30)
      ctx.lineTo(canvas.width - cardMargin - 40, y + 30)
      ctx.stroke()

      // Draw reply label
      ctx.font = "italic 16px Poppins, sans-serif"
      ctx.fillStyle = "#6b7280" // gray-500
      ctx.fillText("Reply:", canvas.width / 2, y + 60)

      // Draw reply text
      ctx.font = "18px Poppins, sans-serif"
      ctx.fillStyle = "#374151" // gray-700
      const replyWords = reply.split(" ")
      let replyLine = ""
      let replyY = y + 90

      for (let n = 0; n < replyWords.length; n++) {
        const testLine = replyLine + replyWords[n] + " "
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width
        if (testWidth > maxWidth - 40 && n > 0) {
          ctx.fillText(replyLine, canvas.width / 2, replyY)
          replyLine = replyWords[n] + " "
          replyY += lineHeight
        } else {
          replyLine = testLine
        }
      }
      ctx.fillText(replyLine, canvas.width / 2, replyY)
    }

    // Draw timestamp at the bottom
    ctx.font = "14px Poppins, sans-serif"
    ctx.fillStyle = "#9ca3af" // gray-400
    ctx.fillText(timestamp, canvas.width / 2, canvas.height - cardMargin - 20)

    // Convert to blob URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        resolve(url)
      }
    }, "image/png")
  })
}

export function downloadImage(url: string, filename: string) {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Generate analytics image
export function generateAnalyticsImage(stats: {
  totalMessages: string
  totalReactions: string
  averageReactions: string
  responseRate: string
  publicMessages: string
  privateMessages: string
  unreadMessages: string
  mostPopularReaction: string
}): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#764ba2")
    gradient.addColorStop(1, "#667eea")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add semi-transparent overlay
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw title
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.font = "bold 32px Poppins, sans-serif"
    ctx.fillText("ast-secret Analytics", canvas.width / 2, 60)

    // Draw date range
    const today = new Date()
    const formattedDate = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    ctx.font = "18px Poppins, sans-serif"
    ctx.fillText(`Generated on ${formattedDate}`, canvas.width / 2, 100)

    // Draw stats boxes
    const boxWidth = 320
    const boxHeight = 120
    const margin = 40
    const startY = 150

    // Function to draw a stat box
    const drawStatBox = (x: number, y: number, title: string, value: string, color: string) => {
      // Draw box background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(x, y, boxWidth, boxHeight)

      // Draw colored accent
      ctx.fillStyle = color
      ctx.fillRect(x, y, 10, boxHeight)

      // Draw title
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.textAlign = "left"
      ctx.font = "16px Poppins, sans-serif"
      ctx.fillText(title, x + 25, y + 30)

      // Draw value
      ctx.fillStyle = "white"
      ctx.font = "bold 36px Poppins, sans-serif"
      ctx.fillText(value, x + 25, y + 80)
    }

    // Draw stats in a 2x3 grid
    drawStatBox(margin, startY, "Total Messages", stats.totalMessages, "#FF6B6B")
    drawStatBox(canvas.width - margin - boxWidth, startY, "Total Reactions", stats.totalReactions, "#4ECDC4")

    drawStatBox(margin, startY + boxHeight + 20, "Average Reactions", stats.averageReactions, "#FFD166")
    drawStatBox(
      canvas.width - margin - boxWidth,
      startY + boxHeight + 20,
      "Response Rate",
      stats.responseRate,
      "#F72585",
    )

    drawStatBox(margin, startY + (boxHeight + 20) * 2, "Public Messages", stats.publicMessages, "#7209B7")
    drawStatBox(
      canvas.width - margin - boxWidth,
      startY + (boxHeight + 20) * 2,
      "Private Messages",
      stats.privateMessages,
      "#4361EE",
    )

    // Draw footer
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.textAlign = "center"
    ctx.font = "14px Poppins, sans-serif"
    ctx.fillText("ast-secret - Anonymous Messaging Platform", canvas.width / 2, canvas.height - 40)

    // Convert to blob URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        resolve(url)
      }
    }, "image/png")
  })
}
