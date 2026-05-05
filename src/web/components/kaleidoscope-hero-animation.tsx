import { useRef, useEffect, useState, useCallback, type FC } from 'react'
import { NetworkBadge, type NetworkType } from './network-badge'

export interface KaleidoScopeHeroAnimationProps {
  size?: number
  className?: string
  iconBasePath?: string
}

interface ProtocolEntry {
  name: string
  network: NetworkType
  color: string
  glowColor: string
}

const PROTOCOLS: ProtocolEntry[] = [
  { name: 'Bitcoin L1',     network: 'L1',      color: '#F7931A', glowColor: 'rgba(247,147,26,0.5)' },
  { name: 'Lightning',      network: 'LN',      color: '#fbbf24', glowColor: 'rgba(251,191,36,0.5)' },
  { name: 'RGB',            network: 'RGB20',   color: '#EF4444', glowColor: 'rgba(239,68,68,0.5)'  },
  { name: 'Spark',          network: 'Spark',   color: '#FFFFFF', glowColor: 'rgba(255,255,255,0.3)' },
  { name: 'Arkade',         network: 'Arkade',  color: '#8B5CF6', glowColor: 'rgba(139,92,246,0.5)' },
  { name: 'Liquid',         network: 'Liquid',  color: '#22e1c9', glowColor: 'rgba(34,225,201,0.5)' },
  { name: 'Taproot Assets', network: 'Taproot', color: '#D1D6D8', glowColor: 'rgba(209,214,216,0.5)' },
]

const hexPath = (r: number) => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${r * Math.cos(a)},${r * Math.sin(a)}`
  })
  return `M${pts.join('L')}Z`
}

const diamondPath = (w: number, h: number) => `M0,${-h} L${w},0 L0,${h} L${-w},0 Z`

const triPath = (s: number) => `M0,${-s} L${s * 0.866},${s * 0.5} L${-s * 0.866},${s * 0.5} Z`

export const KaleidoScopeHeroAnimation: FC<KaleidoScopeHeroAnimationProps> = ({
  size = 500,
  className = '',
  iconBasePath = '/icons',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const targetOffset = useRef({ x: 0, y: 0 })
  const currentOffset = useRef({ x: 0, y: 0 })
  const rafId = useRef(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  const c = 250
  const orbitR = 148
  const innerR = 82
  const outerR1 = 210
  const outerR2 = 185
  const midR = 118
  const iconR = 24

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
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (reducedMotion) return
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = rect.left + rect.width / 2
    const my = rect.top + rect.height / 2
    const dx = Math.max(-1, Math.min(1, (e.clientX - mx) / (rect.width / 2)))
    const dy = Math.max(-1, Math.min(1, (e.clientY - my) / (rect.height / 2)))
    targetOffset.current = { x: dx, y: dy }
  }, [reducedMotion])

  const handleMouseLeave = useCallback(() => {
    targetOffset.current = { x: 0, y: 0 }
  }, [])

  useEffect(() => {
    if (reducedMotion || !isVisible || window.matchMedia('(pointer: coarse)').matches) return
    const lerp = () => {
      const cur = currentOffset.current
      const tgt = targetOffset.current
      const nx = cur.x + (tgt.x - cur.x) * 0.05
      const ny = cur.y + (tgt.y - cur.y) * 0.05
      if (Math.abs(nx - cur.x) > 0.0005 || Math.abs(ny - cur.y) > 0.0005) {
        currentOffset.current = { x: nx, y: ny }
        setOffset({ x: nx, y: ny })
      }
      rafId.current = requestAnimationFrame(lerp)
    }
    rafId.current = requestAnimationFrame(lerp)
    return () => cancelAnimationFrame(rafId.current)
  }, [reducedMotion, isVisible])

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.addEventListener('mousemove', handleMouseMove)
    const el = containerRef.current
    if (el) el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (el) el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  const px = (layer: number) => {
    if (reducedMotion) return 'translate(0,0)'
    return `translate(${offset.x * layer},${offset.y * layer})`
  }

  const anim = !reducedMotion && isVisible

  const iconPositions = PROTOCOLS.map((_, i) => {
    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2
    return { x: c + orbitR * Math.cos(angle), y: c + orbitR * Math.sin(angle) }
  })

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 500 500"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="kh-grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%">
              {anim && <animate attributeName="stop-color" values="#22c55e;#8a5cf6;#06b6d4;#F7931A;#22c55e" dur="10s" repeatCount="indefinite" />}
            </stop>
            <stop offset="100%">
              {anim && <animate attributeName="stop-color" values="#8a5cf6;#F7931A;#22c55e;#06b6d4;#8a5cf6" dur="10s" repeatCount="indefinite" />}
            </stop>
          </linearGradient>
          <linearGradient id="kh-grad-b" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%">
              {anim && <animate attributeName="stop-color" values="#06b6d4;#22c55e;#F7931A;#8a5cf6;#06b6d4" dur="8s" repeatCount="indefinite" />}
            </stop>
            <stop offset="100%">
              {anim && <animate attributeName="stop-color" values="#F7931A;#06b6d4;#8a5cf6;#22c55e;#F7931A" dur="8s" repeatCount="indefinite" />}
            </stop>
          </linearGradient>
          <linearGradient id="kh-grad-c" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%">
              {anim && <animate attributeName="stop-color" values="#0e9dff;#8a5cf6;#15E99A;#0e9dff" dur="6s" repeatCount="indefinite" />}
            </stop>
            <stop offset="100%">
              {anim && <animate attributeName="stop-color" values="#8a5cf6;#15E99A;#0e9dff;#8a5cf6" dur="6s" repeatCount="indefinite" />}
            </stop>
          </linearGradient>
          <linearGradient id="kh-gp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#8a5cf6" />
          </linearGradient>
          <linearGradient id="kh-oc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7931A" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="kh-bp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0e9dff" />
            <stop offset="100%" stopColor="#8a5cf6" />
          </linearGradient>
          <radialGradient id="kh-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0e9dff" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#8a5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="kh-haze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="60%" stopColor="#0e9dff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#8a5cf6" stopOpacity="0.06" />
          </radialGradient>
          <filter id="kh-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="kh-glow-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <circle cx={c} cy={c} r="248" fill="url(#kh-haze)" />

        {/* Layer 1: outer kaleidoscope (parallax 20) */}
        <g transform={px(20)}>
          <g>
            {anim && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="55s" repeatCount="indefinite" />
            )}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i
              return (
                <g key={`ha-${i}`} transform={`translate(${c + outerR1 * Math.cos(a)},${c + outerR1 * Math.sin(a)})`}>
                  <path d={hexPath(40)} fill="url(#kh-grad-a)" opacity={0.08 + (i % 3) * 0.04} />
                  <path d={hexPath(40)} fill="none" stroke="url(#kh-grad-a)" strokeWidth="0.5" opacity={0.15}>
                    {anim && <animate attributeName="opacity" values="0.1;0.25;0.1" dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />}
                  </path>
                </g>
              )
            })}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i + Math.PI / 6
              return (
                <path key={`ta-${i}`}
                  d={triPath(14)}
                  transform={`translate(${c + outerR1 * 0.78 * Math.cos(a)},${c + outerR1 * 0.78 * Math.sin(a)}) rotate(${i * 60 + 30})`}
                  fill="url(#kh-grad-a)" opacity={0.06}
                />
              )
            })}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (Math.PI / 6) * i
              return (
                <circle key={`od-${i}`}
                  cx={c + outerR1 * 0.92 * Math.cos(a)}
                  cy={c + outerR1 * 0.92 * Math.sin(a)}
                  r="1.5" fill="url(#kh-grad-a)" opacity="0.15"
                >
                  {anim && <animate attributeName="opacity" values="0.08;0.25;0.08" dur={`${2 + (i % 3) * 0.7}s`} repeatCount="indefinite" />}
                </circle>
              )
            })}
          </g>

          <g>
            {anim && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${c} ${c}`} to={`-360 ${c} ${c}`} dur="40s" repeatCount="indefinite" />
            )}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i + Math.PI / 6
              return (
                <g key={`hb-${i}`} transform={`translate(${c + outerR2 * Math.cos(a)},${c + outerR2 * Math.sin(a)})`}>
                  <path d={hexPath(30)} fill="url(#kh-grad-b)" opacity={0.06 + (i % 2) * 0.04} />
                  <path d={hexPath(30)} fill="none" stroke="url(#kh-grad-b)" strokeWidth="0.5" opacity={0.12} />
                </g>
              )
            })}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i
              return (
                <path key={`db-${i}`}
                  d={diamondPath(8, 16)}
                  transform={`translate(${c + outerR2 * 0.85 * Math.cos(a)},${c + outerR2 * 0.85 * Math.sin(a)}) rotate(${i * 60})`}
                  fill="url(#kh-grad-b)" opacity="0.08"
                >
                  {anim && <animate attributeName="opacity" values="0.05;0.15;0.05" dur={`${3.5 + i * 0.4}s`} repeatCount="indefinite" />}
                </path>
              )
            })}
          </g>

          <g>
            {anim && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="70s" repeatCount="indefinite" />
            )}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (Math.PI / 6) * i
              const r = outerR1 * (0.6 + (i % 2) * 0.15)
              return (
                <path key={`tc-${i}`}
                  d={triPath(10)}
                  transform={`translate(${c + r * Math.cos(a)},${c + r * Math.sin(a)}) rotate(${i * 30 + 15})`}
                  fill="url(#kh-grad-c)" opacity="0.05"
                >
                  {anim && <animate attributeName="opacity" values="0.03;0.1;0.03" dur={`${5 + (i % 4) * 0.8}s`} repeatCount="indefinite" />}
                </path>
              )
            })}
          </g>
        </g>

        {/* Mid tessellation ring (parallax 14) */}
        <g transform={px(14)}>
          <g>
            {anim && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="50s" repeatCount="indefinite" />
            )}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (Math.PI / 6) * i
              return (
                <g key={`mh-${i}`} transform={`translate(${c + midR * Math.cos(a)},${c + midR * Math.sin(a)})`}>
                  <path d={hexPath(12)} fill="url(#kh-grad-c)" opacity={0.08 + (i % 3) * 0.03} />
                  <path d={hexPath(12)} fill="none" stroke="url(#kh-grad-c)" strokeWidth="0.4" opacity="0.12">
                    {anim && <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${3 + (i % 4) * 0.5}s`} repeatCount="indefinite" />}
                  </path>
                </g>
              )
            })}
          </g>
          {Array.from({ length: 6 }, (_, i) => {
            const a1 = (Math.PI / 3) * i
            const a2 = (Math.PI / 3) * (i + 1)
            const x1 = c + midR * Math.cos(a1)
            const y1 = c + midR * Math.sin(a1)
            const x2 = c + midR * Math.cos(a2)
            const y2 = c + midR * Math.sin(a2)
            return (
              <path key={`arc-${i}`}
                d={`M${x1},${y1} Q${c},${c} ${x2},${y2}`}
                fill="none" stroke="url(#kh-bp)" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.1"
              >
                {anim && <animate attributeName="stroke-dashoffset" from="0" to="-16" dur={`${3 + i * 0.2}s`} repeatCount="indefinite" />}
              </path>
            )
          })}
        </g>

        {/* Layer 2: protocol icon orbit (parallax 10) */}
        <g transform={px(10)}>
          <circle cx={c} cy={c} r={orbitR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 5">
            {anim && <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="90s" repeatCount="indefinite" />}
          </circle>
          <circle cx={c} cy={c} r={orbitR + 4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

          <g>
            {anim && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="40s" repeatCount="indefinite" />
            )}

            {iconPositions.map((pos, i) => {
              const angle = Math.atan2(pos.y - c, pos.x - c)
              const dx = Math.cos(angle)
              const dy = Math.sin(angle)
              return (
                <g key={`conn-${i}`}>
                  <line x1={c + dx * 52} y1={c + dy * 52} x2={pos.x} y2={pos.y}
                    stroke={PROTOCOLS[i].color} strokeWidth="0.8" strokeDasharray="2 4" opacity="0.2"
                  >
                    {anim && <animate attributeName="stroke-dashoffset" from="0" to="-12" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
                  </line>
                  <circle r="2.5" fill={PROTOCOLS[i].color} opacity="0">
                    {anim && (
                      <>
                        <animate attributeName="cx" values={`${c + dx * 52};${pos.x}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${c + dy * 52};${pos.y}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;0.8;0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        <animate attributeName="r" values="1.5;3;1.5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                      </>
                    )}
                  </circle>
                </g>
              )
            })}

            {PROTOCOLS.map((proto, i) => {
              const pos = iconPositions[i]
              const labelWidth = Math.max(proto.name.length * 5.5 + 10, 32)
              const isHovered = hoveredProtocol === proto.name
              return (
                <g key={proto.name} transform={`translate(${pos.x},${pos.y})`}>
                  <g
                    onMouseEnter={() => setHoveredProtocol(proto.name)}
                    onMouseLeave={() => setHoveredProtocol(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {anim && (
                      <animateTransform attributeName="transform" type="rotate"
                        from="0 0 0" to="-360 0 0" dur="40s" repeatCount="indefinite" />
                    )}

                    <circle cx="0" cy="0" r={iconR} fill="none"
                      stroke={proto.color} strokeWidth="1" opacity="0"
                    >
                      {anim && (
                        <>
                          <animate attributeName="r" values={`${iconR};${iconR + 12}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
                          <animate attributeName="opacity" values="0.5;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
                        </>
                      )}
                    </circle>

                    <circle cx="0" cy="0" r={iconR + 4} fill="none"
                      stroke={proto.color} strokeWidth="1" opacity="0.15"
                    >
                      {anim && <animate attributeName="opacity" values="0.15;0.4;0.15" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />}
                    </circle>

                    <circle cx="0" cy="0" r={iconR + 1} fill="none"
                      stroke={proto.color} strokeWidth="1.5" opacity="0.25"
                    >
                      {anim && <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />}
                    </circle>

                    <circle cx="0" cy="0" r={iconR}
                      fill="rgba(10,15,30,0.8)"
                      stroke="rgba(255,255,255,0.15)" strokeWidth="1"
                    />
                    <circle cx="0" cy="0" r={iconR - 2} fill={proto.color} opacity="0.06" />

                    <foreignObject x={-iconR} y={-iconR} width={iconR * 2} height={iconR * 2}>
                      <NetworkBadge
                        network={proto.network}
                        iconBasePath={iconBasePath}
                        className="w-full h-full"
                      />
                    </foreignObject>

                    <g opacity={isHovered ? 1 : 0} style={{ transition: 'opacity 0.2s ease' }}>
                      <rect
                        x={-labelWidth / 2} y={iconR + 6}
                        width={labelWidth} height={16} rx={4}
                        fill="rgba(0,0,0,0.85)"
                        stroke={proto.color} strokeWidth={0.5} strokeOpacity={0.4}
                      />
                      <text
                        x="0" y={iconR + 18}
                        textAnchor="middle"
                        fill="white" fontSize="9" fontWeight="600"
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        {proto.name}
                      </text>
                    </g>
                  </g>
                </g>
              )
            })}
          </g>
        </g>

        {/* Layer 3: inner geometric pattern (parallax 5) */}
        <g transform={px(5)}>
          <g>
            {anim && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${c} ${c}`} to={`-360 ${c} ${c}`} dur="35s" repeatCount="indefinite" />
            )}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i
              return (
                <path key={`d-${i}`}
                  d={diamondPath(10, 22)}
                  transform={`translate(${c + innerR * Math.cos(a)},${c + innerR * Math.sin(a)}) rotate(${i * 60})`}
                  fill="url(#kh-gp)" opacity="0.15"
                >
                  {anim && <animate attributeName="opacity" values="0.1;0.28;0.1" dur={`${2.8 + i * 0.35}s`} repeatCount="indefinite" />}
                </path>
              )
            })}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i + Math.PI / 6
              return (
                <path key={`it-${i}`}
                  d={triPath(8)}
                  transform={`translate(${c + innerR * 0.75 * Math.cos(a)},${c + innerR * 0.75 * Math.sin(a)}) rotate(${i * 60 + 30})`}
                  fill="url(#kh-oc)" opacity="0.1"
                >
                  {anim && <animate attributeName="opacity" values="0.06;0.18;0.06" dur={`${3.2 + i * 0.3}s`} repeatCount="indefinite" />}
                </path>
              )
            })}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (Math.PI / 6) * i
              const r = innerR * (i % 2 === 0 ? 0.55 : 0.65)
              return (
                <circle key={`id-${i}`}
                  cx={c + r * Math.cos(a)} cy={c + r * Math.sin(a)}
                  r={i % 2 === 0 ? 2 : 1.5} fill="url(#kh-oc)" opacity="0.2"
                >
                  {anim && <animate attributeName="opacity" values="0.1;0.35;0.1" dur={`${2 + (i % 4) * 0.5}s`} repeatCount="indefinite" />}
                </circle>
              )
            })}
          </g>

          <g>
            {anim && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="25s" repeatCount="indefinite" />
            )}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i + Math.PI / 6
              return (
                <path key={`ih-${i}`}
                  d={hexPath(6)}
                  transform={`translate(${c + innerR * 0.42 * Math.cos(a)},${c + innerR * 0.42 * Math.sin(a)})`}
                  fill="url(#kh-bp)" opacity="0.1"
                >
                  {anim && <animate attributeName="opacity" values="0.06;0.18;0.06" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />}
                </path>
              )
            })}
          </g>
        </g>

        {/* Floating particles (parallax 18) */}
        <g transform={px(18)}>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 16
            const baseR = 60 + (i % 4) * 45
            const x = c + baseR * Math.cos(a)
            const y = c + baseR * Math.sin(a)
            const colors = ['#0e9dff', '#8a5cf6', '#22c55e', '#F7931A', '#06b6d4', '#15E99A']
            return (
              <circle key={`p-${i}`} cx={x} cy={y}
                r={1 + (i % 3) * 0.5} fill={colors[i % colors.length]} opacity="0"
              >
                {anim && (
                  <>
                    <animate attributeName="opacity" values="0;0.6;0" dur={`${3 + (i % 5) * 0.8}s`} repeatCount="indefinite" begin={`${(i % 7) * 0.5}s`} />
                    <animate attributeName="cx" values={`${x};${x + (Math.cos(a) * 15)}`} dur={`${4 + (i % 3) * 1.5}s`} repeatCount="indefinite" begin={`${(i % 7) * 0.5}s`} />
                    <animate attributeName="cy" values={`${y};${y + (Math.sin(a) * 15)}`} dur={`${4 + (i % 3) * 1.5}s`} repeatCount="indefinite" begin={`${(i % 7) * 0.5}s`} />
                  </>
                )}
              </circle>
            )
          })}
        </g>

        {/* Layer 4: center logo (no parallax) */}
        <g>
          <circle cx={c} cy={c} r="75" fill="url(#kh-center-glow)">
            {anim && <animate attributeName="r" values="70;80;70" dur="4s" repeatCount="indefinite" />}
          </circle>

          <circle cx={c} cy={c} r="52" fill="none" stroke="url(#kh-bp)" strokeWidth="1" opacity="0">
            {anim && (
              <>
                <animate attributeName="r" values="48;65" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0" dur="3s" repeatCount="indefinite" />
              </>
            )}
          </circle>
          <circle cx={c} cy={c} r="48" fill="none" stroke="url(#kh-gp)" strokeWidth="0.8" opacity="0">
            {anim && (
              <>
                <animate attributeName="r" values="48;60" dur="3s" repeatCount="indefinite" begin="1.5s" />
                <animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" begin="1.5s" />
              </>
            )}
          </circle>

          <path d={hexPath(50)} transform={`translate(${c},${c})`}
            fill="none" stroke="url(#kh-gp)" strokeWidth="1.5" opacity="0.4" filter="url(#kh-glow)"
          >
            {anim && (
              <>
                <animate attributeName="opacity" values="0.3;0.65;0.3" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.5;2.5;1.5" dur="3s" repeatCount="indefinite" />
              </>
            )}
          </path>

          <path d={hexPath(46)} transform={`translate(${c},${c})`}
            fill="rgba(10,15,30,0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
          />

          <g transform={`translate(${c - 34},${c - 34}) scale(0.325)`}>
            <path d="M69.7141 207.3H0.908203L35.3243 172.936L69.7141 207.3Z" fill="#6F32FF" />
            <path d="M138.441 0.96106V69.767L104.078 35.3508L138.441 0.96106Z" fill="#17B581" />
            <path d="M138.415 138.547V207.352L104.051 172.936L138.415 138.547Z" fill="#17B581" />
            <path d="M138.441 69.7406V0.96106L172.804 35.3772L138.441 69.767V69.7406Z" fill="#17B581" />
            <path d="M69.6614 138.494V69.6879L104.025 104.104L69.6614 138.494Z" fill="#15E99A" />
            <path d="M69.6615 69.7142V138.52L35.2981 104.104L69.6615 69.7142Z" fill="#15E99A" />
            <path d="M138.467 207.379V138.573L172.831 172.989L138.467 207.379Z" fill="#17B581" />
            <path d="M0.908203 0.908325H69.7141L35.298 35.2718L0.908203 0.908325Z" fill="#6F32FF" />
            <path d="M207.22 207.3H138.415L172.831 172.936L207.22 207.3Z" fill="#17B581" />
            <path d="M138.415 0.987427H207.22L172.804 35.3509L138.415 0.987427Z" fill="#17B581" />
            <path d="M138.467 69.7143H69.6614L104.078 35.3508L138.467 69.7143Z" fill="#17B581" />
            <path d="M69.635 138.494H138.441L104.025 172.857L69.635 138.494Z" fill="#17B581" />
            <path d="M138.415 138.494H69.635L104.025 104.157L138.388 138.494H138.415Z" fill="#15E99A" />
            <path d="M138.415 69.7142L104.051 104.051L69.6614 69.7142H138.441H138.415Z" fill="#15E99A" />
          </g>
        </g>
      </svg>
    </div>
  )
}
