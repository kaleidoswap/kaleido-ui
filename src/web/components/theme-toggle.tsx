import { Icon } from '../primitives/icon'
import { useThemeMode, type ThemeMode, type UseThemeModeOptions } from '../hooks/use-theme-mode'
import { cn } from '../utils/cn'

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

/** The pill: sun and moon, with a raised thumb under the current mode. */
function ThemeSwitch({ mode, onModeChange, className }: ThemeSwitchProps) {
  const dark = mode === 'dark'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      data-slot="theme-toggle"
      data-mode={mode}
      onClick={() => onModeChange(dark ? 'light' : 'dark')}
      className={cn(
        'group relative inline-flex h-9 w-[4.5rem] shrink-0 items-center rounded-full bg-foreground/8 p-1 shadow-inner ring-1 ring-inset ring-secondary/20 transition-all duration-300',
        'hover:ring-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft',
        className,
      )}
    >
      {/* The thumb slides under whichever glyph is current. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-1 top-1 size-7 rounded-full bg-card bg-gradient-card shadow-raised transition-transform duration-300 ease-out motion-reduce:transition-none',
          dark ? 'translate-x-7' : 'translate-x-0',
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'relative z-10 flex size-7 items-center justify-center transition-colors duration-300',
          dark ? 'text-muted-foreground group-hover:text-foreground/80' : 'text-brand',
        )}
      >
        <Icon name="light_mode" size="sm" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'relative z-10 flex size-7 items-center justify-center transition-colors duration-300',
          dark ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground/80',
        )}
      >
        <Icon name="dark_mode" size="sm" />
      </span>
    </button>
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
