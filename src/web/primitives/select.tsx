import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Icon } from './icon'
import { cn } from '../utils/cn'
import { fieldSurface } from '../utils/field-styles'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Compact pill style — matches the FilterDropdown button aesthetic. */
  compact?: boolean
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, compact = false, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex items-center justify-between transition-all outline-none',
      compact
        ? [
            'w-auto gap-1 rounded-2xl bg-foreground/[0.09] px-2 py-1.5 text-caption leading-none shadow-raised backdrop-blur-md',
            'hover:bg-secondary/15 data-[state=open]:bg-secondary/20 data-[state=open]:text-secondary-content data-[state=open]:shadow-glow-primary-soft',
          ]
        : [
            'w-full gap-3 px-4 py-3 text-left text-body',
            fieldSurface,
            'data-[state=open]:ring-primary/50 data-[state=open]:shadow-glow-primary-soft',
          ],
      'focus:ring-1 focus:ring-primary/50 focus:shadow-glow-primary-soft',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icon
        name="expand_more"
        className={cn(
          'shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180',
          compact
            ? 'text-icon-xs text-foreground/55 group-data-[state=open]:text-secondary-content'
            : 'text-icon-lg text-muted-foreground group-hover:text-secondary-content group-data-[state=open]:text-secondary-content',
        )}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative min-w-[8rem] overflow-hidden rounded-2xl bg-popover/95 bg-gradient-card p-2 shadow-popover ring-1 ring-inset ring-secondary/20 backdrop-blur',
        'z-[var(--z-popover)]',
        position === 'popper' && 'w-[var(--radix-select-trigger-width)]',
        className
      )}
      position={position}
      sideOffset={8}
      {...props}
    >
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-3 py-1.5 text-caption font-semibold text-secondary-content/80', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  description?: string
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, description, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center justify-between rounded-xl px-3 py-3 text-body outline-none transition-colors',
      'data-[highlighted]:bg-secondary/15',
      'data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:ring-1 data-[state=checked]:ring-inset data-[state=checked]:ring-primary/40 data-[state=checked]:text-brand',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <div className="min-w-0">
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {description && (
        <p className="mt-0.5 text-icon-xxs text-muted-foreground">{description}</p>
      )}
    </div>
    <SelectPrimitive.ItemIndicator>
      <Icon name="check" className="text-icon-md text-brand" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
