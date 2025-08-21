"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Users,
  FileText,
  Eye,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

interface DashboardStats {
  totalArticles: number
  totalViews: number
  totalSubscribers: number
  monthlyGrowth: number
}

interface Article {
  id: string
  title: string
  status: string
  views: number
  date: string
  category: string
}

interface Subscriber {
  id: string
  email: string
  subscribeDate: string
  status: string
}

// Mock data for dashboard
// const dashboardStats = {
//   totalArticles: 24,
//   totalViews: 15420,
//   totalSubscribers: 1250,
//   monthlyGrowth: 12.5,
// }

// const recentArticles = [
//   {
//     id: 1,
//     title: "The Evolution of Generative Adversarial Networks",
//     status: "published",
//     views: 2340,
//     date: "2024-01-15",
//     category: "GenAI",
//   },
//   {
//     id: 2,
//     title: "AI in 2025: Transforming Daily Life",
//     status: "published",
//     views: 1890,
//     date: "2024-01-12",
//     category: "Future Tech",
//   },
//   {
//     id: 3,
//     title: "Multimodal AI Models: Bridging Text and Image",
//     status: "draft",
//     views: 0,
//     date: "2024-01-10",
//     category: "AI Research",
//   },
//   {
//     id: 4,
//     title: "Computer Vision in Autonomous Vehicles",
//     status: "published",
//     views: 1560,
//     date: "2024-01-08",
//     category: "Computer Vision",
//   },
// ]

// const subscribers = [
//   {
//     id: 1,
//     email: "john.doe@example.com",
//     subscribeDate: "2024-01-15",
//     status: "active",
//   },
//   {
//     id: 2,
//     email: "sarah.smith@example.com",
//     subscribeDate: "2024-01-14",
//     status: "active",
//   },
//   {
//     id: 3,
//     email: "mike.johnson@example.com",
//     subscribeDate: "2024-01-13",
//     status: "active",
//   },
// ]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  // Add these state variables at the top of the component
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalViews: 0,
    totalSubscribers: 0,
    monthlyGrowth: 0,
  })
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  // Add this useEffect to fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, articlesResponse, subscribersResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/articles?limit=10"),
          fetch("/api/subscribers?limit=10"),
        ])

        const stats = await statsResponse.json()
        const articles = await articlesResponse.json()
        const subs = await subscribersResponse.json()

        setDashboardStats({
          totalArticles: stats.totalArticles,
          totalViews: stats.totalViews,
          totalSubscribers: stats.totalSubscribers,
          monthlyGrowth: 12.5, // This would be calculated based on historical data
        })
        setRecentArticles(articles)
        setSubscribers(subs)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600 hover:bg-green-700">Published</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "archived":
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRecentArticles((prev) => prev.filter((article) => article.id !== id))
        toast({
          title: "Article deleted",
          description: "The article has been deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete article")
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                Neural<span className="text-purple-500">Pulse</span>
              </Link>
              <span className="text-gray-400">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/dashboard/articles/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">View Site</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "articles" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("articles")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </Button>
            <Button
              variant={activeTab === "subscribers" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("subscribers")}
            >
              <Users className="h-4 w-4 mr-2" />
              Subscribers
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.totalArticles}</div>
                      <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.totalViews.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{dashboardStats.monthlyGrowth}% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.totalSubscribers}</div>
                      <p className="text-xs text-muted-foreground">+45 this week</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8.2%</div>
                      <p className="text-xs text-muted-foreground">+1.2% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Articles */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Recent Articles</CardTitle>
                    <CardDescription>Your latest published and draft articles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentArticles.slice(0, 3).map((article) => (
                        <div
                          key={article.id}
                          className="flex items-center justify-between p-4 border border-gray-800 rounded-lg"
                        >
                          <div className="space-y-1">
                            <h3 className="font-medium">{article.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{article.category}</span>
                              <span>•</span>
                              <span>{article.date}</span>
                              <span>•</span>
                              <span>{article.views} views</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(article.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "articles" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Articles</h1>
                  <Button asChild>
                    <Link href="/dashboard/articles/new">
                      <Plus className="h-4 w-4 mr-2" />
                      New Article
                    </Link>
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-800"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Articles Table */}
                <Card className="bg-gray-900 border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentArticles
                        .filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((article) => (
                          <TableRow key={article.id} className="border-gray-800">
                            <TableCell className="font-medium">{article.title}</TableCell>
                            <TableCell>{article.category}</TableCell>
                            <TableCell>{getStatusBadge(article.status)}</TableCell>
                            <TableCell>{article.views.toLocaleString()}</TableCell>
                            <TableCell>{article.date}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-400">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {activeTab === "subscribers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Subscribers</h1>
                  <div className="text-sm text-gray-400">Total: {dashboardStats.totalSubscribers} subscribers</div>
                </div>

                {/* Subscribers Table */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Newsletter Subscribers</CardTitle>
                    <CardDescription>Manage your newsletter subscriber list</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead>Email</TableHead>
                          <TableHead>Subscribe Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((subscriber) => (
                          <TableRow key={subscriber.id} className="border-gray-800">
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>{subscriber.subscribeDate}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-600 hover:bg-green-700">{subscriber.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-400">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Analytics</h1>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Page Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-500">15,420</div>
                      <p className="text-sm text-gray-400 mt-2">+12.5% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Unique Visitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-500">8,240</div>
                      <p className="text-sm text-gray-400 mt-2">+8.3% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Avg. Session Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-500">4:32</div>
                      <p className="text-sm text-gray-400 mt-2">+15.2% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Articles */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Top Performing Articles</CardTitle>
                    <CardDescription>Articles with the most views this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentArticles
                        .sort((a, b) => b.views - a.views)
                        .slice(0, 5)
                        .map((article, index) => (
                          <div key={article.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-medium">{article.title}</h3>
                                <p className="text-sm text-gray-400">{article.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{article.views.toLocaleString()}</div>
                              <div className="text-sm text-gray-400">views</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
