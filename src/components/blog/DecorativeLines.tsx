const DecorativeLines = () => {
  return (
    <>
      {/* Scattered decorative dots */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
        {/* Left side dots */}
        <div className="absolute left-[100px] top-[20%] h-1 w-1 rounded-full bg-white/20" />
        <div className="absolute left-[140px] top-[35%] h-1.5 w-1.5 rounded-full bg-white/10" />
        <div className="absolute left-[80px] top-[55%] h-1 w-1 rounded-full bg-white/15" />
        <div className="absolute left-[160px] top-[70%] h-1 w-1 rounded-full bg-white/20" />
        
        {/* Right side dots */}
        <div className="absolute right-[100px] top-[25%] h-1 w-1 rounded-full bg-white/20" />
        <div className="absolute right-[140px] top-[45%] h-1.5 w-1.5 rounded-full bg-white/10" />
        <div className="absolute right-[80px] top-[65%] h-1 w-1 rounded-full bg-white/15" />
        <div className="absolute right-[160px] top-[85%] h-1 w-1 rounded-full bg-white/20" />

      </div>
    </>
  );
};

export default DecorativeLines;
