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
      {/* Large Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#92B4EC] opacity-20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#FFE69A] opacity-20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#92B4EC] opacity-20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#FFE69A] opacity-20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#FFE69A] opacity-10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-[#92B4EC] opacity-10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '5s' }} />
      <div className="absolute top-[-20%] left-[50%] w-[50%] h-[50%] rounded-full bg-[#92B4EC] opacity-15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '7s' }} />
      <div className="absolute bottom-[-20%] left-[60%] w-[40%] h-[40%] rounded-full bg-[#FFE69A] opacity-15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '8s' }} />

      {/* Medium Decorative Blobs */}
      <div className="absolute top-[20%] left-[-5%] w-[20%] h-[20%] rounded-full bg-[#92B4EC] opacity-25 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '6s' }} />
      <div className="absolute bottom-[20%] right-[-5%] w-[25%] h-[25%] rounded-full bg-[#FFE69A] opacity-25 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '7s' }} />
      <div className="absolute top-[60%] left-[-10%] w-[30%] h-[30%] rounded-full bg-[#FFE69A] opacity-20 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '9s' }} />
      <div className="absolute top-[5%] right-[40%] w-[20%] h-[20%] rounded-full bg-[#92B4EC] opacity-20 blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: '10s' }} />
      
      {/* Floating Particles - Left Region */}
      <div className="absolute top-[15%] left-[10%] w-4 h-4 rounded-full bg-[#FFE69A] opacity-40 animate-float-slow" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[45%] left-[5%] w-3 h-3 rounded-full bg-[#92B4EC] opacity-60 animate-float-medium" style={{ animationDelay: '1.2s' }} />
      <div className="absolute top-[75%] left-[15%] w-6 h-6 rounded-full bg-[#FFE69A] opacity-30 animate-float-fast" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-[25%] left-[25%] w-2 h-2 rounded-full bg-[#92B4EC] opacity-70 animate-float-slow" style={{ animationDelay: '3.1s' }} />
      <div className="absolute top-[85%] left-[8%] w-5 h-5 rounded-full bg-[#92B4EC] opacity-40 animate-float-medium" style={{ animationDelay: '0.8s' }} />
      <div className="absolute top-[55%] left-[20%] w-4 h-4 rounded-full bg-[#FFE69A] opacity-50 animate-float-slow" style={{ animationDelay: '4.2s' }} />
      <div className="absolute top-[35%] left-[12%] w-3 h-3 rounded-full bg-[#92B4EC] opacity-50 animate-float-fast" style={{ animationDelay: '5.2s' }} />
      <div className="absolute top-[65%] left-[2%] w-5 h-5 rounded-full bg-[#FFE69A] opacity-40 animate-float-medium" style={{ animationDelay: '6.1s' }} />
      <div className="absolute top-[5%] left-[18%] w-2 h-2 rounded-full bg-[#FFE69A] opacity-80 animate-float-slow" style={{ animationDelay: '2.4s' }} />
      <div className="absolute top-[95%] left-[22%] w-4 h-4 rounded-full bg-[#92B4EC] opacity-60 animate-float-fast" style={{ animationDelay: '3.8s' }} />

      {/* Floating Particles - Right Region */}
      <div className="absolute top-[20%] right-[15%] w-5 h-5 rounded-full bg-[#92B4EC] opacity-50 animate-float-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[65%] right-[8%] w-3 h-3 rounded-full bg-[#FFE69A] opacity-60 animate-float-fast" style={{ animationDelay: '1.8s' }} />
      <div className="absolute top-[80%] right-[20%] w-4 h-4 rounded-full bg-[#92B4EC] opacity-40 animate-float-medium" style={{ animationDelay: '2.9s' }} />
      <div className="absolute top-[35%] right-[25%] w-6 h-6 rounded-full bg-[#FFE69A] opacity-30 animate-float-slow" style={{ animationDelay: '4.5s' }} />
      <div className="absolute top-[10%] right-[10%] w-2 h-2 rounded-full bg-[#92B4EC] opacity-80 animate-float-medium" style={{ animationDelay: '3.7s' }} />
      <div className="absolute top-[50%] right-[30%] w-3 h-3 rounded-full bg-[#FFE69A] opacity-50 animate-float-fast" style={{ animationDelay: '0.3s' }} />
      <div className="absolute top-[25%] right-[5%] w-4 h-4 rounded-full bg-[#FFE69A] opacity-40 animate-float-medium" style={{ animationDelay: '5.5s' }} />
      <div className="absolute top-[75%] right-[12%] w-5 h-5 rounded-full bg-[#92B4EC] opacity-50 animate-float-slow" style={{ animationDelay: '6.8s' }} />
      <div className="absolute top-[45%] right-[18%] w-2 h-2 rounded-full bg-[#FFE69A] opacity-70 animate-float-fast" style={{ animationDelay: '1.1s' }} />
      <div className="absolute top-[90%] right-[5%] w-6 h-6 rounded-full bg-[#92B4EC] opacity-30 animate-float-medium" style={{ animationDelay: '4.1s' }} />

      {/* Floating Particles - Center Region */}
      <div className="absolute top-[30%] left-[45%] w-3 h-3 rounded-full bg-[#FFE69A] opacity-50 animate-float-fast" style={{ animationDelay: '2.1s' }} />
      <div className="absolute top-[70%] left-[55%] w-4 h-4 rounded-full bg-[#92B4EC] opacity-40 animate-float-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[15%] left-[50%] w-5 h-5 rounded-full bg-[#FFE69A] opacity-30 animate-float-medium" style={{ animationDelay: '4.8s' }} />
      <div className="absolute top-[85%] left-[45%] w-2 h-2 rounded-full bg-[#92B4EC] opacity-60 animate-float-fast" style={{ animationDelay: '0.9s' }} />
      <div className="absolute top-[50%] left-[40%] w-3 h-3 rounded-full bg-[#FFE69A] opacity-50 animate-float-slow" style={{ animationDelay: '3.4s' }} />
      <div className="absolute top-[40%] left-[60%] w-4 h-4 rounded-full bg-[#92B4EC] opacity-45 animate-float-medium" style={{ animationDelay: '2.7s' }} />
      <div className="absolute top-[20%] left-[40%] w-6 h-6 rounded-full bg-[#92B4EC] opacity-35 animate-float-slow" style={{ animationDelay: '5.9s' }} />
      <div className="absolute top-[60%] left-[50%] w-2 h-2 rounded-full bg-[#FFE69A] opacity-80 animate-float-fast" style={{ animationDelay: '7.2s' }} />
      <div className="absolute top-[75%] left-[35%] w-5 h-5 rounded-full bg-[#92B4EC] opacity-40 animate-float-medium" style={{ animationDelay: '1.4s' }} />
      <div className="absolute top-[5%] left-[60%] w-4 h-4 rounded-full bg-[#FFE69A] opacity-50 animate-float-slow" style={{ animationDelay: '3.3s' }} />
      
      {/* Floating Particles - Extra Scattered */}
      <div className="absolute top-[12%] right-[45%] w-4 h-4 rounded-full bg-[#FFE69A] opacity-45 animate-float-medium" style={{ animationDelay: '8.1s' }} />
      <div className="absolute top-[88%] right-[35%] w-3 h-3 rounded-full bg-[#92B4EC] opacity-55 animate-float-fast" style={{ animationDelay: '9.5s' }} />
      <div className="absolute top-[42%] right-[55%] w-5 h-5 rounded-full bg-[#FFE69A] opacity-35 animate-float-slow" style={{ animationDelay: '10.2s' }} />
      <div className="absolute top-[92%] left-[65%] w-2 h-2 rounded-full bg-[#92B4EC] opacity-75 animate-float-medium" style={{ animationDelay: '11.8s' }} />
      <div className="absolute top-[28%] left-[75%] w-6 h-6 rounded-full bg-[#FFE69A] opacity-25 animate-float-slow" style={{ animationDelay: '7.7s' }} />
      <div className="absolute top-[58%] right-[70%] w-4 h-4 rounded-full bg-[#92B4EC] opacity-40 animate-float-fast" style={{ animationDelay: '8.9s' }} />
      <div className="absolute top-[3%] left-[30%] w-3 h-3 rounded-full bg-[#FFE69A] opacity-60 animate-float-medium" style={{ animationDelay: '12.1s' }} />
      <div className="absolute top-[97%] right-[60%] w-5 h-5 rounded-full bg-[#92B4EC] opacity-45 animate-float-slow" style={{ animationDelay: '13.5s' }} />
    </div>
  );
}
