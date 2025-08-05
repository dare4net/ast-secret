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

    // Set canvas size - same dimensions regardless of reply
    canvas.width = 800
    canvas.height = 600

    // Create gradient background at the top
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 100)
    gradient.addColorStop(0, "#ec4899") // pink-500
    gradient.addColorStop(1, "#a855f7") // purple-500
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, 100)
    
    // Add URL strip below with the same gradient
    const urlGradient = ctx.createLinearGradient(0, 100, canvas.width, 140)
    urlGradient.addColorStop(0, "#ec4899") // pink-500
    urlGradient.addColorStop(1, "#a855f7") // purple-500
    ctx.fillStyle = urlGradient
    ctx.fillRect(0, 100, canvas.width, 40)
    
    // Add white URL text
    ctx.fillStyle = "#ffffff"
    ctx.font = "500 16px Poppins, system-ui"
    ctx.textAlign = "center"
    ctx.fillText(`secrets.after-school.tech/u/${username}`, canvas.width / 2, 125)
    
    // Fill the rest with white
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 140, canvas.width, canvas.height - 140)

    const cardMargin = 50
    const cardWidth = canvas.width - (cardMargin * 2)
    const cardHeight = canvas.height - (cardMargin * 2)

    // Modern card styling
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'
    ctx.shadowBlur = 30
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 8
    
    // Draw a subtle border
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
    ctx.lineWidth = 1
    ctx.roundRect(cardMargin, cardMargin, cardWidth, cardHeight, 16)
    ctx.stroke()
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    
    // Draw brand with gradient
    const brandGradient = ctx.createLinearGradient(
      canvas.width/2 - 60, 0, 
      canvas.width/2 + 60, 0
    )
    brandGradient.addColorStop(0, "#ec4899") // pink-500
    brandGradient.addColorStop(1, "#a855f7") // purple-500
    ctx.fillStyle = brandGradient
    ctx.textAlign = "center"
    ctx.font = "bold 28px Poppins, system-ui"
    ctx.fillText("ast-secret", canvas.width / 2, cardMargin + 45)

    // Draw username with modern styling
    ctx.font = "500 18px Poppins, system-ui"
    ctx.fillStyle = "#6b7280" // gray-500
    ctx.fillText(`@${username}`, canvas.width / 2, cardMargin + 80)

    // Draw message with text wrapping
    ctx.font = "bold 20px Poppins, system-ui"
    ctx.fillStyle = "#1f2937" // gray-800
    const maxWidth = cardWidth - 80 // Side margins for message
    const lineHeight = 30
    const words = message.split(" ")
    let lines = []
    let tempLine = ""

    // Calculate lines
    for (let n = 0; n < words.length; n++) {
      const testLine = tempLine + words[n] + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && n > 0) {
        lines.push(tempLine)
        tempLine = words[n] + " "
      } else {
        tempLine = testLine
      }
    }
    lines.push(tempLine)

    // Start drawing from fixed position
    let y = cardMargin + 180 // Fixed top margin for the message

    // Draw the pre-calculated lines
    for (const line of lines) {
      ctx.fillText(line, canvas.width / 2, y)
      y += lineHeight
    }

    // Draw reactions if they exist with custom SVG-style icons
    if (reactions) {
      const reactionY = y + 60 // Increased spacing
      ctx.font = "500 16px Poppins, system-ui"
      
      const spacing = 80
      
      // Draw reactions with emojis
      ctx.textAlign = "center"
      
      // Heart reaction
      if (reactions.heart > 0) {
        const x = canvas.width / 2 - spacing;
        ctx.font = "24px sans-serif" // Larger font for emoji
        ctx.fillText("❤️", x, reactionY - 5);
        ctx.font = "500 16px Poppins, system-ui"
        ctx.fillStyle = "#ec4899"
        ctx.fillText(`${reactions.heart}`, x, reactionY + 20);
      }
      
      // Fire reaction
      if (reactions.fire > 0) {
        const x = canvas.width / 2;
        ctx.font = "24px sans-serif" // Larger font for emoji
        ctx.fillText("🔥", x, reactionY - 5);
        ctx.font = "500 16px Poppins, system-ui"
        ctx.fillStyle = "#f97316"
        ctx.fillText(`${reactions.fire}`, x, reactionY + 20);
      }
      
      // Laugh reaction
      if (reactions.laugh > 0) {
        const x = canvas.width / 2 + spacing;
        ctx.font = "24px sans-serif" // Larger font for emoji
        ctx.fillText("😂", x, reactionY - 5);
        ctx.font = "500 16px Poppins, system-ui"
        ctx.fillStyle = "#eab308"
        ctx.fillText(`${reactions.laugh}`, x, reactionY + 20);
      }
      
      y = reactionY + 20
    }

    // Draw reply if exists
    if (reply) {
      // Create a subtle gradient background for reply section
      const replyGradient = ctx.createLinearGradient(
        cardMargin + 40, y + 30,
        canvas.width - cardMargin - 40, y + 30
      )
      replyGradient.addColorStop(0, "rgba(244, 114, 182, 0.2)") // pink-400 with very low opacity
      replyGradient.addColorStop(1, "rgba(168, 85, 247, 0.2)") // purple-500 with very low opacity
      
      // Draw reply background
      ctx.fillStyle = replyGradient
      ctx.beginPath()
      ctx.roundRect(cardMargin + 40, y + 30, canvas.width - (cardMargin * 2) - 80, 100, 12)
      ctx.fill()

      // Draw reply label with modern styling
      ctx.font = "500 16px Poppins, system-ui"
      ctx.fillStyle = "#a855f7" // purple-500
      ctx.fillText("Reply", canvas.width / 2, y + 60)

      // Draw reply text with modern font
      ctx.font = "400 18px Poppins, system-ui"
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

    // Format and draw timestamp at the bottom
    ctx.font = "400 14px Poppins, system-ui"
    ctx.fillStyle = "#9ca3af" // gray-400
    
    // Format the timestamp for better readability
    const date = new Date(timestamp)
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    const formattedTimestamp = `ast-secret • ${formattedDate} at ${formattedTime}`
    ctx.fillText(formattedTimestamp, canvas.width / 2, canvas.height - cardMargin - 20)

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
