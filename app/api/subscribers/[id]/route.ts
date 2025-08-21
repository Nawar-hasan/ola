import { type NextRequest, NextResponse } from "next/server"
import { subscriberService } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const subscriber = await subscriberService.updateStatus(params.id, status)
    return NextResponse.json(subscriber)
  } catch (error) {
    console.error("Error updating subscriber:", error)
    return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await subscriberService.delete(params.id)
    return NextResponse.json({ message: "Subscriber deleted successfully" })
  } catch (error) {
    console.error("Error deleting subscriber:", error)
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
  }
}
