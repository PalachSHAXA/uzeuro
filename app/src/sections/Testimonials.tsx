import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Dilshod Kadyrov',
    role: 'Partner at Kadyrov & Associates',
    avatar: '/avatar-dilshod.jpg',
    quote: 'UZEURO has been instrumental in expanding our international practice. The networking opportunities are unmatched, and the knowledge sharing has elevated our entire team.',
  },
  {
    id: 2,
    name: 'Anna Schmidt',
    role: 'Legal Advisor, EU Delegation',
    avatar: '/avatar-anna.jpg',
    quote: 'The association bridges gaps I did not even know existed. Truly transformative for EU-Uzbek legal cooperation and understanding between our jurisdictions.',
  },
  {
    id: 3,
    name: 'Prof. Michael Chen',
    role: 'Tashkent State University of Law',
    avatar: '/avatar-michael.jpg',
    quote: 'My students have gained invaluable insights through UZEURO webinar series. The access to European legal expertise has broadened their perspectives immensely.',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (carouselRef.current) {
        gsap.fromTo(
          carouselRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: carouselRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + testimonials.length) % testimonials.length);
    
    if (normalizedDiff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 10,
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -2) {
      return {
        transform: 'translateX(60%) scale(0.85) rotateY(-15deg)',
        opacity: 0.5,
        zIndex: 5,
      };
    } else {
      return {
        transform: 'translateX(-60%) scale(0.85) rotateY(15deg)',
        opacity: 0.5,
        zIndex: 5,
      };
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-eu-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-eu-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="section-label">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-eu-dark">
            What Our <span className="text-eu-blue">Members</span> Say
          </h2>
        </div>

        {/* 3D Carousel */}
        <div
          ref={carouselRef}
          className="relative max-w-3xl mx-auto"
          style={{ perspective: '1000px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-[400px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="absolute w-full max-w-xl transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  ...getCardStyle(index),
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="glass-card rounded-3xl p-8 text-center">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-eu-blue/10 flex items-center justify-center">
                    <Quote className="w-6 h-6 text-eu-blue" />
                  </div>

                  {/* Quote Text */}
                  <blockquote className="text-eu-dark text-lg leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-eu-blue/20 mb-4"
                    />
                    <div className="font-heading font-semibold text-eu-dark">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-eu-text-secondary">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={goToPrev}
              className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center text-eu-dark hover:bg-eu-blue hover:text-white transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-eu-blue'
                      : 'bg-eu-divider hover:bg-eu-blue/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center text-eu-dark hover:bg-eu-blue hover:text-white transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
