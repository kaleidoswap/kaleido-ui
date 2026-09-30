/**
 * Component and utility sizing tokens that do not belong to typography.
 */
/**
 * The spacing unit — one step of every padding, margin, gap and size utility
 * (`p-4` is 4 units). Tailwind's default is 0.25rem (4px); KaleidoSwap runs a
 * little airier at 4.5px, so a label and its field, or two stacked rows, do
 * not sit on top of each other.
 */
export const spacingUnit = '0.28125rem'

export const sizing = {
  scrollbar: '2px',
  scrollbarHover: '6px',
  scrollbarThumbMin: '24px',
} as const
