import { Suspense } from "react"
import { GuideViewer } from "@/components/guide-viewer"
import { Loader2 } from "lucide-react"

interface GuidePageProps {
  params: { id: string }
}

function GuideViewerWrapper({ guideId }: { guideId: string }) {
  return <GuideViewer guideId={guideId} />
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { id } = params

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
              <span className="ml-2 text-gray-600">Loading guide...</span>
            </div>
          </div>
        }
      >
        <GuideViewerWrapper guideId={id} />
      </Suspense>
    </div>
  )
}
