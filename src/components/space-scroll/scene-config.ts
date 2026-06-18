export interface SpaceSceneConfig {
  id: string;
  label: string;
  tag: string;
  title: string[];
  subtitle: string;
  telemetry: [string, string, string];
}

export const spaceScenes: SpaceSceneConfig[] = [
  {
    id: "quantum-earth",
    label: "ORBIT",
    tag: "// louis-dev.cloud",
    title: ["WELCOME", "LOUIS.DEV"],
    subtitle: "Personal area — AI, space, and biology.",
    telemetry: ["SATS: 5 ACTIVE", "ALT: 550 km", "LINK: NOMINAL"],
  },
];
