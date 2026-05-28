"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blue Blob 1 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#92B4EC] opacity-20 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" />
      
      {/* Yellow Blob 2 */}
      <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#FFE69A] opacity-20 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
      
      {/* Blue Blob 3 */}
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#92B4EC] opacity-20 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />

      {/* Yellow Blob 4 */}
      <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#FFE69A] opacity-20 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
      
      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#FFE69A] opacity-40 animate-float-slow" />
      <div className="absolute top-3/4 right-1/4 w-6 h-6 rounded-full bg-[#92B4EC] opacity-40 animate-float-medium" />
      <div className="absolute top-1/2 left-3/4 w-3 h-3 rounded-full bg-[#FFE69A] opacity-60 animate-float-fast" />
      <div className="absolute bottom-1/4 right-1/2 w-5 h-5 rounded-full bg-[#92B4EC] opacity-50 animate-float-slow" />
      <div className="absolute top-[15%] left-[60%] w-2 h-2 rounded-full bg-[#FFE69A] opacity-70 animate-float-medium" />
    </div>
  );
}
