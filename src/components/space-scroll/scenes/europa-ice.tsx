"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Starfield } from "../shared/starfield";

function makeCrackCurve(
  points: [number, number, number][],
): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
}

const CRACK_PATHS: [number, number, number][][] = [
  [
    [-3, 0.2, 0],
    [-1.5, 0.35, 0.3],
    [0, 0.15, 0.1],
    [1.8, 0.4, -0.2],
    [3.2, 0.25, 0],
  ],
  [
    [-2.5, -0.3, 0.1],
    [-0.8, -0.1, 0.4],
    [0.5, -0.35, 0.2],
    [2.2, -0.15, 0],
  ],
  [
    [-1, 0.6, -0.1],
    [0.2, 0.5, 0.2],
    [1.5, 0.65, 0],
    [2.8, 0.45, -0.15],
  ],
  [
    [-3.5, -0.6, 0],
    [-2, -0.45, 0.2],
    [-0.5, -0.7, 0.15],
    [1, -0.55, 0],
  ],
  [
    [0.5, -0.8, 0.1],
    [1.5, -0.65, 0.3],
    [2.5, -0.85, 0.1],
  ],
];

export function EuropaIceScene() {
  const glowRef = useRef<THREE.PointLight>(null);
  const cracksRef = useRef<THREE.Group>(null);

  const { iceGeo, crackGeos } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 12, 80, 60);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const n =
        Math.sin(x * 0.8) * Math.cos(y * 0.6) * 0.12 +
        Math.sin(x * 2.1 + y) * 0.04;
      pos.setZ(i, n);
    }
    geo.computeVertexNormals();
    geo.rotateX(-Math.PI / 2.4);

    const tubes = CRACK_PATHS.map((path) => {
      const curve = makeCrackCurve(path);
      return new THREE.TubeGeometry(curve, 80, 0.035, 6, false);
    });
    return { iceGeo: geo, crackGeos: tubes };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      glowRef.current.intensity = 1.2 + Math.sin(t * 0.7) * 0.4;
    }
    if (cracksRef.current) {
      cracksRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.5 + Math.sin(t * 0.9 + i * 0.8) * 0.8;
      });
    }
  });

  return (
    <>
      <Starfield count={3000} />
      <fog attach="fog" args={["#040810", 5, 22]} />
      <ambientLight intensity={0.08} color="#c8d8f0" />
      <directionalLight position={[-4, 6, 3]} intensity={0.6} color="#e2e8f0" />
      <pointLight ref={glowRef} position={[0, -1.5, 2]} intensity={1.2} color="#34d399" distance={12} />
      <pointLight position={[2, -2, 1]} intensity={0.5} color="#0ea5e9" distance={10} />

      {/* Ice shelf */}
      <mesh geometry={iceGeo} position={[0, -0.5, -1]}>
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.35}
          metalness={0.15}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Frost overlay */}
      <mesh geometry={iceGeo} position={[0, -0.48, -0.95]} scale={1.001}>
        <meshStandardMaterial
          color="#94a3b8"
          transparent
          opacity={0.08}
          roughness={0.2}
          metalness={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Glowing cracks */}
      <group ref={cracksRef} position={[0, 0.05, 0.15]}>
        {crackGeos.map((tubeGeo, i) => (
          <mesh key={i} geometry={tubeGeo}>
            <meshStandardMaterial
              color="#020617"
              emissive={i % 2 === 0 ? "#34d399" : "#22d3ee"}
              emissiveIntensity={1.8}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Subsurface volume glow */}
      <mesh position={[0, -1.8, 0.5]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial color="#059669" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh position={[0, -2.2, 1]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <planeGeometry args={[10, 7]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </>
  );
}
