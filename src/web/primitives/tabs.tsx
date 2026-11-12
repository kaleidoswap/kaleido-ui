import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../utils/cn'

/** `default` is the 54 px bar; `compact` the 45 px one that fits a card header. */
export type TabsSize = 'default' | 'compact'

interface TabsLook {
  size: TabsSize
  fullWidth: boolean
}

const TabsLookContext = React.createContext<TabsLook>({ size: 'default', fullWidth: false })

/** The bar: `TabsList` and `SegmentedTabs` draw the same one. */
const tabsListClass = ({ size, fullWidth }: TabsLook) =>
  cn(
    'items-center gap-2 rounded-xl bg-card text-muted-foreground shadow-raised',
    size === 'compact' ? 'h-10 p-1' : 'h-12 p-1.5',
    fullWidth ? 'flex w-full' : 'inline-flex justify-center'
  )

/** One option of the bar; a Radix trigger takes the green fill by its `data-state`. */
const tabsTriggerClass = ({ size, fullWidth }: TabsLook) =>
  cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-caption font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    size === 'compact' ? 'px-3 py-1.5' : 'px-4 py-2',
    fullWidth && 'flex-1',
    'text-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground',
    'data-[state=active]:bg-primary active-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-button-primary data-[state=active]:hover:brightness-110'
  )

/** The same green fill for a checked radio, which has no `data-state`. */
const tabsCheckedClass =
  'bg-primary bg-gradient-primary text-primary-foreground shadow-button-primary hover:bg-primary hover:text-primary-foreground hover:brightness-110'

const Tabs = TabsPrimitive.Root

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** `compact` is the 45 px bar for a card header. */
  size?: TabsSize
  /** The bar fills its row and the tabs share it equally. */
  fullWidth?: boolean
}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, size = 'default', fullWidth = false, ...props }, ref) => {
    const look = React.useMemo(() => ({ size, fullWidth }), [size, fullWidth])
    return (
      <TabsLookContext.Provider value={look}>
        <TabsPrimitive.List ref={ref} className={cn(tabsListClass(look), className)} {...props} />
      </TabsLookContext.Provider>
    )
  }
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerClass(React.useContext(TabsLookContext)), className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-fade-in',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export interface SegmentedTabsOption<TValue extends string = string> {
  value: TValue
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedTabsProps<TValue extends string = string> {
  options: readonly SegmentedTabsOption<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
  /** `compact` is the 45 px bar for a card header (a 7D / 30D / 90D period). */
  size?: TabsSize
  /** Fill the row, the options sharing it equally. On by default; off, the bar hugs its options. */
  fullWidth?: boolean
  /** The group's name. One of the two is required: a radio group needs a name. */
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

/**
 * The Tabs bar as a radio group: one choice of a few, in a form or dialog
 * (Test / Live) or a card header (7D / 30D / 90D), where no tab panel is
 * switched and the choice is a value. `role="radiogroup"` with a
 * `role="radio"` per option; one Tab stop, the arrow keys (and Home / End)
 * move and select, skipping disabled options. Controlled: `value` and
 * `onValueChange`.
 */
function SegmentedTabs<TValue extends string = string>({
  options,
  value,
  onValueChange,
  size = 'default',
  fullWidth = true,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
}: SegmentedTabsProps<TValue>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const look = { size, fullWidth }
  const enabled = options.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled)
  // The Tab stop: the checked option, or the first that can be checked.
  const stop = options.some((option) => option.value === value && !option.disabled) ? value : enabled[0]?.option.value

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (enabled.length === 0) return
    const at = Math.max(0, enabled.findIndex(({ option }) => option.value === value))
    let next: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (at + 1) % enabled.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (at - 1 + enabled.length) % enabled.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = enabled.length - 1
    if (next === undefined) return
    event.preventDefault()
    const target = enabled[next]
    onValueChange(target.option.value)
    refs.current[target.index]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-slot="segmented-tabs"
      data-size={size}
      onKeyDown={onKeyDown}
      className={cn(tabsListClass(look), className)}
    >
      {options.map((option, index) => {
        const checked = option.value === value
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={option.value === stop ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(tabsTriggerClass(look), checked && tabsCheckedClass)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, SegmentedTabs }
export type { TabsListProps }
