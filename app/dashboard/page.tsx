"use client"

import { useState, useEffect, useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import { type Message, getUserSession, type UserSession, saveUserSession } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCookie, generateMessageImage, downloadImage, generateAnalyticsImage } from "@/lib/utils"

export default function Dashboard() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const replyInputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const userId = getCookie("ast-secret-user-id")
    if (userId) {
      const session = getUserSession(userId)
      if (session) {
        setUserSession(session)
        setMessages(session.messages)
      } else {
        // Session expired, redirect to create
        window.location.href = "/create"
      }
    } else {
      window.location.href = "/create"
    }
  }, [])

  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [replyingTo])

  if (!userSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.isRead
    if (filter === "read") return msg.isRead
    return true
  })

  const unreadCount = messages.filter((msg) => !msg.isRead).length

  const handleReaction = (messageId: string, reaction: "heart" | "fire" | "laugh") => {
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, reactions: { ...msg.reactions, [reaction]: msg.reactions[reaction] + 1 } } : msg,
    )
    setMessages(updatedMessages)

    if (userSession) {
      const updatedSession = { ...userSession, messages: updatedMessages }
      saveUserSession(updatedSession)
      setUserSession(updatedSession)
    }

    toast({
      title: "Reaction added! ❤️",
      description: "Your reaction has been saved.",
    })
  }

  const handleDelete = (messageId: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId)
    setMessages(updatedMessages)

    if (userSession) {
      const updatedSession = { ...userSession, messages: updatedMessages }
      saveUserSession(updatedSession)
      setUserSession(updatedSession)
    }

    toast({
      title: "Message deleted",
      description: "The message has been removed from your inbox.",
    })
  }

  const handleMarkAsRead = (messageId: string) => {
    const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
    setMessages(updatedMessages)

    if (userSession) {
      const updatedSession = { ...userSession, messages: updatedMessages }
      saveUserSession(updatedSession)
      setUserSession(updatedSession)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userSession.user.link)
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
        userSession.user.username,
        message.timestamp,
        message.reply,
      )
      downloadImage(imageUrl, `message-${message.id}.png`)
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
            userSession.user.username,
            message.timestamp,
            message.reply,
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
      setSelectedMessages(filteredMessages.map((m) => m.id))
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

  const handleSubmitReply = (messageId: string) => {
    if (!replyText.trim()) return

    const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, reply: replyText.trim() } : msg))

    setMessages(updatedMessages)

    if (userSession) {
      const updatedSession = { ...userSession, messages: updatedMessages }
      saveUserSession(updatedSession)
      setUserSession(updatedSession)
    }

    setReplyingTo(null)
    setReplyText("")

    toast({
      title: "Reply added! 💬",
      description: "Your reply has been saved.",
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
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-sm sm:text-base"
              size="sm"
            >
              <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Share My Link</span>
              <span className="sm:hidden">Share</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-purple-300">
                    <AvatarImage src={userSession.user.avatar || "/placeholder.svg"} alt={userSession.user.username} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                      {userSession.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                <AvatarImage src={userSession.user.avatar || "/placeholder.svg"} alt={userSession.user.username} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold">
                  {userSession.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">@{userSession.user.username}</h1>
                <p className="text-gray-600">{userSession.user.messageCount} messages received</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white border-0">✨ Active</Badge>
                  {unreadCount > 0 && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
                      {unreadCount} new
                    </Badge>
                  )}
                  {userSession.user.isPublic ? (
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

        {/* Messages Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Your Inbox</h2>
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
                  <TabsList className="bg-white/80 border border-purple-200">
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
                      value="read"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                    >
                      Read ({messages.length - unreadCount})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No messages yet</h3>
                <p className="text-gray-600 mb-4">Share your link to start receiving anonymous messages!</p>
                <Button onClick={handleCopyLink} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Your Link
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                        {!message.isRead && (
                          <Badge className="mb-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 text-xs">
                            NEW
                          </Badge>
                        )}
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
          )}
        </div>
      </div>
    </div>
  )
}
