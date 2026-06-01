"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "code" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative overflow-hidden rounded-sm border border-white/[0.08] bg-[#050505]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <span className="font-mono text-[10px] tracking-[0.15em] text-white/35 uppercase">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-mono text-[10px] tracking-wider text-white/35 uppercase transition-colors hover:text-white"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-white/65">{code}</code>
      </pre>
    </div>
  );
}
