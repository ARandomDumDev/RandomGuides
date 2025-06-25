"use client"

import { useState, useEffect } from "react"
import { PublicHeaderWrapper } from "@/components/public-header-wrapper"
import { PublicGuidesList } from "@/components/public-guides-list"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("randomguides-user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData.username)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <PublicHeaderWrapper />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              {loading ? "Welcome to RandomGuides" : user ? `Welcome back, ${user}! 👋` : "Welcome to RandomGuides"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              {user ? "Your Community's Guides" : "Explore Our Guides"} - The ultimate collection of tutorials, tips,
              and tricks for Gen Z
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Button size="lg" className="bg-white text-fuchsia-600 hover:bg-white/90 text-lg px-8 py-4" asChild>
                    <Link href="/dashboard">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Your Dashboard
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-4"
                    asChild
                  >
                    <Link href="/editor">
                      Create New Guide
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="bg-white text-fuchsia-600 hover:bg-white/90 text-lg px-8 py-4" asChild>
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-4"
                    asChild
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Why Choose RandomGuides?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by Gen Z, for Gen Z. We understand what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Easy to Follow</h3>
              <p className="text-gray-600 leading-relaxed">
                Step-by-step guides that actually make sense. No confusing jargon, just clear instructions.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Created by the community, for the community. Share your knowledge and learn from others.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-fuchsia-50 to-pink-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Always Updated</h3>
              <p className="text-gray-600 leading-relaxed">
                Fresh content that stays relevant. We keep up with the latest trends and technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {user ? "Trending in Your Community" : "Popular Guides"}
            </h2>
            <p className="text-xl text-gray-600">Discover the most helpful guides from our community</p>
          </div>

          <PublicGuidesList />

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
              <Link href={user ? "/dashboard" : "/register"}>
                {user ? "View All Your Guides" : "Join to See More"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {user ? "Ready to Create Your Next Guide?" : "Ready to Get Started?"}
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {user
              ? "Share your knowledge with the community and help others learn something new."
              : "Join thousands of creators sharing their knowledge and helping others learn."}
          </p>
          <Button size="lg" className="bg-white text-fuchsia-600 hover:bg-white/90 text-lg px-8 py-4" asChild>
            <Link href={user ? "/editor" : "/register"}>
              {user ? "Create Guide" : "Start Creating"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
