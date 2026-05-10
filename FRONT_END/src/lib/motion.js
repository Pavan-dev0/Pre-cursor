export const easeStandard = [0.22, 1, 0.36, 1]

export const durations = {
  micro: 0.16,
  standard: 0.28,
  medium: 0.32,
  reveal: 0.58,
  cinematic: 0.68,
}

export const transitions = {
  micro: { duration: durations.micro, ease: easeStandard },
  standard: { duration: durations.standard, ease: easeStandard },
  medium: { duration: durations.medium, ease: easeStandard },
  reveal: { duration: durations.reveal, ease: easeStandard },
  cinematic: { duration: durations.cinematic, ease: easeStandard },
}

export const withDelay = (transition, delay = 0) => ({
  ...transition,
  delay,
})

export const viewportOnce = {
  once: true,
  amount: 0.2,
}

export const fadeUpVariants = (distance = 20, transition = transitions.reveal) => ({
  hidden: { opacity: 0, y: distance },
  visible: { opacity: 1, y: 0, transition },
})

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})
