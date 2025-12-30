import { Link } from "react-router-dom";
import { PublishedPost } from "@/hooks/use-published-posts";
import { format } from "date-fns";
import cover01 from "@/assets/blog/cover-featured.png";
import cover02 from "@/assets/blog/cover-02.png";
import cover03 from "@/assets/blog/cover-03.png";
import cover04 from "@/assets/blog/cover-04.png";

// 本地素材图数组
const localCovers = [cover01, cover02, cover03, cover04];

// 默认副文案数组
const defaultSubtitles = [
  "For most designers, the real challenge isn't creativity—it's time.",
  "Our Origin: Why Did We Build Paraflow?",
  "For most designers, the real challenge isn't creativity—it's time.",
  "Turning an idea into a Minimum Viable Product (MVP) is one of the biggest challenges for startups and solopreneurs.",
];

interface BlogCardProps {
  post: PublishedPost;
  index?: number;
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const formattedDate = post.published_at 
    ? format(new Date(post.published_at), 'MMM yyyy')
    : '';

  // 使用本地素材图（循环使用）
  const coverImage = localCovers[index % localCovers.length] || post.cover_image_url;

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative block h-[420px] animate-fade-in overflow-hidden rounded-2xl"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Main Card */}
      <div className="relative h-full overflow-hidden rounded-2xl bg-black border border-white/80 transition-all duration-300">
        {/* Cover Image */}
        <div className="relative h-60 w-full overflow-hidden bg-[#1A1A1A]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-[#00C05C]/30" />
            </div>
          )}
          {/* Decorative line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/80" />
        </div>
        
        {/* Content */}
        <div className="flex h-[calc(100%-15rem)] flex-col justify-between bg-white p-5">
          {/* Title */}
          <h3 className="text-[22px] font-semibold leading-tight text-black line-clamp-3">
            {post.title}
          </h3>
          
          {/* Bottom Row: Category Tag + Date */}
          <div className="flex items-center justify-between">
            <CategoryTag 
              category={post.category?.slug || 'default'} 
              label={post.category?.label || 'Article'} 
            />
            <span className="text-sm font-medium text-gray-500">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      
      {/* Hover Overlay Card - slides up from bottom to cover the main card */}
      <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#00C05C] to-[#79F200] p-8 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
        <p className="text-[26px] font-semibold leading-[1.3] text-left text-paraflow-black line-clamp-7">
          {post.subtitle || defaultSubtitles[index % defaultSubtitles.length]}
        </p>
        {/* Jump icon at bottom right */}
        <div className="flex justify-end">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/10 transition-all duration-200 group-hover:scale-110 group-active:scale-95">
            <svg 
              className="h-7 w-7 text-paraflow-black transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Category colors - muted colors for white background
const categoryStyles: Record<string, { bg: string; text: string }> = {
  insight: { bg: "bg-[#E8F4FD]", text: "text-[#1976D2]" },      // Soft blue
  stories: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]" },      // Soft green
  features: { bg: "bg-[#F3E5F5]", text: "text-[#7B1FA2]" },     // Soft purple
  engineering: { bg: "bg-[#FFF3E0]", text: "text-[#E65100]" },  // Soft orange
};

// Category Tag Component with colored background
const CategoryTag = ({ category, label }: { category: string; label: string }) => {
  const style = categoryStyles[category] || { bg: "bg-gray-100", text: "text-gray-600" };
  
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${style.bg}`}>
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

export default BlogCard;

