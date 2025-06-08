"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MessageCircle, Lock, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCookie } from "@/lib/utils"
import { getUser, sendMessage } from "@/lib/api"
import { logger } from "@/lib/logger"

export default function SendPage({ params }: { params: { username: string } }) {
  const [message, setMessage] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [recipient, setRecipient] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkUser() {
      try {
        // Check if this is the user's own link
        const userId = getCookie("ast-secret-user-id")
        if (userId) {
          const currentUser = await getUser(userId)
          if (currentUser.username === params.username) {
            logger.info('User accessed their own link, redirecting to dashboard')
            router.push('/dashboard')
            return
          }
        }

        // If not own link, get recipient info
        const recipientData = await getUser(params.username)
        setRecipient(recipientData)
        setIsLoading(false)
      } catch (error) {
        logger.error('Failed to check user', { error })
        router.push('/404')
      }
    }

    checkUser()
  }, [params.username, router])

  const handleSubmit = async () => {
    if (!message.trim()) return

    try {
      setIsLoading(true)
      await sendMessage(recipient.id, message.trim(), isPublic)

      toast({
        title: "Message sent! 🎉",
        description: "Your anonymous message has been delivered.",
      })

      setMessage("")
      setIsPublic(true)
    } catch (error) {
      logger.error('Failed to send message', { error })
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 p-4">
      <div className="container max-w-2xl mx-auto">
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Send Anonymous Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recipient Info */}
            <div className="text-center">
              <div className="inline-block rounded-full p-2 bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-purple-600">
                  {recipient.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="text-xl font-semibold">@{recipient.username}</h2>
              <p className="text-gray-600">Send them an anonymous message!</p>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Type your anonymous message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] text-base"
                maxLength={500}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{message.length}/500 characters</span>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {isPublic ? (
                  <Globe className="w-4 h-4 text-blue-600" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-600" />
                )}
                <Label htmlFor="public-toggle">
                  {isPublic ? "Public Message" : "Private Message"}
                </Label>
              </div>
              <Switch
                id="public-toggle"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!message.trim() || isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                "Send Message"
              )}
            </Button>

            {/* Privacy Info */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>
                {isPublic
                  ? "🌐 Public messages will be visible to everyone"
                  : "🔒 Private messages are only visible to the recipient"}
              </p>
              <p>✨ All messages are anonymous</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 