import { useState } from 'react'
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

  return (
    <div className="path-study">
      <div className="path-study-tabs" role="tablist" aria-label="学习与练习">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'learn'}
          className={mode === 'learn' ? 'active' : ''}
          onClick={() => setMode('learn')}
        >
          学 · 看动画
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'practice'}
          className={mode === 'practice' ? 'active' : ''}
          onClick={() => setMode('practice')}
        >
          练 · 拼句子
        </button>
      </div>

      {mode === 'learn' ? (
        <SentenceGrowthPlayer path={path} />
      ) : (
        <SentenceComposePractice path={path} />
      )}
    </div>
  )
}

export default PathStudyTabs
