import { useEffect, useRef, useState } from 'react'
import SentenceGrowthPlayer from '../SentenceGrowthPlayer'
import type { VerbPath } from '../types'
import SentenceComposePractice from './SentenceComposePractice'

interface PathStudyTabsProps {
  path: VerbPath
}

type StudyMode = 'learn' | 'practice'

// Thin shell that toggles between the (untouched) animation player and the
// composing practice. The two never import each other and never share state,
// so they can't interfere — switching modes just swaps which one is mounted.
function PathStudyTabs({ path }: PathStudyTabsProps) {
  const [mode, setMode] = useState<StudyMode>('learn')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const isFirstRender = useRef(true)

  // The learn (tall animation) and practice (short board) views differ a lot in
  // height, so a raw swap makes the page jump. Re-anchor to the switcher on each
  // change so the eye stays put; the min-height + fade (CSS) smooth the rest.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [mode])

  return (
    <div className="path-study" ref={rootRef}>
      <div className="path-study-head">
        <div className="path-study-tabs" role="tablist" aria-label="学习与练习">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'learn'}
            aria-label="学 · 看动画"
            className={mode === 'learn' ? 'active' : ''}
            onClick={() => setMode('learn')}
          >
            学
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'practice'}
            aria-label="练 · 拼句子"
            className={mode === 'practice' ? 'active' : ''}
            onClick={() => setMode('practice')}
          >
            练
          </button>
        </div>
      </div>

      <div className="path-study-content">
        <div className="path-study-pane" key={mode}>
          {mode === 'learn' ? (
            <SentenceGrowthPlayer path={path} />
          ) : (
            <SentenceComposePractice path={path} />
          )}
        </div>
      </div>
    </div>
  )
}

export default PathStudyTabs
