import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Hero from './components/hero/Hero'
import ScanLoader from './components/loading/ScanLoader'
import ReportLayout from './components/report/ReportLayout'
import ProphecyEngine from './components/prophecy/ProphecyEngine'
import ThesisMarket from './components/market/ThesisMarket'
import PrecursorScore from './components/score/PrecursorScore'
import Footer from './components/footer/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import { transitions, withDelay } from './lib/motion'
import { AdaptiveProvider } from './lib/adaptive.jsx'
import { runFullScan } from './lib/api.js'
import { buildReportData } from './lib/reportData.js'

export default function App() {
  const [view, setView] = useState('hero')
  const [activeTopic, setActiveTopic] = useState('Bangalore B2B SaaS Ecosystem, May 2026')
  const [loadingStage, setLoadingStage] = useState('idle')
  const [sourceCountTarget, setSourceCountTarget] = useState(0)
  const [reportData, setReportData] = useState(null)
  const [errorState, setErrorState] = useState(null)

  const loaderSummary = useMemo(() => ({
    stage: loadingStage,
    sourceCountTarget,
    topic: activeTopic
  }), [activeTopic, loadingStage, sourceCountTarget])

  const beginLoading = (topic) => {
    setActiveTopic(topic)
    setLoadingStage('scanning')
    setSourceCountTarget(0)
    setReportData(null)
    setErrorState(null)
    setView('loading')
  }

  const runScanFlow = async (topic) => {
    const normalizedTopic = topic.trim()
    const MIN_MS = 6000
    const startedAt = Date.now()
    beginLoading(normalizedTopic)

    try {
      const result = await runFullScan(normalizedTopic)
      setSourceCountTarget(result.sourcesSucceeded || 0)
      setLoadingStage('complete')
      setReportData(buildReportData(result))

      const elapsed = Date.now() - startedAt
      const wait = Math.max(0, MIN_MS - elapsed)
      window.setTimeout(() => setView('report'), wait)
    } catch (error) {
      if (error.status === 422) {
        setErrorState({
          title: 'Topic too broad',
          message: "Topic too broad. Try: 'B2B SaaS Bangalore' instead of 'software'.",
          retryable: true,
          topic: normalizedTopic
        })
      } else {
        setErrorState({
          title: 'Scan Failed',
          message: error.message || 'Unable to complete the scan.',
          retryable: true,
          topic: normalizedTopic
        })
      }

      setView('error')
    }
  }

  return (
    <AdaptiveProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />

        <div style={{ paddingTop: 52 }}>
          <AnimatePresence mode="wait">
            {view === 'hero' && (
              <motion.div
                key="hero"
                exit={{ opacity: 0, y: -16, transition: transitions.standard }}
              >
                <Hero onScan={runScanFlow} />
              </motion.div>
            )}

            {view === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transitions.standard}
                exit={{ opacity: 0, transition: transitions.standard }}
              >
                <ScanLoader {...loaderSummary} />
              </motion.div>
            )}

            {view === 'report' && reportData && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={withDelay(transitions.reveal, 0.04)}
              >
                <ErrorBoundary>
                  <ReportLayout
                    topic={reportData.topic}
                    scannedAt={reportData.scannedAt}
                    sourcesCount={reportData.sourcesCount}
                    notice={reportData.notice}
                    consensus={reportData.consensus}
                    contradictions={reportData.contradictions}
                    silenceSignals={reportData.silenceSignals}
                    velocityData={reportData.velocityData}
                    culturalDNA={reportData.culturalDNA}
                    summary={reportData.summary}
                  />
                  <ProphecyEngine
                    prophecies={reportData.prophecies}
                    sourcesCount={reportData.sourcesCount}
                    notice={reportData.notice?.includes('Prophecy Engine') ? 'Prophecy Engine temporarily unavailable' : ''}
                  />
                  <ThesisMarket theses={reportData.theses} />
                  <PrecursorScore profile={reportData.profile} />
                  <Footer />
                </ErrorBoundary>
              </motion.div>
            )}

            {view === 'error' && errorState && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transitions.standard}
                style={{
                  minHeight: 'calc(100vh - 52px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '72px 48px'
                }}
              >
                <div
                  className="interactive-panel ambient-panel"
                  style={{
                    width: 'min(680px, 100%)',
                    padding: 36,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'var(--bg-surface)'
                  }}
                >
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
                    {errorState.title}
                  </div>
                  <div className="font-body" style={{ marginTop: 16, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {errorState.message}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                    {errorState.retryable && (
                      <button
                        type="button"
                        onClick={() => runScanFlow(errorState.topic || activeTopic)}
                        className="font-display"
                        style={{
                          border: '1px solid var(--accent)',
                          background: 'var(--accent)',
                          color: '#fff',
                          padding: '12px 18px',
                          letterSpacing: '0.06em'
                        }}
                      >
                        RETRY
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setView('hero')}
                      className="font-display"
                      style={{
                        border: '1px solid rgba(255,255,255,0.14)',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        padding: '12px 18px',
                        letterSpacing: '0.06em'
                      }}
                    >
                      BACK
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdaptiveProvider>
  )
}
