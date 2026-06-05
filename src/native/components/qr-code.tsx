/**
 * QrCode (native) — React Native port of the web `QrCode` component.
 *
 * Renders the KaleidoSwap-branded QR: rounded finder patterns, dot-style data
 * modules and a center logo. Identical visual design to the web version
 * (`src/web/components/qr-code.tsx`) but built with `react-native-svg`.
 */
import React, { useMemo } from 'react'
import { View } from 'react-native'
import Svg, { Rect, Circle, G, Path } from 'react-native-svg'
import encodeQR from 'qr'

export interface QrCodeProps {
  value: string
  /** Rendered square size in px (default 160). */
  size?: number
  /** Foreground (module) color. Default near-black. */
  color?: string
  /** Background color used for finder eyes + logo disc. Default white. */
  backgroundColor?: string
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
): React.ReactNode[] {
  const r = moduleSize * 0.6
  return [
    <Rect
      key={`${key}-o`}
      x={originX}
      y={originY}
      width={moduleSize * 7}
      height={moduleSize * 7}
      rx={r * 2.5}
      ry={r * 2.5}
      fill={fg}
    />,
    <Rect
      key={`${key}-i`}
      x={originX + moduleSize}
      y={originY + moduleSize}
      width={moduleSize * 5}
      height={moduleSize * 5}
      rx={r * 1.8}
      ry={r * 1.8}
      fill={bg}
    />,
    <Rect
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

const LOGO_VIEWBOX = 412
const LogoPaths = () => (
  <>
    <Path d="M137.306 411.865H0.000244141L68.6795 343.29L137.306 411.865Z" fill="#6F32FF" />
    <Path d="M0 0H137.306L68.6267 68.574L0 0Z" fill="#6F32FF" />
    <Path d="M137.148 274.559H274.455L411.708 411.866H274.401L137.148 274.559Z" fill="#17B581" />
    <Path
      d="M137.149 274.559L68.6274 205.933L137.201 137.306L274.455 137.411L205.776 206.038L274.456 274.559H137.149Z"
      fill="#15E99A"
    />
    <Path d="M274.479 0.104797H411.786L274.533 137.411H137.226L274.479 0.104797Z" fill="#17B581" />
  </>
)

export function QrCode({
  value,
  size = 160,
  color = '#040404',
  backgroundColor = '#ffffff',
}: QrCodeProps) {
  const { elements, svgSize } = useMemo(() => {
    if (!value) return { elements: [] as React.ReactNode[], svgSize: 0 }

    const matrix = encodeQR(value, 'raw', { ecc: 'medium', border: 0 })
    const n = matrix.length
    const moduleSize = 10
    const quietZone = moduleSize * 2
    const computedSize = n * moduleSize + quietZone * 2

    const fg = color
    const bg = backgroundColor

    const logoModules = Math.ceil(n * 0.2)
    const logoZoneSize = logoModules % 2 === 0 ? logoModules + 1 : logoModules
    const els: React.ReactNode[] = []
    const dotRadius = moduleSize * 0.42

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (isFinderPattern(row, col, n)) continue
        if (isLogoZone(row, col, n, logoZoneSize)) continue
        if (!matrix[row][col]) continue

        const cx = quietZone + col * moduleSize + moduleSize / 2
        const cy = quietZone + row * moduleSize + moduleSize / 2
        els.push(<Circle key={`d-${row}-${col}`} cx={cx} cy={cy} r={dotRadius} fill={fg} />)
      }
    }

    const finderPositions: [number, number][] = [
      [0, 0],
      [0, n - 7],
      [n - 7, 0],
    ]
    for (const [r, c] of finderPositions) {
      els.push(
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

    els.push(<Circle key="logo-bg" cx={centerX} cy={centerY} r={logoCircleR} fill={bg} />)

    const logoBox = logoCircleR * 1.35
    const logoX = centerX - logoBox / 2
    const logoY = centerY - logoBox / 2
    const scale = logoBox / LOGO_VIEWBOX

    els.push(
      <G key="logo" transform={`translate(${logoX}, ${logoY}) scale(${scale})`}>
        <LogoPaths />
      </G>
    )

    return { elements: els, svgSize: computedSize }
  }, [value, color, backgroundColor])

  if (!value || svgSize === 0) {
    return <View style={{ width: size, height: size }} />
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {elements}
      </Svg>
    </View>
  )
}

export default QrCode
