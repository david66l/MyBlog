"use client";

import { Stars } from "@react-three/drei";

interface StarfieldProps {
  count?: number;
}

export function Starfield({ count = 4000 }: StarfieldProps) {
  return (
    <Stars
      radius={120}
      depth={60}
      count={count}
      factor={2.5}
      saturation={0}
      fade
      speed={0.3}
    />
  );
}
