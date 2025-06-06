"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PinLockProps {
  onUnlock: (pin: string) => void
  onSetPin?: (pin: string) => void
  isSettingPin?: boolean
  title?: string
}

export function PinLock({ onUnlock, onSetPin, isSettingPin = false, title = "Enter PIN" }: PinLockProps) {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isSettingPin) {
      if (pin.length !== 4) {
        setError("PIN must be 4 digits")
        return
      }
      if (pin !== confirmPin) {
        setError("PINs don't match")
        return
      }
      onSetPin?.(pin)
    } else {
      if (pin.length !== 4) {
        setError("PIN must be 4 digits")
        return
      }

      setAttempts((prev) => prev + 1)

      // The actual PIN verification happens in the parent component
      // We just pass the PIN up and let the parent handle it
      onUnlock(pin)

      // If we reach here, it means the parent didn't navigate away,
      // so the PIN was likely incorrect
      if (attempts >= 2) {
        setError("Too many incorrect attempts. Please try again later.")
      } else {
        setError("Incorrect PIN. Please try again.")
      }
    }
  }

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4)
    setPin(numericValue)
    setError("")
  }

  const handleConfirmPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4)
    setConfirmPin(numericValue)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm fun-shadow">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
          {isSettingPin && <p className="text-gray-600 text-sm">Set a 4-digit PIN to protect your messages</p>}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="text-center text-2xl tracking-widest border-2 border-purple-200 focus:border-purple-400"
                maxLength={4}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            {isSettingPin && (
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => handleConfirmPinChange(e.target.value)}
                  className="text-center text-2xl tracking-widest border-2 border-purple-200 focus:border-purple-400"
                  maxLength={4}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={pin.length !== 4 || (isSettingPin && confirmPin.length !== 4) || attempts > 3}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3"
            >
              {isSettingPin ? "Set PIN" : "Unlock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
