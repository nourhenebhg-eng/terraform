import { type NextRequest, NextResponse } from "next/server"
import { inMemoryFiles } from "@/lib/mock-data"

export const runtime = "nodejs" // Explicitly set Node.js runtime

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ error: "File key is required" }, { status: 400 })
    }

    // Find and remove the file from our in-memory array
    const fileIndex = inMemoryFiles.findIndex((file) => file.key === key)

    if (fileIndex === -1) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Remove the file
    inMemoryFiles.splice(fileIndex, 1)

    return NextResponse.json({
      success: true,
      message: `Mock file deletion successful: ${key} (preview environment)`,
      isPreview: true,
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
