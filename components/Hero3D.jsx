"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Hero3D() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    let disposed = false;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xf28ac0, 14, 20);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const product = new THREE.Group();
    scene.add(product);

    const textureLoader = new THREE.TextureLoader();
    let productTexture;
    let productMaterial;
    let productPlane;
    let bottleShadow;
    let scrollTimeline;
    let shadowTexture;

    // A soft, offset contact shadow grounds the packshot against the green
    // background so the transparent PNG feels integrated instead of pasted on.
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 384;
    const shadowContext = shadowCanvas.getContext("2d");
    const shadowGradient = shadowContext.createRadialGradient(128, 192, 12, 128, 192, 126);
    shadowGradient.addColorStop(0, "rgba(8, 22, 13, 0.38)");
    shadowGradient.addColorStop(0.48, "rgba(8, 22, 13, 0.22)");
    shadowGradient.addColorStop(1, "rgba(8, 22, 13, 0)");
    shadowContext.fillStyle = shadowGradient;
    shadowContext.fillRect(0, 0, 256, 384);
    shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
      blending: THREE.NormalBlending,
    });
    bottleShadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.7), shadowMaterial);
    bottleShadow.position.set(0.1, -0.08, -0.12);
    bottleShadow.renderOrder = 0;
    product.add(bottleShadow);

    // Glossy green capsules float around the packshot, restoring the original
    // green accent while keeping the existing 3D hero feel.
    const capsuleGeometry = new THREE.CapsuleGeometry(0.105, 0.27, 8, 16);
    const capsuleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x63b33f,
      roughness: 0.2,
      metalness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      emissive: 0x173d0a,
      emissiveIntensity: 0.18,
    });
    const capsuleSpecs = [
      { x: -1.85, y: 1.5, z: 0.35, rot: 0.85, scale: 0.82, phase: 0.2 },
      { x: 1.8, y: 1.0, z: -0.35, rot: -0.7, scale: 0.72, phase: 1.4 },
      { x: -1.75, y: -0.45, z: 0.7, rot: -0.9, scale: 0.9, phase: 2.2 },
      { x: 1.9, y: -1.15, z: 0.5, rot: 0.55, scale: 0.82, phase: 3.1 },
      { x: 0.95, y: 2.05, z: -0.6, rot: 1.0, scale: 0.58, phase: 4.0 },
      { x: -0.8, y: -2.0, z: -0.25, rot: -0.3, scale: 0.62, phase: 5.0 },
    ];
    const floatingCapsules = capsuleSpecs.map((spec) => {
      const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
      capsule.position.set(spec.x, spec.y, spec.z);
      capsule.rotation.z = spec.rot;
      capsule.rotation.x = 0.35 + spec.phase * 0.05;
      capsule.scale.setScalar(0.01);
      capsule.userData = { ...spec, baseY: spec.y };
      scene.add(capsule);
      gsap.to(capsule.scale, {
        x: spec.scale,
        y: spec.scale,
        z: spec.scale,
        duration: 0.75,
        delay: 0.25 + spec.phase * 0.08,
        ease: "back.out(1.7)",
      });
      return capsule;
    });

    textureLoader.load(
      "/images/ashwagandha.png",
      (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose();
          return;
        }

        // The supplied packshot has a black backdrop. Remove only near-black
        // background pixels so the bottle can sit naturally in the hero.
        const source = loadedTexture.image;
        const canvas = document.createElement("canvas");
        canvas.width = source.naturalWidth || source.width;
        canvas.height = source.naturalHeight || source.height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        const frame = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = frame.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          if (r < 18 && g < 18 && b < 18) {
            pixels[i + 3] = 0;
          } else if (r < 38 && g < 38 && b < 38) {
            const brightness = Math.max(r, g, b);
            pixels[i + 3] = Math.round(((brightness - 18) / 20) * pixels[i + 3]);
          }
        }

        context.putImageData(frame, 0, 0);
        productTexture = new THREE.CanvasTexture(canvas);
        productTexture.colorSpace = THREE.SRGBColorSpace;
        productTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const aspect = canvas.width / canvas.height;
        const height = 4.65;
        productMaterial = new THREE.MeshBasicMaterial({
          map: productTexture,
          transparent: true,
          alphaTest: 0.015,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        productPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(height * aspect, height),
          productMaterial
        );
        productPlane.position.z = 0.02;
        productPlane.renderOrder = 1;
        product.add(productPlane);
        const mobileLayout = window.matchMedia("(max-width: 600px)").matches;
        const targetScale = mobileLayout ? 0.72 : 0.86;
        product.scale.setScalar(targetScale);
        gsap.fromTo(
          product.scale,
          { x: targetScale * 0.88, y: targetScale * 0.88, z: targetScale * 0.88 },
          { x: targetScale, y: targetScale, z: targetScale, duration: 1.15, ease: "power3.out" }
        );

        // Scroll-controlled handoff: move the rendered bottle down toward the
        // hand, then fade it as the supplied held-bottle cutout takes over.
        scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        scrollTimeline.to(product.position, {
          x: mobileLayout ? 0.06 : 0.28,
          y: mobileLayout ? -0.95 : -0.72,
          ease: "none",
        }, 0);
        scrollTimeline.to(product.scale, {
          x: targetScale * (mobileLayout ? 0.82 : 0.9),
          y: targetScale * (mobileLayout ? 0.82 : 0.9),
          z: targetScale * (mobileLayout ? 0.82 : 0.9),
          ease: "none",
        }, 0);
        scrollTimeline.to(productMaterial, { opacity: 0, ease: "none" }, 0.62);
        productMaterial.transparent = true;
      },
      undefined,
      (error) => {
        console.error("Could not load /images/ashwagandha.png", error);
      }
    );

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const width = Math.max(el.clientWidth, 1);
      const height = Math.max(el.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();

    const clock = new THREE.Clock();
    let frameId;
    const tick = () => {
      const time = clock.getElapsedTime();
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;

      // The packshot remains almost front-facing; the capsules provide the
      // surrounding 3D motion and visual depth.
      product.rotation.y = Math.sin(time * 0.65) * 0.025 + pointer.x * 0.055;
      product.rotation.x = -pointer.y * 0.025;
      // Subtle horizontal follow effect: the bottle gently tracks the mouse.
      const mobileLayout = window.matchMedia("(max-width: 600px)").matches;
      product.position.x = (mobileLayout ? 0.02 : -0.32) + pointer.x * (mobileLayout ? 0.08 : 0.22);
      product.position.y = (mobileLayout ? 0.12 : 0) + Math.sin(time * 0.9) * 0.07;
      product.rotation.z = 0.11;

      floatingCapsules.forEach((capsule) => {
        const { baseY, phase } = capsule.userData;
        capsule.position.y = baseY + Math.sin(time * 1.15 + phase) * 0.16;
        capsule.rotation.z += 0.0025;
        capsule.rotation.x = 0.35 + Math.sin(time * 0.7 + phase) * 0.12;
      });

      camera.position.x = pointer.x * 0.12;
      camera.position.y = -pointer.y * 0.08;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      observer.disconnect();
      scrollTimeline?.scrollTrigger?.kill();
      scrollTimeline?.kill();
      gsap.killTweensOf(product.scale);
      floatingCapsules.forEach((capsule) => {
        gsap.killTweensOf(capsule.scale);
        scene.remove(capsule);
      });
      capsuleGeometry.dispose();
      capsuleMaterial.dispose();
      product.clear();
      if (productPlane?.geometry) productPlane.geometry.dispose();
      if (productMaterial) productMaterial.dispose();
      if (productTexture) productTexture.dispose();
      if (bottleShadow?.geometry) bottleShadow.geometry.dispose();
      if (shadowMaterial) shadowMaterial.dispose();
      if (shadowTexture) shadowTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-canvas" ref={mount} aria-hidden="true" />;
}
