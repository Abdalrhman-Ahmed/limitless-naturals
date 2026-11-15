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

      // =========================================================================
      // 1. Ashwagandha (Luna Balance): Hand holds bottle -> text reveals on scroll
      // =========================================================================
      const ashwaSteps = gsap.utils.toArray(".ashwa-copy [data-ashwa-step]");
      const ashwaRow = document.querySelector(".prow-ashwa");
      if (ashwaRow && ashwaSteps.length) {
        gsap.set(ashwaSteps, { y: 24, opacity: 0 });
        const ashwaTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ashwaRow,
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

      // =========================================================================
      // 2. Limitless Man Max: Hand holds bottle -> text reveals on scroll
      // =========================================================================
      const manSteps = gsap.utils.toArray(".man-copy [data-man-step]");
      const manRow = document.querySelector(".prow-man");
      if (manRow && manSteps.length) {
        gsap.set(manSteps, { y: 24, opacity: 0 });
        const manTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: manRow,
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

      // =========================================================================
      // 3. Limitless Woman:
      //    Step 1: Pinned text reveal with hand holding bottle
      //    Step 2: Swap to empty hand at end of text -> UNPIN!
      //    Step 3: User descends down page with the bottle into Compare!
      // =========================================================================
      const womenRow = document.querySelector(".prow-woman");
      const womenSteps = gsap.utils.toArray(".women-copy [data-women-step]");
      const womenHandFull = womenRow?.querySelector("[data-women-hand-full]");
      const womenHandEmpty = womenRow?.querySelector("[data-women-hand-empty]");
      const travelBottle = document.querySelector("[data-travel-woman-bottle]");
      const compareSection = document.querySelector(".compare");
      const compareBottle = document.querySelector("[data-compare-woman-bottle]");

      if (womenRow && womenSteps.length && womenHandFull && womenHandEmpty && travelBottle) {
        // Initial setup
        gsap.set(womenSteps, { y: 24, opacity: 0 });
        gsap.set(womenHandFull, { autoAlpha: 1 });
        gsap.set(womenHandEmpty, { autoAlpha: 0 });
        gsap.set(travelBottle, { autoAlpha: 0, position: "fixed", zIndex: 99 });
        if (compareBottle) gsap.set(compareBottle, { autoAlpha: 0 });

        // Step 1 & 2: Text reveal pin (unpins immediately after text finishes!)
        const womenPinTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: womenRow,
            start: "center center",
            end: "+=650",
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onLeaveBack: () => {
              gsap.set(womenHandFull, { autoAlpha: 1 });
              gsap.set(womenHandEmpty, { autoAlpha: 0 });
              gsap.set(womenSteps, { y: 24, opacity: 0 });
              gsap.set(travelBottle, { autoAlpha: 0 });
              if (compareBottle) gsap.set(compareBottle, { autoAlpha: 0 });
            },
          },
        });

        // Reveal texts step-by-step
        womenPinTimeline.to(
          womenSteps,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.18,
            ease: "none",
          },
          0
        );

        // At end of text, swap to empty hand
        womenPinTimeline.to(
          womenHandFull,
          { autoAlpha: 0, duration: 0.1, ease: "none" },
          0.85
        );
        womenPinTimeline.to(
          womenHandEmpty,
          { autoAlpha: 1, duration: 0.1, ease: "none" },
          0.85
        );

        // Step 3: Descend with the bottle! (NO PIN! Natural page scroll!)
        let startX = 0, startY = 0, startW = 180;

        const updateStartCoords = () => {
          const handFrame = womenRow.querySelector(".hand-inner-frame") || womenRow.querySelector(".women-hand");
          const handRect = handFrame ? handFrame.getBoundingClientRect() : null;
          if (handRect) {
            startW = Math.round(handRect.width * 0.44);
            startX = Math.round(handRect.left + handRect.width * 0.47);
            startY = Math.round(handRect.top + handRect.height * 0.1);
          } else {
            startW = 180;
            startX = Math.round(window.innerWidth * 0.18);
            startY = Math.round(window.innerHeight * 0.35);
          }
        };

        ScrollTrigger.create({
          trigger: compareSection || ".compare",
          start: "top bottom",
          end: "top 18%",
          scrub: 0.4,
          onEnter: () => {
            updateStartCoords();
            gsap.set(travelBottle, { autoAlpha: 1 });
            if (compareBottle) gsap.set(compareBottle, { autoAlpha: 0 });
          },
          onLeave: () => {
            gsap.set(travelBottle, { autoAlpha: 0 });
            if (compareBottle) gsap.set(compareBottle, { autoAlpha: 1 });
          },
          onEnterBack: () => {
            updateStartCoords();
            gsap.set(travelBottle, { autoAlpha: 1 });
            if (compareBottle) gsap.set(compareBottle, { autoAlpha: 0 });
          },
          onLeaveBack: () => {
            gsap.set(travelBottle, { autoAlpha: 0 });
            if (compareBottle) gsap.set(compareBottle, { autoAlpha: 0 });
          },
          onUpdate: (self) => {
            const p = self.progress;
            const targetRect = compareBottle ? compareBottle.getBoundingClientRect() : null;

            const endX = targetRect ? targetRect.left : startX;
            const endY = targetRect ? targetRect.top : startY + 400;
            const endW = targetRect ? targetRect.width : startW;

            const curX = startX + (endX - startX) * p;
            const curY = startY + (endY - startY) * p;
            const curW = startW + (endW - startW) * p;
            const curRot = 8 * p;

            gsap.set(travelBottle, {
              left: curX,
              top: curY,
              width: curW,
              height: "auto",
              rotation: curRot,
              transformOrigin: "50% 50%",
              autoAlpha: 1,
            });
          },
        });
      }

      // ---- products float & parallax ----
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

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return null;
}
