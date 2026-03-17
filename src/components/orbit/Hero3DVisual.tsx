import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export function Hero3DVisual() {
  const meshRef = useRef<any>(null);
  const meshRef2 = useRef<any>(null);
  const scroll = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const startTime = useRef(Date.now());

  // Create a complex dynamic geometry for the primary shape
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.5, 4); 
  }, []);

  const secondaryGeometry = useMemo(() => {
     return new THREE.TorusGeometry(2.2, 0.4, 32, 100);
  }, []);

  // Use a slight random rotation animation
  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    
    // Scale animation on load
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 1.5, 1); // 1.5s duration
    const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
    
    // Rotate slightly on frame update
    if (meshRef.current) {
      if (progress < 1) {
        meshRef.current.scale.set(easeProgress, easeProgress, easeProgress);
      }
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
    
    if (meshRef2.current) {
      if (progress < 1) {
        meshRef2.current.scale.set(easeProgress, easeProgress, easeProgress);
      }
      meshRef2.current.rotation.x -= delta * 0.05;
      meshRef2.current.rotation.y -= delta * 0.1;
      meshRef2.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <group position={[1.5, 0, 0]}>
      {/* Lights to create iridescent effects on the glass */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2.5} color="#818cf8" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#38bdf8" />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#e0e7ff" />

      {/* Main Icosahedron floating glass sphere */}
      <Float speed={prefersReducedMotion ? 0 : 2} rotationIntensity={prefersReducedMotion ? 0 : 1} floatIntensity={prefersReducedMotion ? 0 : 2}>
        <mesh 
          ref={meshRef} 
          geometry={geometry}
          scale={0}
        >
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2.5}
            chromaticAberration={1}
            anisotropy={0.5}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.2}
            color="#818cf8"
            attenuationDistance={1}
            attenuationColor="#ffffff"
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.95}
            roughness={0.05}
          />
        </mesh>
      </Float>

      {/* Secondary Orbiting Ring */}
      <Float speed={prefersReducedMotion ? 0 : 1.5} rotationIntensity={prefersReducedMotion ? 0 : 0.8} floatIntensity={prefersReducedMotion ? 0 : 1.5}>
        <mesh 
          ref={meshRef2} 
          geometry={secondaryGeometry}
          scale={0}
          rotation={[Math.PI / 3, Math.PI / 6, 0]}
        >
          <MeshTransmissionMaterial 
            backside
            thickness={1}
            chromaticAberration={0.5}
            color="#38bdf8"
            clearcoat={1}
            clearcoatRoughness={0.2}
            transmission={0.8}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}
