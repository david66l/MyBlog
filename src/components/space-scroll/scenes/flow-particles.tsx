"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createFlowParticleGeometry,
  flowParticleFragmentShader,
  flowParticleVertexShader,
} from "../shared/flow-particle-shader";

interface FlowLayerProps {
  count: number;
  spread: number;
  size: number;
  flow: number;
  color: string;
  brightness: number;
  timeOffset?: number;
}

function FlowLayer({
  count,
  spread,
  size,
  flow,
  color,
  brightness,
  timeOffset = 0,
}: FlowLayerProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(
    () => createFlowParticleGeometry(count, spread),
    [count, spread],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlow: { value: flow },
      uSize: { value: size },
      uColor: { value: new THREE.Color(color) },
      uBrightness: { value: brightness },
    }),
    [flow, size, color, brightness],
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime() + timeOffset;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={flowParticleVertexShader}
        fragmentShader={flowParticleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function FlowParticlesScene() {
  const rigRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!rigRef.current) return;
    const t = clock.getElapsedTime();
    rigRef.current.rotation.y = t * 0.015;
    rigRef.current.rotation.x = Math.sin(t * 0.08) * 0.04;
  });

  return (
    <>
      <fog attach="fog" args={["#020202", 4, 22]} />
      <ambientLight intensity={0.02} />

      <group ref={rigRef}>
        {/* Deep slow drift — background mist */}
        <FlowLayer
          count={5000}
          spread={14}
          size={2.8}
          flow={0.55}
          color="#64748b"
          brightness={0.35}
          timeOffset={0}
        />

        {/* Main flowing body — reference image feel */}
        <FlowLayer
          count={9000}
          spread={11}
          size={2.2}
          flow={0.85}
          color="#e2e8f0"
          brightness={0.55}
          timeOffset={12.5}
        />

        {/* Bright wisps */}
        <FlowLayer
          count={3500}
          spread={8}
          size={3.2}
          flow={1.1}
          color="#ffffff"
          brightness={0.45}
          timeOffset={27.0}
        />

        {/* Subtle blue accent — SpaceX tone */}
        <FlowLayer
          count={2500}
          spread={10}
          size={1.8}
          flow={0.95}
          color="#60a5fa"
          brightness={0.25}
          timeOffset={41.0}
        />
      </group>

      {/* Central soft glow anchor */}
      <mesh position={[0, 0, -2]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.015} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.008} depthWrite={false} />
      </mesh>
    </>
  );
}
