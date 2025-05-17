import { type NextRequest, NextResponse } from "next/server"
import { inMemoryUsers } from "@/lib/mock-data"

export const runtime = "nodejs" // Explicitly set Node.js runtime

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Find and remove the user from our in-memory array
    const userId = Number.parseInt(id, 10)
    const userIndex = inMemoryUsers.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove the user
    inMemoryUsers.splice(userIndex, 1)

    return NextResponse.json({
      success: true,
      message: `Mock user deletion successful: ID ${id} (preview environment)`,
      isPreview: true,
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
