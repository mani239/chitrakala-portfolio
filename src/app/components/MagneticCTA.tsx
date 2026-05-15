'use client';

import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";

const MAGNETIC_RADIUS = 80;

export default function MagneticCTA() {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const overlayRef = useRef<HTMLSpanElement | null>(null);
  const pointerInsideRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (coarsePointer || reducedMotion) {
      return;
    }

    const resetButton = () => {
      pointerInsideRef.current = false;
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power4.out",
        overwrite: true,
      });
    };

    const updateMagnet = (clientX: number, clientY: number) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance <= MAGNETIC_RADIUS) {
        pointerInsideRef.current = true;
        const strength = 1 - distance / MAGNETIC_RADIUS;
        const x = distanceX * strength * 0.28;
        const y = distanceY * strength * 0.28;
        const scale = 1 + strength * 0.05;

        gsap.to(button, {
          x,
          y,
          scale,
          duration: 0.22,
          ease: "power3.out",
          overwrite: true,
        });
        return;
      }

      if (pointerInsideRef.current) {
        resetButton();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = window.requestAnimationFrame(() => {
        updateMagnet(event.clientX, event.clientY);
      });
    };

    const onPointerLeave = () => {
      resetButton();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", resetButton);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", resetButton);
      gsap.killTweensOf(button);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="group relative inline-flex isolate overflow-hidden rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-md transition-transform duration-300 ease-out will-change-transform hover:border-white/30 hover:shadow-[0_26px_60px_rgba(0,0,0,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      aria-label="Book a Consultation"
    >
      <span
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 translate-y-full bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-0"
      />
      <span className="relative z-10 flex items-center gap-3">
        <span>Book a Consultation</span>
        <span className="text-lg leading-none transition-transform duration-300 ease-out group-hover:translate-x-1">
          →
        </span>
      </span>
    </button>
  );
}
