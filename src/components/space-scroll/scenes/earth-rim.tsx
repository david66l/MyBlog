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

const PLANET_Y = -4.2;
const PLANET_R = 4.2;

export function EarthRimScene() {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosMatRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (planetRef.current) planetRef.current.rotation.y = t * 0.015;
    if (atmosMatRef.current) {
      atmosMatRef.current.uniforms.intensity.value = 1.3 + Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <>
      <Starfield count={6000} />
      <fog attach="fog" args={["#020208", 6, 28]} />

      {/* Backlight — creates the rim */}
      <ambientLight intensity={0.04} />
      <directionalLight position={[0, 3, -4]} intensity={0.15} color="#1e40af" />
      <directionalLight position={[0, 1.5, -3]} intensity={2.5} color="#ffffff" />
      <pointLight position={[0, 0.5, 2]} intensity={0.4} color="#3b82f6" distance={20} />

      {/* Planet body */}
      <mesh ref={planetRef} position={[0, PLANET_Y, 0]}>
        <sphereGeometry args={[PLANET_R, 128, 128]} />
        <meshStandardMaterial
          color="#061018"
          roughness={0.95}
          metalness={0.05}
          emissive="#0a2040"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Night-side city glow hint */}
      <mesh position={[0, PLANET_Y, 0]}>
        <sphereGeometry args={[PLANET_R * 1.001, 64, 64]} />
        <meshBasicMaterial
          color="#1a3a5c"
          transparent
          opacity={0.12}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Atmosphere shell */}
      <mesh ref={planetRef} position={[0, PLANET_Y, 0]} scale={1.045}>
        <sphereGeometry args={[PLANET_R, 64, 64]} />
        <shaderMaterial
          ref={atmosMatRef}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          uniforms={createAtmosphereUniforms("#6ec8ff", 1.4)}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
        />
      </mesh>

      {/* Outer haze */}
      <mesh position={[0, PLANET_Y, 0]} scale={1.12}>
        <sphereGeometry args={[PLANET_R, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
