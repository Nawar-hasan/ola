import { type NextRequest, NextResponse } from "next/server"
import { articleService } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await articleService.getById(params.id)
    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const article = await articleService.update(params.id, body)
    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await articleService.delete(params.id)
    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
