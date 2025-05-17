import { type NextRequest, NextResponse } from "next/server"
import { inMemoryUsers, generateMockId } from "@/lib/mock-data"

export const runtime = "nodejs" // Explicitly set Node.js runtime

export async function GET() {
  try {
    // Return the in-memory users
    console.log(`Returning ${inMemoryUsers.length} mock users`)

    return NextResponse.json({
      users: inMemoryUsers,
      isPreview: true,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const image = formData.get("image") as File | null

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    let imageUrl = null
    if (image) {
      // Generate a mock image URL
      imageUrl = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 100)}.jpg`
    }

    const newUser = {
      id: generateMockId(),
      name,
      email,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    }

    // Add to our in-memory mock users
    inMemoryUsers.unshift(newUser)

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "Mock user creation successful (preview environment)",
      isPreview: true,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
