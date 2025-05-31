import { PublicGuidesList } from "@/components/public-guides-list"
import { PublicHeaderWrapper } from "@/components/public-header-wrapper"
import { Sparkles, Zap, TrendingUp, ThumbsUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeaderWrapper />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-fuchsia-600 to-violet-700 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">RandomGuides</h1>
          <p className="text-2xl md:text-3xl font-bold mb-4 text-white/90">Guides 4 Gen Z</p>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            The ultimate collection of guides that actually slap. No cap, just straight facts.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-300" />
              <span>Trending Topics</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-300" />
              <span>Life Hacks</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2 text-blue-300" />
              <span>Vibes Check</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Straight Facts</h3>
            <p className="text-gray-600">No cap, just real knowledge that's actually useful for your daily life.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-fuchsia-100 text-fuchsia-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Always Trending</h3>
            <p className="text-gray-600">Stay ahead with guides on what's actually relevant right now.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mb-4">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Vibe Check</h3>
            <p className="text-gray-600">Content that passes the vibe check and helps you level up.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
            Explore Our Guides
          </span>
        </h2>

        <PublicGuidesList />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Sparkles className="h-6 w-6 mr-2 text-fuchsia-400" />
            <span className="text-xl font-bold">Guides 4 Gen Z</span>
          </div>
          <p className="text-gray-400 mb-4">The ultimate guide collection for Gen Z</p>
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} Guides 4 Gen Z. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
