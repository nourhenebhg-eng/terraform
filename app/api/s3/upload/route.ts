import { type NextRequest, NextResponse } from "next/server"
import { inMemoryFiles } from "@/lib/mock-data"
import crypto from "crypto"

export const runtime = "nodejs" // Explicitly set Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Generate a unique file name
    const randomId = crypto.randomBytes(16).toString("hex")
    const fileName = `${randomId}-${file.name}`

    // Add to mock files
    const newFile = {
      key: fileName,
      lastModified: new Date(),
      size: file.size,
      url: `https://example.com/${fileName}`,
    }

    inMemoryFiles.unshift(newFile)

    return NextResponse.json({
      success: true,
      fileName,
      url: `https://example.com/${fileName}`,
      message: "Mock file upload successful (preview environment)",
      isPreview: true,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
