"use client";

import { audio } from "@/lib/audio/manager";
import { useEffect, useState } from "react";

// The email, pinned up as a scrap. Hover lifts a corner; click peels it and
// copies the address. If the clipboard is refused, it opens your mail app.

export default function EmailScrap({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      audio.sfx("slide");
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <li className="cb-pin cb-pin-email" data-peeled={copied || undefined} data-refract style={{ ["--r" as string]: "-2deg" }}>
      <button type="button" className="cb-pin-paper" onClick={copy}>
        <span className="cb-pin-k">Email</span>
        <span className="cb-pin-v">{email}</span>
        <span className="cb-pin-hint">{copied ? "Copied. It’s on your clipboard." : "Peel it off to copy"}</span>
        <span className="cb-pin-flap" aria-hidden />
      </button>
      <a className="cb-pin-alt" href={`mailto:${email}`}>
        or open your mail app
      </a>
      <span className="cb-sr" role="status" aria-live="polite">
        {copied ? "Email address copied to the clipboard" : ""}
      </span>
    </li>
  );
}
