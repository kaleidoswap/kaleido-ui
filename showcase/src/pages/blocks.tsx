import type { ReactNode } from 'react'
import { cn } from 'kaleido-ui'
import { eyebrow } from 'kaleido-ui'
import { slug } from '../search/slug'

// The showcase's one block: no card, straight on the page. A violet large
// eyebrow names it, a line under it says when to reach for it, then the demo.

/** A demo: the eyebrow in violet, what it is for under it, then the component. */
export function Demo({
  title,
  use,
  children,
  className,
}: {
  title: string
  use?: ReactNode
  children: ReactNode
  className?: string
  /** Kept so the old call sites still compile: blocks are not cards any more, they have no row to stretch to. */
  align?: 'top' | 'bottom'
}) {
  return (
    <section className={cn('min-w-0', className)} data-search-key={slug(title)}>
      <h3 className={cn('m-0', eyebrow, 'text-secondary-content')}>{title}</h3>
      {use && <p className="m-0 mt-1.5 text-caption text-muted-foreground">{use}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** Blocks side by side from the wide breakpoint, with room between them. */
export const Grid = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-x-10 gap-y-16 xl:grid-cols-2 [&>*]:min-w-0">{children}</div>
)

/** The violet eyebrow on its own, for a block that is not a Demo (a panel with its own layout). */
export function BlockTitle({ children, className }: { children: ReactNode; className?: string }) {
  // The block is the element after the title; the search outlines that one.
  return (
    <h3
      className={cn('m-0', eyebrow, 'text-secondary-content', className)}
      data-search-key={typeof children === 'string' ? slug(children) : undefined}
      data-search-after
    >
      {children}
    </h3>
  )
}
