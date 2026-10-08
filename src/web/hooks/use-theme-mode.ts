import { useCallback, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface UseThemeModeOptions {
  /** Mode when nothing is stored and the document carries no `.dark`/`.light`. */
  defaultMode?: ThemeMode
  /** localStorage key that remembers the choice; `null` to not remember it. */
  storageKey?: string | null
}

const DEFAULT_KEY = 'kaleido-ui:theme'

const readStored = (key: string | null): ThemeMode | null => {
  if (!key || typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(key)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const readDocument = (): ThemeMode | null => {
  if (typeof document === 'undefined') return null
  const root = document.documentElement.classList
  if (root.contains('light')) return 'light'
  if (root.contains('dark')) return 'dark'
  return null
}

/**
 * Apply a mode to the document root. kaleido-ui's tokens switch on a single
 * `.dark` / `.light` class there (dark is the brand default), so exactly one
 * of the two is set.
 */
export function applyThemeMode(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.classList.toggle('light', mode === 'light')
  root.style.colorScheme = mode
}

/**
 * The page's light/dark mode, kept on the document root and remembered in
 * localStorage. Starts from the stored choice, else the class already on the
 * root, else `defaultMode` (dark). Safe on the server.
 */
export function useThemeMode({ defaultMode = 'dark', storageKey = DEFAULT_KEY }: UseThemeModeOptions = {}) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => readStored(storageKey) ?? readDocument() ?? defaultMode,
  )

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next)
      if (!storageKey || typeof window === 'undefined') return
      try {
        window.localStorage.setItem(storageKey, next)
      } catch {
        // Private mode or blocked storage: the choice just isn't remembered.
      }
    },
    [storageKey],
  )

  const toggleMode = useCallback(() => setMode(mode === 'dark' ? 'light' : 'dark'), [mode, setMode])

  return { mode, setMode, toggleMode }
}
