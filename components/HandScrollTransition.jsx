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

    const measure = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const handRect = emptyHand.getBoundingClientRect();
      const startWidth = Math.min(window.innerWidth * 0.23, 420);
      const endWidth = Math.min(handRect.width * 0.28, 100);
      const endScroll = window.scrollY + products.getBoundingClientRect().top
        + products.getBoundingClientRect().height / 2 - window.innerHeight / 2;
      const handDocumentTop = window.scrollY + handRect.top;
      const handDocumentLeft = window.scrollX + handRect.left;
      const targetViewportTop = handDocumentTop - endScroll + handRect.height * 0.08;
      const targetViewportLeft = handDocumentLeft - window.scrollX + handRect.width * 0.34;

      const start = {
        x: canvasRect.left + canvasRect.width * 0.48 - startWidth / 2,
        y: canvasRect.top + canvasRect.height * 0.45 - startWidth * 0.9,
        width: startWidth,
      };
      const end = { x: targetViewportLeft, y: targetViewportTop, width: endWidth };
      gsap.set(bottle, { left: start.x, top: start.y, width: start.width, height: start.width * 1.8 });
      gsap.set(heldHand, {
        left: targetViewportLeft - handRect.width * 0.1,
        top: targetViewportTop - handRect.height * 0.08,
        width: handRect.width,
        height: handRect.height,
        opacity: 0,
      });
      return { start, end, handRect };
    };

    let positions = measure();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          endTrigger: products,
          end: "center center",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: () => { positions = measure(); },
        },
      });

      tl.set(overlay, { opacity: 0 }, 0);
      tl.to(overlay, { opacity: 1, duration: 0.035, ease: "none" }, 0.015);
      tl.to(bottle, {
        left: () => positions.end.x,
        top: () => positions.end.y,
        width: () => positions.end.width,
        height: () => positions.end.width * 1.8,
        ease: "none",
      }, 0);
      tl.to(bottle, { opacity: 0, ease: "none" }, 0.94);
      tl.to(heldHand, { opacity: 1, ease: "none" }, 0.94);
      // Keep the final held-bottle image visible after the transition.
      // Do not fade the overlay out at the end of the timeline.
    }, overlay);

    const onResize = () => {
      positions = measure();
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
