import { NextResponse } from "next/server"
import { inMemoryFiles } from "@/lib/mock-data"

export const runtime = "nodejs" // Explicitly set Node.js runtime

export async function GET() {
  try {
    // Always use mock data in preview
    console.log("Using mock data for S3 file listing")
    return NextResponse.json({
      files: inMemoryFiles,
      isPreview: true,
    })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
