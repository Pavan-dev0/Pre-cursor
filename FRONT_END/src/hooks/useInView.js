import { useEffect, useState } from 'react'

export function useInView(options = 0.2) {
  const config = typeof options === 'number' ? { threshold: options } : options
  const { threshold = 0.2, root = null, rootMargin = '0px', triggerOnce = true } = config
  const [node, setNode] = useState(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    if (triggerOnce && inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) observer.disconnect()
          return
        }

        if (!triggerOnce) {
          setInView(false)
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, node, root, rootMargin, threshold, triggerOnce])

  return { ref: setNode, inView }
}
