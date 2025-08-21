import { type NextRequest, NextResponse } from "next/server"
import { subscriberService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    const subscribers = await subscriberService.getAll({ status, limit, offset })
    return NextResponse.json(subscribers)
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = "website" } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const subscriber = await subscriberService.create(email, source)
    return NextResponse.json(subscriber, { status: 201 })
  } catch (error: any) {
    console.error("Error creating subscriber:", error)

    // Handle duplicate email error
    if (error.code === "23505") {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
