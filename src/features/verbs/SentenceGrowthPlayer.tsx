import { type ReactNode, useEffect, useId, useMemo, useState } from 'react'
import type {
  SentenceGrowth,
  SentenceGrowthLink,
  SentenceGrowthNode,
  SentenceGrowthStep,
  VerbPath,
} from './types'

interface SentenceGrowthPlayerProps {
  path: VerbPath
}

type DisplayStep = Pick<
  SentenceGrowthStep,
  'stepNo' | 'label' | 'sentenceEn' | 'sentenceZh' | 'noteZh'
>

interface TreePoint {
  x: number
  y: number
}

interface SentenceGrowthLine {
  key: string
  stepNo: number
  label: string
  sentenceEn: string
  highlightTexts: string[]
}

const TREE_WIDTH = 1000
const TREE_HEIGHT = 900

function getVisibleIds(growth: SentenceGrowth, activeStepIndex: number) {
  const visibleNodeIds = new Set<string>()
  const visibleLinkIds = new Set<string>()

  for (const step of growth.steps.slice(0, activeStepIndex + 1)) {
    step.showNodes.forEach((nodeId) => visibleNodeIds.add(nodeId))
    step.showLinks.forEach((linkId) => visibleLinkIds.add(linkId))
  }

  return { visibleNodeIds, visibleLinkIds }
}

function createDisplayGrowth(path: VerbPath) {
  const growth = path.growth
  const actionNode = growth?.nodes.find((node) => node.kind === 'action')

  if (!growth || !actionNode) {
    return growth
  }

  const firstStep = growth.steps[0]
  const alreadyStartsWithAction =
    firstStep?.showNodes.length === 1 &&
    firstStep.showNodes[0] === actionNode.id &&
    firstStep.showLinks.length === 0

  if (alreadyStartsWithAction) {
    return growth
  }

  return {
    ...growth,
    steps: [
      {
        stepNo: 1,
        label: '动词',
        sentenceEn: actionNode.text,
        sentenceZh: path.meaningZh,
        showNodes: [actionNode.id],
        showLinks: [],
        focusNode: actionNode.id,
        noteZh: '先只看动作。后面的词会围绕这个动词慢慢长出来。',
      },
      ...growth.steps.map((step, index) => ({
        ...step,
        stepNo: index + 2,
      })),
    ],
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function spreadPoints(count: number, left: number, right: number) {
  if (count <= 0) {
    return []
  }

  if (count === 1) {
    return [(left + right) / 2]
  }

  const step = (right - left) / (count - 1)

  return Array.from({ length: count }, (_, index) => left + step * index)
}

function uniqueIds(ids: string[]) {
  return ids.filter((id, index) => id && ids.indexOf(id) === index)
}

function hashText(text: string) {
  return Array.from(text).reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) % 997,
    11,
  )
}

function isActionOnlyStep(growth: SentenceGrowth, step: SentenceGrowthStep) {
  const actionNode = growth.nodes.find((node) => node.kind === 'action')

  return Boolean(
    actionNode &&
      step.showNodes.length === 1 &&
      step.showNodes[0] === actionNode.id &&
      step.showLinks.length === 0,
  )
}

function buildSentenceGrowthLines(
  path: VerbPath,
  growth: SentenceGrowth | null | undefined,
): SentenceGrowthLine[] {
  if (!growth) {
    return path.steps.map((step) => ({
      key: `${path.id}-${step.stepNo}`,
      stepNo: step.stepNo,
      label: step.label,
      sentenceEn: step.sentenceEn,
      highlightTexts: step.focusText ? [step.focusText] : [],
    }))
  }

  const nodeById = new Map(growth.nodes.map((node) => [node.id, node]))

  return growth.steps
    .filter((step) => !isActionOnlyStep(growth, step))
    .map((step) => ({
      key: `${path.id}-${step.stepNo}`,
      stepNo: step.stepNo,
      label: step.label,
      sentenceEn: step.sentenceEn,
      highlightTexts: step.showNodes
        .map((nodeId) => nodeById.get(nodeId)?.text)
        .filter((text): text is string => Boolean(text?.trim())),
    }))
}

function getHighlightRanges(sentence: string, highlightTexts: string[]) {
  const normalizedSentence = sentence.toLowerCase()
  const ranges: Array<{ start: number; end: number }> = []

  const sortedTexts = [...highlightTexts]
    .map((text) => text.trim())
    .filter(Boolean)
    .sort((left, right) => right.length - left.length)

  for (const text of sortedTexts) {
    const normalizedText = text.toLowerCase()
    let start = normalizedSentence.indexOf(normalizedText)

    while (start >= 0) {
      const end = start + normalizedText.length
      const overlaps = ranges.some(
        (range) => start < range.end && end > range.start,
      )

      if (!overlaps) {
        ranges.push({ start, end })
      }

      start = normalizedSentence.indexOf(normalizedText, end)
    }
  }

  return ranges.sort((left, right) => left.start - right.start)
}

function renderHighlightedSentence(
  sentence: string,
  highlightTexts: string[],
  keyPrefix: string,
) {
  const ranges = getHighlightRanges(sentence, highlightTexts)

  if (ranges.length === 0) {
    return sentence
  }

  const parts: ReactNode[] = []
  let cursor = 0

  ranges.forEach((range, index) => {
    if (range.start > cursor) {
      parts.push(sentence.slice(cursor, range.start))
    }

    parts.push(
      <mark key={`${keyPrefix}-highlight-${index}`}>
        {sentence.slice(range.start, range.end)}
      </mark>,
    )
    cursor = range.end
  })

  if (cursor < sentence.length) {
    parts.push(sentence.slice(cursor))
  }

  return parts
}

function SentenceGrowthLines({
  activeStepNo,
  lines,
}: {
  activeStepNo: number
  lines: SentenceGrowthLine[]
}) {
  if (lines.length === 0) {
    return null
  }

  return (
    <ol className="sentence-growth-lines" aria-label="句子生长过程">
      {lines.map((line, index) => (
        <li
          key={line.key}
          className={line.stepNo === activeStepNo ? 'active' : ''}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <strong>{line.label}</strong>
            <p>
              {renderHighlightedSentence(
                line.sentenceEn,
                line.highlightTexts,
                line.key,
              )}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function buildTreeLayout(growth: SentenceGrowth, activeStepIndex: number) {
  const actionNode = growth.nodes.find((node) => node.kind === 'action')

  if (!actionNode) {
    return {
      activeStep: growth.steps[activeStepIndex],
      layoutNodes: [],
      layoutLinks: [],
      positions: new Map<string, TreePoint>(),
    }
  }

  const activeStep = growth.steps[activeStepIndex]
  const { visibleNodeIds, visibleLinkIds } = getVisibleIds(growth, activeStepIndex)
  const visibleLinks = growth.links.filter((link) => visibleLinkIds.has(link.id))
  const visibleNodeCount = growth.nodes.filter((node) => visibleNodeIds.has(node.id)).length
  const rootCoreLinks = visibleLinks.filter(
    (link) => link.kind === 'core' && link.from === actionNode.id,
  )
  const rootModifierLinks = visibleLinks.filter(
    (link) => link.kind === 'modifier' && link.to === actionNode.id,
  )
  const rootY = visibleNodeCount > 1 ? (rootModifierLinks.length > 0 ? 375 : 220) : 175
  const positions = new Map<string, TreePoint>([
    [actionNode.id, { x: TREE_WIDTH / 2, y: rootY }],
  ])

  const coreChildren = uniqueIds(rootCoreLinks.map((link) => link.to))
  const coreChildXs = spreadPoints(coreChildren.length, 340, 660)

  coreChildren.forEach((nodeId, index) => {
    positions.set(nodeId, {
      x: coreChildXs[index],
      y: rootModifierLinks.length > 0 ? 635 : 500,
    })
  })

  const actionModifiers = uniqueIds(rootModifierLinks.map((link) => link.from))
  const actionModifierXs = spreadPoints(actionModifiers.length, 180, 820)

  actionModifiers.forEach((nodeId, index) => {
    const staggeredY = actionModifiers.length > 1 && index % 2 === 1 ? 175 : 45

    positions.set(nodeId, { x: actionModifierXs[index], y: staggeredY })
  })

  coreChildren.forEach((targetId) => {
    const target = positions.get(targetId)

    if (!target) {
      return
    }

    const childIds = visibleLinks
      .filter((link) => link.kind === 'modifier' && link.to === targetId)
      .map((link) => link.from)
    const childXs = spreadPoints(
      childIds.length,
      clamp(target.x - 170, 90, 790),
      clamp(target.x + 170, 210, 910),
    )

    childIds.forEach((childId, childIndex) => {
      positions.set(childId, {
        x: childXs[childIndex],
        y: rootModifierLinks.length > 0 ? 765 : 705,
      })
    })
  })

  const layoutNodes = growth.nodes
    .filter((node) => visibleNodeIds.has(node.id))
    .map((node) => {
      const point = positions.get(node.id) ?? { x: TREE_WIDTH / 2, y: 258 }

      return {
        node,
        ...point,
      }
    })

  const layoutLinks = visibleLinks.filter(
    (link) => positions.has(link.from) && positions.has(link.to),
  )

  return { activeStep, layoutNodes, layoutLinks, positions }
}

function getNodeAnchor(from: TreePoint, to: TreePoint) {
  const isGoingDown = to.y >= from.y
  const verticalOffset = 42
  const horizontalOffset = Math.abs(to.x - from.x) > 190 ? 26 : 0

  return {
    x: from.x + (to.x > from.x ? horizontalOffset : -horizontalOffset),
    y: from.y + (isGoingDown ? verticalOffset : -verticalOffset),
  }
}

function makeSketchPath(link: SentenceGrowthLink, from: TreePoint, to: TreePoint) {
  const start = getNodeAnchor(from, to)
  const end = getNodeAnchor(to, from)
  const hash = hashText(link.id)
  const wobble = (hash % 19) - 9
  const lift = link.kind === 'modifier' ? -18 : 14
  const controlA = {
    x: start.x + (end.x - start.x) * 0.34 + wobble,
    y: start.y + (end.y - start.y) * 0.28 + lift,
  }
  const controlB = {
    x: start.x + (end.x - start.x) * 0.72 - wobble / 2,
    y: start.y + (end.y - start.y) * 0.74 - lift,
  }

  return [
    `M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`,
    `C ${controlA.x.toFixed(1)} ${controlA.y.toFixed(1)}`,
    `${controlB.x.toFixed(1)} ${controlB.y.toFixed(1)}`,
    `${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
  ].join(' ')
}

function NodePill({
  node,
  isFocused,
}: {
  node: SentenceGrowthNode
  isFocused: boolean
}) {
  return (
    <span className={`sentence-tree-node ${node.kind} ${isFocused ? 'focused' : ''}`}>
      {node.text}
    </span>
  )
}

function SentenceTree({
  growth,
  activeStepIndex,
}: {
  growth: SentenceGrowth
  activeStepIndex: number
}) {
  const markerId = useId().replace(/:/g, '')
  const { activeStep, layoutNodes, layoutLinks, positions } =
    buildTreeLayout(growth, activeStepIndex)

  if (layoutNodes.length === 0) {
    return null
  }

  return (
    <div className="sentence-tree" aria-label="句子结构树">
      <div className="sentence-tree-canvas">
        <svg
          aria-hidden="true"
          className="sentence-tree-links"
          viewBox={`0 0 ${TREE_WIDTH} ${TREE_HEIGHT}`}
        >
          <defs>
            <marker
              id={`sentence-arrow-core-${markerId}`}
              markerHeight="10"
              markerWidth="10"
              orient="auto"
              refX="8"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker
              id={`sentence-arrow-modifier-${markerId}`}
              markerHeight="10"
              markerWidth="10"
              orient="auto"
              refX="8"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#15803d" />
            </marker>
          </defs>

          {layoutLinks.some((link) => link.kind === 'core') && (
            <g className="sentence-tree-core-frame" aria-hidden="true">
              <rect x="145" y="245" width="710" height="510" rx="34" />
              <text x="176" y="285">主干</text>
            </g>
          )}

          {layoutLinks.map((link) => {
            const from = positions.get(link.from)
            const to = positions.get(link.to)

            if (!from || !to) {
              return null
            }

            const pathD = makeSketchPath(link, from, to)

            return (
              <g key={link.id} className={`sentence-tree-link-group ${link.kind}`}>
                <path className="sentence-tree-link-shadow" d={pathD} />
                <path
                  className={`sentence-tree-link ${link.kind}`}
                  d={pathD}
                  markerEnd={
                    link.kind === 'modifier'
                      ? `url(#sentence-arrow-${link.kind}-${markerId})`
                      : undefined
                  }
                />
              </g>
            )
          })}
        </svg>

        {layoutNodes.map(({ node, x, y }) => (
          <div
            key={node.id}
            className="sentence-tree-node-anchor"
            style={{
              left: `${(x / TREE_WIDTH) * 100}%`,
              top: `${(y / TREE_HEIGHT) * 100}%`,
            }}
          >
            <NodePill node={node} isFocused={node.id === activeStep?.focusNode} />
          </div>
        ))}
      </div>

    </div>
  )
}

function SentenceGrowthPlayer({ path }: SentenceGrowthPlayerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [previewStepIndex, setPreviewStepIndex] = useState<number | null>(null)
  const displayGrowth = useMemo(() => createDisplayGrowth(path), [path])
  const steps: DisplayStep[] = displayGrowth?.steps ?? path.steps
  const sentenceLines = useMemo(
    () => buildSentenceGrowthLines(path, displayGrowth),
    [displayGrowth, path],
  )
  const safeActiveStepIndex = Math.min(
    activeStepIndex,
    Math.max(steps.length - 1, 0),
  )
  const activeStep = steps[safeActiveStepIndex]
  const canGoNext = safeActiveStepIndex < steps.length - 1

  useEffect(() => {
    if (!isPlaying || !canGoNext) {
      return
    }

    const timer = window.setTimeout(() => {
      setActiveStepIndex((current) => Math.min(current + 1, steps.length - 1))
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [canGoNext, isPlaying, steps.length, activeStepIndex])

  if (!activeStep) {
    return (
      <section className="sentence-player-empty">
        这个动词还没有句子生长路径。
      </section>
    )
  }

  return (
    <section className="sentence-player" aria-label="句子生长动画">
      <div className="sentence-player-main">
        <div className="sentence-player-board">
          <div className="sentence-player-stage">
            <SentenceGrowthLines
              activeStepNo={activeStep.stepNo}
              lines={sentenceLines}
            />

            <div className="sentence-animation-card">
              {displayGrowth && (
                <SentenceTree
                  growth={displayGrowth}
                  activeStepIndex={safeActiveStepIndex}
                />
              )}

              <aside className="sentence-player-step-rail" aria-label="句子生长步骤">
                <button
                  type="button"
                  className="sentence-player-rail-play"
                  onClick={() => {
                    if (!canGoNext) {
                      setActiveStepIndex(0)
                      setIsPlaying(true)
                      return
                    }

                    setIsPlaying((current) => !current)
                  }}
                  aria-label={canGoNext ? (isPlaying ? '暂停' : '播放') : '重播'}
                >
                  {isPlaying ? 'Ⅱ' : '▶'}
                </button>

                <ol className="sentence-player-steps">
                  {steps.map((step, index) => (
                    <li key={`${path.id}-${step.stepNo}`}>
                      <button
                        type="button"
                        className={[
                          index < safeActiveStepIndex ? 'completed' : '',
                          index === safeActiveStepIndex ? 'active' : '',
                          index === previewStepIndex ? 'preview' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => {
                          setActiveStepIndex(index)
                          setIsPlaying(false)
                          setPreviewStepIndex(null)
                        }}
                        onFocus={() => setPreviewStepIndex(index)}
                        onBlur={() => setPreviewStepIndex(null)}
                        onMouseEnter={() => setPreviewStepIndex(index)}
                        onMouseLeave={() => setPreviewStepIndex(null)}
                        onPointerEnter={() => setPreviewStepIndex(index)}
                        onPointerLeave={() => setPreviewStepIndex(null)}
                        aria-label={`第 ${step.stepNo} 步：${step.label}`}
                      >
                        <span>{String(step.stepNo)}</span>
                        <strong>{step.label}</strong>
                      </button>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SentenceGrowthPlayer
