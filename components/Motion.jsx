"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // ---- hero intro ----
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".nav > *", { y: -20, opacity: 0, stagger: 0.08, duration: 0.6 })
        .from(".hero-photo", { xPercent: -10, opacity: 0, duration: 1.1 }, "<")
        .from(".hero-card", { y: 70, opacity: 0, scale: 0.88, duration: 0.9 }, "-=0.6")
        .from(".hero .badge", { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2)" }, "-=0.5")
        .from(".hero-rating", { y: 30, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-checks span", { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.4");

      gsap.to(".badge svg.spin", { rotation: 360, duration: 12, repeat: -1, ease: "none", transformOrigin: "50% 50%" });

      // hero parallax on scroll
      gsap.to(".hero-photo", {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-canvas", {
        yPercent: -8, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // ---- generic reveals ----
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 50, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      // ---- benefits ----
      gsap.from(".benefit", {
        y: 140, opacity: 0, rotation: 0, stagger: 0.12, duration: 1, ease: "back.out(1.3)",
        scrollTrigger: { trigger: ".benefits", start: "top 85%" },
      });

      // ---- Scroll-controlled Ashwagandha copy: each item appears as the user scrolls ----
      // Pin the row after the hand is visible; text progression is tied to scroll progress.
      const ashwaSteps = gsap.utils.toArray(".ashwa-copy [data-ashwa-step]");
      if (ashwaSteps.length) {
        gsap.set(ashwaSteps, { y: 24, opacity: 0 });
        const ashwaTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".prow.l",
            // Wait until the hand/bottle landing point reaches the viewport center.
            // This prevents pinning while the hand is still travelling upward.
            start: "center center",
            end: "+=1200",
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        ashwaTimeline.to(ashwaSteps, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 1.15,
          ease: "none",
        });
      }

      // ---- Scroll-controlled Limitless Man Max copy, matching Ashwagandha ----
      const manSteps = gsap.utils.toArray(".man-copy [data-ashwa-step]");
      if (manSteps.length) {
        gsap.set(manSteps, { y: 24, opacity: 0 });
        const manTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".prow.r:has(.man-copy)",
            start: "center center",
            end: "+=1200",
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        manTimeline.to(manSteps, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 1.15,
          ease: "none",
        });
      }

      // ---- Limitless Woman: reveal copy, swap the hand image, then move only the bottle ----
      const womenRow = document.querySelector(".prow.l:has(.women-copy)");
      const womenSteps = gsap.utils.toArray(".women-copy [data-women-step]");
      if (womenRow && womenSteps.length) {
        const fullHand = womenRow.querySelector("[data-women-hand-full]");
        const emptyHand = womenRow.querySelector("[data-women-hand-empty]");
        const floatingBottle = womenRow.querySelector("[data-women-bottle]");

        gsap.set(womenSteps, { y: 24, opacity: 0 });
        gsap.set(fullHand, { opacity: 1 });
        gsap.set(emptyHand, { opacity: 0 });
        gsap.set(floatingBottle, { opacity: 0, x: 0, y: 0, transformOrigin: "50% 50%" });

        const womenTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".prow.l:has(.women-copy)",
            start: "center center",
            end: "+=3600",
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        womenTimeline
          .to(womenSteps, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 1.15,
            ease: "none",
          })
          .to(fullHand, { opacity: 0, duration: 0.35, ease: "none" }, "+=0.15")
          .to(emptyHand, { opacity: 1, duration: 0.35, ease: "none" }, "<")
          .to(floatingBottle, { opacity: 1, duration: 0.35, ease: "none" }, "<")
          .to(floatingBottle, {
            x: "-32vw",
            y: "75vh",
            scale: 0.78,
            duration: 2.6,
            ease: "none",
          }, "+=0.1");
      }

      // ---- products ----
      gsap.utils.toArray("[data-float]").forEach((el, i) => {
        gsap.from(el, {
          y: 90, opacity: 0, rotation: i % 2 ? 12 : -12, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
        gsap.to(el, { y: -14, duration: 2.2 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });
      });
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 10;
        gsap.fromTo(el, { yPercent: -amt }, {
          yPercent: amt, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // ---- compare ----
      gsap.from("[data-compare-bottle]", {
        scale: 0.6, opacity: 0, rotation: (i) => (i ? 15 : -15), duration: 1, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".compare .grid", start: "top 80%" },
      });
      gsap.from("[data-pill='l']", {
        x: -50, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".compare .grid", start: "top 75%" },
      });
      gsap.from("[data-pill='r']", {
        x: 50, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".compare .grid", start: "top 75%" },
      });
      gsap.from(".col .tag", {
        scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(2)",
        scrollTrigger: { trigger: ".compare .grid", start: "top 80%" },
      });

      // ---- reviews ----
      gsap.from(".vcard", {
        y: 80, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".cards", start: "top 88%" },
      });

      // ---- footer mega text ----
      gsap.from("[data-mega]", {
        yPercent: 100, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: "footer", start: "top 70%" },
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
