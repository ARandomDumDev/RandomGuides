"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Search, Calendar, SortAsc, SortDesc, Loader2, FlameIcon as Fire, Sparkles } from "lucide-react"
import Link from "next/link"
import { supabase, type Guide, type GuideElement } from "@/lib/supabase"

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

const PublicGuidesList = () => {
  const [guides, setGuides] = useState<Guide[]>([])
  const [guideElements, setGuideElements] = useState<Record<string, GuideElement[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [searchResults, setSearchResults] = useState<number>(0)

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      setLoading(true)

      // Fetch all published guides
      const { data: guidesData, error: guidesError } = await supabase
        .from("guides")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })

      if (guidesError) throw guidesError

      setGuides(guidesData || [])

      // Fetch elements for all guides
      if (guidesData && guidesData.length > 0) {
        const guideIds = guidesData.map((guide) => guide.id)
        const { data: elementsData, error: elementsError } = await supabase
          .from("guide_elements")
          .select("*")
          .in("guide_id", guideIds)

        if (elementsError) throw elementsError

        // Group elements by guide_id
        const elementsMap: Record<string, GuideElement[]> = {}
        elementsData?.forEach((element) => {
          if (!elementsMap[element.guide_id]) {
            elementsMap[element.guide_id] = []
          }
          elementsMap[element.guide_id].push(element)
        })

        setGuideElements(elementsMap)
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedGuides = useMemo(() => {
    let filtered = guides

    // Search functionality
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = guides.filter((guide) => {
        // Search in title
        if (guide.title.toLowerCase().includes(query)) return true

        // Search in description
        if (guide.description?.toLowerCase().includes(query)) return true

        // Search in text elements content
        const elements = guideElements[guide.id] || []
        const hasMatchingContent = elements.some(
          (element) => element.type === "text" && element.content.toLowerCase().includes(query),
        )

        return hasMatchingContent
      })
    }

    // Sorting functionality
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return { filtered, sorted }
  }, [guides, guideElements, searchQuery, sortBy])

  // Update search results count
  useEffect(() => {
    setSearchResults(filteredAndSortedGuides.filtered.length)
  }, [filteredAndSortedGuides.filtered.length])

  const clearSearch = () => {
    setSearchQuery("")
  }

  const getElementCount = (guideId: string) => {
    const elements = guideElements[guideId] || []
    const textElements = elements.filter((el) => el.type === "text").length
    const imageElements = elements.filter((el) => el.type === "image").length
    return { textElements, imageElements }
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-fuchsia-200 text-fuchsia-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
        <span className="ml-2 text-gray-600">Loading guides...</span>
      </div>
    )
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No guides available yet</h2>
        <p className="text-gray-600 mb-8">Be the first to create and share a guide!</p>
        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white" asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 border-gray-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48 border-gray-200 focus:ring-fuchsia-500">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Fire className="h-4 w-4 text-orange-500" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value="title-asc">
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-green-500" />
                    Title A-Z
                  </div>
                </SelectItem>
                <SelectItem value="title-desc">
                  <div className="flex items-center gap-2">
                    <SortDesc className="h-4 w-4 text-red-500" />
                    Title Z-A
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            {searchQuery ? (
              <span>
                Found <strong className="text-fuchsia-600">{searchResults}</strong> guide
                {searchResults !== 1 ? "s" : ""}
                {searchResults > 0 && (
                  <span>
                    {" "}
                    matching "<strong className="text-fuchsia-600">{searchQuery}</strong>"
                  </span>
                )}
              </span>
            ) : (
              <span>
                Showing <strong className="text-fuchsia-600">{guides.length}</strong> guide
                {guides.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {searchQuery && (
            <Button
              variant="link"
              onClick={clearSearch}
              className="p-0 h-auto text-sm text-fuchsia-600 hover:text-fuchsia-700"
            >
              Clear search
            </Button>
          )}
        </div>
      </div>

      {/* Guides Grid */}
      {filteredAndSortedGuides.sorted.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? `No guides match your search for "${searchQuery}"` : "No guides match your current filters"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={clearSearch}
              className="border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            {searchQuery ? (
              <>
                <Search className="h-5 w-5 mr-2 text-fuchsia-500" />
                Search Results
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2 text-fuchsia-500" />
                Fresh Guides
              </>
            )}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedGuides.sorted.map((guide) => {
              const { textElements, imageElements } = getElementCount(guide.id)
              const isNew = new Date().getTime() - new Date(guide.created_at).getTime() < 7 * 24 * 60 * 60 * 1000 // 7 days

              return (
                <Card
                  key={guide.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-gray-100 rounded-xl"
                >
                  {isNew && (
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold px-3 py-1 text-center">
                      NEW GUIDE
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 text-xl">{highlightText(guide.title, searchQuery)}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {guide.description ? (
                        highlightText(guide.description, searchQuery)
                      ) : (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Element count badges */}
                      <div className="flex gap-2 flex-wrap">
                        {textElements > 0 && (
                          <Badge variant="outline" className="text-xs border-violet-200 text-violet-700 bg-violet-50">
                            {textElements} text element{textElements !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        {imageElements > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-fuchsia-200 text-fuchsia-700 bg-fuchsia-50"
                          >
                            {imageElements} image{imageElements !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <div>Created: {new Date(guide.created_at).toLocaleDateString()}</div>
                          <div>By: {guide.created_by}</div>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90"
                          size="sm"
                          asChild
                        >
                          <Link href={`/guide/${guide.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Guide
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export { PublicGuidesList }
export default PublicGuidesList
