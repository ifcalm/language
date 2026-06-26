import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import type { VerbPath } from '../types'
import {
  buildComposeChallenge,
  shuffleIds,
  type ComposeChunk,
} from './composePractice'

interface SentenceComposePracticeProps {
  path: VerbPath
}

const POOL_ID = 'pool'

function ChunkPill({
  chunk,
  locked,
  wrong,
  dragging,
}: {
  chunk: ComposeChunk
  locked?: boolean
  wrong?: boolean
  dragging?: boolean
}) {
  return (
    <span
      className={`compose-chip kind-${chunk.kind}${locked ? ' is-locked' : ''}${
        wrong ? ' is-wrong' : ''
      }${dragging ? ' is-dragging' : ''}`}
    >
      {chunk.text}
    </span>
  )
}

function DraggableChunk({
  chunk,
  locked,
  wrong,
}: {
  chunk: ComposeChunk
  locked?: boolean
  wrong?: boolean
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: chunk.id,
    disabled: locked,
  })

  return (
    <span
      ref={setNodeRef}
      className="compose-draggable"
      style={{ opacity: isDragging ? 0 : 1 }}
      {...(locked ? {} : attributes)}
      {...(locked ? {} : listeners)}
    >
      <ChunkPill chunk={chunk} locked={locked} wrong={wrong} />
    </span>
  )
}

function Slot({
  slotIndex,
  chunk,
  locked,
  wrong,
}: {
  slotIndex: number
  chunk: ComposeChunk | null
  locked: boolean
  wrong: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slotIndex}` })

  return (
    <span
      ref={setNodeRef}
      className={`compose-slot${chunk ? ' is-filled' : ''}${
        isOver ? ' is-over' : ''
      }${locked ? ' state-correct' : ''}${wrong ? ' state-wrong' : ''}`}
    >
      {chunk ? (
        <DraggableChunk chunk={chunk} locked={locked} wrong={wrong} />
      ) : null}
    </span>
  )
}

function Pool({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: POOL_ID })

  return (
    <div
      ref={setNodeRef}
      className={`compose-pool${isOver ? ' is-over' : ''}`}
      aria-label="词库"
    >
      {children}
    </div>
  )
}

function SentenceComposePractice({ path }: SentenceComposePracticeProps) {
  const challenge = useMemo(() => buildComposeChallenge(path), [path])

  // placement[slotIndex] = chunk id currently in that slot, or '' if empty.
  const [placement, setPlacement] = useState<string[]>(() =>
    challenge ? new Array(challenge.slotCount).fill('') : [],
  )
  const [poolOrder, setPoolOrder] = useState<string[]>(() =>
    challenge ? shuffleIds(challenge.chunks.map((chunk) => chunk.id)) : [],
  )
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  if (!challenge) {
    return <div className="compose-empty">这个路径还不能用来练习造句。</div>
  }

  const chunkById = new Map(challenge.chunks.map((chunk) => [chunk.id, chunk]))
  const isLocked = (slotIndex: number) =>
    placement[slotIndex] !== '' &&
    placement[slotIndex] === challenge.answerBySlot[slotIndex]
  const isWrong = (slotIndex: number) =>
    placement[slotIndex] !== '' && !isLocked(slotIndex)
  const isSolved =
    placement.length === challenge.slotCount &&
    placement.every((id, index) => id === challenge.answerBySlot[index])

  const placedIds = new Set(placement.filter(Boolean))
  const poolIds = poolOrder.filter((id) => !placedIds.has(id))

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)

    const { active, over } = event

    if (!over) {
      return
    }

    const chunkId = String(active.id)
    const overId = String(over.id)
    const fromSlot = placement.indexOf(chunkId)

    if (overId === POOL_ID) {
      if (fromSlot >= 0) {
        setPlacement((current) => {
          const next = [...current]
          next[fromSlot] = ''
          return next
        })
      }
      return
    }

    const toSlot = Number(overId.replace('slot-', ''))

    if (Number.isNaN(toSlot) || isLocked(toSlot)) {
      return
    }

    setPlacement((current) => {
      const next = [...current]

      if (fromSlot >= 0) {
        next[fromSlot] = ''
      }

      // Any non-locked chunk already in the target slot is bumped back to the
      // bank (it simply stops being in `placement`).
      next[toSlot] = chunkId
      return next
    })
  }

  const handleReset = () => {
    setPlacement(new Array(challenge.slotCount).fill(''))
    setPoolOrder(shuffleIds(challenge.chunks.map((chunk) => chunk.id)))
  }

  const activeChunk = activeId ? chunkById.get(activeId) : null

  return (
    <div className="compose-practice" aria-label="造句练习">
      <p className="compose-prompt-zh">{challenge.fullSentenceZh}</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className={`compose-sentence${activeId ? ' is-dragging' : ''}`}
        >
          {challenge.segments.map((segment, index) => {
            if (segment.type === 'fixed') {
              return (
                <span className="compose-fixed" key={`fixed-${index}`}>
                  {segment.text}
                </span>
              )
            }

            const chunkId = placement[segment.slotIndex]
            const chunk = chunkId ? chunkById.get(chunkId) ?? null : null

            return (
              <Slot
                key={`slot-${segment.slotIndex}`}
                slotIndex={segment.slotIndex}
                chunk={chunk}
                locked={isLocked(segment.slotIndex)}
                wrong={isWrong(segment.slotIndex)}
              />
            )
          })}
        </div>

        {isSolved ? (
          <div className="compose-solved" role="status">
            <p className="compose-solved-title">
              <svg
                className="compose-solved-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m5 13 4 4 10-10" />
              </svg>
              拼好了
            </p>
            <p className="compose-solved-sentence">{challenge.fullSentenceEn}</p>
          </div>
        ) : (
          <>
            <Pool>
              {poolIds.map((id) => {
                const chunk = chunkById.get(id)

                if (!chunk) {
                  return null
                }

                return <DraggableChunk key={id} chunk={chunk} />
              })}
            </Pool>

            <div className="compose-toolbar">
              <span className="compose-progress">
                {placement.filter(Boolean).length}/{challenge.slotCount}
              </span>
              <button
                type="button"
                className="compose-reshuffle"
                onClick={handleReset}
              >
                重来
              </button>
            </div>
          </>
        )}

        <DragOverlay>
          {activeChunk ? (
            <ChunkPill chunk={activeChunk} dragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default SentenceComposePractice
