import { useRef, useEffect, useState, type FC } from 'react'
import type { NetworkType } from './network-badge'
import { protocolIcons } from '../assets/protocol-icons'

export interface MobileHeroAnimationProps {
  size?: number
  className?: string
  /** Override icon source path. When omitted, bundled icons are used. */
  iconBasePath?: string
}

const PROTOCOLS: Array<{ name: string; network: NetworkType; iconSuffix: string }> = [
  { name: 'Bitcoin',        network: 'Bitcoin', iconSuffix: 'bitcoin/bitcoin-logo.svg' },
  { name: 'Lightning',      network: 'LN',      iconSuffix: 'lightning/lightning.svg' },
  { name: 'RGB',            network: 'RGB20',   iconSuffix: 'rgb/rgb-logo.svg' },
  { name: 'Spark',          network: 'Spark',   iconSuffix: 'spark/Asterisk/Spark Asterisk White.svg' },
  { name: 'Arkade',         network: 'Arkade',  iconSuffix: 'arkade/arkade-icon.svg' },
  { name: 'Liquid',         network: 'Liquid',  iconSuffix: 'liquid/logo-liquid.svg' },
  { name: 'Taproot Assets', network: 'Taproot', iconSuffix: 'taproot-assets/tapass-logo.svg' },
]

const C = 140
const ORBIT_R = 118
const BADGE_SIZE = 40
const BADGE_HALF = BADGE_SIZE / 2
const N = PROTOCOLS.length

const PROTOCOL_COLORS: Record<string, string> = {
  Bitcoin: '#F7931A',
  LN:      '#fbbf24',
  RGB20:   '#EF4444',
  Spark:   '#FFFFFF',
  Arkade:  '#8B5CF6',
  Liquid:  '#22e1c9',
  Taproot: '#D1D6D8',
}

const hexPath = (r: number) => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${r * Math.cos(a)},${r * Math.sin(a)}`
  })
  return `M${pts.join('L')}Z`
}

const KEYFRAMES = `
@keyframes mha-orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes mha-counter-spin { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
`

export const MobileHeroAnimation: FC<MobileHeroAnimationProps> = ({
  size = 280,
  className,
  iconBasePath,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const anim = !reducedMotion && isVisible
  const scale = size / 280

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: size, height: size }}
    >
      <style>{KEYFRAMES}</style>

      {/* Scale wrapper — keeps everything in 280×280 design space */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 280, height: 280,
        transformOrigin: 'top left',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}>
        {/* SVG layer: background rings, connection lines, center */}
        <svg
          viewBox="0 0 280 280"
          width="280"
          height="280"
          style={{ position: 'absolute', inset: 0 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="mh-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0e9dff" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#8a5cf6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="mh-gp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#8a5cf6" />
            </linearGradient>
            <linearGradient id="mh-bp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e9dff" />
              <stop offset="100%" stopColor="#8a5cf6" />
            </linearGradient>
            <filter id="mh-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer pulsing ring */}
          <circle cx={C} cy={C} r={ORBIT_R} fill="none" stroke="#0e9dff" strokeWidth="1" strokeOpacity="0.25" opacity="0.4">
            {anim && (
              <>
                <animate attributeName="r" values={`${ORBIT_R};${Math.round(ORBIT_R * 1.12)};${ORBIT_R}`} dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
              </>
            )}
          </circle>

          {/* Inner dashed orbit ring */}
          <circle cx={C} cy={C} r={80} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Connection lines — rotate in sync with orbit */}
          <g>
            {anim && (
              <animateTransform
                attributeName="transform" type="rotate"
                from={`0 ${C} ${C}`} to={`360 ${C} ${C}`}
                dur="20s" repeatCount="indefinite"
              />
            )}
            {PROTOCOLS.map((protocol, i) => {
              const angle = (i / N) * 2 * Math.PI
              const dx = Math.cos(angle)
              const dy = Math.sin(angle)
              const x1 = C + dx * 28
              const y1 = C + dy * 28
              const x2 = C + dx * (ORBIT_R - BADGE_HALF)
              const y2 = C + dy * (ORBIT_R - BADGE_HALF)
              const color = PROTOCOL_COLORS[protocol.network] ?? '#ffffff'
              const dur = `${2 + i * 0.3}s`
              return (
                <g key={`line-${i}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={color} strokeWidth="0.8" strokeDasharray="2 4" opacity="0.25">
                    {anim && <animate attributeName="stroke-dashoffset" from="0" to="-12" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
                  </line>
                  <circle r="2" fill={color} opacity="0">
                    {anim && (
                      <>
                        <animate attributeName="cx" values={`${x1};${x2}`} dur={dur} repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${y1};${y2}`} dur={dur} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;0.85;0" dur={dur} repeatCount="indefinite" />
                        <animate attributeName="r" values="1.5;2.5;1.5" dur={dur} repeatCount="indefinite" />
                      </>
                    )}
                  </circle>
                </g>
              )
            })}
          </g>

          {/* Center ambient glow */}
          <circle cx={C} cy={C} r="42" fill="url(#mh-center-glow)">
            {anim && <animate attributeName="r" values="38;46;38" dur="4s" repeatCount="indefinite" />}
          </circle>

          {/* Pulsing energy ring 1 */}
          <circle cx={C} cy={C} r="29" fill="none" stroke="url(#mh-bp)" strokeWidth="1" opacity="0">
            {anim && (
              <>
                <animate attributeName="r" values="27;38" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0" dur="3s" repeatCount="indefinite" />
              </>
            )}
          </circle>

          {/* Pulsing energy ring 2 staggered */}
          <circle cx={C} cy={C} r="27" fill="none" stroke="url(#mh-gp)" strokeWidth="0.8" opacity="0">
            {anim && (
              <>
                <animate attributeName="r" values="27;36" dur="3s" repeatCount="indefinite" begin="1.5s" />
                <animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" begin="1.5s" />
              </>
            )}
          </circle>

          {/* Hexagonal border — rotates CW */}
          <g transform={`translate(${C},${C})`}>
            <g>
              {anim && (
                <animateTransform attributeName="transform" type="rotate"
                  from="0" to="360" dur="40s" repeatCount="indefinite" additive="sum" />
              )}
              <path d={hexPath(34)} fill="none" stroke="url(#mh-gp)" strokeWidth="1.5" opacity="0.4" filter="url(#mh-glow)">
                {anim && (
                  <>
                    <animate attributeName="opacity" values="0.3;0.65;0.3" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="1.5;2.5;1.5" dur="3s" repeatCount="indefinite" />
                  </>
                )}
              </path>
            </g>
          </g>

          {/* Inner hex fill — rotates CCW */}
          <g transform={`translate(${C},${C})`}>
            <g>
              {anim && (
                <animateTransform attributeName="transform" type="rotate"
                  from="0" to="-360" dur="40s" repeatCount="indefinite" additive="sum" />
              )}
              <path d={hexPath(32)} fill="rgba(10,15,30,0.75)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            </g>
          </g>

          {/* KaleidoSwap logo mark — pictogram (no triangle lines), 412-unit
              viewBox scaled to keep the same on-canvas footprint as before. */}
          <g transform={`translate(${C - 18.8},${C - 18.8}) scale(0.0912)`}>
            <path d="M137.306 411.865H0.000244141L68.6795 343.29L137.306 411.865Z" fill="#6F32FF" />
            <path d="M0 0H137.306L68.6267 68.574L0 0Z" fill="#6F32FF" />
            <path d="M137.148 274.559H274.455L411.708 411.866H274.401L137.148 274.559Z" fill="#17B581" />
            <path d="M137.149 274.559L68.6274 205.933L137.201 137.306L274.455 137.411L205.776 206.038L274.456 274.559H137.149Z" fill="#15E99A" />
            <path d="M274.479 0.104797H411.786L274.533 137.411H137.226L274.479 0.104797Z" fill="#17B581" />
          </g>
        </svg>

        {/* HTML orbit layer: protocol icons */}
        <div style={{
          position: 'absolute', inset: 0,
          width: 280, height: 280,
          animation: anim ? 'mha-orbit-spin 20s linear infinite' : 'none',
        }}>
          {PROTOCOLS.map((protocol, i) => {
            const angle = (i / N) * 2 * Math.PI
            const x = C + Math.cos(angle) * ORBIT_R - BADGE_HALF
            const y = C + Math.sin(angle) * ORBIT_R - BADGE_HALF
            const color = PROTOCOL_COLORS[protocol.network] ?? '#ffffff'
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: BADGE_SIZE,
                  height: BADGE_SIZE,
                  animation: anim ? 'mha-counter-spin 20s linear infinite' : 'none',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(4px)',
                  border: `1px solid ${color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={iconBasePath ? `${iconBasePath}/${protocol.iconSuffix}` : (protocolIcons[protocol.network] ?? protocol.iconSuffix)}
                    alt={protocol.name}
                    style={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
