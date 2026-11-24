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
    'group/tabs relative items-center gap-2 rounded-xl bg-card text-muted-foreground shadow-raised',
    size === 'compact' ? 'h-10 p-1' : 'h-12 p-1.5',
    fullWidth ? 'flex w-full' : 'inline-flex justify-center'
  )

/** One option of the bar; a Radix trigger takes the green fill by its `data-state`. */
const tabsTriggerClass = ({ size, fullWidth }: TabsLook) =>
  cn(
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-caption font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    size === 'compact' ? 'px-3 py-1.5' : 'px-4 py-2',
    fullWidth && 'flex-1',
    // The hover is the Bottom navigation's: the violet wash and the violet label, a small press on click. The chosen option keeps its own text colour.
    'relative z-10 text-foreground/70 hover-gradient-violet hover:text-secondary-content active:scale-[0.97]',
    'data-[state=active]:hover:text-primary-foreground aria-checked:hover:text-primary-foreground',
    'data-[state=active]:bg-primary active-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-button-primary data-[state=active]:hover:brightness-110',
    // Once the bar has measured its sliding indicator, the indicator is the fill: the chosen option keeps only its text colour.
    slidingClass
  )

/** The same green fill for a checked radio, which has no `data-state`. */
const tabsCheckedClass =
  'bg-primary bg-gradient-primary text-primary-foreground shadow-button-primary hover:bg-primary hover:text-primary-foreground hover:brightness-110'

/** Drops the chosen option's own fill when the bar slides one indicator under it (`data-sliding` on the bar). */
const slidingClass =
  'group-data-[sliding=true]/tabs:data-[state=active]:!bg-transparent group-data-[sliding=true]/tabs:data-[state=active]:![background-image:none] group-data-[sliding=true]/tabs:data-[state=active]:!shadow-none group-data-[sliding=true]/tabs:aria-checked:!bg-transparent group-data-[sliding=true]/tabs:aria-checked:![background-image:none] group-data-[sliding=true]/tabs:aria-checked:!shadow-none'

interface IndicatorBox {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Measures the chosen option of a bar (`data-state="active"` or `aria-checked`) and keeps
 * it up to date, so one indicator can slide from option to option instead of each
 * option filling in place. `null` until measured (server render, first paint): the
 * options then draw their own fill, so a bar is never without a visible choice.
 */
function useActiveIndicator<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [box, setBox] = React.useState<IndicatorBox | null>(null)
  React.useLayoutEffect(() => {
    const list = ref.current
    if (!list) return
    const measure = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"], [aria-checked="true"]')
      setBox((previous) => {
        if (!active) return null
        const next = { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight }
        return previous && previous.left === next.left && previous.top === next.top && previous.width === next.width && previous.height === next.height
          ? previous
          : next
      })
    }
    measure()
    if (typeof ResizeObserver === 'undefined' || typeof MutationObserver === 'undefined') return
    const resize = new ResizeObserver(measure)
    resize.observe(list)
    list.querySelectorAll('button').forEach((button) => resize.observe(button))
    const mutate = new MutationObserver(measure)
    mutate.observe(list, { attributes: true, attributeFilter: ['data-state', 'aria-checked'], subtree: true, childList: true })
    return () => {
      resize.disconnect()
      mutate.disconnect()
    }
  }, [])
  return { ref, box }
}

/** The one green fill that slides under the chosen option. Decorative. */
function ActiveIndicator({ box }: { box: IndicatorBox | null }) {
  if (!box) return null
  return (
    <span
      aria-hidden="true"
      data-slot="tabs-indicator"
      className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-primary bg-gradient-primary shadow-button-primary transition-[transform,width,height] duration-500 [transition-timing-function:cubic-bezier(0.45,0,0.25,1)] motion-reduce:transition-none"
      style={{ width: box.width, height: box.height, transform: `translate(${box.left}px, ${box.top}px)` }}
    />
  )
}

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
    const { ref: listRef, box } = useActiveIndicator<HTMLDivElement>()
    const setRefs = (node: HTMLDivElement | null) => {
      listRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
    const { children, ...rest } = props
    return (
      <TabsLookContext.Provider value={look}>
        <TabsPrimitive.List ref={setRefs} data-sliding={box ? 'true' : 'false'} className={cn(tabsListClass(look), className)} {...rest}>
          <ActiveIndicator box={box} />
          {children}
        </TabsPrimitive.List>
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
  /** A glyph before the label (an `<Icon size="sm" />`). */
  icon?: React.ReactNode
  /** A short second line under the label ("RGB Lightning", "Spark AMM"). */
  description?: React.ReactNode
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
  const { ref: groupRef, box } = useActiveIndicator<HTMLDivElement>()
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
      ref={groupRef}
      data-slot="segmented-tabs"
      data-size={size}
      data-sliding={box ? 'true' : 'false'}
      onKeyDown={onKeyDown}
      className={cn(tabsListClass(look), className)}
    >
      <ActiveIndicator box={box} />
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
            {option.description ? (
              <span className="flex flex-col items-center gap-0.5">
                <span className="inline-flex items-center gap-1.5">
                  {option.icon}
                  {option.label}
                </span>
                <span className="text-xxs font-normal leading-tight opacity-70">{option.description}</span>
              </span>
            ) : (
              <>
                {option.icon}
                {option.label}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

// The bar's classes, for a control that is not a Tabs root but must wear the same look (FilterChipGroup's segmented variant).
export { Tabs, TabsList, TabsTrigger, TabsContent, SegmentedTabs, ActiveIndicator, useActiveIndicator, tabsListClass, tabsTriggerClass, tabsCheckedClass }
export type { TabsListProps, TabsLook }
