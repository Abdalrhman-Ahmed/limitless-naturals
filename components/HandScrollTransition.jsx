"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HandScrollTransition() {
  const root = useRef(null);

  useEffect(() => {
    const overlay = root.current;
    const hero = document.querySelector(".hero");
    const products = document.querySelector(".prow.l");
    const canvas = hero?.querySelector(".hero-canvas");
    const bottle = overlay?.querySelector(".travel-bottle");
    const hand = products?.querySelector(".hand");
    if (!overlay || !hero || !products || !canvas || !bottle || !hand) return;

    // Keep the travelling packshot synchronized with the hero product asset.
    const getPositions = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const handRect = hand.getBoundingClientRect();
      const mobile = window.matchMedia("(max-width: 600px)").matches;

      // Match the visual height of the product plane in Hero3D.
      const startHeight = Math.min(canvasRect.height * (mobile ? 0.74 : 0.83), mobile ? 310 : 500);
      const startWidth = startHeight * 0.43;
      const endWidth = Math.min(handRect.width * (mobile ? 0.25 : 0.28), mobile ? 82 : 112);
      const start = {
        x: canvasRect.left + canvasRect.width * (mobile ? 0.5 : 0.5) - startWidth / 2,
        y: canvasRect.top + canvasRect.height * 0.5 - startHeight / 2,
        width: startWidth,
        height: startHeight,
      };
      const end = {
        x: handRect.left + handRect.width * 0.26,
        y: handRect.top + handRect.height * 0.12,
        width: endWidth,
        height: endWidth * 2.35,
      };
      return { start, end };
    };

    let positions = getPositions();
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          endTrigger: products,
          end: "center center",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: () => { positions = getPositions(); },
        },
      });

      timeline.set(overlay, { autoAlpha: 0 }, 0);
      timeline.to(overlay, { autoAlpha: 1, duration: 0.025, ease: "none" }, 0.01);
      timeline.set(bottle, {
        left: () => positions.start.x,
        top: () => positions.start.y,
        width: () => positions.start.width,
        height: () => positions.start.height,
        opacity: 1,
      }, 0);
      timeline.to(bottle, {
        left: () => positions.end.x,
        top: () => positions.end.y,
        width: () => positions.end.width,
        height: () => positions.end.height,
        ease: "none",
      }, 0);
      timeline.to(bottle, { opacity: 0, ease: "none" }, 0.94);
    }, overlay);

    const onResize = () => {
      positions = getPositions();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div className="hand-scroll-transition" ref={root} aria-hidden="true">
      <img className="travel-bottle" src="/images/ashwagandha.png" alt="" />
    </div>
  );
}
