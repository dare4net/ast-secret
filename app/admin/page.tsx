"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  MessageCircle,
  Share2,
  Copy,
  Heart,
  Flame,
  Laugh,
  Trash2,
  ExternalLink,
  Filter,
  Settings,
  LogOut,
  Download,
  ImageIcon,
  Users,
  TrendingUp,
  Shield,
  Eye,
  RefreshCw,
  Reply,
  X,
  Check,
  Globe,
  Lock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generateMessageImage, downloadImage, generateAnalyticsImage } from "@/lib/utils"
import { PinLock } from "@/components/pin-lock"

// Extended mock data for demo
const demoUser = {
  id: "demo_admin_user",
  username: "DemoUser123",
  avatar: "/placeholder.svg?height=80&width=80",
  link: "https://ast-secret.vercel.app/u/DemoUser123",
  messageCount: 23,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  pin: "1234",
  isPublic: true,
}

const demoMessages = [
  {
    id: "demo_msg1",
    content: "What's your biggest dream that you've never told anyone about? ✨",
    timestamp: "5 minutes ago",
    reactions: { heart: 12, fire: 3, laugh: 1 },
    isRead: false,
    reply: "To build a sustainable eco-village and live completely off the grid!",
    isPublic: true,
  },
  {
    id: "demo_msg2",
    content: "You seem like such a genuine person! What's the best advice you've ever received?",
    timestamp: "1 hour ago",
    reactions: { heart: 8, fire: 2, laugh: 0 },
    isRead: false,
    isPublic: true,
  },
  {
    id: "demo_msg3",
    content: "If you could have any superpower for just one day, what would you choose and why? 🦸‍♀️",
    timestamp: "3 hours ago",
    reactions: { heart: 15, fire: 7, laugh: 4 },
    isRead: true,
    reply: "Teleportation! I'd visit as many countries as possible in 24 hours.",
    isPublic: true,
  },
  {
    id: "demo_msg4",
    content: "What's something you're really passionate about that most people don't know?",
    timestamp: "6 hours ago",
    reactions: { heart: 6, fire: 1, laugh: 0 },
    isRead: true,
    isPublic: false,
  },
  {
    id: "demo_msg5",
    content: "You have such good energy! What's your secret to staying positive? 😊",
    timestamp: "12 hours ago",
    reactions: { heart: 20, fire: 5, laugh: 2 },
    isRead: true,
    isPublic: true,
  },
  {
    id: "demo_msg6",
    content: "If you could travel anywhere in the world right now, where would you go?",
    timestamp: "1 day ago",
    reactions: { heart: 9, fire: 3, laugh: 1 },
    isRead: true,
    reply: "Japan during cherry blossom season! It's been my dream for years.",
    isPublic: true,
  },
  {
    id: "demo_msg7",
    content: "What's the most embarrassing thing that happened to you in school? 😅",
    timestamp: "1 day ago",
    reactions: { heart: 4, fire: 0, laugh: 18 },
    isRead: true,
    isPublic: false,
  },
  {
    id: "demo_msg8",
    content: "You seem really creative! What's a hobby you'd love to try but haven't yet?",
    timestamp: "2 days ago",
    reactions: { heart: 11, fire: 2, laugh: 0 },
    isRead: true,
    isPublic: true,
  },
  {
    id: "demo_msg9",
    content: "What song always makes you feel better when you're having a bad day? 🎵",
    timestamp: "2 days ago",
    reactions: { heart: 16, fire: 4, laugh: 1 },
    isRead: true,
    isPublic: true,
  },
  {
    id: "demo_msg10",
    content: "If you could have dinner with anyone, dead or alive, who would it be and what would you ask them?",
    timestamp: "3 days ago",
    reactions: { heart: 13, fire: 6, laugh: 2 },
    isRead: true,
    isPublic: true,
  },
]

const demoStats = {
  totalMessages: 23,
  totalReactions: 156,
  averageReactions: 6.8,
  mostPopularReaction: "heart",
  peakHour: "8 PM",
  responseRate: "94%",
}

export default function AdminDemoPage() {
  const [messages, setMessages] = useState(demoMessages)
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "public" | "private">("all")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState("messages")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isPublic, setIsPublic] = useState(demoUser.isPublic)
  const [showPinLock, setShowPinLock] = useState(false)
  const [pinProtected, setPinProtected] = useState(!!demoUser.pin)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [replyingTo])

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.isRead
    if (filter === "read") return msg.isRead
    if (filter === "public") return msg.isPublic
    if (filter === "private") return !msg.isPublic
    return true
  })

  const unreadCount = messages.filter((msg) => !msg.isRead).length
  const publicCount = messages.filter((msg) => msg.isPublic).length
  const privateCount = messages.filter((msg) => !msg.isPublic).length

  const handleReaction = (messageId: string, reaction: "heart" | "fire" | "laugh") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, reactions: { ...msg.reactions, [reaction]: msg.reactions[reaction] + 1 } }
          : msg,
      ),
    )
    toast({
      title: "Reaction added! ❤️",
      description: "Your reaction has been saved.",
    })
  }

  const handleDelete = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    toast({
      title: "Message deleted",
      description: "The message has been removed from your inbox.",
    })
  }

  const handleMarkAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(demoUser.link)
    toast({
      title: "Link copied! 📋",
      description: "Demo link copied to clipboard.",
    })
  }

  const handleDownloadMessage = async (message: any) => {
    setIsDownloading(true)
    try {
      const imageUrl = await generateMessageImage(message.content, demoUser.username, message.timestamp, message.reply)
      downloadImage(imageUrl, `demo-message-${message.id}.png`)
      toast({
        title: "Downloaded! 📸",
        description: "Demo message image saved to your device.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not generate message image.",
      })
    }
    setIsDownloading(false)
  }

  const handleDownloadSelected = async () => {
    if (selectedMessages.length === 0) return

    setIsDownloading(true)
    try {
      for (const messageId of selectedMessages) {
        const message = messages.find((m) => m.id === messageId)
        if (message) {
          const imageUrl = await generateMessageImage(
            message.content,
            demoUser.username,
            message.timestamp,
            message.reply,
          )
          downloadImage(imageUrl, `demo-message-${message.id}.png`)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
      setSelectedMessages([])
      toast({
        title: "Downloaded! 📸",
        description: `${selectedMessages.length} demo message images saved.`,
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not generate message images.",
      })
    }
    setIsDownloading(false)
  }

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId],
    )
  }

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(filteredMessages.map((m) => m.id))
    }
  }

  const handleRefreshDemo = () => {
    setMessages(demoMessages)
    setSelectedMessages([])
    setFilter("all")
    setIsPublic(demoUser.isPublic)
    setPinProtected(!!demoUser.pin)
    toast({
      title: "Demo refreshed! 🔄",
      description: "All demo data has been reset.",
    })
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
    setReplyText("")
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  const handleSubmitReply = (messageId: string) => {
    if (!replyText.trim()) return

    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, reply: replyText.trim() } : msg)))

    setReplyingTo(null)
    setReplyText("")

    toast({
      title: "Reply added! 💬",
      description: "Your reply has been saved.",
    })
  }

  const handleTogglePublic = () => {
    setIsPublic(!isPublic)
    toast({
      title: isPublic ? "Profile set to private" : "Profile set to public",
      description: isPublic ? "Your messages will only be visible to you" : "Your messages will be visible to visitors",
    })
  }

  const handleTogglePinProtection = () => {
    if (!pinProtected) {
      setShowPinLock(true)
    } else {
      setPinProtected(false)
      toast({
        title: "PIN protection disabled",
        description: "Your profile is now accessible without a PIN",
      })
    }
  }

  const handleSetPin = (pin: string) => {
    setPinProtected(true)
    setShowPinLock(false)
    toast({
      title: "PIN protection enabled",
      description: "Your profile is now protected with a PIN",
    })
  }

  const handleDownloadAnalytics = async () => {
    setIsDownloading(true)

    try {
      // Calculate analytics stats
      const totalMessages = messages.length
      const totalReactions = messages.reduce(
        (sum, msg) => sum + msg.reactions.heart + msg.reactions.fire + msg.reactions.laugh,
        0,
      )
      const averageReactions = totalMessages > 0 ? (totalReactions / totalMessages).toFixed(1) : "0"

      // Find most popular reaction
      let heartCount = 0,
        fireCount = 0,
        laughCount = 0
      messages.forEach((msg) => {
        heartCount += msg.reactions.heart
        fireCount += msg.reactions.fire
        laughCount += msg.reactions.laugh
      })

      const mostPopularReaction =
        heartCount >= fireCount && heartCount >= laughCount
          ? "❤️"
          : fireCount >= heartCount && fireCount >= laughCount
            ? "🔥"
            : "😂"

      // Calculate response rate
      const repliedCount = messages.filter((msg) => msg.reply).length
      const responseRate = totalMessages > 0 ? `${Math.round((repliedCount / totalMessages) * 100)}%` : "0%"

      const stats = {
        totalMessages: totalMessages.toString(),
        totalReactions: totalReactions.toString(),
        averageReactions,
        mostPopularReaction,
        peakHour: "8 PM", // Mock data
        responseRate,
      }

      const imageUrl = await generateAnalyticsImage(stats)
      downloadImage(imageUrl, `ast-secret-analytics.png`)

      toast({
        title: "Analytics downloaded! 📊",
        description: "Analytics image saved to your device.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not generate analytics image.",
      })
    }

    setIsDownloading(false)
  }

  if (showPinLock) {
    return <PinLock onSetPin={handleSetPin} isSettingPin={true} title="Set Your PIN" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ast-secret</span>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 text-xs">DEMO</Badge>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              onClick={handleRefreshDemo}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Refresh Demo</span>
              <span className="sm:hidden">Reset</span>
            </Button>

            <Button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-sm sm:text-base"
              size="sm"
            >
              <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Share Demo Link</span>
              <span className="sm:hidden">Share</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-purple-300">
                    <AvatarImage src={demoUser.avatar || "/placeholder.svg"} alt={demoUser.username} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                      {demoUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Demo Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Exit Demo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Notice */}
        <Card className="mb-6 border-0 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Demo Mode Active</h3>
                <p className="text-sm text-orange-700">
                  This is a demonstration with mock data. All interactions are simulated and no real data is stored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                <AvatarImage src={demoUser.avatar || "/placeholder.svg"} alt={demoUser.username} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold">
                  {demoUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">@{demoUser.username}</h1>
                <p className="text-gray-600">{messages.length} messages received</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white border-0">✨ Active</Badge>
                  {unreadCount > 0 && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
                      {unreadCount} new
                    </Badge>
                  )}
                  {pinProtected && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
                      <Shield className="w-3 h-3 mr-1" />
                      PIN Protected
                    </Badge>
                  )}
                  {isPublic ? (
                    <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0">🌐 Public</Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-gray-500 to-gray-700 text-white border-0">🔒 Private</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  onClick={handleDownloadAnalytics}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  size="sm"
                  disabled={isDownloading}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Export Stats
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Public Messages</p>
                  <p className="text-xs text-gray-600">Allow others to see your messages</p>
                </div>
              </div>
              <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">PIN Protection</p>
                  <p className="text-xs text-gray-600">Secure your messages with a 4-digit PIN</p>
                </div>
              </div>
              <Switch checked={pinProtected} onCheckedChange={handleTogglePinProtection} />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 border border-purple-200">
            <TabsTrigger
              value="messages"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-800">Demo Inbox</h2>
              <div className="flex flex-wrap items-center gap-4">
                {selectedMessages.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleDownloadSelected}
                      disabled={isDownloading}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download ({selectedMessages.length})
                    </Button>
                    <Button onClick={handleSelectAll} variant="outline" size="sm">
                      {selectedMessages.length === filteredMessages.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-auto">
                    <TabsList className="bg-white/80 border border-purple-200 flex flex-wrap">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        All ({messages.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="unread"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        Unread ({unreadCount})
                      </TabsTrigger>
                      <TabsTrigger
                        value="public"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        Public ({publicCount})
                      </TabsTrigger>
                      <TabsTrigger
                        value="private"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        Private ({privateCount})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
                    !message.isRead ? "ring-2 ring-pink-300 fun-shadow" : ""
                  } ${selectedMessages.includes(message.id) ? "ring-2 ring-blue-400" : ""}`}
                  onClick={() => !message.isRead && handleMarkAsRead(message.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Checkbox
                        checked={selectedMessages.includes(message.id)}
                        onCheckedChange={() => handleSelectMessage(message.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {!message.isRead && (
                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 text-xs">
                              NEW
                            </Badge>
                          )}
                          {message.isPublic ? (
                            <Badge className="bg-blue-100 text-blue-600 border-0 text-xs">Public</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">Private</Badge>
                          )}
                        </div>
                        <p className="text-lg text-gray-800 leading-relaxed font-medium">{message.content}</p>

                        {/* Reply section */}
                        {message.reply && (
                          <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-400">
                            <p className="text-sm text-gray-500 mb-1">Your reply:</p>
                            <p className="text-gray-800">{message.reply}</p>
                          </div>
                        )}

                        {/* Reply input */}
                        {replyingTo === message.id && (
                          <div className="mt-4 space-y-2">
                            <Textarea
                              ref={replyInputRef}
                              placeholder="Write your reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="min-h-[80px] border-2 border-purple-200 focus:border-purple-400 resize-none"
                              maxLength={500}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelReply}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSubmitReply(message.id)}
                                disabled={!replyText.trim()}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Submit Reply
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-gray-500 font-medium">Received {message.timestamp}</span>

                      <div className="flex flex-wrap items-center gap-1">
                        {/* Reactions */}
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReaction(message.id, "heart")}
                            className="h-8 px-2 hover:bg-pink-100 text-pink-600"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {message.reactions.heart}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReaction(message.id, "fire")}
                            className="h-8 px-2 hover:bg-orange-100 text-orange-600"
                          >
                            <Flame className="w-4 h-4 mr-1" />
                            {message.reactions.fire}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReaction(message.id, "laugh")}
                            className="h-8 px-2 hover:bg-yellow-100 text-yellow-600"
                          >
                            <Laugh className="w-4 h-4 mr-1" />
                            {message.reactions.laugh}
                          </Button>
                        </div>

                        <div className="flex items-center space-x-1">
                          {!message.reply && replyingTo !== message.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReply(message.id)
                              }}
                              className="h-8 px-2 hover:bg-purple-100 text-purple-600"
                            >
                              <Reply className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadMessage(message)
                            }}
                            disabled={isDownloading}
                            className="h-8 px-2 hover:bg-blue-100 text-blue-600"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2 hover:bg-purple-100 text-purple-600">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(message.id)}
                            className="h-8 px-2 hover:bg-red-100 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-800">Demo Analytics</h2>
              <Button
                onClick={handleDownloadAnalytics}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export as Image
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{messages.length}</h3>
                  <p className="text-gray-600">Total Messages</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {messages.reduce(
                      (sum, msg) => sum + msg.reactions.heart + msg.reactions.fire + msg.reactions.laugh,
                      0,
                    )}
                  </h3>
                  <p className="text-gray-600">Total Reactions</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {messages.length > 0
                      ? (
                          messages.reduce(
                            (sum, msg) => sum + msg.reactions.heart + msg.reactions.fire + msg.reactions.laugh,
                            0,
                          ) / messages.length
                        ).toFixed(1)
                      : "0"}
                  </h3>
                  <p className="text-gray-600">Avg Reactions</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Reply className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {messages.length > 0
                      ? `${Math.round((messages.filter((msg) => msg.reply).length / messages.length) * 100)}%`
                      : "0%"}
                  </h3>
                  <p className="text-gray-600">Response Rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span>Popular Reactions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span>Hearts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>Fire</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Laugh className="w-4 h-4 text-yellow-500" />
                        <span>Laugh</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                        </div>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span>Engagement Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-semibold text-green-600">
                        {messages.length > 0
                          ? `${Math.round((messages.filter((msg) => msg.reply).length / messages.length) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Public Messages</span>
                      <span className="font-semibold">{publicCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Private Messages</span>
                      <span className="font-semibold">{privateCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Most Active Day</span>
                      <span className="font-semibold">Saturday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Message Length</span>
                      <span className="font-semibold">67 characters</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Public vs Private Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-gray-700" />
                  <span>Message Privacy Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48">
                  <div className="relative w-48 h-48">
                    {/* Simple pie chart visualization */}
                    <div
                      className="absolute inset-0 bg-blue-500 rounded-full"
                      style={{ clipPath: `polygon(50% 50%, 0 0, 0 100%, 100% 100%, 100% 0)` }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gray-500 rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, 100% 0, 100% 100%, ${
                          100 - (publicCount / messages.length) * 100
                        }% 100%, ${100 - (publicCount / messages.length) * 100}% 0)`,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">{Math.round((publicCount / messages.length) * 100)}%</div>
                          <div className="text-xs text-gray-500">Public</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-8 space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                      <span>Public Messages: {publicCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
                      <span>Private Messages: {privateCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
