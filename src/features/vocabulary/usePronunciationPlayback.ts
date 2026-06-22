import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  CoreVocabularyEntry,
  VocabularyPronunciation,
} from '../../data/vocabulary'
import { getPronunciationKey, getPronunciationLabel } from './utils'

export function usePronunciationPlayback() {
  const [activePronunciationKey, setActivePronunciationKey] = useState('')
  const [pronunciationPlaybackError, setPronunciationPlaybackError] = useState('')
  const pronunciationAudioRef = useRef<HTMLAudioElement | null>(null)

  const resetPronunciationPlayback = useCallback(() => {
    pronunciationAudioRef.current?.pause()
    pronunciationAudioRef.current = null
    setActivePronunciationKey('')
    setPronunciationPlaybackError('')
  }, [])

  useEffect(
    () => () => {
      pronunciationAudioRef.current?.pause()
      pronunciationAudioRef.current = null
    },
    [],
  )

  const playPronunciation = useCallback(
    (
      item: Pick<CoreVocabularyEntry, 'id' | 'word' | 'pronunciations'>,
      pronunciation: VocabularyPronunciation,
    ) => {
      const pronunciationKey = getPronunciationKey(item, pronunciation)
      const label = getPronunciationLabel(
        pronunciation,
        item.pronunciations?.findIndex((entry) => entry.id === pronunciation.id) ??
          0,
      )

      pronunciationAudioRef.current?.pause()
      pronunciationAudioRef.current = null
      setPronunciationPlaybackError('')
      setActivePronunciationKey(pronunciationKey)

      const audio = new Audio(pronunciation.audioUrl)
      pronunciationAudioRef.current = audio

      audio.addEventListener(
        'ended',
        () => {
          if (pronunciationAudioRef.current === audio) {
            setActivePronunciationKey('')
            pronunciationAudioRef.current = null
          }
        },
        { once: true },
      )

      audio.addEventListener(
        'error',
        () => {
          if (pronunciationAudioRef.current === audio) {
            setActivePronunciationKey('')
            pronunciationAudioRef.current = null
            setPronunciationPlaybackError(
              `${item.word} 的 ${label} 读音暂时无法播放，请稍后再试。`,
            )
          }
        },
        { once: true },
      )

      void audio.play().catch(() => {
        if (pronunciationAudioRef.current === audio) {
          setActivePronunciationKey('')
          pronunciationAudioRef.current = null
          setPronunciationPlaybackError(
            `${item.word} 的 ${label} 读音暂时无法播放，请检查浏览器播放权限。`,
          )
        }
      })
    },
    [],
  )

  return {
    activePronunciationKey,
    pronunciationPlaybackError,
    playPronunciation,
    resetPronunciationPlayback,
  }
}
