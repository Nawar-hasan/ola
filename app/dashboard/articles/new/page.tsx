"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function NewArticlePage() {
  const router = useRouter()
  const [article, setArticle] = useState({
    title: "",
    content: "",
    tags: [] as string[], // ✅ حددنا النوع هنا
  })

  const [tagInput, setTagInput] = useState("")

  const addTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setArticle((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async () => {
    const { error } = await supabase.from("articles").insert([article])
    if (!error) {
      router.push("/dashboard/articles")
    } else {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>New Article</h1>
      <input
        type="text"
        placeholder="Title"
        value={article.title}
        onChange={(e) => setArticle({ ...article, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={article.content}
        onChange={(e) => setArticle({ ...article, content: e.target.value })}
      />
      <div>
        <input
          type="text"
          placeholder="Add tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <button onClick={addTag}>Add Tag</button>
      </div>
      <ul>
        {article.tags.map((tag) => (
          <li key={tag}>
            {tag} <button onClick={() => removeTag(tag)}>x</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Save</button>
    </div>
  )
}
