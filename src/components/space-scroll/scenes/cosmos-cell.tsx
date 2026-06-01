"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Starfield } from "../shared/starfield";

function helixPoints(t: number, phase: number, radius: number, height: number) {
  return new THREE.Vector3(
    Math.cos(t + phase) * radius,
    (t / Math.PI) * height - height / 2,
    Math.sin(t + phase) * radius,
  );
}

function DnaHelix({ phase = 0, color = "#60a5fa" }: { phase?: number; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const { tubeGeo, rungs } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = (i / 120) * Math.PI * 5;
      points.push(helixPoints(t, phase, 0.55, 5));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tube = new THREE.TubeGeometry(curve, 200, 0.045, 12, false);

    const rungData: { mid: THREE.Vector3; len: number; quat: THREE.Quaternion }[] = [];
    for (let i = 0; i < 18; i++) {
      const t = (i / 18) * Math.PI * 5;
      const start = helixPoints(t, phase, 0.55, 5);
      const end = helixPoints(t, phase + Math.PI, 0.55, 5);
      const dir = end.clone().sub(start);
      const len = dir.length();
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.normalize(),
      );
      rungData.push({ mid, len, quat });
    }
    return { tubeGeo: tube, rungs: rungData };
  }, [phase]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={tubeGeo}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.3}
          transparent
          opacity={0.92}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {rungs.map((rung, i) => (
        <mesh key={i} position={rung.mid} quaternion={rung.quat}>
          <cylinderGeometry args={[0.012, 0.012, rung.len, 6]} />
          <meshStandardMaterial
            color="#cbd5e1"
            emissive="#64748b"
            emissiveIntensity={0.5}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
    </group>
  );
}

function NebulaMist() {
  return (
    <>
      <mesh position={[-3, 1, -4]} scale={2.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#1e3a8a" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh position={[3, -1, -5]} scale={3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#065f46" transparent opacity={0.05} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -6]} scale={4}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#312e81" transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </>
  );
}

export function CosmosCellScene() {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <>
      <Starfield count={7000} />
      <fog attach="fog" args={["#030308", 8, 30]} />
      <NebulaMist />
      <ambientLight intensity={0.06} />
      <pointLight position={[3, 3, 4]} intensity={1.2} color="#93c5fd" distance={20} />
      <pointLight position={[-4, -2, 3]} intensity={0.7} color="#34d399" distance={18} />
      <pointLight position={[0, 0, 2]} intensity={0.4} color="#ffffff" distance={15} />

      <group scale={1.35}>
        <DnaHelix phase={0} color="#60a5fa" />
        <DnaHelix phase={Math.PI} color="#34d399" />
      </group>

      <group ref={particlesRef}>
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const r = 2.8 + (i % 5) * 0.3;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * r,
                (Math.sin(i * 1.7) * 1.2),
                Math.sin(angle) * r,
              ]}
            >
              <sphereGeometry args={[0.02 + (i % 3) * 0.01, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
