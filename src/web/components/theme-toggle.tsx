import { Icon } from '../primitives/icon'
import { Switch } from '../primitives/switch'
import { useThemeMode, type ThemeMode, type UseThemeModeOptions } from '../hooks/use-theme-mode'

export interface ThemeToggleProps extends UseThemeModeOptions {
  /**
   * Controlled mode. Pass it with `onModeChange` when the app owns the theme;
   * leave both out and the toggle runs itself: it sets `.dark` / `.light` on
   * the document root and remembers the choice (see `useThemeMode`).
   */
  mode?: ThemeMode
  onModeChange?: (mode: ThemeMode) => void
  className?: string
}

interface ThemeSwitchProps {
  mode: ThemeMode
  onModeChange: (mode: ThemeMode) => void
  className?: string
}

/** The base `Switch` in its wide form: sun and moon, checked = dark. */
function ThemeSwitch({ mode, onModeChange, className }: ThemeSwitchProps) {
  const dark = mode === 'dark'
  return (
    <Switch
      checked={dark}
      onCheckedChange={(next) => onModeChange(next ? 'dark' : 'light')}
      icons={{ off: <Icon name="light_mode" size="sm" />, on: <Icon name="dark_mode" size="sm" /> }}
      aria-label="Dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      data-slot="theme-toggle"
      data-mode={mode}
      className={className}
    />
  )
}

function SelfThemeToggle({ defaultMode, storageKey, onModeChange, className }: ThemeToggleProps) {
  const { mode, setMode } = useThemeMode({ defaultMode, storageKey })
  return (
    <ThemeSwitch
      mode={mode}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      className={className}
    />
  )
}

/**
 * Light/dark switch: a `role="switch"` pill (checked = dark) with a sun and a
 * moon. Uncontrolled by default — it applies and remembers the mode itself.
 */
export function ThemeToggle({ mode, onModeChange, ...rest }: ThemeToggleProps) {
  if (mode !== undefined && onModeChange) {
    return <ThemeSwitch mode={mode} onModeChange={onModeChange} className={rest.className} />
  }
  return <SelfThemeToggle onModeChange={onModeChange} {...rest} />
}
