"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  phrases: string[];
  className?: string;
}

export function TypingText({ phrases, className = "" }: TypingTextProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = phrases[phraseIndex];

  useEffect(() => {
    const atEnd = charIndex === current.length;
    const pause = atEnd && !deleting ? 2200 : deleting && charIndex === 0 ? 400 : 45;

    const timer = setTimeout(() => {
      if (!deleting && atEnd) {
        setDeleting(true);
        return;
      }
      if (deleting && charIndex === 0) {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
        return;
      }
      setCharIndex((c) => c + (deleting ? -1 : 1));
    }, pause);

    return () => clearTimeout(timer);
  }, [charIndex, current.length, deleting]);

  return (
    <span className={`font-mono ${className}`}>
      <span className="text-accent/80">&gt;</span>{" "}
      {current.slice(0, charIndex)}
      <span className="animate-blink text-accent">▊</span>
    </span>
  );
}
