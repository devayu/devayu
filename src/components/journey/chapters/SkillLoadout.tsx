"use client";

import { getFeaturedProjects, skills, workExperience } from "@/data";
import { audio } from "@/lib/audio/manager";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Every skill as installed cyberware. Pick one and the readout shows where
// it has actually been used, straight from the projects and work history.

const slots = ["Cranium", "Eyes", "Torso", "Arms", "Hands", "Back", "Legs", "Skin", "Nervous system"];

const usage = (skill: string) => {
  const s = skill.toLowerCase();
  const inProjects = getFeaturedProjects()
    .filter((p) => p.techStack.some((t) => t.toLowerCase() === s))
    .map((p) => p.title.replace(" Landing Website", ""));
  const inWork = workExperience
    .filter((w) => w.description.some((d) => d.toLowerCase().includes(s)))
    .map((w) => w.location);
  return [...inWork, ...inProjects];
};

export default function SkillLoadout() {
  const [selected, setSelected] = useState(0);
  const skill = skills[selected];
  const used = usage(skill);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
      <ul className="honeycomb" data-scan={`Cyberware // ${skills.length} slots occupied`}>
        {skills.map((s, i) => (
          <li key={s} className="contents">
            <button
              type="button"
              onMouseEnter={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              onClick={() => {
                setSelected(i);
                audio.sfx("glitch");
              }}
              aria-pressed={selected === i}
              className={cn("hex group", selected === i && "is-selected")}
            >
              <span className="font-tech text-[10px] text-[var(--nc-gold)] opacity-70">{slots[i % slots.length]}</span>
              <span className="font-rajdhani text-xl font-bold uppercase leading-none md:text-2xl">{s}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* the readout */}
      <div aria-live="polite" className="nc-clip border border-[var(--nc-gold)]/40 bg-[#100b04]/90 p-6 md:p-8">
        <p className="font-tech text-xs text-[var(--nc-gold)]">{slots[selected % slots.length].toUpperCase()} SLOT</p>
        <p key={skill} className="nc-subtitle mt-2 font-rajdhani text-5xl font-bold uppercase italic text-[var(--nc-yellow)] md:text-6xl">
          {skill}
        </p>
        <p className="mt-6 font-tech text-xs text-[#d8f6ff]/60">FIELD RECORD</p>
        {used.length > 0 ? (
          <ul className="mt-2 space-y-1 font-rajdhani text-2xl font-semibold">
            {used.map((u) => (
              <li key={u} className="flex items-center gap-3">
                <span aria-hidden className="inline-block size-2 rotate-45 bg-[var(--nc-cyan)]" />
                {u}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 font-rajdhani text-2xl font-semibold text-[#d8f6ff]/80">Part of the everyday toolkit.</p>
        )}
      </div>
    </div>
  );
}
