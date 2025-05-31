"use client"

import { GuidesList } from "@/components/guides-list"

export function DashboardContent() {
  // This component is now much simpler since auth is handled by middleware and server components
  return <GuidesList />
}
