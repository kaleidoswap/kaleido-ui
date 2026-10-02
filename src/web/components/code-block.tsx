import { CopyButton } from './copy-button'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

export interface CodeBlockProps {
  /** The code, shown as is and copied whole. */
  code: string
  /** What the block is, for its name and the copy button's: "install command". Defaults to "code". */
  label?: string
  /** Shown as a small label above the code. No syntax highlighting. */
  language?: string
  className?: string
}

/**
 * Monospaced code in a `<pre>` that scrolls sideways rather than wrapping, with
 * a copy button in its top-right corner.
 */
export function CodeBlock({ code, label = 'code', language, className }: CodeBlockProps) {
  return (
    <figure
      data-slot="code-block"
      aria-label={label}
      className={cn('relative m-0 min-w-0 rounded-xl bg-muted/60 shadow-inner ring-1 ring-inset ring-secondary/15', className)}
    >
      {language && (
        <figcaption className={cn('px-4 pt-3 text-muted-foreground', eyebrow)}>{language}</figcaption>
      )}
      <div className="absolute right-2 top-2">
        <CopyButton value={code} label={label} />
      </div>
      <pre className="m-0 overflow-x-auto p-4 pr-12 font-mono text-caption text-foreground">
        <code>{code}</code>
      </pre>
    </figure>
  )
}
