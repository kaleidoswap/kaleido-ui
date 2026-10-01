import { useMemo, type JSX } from 'react'
import encodeQR from 'qr'

import { brandMark } from '../../tokens/brand'
import { kaleidoswapMarkArtwork } from '../assets/kaleidoswap-brand'

export interface QrCodeProps {
  value: string
  size?: number
  className?: string
  /**
   * 'onLight' (default) renders dark modules on a white card — use inside a
   * white container. 'onDark' renders white modules on a transparent
   * background so the QR sits directly on the app background.
   */
  tone?: 'onLight' | 'onDark'
}

function isFinderPattern(row: number, col: number, size: number): boolean {
  if (row < 7 && col < 7) return true
  if (row < 7 && col >= size - 7) return true
  if (row >= size - 7 && col < 7) return true
  return false
}

function isLogoZone(row: number, col: number, size: number, logoModules: number): boolean {
  const center = size / 2
  const half = logoModules / 2
  return row >= center - half && row < center + half && col >= center - half && col < center + half
}

function renderFinderPattern(
  originX: number,
  originY: number,
  moduleSize: number,
  fg: string,
  bg: string,
  key: string
): JSX.Element[] {
  const r = moduleSize * 0.6
  return [
    <rect
      key={`${key}-o`}
      x={originX}
      y={originY}
      width={moduleSize * 7}
      height={moduleSize * 7}
      rx={r * 2.5}
      ry={r * 2.5}
      fill={fg}
    />,
    <rect
      key={`${key}-i`}
      x={originX + moduleSize}
      y={originY + moduleSize}
      width={moduleSize * 5}
      height={moduleSize * 5}
      rx={r * 1.8}
      ry={r * 1.8}
      fill={bg}
    />,
    <rect
      key={`${key}-c`}
      x={originX + moduleSize * 2}
      y={originY + moduleSize * 2}
      width={moduleSize * 3}
      height={moduleSize * 3}
      rx={r * 1.2}
      ry={r * 1.2}
      fill={fg}
    />,
  ]
}

const LOGO_VIEWBOX = Number(kaleidoswapMarkArtwork.viewBox.split(' ')[2])
const LOGO_PAINT = { violet: brandMark.violet, green: brandMark.green, mint: brandMark.mint }
const LOGO_PATHS = (
  <>
    {kaleidoswapMarkArtwork.paths.map((path, index) => (
      <path key={index} d={path.d} fill={path.fill === 'text' ? 'currentColor' : LOGO_PAINT[path.fill]} />
    ))}
  </>
)

export function QrCode({ value, size = 160, className, tone = 'onLight' }: QrCodeProps) {
  const svgContent = useMemo(() => {
    if (!value) return null

    const matrix = encodeQR(value, 'raw', { ecc: 'medium', border: 0 })
    const n = matrix.length
    const moduleSize = 10
    const quietZone = moduleSize * 2
    const svgSize = n * moduleSize + quietZone * 2

    // onDark renders white modules on a transparent background (the QR sits
    // directly on the app background); onLight is the classic dark-on-white.
    const fg = tone === 'onDark' ? '#ffffff' : '#040404'
    const bg = tone === 'onDark' ? 'transparent' : '#ffffff'

    const logoModules = Math.ceil(n * 0.2)
    const logoZoneSize = logoModules % 2 === 0 ? logoModules + 1 : logoModules
    const elements: JSX.Element[] = []
    const dotRadius = moduleSize * 0.42

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (isFinderPattern(row, col, n)) continue
        if (isLogoZone(row, col, n, logoZoneSize)) continue
        if (!matrix[row][col]) continue

        const cx = quietZone + col * moduleSize + moduleSize / 2
        const cy = quietZone + row * moduleSize + moduleSize / 2
        elements.push(<circle key={`d-${row}-${col}`} cx={cx} cy={cy} r={dotRadius} fill={fg} />)
      }
    }

    const finderPositions: [number, number][] = [
      [0, 0],
      [0, n - 7],
      [n - 7, 0],
    ]
    for (const [r, c] of finderPositions) {
      elements.push(
        ...renderFinderPattern(
          quietZone + c * moduleSize,
          quietZone + r * moduleSize,
          moduleSize,
          fg,
          bg,
          `fp-${r}-${c}`
        )
      )
    }

    const centerX = quietZone + (n * moduleSize) / 2
    const centerY = quietZone + (n * moduleSize) / 2
    const logoCircleR = logoZoneSize * moduleSize * 0.52

    elements.push(<circle key="logo-bg" cx={centerX} cy={centerY} r={logoCircleR} fill={bg} />)

    const logoBox = logoCircleR * 1.35
    const logoX = centerX - logoBox / 2
    const logoY = centerY - logoBox / 2
    const scale = logoBox / LOGO_VIEWBOX

    elements.push(
      <g key="logo" transform={`translate(${logoX}, ${logoY}) scale(${scale})`}>
        {LOGO_PATHS}
      </g>
    )

    return (
      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {elements}
      </svg>
    )
  }, [value, tone])

  return (
    <div className={className} style={{ width: size, height: size }}>
      {svgContent}
    </div>
  )
}
