"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { PostEffects } from "./shared/post-effects";
import { QuantumEarthScene } from "./scenes/quantum-earth";

interface SpaceCanvasProps {
  onReady?: () => void;
  active?: boolean;
}

export function SpaceCanvas({ onReady, active = true }: SpaceCanvasProps) {
  return (
    <Canvas
      className="absolute inset-0 z-0"
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 8.5], fov: 42, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      dpr={[1, 2]}
      style={{ background: "#000000" }}
      onCreated={onReady}
    >
      <color attach="background" args={["#000000"]} />
      <Suspense fallback={null}>
        <group position={[0, -1.35, 0]}>
          <QuantumEarthScene />
        </group>
        <PostEffects />
      </Suspense>
    </Canvas>
  );
}
