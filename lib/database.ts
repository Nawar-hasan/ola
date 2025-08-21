import { supabase } from "./supabase"
import type { Article, Subscriber, Category } from "./supabase"

// ---------------------- Article Operations ----------------------
export const articleService = {
  // Get all articles with optional filters
  async getAll(filters?: {
    status?: string
    category?: string
    limit?: number
    offset?: number
    search?: string
  }) {
    let query = supabase.from("articles").select("*").order("created_at", { ascending: false })

    if (filters?.status) query = query.eq("status", filters.status)
    if (filters?.category) query = query.eq("category", filters.category)
    if (filters?.search)
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    if (filters?.limit) query = query.limit(filters.limit)
    if (filters?.offset)
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)

    const { data, error } = await query
    if (error) throw error
    return data as Article[]
  },

  // Get article by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).single()
    if (error) throw error
    return data as Article
  },

  // Get article by ID
  async getById(id: string) {
    const { data, error } = await supabase.from("articles").select("*").eq("id", id).single()
    if (error) throw error
    return data as Article
  },

  // Create new article
  async create(article: Omit<Article, "id" | "created_at" | "updated_at" | "views">) {
    const { data, error } = await supabase.from("articles").insert([article]).select().single()
    if (error) throw error
    return data as Article
  },

  // Update article
  async update(id: string, updates: Partial<Article>) {
    const { data, error } = await supabase.from("articles").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Article
  },

  // Delete article
  async delete(id: string) {
    const { error } = await supabase.from("articles").delete().eq("id", id)
    if (error) throw error
  },

  // Increment view count
  async incrementViews(id: string) {
    const { data, error } = await supabase
      .from("articles")
      .update({ views: supabase.raw("views + 1") })
      .eq("id", id)
      .select("views")
      .single()
    if (error) throw error
    return data
  },

  // Get article stats
  async getStats() {
    const { data: totalArticles, error: totalError } = await supabase.from("articles").select("id", { count: "exact" })
    const { data: publishedArticles, error: publishedError } = await supabase
      .from("articles")
      .select("id", { count: "exact" })
      .eq("status", "published")
    const { data: totalViews, error: viewsError } = await supabase.from("articles").select("views")

    if (totalError || publishedError || viewsError) throw totalError || publishedError || viewsError

    const views = totalViews?.reduce((sum, article) => sum + (article.views || 0), 0) || 0

    return {
      totalArticles: totalArticles?.length || 0,
      publishedArticles: publishedArticles?.length || 0,
      totalViews: views,
    }
  },
}

// ---------------------- Subscriber Operations ----------------------
export const subscriberService = {
  async getAll(filters?: { status?: string; limit?: number; offset?: number }) {
    let query = supabase.from("subscribers").select("*").order("subscribed_at", { ascending: false })
    if (filters?.status) query = query.eq("status", filters.status)
    if (filters?.limit) query = query.limit(filters.limit)
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    const { data, error } = await query
    if (error) throw error
    return data as Subscriber[]
  },

  async create(email: string, source = "website") {
    const { data, error } = await supabase.from("subscribers").insert([{ email, source }]).select().single()
    if (error) throw error
    return data as Subscriber
  },

  async updateStatus(id: string, status: "active" | "inactive" | "unsubscribed") {
    const updates: any = { status }
    if (status === "unsubscribed") updates.unsubscribed_at = new Date().toISOString()
    const { data, error } = await supabase.from("subscribers").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data as Subscriber
  },

  async delete(id: string) {
    const { error } = await supabase.from("subscribers").delete().eq("id", id)
    if (error) throw error
  },

  async getStats() {
    const { data: total, error: totalError } = await supabase.from("subscribers").select("id", { count: "exact" })
    const { data: active, error: activeError } = await supabase
      .from("subscribers")
      .select("id", { count: "exact" })
      .eq("status", "active")
    if (totalError || activeError) throw totalError || activeError
    return { total: total?.length || 0, active: active?.length || 0 }
  },
}

// ---------------------- Category Operations ----------------------
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase.from("categories").select("*").order("name")
    if (error) throw error
    return data as Category[]
  },

  async create(category: Omit<Category, "id" | "created_at">) {
    const { data, error } = await supabase.from("categories").insert([category]).select().single()
    if (error) throw error
    return data as Category
  },
}

// ---------------------- Analytics Operations ----------------------
export const analyticsService = {
  async recordView(articleId: string, ipAddress?: string, userAgent?: string) {
    const { error } = await supabase.from("article_views").insert([
      { article_id: articleId, ip_address: ipAddress, user_agent: userAgent },
    ])
    if (error) throw error
  },

  async getViewAnalytics(days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from("article_views")
      .select(`
        viewed_at,
        articles!inner(title, slug)
      `)
      .gte("viewed_at", startDate.toISOString())
      .order("viewed_at", { ascending: false })

    if (error) throw error
    return data
  },

  async getTopArticles(limit = 10) {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, views, category")
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Article[]
  },
}

// ---------------------- RPC Utility ----------------------
export const incrementArticleViews = async (articleId: string) => {
  const { data, error } = await supabase
    .from("articles")
    .update({ views: supabase.raw("views + 1") })
    .eq("id", articleId)
    .select("views")
    .single()

  if (error) throw error
  return data
}
