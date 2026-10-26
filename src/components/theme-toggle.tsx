'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** Light/dark switch. The site starts with the visitor's system theme. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // true only in the browser: avoids a wrong icon before the theme is known
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  // the server has no theme, so stay neutral until mounted or hydration mismatches
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={
        mounted ? (isDark ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'
      }
      className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-chip text-foreground transition-opacity hover:opacity-80"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-[18px]" />
        ) : (
          <Moon className="size-[18px]" />
        )
      ) : (
        <span className="size-[18px]" />
      )}
    </button>
  );
}
