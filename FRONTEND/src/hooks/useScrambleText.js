import { useState, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'

export function useScrambleText(finalText, trigger, duration = 600) {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (!trigger) {
      setDisplayText('')
      return
    }

    const len = finalText.length
    const startTime = Date.now()
    let resolved = 0

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const charTime = duration / len
      const newResolved = Math.min(Math.floor(elapsed / charTime), len)

      if (newResolved > resolved) resolved = newResolved

      let result = ''
      for (let i = 0; i < len; i++) {
        if (i < resolved) result += finalText[i]
        else result += CHARS[Math.floor(Math.random() * CHARS.length)]
      }

      setDisplayText(result)

      if (resolved >= len) {
        clearInterval(interval)
        setDisplayText(finalText)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [finalText, trigger, duration])

  return { displayText: displayText || finalText }
}
