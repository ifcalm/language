import { useState } from 'react'
import type { VerbPath } from '../types'
import SentenceClozePractice from './SentenceClozePractice'
import SentenceComposePractice from './SentenceComposePractice'

interface PracticePanelProps {
  path: VerbPath
  // "Show both" is controlled by the parent so its toggle can share the
  // learn/practice switch row.
  showBoth: boolean
  onShowBothChange: (value: boolean) => void
}

type CardId = 'drag' | 'cloze'

function Chevron() {
  return (
    <svg
      className="practice-card-chevron"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

// Two stacked, collapsible cards (accordion). Both practices stay mounted —
// a collapsed card hides its own body via CSS, so progress is kept and the
// drag word bank isn't visible while doing cloze (no peeking at answers).
// "同时显示" expands both for side-by-side reference.
function PracticePanel({ path, showBoth, onShowBothChange }: PracticePanelProps) {
  const [expanded, setExpanded] = useState<CardId>('drag')

  const dragOpen = showBoth || expanded === 'drag'
  const clozeOpen = showBoth || expanded === 'cloze'

  // Clicking a header focuses that card (collapses the other), leaving the
  // "both" mode if it was on.
  const focusCard = (card: CardId) => {
    onShowBothChange(false)
    setExpanded(card)
  }

  return (
    <div className="practice-accordion">
      <section className={`practice-card${dragOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="practice-card-head"
          aria-expanded={dragOpen}
          onClick={() => focusCard('drag')}
        >
          <span className="practice-card-title">
            <span className="practice-step">基础</span>
            拖一拖 · 把词块拖进空格
          </span>
          <Chevron />
        </button>
        <div className="practice-card-body">
          <SentenceComposePractice path={path} />
        </div>
      </section>

      <section className={`practice-card${clozeOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="practice-card-head"
          aria-expanded={clozeOpen}
          onClick={() => focusCard('cloze')}
        >
          <span className="practice-card-title">
            <span className="practice-step">进阶</span>
            写一写 · 默写重要单词
          </span>
          <Chevron />
        </button>
        <div className="practice-card-body">
          <SentenceClozePractice path={path} />
        </div>
      </section>
    </div>
  )
}

export default PracticePanel
