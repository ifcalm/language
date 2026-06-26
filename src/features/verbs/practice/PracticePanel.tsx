import { useState } from 'react'
import type { VerbPath } from '../types'
import SentenceClozePractice from './SentenceClozePractice'
import SentenceComposePractice from './SentenceComposePractice'

interface PracticePanelProps {
  path: VerbPath
}

type SubMode = 'drag' | 'cloze'

// Drag and cloze are mutually exclusive by default so the cloze answers aren't
// visible in the drag word bank. Both stay mounted (hidden via CSS) to keep
// progress; the "同时显示" switch reveals both for side-by-side reference.
function PracticePanel({ path }: PracticePanelProps) {
  const [subMode, setSubMode] = useState<SubMode>('drag')
  const [showBoth, setShowBoth] = useState(false)

  const dragVisible = showBoth || subMode === 'drag'
  const clozeVisible = showBoth || subMode === 'cloze'

  return (
    <div className={`practice-panel${showBoth ? ' show-both' : ''}`}>
      <div className="practice-switch">
        <div className="practice-subtabs" role="tablist" aria-label="练习方式">
          <button
            type="button"
            role="tab"
            aria-selected={!showBoth && subMode === 'drag'}
            className={!showBoth && subMode === 'drag' ? 'active' : ''}
            disabled={showBoth}
            onClick={() => setSubMode('drag')}
          >
            基础拖拽
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!showBoth && subMode === 'cloze'}
            className={!showBoth && subMode === 'cloze' ? 'active' : ''}
            disabled={showBoth}
            onClick={() => setSubMode('cloze')}
          >
            进阶填词
          </button>
        </div>

        <label className="practice-both-toggle">
          <input
            type="checkbox"
            checked={showBoth}
            onChange={(event) => setShowBoth(event.target.checked)}
          />
          <span>同时显示</span>
        </label>
      </div>

      <div className={`practice-group${dragVisible ? '' : ' is-hidden'}`}>
        <SentenceComposePractice path={path} />
      </div>
      <div
        className={`practice-group cloze-group${
          clozeVisible ? '' : ' is-hidden'
        }`}
      >
        <SentenceClozePractice path={path} />
      </div>
    </div>
  )
}

export default PracticePanel
