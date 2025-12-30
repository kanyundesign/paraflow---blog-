import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import CategorySidebar from "@/components/blog/CategorySidebar";
import BlogCard from "@/components/blog/BlogCard";
import { usePublishedPosts } from "@/hooks/use-published-posts";
import { useCategories } from "@/hooks/use-categories";
import { Loader2 } from "lucide-react";

const BlogCategory = () => {
  const { category } = useParams<{ category: string }>();
  const { data: categories } = useCategories();
  const { data: posts, isLoading } = usePublishedPosts(category);
  
  const categoryData = categories?.find((c) => c.slug === category);
  
  if (categories && !categoryData) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <BlogLayout>
      <Helmet>
        <title>{categoryData?.label || 'Category'} | Paraflow Blog</title>
        <meta name="description" content={categoryData?.description || ''} />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-6 py-20">
        <header className="mb-12">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            {categoryData?.label}
          </h1>
          {categoryData?.description && (
            <p className="mt-2 text-muted-foreground">{categoryData.description}</p>
          )}
        </header>

        <div className="flex gap-12">
          <CategorySidebar />
          
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">No posts in this category yet.</p>
            )}
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogCategory;
