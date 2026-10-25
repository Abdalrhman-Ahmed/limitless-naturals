"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

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
    const rim = new THREE.PointLight(0x9be0ae, 12, 20);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const product = new THREE.Group();
    scene.add(product);

    const textureLoader = new THREE.TextureLoader();
    let productTexture;
    let productMaterial;
    let productPlane;

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
        const height = 5.7;
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
        product.add(productPlane);
        product.scale.setScalar(0.94);
        gsap.fromTo(
          product.scale,
          { x: 0.82, y: 0.82, z: 0.82 },
          { x: 0.94, y: 0.94, z: 0.94, duration: 1.15, ease: "power3.out" }
        );
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

      // A single packshot is a flat image, so keep rotation subtle to avoid
      // pretending it is a fully modelled 3D bottle.
      product.rotation.y = Math.sin(time * 0.65) * 0.1 + pointer.x * 0.1;
      product.rotation.x = -pointer.y * 0.045;
      product.position.y = Math.sin(time * 0.9) * 0.09;
      product.rotation.z = -0.025;
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
      gsap.killTweensOf(product.scale);
      product.clear();
      if (productPlane?.geometry) productPlane.geometry.dispose();
      if (productMaterial) productMaterial.dispose();
      if (productTexture) productTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-canvas" ref={mount} aria-hidden="true" />;
}
