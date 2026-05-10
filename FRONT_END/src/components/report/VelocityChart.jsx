import { motion } from 'framer-motion'
import SectionLabel from './SectionLabel'
import { useInView } from '../../hooks/useInView'
import { velocityData } from '../../data/mockData'

export default function VelocityChart() {
  const { ref, inView } = useInView(0.3)

  return (
    <div ref={ref} style={{ marginBottom: 56 }}>
      <SectionLabel number="04" title="VELOCITY" />
      <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 24 }}>
        Days since first web appearance vs source spread
      </div>
      <svg viewBox="0 0 400 220" width="100%" height={220}>
        {velocityData.map((d, i) => {
          const y = 24 + i * 50
          const barWidth = d.width * 2.6
          return (
            <g key={d.topic}>
              <text
                x={0}
                y={y + 16}
                fontFamily="'Syne Mono', monospace"
                fontSize={11}
                fill="#888899"
              >
                {d.topic}
              </text>
              <motion.rect
                x={112}
                y={y}
                height={24}
                rx={0}
                fill="#6C63FF"
                initial={{ width: 0 }}
                animate={{ width: inView ? barWidth : 0 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.text
                x={112 + barWidth + 8}
                y={y + 16}
                fontFamily="'Syne Mono', monospace"
                fontSize={11}
                fill="#F0EFF8"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: 0.3, delay: i * 0.15 + 0.4 }}
              >
                {d.sources} sources
              </motion.text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
