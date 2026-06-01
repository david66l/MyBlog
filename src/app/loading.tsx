import { PAGE_FADE_DURATION_MS } from "@/lib/motion";

export default function Loading() {
  return (
    <div
      className="min-h-[calc(100vh-3.5rem)] bg-black"
      style={{ animationDuration: `${PAGE_FADE_DURATION_MS}ms` }}
      aria-hidden
    />
  );
}
