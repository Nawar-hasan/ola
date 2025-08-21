"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Upload, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const categories = ["GenAI", "Computer Vision", "Deep Learning", "NLP", "AI Ethics", "Future Tech", "AI Research"]

export default function NewArticle() {
  const { toast } = useToast()
  const [article, setArticle] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: [],
    status: "draft",
    featuredImage: "",
  })
  const [tagInput, setTagInput] = useState("")

  const handleSave = async (status: "draft" | "published") => {
    if (!article.title || !article.content) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the title and content fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...article,
          status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: status === "draft" ? "Draft saved" : "Article published",
          description: `Your article has been ${status === "draft" ? "saved as draft" : "published successfully"}.`,
        })

        // Redirect to dashboard after successful save
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1500)
      } else {
        throw new Error(data.error || "Failed to save article")
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save the article. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setArticle((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-xl font-bold">New Article</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => handleSave("draft")}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave("published")}>
                <Eye className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title..."
                    value={article.title}
                    onChange={(e) => setArticle((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-black border-gray-700 text-lg font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the article..."
                    value={article.description}
                    onChange={(e) => setArticle((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-black border-gray-700 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here..."
                    value={article.content}
                    onChange={(e) => setArticle((prev) => ({ ...prev, content: e.target.value }))}
                    className="bg-black border-gray-700 min-h-[400px]"
                  />
                  <p className="text-sm text-gray-400">
                    You can use HTML tags for formatting. Markdown support coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400 mb-2">Drop your image here, or click to browse</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Or enter image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={article.featuredImage}
                      onChange={(e) => setArticle((prev) => ({ ...prev, featuredImage: e.target.value }))}
                      className="bg-black border-gray-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={article.category}
                    onValueChange={(value) => setArticle((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-black border-gray-700">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="bg-black border-gray-700"
                    />
                    <Button onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={article.status}
                    onValueChange={(value) => setArticle((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-black border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" placeholder="SEO title..." className="bg-black border-gray-700" />
                  <p className="text-xs text-gray-400">60 characters recommended</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="SEO description..."
                    className="bg-black border-gray-700 min-h-[80px]"
                  />
                  <p className="text-xs text-gray-400">160 characters recommended</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" placeholder="article-url-slug" className="bg-black border-gray-700" />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{article.title || "Article Title"}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {article.description || "Article description will appear here..."}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{article.category || "Category"}</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
