"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

export function PostEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.85}
        intensity={1.35}
        mipmapBlur
      />
      <Vignette eskil offset={0.15} darkness={0.85} />
    </EffectComposer>
  );
}
