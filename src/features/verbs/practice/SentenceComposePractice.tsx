import { useMemo, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { VerbPath } from '../types'
import {
  buildComposeChallenge,
  gradeOrder,
  shuffleChallengeOrder,
  type ComposeChunk,
  type GradeResult,
} from './composePractice'

interface SentenceComposePracticeProps {
  path: VerbPath
}

type ChunkState = 'idle' | 'correct' | 'wrong'

function ComposeChip({
  chunk,
  showHint,
  state,
}: {
  chunk: ComposeChunk
  showHint: boolean
  state: ChunkState
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chunk.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`compose-chip kind-${chunk.kind} state-${state}${
        isDragging ? ' is-dragging' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <span className="compose-chip-text">{chunk.text}</span>
      {showHint && chunk.labelZh ? (
        <small className="compose-chip-hint">{chunk.labelZh}</small>
      ) : null}
    </div>
  )
}

function SentenceComposePractice({ path }: SentenceComposePracticeProps) {
  const challenge = useMemo(() => buildComposeChallenge(path), [path])

  const [order, setOrder] = useState<string[]>(() =>
    challenge ? shuffleChallengeOrder(challenge.answerOrder) : [],
  )
  const [showHint, setShowHint] = useState(true)
  const [result, setResult] = useState<GradeResult | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (!challenge) {
    return (
      <div className="compose-empty">这个路径还不能用来练习造句。</div>
    )
  }

  const chunkById = new Map(challenge.chunks.map((chunk) => [chunk.id, chunk]))
  const isSolved = result?.isAllCorrect ?? false

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setOrder((current) => {
      const from = current.indexOf(String(active.id))
      const to = current.indexOf(String(over.id))

      if (from < 0 || to < 0) {
        return current
      }

      return arrayMove(current, from, to)
    })
    // Any move invalidates the previous check.
    setResult(null)
  }

  function handleCheck() {
    setResult(gradeOrder(order, challenge!.answerOrder))
  }

  function handleReshuffle() {
    setOrder(shuffleChallengeOrder(challenge!.answerOrder))
    setResult(null)
  }

  function chunkStateAt(index: number, id: string): ChunkState {
    if (isSolved) {
      return 'correct'
    }

    if (!result) {
      return 'idle'
    }

    return result.correctByIndex[index] && order[index] === id
      ? 'correct'
      : 'wrong'
  }

  return (
    <div className="compose-practice" aria-label="造句练习">
      <p className="compose-prompt-label">照这个意思，把词块拖成正确语序</p>
      <p className="compose-prompt-zh">{challenge.fullSentenceZh}</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <div className="compose-board">
            {order.map((id, index) => {
              const chunk = chunkById.get(id)

              if (!chunk) {
                return null
              }

              return (
                <ComposeChip
                  key={id}
                  chunk={chunk}
                  showHint={showHint && !isSolved}
                  state={chunkStateAt(index, id)}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      {isSolved ? (
        <div className="compose-solved" role="status">
          <p className="compose-solved-title">
            <svg className="compose-solved-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 13 4 4 10-10" />
            </svg>
            语序正确
          </p>
          <p className="compose-solved-sentence">{challenge.fullSentenceEn}</p>
          <p className="compose-solved-zh">{challenge.fullSentenceZh}</p>
        </div>
      ) : (
        <div className="compose-toolbar">
          <button
            type="button"
            className="compose-hint-toggle"
            aria-pressed={showHint}
            onClick={() => setShowHint((value) => !value)}
          >
            {showHint ? '隐藏提示' : '显示提示'}
          </button>

          <div className="compose-actions">
            <button
              type="button"
              className="compose-reshuffle"
              onClick={handleReshuffle}
            >
              重新打乱
            </button>
            <button
              type="button"
              className="compose-check"
              onClick={handleCheck}
            >
              检查
            </button>
          </div>
        </div>
      )}

      {result && !isSolved ? (
        <p className="compose-feedback" role="status">
          对了 {result.correctCount}/{challenge.answerOrder.length} 个位置，红色的块还在错的位置上，继续调整。
        </p>
      ) : null}
    </div>
  )
}

export default SentenceComposePractice
