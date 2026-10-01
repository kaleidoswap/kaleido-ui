import { cn } from '../utils/cn'

export interface HaloBackdropProps {
  /**
   * Drift the blobs slowly (22 to 34 s cycles). Default true. Motion always
   * stops under `prefers-reduced-motion: reduce`.
   */
  animated?: boolean
  className?: string
}

/**
 * The KaleidoSwap halo: three large, heavily blurred brand-colour blobs
 * (mint, violet, mint) drifting slowly behind a screen.
 *
 * It fills its nearest positioned ancestor and sits behind that ancestor's
 * content, so give the parent `relative isolate` (the `isolate` keeps the
 * `-z-10` from slipping behind the page). Decorative: hidden from assistive
 * technology and from pointer events. Recolour it with `--halo-primary` and
 * `--halo-secondary`.
 *
 * ```tsx
 * <div className="relative isolate min-h-screen">
 *   <HaloBackdrop />
 *   …
 * </div>
 * ```
 */
export function HaloBackdrop({ animated = true, className }: HaloBackdropProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="halo-backdrop"
      data-animated={animated ? 'true' : 'false'}
      className={cn('kui-halo pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      <div className="kui-halo-blob kui-halo-blob-a" />
      <div className="kui-halo-blob kui-halo-blob-b" />
      <div className="kui-halo-blob kui-halo-blob-c" />
    </div>
  )
}
