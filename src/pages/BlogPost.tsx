import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import { usePublishedPost, usePublishedPosts } from "@/hooks/use-published-posts";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import DOMPurify from "dompurify";

// Remove the first H1 from markdown content (to avoid duplicate title)
const removeFirstH1 = (content: string): string => {
  return content.replace(/^\s*#\s+[^\n]+\n?/, "");
};

// Sanitize HTML content to prevent XSS attacks
const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'width', 'height'],
  });
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePublishedPost(slug);
  const { data: allPosts } = usePublishedPosts();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Find next post
  const nextPost = React.useMemo(() => {
    if (!allPosts || !slug) return null;
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    if (currentIndex === -1 || currentIndex >= allPosts.length - 1) return null;
    return allPosts[currentIndex + 1];
  }, [allPosts, slug]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <BlogLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </BlogLayout>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const processedContent = sanitizeContent(removeFirstH1(post.content));
  const formattedDate = post.published_at
    ? format(new Date(post.published_at), "MMM yyyy")
    : "";

  const getCellCount = (children: React.ReactNode) => {
    const arr = React.Children.toArray(children);
    return arr.filter((c) => React.isValidElement(c) && c.type).length;
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>{post.title} | Paraflow Blog</title>
        <meta name="description" content={post.subtitle || ""} />
        {post.tags && <meta name="keywords" content={post.tags.join(", ")} />}
      </Helmet>

      <article className="pb-20">
        <div className="mx-auto max-w-6xl px-6 pt-16">
          <div className="flex gap-12">
            {/* Vertical decorative line - left side */}
            <div className="hidden lg:block relative w-px shrink-0">
              <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-white/30 to-transparent" />
            </div>

            {/* Main content */}
            <div className="flex-1 max-w-5xl">
              {/* Breadcrumb - above title */}
              <nav className="mb-4 text-xs">
                <Link to="/blog" className="text-muted-foreground/60 hover:text-foreground transition-colors">
                  Blog
                </Link>
                {post.category && (
                  <>
                    <span className="mx-1.5 text-muted-foreground/60">/</span>
                    <span className="text-foreground font-medium">
                      {post.category.label}
                    </span>
                  </>
                )}
              </nav>

              {/* Title */}
              <h1 className="font-display text-[2.5rem] font-medium leading-[1.1] tracking-tight text-foreground md:text-[3rem] lg:text-[3.5rem]">
                {post.title}
              </h1>

              {/* Author and Date */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-lg">✍️</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-foreground">
                    {post.author?.name || "Ryan"}
                  </span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="text-muted-foreground">Co-founder</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="text-muted-foreground">{formattedDate}</span>
                </div>
              </div>

              {/* Decorative horizontal line */}
              <div className="mt-5 mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Cover image */}
              {post.cover_image_url && (
                <figure className="mt-10 flex justify-center">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="max-w-full rounded-xl object-cover"
                  />
                </figure>
              )}

              {/* Content */}
              <div className="mt-[30px] prose prose-base prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-[1.75] prose-p:my-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-[#00C05C]/30 prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-foreground/90 prose-blockquote:rounded-r-lg [&_blockquote]:bg-gradient-to-r [&_blockquote]:from-[#00C05C]/10 [&_blockquote]:to-[#79F200]/5 prose-code:rounded prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:text-primary prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-strong:text-foreground prose-strong:font-bold prose-em:not-italic prose-em:font-normal prose-em:text-muted-foreground prose-ul:text-muted-foreground prose-ul:my-4 prose-ol:text-muted-foreground prose-ol:my-4 prose-li:marker:text-primary/60 prose-li:my-1.5 prose-img:rounded-xl prose-img:my-8 prose-img:mx-auto prose-img:max-w-[75%] [&_strong]:text-foreground [&_strong]:font-bold [&_em]:not-italic [&_em]:font-normal [&_em]:text-muted-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-");
                      return <h2 id={id}>{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-");
                      return <h3 id={id}>{children}</h3>;
                    },
                    iframe: ({ node, ...props }) => (
                      <div className="my-8 aspect-video w-full overflow-hidden rounded-xl">
                        <iframe {...props} className="h-full w-full" />
                      </div>
                    ),
                    table: ({ children }) => (
                      <section className="my-10">
                        <div className="not-prose space-y-4">{children}</div>
                      </section>
                    ),
                    thead: ({ children }) => (
                      <div className="not-prose hidden">{children}</div>
                    ),
                    tbody: ({ children }) => (
                      <div className="not-prose space-y-8">{children}</div>
                    ),
                    tr: ({ children }) => {
                      const colCount = Math.max(1, getCellCount(children));
                      const gridCols =
                        colCount === 2
                          ? "md:grid-cols-2"
                          : colCount === 3
                            ? "md:grid-cols-3"
                            : "";

                      return (
                        <div
                          className={`not-prose grid grid-cols-1 gap-6 ${gridCols}`}
                        >
                          {children}
                        </div>
                      );
                    },
                    td: ({ children }) => (
                      <div className="rounded-xl bg-card/40 ring-1 ring-border/60 px-5 py-4 text-muted-foreground text-sm [&_p]:my-0 [&_p]:mt-2 [&_p:first-child]:mt-0 [&_p]:text-xs [&_p]:leading-relaxed [&_img]:mb-0 [&_img+p]:mt-2">
                        {children}
                      </div>
                    ),
                    th: ({ children }) => (
                      <div className="rounded-xl bg-card/50 ring-1 ring-border/60 px-6 py-5 font-semibold text-foreground">
                        {children}
                      </div>
                    ),
                    a: ({ href, children, title }) => {
                      // Check if the link contains an image
                      const hasImage = Array.isArray(children)
                        ? children.some(
                            (child: any) =>
                              child?.type === "img" ||
                              child?.props?.node?.tagName === "img"
                          )
                        : (children as any)?.type === "img" ||
                          (children as any)?.props?.node?.tagName === "img";

                      if (hasImage) {
                        // Extract domain from href for display
                        let domain = "";
                        try {
                          domain = new URL(href || "").hostname.replace("www.", "");
                        } catch {}

                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block my-6 rounded-xl overflow-hidden no-underline hover:no-underline"
                          >
                            <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                              {children}
                            </div>
                            {/* Hover overlay with link info */}
                            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12 pb-4 px-4">
                              <div className="flex items-center gap-2 text-sm text-white/90">
                                <svg
                                  className="w-4 h-4 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                                <span className="truncate">{title || domain || href}</span>
                              </div>
                            </div>
                          </a>
                        );
                      }

                      // Regular link
                      return (
                        <a
                          href={href}
                          target={href?.startsWith("http") ? "_blank" : undefined}
                          rel={
                            href?.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {processedContent}
                </ReactMarkdown>
              </div>

              {/* Navigation: Back to all posts & Next post */}
              <div className="mt-16 flex items-center justify-between">
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-[#00C05C]"
                >
                  <svg 
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                  <span>Back to all posts</span>
                </Link>
                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-[#00C05C]"
                  >
                    <span>Next post</span>
                    <svg 
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              {/* Back to top - floating button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-8 right-8 z-50 group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 backdrop-blur-sm transition-all duration-300 hover:border-[#00C05C]/50 hover:bg-[#00C05C]/20 hover:shadow-[0_0_20px_rgba(0,192,92,0.2)] ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                aria-label="Back to top"
              >
                <svg 
                  className="h-5 w-5 text-white/60 transition-all duration-300 group-hover:text-[#00C05C] group-hover:-translate-y-0.5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
};

// Category colors - muted colors for white background
const categoryStyles: Record<string, { bg: string; text: string }> = {
  insight: { bg: "bg-[#1E88E5]", text: "text-white" },
  stories: { bg: "bg-[#00C05C]", text: "text-white" },
  features: { bg: "bg-[#9C27B0]", text: "text-white" },
  engineering: { bg: "bg-[#FF6D00]", text: "text-white" },
};

// Category Tag Component with colored background
const CategoryTag = ({ category, label }: { category: string; label: string }) => {
  const style = categoryStyles[category] || { bg: "bg-gray-100", text: "text-gray-600" };
  
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${style.bg}`}>
      <span className={style.text}>
        <CategoryIcon category={category} />
      </span>
      <span className={`text-xs font-medium ${style.text}`}>{label}</span>
    </div>
  );
};

// Category Icon Component
const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "insight":
      return (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      );
    case "stories":
      return (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "features":
      return (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "engineering":
      return (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    default:
      return (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
  }
};

export default BlogPost;
