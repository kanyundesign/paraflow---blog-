import { Helmet } from "react-helmet-async";
import { useState, useRef, useEffect } from "react";
import BlogLayout from "@/components/blog/BlogLayout";
import CategorySidebar from "@/components/blog/CategorySidebar";
import BlogCard from "@/components/blog/BlogCard";
import { usePublishedPosts } from "@/hooks/use-published-posts";
import { Loader2 } from "lucide-react";

const Blog = () => {
  const { data: posts, isLoading } = usePublishedPosts();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showGlow, setShowGlow] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setShowGlow(true);
      
      // Reset timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowGlow(false);
      }, 3000);
    }
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>Blog | Paraflow - AI-Powered Coding</title>
        <meta
          name="description"
          content="Ideas shaping Paraflow. Insights, stories, features, and engineering perspectives on AI-powered coding."
        />
      </Helmet>

      <div className="container mx-auto max-w-7xl px-6 py-16">
        {/* Page Header - Diagonal Layout */}
        <header className="mb-12">
          {/* Decorative line above title */}
          <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          
          <div className="flex items-end justify-between">
            {/* Left: Large Blog title with mouse follow effect */}
            <h1 
              ref={titleRef}
              onMouseMove={handleMouseMove}
              className="font-display text-[64px] font-medium leading-none tracking-tight cursor-default md:text-[90px] lg:text-[120px] relative"
            >
              {/* Base white text */}
              <span className="text-white">Blog</span>
              {/* Gradient overlay that fades out */}
              <span 
                className="absolute inset-0 bg-clip-text text-transparent transition-opacity duration-1000 ease-out"
                style={{
                  backgroundImage: `radial-gradient(circle 100px at ${mousePos.x}px ${mousePos.y}px, #00C05C 0%, #79F200 30%, transparent 100%)`,
                  opacity: showGlow ? 1 : 0,
                }}
              >
                Blog
              </span>
            </h1>
            
            {/* Right: Subtitle aligned to bottom */}
            <p className="translate-y-[10px] text-right text-sm font-light text-gray-400 md:text-base lg:text-lg">
              Ideas shaping <span className="font-bold">Paraflow</span>
            </p>
          </div>
          
          {/* Decorative line below */}
          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </header>

        {/* Main Content */}
        <div className="flex gap-12 pb-6">
          {/* Left Sidebar */}
          <CategorySidebar />

          {/* Vertical Decorative Line - extends up to connect with horizontal line */}
          <div className="relative hidden lg:block">
            {/* Vertical line with bottom fade */}
            <div className="absolute -top-12 bottom-0 w-px bg-gradient-to-b from-white/80 via-white/80 to-transparent" />
            {/* Square anchor point at intersection - on top of line */}
            <div className="absolute -top-[49px] left-1/2 z-10 -translate-x-1/2">
              <div className="h-2 w-2 border border-white/80 bg-black" />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-24">
                <p className="text-muted-foreground">No posts published yet.</p>
              </div>
            )}
          </div>
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
    </BlogLayout>
  );
};

export default Blog;
