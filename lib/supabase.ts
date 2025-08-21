import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Article {
  id: string
  title: string
  slug: string
  description?: string
  content: string
  category: string
  tags: string[]
  featured_image?: string
  meta_title?: string
  meta_description?: string
  status: "draft" | "published" | "archived"
  views: number
  author_id?: string
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  email: string
  status: "active" | "inactive" | "unsubscribed"
  subscribed_at: string
  unsubscribed_at?: string
  source: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
}

export interface ArticleView {
  id: string
  article_id: string
  ip_address?: string
  user_agent?: string
  viewed_at: string
}
