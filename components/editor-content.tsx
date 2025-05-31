"use client"

import { GuideEditor } from "@/components/guide-editor"

export function EditorContent() {
  // This component is now much simpler since auth is handled by middleware and server components
  return <GuideEditor />
}
