import { ReactNode } from "react";
import BlogHeader from "./BlogHeader";
import BlogFooter from "./BlogFooter";
import StarBackground from "./StarBackground";
import DecorativeLines from "./DecorativeLines";

interface BlogLayoutProps {
  children: ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-paraflow-black flex flex-col overflow-x-hidden">
      {/* Star Background */}
      <StarBackground />
      
      {/* Decorative Lines */}
      <DecorativeLines />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <BlogHeader />
        <main className="flex-1">{children}</main>
        <BlogFooter />
      </div>
    </div>
  );
};

export default BlogLayout;
