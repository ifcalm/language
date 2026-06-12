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
const TREE_MIN_HEIGHT = 560
const TREE_LEVEL_GAP = 170
const TREE_TOP_PADDING = 92

function getRootActionNode(growth: SentenceGrowth) {
  return (
    growth.nodes.find((node) => node.id === growth.rootActionId) ??
    growth.nodes.find((node) => node.kind === 'action')
  )
}

function getVisibleIds(growth: SentenceGrowth, activeStepIndex: number) {
  const visibleNodeIds = new Set<string>()
  const visibleLinkIds = new Set<string>()

  for (const step of growth.steps.slice(0, activeStepIndex + 1)) {
    step.addNodeIds.forEach((nodeId) => visibleNodeIds.add(nodeId))
    step.addLinkIds.forEach((linkId) => visibleLinkIds.add(linkId))
  }

  return { visibleNodeIds, visibleLinkIds }
}

function createDisplayGrowth(path: VerbPath) {
  const growth = path.growth
  const actionNode = growth ? getRootActionNode(growth) : undefined

  if (!growth || !actionNode) {
    return growth
  }

  const firstStep = growth.steps[0]
  const alreadyStartsWithAction =
    firstStep?.addNodeIds.length === 1 &&
    firstStep.addNodeIds[0] === actionNode.id &&
    firstStep.addLinkIds.length === 0

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
        addNodeIds: [actionNode.id],
        addLinkIds: [],
        focusNodeId: actionNode.id,
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

function hashText(text: string) {
  return Array.from(text).reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) % 997,
    11,
  )
}

function isActionOnlyStep(growth: SentenceGrowth, step: SentenceGrowthStep) {
  const actionNode = getRootActionNode(growth)

  return Boolean(
    actionNode &&
      step.addNodeIds.length === 1 &&
      step.addNodeIds[0] === actionNode.id &&
      step.addLinkIds.length === 0,
  )
}

function buildSentenceGrowthLines(
  path: VerbPath,
  growth: SentenceGrowth | null | undefined,
): SentenceGrowthLine[] {
  if (!growth) {
    return []
  }

  const nodeById = new Map(growth.nodes.map((node) => [node.id, node]))

  return growth.steps
    .filter((step) => !isActionOnlyStep(growth, step))
    .map((step) => ({
      key: `${path.id}-${step.stepNo}`,
      stepNo: step.stepNo,
      label: step.label,
      sentenceEn: step.sentenceEn,
      highlightTexts: step.addNodeIds
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

function getVisualEndpoints(link: SentenceGrowthLink) {
  return link.kind === 'core'
    ? { parentId: link.from, childId: link.to }
    : { parentId: link.to, childId: link.from }
}

function buildTreeLayout(growth: SentenceGrowth, activeStepIndex: number) {
  const rootActionNode = getRootActionNode(growth)

  if (!rootActionNode) {
    return {
      activeStep: growth.steps[activeStepIndex],
      layoutNodes: [],
      layoutLinks: [],
      positions: new Map<string, TreePoint>(),
      treeHeight: TREE_MIN_HEIGHT,
      coreFrame: null,
    }
  }

  const activeStep = growth.steps[activeStepIndex]
  const { visibleNodeIds, visibleLinkIds } = getVisibleIds(growth, activeStepIndex)
  const visibleNodes = growth.nodes.filter((node) => visibleNodeIds.has(node.id))
  const visibleNodeById = new Map(visibleNodes.map((node) => [node.id, node]))
  const visibleLinks = growth.links.filter(
    (link) =>
      visibleLinkIds.has(link.id) &&
      visibleNodeIds.has(link.from) &&
      visibleNodeIds.has(link.to),
  )
  const rootId = visibleNodeIds.has(rootActionNode.id)
    ? rootActionNode.id
    : visibleNodes.find((node) => node.kind === 'action')?.id

  if (!rootId) {
    return {
      activeStep,
      layoutNodes: [],
      layoutLinks: [],
      positions: new Map<string, TreePoint>(),
      treeHeight: TREE_MIN_HEIGHT,
      coreFrame: null,
    }
  }

  const adjacency = new Map<
    string,
    Array<{ childId: string; link: SentenceGrowthLink }>
  >()

  visibleLinks.forEach((link) => {
    const { parentId, childId } = getVisualEndpoints(link)
    const children = adjacency.get(parentId) ?? []

    children.push({ childId, link })
    adjacency.set(parentId, children)
  })

  adjacency.forEach((children) => {
    children.sort((left, right) => {
      const leftNode = visibleNodeById.get(left.childId)
      const rightNode = visibleNodeById.get(right.childId)
      const kindOrder = { action: 0, core: 1, modifier: 2 }
      const kindDifference =
        kindOrder[leftNode?.kind ?? 'modifier'] -
        kindOrder[rightNode?.kind ?? 'modifier']

      return kindDifference || left.childId.localeCompare(right.childId)
    })
  })

  const parentById = new Map<string, string>()
  const depthById = new Map<string, number>([[rootId, 0]])
  const queue = [rootId]

  while (queue.length > 0) {
    const parentId = queue.shift()

    if (!parentId) {
      continue
    }

    const parentDepth = depthById.get(parentId) ?? 0

    for (const { childId } of adjacency.get(parentId) ?? []) {
      if (childId === rootId || depthById.has(childId)) {
        continue
      }

      parentById.set(childId, parentId)
      depthById.set(childId, parentDepth + 1)
      queue.push(childId)
    }
  }

  visibleNodes.forEach((node) => {
    if (depthById.has(node.id)) {
      return
    }

    parentById.set(node.id, rootId)
    depthById.set(node.id, 1)
  })

  const coreNodes = visibleNodes.filter((node) => node.kind !== 'modifier')
  const coreChildrenByParent = new Map<string, string[]>()

  parentById.forEach((parentId, childId) => {
    const childNode = visibleNodeById.get(childId)

    if (!childNode || childNode.kind === 'modifier') {
      return
    }

    const children = coreChildrenByParent.get(parentId) ?? []

    children.push(childId)
    coreChildrenByParent.set(parentId, children)
  })

  coreChildrenByParent.forEach((children) => {
    children.sort((leftId, rightId) => {
      const leftNode = visibleNodeById.get(leftId)
      const rightNode = visibleNodeById.get(rightId)
      const kindOrder = { action: 0, core: 1, modifier: 2 }

      return (
        kindOrder[leftNode?.kind ?? 'core'] -
          kindOrder[rightNode?.kind ?? 'core'] ||
        leftId.localeCompare(rightId)
      )
    })
  })

  const rawCoreXById = new Map<string, number>()
  let leafCursor = 0

  function assignCoreRawX(
    nodeId: string,
    visiting = new Set<string>(),
  ): number {
    if (rawCoreXById.has(nodeId)) {
      return rawCoreXById.get(nodeId) ?? 0
    }

    if (visiting.has(nodeId)) {
      const fallback = leafCursor
      leafCursor += 1
      rawCoreXById.set(nodeId, fallback)
      return fallback
    }

    const nextVisiting = new Set(visiting)
    nextVisiting.add(nodeId)
    const children = coreChildrenByParent.get(nodeId) ?? []

    if (children.length === 0) {
      const leafX = leafCursor
      leafCursor += 1
      rawCoreXById.set(nodeId, leafX)
      return leafX
    }

    const childPositions = children.map((childId) =>
      assignCoreRawX(childId, nextVisiting),
    )
    const nodeX =
      childPositions.reduce((total, childX) => total + childX, 0) /
      childPositions.length

    rawCoreXById.set(nodeId, nodeX)
    return nodeX
  }

  assignCoreRawX(rootId)

  coreNodes.forEach((node) => {
    if (!rawCoreXById.has(node.id)) {
      assignCoreRawX(node.id)
    }
  })

  const rawCoreXValues = [...rawCoreXById.values()]
  const minRawCoreX = Math.min(...rawCoreXValues)
  const maxRawCoreX = Math.max(...rawCoreXValues)
  const rawCoreSpan = Math.max(maxRawCoreX - minRawCoreX, 1)
  const distinctCoreLeafCount = new Set(rawCoreXValues).size
  const coreLeft = distinctCoreLeafCount > 2 ? 140 : 220
  const coreRight = distinctCoreLeafCount > 2 ? 860 : 780
  const positions = new Map<string, TreePoint>()

  coreNodes.forEach((node) => {
    const rawX = rawCoreXById.get(node.id) ?? 0
    const depth = depthById.get(node.id) ?? 0
    const x =
      minRawCoreX === maxRawCoreX
        ? TREE_WIDTH / 2
        : coreLeft +
          ((rawX - minRawCoreX) / rawCoreSpan) * (coreRight - coreLeft)

    positions.set(node.id, {
      x,
      y: TREE_TOP_PADDING + depth * TREE_LEVEL_GAP,
    })
  })

  const maxCoreDepth = Math.max(
    ...coreNodes.map((node) => depthById.get(node.id) ?? 0),
    0,
  )
  const resolvedModifierDepths = new Map<string, number>()

  function resolveModifierDepth(
    nodeId: string,
    visiting = new Set<string>(),
  ): number {
    const cachedDepth = resolvedModifierDepths.get(nodeId)

    if (cachedDepth !== undefined) {
      return cachedDepth
    }

    if (visiting.has(nodeId)) {
      return maxCoreDepth + 1
    }

    const nextVisiting = new Set(visiting)
    nextVisiting.add(nodeId)
    const parentId = parentById.get(nodeId)
    const parentNode = parentId ? visibleNodeById.get(parentId) : undefined
    const parentDepth =
      parentId && parentNode?.kind === 'modifier'
        ? resolveModifierDepth(parentId, nextVisiting)
        : parentId
          ? depthById.get(parentId) ?? maxCoreDepth
          : maxCoreDepth
    const depth = Math.max(maxCoreDepth + 1, parentDepth + 1)

    resolvedModifierDepths.set(nodeId, depth)
    depthById.set(nodeId, depth)
    return depth
  }

  const modifierNodes = visibleNodes.filter(
    (node) => node.kind === 'modifier',
  )

  modifierNodes.forEach((node) => resolveModifierDepth(node.id))

  const modifiersByDepth = new Map<number, SentenceGrowthNode[]>()

  modifierNodes.forEach((node) => {
    const depth = depthById.get(node.id) ?? maxCoreDepth + 1
    const nodesAtDepth = modifiersByDepth.get(depth) ?? []

    nodesAtDepth.push(node)
    modifiersByDepth.set(depth, nodesAtDepth)
  })

  ;[...modifiersByDepth.entries()]
    .sort(([leftDepth], [rightDepth]) => leftDepth - rightDepth)
    .forEach(([depth, nodesAtDepth]) => {
      const siblingsByParent = new Map<string, SentenceGrowthNode[]>()

      nodesAtDepth.forEach((node) => {
        const parentId = parentById.get(node.id) ?? rootId
        const siblings = siblingsByParent.get(parentId) ?? []

        siblings.push(node)
        siblingsByParent.set(parentId, siblings)
      })

      siblingsByParent.forEach((siblings) => {
        siblings.sort((left, right) => left.id.localeCompare(right.id))
      })

      const desiredPositions = nodesAtDepth
        .map((node) => {
          const parentId = parentById.get(node.id) ?? rootId
          const parentX = positions.get(parentId)?.x ?? TREE_WIDTH / 2
          const siblings = siblingsByParent.get(parentId) ?? [node]
          const siblingIndex = siblings.findIndex(
            (sibling) => sibling.id === node.id,
          )
          const siblingOffset =
            (siblingIndex - (siblings.length - 1) / 2) * 220

          return {
            node,
            desiredX: clamp(parentX + siblingOffset, 100, 900),
          }
        })
        .sort(
          (left, right) =>
            left.desiredX - right.desiredX ||
            left.node.id.localeCompare(right.node.id),
        )
      const resolvedPositions: Array<{
        node: SentenceGrowthNode
        desiredX: number
        x: number
      }> = []

      desiredPositions.forEach((entry) => {
        const previousX = resolvedPositions.at(-1)?.x

        resolvedPositions.push({
          ...entry,
          x:
            previousX === undefined
              ? entry.desiredX
              : Math.max(entry.desiredX, previousX + 180),
        })
      })
      const overflow =
        (resolvedPositions.at(-1)?.x ?? TREE_WIDTH / 2) - 900

      resolvedPositions.forEach((entry) => {
        positions.set(entry.node.id, {
          x: clamp(entry.x - Math.max(overflow, 0), 100, 900),
          y: TREE_TOP_PADDING + depth * TREE_LEVEL_GAP,
        })
      })
    })

  const maxDepth = Math.max(...depthById.values(), 0)
  const treeHeight = Math.max(
    TREE_MIN_HEIGHT,
    TREE_TOP_PADDING + maxDepth * TREE_LEVEL_GAP + 150,
  )

  const layoutNodes = visibleNodes.map((node) => {
    const point = positions.get(node.id) ?? {
      x: TREE_WIDTH / 2,
      y: TREE_TOP_PADDING,
    }

    return { node, ...point }
  })
  const layoutLinks = visibleLinks.filter(
    (link) => positions.has(link.from) && positions.has(link.to),
  )
  const corePoints = layoutNodes.filter(
    ({ node }) => node.kind === 'action' || node.kind === 'core',
  )
  const coreFrame =
    corePoints.length > 1
      ? {
          x: clamp(
            Math.min(...corePoints.map((point) => point.x)) - 110,
            36,
            TREE_WIDTH - 260,
          ),
          y: Math.max(
            28,
            Math.min(...corePoints.map((point) => point.y)) - 70,
          ),
          width: 0,
          height: 0,
        }
      : null

  if (coreFrame) {
    const right = clamp(
      Math.max(...corePoints.map((point) => point.x)) + 110,
      260,
      TREE_WIDTH - 36,
    )
    const bottom = Math.min(
      treeHeight - 24,
      Math.max(...corePoints.map((point) => point.y)) + 80,
    )

    coreFrame.width = right - coreFrame.x
    coreFrame.height = bottom - coreFrame.y
  }

  return {
    activeStep,
    layoutNodes,
    layoutLinks,
    positions,
    treeHeight,
    coreFrame,
  }
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
  if (link.kind === 'modifier') {
    const approachesFromLeft = from.x <= to.x
    const sideDirection = approachesFromLeft ? -1 : 1
    const start = {
      x: from.x,
      y: from.y - 42,
    }
    const end = {
      x: to.x + sideDirection * 66,
      y: to.y + 2,
    }
    const hash = hashText(link.id)
    const wobble = (hash % 17) - 8
    const controlA = {
      x: start.x + sideDirection * (22 + Math.abs(wobble)),
      y: start.y + (end.y - start.y) * 0.34,
    }
    const controlB = {
      x: end.x + sideDirection * (72 + wobble),
      y: start.y + (end.y - start.y) * 0.78,
    }

    return [
      `M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`,
      `C ${controlA.x.toFixed(1)} ${controlA.y.toFixed(1)}`,
      `${controlB.x.toFixed(1)} ${controlB.y.toFixed(1)}`,
      `${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
    ].join(' ')
  }

  const start = getNodeAnchor(from, to)
  const end = getNodeAnchor(to, from)
  const hash = hashText(link.id)
  const wobble = (hash % 19) - 9
  const lift = 14
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
  isRootAction,
}: {
  node: SentenceGrowthNode
  isFocused: boolean
  isRootAction: boolean
}) {
  const fallbackLabel =
    node.kind === 'action'
      ? isRootAction
        ? '动作核心'
        : '嵌套动作'
      : node.kind === 'core'
        ? '核心部分'
        : '补充信息'

  return (
    <>
      <small className="sentence-tree-node-label">
        {node.labelZh || fallbackLabel}
      </small>
      <span
        className={`sentence-tree-node ${node.kind} ${isFocused ? 'focused' : ''}`}
      >
        {node.text}
      </span>
    </>
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
  const {
    activeStep,
    layoutNodes,
    layoutLinks,
    positions,
    treeHeight,
    coreFrame,
  } =
    buildTreeLayout(growth, activeStepIndex)
  const rootActionNode = getRootActionNode(growth)

  if (layoutNodes.length === 0) {
    return null
  }

  return (
    <div className="sentence-tree" aria-label="句子结构树">
      <div
        className="sentence-tree-canvas"
        style={{ minHeight: `${treeHeight}px` }}
      >
        <svg
          aria-hidden="true"
          className="sentence-tree-links"
          viewBox={`0 0 ${TREE_WIDTH} ${treeHeight}`}
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827" />
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

          {coreFrame && (
            <g className="sentence-tree-core-frame" aria-hidden="true">
              <rect
                x={coreFrame.x}
                y={coreFrame.y}
                width={coreFrame.width}
                height={coreFrame.height}
                rx="34"
              />
              <text x={coreFrame.x + 28} y={coreFrame.y + 40}>主干</text>
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
                    `url(#sentence-arrow-${link.kind}-${markerId})`
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
              top: `${(y / treeHeight) * 100}%`,
            }}
          >
            <NodePill
              node={node}
              isFocused={node.id === activeStep?.focusNodeId}
              isRootAction={node.id === rootActionNode?.id}
            />
          </div>
        ))}
      </div>

    </div>
  )
}

function SentenceGrowthPlayer({ path }: SentenceGrowthPlayerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [previewStepIndex, setPreviewStepIndex] = useState<number | null>(null)
  const displayGrowth = useMemo(() => createDisplayGrowth(path), [path])
  const steps: DisplayStep[] = displayGrowth?.steps ?? []
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
  const isPlayButtonPaused = isPlaying && canGoNext

  useEffect(() => {
    if (!isPlaying || !canGoNext) {
      return
    }

    const timer = window.setTimeout(() => {
      const nextStepIndex = Math.min(safeActiveStepIndex + 1, steps.length - 1)

      setActiveStepIndex(nextStepIndex)

      if (nextStepIndex >= steps.length - 1) {
        setIsPlaying(false)
      }
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [canGoNext, isPlaying, safeActiveStepIndex, steps.length])

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
                  aria-label={canGoNext ? (isPlayButtonPaused ? '暂停' : '播放') : '重播'}
                >
                  {isPlayButtonPaused ? 'Ⅱ' : '▶'}
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
