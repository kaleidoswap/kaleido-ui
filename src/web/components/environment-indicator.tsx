import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

export interface EnvironmentIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The network's own name, for someone who knows it: "Mutinynet", "Mainnet". */
  name: string
  /** The same fact for someone who does not: "Test network", "Live network". */
  qualifier: string
  /** A test environment: the amber accent. A live one is green. */
  isTest: boolean
  className?: string
}

/**
 * Which environment this is, on every page — the live one included, which is
 * where being wrong costs money. Two deployments open in adjacent tabs are told
 * apart by it.
 *
 * The words are the indicator and the tone is only an accent on them, so the
 * distinction survives greyscale. Both halves are shown: the network's name,
 * and in plain words whether it is a test or a live one. It is a `status`: a
 * fact a reader may need to check before acting.
 */
export function EnvironmentIndicator({ name, qualifier, isTest, className, ...rest }: EnvironmentIndicatorProps) {
  return (
    <span
      role="status"
      data-slot="environment-indicator"
      data-environment={isTest ? 'test' : 'live'}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1',
        isTest ? 'bg-warning/10 text-warning-fg' : 'bg-success/10 text-success-fg',
        className
      )}
      {...rest}
    >
      <span className="text-caption font-semibold">{name}</span>
      {/* The eyebrow's tracking, at caption size: the half a reader who does
          not know network names depends on is set where they can read it. */}
      <span className={cn(eyebrow, 'text-caption')}>{qualifier}</span>
    </span>
  )
}
