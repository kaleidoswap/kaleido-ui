import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Icon } from './icon'
import { cn } from '../utils/cn'

const avatarVariants = cva(
  'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-bold text-secondary-foreground',
  {
    variants: {
      size: {
        sm: 'size-8 text-tiny',
        lg: 'size-10 text-caption',
      },
    },
    defaultVariants: { size: 'sm' },
  },
)

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof avatarVariants> {
  /** A photo or logo. Falls back to `initials`, then the person glyph, if it fails to load. */
  src?: string
  /**
   * Set it when the image says something the text beside it does not; the
   * avatar is then announced. Left out, the avatar is decorative.
   */
  alt?: string
  /** One or two letters, shown when there is no image. */
  initials?: string
}

/**
 * A circle with a picture, or a fallback — initials, else a person glyph — on
 * the brand's violet-to-info gradient. `sm` is 32px, `lg` 40px.
 *
 * Decorative by default (`aria-hidden`), because a name almost always sits
 * beside it. Pass `alt` when the image itself is the information.
 */
const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, src, alt, initials, ...props }, ref) => {
    const [failed, setFailed] = React.useState(false)
    React.useEffect(() => setFailed(false), [src])
    const showImage = Boolean(src) && !failed
    const meaningful = Boolean(alt) && showImage

    return (
      <span
        ref={ref}
        data-slot="avatar"
        aria-hidden={meaningful ? undefined : true}
        className={cn(
          avatarVariants({ size }),
          !showImage && 'bg-gradient-to-br from-secondary to-info',
          className,
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? ''}
            className="size-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : initials ? (
          <span className="uppercase">{initials.slice(0, 2)}</span>
        ) : (
          <Icon name="person" className={size === 'lg' ? 'text-icon-xl' : 'text-icon-md'} />
        )}
      </span>
    )
  },
)
Avatar.displayName = 'Avatar'

export { Avatar, avatarVariants }
