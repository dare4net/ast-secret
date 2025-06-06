"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Lock, Share2, Copy, Heart, Sparkles, ArrowRight, Flame, Laugh } from "lucide-react"
import { mockUser, getCookie, getUserSession, type UserSession, mockMessages, type Message } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { PinLock } from "@/components/pin-lock"
import Link from "next/link"

export default function PublicSubmissionPage({ params }: { params: { username: string } }) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [targetUser, setTargetUser] = useState<UserSession | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [needsPin, setNeedsPin] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [publicMessages, setPublicMessages] = useState<Message[]>([])
  const { toast } = useToast()
  const [userNotFound, setUserNotFound] = useState(false)

  useEffect(() => {
    // Check if this is the user's own profile
    const currentUserId = getCookie("ast-secret-user-id")
    if (currentUserId) {
      const currentSession = getUserSession(currentUserId)
      if (currentSession && currentSession.user.username === params.username) {
        setIsOwnProfile(true)
        setTargetUser(currentSession)
        if (currentSession.user.pin) {
          setNeedsPin(true)
        } else {
          setIsUnlocked(true)
        }
        return
      }
    }

    // Check if username exists (in real app, this would be an API call)
    if (params.username === "yourusername" || params.username === "DemoUser123") {
      const mockSession = {
        user: { ...mockUser, username: params.username },
        messages: mockMessages,
      }
      setTargetUser(mockSession)

      // Filter public messages
      const publicMsgs = mockMessages.filter((msg) => msg.isPublic)
      setPublicMessages(publicMsgs)

      setIsUnlocked(true)
    } else {
      // User not found
      setUserNotFound(true)
    }
  }, [params.username])

  const handlePinUnlock = (pin: string) => {
    if (targetUser?.user.pin === pin) {
      setIsUnlocked(true)
      setNeedsPin(false)
    } else {
      toast({
        title: "Incorrect PIN",
        description: "Please try again.",
      })
    }
  }

  if (userNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">ast-secret</span>
            </div>
          </div>

          <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounde-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h3>
              <p className="text-gray-600 mb-6">
                The user @{params.username} doesn't exist or their account may have expired.
              </p>
              <div className="space-y-3">
                <Link href="/create">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    Create Your Own Link
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700">
                    Go Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (needsPin && !isUnlocked) {
    return <PinLock onUnlock={handlePinUnlock} title="Enter PIN to view messages" />
  }

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isOwnProfile) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add message to target user's session (in real app, this would be server-side)
    const newMessage = {
      content: message.trim(),
      timestamp: "just now",
      reactions: { heart: 0, fire: 0, laugh: 0 },
      isRead: false,
      isPublic: targetUser.user.isPublic,
    }

    setIsSubmitting(false)
    setSubmitted(true)
    setMessage("")

    toast({
      title: "Message sent! 🎉",
      description: "Your anonymous message has been delivered.",
    })

    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Share this link to receive more messages.",
    })
  }

  const handleReaction = (messageId: string, reaction: "heart" | "fire" | "laugh") => {
    setPublicMessages((prev) =>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ast-secret</span>
          </div>
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
            ✨ Anonymous Messages
          </Badge>
        </div>

        {/* User Profile Card */}
        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardHeader className="text-center pb-4">
            <div className="relative mx-auto mb-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.username} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl font-bold">
                  {mockUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Send a message to</h1>
            <p className="text-xl font-semibold gradient-text">@{params.username}</p>
            <p className="text-sm text-gray-600 mt-2">{mockUser.messageCount} messages received</p>
            <div className="flex justify-center mt-2">
              {targetUser.user.isPublic ? (
                <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0">
                  🌐 Public Profile
                </Badge>
              ) : (
                <Badge className="bg-gradient-to-r from-gray-500 to-gray-700 text-white border-0">
                  🔒 Private Profile
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Message Form */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow mb-6">
          <CardContent className="p-6">
            {isOwnProfile ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">This is your profile! 👋</h3>
                <p className="text-gray-600 mb-4">Share this link to receive anonymous messages.</p>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    View Your Messages
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : !submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Write your anonymous message... 💭"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] text-lg border-2 border-purple-200 focus:border-purple-400 resize-none"
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">{message.length}/500</div>
                </div>

                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-lg fun-shadow"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Send Anonymous Message
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent! 🎉</h3>
                <p className="text-gray-600">Your anonymous message has been delivered successfully.</p>
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Lock className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">🔒 100% Anonymous. We never store your data.</span>
            </div>
          </CardContent>
        </Card>

        {/* Public Messages */}
        {targetUser.user.isPublic && publicMessages.length > 0 && !isOwnProfile && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow mb-6">
            <CardHeader>
              <h3 className="text-xl font-bold text-gray-800 text-center">Public Messages</h3>
              <p className="text-sm text-gray-600 text-center">See what others are saying</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {publicMessages.slice(0, 5).map((msg) => (
                <div key={msg.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-gray-800 mb-3">{msg.content}</p>

                  {msg.reply && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border-l-4 border-purple-400 mb-3">
                      <p className="text-xs text-gray-500 mb-1">Reply:</p>
                      <p className="text-gray-800 text-sm">{msg.reply}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReaction(msg.id, "heart")}
                        className="h-7 px-2 hover:bg-pink-100 text-pink-600"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        {msg.reactions.heart}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReaction(msg.id, "fire")}
                        className="h-7 px-2 hover:bg-orange-100 text-orange-600"
                      >
                        <Flame className="w-3 h-3 mr-1" />
                        {msg.reactions.fire}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReaction(msg.id, "laugh")}
                        className="h-7 px-2 hover:bg-yellow-100 text-yellow-600"
                      >
                        <Laugh className="w-3 h-3 mr-1" />
                        {msg.reactions.laugh}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Share Section */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Want your own anonymous link?</p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Link
                </Button>
                <Link href="/create" className="flex-1">
                  <Button size="sm" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    <Share2 className="w-4 h-4 mr-1" />
                    Get Yours
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
