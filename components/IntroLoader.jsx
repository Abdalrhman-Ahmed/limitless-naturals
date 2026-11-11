"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const criticalImages = ["/images/hero-woman.jpg", "/images/ashwagandha.png"];

export default function IntroLoader() {
  const overlayRef = useRef(null);
  const wordRef = useRef(null);
  const lineRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let finished = false;
    const startedAt = performance.now();
    const minimumTime = 1100;
    const maximumTime = 4200;

    const animateIn = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (!reduceMotion) {
      animateIn
        .fromTo(".intro-kicker", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 })
        .fromTo(".intro-letter", { yPercent: 115, rotateX: -65 }, {
          yPercent: 0, rotateX: 0, duration: 0.9, stagger: 0.055,
        }, "-=0.2")
        .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, "-=0.35")
        .fromTo(".intro-caption", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");
    } else {
      gsap.set(overlay, { opacity: 1 });
    }

    const loadImage = (src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = async () => {
        try { if (image.decode) await image.decode(); } catch {}
        resolve();
      };
      image.onerror = resolve;
      image.src = src;
      if (image.complete) resolve();
    });

    const imagesReady = Promise.all(criticalImages.map(loadImage));
    const minDelay = new Promise((resolve) => window.setTimeout(resolve, minimumTime));

    const closeIntro = async () => {
      await Promise.race([
        Promise.all([imagesReady, minDelay]),
        new Promise((resolve) => window.setTimeout(resolve, maximumTime)),
      ]);
      if (cancelled || finished) return;
      finished = true;
      if (progressRef.current) progressRef.current.style.transform = "scaleX(1)";
      if (reduceMotion) {
        overlay.remove();
        return;
      }
      gsap.timeline({ onComplete: () => overlay.remove() })
        .to(".intro-inner", { y: -18, opacity: 0, duration: 0.35, ease: "power2.in" })
        .to(overlay, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "-=0.05");
    };

    closeIntro();

    return () => {
      cancelled = true;
      animateIn.kill();
    };
  }, []);

  return (
    <div className="intro-loader" ref={overlayRef} aria-label="Loading Limitless" role="status">
      <div className="intro-inner">
        <span className="intro-kicker">A DAILY RITUAL FOR YOUR WELLBEING</span>
        <div className="intro-word" ref={wordRef} aria-label="Limitless">
          {"LIMITLESS".split("").map((letter, index) => (
            <span className="intro-letter-wrap" key={index}>
              <span className="intro-letter">{letter}</span>
            </span>
          ))}
        </div>
        <div className="intro-rule"><span ref={lineRef} /></div>
        <p className="intro-caption">WELLNESS, WITHOUT LIMITS.</p>
        <div className="intro-progress"><span ref={progressRef} /></div>
      </div>
      <span className="intro-index">01 — 01</span>
    </div>
  );
}
