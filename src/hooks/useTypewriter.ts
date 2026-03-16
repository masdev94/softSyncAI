import { useEffect, useState } from 'react'

/**
 * Returns text revealed character-by-character (typewriter effect).
 * @param fullText - Full string to reveal
 * @param enabled - When true, starts typing
 * @param speedMs - Delay between characters
 */
export function useTypewriter(
  fullText: string,
  enabled: boolean,
  speedMs: number = 35
): [string, boolean] {
  const [index, setIndex] = useState(0)
  const isComplete = index >= fullText.length

  useEffect(() => {
    if (!enabled || fullText.length === 0) return
    setIndex(0)
  }, [enabled, fullText])

  useEffect(() => {
    if (!enabled || index >= fullText.length) return
    const t = setTimeout(() => setIndex((i) => Math.min(i + 1, fullText.length)), speedMs)
    return () => clearTimeout(t)
  }, [enabled, fullText, index, speedMs])

  return [fullText.slice(0, index), isComplete]
}
