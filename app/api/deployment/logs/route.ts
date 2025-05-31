import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get deployment logs from Vercel API
    const vercelToken = process.env.VERCEL_TOKEN
    const projectId = process.env.VERCEL_PROJECT_ID

    if (!vercelToken || !projectId) {
      return NextResponse.json({
        logs: [
          "[INFO] Vercel integration not configured",
          "[INFO] Add VERCEL_TOKEN and VERCEL_PROJECT_ID to environment variables",
          "[INFO] Using mock deployment logs for now",
          `[DEPLOY] ${new Date().toISOString()} - Mock deployment started`,
          `[DEPLOY] ${new Date().toISOString()} - Build completed successfully`,
          `[DEPLOY] ${new Date().toISOString()} - Deployment live at guides4genz.vercel.app`,
        ],
      })
    }

    // Fetch real deployment data from Vercel
    const deploymentsResponse = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=5`, {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    })

    if (!deploymentsResponse.ok) {
      throw new Error("Failed to fetch deployments")
    }

    const deploymentsData = await deploymentsResponse.json()
    const logs: string[] = []

    for (const deployment of deploymentsData.deployments) {
      const date = new Date(deployment.createdAt).toISOString()
      logs.push(`[DEPLOY] ${date} - Deployment ${deployment.uid} started`)
      logs.push(`[DEPLOY] ${date} - State: ${deployment.state}`)
      logs.push(`[DEPLOY] ${date} - URL: ${deployment.url}`)

      if (deployment.state === "READY") {
        logs.push(`[DEPLOY] ${date} - Deployment completed successfully`)
      } else if (deployment.state === "ERROR") {
        logs.push(`[DEPLOY] ${date} - Deployment failed`)
      }
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching deployment logs:", error)
    return NextResponse.json({
      logs: [
        `[ERROR] ${new Date().toISOString()} - Failed to fetch deployment logs`,
        `[ERROR] ${new Date().toISOString()} - ${error}`,
        "[INFO] Using fallback mock logs",
        `[DEPLOY] ${new Date().toISOString()} - Fallback deployment active`,
      ],
    })
  }
}
