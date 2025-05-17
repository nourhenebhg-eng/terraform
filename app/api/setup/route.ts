import { NextResponse } from "next/server"
import { resetMockData } from "@/lib/mock-data"

export const runtime = "nodejs" // Explicitly set Node.js runtime

export async function GET() {
  try {
    // Reset mock data to initial state
    resetMockData()

    return NextResponse.json({
      success: true,
      message: "Mock database setup completed successfully (preview environment)",
      isPreview: true,
    })
  } catch (error) {
    console.error("Error in setup route:", error)
    return NextResponse.json({ error: "Failed to set up database" }, { status: 500 })
  }
}
