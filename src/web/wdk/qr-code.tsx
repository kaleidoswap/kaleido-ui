import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '../utils/cn'
import { Button } from '../primitives/button'

export interface QRCodeProps {
  value: string
  label?: string
  caption?: string
  size?: number
  /**
   * Accent hex/hsl used for the subtle ring glow around the QR frame.
   * Defaults to the primary brand color.
   */
  accentColor?: string
  onCopy?: () => void
  copied?: boolean
  className?: string
}

export function QRCode({
  value,
  label,
  caption,
  size = 200,
  accentColor,
  onCopy,
  copied = false,
  className,
}: QRCodeProps) {
  const [internalCopied, setInternalCopied] = useState(false)

  const handleCopy = async () => {
    if (onCopy) {
      onCopy()
      return
    }
    try {
      await navigator.clipboard.writeText(value)
      setInternalCopied(true)
      setTimeout(() => setInternalCopied(false), 2000)
    } catch {
      // clipboard permission denied
    }
  }

  const isCopied = copied || internalCopied

  // Build a subtle glow using the accent colour when provided
  const ringStyle = accentColor
    ? { boxShadow: `0 0 0 1px ${accentColor}30, 0 4px 24px ${accentColor}18` }
    : undefined

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {label && (
        <p className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}

      {/* QR frame — card with a subtle accent ring */}
      <div
        className="rounded-2xl border border-border bg-card p-4"
        style={ringStyle}
      >
        <QRCodeSVG
          value={value || ' '}
          size={size}
          bgColor="transparent"
          fgColor="var(--foreground)"
          level="M"
          className="block rounded-lg"
        />
      </div>

      {/* Caption + copy row */}
      {(caption !== undefined || onCopy !== undefined) && (
        <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
          {caption && (
            <p className="min-w-0 flex-1 truncate font-mono text-tiny text-muted-foreground">
              {caption}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleCopy}
            className={cn(
              'ml-auto h-7 shrink-0 gap-1 rounded-lg text-xxs font-bold uppercase tracking-widest',
              isCopied && 'text-primary',
            )}
          >
            <span className="material-symbols-outlined text-[13px]">
              {isCopied ? 'check' : 'content_copy'}
            </span>
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      )}
    </div>
  )
}
