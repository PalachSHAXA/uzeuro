import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device has fine pointer (desktop)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Check for hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, [data-cursor-hover]');
      setIsHovering(!!isHoverable);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let rafId: number;
    const animate = () => {
      // Smooth follow for main cursor
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      // Faster follow for dot
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;

      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0)`;
      }
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${dotX - 4}px, ${dotY - 4}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Hide on non-desktop devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div
          className={`w-full h-full rounded-full border-2 border-white transition-all duration-300 ${
            isHovering ? 'scale-150 bg-white/10' : 'scale-100'
          }`}
        />
      </div>
      
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] transition-all duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div
          className={`w-full h-full rounded-full bg-white transition-all duration-200 ${
            isHovering ? 'scale-0' : 'scale-100'
          }`}
        />
      </div>
    </>
  );
}
