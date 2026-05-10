import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Hero from './components/hero/Hero'
import ScanLoader from './components/loading/ScanLoader'
import ReportLayout from './components/report/ReportLayout'
import ProphecyEngine from './components/prophecy/ProphecyEngine'
import ThesisMarket from './components/market/ThesisMarket'
import PrecursorScore from './components/score/PrecursorScore'
import Footer from './components/footer/Footer'

export default function App() {
  const [view, setView] = useState('hero')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}> 
      <Navbar />

      <div style={{ paddingTop: 52 }}>
        <AnimatePresence mode="wait">
          {view === 'hero' && (
            <motion.div
              key="hero"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
            >
              <Hero setView={setView} />
            </motion.div>
          )}

          {view === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <ScanLoader setView={setView} />
            </motion.div>
          )}

          {view === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ReportLayout />
              <ProphecyEngine />
              <ThesisMarket />
              <PrecursorScore />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
