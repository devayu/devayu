"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "atsu" | "jin";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "jin" ? "jin" : "atsu";

const getServerSnapshot = (): Theme | null => null;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }
    document.startViewTransition(apply);
  }, []);

  return { theme, setTheme };
}

// Runs before paint so the page never flashes the wrong theme.
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='atsu'&&t!=='jin'){t=matchMedia('(prefers-color-scheme: dark)').matches?'jin':'atsu'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='atsu'}})()`;
