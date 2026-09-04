import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * SistemaPlanetario — solo fondo de estrellas.
 * Los planetas/órbitas se renderizan como elementos HTML en Inicio.jsx.
 */
const SistemaPlanetario = ({ className = "" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 22, 0);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, -1);

    // Estrellas
    const count = 700;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 })
    );
    scene.add(stars);

    let animId;
    const timer = new THREE.Timer();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      stars.rotation.y += timer.getDelta() * 0.008;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className={`w-full h-full ${className}`} style={{ minHeight: 600 }} />
  );
};

export default SistemaPlanetario;
