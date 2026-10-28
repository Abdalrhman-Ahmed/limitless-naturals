"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HandScrollTransition() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const hero = el?.closest(".hero");
    if (!el || !hero) return;

    const emptyHand = el.querySelector(".hand-empty");
    const heldHand = el.querySelector(".hand-held");
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      timeline.to(el, { opacity: 1, ease: "none" }, 0.22);
      timeline.to(emptyHand, { opacity: 0, ease: "none" }, 0.58);
      timeline.to(heldHand, { opacity: 1, ease: "none" }, 0.58);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hand-scroll-transition" ref={root} aria-hidden="true">
      <img className="hand-empty" src="/images/hand.png" alt="" />
      <img className="hand-held" src="/images/handashwa.png" alt="" />
    </div>
  );
}
