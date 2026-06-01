"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  atmosphereFragmentShader,
  atmosphereVertexShader,
  createAtmosphereUniforms,
} from "../shared/atmosphere-shader";
import { Starfield } from "../shared/starfield";

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  thickness = 0.012,
  dotCount = 0,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  thickness?: number;
  dotCount?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * speed * 0.08;
    if (dotsRef.current) dotsRef.current.rotation.y = t * speed;
  });

  return (
    <group ref={groupRef} rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, thickness, 16, 180]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      {dotCount > 0 && (
        <group ref={dotsRef}>
          {Array.from({ length: dotCount }).map((_, i) => {
            const angle = (i / dotCount) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

export function GoldilocksScene() {
  const systemRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (systemRef.current) systemRef.current.rotation.y = t * 0.04;
    if (sunRef.current) {
      const mat = sunRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.85 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <>
      <Starfield count={5000} />
      <fog attach="fog" args={["#020208", 10, 35]} />
      <ambientLight intensity={0.05} />
      <directionalLight position={[8, 4, 6]} intensity={1.4} color="#ffddaa" />
      <pointLight position={[-3, -1, 4]} intensity={0.35} color="#3b82f6" distance={20} />

      {/* Distant sun */}
      <mesh ref={sunRef} position={[12, 6, -10]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color="#fcd34d" transparent opacity={0.9} />
      </mesh>
      <mesh position={[12, 6, -10]} scale={3}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {/* Planet system */}
      <group ref={systemRef} scale={1.35}>
        <mesh>
          <sphereGeometry args={[1, 96, 96]} />
          <meshStandardMaterial
            color="#1a4a6e"
            roughness={0.65}
            metalness={0.1}
            emissive="#1e3a5f"
            emissiveIntensity={0.12}
          />
        </mesh>

        <mesh scale={1.008}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#94a3b8"
            transparent
            opacity={0.12}
            roughness={1}
            depthWrite={false}
          />
        </mesh>

        <mesh scale={1.06}>
          <sphereGeometry args={[1, 48, 48]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            side={THREE.BackSide}
            uniforms={createAtmosphereUniforms("#60a5fa", 0.9)}
            vertexShader={atmosphereVertexShader}
            fragmentShader={atmosphereFragmentShader}
          />
        </mesh>

        <OrbitRing radius={1.75} tilt={[0.35, 0.15, 0.05]} speed={0.5} color="#475569" thickness={0.008} />
        <OrbitRing radius={2.25} tilt={[0.12, 0.45, 0.08]} speed={0.35} color="#3b82f6" thickness={0.014} dotCount={2} />
        <OrbitRing radius={2.85} tilt={[0.55, -0.25, 0.12]} speed={0.2} color="#22c55e" thickness={0.01} dotCount={1} />

        {/* Habitable zone disc */}
        <mesh rotation={[Math.PI / 2.2, 0.1, 0]}>
          <ringGeometry args={[2.0, 2.65, 96]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0.1, 0]}>
          <ringGeometry args={[2.05, 2.08, 96]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0.1, 0]}>
          <ringGeometry args={[2.57, 2.6, 96]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}
