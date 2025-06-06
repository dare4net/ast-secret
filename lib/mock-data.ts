export interface Message {
  id: string
  content: string
  timestamp: string
  reactions: {
    heart: number
    fire: number
    laugh: number
  }
  isRead: boolean
  reply?: string
  isPublic?: boolean
}

export interface User {
  id: string
  username: string
  avatar: string
  link: string
  messageCount: number
  pin?: string
  createdAt: string
  expiresAt: string
  isPublic: boolean
}

export interface UserSession {
  user: User
  messages: Message[]
}

// Storage utilities for temporary sessions
export function saveUserSession(session: UserSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`ast-secret-${session.user.id}`, JSON.stringify(session))
  }
}

export function getUserSession(userId: string): UserSession | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(`ast-secret-${userId}`)
    if (stored) {
      const session = JSON.parse(stored)
      // Check if session has expired
      if (new Date(session.user.expiresAt) > new Date()) {
        return session
      } else {
        // Clean up expired session
        localStorage.removeItem(`ast-secret-${userId}`)
      }
    }
  }
  return null
}

export function addMessageToSession(userId: string, message: Omit<Message, "id">) {
  const session = getUserSession(userId)
  if (session) {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    }
    session.messages.unshift(newMessage)
    session.user.messageCount = session.messages.length
    saveUserSession(session)
    return newMessage
  }
  return null
}

export const mockUser: User = {
  id: "demo_user",
  username: "yourusername",
  avatar: "/placeholder.svg?height=80&width=80",
  link: "https://ast-secret.vercel.app/u/yourusername",
  messageCount: 47,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  isPublic: true,
}

export const mockMessages: Message[] = [
  {
    id: "msg1",
    content: "What's your biggest secret talent that nobody knows about? 🤫",
    timestamp: "2 hours ago",
    reactions: { heart: 3, fire: 1, laugh: 0 },
    isRead: false,
    reply: "I can actually solve a Rubik's cube in under 2 minutes! 🧩",
    isPublic: true,
  },
  {
    id: "msg2",
    content: "You seem really cool! What's your favorite way to spend a weekend?",
    timestamp: "5 hours ago",
    reactions: { heart: 2, fire: 0, laugh: 1 },
    isRead: true,
    isPublic: true,
  },
  {
    id: "msg3",
    content: "If you could have dinner with anyone, dead or alive, who would it be and why?",
    timestamp: "1 day ago",
    reactions: { heart: 5, fire: 2, laugh: 0 },
    isRead: true,
    reply: "Definitely Nikola Tesla! I have so many questions about his inventions and ideas.",
    isPublic: true,
  },
  {
    id: "msg4",
    content: "What's the most embarrassing thing that happened to you in school? 😅",
    timestamp: "2 days ago",
    reactions: { heart: 1, fire: 0, laugh: 4 },
    isRead: true,
    isPublic: false,
  },
  {
    id: "msg5",
    content: "You have such good taste in music! What song is stuck in your head right now?",
    timestamp: "3 days ago",
    reactions: { heart: 2, fire: 1, laugh: 0 },
    isRead: true,
    isPublic: true,
  },
]

export const mockStats = {
  totalMessages: "12.5k+",
  activeUsers: "8.2k+",
  countriesReached: "50+",
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
