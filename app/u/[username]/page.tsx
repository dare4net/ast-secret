"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Lock, Share2, Copy, Heart, Sparkles, ArrowRight, Flame, Laugh } from "lucide-react"
import { getCookie, type Message } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { PinLock } from "@/components/pin-lock"
import Link from "next/link"
import { getUser, getMessages, sendMessage, addReaction, getUserByUsername } from "@/lib/api"
import { logger } from "@/lib/logger"
import { use } from "react"

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function PublicSubmissionPage({ params }: PageProps) {
  // Unwrap the params Promise
  const { username } = use(params);
  
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [targetUser, setTargetUser] = useState<any>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [needsPin, setNeedsPin] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [publicMessages, setPublicMessages] = useState<Message[]>([])
  const [userNotFound, setUserNotFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadUser() {
      try {
        logger.info('Loading user profile', { username });
        
        // Get user data
        const user = await getUserByUsername(username);
        logger.debug('User data fetched', { user });
        setTargetUser(user);

        // Check if this is the user's own profile
        const currentUserId = getCookie("ast-secret-user-id");
        logger.debug('Checking profile ownership', { currentUserId, userId: user.id });
        
        if (currentUserId && user.id === currentUserId) {
          setIsOwnProfile(true);
          if (user.usePin) {
            setNeedsPin(true);
          } else {
            setIsUnlocked(true);
          }
        } else {
          setIsUnlocked(true);
        }

        // Get messages if public or if own profile and unlocked
        if (user.isPublic || (isOwnProfile && isUnlocked)) {
          logger.debug('Fetching messages', { isPublic: user.isPublic, isOwnProfile, isUnlocked });
          const messages = await getMessages(user.id);
          setPublicMessages(messages.filter(msg => msg.isPublic || isOwnProfile));
        }
      } catch (error: any) {
        logger.error('Failed to load user profile', { 
          username,
          error: error.message,
          response: error.response
        });
        
        setUserNotFound(true);
        
        // Extract error message from response if available
        let errorMessage = 'The user doesn\'t exist or their account may have expired.';
        try {
          if (error instanceof Error) {
            errorMessage = error.message;
          }
        } catch (e) {
          logger.error('Error parsing error message', { error: e });
        }
        
        setErrorMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [username, isOwnProfile, isUnlocked]);

  const handlePinUnlock = async (pin: string) => {
    if (targetUser?.pin === pin) {
      setIsUnlocked(true)
      setNeedsPin(false)
      
      // Load messages after unlocking
      try {
        const messages = await getMessages(targetUser.id)
        setPublicMessages(messages)
      } catch (error) {
        console.error('Failed to load messages:', error)
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive"
        })
      }
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
              <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h3>
              <p className="text-gray-600 mb-6">
                {errorMessage || `The user @${username} doesn't exist or their account may have expired.`}
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

  if (isLoading || !targetUser) {
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

    try {
      await sendMessage(targetUser.id, message.trim(), targetUser.isPublic)
      setSubmitted(true)
      setMessage("")

      toast({
        title: "Message sent! 🎉",
        description: "Your anonymous message has been delivered.",
      })

      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Failed to send message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Share this link to receive more messages.",
    })
  }

  const handleReaction = async (messageId: string, reaction: "heart" | "fire" | "laugh") => {
    try {
      const updatedMessage = await addReaction(messageId, targetUser.id, reaction)
      setPublicMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? updatedMessage : msg))
      )

      toast({
        title: "Reaction added! ❤️",
        description: "Your reaction has been saved.",
      })
    } catch (error) {
      console.error('Failed to add reaction:', error)
      toast({
        title: "Error",
        description: "Failed to add reaction. Please try again.",
        variant: "destructive"
      })
    }
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
                <AvatarImage src={targetUser.avatar || "/placeholder.svg"} alt={targetUser.username} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl font-bold">
                  {targetUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Send a message to</h1>
            <p className="text-xl font-semibold gradient-text">@{username}</p>
            <p className="text-sm text-gray-600 mt-2">{publicMessages.length} messages received</p>
            <div className="flex justify-center mt-2">
              {targetUser.isPublic ? (
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
        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardContent className="p-6">
            {!submitted ? (
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
          </CardContent>
        </Card>

        {/* Public Messages */}
        {targetUser.isPublic && publicMessages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Public Messages</h2>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {publicMessages.map((msg) => (
              <Card key={msg.id} className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
                <CardContent className="p-4">
                  <p className="text-gray-800 mb-3">{msg.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-pink-600"
                        onClick={() => handleReaction(msg.id, "heart")}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {msg.reactions.heart}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-orange-600"
                        onClick={() => handleReaction(msg.id, "fire")}
                      >
                        <Flame className="w-4 h-4 mr-1" />
                        {msg.reactions.fire}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-yellow-600"
                        onClick={() => handleReaction(msg.id, "laugh")}
                      >
                        <Laugh className="w-4 h-4 mr-1" />
                        {msg.reactions.laugh}
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">{msg.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
