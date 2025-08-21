import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// جلب جميع المقالات
export const getArticles = async () => {
  const { data, error } = await supabase.from("articles").select("*");
  if (error) throw error;
  return data;
};

// جلب مقال واحد حسب id
export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// زيادة عدد المشاهدات لمقال
export const incrementArticleViews = async (id: string) => {
  // جلب عدد المشاهدات الحالي
  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("views")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // تحديث المشاهدات بزيادة 1
  const { data, error } = await supabase
    .from("articles")
    .update({ views: (article.views || 0) + 1 })
    .eq("id", id)
    .select("views")
    .single();

  if (error) throw error;
  return data;
};

// إضافة مقال جديد
export const addArticle = async (title: string, content: string) => {
  const { data, error } = await supabase
    .from("articles")
    .insert([{ title, content, views: 0 }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// حذف مقال
export const deleteArticle = async (id: string) => {
  const { data, error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
  return data;
};
