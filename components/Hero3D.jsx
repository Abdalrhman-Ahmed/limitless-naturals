"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

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

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x9be0ae, 25, 30);
    rim.position.set(-5, 2, -3);
    scene.add(rim);

    // ---------- bottle ----------
    const bottle = new THREE.Group();
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
    bottle.rotation.z = -0.28;
    bottle.rotation.x = 0.12;
    scene.add(bottle);

    // ---------- capsules ----------
    const capsules = [];
    const capGeo = new THREE.CapsuleGeometry(0.11, 0.32, 8, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x2a4a33, roughness: 0.3, metalness: 0.2 });
    const spots = [
      [-2.0, 1.9, 0.5], [2.1, 2.4, -0.5], [2.3, 0.4, 0.8], [-1.9, -0.3, 1],
      [-2.3, -1.9, 0], [1.9, -2.3, 0.6], [0.2, 3.2, -1], [-0.6, -2.9, 1.2], [2.8, -0.9, -0.5],
    ];
    spots.forEach(([x, y, z]) => {
      const m = new THREE.Mesh(capGeo, capMat);
      m.position.set(x, y, z);
      m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      scene.add(m);
      capsules.push(m);
      gsap.to(m.position, { y: y + 0.35 + Math.random() * 0.3, duration: 2 + Math.random() * 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: Math.random() });
      gsap.to(m.rotation, { x: m.rotation.x + 3, y: m.rotation.y + 2, duration: 8 + Math.random() * 6, repeat: -1, ease: "none" });
    });

    // ---------- intro ----------
    bottle.scale.setScalar(0.01);
    gsap.to(bottle.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: "elastic.out(1,0.6)", delay: 0.6 });
    capsules.forEach((c, i) => {
      const s = c.scale.x;
      c.scale.setScalar(0.01);
      gsap.to(c.scale, { x: s, y: s, z: s, duration: 0.8, ease: "back.out(2)", delay: 0.9 + i * 0.07 });
    });

    // ---------- pointer / scroll ----------
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      bottle.rotation.y = Math.sin(t * 0.6) * 0.35 + mouse.x * 0.5;
      bottle.position.y = Math.sin(t * 0.9) * 0.12;
      bottle.rotation.x = 0.12 + mouse.y * 0.15;
      camera.position.x = mouse.x * 0.4;
      camera.position.y = -mouse.y * 0.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      gsap.killTweensOf(bottle.scale);
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
