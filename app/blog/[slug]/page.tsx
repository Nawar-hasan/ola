"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BrainCircuit, Clock, Share2, Twitter, Facebook, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { articleService, analyticsService } from "@/lib/database"
import type { Article } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { toast } = useToast()
  const [post, setPost] = useState<Article | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const article = await articleService.getBySlug(params.slug)
        setPost(article)

        // Record view
        await analyticsService.recordView(
          article.id,
          undefined, // IP address would be handled server-side
          navigator.userAgent,
        )

        // Remove the incrementViews call since we'll handle it differently
        const { error: viewError } = await supabase
          .from("articles")
          .update({ views: supabase.raw("views + 1") })
          .eq("id", article.id)

        if (viewError) {
          console.error("Error incrementing views:", viewError)
        }

        // Fetch related posts
        const related = await articleService.getAll({
          status: "published",
          category: article.category,
          limit: 3,
        })
        setRelatedPosts(related.filter((a) => a.id !== article.id).slice(0, 2))
      } catch (error) {
        console.error("Error fetching post:", error)
        toast({
          title: "Post not found",
          description: "The requested blog post could not be found.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug, toast])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this article: ${post?.title}`

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url)
        toast({
          title: "Link copied",
          description: "The article link has been copied to your clipboard.",
        })
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            Neural<span className="text-purple-500">Pulse</span>
          </Link>
          <Button
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white bg-transparent"
            onClick={() => {
              window.location.href = "/#newsletter"
            }}
          >
            Subscribe
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/articles/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Link>

          <div className="flex items-center gap-2 text-sm text-purple-500 mb-4">
            <BrainCircuit className="h-5 w-5" />
            <span>{post.category}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>5 min read</span>
            </div>
            <div>{new Date(post.created_at).toLocaleDateString()}</div>
            <div>{post.views} views</div>
          </div>

          {post.featured_image && (
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-gray-800 mb-8">
              <Image
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 border-gray-800 hover:bg-gray-900 bg-transparent"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 border-gray-800 hover:bg-gray-900 bg-transparent"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 border-gray-800 hover:bg-gray-900 bg-transparent"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 border-gray-800 hover:bg-gray-900 bg-transparent"
              onClick={() => handleShare("clipboard")}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>

          <article className="prose prose-invert prose-purple max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {relatedPosts.length > 0 && (
            <div className="border-t border-gray-800 mt-12 pt-8">
              <h3 className="text-xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.slug}/`} className="group" key={relatedPost.id}>
                    <div className="space-y-3">
                      {relatedPost.featured_image && (
                        <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                          <Image
                            src={relatedPost.featured_image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                          <BrainCircuit className="h-4 w-4" />
                          <span>{relatedPost.category}</span>
                        </div>
                        <h3 className="font-medium group-hover:text-purple-400 transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              Neural<span className="text-purple-500">Pulse</span>
            </Link>
            <p className="text-gray-400 text-sm mt-4 mb-6">
              Exploring the cutting edge of artificial intelligence and machine learning.
            </p>
            <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400">
              <p>© {new Date().getFullYear()} NeuralPulse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
