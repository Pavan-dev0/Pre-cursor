import { useState, useEffect } from 'react'

export function useCountUp(target, trigger, duration = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return

    let start = null

    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }

    requestAnimationFrame(step)
  }, [target, trigger, duration])

  return count
}
