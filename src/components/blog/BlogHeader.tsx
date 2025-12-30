import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const BlogHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-paraflow-black/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 28 28" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-paraflow-green"
          >
            <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <path 
              d="M10 14C10 11.5 11.5 10 14 10" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="text-lg font-semibold text-white">Paraflow</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <button className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white">
            Product
            <ChevronDown className="h-4 w-4" />
          </button>
          <Link to="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">
            Use Cases
          </Link>
          <Link to="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">
            Learn
          </Link>
          <Link to="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">
            Pricing
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/"
            className="rounded-full bg-gradient-paraflow px-5 py-2.5 text-sm font-medium text-paraflow-black transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,192,92,0.4)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
