import { NextResponse } from "next/server"
import { articleService, subscriberService } from "@/lib/database"

export async function GET() {
  try {
    const [articleStats, subscriberStats] = await Promise.all([articleService.getStats(), subscriberService.getStats()])

    return NextResponse.json({
      totalArticles: articleStats.totalArticles,
      publishedArticles: articleStats.publishedArticles,
      totalViews: articleStats.totalViews,
      totalSubscribers: subscriberStats.total,
      activeSubscribers: subscriberStats.active,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
