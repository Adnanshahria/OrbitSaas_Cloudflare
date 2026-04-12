import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

/*  ═══════════════════════════════════════════════════════════
    HERO 3D VISUAL — Premium Glass with Environment Reflections
    
    Uses meshPhysicalMaterial + Environment preset for rich
    glass refraction without the multi-pass cost of
    MeshTransmissionMaterial. The Environment cubemap gives
    the glass surfaces something to actually reflect/refract,
    creating depth and luxury feel.
    ═══════════════════════════════════════════════════════════ */

export function Hero3DVisual() {
  const meshRef = useRef<any>(null);
  const meshRef2 = useRef<any>(null);
  const innerGlowRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const startTime = useRef(Date.now());

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 4), []);
  const secondaryGeometry = useMemo(() => new THREE.TorusGeometry(2.2, 0.4, 32, 80), []);
  // Inner glow core — small sphere at center for luminosity
  const coreGeometry = useMemo(() => new THREE.SphereGeometry(0.6, 16, 16), []);

  useFrame((_, delta) => {
    if (prefersReducedMotion) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 1.5, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    if (meshRef.current) {
      if (progress < 1) meshRef.current.scale.setScalar(easeProgress);
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }

    if (meshRef2.current) {
      if (progress < 1) meshRef2.current.scale.setScalar(easeProgress);
      meshRef2.current.rotation.x -= delta * 0.05;
      meshRef2.current.rotation.y -= delta * 0.1;
      meshRef2.current.rotation.z += delta * 0.08;
    }

    // Pulsing inner glow
    if (innerGlowRef.current) {
      const pulse = 0.8 + Math.sin(elapsed * 1.5) * 0.2;
      if (progress < 1) {
        innerGlowRef.current.scale.setScalar(easeProgress * pulse);
      } else {
        innerGlowRef.current.scale.setScalar(pulse);
      }
    }
  });

  return (
    <group position={[0.5, 0, 0]}>
      {/* Environment map — this is what makes glass look REAL. 
          Lightweight cubemap, huge visual impact. */}
      <Environment preset="night" />

      {/* Lighting — richer setup for glass refraction */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={3} color="#4338ca" />
      <directionalLight position={[-8, -5, -10]} intensity={1.5} color="#1e3a5f" />
      <pointLight position={[0, 0, 5]} intensity={2} color="#c7d2fe" />
      <pointLight position={[-5, 3, -2]} intensity={1} color="#6366f1" />

      {/* Main Icosahedron — premium crystal glass */}
      <Float speed={prefersReducedMotion ? 0 : 2} rotationIntensity={prefersReducedMotion ? 0 : 1} floatIntensity={prefersReducedMotion ? 0 : 2}>
        <group>
          <mesh ref={meshRef} geometry={geometry} scale={0}>
            <meshPhysicalMaterial
              color="#312e81"
              transmission={0.92}
              thickness={3}
              roughness={0.03}
              clearcoat={1}
              clearcoatRoughness={0.05}
              ior={2.4}
              envMapIntensity={2.5}
              iridescence={0.8}
              iridescenceIOR={1.3}
              iridescenceThicknessRange={[100, 800]}
              specularIntensity={1}
              specularColor={new THREE.Color('#6366f1')}
              transparent
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
          {/* Inner luminous core — gives depth and internal glow */}
          <mesh ref={innerGlowRef} geometry={coreGeometry} scale={0}>
            <meshBasicMaterial
              color="#4338ca"
              transparent
              opacity={0.15}
              toneMapped={false}
            />
          </mesh>
        </group>
      </Float>

      {/* Secondary Orbiting Ring — complements the main sphere */}
      <Float speed={prefersReducedMotion ? 0 : 1.5} rotationIntensity={prefersReducedMotion ? 0 : 0.8} floatIntensity={prefersReducedMotion ? 0 : 1.5}>
        <mesh
          ref={meshRef2}
          geometry={secondaryGeometry}
          scale={0}
          rotation={[Math.PI / 3, Math.PI / 6, 0]}
        >
          <meshPhysicalMaterial
            color="#1e3a5f"
            transmission={0.82}
            thickness={1.5}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.1}
            ior={2.0}
            envMapIntensity={2}
            iridescence={0.6}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[200, 600]}
            specularIntensity={0.8}
            specularColor={new THREE.Color('#4f46e5')}
            transparent
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </Float>
    </group>
  );
}
