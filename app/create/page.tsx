"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MessageCircle, ArrowLeft, Sparkles, Clock, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generateUserId, generateUsername, setCookie } from "@/lib/utils"
import { saveUserSession, type User, type UserSession } from "@/lib/mock-data"
import { PinLock } from "@/components/pin-lock"

export default function CreateAccountPage() {
  const [username, setUsername] = useState("")
  const [usePin, setUsePin] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [isSettingPin, setIsSettingPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Generate a random username on load
    setUsername(generateUsername())
  }, [])

  const handleCreateAccount = async () => {
    if (!username.trim()) return

    setIsLoading(true)

    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userId = generateUserId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const user: User = {
      id: userId,
      username: username.trim(),
      avatar: `/placeholder.svg?height=80&width=80`,
      link: `${window.location.origin}/u/${username.trim()}`,
      messageCount: 0,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isPublic: isPublic,
    }

    const session: UserSession = {
      user,
      messages: [],
    }

    // Save session
    saveUserSession(session)
    setCookie("ast-secret-user-id", userId, 24)

    if (usePin) {
      setIsSettingPin(true)
    } else {
      router.push("/dashboard")
    }

    setIsLoading(false)
  }

  const handleSetPin = (pin: string) => {
    const userId = generateUserId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const user: User = {
      id: userId,
      username: username.trim(),
      avatar: `/placeholder.svg?height=80&width=80`,
      link: `${window.location.origin}/u/${username.trim()}`,
      messageCount: 0,
      pin: pin,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isPublic: isPublic,
    }

    const session: UserSession = {
      user,
      messages: [],
    }

    saveUserSession(session)
    setCookie("ast-secret-user-id", userId, 24)
    router.push("/dashboard")
  }

  if (isSettingPin) {
    return <PinLock onSetPin={handleSetPin} isSettingPin={true} title="Set Your PIN" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ast-secret</span>
          </div>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm fun-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Create Your Link</CardTitle>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Account expires in 24 hours</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Choose Your Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                  className="border-2 border-purple-200 focus:border-purple-400 pr-12"
                  maxLength={20}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUsername(generateUsername())}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">Your link will be: ast-secret.app/u/{username}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">PIN Protection</p>
                  <p className="text-xs text-gray-600">Secure your messages with a 4-digit PIN</p>
                </div>
              </div>
              <Switch checked={usePin} onCheckedChange={setUsePin} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Public Messages</p>
                  <p className="text-xs text-gray-600">Allow others to see your messages</p>
                </div>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            <Button
              onClick={handleCreateAccount}
              disabled={!username.trim() || isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  Create My Anonymous Link
                  <Sparkles className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>

            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>🔒 No email required • Completely anonymous</p>
              <p>⏰ Account automatically deletes after 24 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
