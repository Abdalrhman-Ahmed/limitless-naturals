"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

/* ------------------------------------------------------------------
   Scroll-driven bottle

   The canvas is fixed to the viewport. On load the bottle sits in the
   hero. While you scroll it glides down to the empty hand in the
   "Find Your Daily Formula" section ([data-bottle-slot]) and, once it
   lands, crossfades into the full "hand holding the bottle" photo.
   ------------------------------------------------------------------ */

// ---- tuning knobs ----
const LAND_AT = 0.5;    // bottle lands when the slot centre is at this fraction of the viewport height (0 = top, 1 = bottom)
const LAND_TILT = 0;    // bottle tilt (radians) at landing; match the bottle in your hand photo
const FADE_FROM = 0.88; // scroll progress where the 3D bottle starts crossfading into the photo
const FIT = 0.94;       // size compensation: the front of the bottle is closer to the camera than its centre

// ---- fixed geometry facts ----
const FOV = 32;
const CAM_Z = 11;
const VIS_H = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360); // world units visible at z = 0
const MODEL_H = 3.755;   // bottle height including the cap
const MODEL_CY = 0.2775; // vertical centre of the bottle model

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

function makeLabelTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#2f4a38";
  g.fillRect(0, 0, c.width, c.height);
  g.textAlign = "center";
  g.fillStyle = "rgba(232,217,176,.65)";
  g.font = "500 22px sans-serif";
  g.fillText("RADIANCE+", 512, 120);
  g.font = "400 14px sans-serif";
  g.fillText("ADVANCED REPAIR", 512, 148);
  g.fillStyle = "#e8d9b0";
  g.font = "600 64px sans-serif";
  g.fillText("VIDA GLOW", 512, 290);
  g.fillStyle = "rgba(232,217,176,.5)";
  g.font = "400 16px sans-serif";
  g.fillText("DIETARY SUPPLEMENT  ·  30 CAPSULES", 512, 400);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export default function Hero3D() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const hero = document.querySelector(".hero");
    const slot = document.querySelector("[data-bottle-slot]");
    const handEmpty = document.querySelector("[data-hand-empty]");
    const handFull = document.querySelector("[data-hand-full]");
    if (!hero) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x9be0ae, 25, 30);
    rim.position.set(-5, 2, -3);
    scene.add(rim);

    // ---------- bottle ----------
    // pivot (position + scale) > tilt (rotation) > bottle (model, re-centred on its middle)
    const pivot = new THREE.Group();
    const tilt = new THREE.Group();
    const bottle = new THREE.Group();
    bottle.position.y = -MODEL_CY;

    const profile = [
      [0, -1.6], [0.95, -1.6], [1.07, -1.5], [1.1, -1.3], [1.1, 0.95],
      [1.04, 1.15], [0.7, 1.28], [0.66, 1.4], [0, 1.4],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2f4a38, roughness: 0.35, metalness: 0.15 });
    bottle.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 64), bodyMat));

    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(1.115, 1.115, 1.7, 64, 1, true),
      new THREE.MeshStandardMaterial({ map: makeLabelTexture(), roughness: 0.55, metalness: 0.05 })
    );
    label.position.y = -0.15;
    label.rotation.y = Math.PI;
    bottle.add(label);

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.72, 0.75, 64),
      new THREE.MeshStandardMaterial({ color: 0xc9cdca, roughness: 0.25, metalness: 0.85 })
    );
    cap.position.y = 1.78;
    bottle.add(cap);

    tilt.add(bottle);
    pivot.add(tilt);
    scene.add(pivot);

    // ---------- capsules (stay with the hero and fade out as you scroll) ----------
    const capsuleGroup = new THREE.Group();
    scene.add(capsuleGroup);
    const capsules = [];
    const capGeo = new THREE.CapsuleGeometry(0.11, 0.32, 8, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x2a4a33, roughness: 0.3, metalness: 0.2, transparent: true });
    const spots = [
      [-2.0, 1.9, 0.5], [2.1, 2.4, -0.5], [2.3, 0.4, 0.8], [-1.9, -0.3, 1],
      [-2.3, -1.9, 0], [1.9, -2.3, 0.6], [0.2, 3.2, -1], [-0.6, -2.9, 1.2], [2.8, -0.9, -0.5],
    ];
    spots.forEach(([x, y, z]) => {
      const m = new THREE.Mesh(capGeo, capMat);
      m.position.set(x, y, z);
      m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      capsuleGroup.add(m);
      capsules.push(m);
      gsap.to(m.position, { y: y + 0.35 + Math.random() * 0.3, duration: 2 + Math.random() * 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: Math.random() });
      gsap.to(m.rotation, { x: m.rotation.x + 3, y: m.rotation.y + 2, duration: 8 + Math.random() * 6, repeat: -1, ease: "none" });
    });

    // ---------- intro ----------
    const intro = { v: 0.01 };
    gsap.to(intro, { v: 1, duration: 1.4, ease: "elastic.out(1,0.6)", delay: 0.6 });
    capsules.forEach((c, i) => {
      const s = c.scale.x;
      c.scale.setScalar(0.01);
      gsap.to(c.scale, { x: s, y: s, z: s, duration: 0.8, ease: "back.out(2)", delay: 0.9 + i * 0.07 });
    });

    // ---------- pointer ----------
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    // ---------- size ----------
    let W = 1;
    let H = 1;
    const resize = () => {
      W = el.clientWidth || 1;
      H = el.clientHeight || 1;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // ---------- scroll progress: 0 = in the hero, 1 = landed in the hand ----------
    const progress = () => {
      if (reduce || !slot) return 0;
      const r = slot.getBoundingClientRect();
      const slotDocY = r.top + window.scrollY + r.height / 2;
      const land = slotDocY - H * LAND_AT; // scrollY at which the slot centre sits at LAND_AT
      return land > 1 ? clamp(window.scrollY / land) : 0;
    };
    let sm = progress(); // smoothed progress

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();

      const goal = progress();
      sm += (goal - sm) * 0.14;
      if (Math.abs(goal - sm) < 0.0004) sm = goal;
      const e = smooth(sm);

      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;

      // px -> world units on the z = 0 plane
      const ppu = H / VIS_H;
      const toX = (px) => (px - W / 2) / ppu;
      const toY = (py) => -(py - H / 2) / ppu;

      // where the bottle starts: the middle of the old hero canvas (live, so it scrolls with the hero)
      const mobile = window.innerWidth <= 900;
      const hr = hero.getBoundingClientRect();
      const canvasH = mobile ? hr.height * 0.55 : hr.height;
      const sx = hr.left + hr.width * (mobile ? 0.5 : 0.72);
      const sy = hr.top + hr.height * (mobile ? 0.725 : 0.5);
      const startH = (canvasH * MODEL_H) / VIS_H;

      // where it ends: the landing slot (live as well)
      let cx = sx;
      let cy = sy;
      let ph = startH;
      if (slot) {
        const r = slot.getBoundingClientRect();
        cx = sx + (r.left + r.width / 2 - sx) * e;  // eased sideways glide
        cy = sy + (r.top + r.height / 2 - sy) * sm; // linear vertically: it stays near the same screen height while the page scrolls
        ph = startH + (r.height - startH) * e;      // grows / shrinks to the slot size
      }

      pivot.position.set(toX(cx), toY(cy) + Math.sin(t * 0.9) * 0.12 * (1 - e), 0);
      pivot.scale.setScalar((ph / (MODEL_H * ppu)) * FIT * intro.v);

      // idle sway fades out, one full spin during the trip, ends facing front
      tilt.rotation.y = (Math.sin(t * 0.6) * 0.35 + mouse.x * 0.5) * (1 - e) + Math.PI * 2 * e;
      tilt.rotation.x = (0.12 + mouse.y * 0.15) * (1 - e);
      tilt.rotation.z = -0.28 * (1 - e) + LAND_TILT * e;

      camera.position.x = mouse.x * 0.4 * (1 - e);
      camera.position.y = -mouse.y * 0.3 * (1 - e);
      camera.lookAt(0, 0, 0);

      // capsules follow the hero and fade out early in the scroll
      capsuleGroup.position.set(toX(sx), toY(sy), 0);
      capsuleGroup.scale.setScalar(canvasH / H);
      const fade = 1 - clamp(sm * 3);
      capMat.opacity = fade;
      capsuleGroup.visible = fade > 0.01;

      // crossfade 3D bottle -> full photo (only if the hand is visible and the photo actually loaded)
      const fullImg = handFull && handFull.querySelector("img");
      const handShown = !!(handFull && handFull.offsetParent !== null && fullImg && fullImg.complete && fullImg.naturalWidth > 0);
      const kf = reduce ? 1 : smooth(clamp((sm - FADE_FROM) / (1 - FADE_FROM)));
      const fk = handShown ? kf : 0;
      if (handFull) handFull.style.opacity = String(fk);
      if (handEmpty) handEmpty.style.opacity = String(1 - fk);

      const canvasOpacity = reduce ? 1 : 1 - fk;
      el.style.opacity = String(canvasOpacity);
      if (canvasOpacity > 0.003) renderer.render(scene, camera);

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      gsap.killTweensOf(intro);
      capsules.forEach((c) => { gsap.killTweensOf(c.position); gsap.killTweensOf(c.rotation); gsap.killTweensOf(c.scale); });
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-canvas" ref={mount} aria-hidden="true" />;
}
