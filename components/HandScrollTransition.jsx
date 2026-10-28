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
    const emptyHand = products?.querySelector(".hand img");
    const canvas = hero?.querySelector(".hero-canvas");
    const bottle = overlay?.querySelector(".travel-bottle");
    const heldHand = overlay?.querySelector(".hand-held");
    if (!overlay || !hero || !products || !emptyHand || !canvas || !bottle || !heldHand) return;

    const setPositions = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const handRect = emptyHand.getBoundingClientRect();
      const startWidth = Math.min(window.innerWidth * 0.22, 210);
      const endWidth = handRect.width;
      const start = {
        x: canvasRect.left + canvasRect.width * 0.48 - startWidth / 2,
        y: canvasRect.top + canvasRect.height * 0.42 - startWidth * 0.9,
        width: startWidth,
      };
      const end = {
        x: handRect.left,
        y: handRect.top,
        width: endWidth,
      };

      gsap.set(bottle, { left: start.x, top: start.y, width: start.width, height: start.width * 1.8 });
      gsap.set(heldHand, { left: end.x, top: end.y, width: end.width, height: handRect.height, opacity: 0 });
      return { start, end, handRect };
    };

    let positions = setPositions();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          endTrigger: products,
          end: "center center",
          scrub: 0.7,
          invalidateOnRefresh: true,
          onRefresh: () => { positions = setPositions(); },
        },
      });

      tl.to(overlay, { opacity: 1, duration: 0.08 }, 0.28);
      tl.to(bottle, {
        left: () => positions.end.x + positions.end.width * 0.34,
        top: () => positions.end.y + positions.handRect.height * 0.12,
        width: () => Math.min(positions.end.width * 0.28, 100),
        height: () => Math.min(positions.end.width * 0.28, 100) * 1.8,
        ease: "none",
      }, 0.15);
      tl.to(bottle, { opacity: 0, ease: "none" }, 0.88);
      tl.to(heldHand, { opacity: 1, ease: "none" }, 0.88);
      tl.to(emptyHand, { opacity: 0, ease: "none" }, 0.88);
      tl.to(overlay, { opacity: 0, duration: 0.04 }, 0.99);
    }, overlay);

    const onResize = () => {
      positions = setPositions();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div className="hand-scroll-transition" ref={root} aria-hidden="true">
      <img className="travel-bottle" src="/images/ashwagandha.png" alt="" />
      <img className="hand-held" src="/images/handashwa.png" alt="" />
    </div>
  );
}
