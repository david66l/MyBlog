"use client";

import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Starfield } from "../shared/starfield";

const ORBITS = [
  { radius: 1.85, tilt: [0.15, 0.25, 0.05] as [number, number, number], speed: 0.45, opacity: 0.28, sats: 1, phase: 0 },
  { radius: 2.35, tilt: [0.55, 0.15, 0.35] as [number, number, number], speed: 0.32, opacity: 0.35, sats: 2, phase: 1.2 },
  { radius: 2.85, tilt: [0.1, 0.55, -0.1] as [number, number, number], speed: 0.22, opacity: 0.22, sats: 1, phase: 2.4 },
  { radius: 3.35, tilt: [0.7, -0.2, 0.2] as [number, number, number], speed: 0.15, opacity: 0.3, sats: 1, phase: 0.8 },
];

function OrbitPath({
  radius,
  tilt,
  speed,
  opacity,
  satelliteCount,
  phase,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  opacity: number;
  satelliteCount: number;
  phase: number;
}) {
  const satsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (satsRef.current) satsRef.current.rotation.y = clock.getElapsedTime() * speed + phase;
  });

  const ringPoints = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(180).map((p) => [p.x, 0, p.y] as [number, number, number]);
    pts.push(pts[0]);
    return pts;
  }, [radius]);

  return (
    <group rotation={tilt}>
      <Line points={ringPoints} color="#ffffff" transparent opacity={opacity} lineWidth={0.5} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0015, 6, 180]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.5} depthWrite={false} />
      </mesh>

      <group ref={satsRef}>
        {Array.from({ length: satelliteCount }).map((_, i) => {
          const angle = (i / satelliteCount) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            >
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function QuantumEarthScene() {
  const earthRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.08;
    if (wireRef.current) {
      const mat = wireRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.sin(t * 1.2) * 0.025;
    }
  });

  return (
    <>
      <Starfield count={5000} />
      <fog attach="fog" args={["#000000", 8, 32]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[4, 3, 5]} intensity={0.9} color="#ffffff" />
      <directionalLight position={[-3, -1, 2]} intensity={0.25} color="#ffffff" />

      {ORBITS.map((orbit, i) => (
        <OrbitPath
          key={i}
          radius={orbit.radius}
          tilt={orbit.tilt}
          speed={orbit.speed}
          opacity={orbit.opacity}
          satelliteCount={orbit.sats}
          phase={orbit.phase}
        />
      ))}

      <group ref={earthRef}>
        <mesh>
          <sphereGeometry args={[1.15, 64, 64]} />
          <meshStandardMaterial
            color="#050505"
            roughness={0.55}
            metalness={0.35}
            emissive="#111111"
            emissiveIntensity={0.08}
          />
        </mesh>

        <mesh ref={wireRef}>
          <sphereGeometry args={[1.17, 48, 48]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
        </mesh>

        <mesh scale={1.018}>
          <icosahedronGeometry args={[1.15, 3]} />
          <meshBasicMaterial
            color="#cccccc"
            wireframe
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.002, 6, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>

        <mesh scale={1.04}>
          <sphereGeometry args={[1.15, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.025}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {Array.from({ length: 16 }).map((_, i) => {
          const phi = Math.acos(1 - (2 * (i + 0.5)) / 16);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = 1.19;
          return (
            <mesh
              key={i}
              position={[
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.cos(phi),
                r * Math.sin(phi) * Math.sin(theta),
              ]}
            >
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
