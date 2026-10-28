import { useCallback, useEffect, useRef, useState } from 'react'

export function useIeltsAudio() {
  const [activeKey, setActiveKey] = useState('')
  const [playbackError, setPlaybackError] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(
    () => () => {
      audioRef.current?.pause()
      audioRef.current = null
    },
    [],
  )

  const play = useCallback((key: string, url: string, label: string) => {
    audioRef.current?.pause()
    setPlaybackError('')
    setActiveKey(key)

    const audio = new Audio(url)
    audioRef.current = audio

    function finish(error = '') {
      if (audioRef.current === audio) {
        audioRef.current = null
        setActiveKey('')
        setPlaybackError(error)
      }
    }

    audio.addEventListener('ended', () => finish(), { once: true })
    audio.addEventListener('error', () => finish(`${label} 暂时无法播放，请稍后再试。`), {
      once: true,
    })
    void audio.play().catch(() => finish(`${label} 无法播放，请检查浏览器播放权限。`))
  }, [])

  return { activeKey, playbackError, play }
}
