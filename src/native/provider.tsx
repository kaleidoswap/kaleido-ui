/**
 * KaleidoThemeProvider
 *
 * Wraps WDK's ThemeProvider with KaleidoSwap's brand config.
 *
 * Usage:
 *   import { KaleidoThemeProvider } from '@kaleidorg/kaleido-ui/native'
 *
 *   <KaleidoThemeProvider>
 *     <App />
 *   </KaleidoThemeProvider>
 */
import type { ReactNode } from 'react'
import { ThemeProvider } from '@tetherto/wdk-uikit-react-native'
import { kaleidoswapBrandConfig } from './theme'

interface KaleidoThemeProviderProps {
  children: ReactNode
  /** Override the default brand config */
  brandConfig?: typeof kaleidoswapBrandConfig
  /** Default theme mode */
  defaultMode?: 'light' | 'dark'
}

export function KaleidoThemeProvider({
  children,
  brandConfig,
  defaultMode = 'dark',
}: KaleidoThemeProviderProps) {
  return (
    <ThemeProvider
      brandConfig={brandConfig ?? kaleidoswapBrandConfig}
      defaultMode={defaultMode}
    >
      {children}
    </ThemeProvider>
  )
}
