import * as THREE from "three";

export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;
  void main() {
    float rim = pow(clamp(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.8);
    float horizon = pow(clamp(dot(vNormal, vec3(0.0, 1.0, 0.0)) + 0.15, 0.0, 1.0), 1.5);
    float alpha = rim * intensity + horizon * 0.35;
    gl_FragColor = vec4(glowColor, alpha * 0.85);
  }
`;

export function createAtmosphereUniforms(color: string, intensity = 1.4) {
  return {
    glowColor: { value: new THREE.Color(color) },
    intensity: { value: intensity },
  };
}
