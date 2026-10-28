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
    const handImage = hand?.querySelector("img");
    if (!overlay || !hero || !products || !canvas || !bottle || !hand || !handImage) return;

    // Reuse the exact bottle image already used by the WebGL hero.
    const heroBottleTexture = "/images/ashwagandha.png";
    bottle.src = heroBottleTexture;

    const getPositions = () => {
      const heroRect = canvas.getBoundingClientRect();
      const handRect = hand.getBoundingClientRect();
      const scrollTo = window.scrollY + products.getBoundingClientRect().top
        + products.getBoundingClientRect().height / 2 - window.innerHeight / 2;

      const startHeight = Math.min(heroRect.height * 0.86, 520);
      const startWidth = startHeight * 0.42;
      const endWidth = Math.min(handRect.width * 0.3, 120);
      const start = {
        x: heroRect.left + heroRect.width * 0.5 - startWidth / 2,
        y: heroRect.top + heroRect.height * 0.5 - startHeight / 2,
        width: startWidth,
        height: startHeight,
      };
      const end = {
        x: handRect.left + handRect.width * 0.27,
        y: handRect.top + handRect.height * 0.14,
        width: endWidth,
        height: endWidth * 2.35,
      };
      return { start, end, scrollTo };
    };

    let positions = getPositions();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
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

      tl.set(overlay, { opacity: 0 }, 0);
      tl.to(overlay, { opacity: 1, duration: 0.03, ease: "none" }, 0.01);
      tl.set(bottle, {
        left: () => positions.start.x,
        top: () => positions.start.y,
        width: () => positions.start.width,
        height: () => positions.start.height,
      }, 0);
      tl.to(bottle, {
        left: () => positions.end.x,
        top: () => positions.end.y,
        width: () => positions.end.width,
        height: () => positions.end.height,
        ease: "none",
      }, 0);
      tl.to(bottle, { opacity: 0, ease: "none" }, 0.94);
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
