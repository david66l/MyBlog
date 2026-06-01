"use client";

import { useRef } from "react";
import { Grid, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Starfield } from "../shared/starfield";

function RocketSilhouette() {
  return (
    <group position={[0, -0.8, -2]}>
      {/* Stage 1 */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 1.8, 16]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Stage 2 */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 1.2, 16]} />
        <meshStandardMaterial color="#22222c" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 2.55, 0]}>
        <coneGeometry args={[0.12, 0.5, 16]} />
        <meshStandardMaterial color="#2a2a35" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Fins */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 4) * Math.PI * 2) * 0.2, 0.1, Math.sin((i / 4) * Math.PI * 2) * 0.2]}
          rotation={[0, (i / 4) * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.02, 0.35, 0.18]} />
          <meshStandardMaterial color="#151518" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* Pad glow */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0.2, 1]} intensity={0.8} color="#3b82f6" distance={4} />
    </group>
  );
}

export function LaunchPadScene() {
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (moonRef.current) moonRef.current.rotation.y = clock.getElapsedTime() * 0.008;
  });

  return (
    <>
      <Starfield count={4000} />
      <fog attach="fog" args={["#030306", 6, 35]} />
      <ambientLight intensity={0.06} />
      <directionalLight position={[2, 8, 4]} intensity={0.5} color="#94a3b8" />
      <hemisphereLight args={["#1e3a5f", "#020204", 0.4]} />

      <Grid
        position={[0, -2.2, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#1e3a5f"
        sectionSize={2.5}
        sectionThickness={1.2}
        sectionColor="#3b82f6"
        fadeDistance={28}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Horizon haze line */}
      <mesh position={[0, 0.5, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 4]} />
        <meshBasicMaterial color="#1e40af" transparent opacity={0.04} depthWrite={false} />
      </mesh>

      <RocketSilhouette />

      {/* Distant moon */}
      <mesh ref={moonRef} position={[5, 3, -14]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.95}
          emissive="#1e293b"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[5, 3, -14]} scale={1.2}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#64748b" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Ascent trajectory */}
      <Line
        points={[
          [0, 2, -2],
          [0.5, 4, -5],
          [1.2, 6, -8],
          [2, 8, -12],
          [3, 10, -16],
        ]}
        color="#60a5fa"
        transparent
        opacity={0.5}
        lineWidth={1.5}
      />
      <Line
        points={[
          [0, 2, -2],
          [0.5, 4, -5],
          [1.2, 6, -8],
        ]}
        color="#ffffff"
        transparent
        opacity={0.25}
        lineWidth={3}
      />

      {/* Tower arms */}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.2, -2]}>
          <boxGeometry args={[0.06, 3.5, 0.06]} />
          <meshStandardMaterial color="#0f0f14" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 1.8, -2]}>
        <boxGeometry args={[2.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.85} roughness={0.25} />
      </mesh>
    </>
  );
}
