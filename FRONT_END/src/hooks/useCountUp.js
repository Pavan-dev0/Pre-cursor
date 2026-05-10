import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, trigger, duration = 2000) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    if (!trigger) {
      setCount(0)
      return
    }

    let start = null

    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(ease * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
        return
      }

      setCount(target)
      frameRef.current = null
    }

    setCount(0)
    frameRef.current = requestAnimationFrame(step)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [target, trigger, duration])

  return count
}
