import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageCircle, Share2, Inbox, Sparkles, Users, Globe, Heart } from "lucide-react"
import Link from "next/link"
import { mockStats } from "@/lib/mock-data"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">ast-secret</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium">
            ✨ 100% Anonymous & Secure
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Discover What</span>
            <br />
            <span className="text-gray-800">Others Think</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
            Create your anonymous link, share it everywhere, and receive honest messages from friends, followers, and
            strangers.
          </p>

          <div className="flex justify-center mb-12">
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg fun-shadow"
              >
                Get Your Anonymous Link
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              <span className="text-lg font-semibold text-gray-700">{mockStats.totalMessages} messages sent</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-lg font-semibold text-gray-700">{mockStats.activeUsers} active users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-cyan-500" />
              <span className="text-lg font-semibold text-gray-700">{mockStats.countriesReached} countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to start receiving anonymous messages
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center p-8 border-0 bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Get Your Link</h3>
              <p className="text-gray-600 text-lg">
                Sign up in seconds to generate your unique anonymous messaging link
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Share It</h3>
              <p className="text-gray-600 text-lg">
                Post your link on social media, in your bio, or share with friends
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Inbox className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Read Messages</h3>
              <p className="text-gray-600 text-lg">View anonymous messages in your private, secure inbox</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users already receiving anonymous messages</p>
          <Link href="/create">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
              Create Your Link Now
              <Heart className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">ast-secret</span>
        </div>
        <p className="text-sm">© 2024 ast-secret. Made with ❤️ for anonymous conversations.</p>
      </footer>
    </div>
  )
}
