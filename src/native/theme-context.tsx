/**
 * KaleidoUIProvider + useKaleidoTheme
 *
 * A self-contained React Native theming layer (no WDK dependency) that powers
 * the light/dark toggle. Wrap the app once:
 *
 *   <KaleidoUIProvider defaultMode="dark" onModeChange={persist}>
 *     <App />
 *   </KaleidoUIProvider>
 *
 * Then in any component:
 *
 *   const { theme, mode, toggleMode } = useKaleidoTheme()
 *   <View style={{ backgroundColor: theme.background }} />
 *
 * The provider is both controlled (`mode` prop) and uncontrolled (`defaultMode`).
 * Pass `fontFamily` once Satoshi is loaded so every KText picks it up.
 */
import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { makeTheme, type KaleidoTheme, type ThemeMode } from '../tokens/theme'

interface KaleidoThemeContextValue {
  theme: KaleidoTheme
  mode: ThemeMode
  /** App-wide font family (e.g. 'Satoshi'); undefined → system default. */
  fontFamily?: string
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const KaleidoThemeContext = createContext<KaleidoThemeContextValue | null>(null)

export interface KaleidoUIProviderProps {
  children: ReactNode
  /** Controlled mode. When set, the provider does not manage its own state. */
  mode?: ThemeMode
  /** Initial mode for the uncontrolled provider. Defaults to 'dark' (brand). */
  defaultMode?: ThemeMode
  /** Fires on every mode change — use to persist the user's choice. */
  onModeChange?: (mode: ThemeMode) => void
  /** App-wide font family applied by KText (pass 'Satoshi' once loaded). */
  fontFamily?: string
}

export function KaleidoUIProvider({
  children,
  mode: controlledMode,
  defaultMode = 'dark',
  onModeChange,
  fontFamily,
}: KaleidoUIProviderProps) {
  const [internalMode, setInternalMode] = useState<ThemeMode>(defaultMode)
  const activeMode = controlledMode ?? internalMode

  const setMode = (next: ThemeMode) => {
    if (controlledMode === undefined) setInternalMode(next)
    onModeChange?.(next)
  }
  const toggleMode = () => setMode(activeMode === 'dark' ? 'light' : 'dark')

  const value = useMemo<KaleidoThemeContextValue>(
    () => ({ theme: makeTheme(activeMode), mode: activeMode, fontFamily, setMode, toggleMode }),
    // setMode/toggleMode are stable enough for this context's purpose
    [activeMode, fontFamily]
  )

  return <KaleidoThemeContext.Provider value={value}>{children}</KaleidoThemeContext.Provider>
}

/** Access the active theme. Falls back to the dark theme if no provider is mounted. */
export function useKaleidoTheme(): KaleidoThemeContextValue {
  const ctx = useContext(KaleidoThemeContext)
  if (ctx) return ctx
  // Graceful fallback keeps components renderable in isolation (tests, storybook).
  return {
    theme: makeTheme('dark'),
    mode: 'dark',
    fontFamily: undefined,
    setMode: () => {},
    toggleMode: () => {},
  }
}
