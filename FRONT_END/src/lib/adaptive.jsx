import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const SECTION_ORDER = ['hero', 'report', 'prophecy', 'market', 'score', 'footer']
const MEMORY_STORAGE_KEY = 'precursor-adaptive-memory-v2'
const MEMORY_MAX_AGE = 1000 * 60 * 45

const AdaptiveContext = createContext(null)

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
const getTimestamp = () => Date.now()

function getNarrativeDepth(sectionId) {
  const index = SECTION_ORDER.indexOf(sectionId)
  return index === -1 ? 0 : index / Math.max(SECTION_ORDER.length - 1, 1)
}

function getOrderedNeighbor(sectionId, offset = 1) {
  const index = SECTION_ORDER.indexOf(sectionId)
  if (index === -1) return SECTION_ORDER[0]
  return SECTION_ORDER[Math.min(Math.max(index + offset, 0), SECTION_ORDER.length - 1)]
}

function hydrateStoredMemory() {
  if (typeof window === 'undefined') {
    return {
      rememberedSection: 'hero',
      sectionMemory: { hero: { visits: 1, linger: 0.14, lastVisitedAt: getTimestamp() } },
      visitedSections: new Set(['hero']),
    }
  }

  try {
    const raw = window.sessionStorage.getItem(MEMORY_STORAGE_KEY)
    if (!raw) {
      return {
        rememberedSection: 'hero',
        sectionMemory: { hero: { visits: 1, linger: 0.14, lastVisitedAt: getTimestamp() } },
        visitedSections: new Set(['hero']),
      }
    }

    const parsed = JSON.parse(raw)
    const age = getTimestamp() - (parsed.timestamp ?? 0)

    if (age > MEMORY_MAX_AGE) {
      window.sessionStorage.removeItem(MEMORY_STORAGE_KEY)
      return {
        rememberedSection: 'hero',
        sectionMemory: { hero: { visits: 1, linger: 0.14, lastVisitedAt: getTimestamp() } },
        visitedSections: new Set(['hero']),
      }
    }

    const decay = clamp(age / MEMORY_MAX_AGE, 0, 1)
    const rawMemory = parsed.sectionMemory ?? {}
    const hydratedEntries = Object.entries(rawMemory).map(([id, memory]) => {
      const linger = clamp((memory?.linger ?? 0.14) * (1 - decay * 0.42), 0.1, 0.52)
      return [id, {
        visits: Math.max(memory?.visits ?? 0, id === 'hero' ? 1 : 0),
        linger,
        lastVisitedAt: memory?.lastVisitedAt ?? parsed.timestamp ?? getTimestamp(),
      }]
    })

    const sectionMemory = Object.fromEntries(hydratedEntries)
    if (!sectionMemory.hero) {
      sectionMemory.hero = { visits: 1, linger: 0.14, lastVisitedAt: parsed.timestamp ?? getTimestamp() }
    }

    const visitedSections = new Set(parsed.visitedSections ?? Object.keys(sectionMemory))
    visitedSections.add('hero')

    return {
      rememberedSection: visitedSections.has(parsed.rememberedSection) ? parsed.rememberedSection : 'hero',
      sectionMemory,
      visitedSections,
    }
  } catch {
    return {
      rememberedSection: 'hero',
      sectionMemory: { hero: { visits: 1, linger: 0.14, lastVisitedAt: getTimestamp() } },
      visitedSections: new Set(['hero']),
    }
  }
}

export function AdaptiveProvider({ children }) {
  const sectionsRef = useRef(new Map())
  const decayTimeoutRef = useRef(null)
  const scrollFrameRef = useRef(null)
  const activeSectionRef = useRef('hero')
  const previousSectionRef = useRef('hero')
  const sectionEnteredAtRef = useRef(getNow())
  const lastInteractionAtRef = useRef(getNow())
  const activeFocusCountRef = useRef(0)
  const lastScrollMetaRef = useRef({
    y: 0,
    time: getNow(),
    velocity: 0,
    direction: 1,
  })
  const storedMemoryRef = useRef(hydrateStoredMemory())
  const sectionTimelineRef = useRef(
    Object.fromEntries(
      Object.entries(storedMemoryRef.current.sectionMemory).map(([id, memory]) => [
        id,
        { lastEnteredAt: memory.lastVisitedAt ?? getTimestamp() },
      ])
    )
  )

  const [scrollDepth, setScrollDepth] = useState(0)
  const [interactionEnergy, setInteractionEnergy] = useState(0)
  const [hesitationLevel, setHesitationLevel] = useState(0)
  const [cadenceLevel, setCadenceLevel] = useState(0)
  const [decelerationLevel, setDecelerationLevel] = useState(0)
  const [silenceLevel, setSilenceLevel] = useState(0)
  const [revisitCadence, setRevisitCadence] = useState(0)
  const [stabilizationLevel, setStabilizationLevel] = useState(0)
  const [focusCluster, setFocusCluster] = useState(0)
  const [focusActive, setFocusActive] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [nextSection, setNextSection] = useState('report')
  const [rememberedSection, setRememberedSection] = useState(storedMemoryRef.current.rememberedSection)
  const [visitedSections, setVisitedSections] = useState(() => storedMemoryRef.current.visitedSections)
  const [sectionMemory, setSectionMemory] = useState(() => storedMemoryRef.current.sectionMemory)

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const persist = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(
          MEMORY_STORAGE_KEY,
          JSON.stringify({
            timestamp: getTimestamp(),
            rememberedSection,
            visitedSections: Array.from(visitedSections),
            sectionMemory,
          })
        )
      } catch {
        // Ignore storage failures. The adaptive system must remain deterministic without persistence.
      }
    }, 120)

    return () => window.clearTimeout(persist)
  }, [rememberedSection, sectionMemory, visitedSections])

  useEffect(() => {
    const updateScrollDepth = () => {
      scrollFrameRef.current = null
      const doc = document.documentElement
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1)
      const now = getNow()
      const last = lastScrollMetaRef.current
      const deltaTime = Math.max(now - last.time, 16)
      const deltaY = window.scrollY - last.y
      const absDeltaY = Math.abs(deltaY)
      const velocity = absDeltaY / deltaTime
      const direction = deltaY === 0 ? last.direction : Math.sign(deltaY)
      const sameDirection = direction === last.direction
      const decelerationTarget = sameDirection && last.velocity > velocity
        ? clamp((last.velocity - velocity) / Math.max(last.velocity, 0.14))
        : 0

      lastScrollMetaRef.current = {
        y: window.scrollY,
        time: now,
        velocity,
        direction,
      }

      if (absDeltaY > 1) {
        lastInteractionAtRef.current = now
      }

      setScrollDepth(clamp(window.scrollY / maxScroll))
      setCadenceLevel((current) => {
        const cadenceTarget = velocity > 0.9 ? 0.14 : velocity > 0.45 ? 0.24 : velocity > 0.18 ? 0.36 : 0.18
        return clamp(current * 0.72 + cadenceTarget * 0.28)
      })
      setDecelerationLevel((current) => clamp(current * 0.7 + decelerationTarget * 0.3))
      setHesitationLevel((current) => {
        if (activeSectionRef.current === 'hero') {
          return clamp(current * 0.84)
        }

        if (velocity < 0.05 && window.scrollY > 120) {
          return clamp(current * 0.8 + 0.075)
        }

        return clamp(current * 0.74 - 0.025)
      })
    }

    const handleScroll = () => {
      if (scrollFrameRef.current) return
      scrollFrameRef.current = requestAnimationFrame(updateScrollDepth)
    }

    updateScrollDepth()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = getNow()
      const idleDuration = now - lastInteractionAtRef.current
      const activeDuration = now - sectionEnteredAtRef.current
      const nextSilence = clamp((idleDuration - 420) / 4200, 0, 1)
      const stillness = clamp(1 - lastScrollMetaRef.current.velocity / 0.42, 0, 1)
      const stabilityTarget = clamp(
        activeDuration / 9000 * 0.34 +
        nextSilence * 0.3 +
        stillness * 0.22 +
        decelerationLevel * 0.14,
        0,
        1
      )

      setSilenceLevel((current) => clamp(current * 0.78 + nextSilence * 0.22))
      setStabilizationLevel((current) => clamp(current * 0.8 + stabilityTarget * 0.2))
      setInteractionEnergy((current) => clamp(current * (nextSilence > 0.72 ? 0.88 : 0.94)))
      setRevisitCadence((current) => clamp(current * 0.965))
      setDecelerationLevel((current) => clamp(current * 0.965))
    }, 240)

    return () => window.clearInterval(interval)
  }, [decelerationLevel])

  const decayInteraction = useCallback((delay = 860) => {
    if (decayTimeoutRef.current) {
      clearTimeout(decayTimeoutRef.current)
    }

    decayTimeoutRef.current = setTimeout(() => {
      setInteractionEnergy((current) => clamp(current * 0.42))
    }, delay)
  }, [])

  const registerInteraction = useCallback((amount = 0.08) => {
    lastInteractionAtRef.current = getNow()
    setInteractionEnergy((current) => clamp(Math.max(current, current * 0.8 + amount)))
    decayInteraction()
  }, [decayInteraction])

  const registerFocusIntent = useCallback((isFocused) => {
    activeFocusCountRef.current = Math.max(activeFocusCountRef.current + (isFocused ? 1 : -1), 0)
    const focusRatio = clamp(activeFocusCountRef.current / 3, 0, 1)
    setFocusCluster(focusRatio)
    setFocusActive(activeFocusCountRef.current > 0)
    if (isFocused) {
      lastInteractionAtRef.current = getNow()
    }
  }, [])

  const setSectionState = useCallback((id, payload) => {
    if (!id) return

    const nextMap = new Map(sectionsRef.current)
    nextMap.set(id, payload)
    sectionsRef.current = nextMap

    const activeEntries = Array.from(nextMap.entries()).filter(([, value]) => value?.isActive)
    if (activeEntries.length > 0) {
      activeEntries.sort((a, b) => {
        const ratioDiff = (b[1].ratio ?? 0) - (a[1].ratio ?? 0)
        if (Math.abs(ratioDiff) > 0.01) return ratioDiff
        return Math.abs(a[1].top ?? 0) - Math.abs(b[1].top ?? 0)
      })

      const nextActive = activeEntries[0][0]
      if (nextActive !== activeSectionRef.current) {
        const now = getTimestamp()
        const previousActive = activeSectionRef.current
        const revisitGap = now - (sectionTimelineRef.current[nextActive]?.lastEnteredAt ?? 0)
        previousSectionRef.current = previousActive
        activeSectionRef.current = nextActive
        sectionEnteredAtRef.current = getNow()
        sectionTimelineRef.current = {
          ...sectionTimelineRef.current,
          [nextActive]: {
            lastEnteredAt: now,
          },
        }

        if (revisitGap > 4000 && visitedSections.has(nextActive)) {
          setRevisitCadence((current) => clamp(Math.max(current, current * 0.74 + 0.26)))
        }

        setSectionMemory((current) => {
          const nextMemory = current[nextActive] ?? { visits: 0, linger: 0.12, lastVisitedAt: now }
          const priorMemory = current[previousActive] ?? { visits: 1, linger: 0.14, lastVisitedAt: now }
          const lingerBoost = visitedSections.has(nextActive) ? 0.06 : 0.03

          return {
            ...current,
            [previousActive]: {
              ...priorMemory,
              linger: clamp(priorMemory.linger * 0.92 + 0.02, 0.12, 0.54),
              lastVisitedAt: now,
            },
            [nextActive]: {
              visits: nextMemory.visits + 1,
              linger: clamp(Math.max(nextMemory.linger, 0.12) + lingerBoost, 0.12, 0.58),
              lastVisitedAt: now,
            },
          }
        })
      }

      setActiveSection(nextActive)
      setRememberedSection(nextActive)
      setVisitedSections((current) => {
        if (current.has(nextActive)) return current
        const nextVisited = new Set(current)
        nextVisited.add(nextActive)
        return nextVisited
      })
    }
  }, [visitedSections])

  const clearSectionState = useCallback((id) => {
    const nextMap = new Map(sectionsRef.current)
    nextMap.delete(id)
    sectionsRef.current = nextMap
  }, [])

  useEffect(() => {
    const orderedFuture = SECTION_ORDER
      .filter((id) => getNarrativeDepth(id) > getNarrativeDepth(activeSection))
      .map((id) => {
        const state = sectionsRef.current.get(id)
        const readiness = !state
          ? 0
          : clamp(
              (state.top > 0 ? 1 - state.top / Math.max(window.innerHeight || 1, 1) : state.ratio ?? 0) * 0.72 +
              (state.ratio ?? 0) * 0.28
            )
        return { id, readiness }
      })

    const predictiveCandidate = orderedFuture.sort((a, b) => b.readiness - a.readiness)[0]
    const fallback = getOrderedNeighbor(activeSection, 1)
    setNextSection(predictiveCandidate?.readiness > 0.06 ? predictiveCandidate.id : fallback)
  }, [activeSection, hesitationLevel, scrollDepth])

  useEffect(() => {
    const firstPulse = window.setTimeout(() => {
      setSectionMemory((current) => {
        const nextMemory = current[activeSection] ?? { visits: 1, linger: 0.12, lastVisitedAt: getTimestamp() }
        return {
          ...current,
          [activeSection]: {
            ...nextMemory,
            linger: Math.max(nextMemory.linger, 0.28),
          },
        }
      })
    }, 1400)

    const secondPulse = window.setTimeout(() => {
      setSectionMemory((current) => {
        const nextMemory = current[activeSection] ?? { visits: 1, linger: 0.12, lastVisitedAt: getTimestamp() }
        return {
          ...current,
          [activeSection]: {
            ...nextMemory,
            linger: Math.max(nextMemory.linger, 0.46),
          },
        }
      })
    }, 3600)

    return () => {
      window.clearTimeout(firstPulse)
      window.clearTimeout(secondPulse)
    }
  }, [activeSection])

  const shellStyle = useMemo(() => {
    const narrativeDepth = getNarrativeDepth(activeSection)
    const nextDepth = getNarrativeDepth(nextSection)
    const currentMemory = sectionMemory[activeSection] ?? { visits: 1, linger: 0.14 }
    const upcomingMemory = sectionMemory[nextSection] ?? { visits: 0, linger: 0.12 }
    const previousMemory = sectionMemory[previousSectionRef.current] ?? { visits: 1, linger: 0.12 }
    const sectionDwell = clamp((getNow() - sectionEnteredAtRef.current) / 12000, 0, 1)
    const revisitWarmth = clamp((currentMemory.visits - 1) * 0.06, 0, 0.18)
    const attentionWeight = clamp(currentMemory.linger * 0.46 + hesitationLevel * 0.24 + focusCluster * 0.18 + revisitCadence * 0.12, 0, 0.72)
    const upcomingWeight = clamp((nextDepth - narrativeDepth) * 0.44 + hesitationLevel * 0.22 + cadenceLevel * 0.18 + decelerationLevel * 0.16, 0, 0.58)
    const readingRhythm = clamp((1 - cadenceLevel) * 0.46 + hesitationLevel * 0.18 + decelerationLevel * 0.2 + silenceLevel * 0.16, 0.12, 0.88)
    const silenceBalance = clamp(silenceLevel * 0.44 + readingRhythm * 0.18 + decelerationLevel * 0.12 + (focusActive ? 0.12 : 0), 0.08, 0.72)
    const emotionalPressure = clamp(interactionEnergy * 0.26 + upcomingWeight * 0.24 + attentionWeight * 0.16 + focusCluster * 0.14 - silenceBalance * 0.22, 0.08, 0.74)
    const decompression = clamp(silenceBalance * 0.36 + stabilizationLevel * 0.24 + sectionDwell * 0.18 + decelerationLevel * 0.12, 0.12, 0.82)
    const continuityField = clamp(previousMemory.linger * 0.16 + currentMemory.linger * 0.24 + upcomingMemory.linger * 0.12 + revisitCadence * 0.2 + sectionDwell * 0.16, 0.08, 0.72)
    const temporalPresence = clamp(currentMemory.linger * 0.2 + revisitCadence * 0.22 + sectionDwell * 0.24 + silenceLevel * 0.12 + stabilizationLevel * 0.14, 0.12, 0.82)
    const hierarchySoftness = clamp(quietnessSeed(attentionWeight, cadenceLevel) * 0.58 + decompression * 0.22 + silenceBalance * 0.2, 0.16, 0.72)
    const attentionGravity = clamp(attentionWeight * 0.34 + hesitationLevel * 0.16 + decelerationLevel * 0.14 + focusCluster * 0.18 + sectionDwell * 0.08, 0.12, 0.74)
    const regulation = clamp(1 - (interactionEnergy * 0.1 + hesitationLevel * 0.06 + emotionalPressure * 0.08), 0.82, 1)
    const ambientOpacity = (0.064 + scrollDepth * 0.05 + attentionGravity * 0.06 + emotionalPressure * 0.028 + (focusActive ? 0.018 : 0)) * regulation
    const ambientShift = `${(scrollDepth * 14 + attentionGravity * 10 + upcomingWeight * 6).toFixed(2)}px`
    const panelGlow = clamp(
      0.08 +
      narrativeDepth * 0.08 +
      interactionEnergy * 0.08 +
      currentMemory.linger * 0.12 +
      focusCluster * 0.08 +
      emotionalPressure * 0.06 +
      revisitWarmth * 0.12,
      0.08,
      0.34
    ) * regulation
    const sectionEmphasis = clamp(0.935 + currentMemory.linger * 0.05 + attentionGravity * 0.024 - hierarchySoftness * 0.018, 0.93, 1.03)
    const surfaceTint = (0.014 + narrativeDepth * 0.02 + continuityField * 0.014 + emotionalPressure * 0.012) * regulation
    const memoryWarmth = clamp(revisitWarmth + currentMemory.linger * 0.12 + temporalPresence * 0.08, 0.04, 0.28)
    const inactiveOpacity = clamp((0.84 + revisitWarmth * 0.12 + temporalPresence * 0.04) * (1 - upcomingWeight * 0.06), 0.82, 0.94)
    const breathDuration = `${Math.round(18 + silenceBalance * 4 - attentionGravity * 3)}s`
    const bloomDelay = `${Math.round((160 + (1 - attentionGravity) * 140 + decompression * 90) * regulation)}ms`
    const metricIntensity = clamp((0.14 + currentMemory.linger * 0.18 + attentionGravity * 0.16 + emotionalPressure * 0.12 + upcomingMemory.linger * 0.06) * regulation, 0.14, 0.48)
    const detailPresence = clamp(0.12 + attentionGravity * 0.18 + temporalPresence * 0.08 + upcomingWeight * 0.08 - decompression * 0.05, 0.12, 0.46)
    const quietness = clamp(quietnessSeed(attentionWeight, cadenceLevel) + silenceBalance * 0.06, 0.18, 0.56)
    const predictiveReadiness = clamp(upcomingWeight + upcomingMemory.linger * 0.16 + continuityField * 0.08, 0.06, 0.58)
    const focusPlane = clamp(0.08 + attentionGravity * 0.14 + focusCluster * 0.12 + currentMemory.linger * 0.08, 0.08, 0.34)
    const depthSoftness = clamp(0.1 + quietness * 0.42 + decompression * 0.14 - detailPresence * 0.12, 0.08, 0.28)
    const balanceGuard = clamp(0.9 + regulation * 0.1, 0.9, 1)
    const anticipationFlow = `${(upcomingWeight * 16 + continuityField * 8).toFixed(2)}px`
    const echoOpacity = clamp(interactionEnergy * 0.36 + revisitCadence * 0.12 + focusCluster * 0.08, 0.02, 0.26)
    const densityBalance = clamp(0.2 + decompression * 0.24 + hierarchySoftness * 0.16 - emotionalPressure * 0.12, 0.16, 0.62)
    const atmosphericPressure = clamp(0.18 + emotionalPressure * 0.44 - decompression * 0.18, 0.12, 0.48)

    return {
      '--adaptive-ambient-opacity': ambientOpacity.toFixed(3),
      '--adaptive-ambient-shift': ambientShift,
      '--adaptive-panel-glow': panelGlow.toFixed(3),
      '--adaptive-section-emphasis': sectionEmphasis.toFixed(3),
      '--adaptive-surface-tint': surfaceTint.toFixed(3),
      '--adaptive-memory-warmth': memoryWarmth.toFixed(3),
      '--adaptive-inactive-opacity': inactiveOpacity.toFixed(3),
      '--adaptive-breath-duration': breathDuration,
      '--adaptive-bloom-delay': bloomDelay,
      '--adaptive-metric-intensity': metricIntensity.toFixed(3),
      '--adaptive-detail-presence': detailPresence.toFixed(3),
      '--adaptive-quietness': quietness.toFixed(3),
      '--adaptive-predictive-readiness': predictiveReadiness.toFixed(3),
      '--adaptive-focus-plane': focusPlane.toFixed(3),
      '--adaptive-depth-softness': depthSoftness.toFixed(3),
      '--adaptive-balance-guard': balanceGuard.toFixed(3),
      '--adaptive-anticipation-flow': anticipationFlow,
      '--adaptive-silence-balance': silenceBalance.toFixed(3),
      '--adaptive-attention-gravity': attentionGravity.toFixed(3),
      '--adaptive-emotional-pressure': atmosphericPressure.toFixed(3),
      '--adaptive-decompression': decompression.toFixed(3),
      '--adaptive-continuity-field': continuityField.toFixed(3),
      '--adaptive-stabilization': stabilizationLevel.toFixed(3),
      '--adaptive-temporal-presence': temporalPresence.toFixed(3),
      '--adaptive-hierarchy-softness': hierarchySoftness.toFixed(3),
      '--adaptive-reading-rhythm': readingRhythm.toFixed(3),
      '--adaptive-revisit-resonance': revisitCadence.toFixed(3),
      '--adaptive-echo-opacity': echoOpacity.toFixed(3),
      '--adaptive-density-balance': densityBalance.toFixed(3),
      '--adaptive-focus-cluster': focusCluster.toFixed(3),
    }
  }, [
    activeSection,
    cadenceLevel,
    decelerationLevel,
    focusActive,
    focusCluster,
    hesitationLevel,
    interactionEnergy,
    nextSection,
    revisitCadence,
    scrollDepth,
    sectionMemory,
    silenceLevel,
    stabilizationLevel,
  ])

  const ecology = useMemo(() => ({
    attentionGravity: parseFloat(shellStyle['--adaptive-attention-gravity']),
    continuityField: parseFloat(shellStyle['--adaptive-continuity-field']),
    decompression: parseFloat(shellStyle['--adaptive-decompression']),
    emotionalPressure: parseFloat(shellStyle['--adaptive-emotional-pressure']),
    hierarchySoftness: parseFloat(shellStyle['--adaptive-hierarchy-softness']),
    silenceBalance: parseFloat(shellStyle['--adaptive-silence-balance']),
    temporalPresence: parseFloat(shellStyle['--adaptive-temporal-presence']),
  }), [shellStyle])

  const value = useMemo(() => ({
    activeSection,
    nextSection,
    rememberedSection,
    visitedSections,
    sectionMemory,
    focusActive,
    ecology,
    registerInteraction,
    registerFocusIntent,
    setSectionState,
    clearSectionState,
  }), [
    activeSection,
    clearSectionState,
    ecology,
    focusActive,
    nextSection,
    registerFocusIntent,
    registerInteraction,
    rememberedSection,
    sectionMemory,
    setSectionState,
    visitedSections,
  ])

  return (
    <AdaptiveContext.Provider value={value}>
      <div
        className="adaptive-shell"
        data-active-section={activeSection}
        data-next-section={nextSection}
        data-remembered-section={rememberedSection}
        style={shellStyle}
      >
        {children}
      </div>
    </AdaptiveContext.Provider>
  )
}

function quietnessSeed(attentionWeight, cadenceLevel) {
  return clamp(0.18 + (1 - attentionWeight) * 0.14 + cadenceLevel * 0.06, 0.18, 0.44)
}

export function useAdaptiveUI() {
  const context = useContext(AdaptiveContext)
  if (!context) {
    throw new Error('useAdaptiveUI must be used within AdaptiveProvider')
  }
  return context
}

export function useAdaptiveSection(id, options = {}) {
  const { threshold = 0.28, root = null, rootMargin = '0px 0px -16% 0px' } = options
  const { activeSection, rememberedSection, visitedSections, sectionMemory, setSectionState, clearSectionState } = useAdaptiveUI()
  const [node, setNode] = useState(null)

  useEffect(() => {
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSectionState(id, {
          isActive: entry.isIntersecting,
          ratio: entry.intersectionRatio,
          top: entry.boundingClientRect.top,
        })
      },
      { threshold: [0, threshold, 0.5, 0.8], root, rootMargin }
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      clearSectionState(id)
    }
  }, [clearSectionState, id, node, root, rootMargin, setSectionState, threshold])

  return {
    ref: setNode,
    isActive: activeSection === id,
    wasVisited: visitedSections.has(id),
    isRemembered: rememberedSection === id,
    revisitCount: sectionMemory[id]?.visits ?? 0,
    lingerLevel: sectionMemory[id]?.linger ?? 0,
  }
}

export function useAdaptiveSurface({ intensity = 0.08, dwellDelay = 260, focusBoost = 0.12 } = {}) {
  const { registerInteraction, registerFocusIntent } = useAdaptiveUI()
  const dwellTimeoutRef = useRef(null)
  const [isDwelled, setIsDwelled] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const clearDwell = useCallback(() => {
    if (dwellTimeoutRef.current) {
      clearTimeout(dwellTimeoutRef.current)
      dwellTimeoutRef.current = null
    }
  }, [])

  useEffect(() => () => clearDwell(), [clearDwell])

  const onMouseEnter = useCallback(() => {
    registerInteraction(intensity * 0.5)
    clearDwell()
    dwellTimeoutRef.current = setTimeout(() => {
      setIsDwelled(true)
      registerInteraction(intensity)
    }, dwellDelay)
  }, [clearDwell, dwellDelay, intensity, registerInteraction])

  const onMouseLeave = useCallback(() => {
    clearDwell()
    setIsDwelled(false)
  }, [clearDwell])

  const onFocus = useCallback(() => {
    setIsFocused(true)
    registerFocusIntent(true)
    registerInteraction(focusBoost)
  }, [focusBoost, registerFocusIntent, registerInteraction])

  const onBlur = useCallback(() => {
    setIsFocused(false)
    registerFocusIntent(false)
  }, [registerFocusIntent])

  return {
    isDwelled,
    isFocused,
    surfaceProps: {
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
    },
  }
}

export function useAdaptiveSignificance({ significance = 0.5, confidence = 0.5, volatility = 0.2, revealBias = 0 } = {}) {
  const { ecology } = useAdaptiveUI()

  return useMemo(() => {
    const signalWeight = clamp(significance * 0.48 + confidence * 0.32 + ecology.temporalPresence * 0.12 - volatility * 0.08, 0.18, 0.92)
    const revealDelay = `${Math.round(
      80 +
      (1 - significance) * 120 +
      volatility * 110 +
      ecology.hierarchySoftness * 80 +
      revealBias * 120
    )}ms`

    return {
      '--signal-significance': significance.toFixed(3),
      '--signal-confidence': confidence.toFixed(3),
      '--signal-volatility': volatility.toFixed(3),
      '--signal-weight': signalWeight.toFixed(3),
      '--signal-reveal-delay': revealDelay,
    }
  }, [confidence, ecology.hierarchySoftness, ecology.temporalPresence, revealBias, significance, volatility])
}
