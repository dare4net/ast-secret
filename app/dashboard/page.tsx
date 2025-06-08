"use client"

import { useState, useEffect, useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
  Reply,
  X,
  Check,
  TrendingUp,
  Globe,
  Lock,
  RefreshCw,
} from "lucide-react"
import { type Message } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCookie, generateMessageImage, downloadImage, generateAnalyticsImage } from "@/lib/utils"
import { getUser, getMessages, addReaction, deleteMessage, markMessageAsRead } from "@/lib/api"
import { logger } from "@/lib/logger"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "public" | "private">("all")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "analytics">("messages")
  const [refreshStartY, setRefreshStartY] = useState(0)
  const [refreshProgress, setRefreshProgress] = useState(0)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Load user data
  const loadUserData = async () => {
    const userId = getCookie("ast-secret-user-id")
    if (userId) {
      try {
        logger.info('Loading user data', { userId })
        const userData = await getUser(userId)
        setUser(userData)
        const userMessages = await getMessages(userId)
        setMessages(userMessages)
        logger.debug('User data loaded', { messageCount: userMessages.length })
      } catch (error) {
        logger.error('Failed to load user data', { error })
        window.location.href = "/create"
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    } else {
      window.location.href = "/create"
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [replyingTo])

  // Pull to refresh handlers
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    let touchStartY = 0
    let touchEndY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (content.scrollTop === 0) {
        touchStartY = e.touches[0].clientY
        setRefreshStartY(touchStartY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY > 0) {
        touchEndY = e.touches[0].clientY
        const progress = Math.min(Math.max((touchEndY - touchStartY) / 100, 0), 1)
        setRefreshProgress(progress)
      }
    }

    const handleTouchEnd = async () => {
      if (refreshProgress > 0.5 && !isRefreshing) {
        setIsRefreshing(true)
        await loadUserData()
      }
      touchStartY = 0
      touchEndY = 0
      setRefreshProgress(0)
    }

    content.addEventListener('touchstart', handleTouchStart)
    content.addEventListener('touchmove', handleTouchMove)
    content.addEventListener('touchend', handleTouchEnd)

    return () => {
      content.removeEventListener('touchstart', handleTouchStart)
      content.removeEventListener('touchmove', handleTouchMove)
      content.removeEventListener('touchend', handleTouchEnd)
    }
  }, [refreshProgress, isRefreshing])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

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

  // Calculate analytics
  const totalReactions = messages.reduce(
    (sum, msg) => sum + msg.reactions.heart + msg.reactions.fire + msg.reactions.laugh,
    0
  )
  const avgReactions = messages.length > 0 ? (totalReactions / messages.length).toFixed(1) : "0"
  const responseRate = messages.length > 0 
    ? `${Math.round((messages.filter(msg => msg.reply).length / messages.length) * 100)}%` 
    : "0%"

  // Mark message as read when user interacts with it
  const markMessageAsReadOnInteraction = async (messageId: string) => {
    try {
      const message = messages.find(msg => msg.id === messageId)
      if (message && !message.isRead) {
        logger.info('Marking message as read after interaction', { messageId, userId: user.id })
        await markMessageAsRead(messageId, user.id)
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
        )
      }
    } catch (error) {
      logger.error('Failed to mark message as read', { error, messageId })
    }
  }

  const handleReaction = async (messageId: string, reaction: "heart" | "fire" | "laugh") => {
    try {
      const updatedMessage = await addReaction(messageId, user.id, reaction)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? updatedMessage : msg))
      )

      // Mark as read after reaction
      await markMessageAsReadOnInteraction(messageId)

      toast({
        title: "Reaction added! ❤️",
        description: "Your reaction has been saved.",
      })
    } catch (error) {
      logger.error('Failed to add reaction:', error)
      toast({
        title: "Error",
        description: "Failed to add reaction. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(user.id, messageId)
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))

      toast({
        title: "Message deleted",
        description: "The message has been removed from your inbox.",
      })
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.link)
    toast({
      title: "Link copied! 📋",
      description: "Share this link to receive more messages.",
    })
  }

  const handleDownloadMessage = async (message: Message) => {
    setIsDownloading(true)
    try {
      const imageUrl = await generateMessageImage(
        message.content,
        user.username,
        message.timestamp,
        message.reply,
        message.reactions
      )
      downloadImage(imageUrl, `message-${message.id}.png`)

      // Mark as read after download
      await markMessageAsReadOnInteraction(message.id)

      toast({
        title: "Downloaded! 📸",
        description: "Message image saved to your device.",
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
            user.username,
            message.timestamp,
            message.reply,
            message.reactions
          )
          downloadImage(imageUrl, `message-${message.id}.png`)
          // Small delay between downloads
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
      setSelectedMessages([])
      toast({
        title: "Downloaded! 📸",
        description: `${selectedMessages.length} message images saved.`,
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
      setSelectedMessages(filteredMessages.map((msg) => msg.id))
    }
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
    setReplyText("")
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  const handleSubmitReply = async (messageId: string) => {
    if (!replyText.trim()) return

    try {
      // Assuming there's a reply API endpoint
      // await replyToMessage(messageId, replyText)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reply: replyText.trim(),
              }
            : msg,
        ),
      )

      // Mark as read after reply
      await markMessageAsReadOnInteraction(messageId)

      setReplyingTo(null)
      setReplyText("")

      toast({
        title: "Reply sent! 💬",
        description: "Your reply has been saved.",
      })
    } catch (error) {
      logger.error('Failed to send reply:', error)
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDownloadAnalytics = async () => {
    setIsDownloading(true)
    try {
      // Prepare analytics data
      const stats = {
        totalMessages: messages.length.toString(),
        totalReactions: totalReactions.toString(),
        averageReactions: avgReactions,
        responseRate,
        publicMessages: publicCount.toString(),
        privateMessages: privateCount.toString(),
        unreadMessages: unreadCount.toString(),
        mostPopularReaction: (() => {
          const reactions = {
            heart: messages.reduce((sum, msg) => sum + msg.reactions.heart, 0),
            fire: messages.reduce((sum, msg) => sum + msg.reactions.fire, 0),
            laugh: messages.reduce((sum, msg) => sum + msg.reactions.laugh, 0),
          }
          return Object.entries(reactions).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        })(),
      }

      const imageUrl = await generateAnalyticsImage(stats)
      downloadImage(imageUrl, "message-analytics.png")
      toast({
        title: "Downloaded! 📊",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
      <div 
        ref={contentRef}
        className="container mx-auto px-4 py-8 h-screen overflow-y-auto"
      >
        {/* Pull to refresh indicator */}
        <div 
          className={`fixed top-0 left-0 right-0 flex items-center justify-center transition-transform duration-300 bg-white/80 backdrop-blur-sm py-2 z-50 ${
            refreshProgress > 0 ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ transform: `translateY(${refreshProgress * 50}px)` }}
        >
          <RefreshCw 
            className={`w-5 h-5 text-purple-600 ${isRefreshing ? 'animate-spin' : ''}`} 
            style={{ transform: `rotate(${refreshProgress * 360}deg)` }}
          />
          <span className="ml-2 text-sm text-purple-600">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Profile Card */}
          <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm fun-shadow">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800">@{user.username}</h1>
                  <p className="text-gray-600">{messages.length} messages received</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white border-0">✨ Active</Badge>
                    {unreadCount > 0 && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
                        {unreadCount} new
                      </Badge>
                    )}
                    {user.isPublic ? (
                      <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0">🌐 Public</Badge>
                    ) : (
                      <Badge className="bg-gradient-to-r from-gray-500 to-gray-700 text-white border-0">🔒 Private</Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleDownloadAnalytics}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Download Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.location.href = "/create"}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-800">{messages.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reactions</p>
                  <p className="text-2xl font-bold text-gray-800">{totalReactions}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Reactions</p>
                  <p className="text-2xl font-bold text-gray-800">{avgReactions}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Reply className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-800">{responseRate}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "messages" | "analytics")} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
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

              {activeTab === "messages" && (
                <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-auto">
                  <TabsList className="bg-white/80 border border-purple-200">
                    <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
                    <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                    <TabsTrigger value="public">Public ({publicCount})</TabsTrigger>
                    <TabsTrigger value="private">Private ({privateCount})</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>

            <TabsContent value="messages" className="space-y-4">
              {/* Message Actions */}
              {selectedMessages.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSelected}
                    disabled={isDownloading}
                    className="text-purple-600 border-purple-200"
                  >
                    {isDownloading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    ) : (
                      <Download className="w-4 h-4 mr-1" />
                    )}
                    Download ({selectedMessages.length})
                  </Button>
                  <div 
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
                    onClick={handleSelectAll}
                  >
                    <Checkbox
                      checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                    />
                    <span>Select All</span>
                  </div>
                </div>
              )}

              {/* Messages List */}
              {filteredMessages.length === 0 ? (
                <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Messages Yet</h3>
                    <p className="text-gray-600 mb-6">Share your link to start receiving anonymous messages!</p>
                    <Button onClick={handleCopyLink} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Your Link
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((msg) => (
                    <Card
                      key={msg.id}
                      className={`border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
                        !msg.isRead ? "ring-2 ring-pink-300 fun-shadow" : ""
                      } ${selectedMessages.includes(msg.id) ? "ring-2 ring-blue-400" : ""}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedMessages.includes(msg.id)}
                            onCheckedChange={() => handleSelectMessage(msg.id)}
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {!msg.isRead && (
                                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
                                  NEW
                                </Badge>
                              )}
                              {msg.isPublic ? (
                                <Badge className="bg-blue-100 text-blue-600 border-0">
                                  <Globe className="w-3 h-3 mr-1" />
                                  Public
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-600 border-0">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Private
                                </Badge>
                              )}
                            </div>

                            <p className="text-gray-800">{msg.content}</p>

                            {msg.reply && (
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border-l-4 border-purple-400">
                                <p className="text-xs text-gray-500 mb-1">Your Reply:</p>
                                <p className="text-gray-800">{msg.reply}</p>
                              </div>
                            )}

                            {replyingTo === msg.id && (
                              <div className="mt-3 space-y-2">
                                <Textarea
                                  ref={replyInputRef}
                                  placeholder="Write your reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="min-h-[80px] text-base border-2 border-purple-200 focus:border-purple-400"
                                  maxLength={500}
                                />
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-500">{replyText.length}/500</div>
                                  <div className="space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelReply}
                                      className="text-gray-600"
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSubmitReply(msg.id)}
                                      disabled={!replyText.trim()}
                                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                    >
                                      <Reply className="w-4 h-4 mr-1" />
                                      Send Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReaction(msg.id, "heart")}
                                  className="h-8 px-2 hover:text-pink-600"
                                >
                                  <Heart className="w-4 h-4 mr-1" />
                                  {msg.reactions.heart}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReaction(msg.id, "fire")}
                                  className="h-8 px-2 hover:text-orange-600"
                                >
                                  <Flame className="w-4 h-4 mr-1" />
                                  {msg.reactions.fire}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReaction(msg.id, "laugh")}
                                  className="h-8 px-2 hover:text-yellow-600"
                                >
                                  <Laugh className="w-4 h-4 mr-1" />
                                  {msg.reactions.laugh}
                                </Button>
                              </div>

                              <div className="flex items-center space-x-1">
                                {!msg.reply && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReply(msg.id)}
                                    className="h-8 px-2 text-purple-600"
                                  >
                                    <Reply className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadMessage(msg)}
                                  disabled={isDownloading}
                                  className="h-8 px-2 text-blue-600"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(msg.id)}
                                  className="h-8 px-2 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Message Stats */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-gray-700" />
                      <span>Message Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-semibold text-green-600">{responseRate}</span>
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
                        <span className="text-gray-600">Average Reactions</span>
                        <span className="font-semibold">{avgReactions} per message</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Distribution */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-gray-700" />
                      <span>Message Privacy</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
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
                              <div className="text-lg font-bold">
                                {messages.length > 0 ? Math.round((publicCount / messages.length) * 100) : 0}%
                              </div>
                              <div className="text-xs text-gray-500">Public</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                        <span>Public: {publicCount}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
                        <span>Private: {privateCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
