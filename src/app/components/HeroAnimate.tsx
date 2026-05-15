'use client';

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type HeroAnimateProps = {
  videoUrl: string;
  title?: string;
};

export default function HeroAnimate({
  videoUrl,
  title = "WE CRAFT CINEMA",
}: HeroAnimateProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const maskRef = useRef<SVGSVGElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !titleRef.current || !maskRef.current || !videoRef.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set([titleRef.current, maskRef.current, videoRef.current], {
        transformOrigin: "50% 50%",
        force3D: true,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=180%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: "none",
        },
      });

      timeline
        .to(
          titleRef.current,
          {
            scale: 1.38,
            opacity: 0.08,
          },
          0,
        )
        .to(
          maskRef.current,
          {
            scale: 1.38,
          },
          0,
        )
        .to(
          videoRef.current,
          {
            scale: 1.08,
          },
          0,
        );
    }, sectionRef);

    return () => context.revert();
  }, []);

  const videoMaskStyle: CSSProperties = {
    WebkitMask: "url(#hero-title-mask)",
    mask: "url(#hero-title-mask)",
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-screen overflow-hidden bg-neutral-950 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_60%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,7,0.15),rgba(5,5,7,0.7))]" />

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" style={videoMaskStyle}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover object-center transform-gpu will-change-transform"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_45%)] mix-blend-screen opacity-40" />
      </div>

      <svg
        ref={maskRef}
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      >
        <defs>
          <mask id="hero-title-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: "clamp(4rem, 16vw, 15rem)",
                fontWeight: 900,
                letterSpacing: "-0.08em",
              }}
            >
              {title}
            </text>
          </mask>
        </defs>
      </svg>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          className="max-w-[14ch] text-balance text-6xl font-black uppercase tracking-[-0.08em] text-white sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]"
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
