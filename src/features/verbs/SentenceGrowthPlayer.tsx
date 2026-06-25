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
  // Optional content rendered between the static sentence list and the
  // animation card (e.g. the learn/practice switch). Purely a layout slot —
  // the player ignores what's inside it and never depends on it.
  headerSlot?: ReactNode
}

type DisplayStep = Pick<
  SentenceGrowthStep,
  'stepNo' | 'label' | 'sentenceEn' | 'sentenceZh' | 'noteZh'
>

interface TreePoint {
  x: number
  y: number
}

interface SentenceGrowthHighlight {
  text: string
  kind: SentenceGrowthNode['kind']
}

interface SentenceGrowthLine {
  key: string
  stepNo: number
  label: string
  sentenceEn: string
  highlights: SentenceGrowthHighlight[]
}

const TREE_WIDTH = 1000
const TREE_MIN_HEIGHT = 560
const TREE_LEVEL_GAP = 190
const TREE_TOP_PADDING = 92
// Bottom padding = top padding (92) + the card's 36px top inset, so the tree
// keeps equal breathing room from the card edges at every node count instead
// of floating against a fixed-height floor.
const TREE_BOTTOM_PADDING = TREE_TOP_PADDING + 36

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
      highlights: step.addNodeIds
        .map((nodeId) => nodeById.get(nodeId))
        .filter((node): node is SentenceGrowthNode => Boolean(node?.text?.trim()))
        .map((node) => ({ text: node.text, kind: node.kind })),
    }))
}

function getHighlightRanges(
  sentence: string,
  highlights: SentenceGrowthHighlight[],
) {
  const normalizedSentence = sentence.toLowerCase()
  const ranges: Array<{
    start: number
    end: number
    kind: SentenceGrowthHighlight['kind']
  }> = []

  const sorted = [...highlights]
    .map((highlight) => ({ text: highlight.text.trim(), kind: highlight.kind }))
    .filter((highlight) => highlight.text)
    .sort((left, right) => right.text.length - left.text.length)

  for (const { text, kind } of sorted) {
    const normalizedText = text.toLowerCase()
    let start = normalizedSentence.indexOf(normalizedText)

    while (start >= 0) {
      const end = start + normalizedText.length
      const overlaps = ranges.some(
        (range) => start < range.end && end > range.start,
      )

      if (!overlaps) {
        ranges.push({ start, end, kind })
      }

      start = normalizedSentence.indexOf(normalizedText, end)
    }
  }

  return ranges.sort((left, right) => left.start - right.start)
}

function renderHighlightedSentence(
  sentence: string,
  highlights: SentenceGrowthHighlight[],
  keyPrefix: string,
) {
  const ranges = getHighlightRanges(sentence, highlights)

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
      <mark
        key={`${keyPrefix}-highlight-${index}`}
        className={`growth-mark kind-${range.kind}`}
      >
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

// Static overview: the line list shows the full step-by-step sentence as a
// readable reference and is intentionally NOT tied to the player's active step.
// The tree animation is the single moving focus; this stays still so the two
// don't pull the eye in two directions at once.
function SentenceGrowthLines({ lines }: { lines: SentenceGrowthLine[] }) {
  if (lines.length === 0) {
    return null
  }

  return (
    <ol className="sentence-growth-lines" aria-label="句子生长过程">
      {lines.map((line, index) => (
        <li key={line.key}>
          <span className="growth-line-no">{index + 1}</span>
          <p className="growth-line-text">
            {renderHighlightedSentence(
              line.sentenceEn,
              line.highlights,
              line.key,
            )}
          </p>
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

  const childrenByParent = new Map<string, string[]>()
  const primaryLinkByChildId = new Map<string, SentenceGrowthLink>()

  visibleLinks.forEach((link) => {
    const { parentId, childId } = getVisualEndpoints(link)

    if (
      parentById.get(childId) === parentId &&
      !primaryLinkByChildId.has(childId)
    ) {
      primaryLinkByChildId.set(childId, link)
    }
  })

  parentById.forEach((parentId, childId) => {
    const children = childrenByParent.get(parentId) ?? []

    children.push(childId)
    childrenByParent.set(parentId, children)
  })

  function arrangeChildren(childIds: string[]) {
    const modifierBranches: string[] = []
    const actions: string[] = []
    const cores: string[] = []

    childIds.forEach((childId) => {
      const kind = visibleNodeById.get(childId)?.kind
      const primaryLink = primaryLinkByChildId.get(childId)

      if (primaryLink?.kind === 'modifier') {
        modifierBranches.push(childId)
      } else if (kind === 'action') {
        actions.push(childId)
      } else {
        cores.push(childId)
      }
    })

    const modifierSplit = Math.floor(modifierBranches.length / 2)
    const coreSplit = Math.ceil(cores.length / 2)

    return [
      ...modifierBranches.slice(0, modifierSplit),
      ...cores.slice(0, coreSplit),
      ...actions,
      ...cores.slice(coreSplit),
      ...modifierBranches.slice(modifierSplit),
    ]
  }

  childrenByParent.forEach((children, parentId) => {
    childrenByParent.set(parentId, arrangeChildren(children))
  })

  const subtreeWeightById = new Map<string, number>()

  function getNodeWidthWeight(nodeId: string) {
    const node = visibleNodeById.get(nodeId)
    const textLength = node?.text.trim().length ?? 0
    const labelLength = (node?.labelZh?.trim().length ?? 0) * 1.15
    const contentLength = Math.max(textLength, labelLength)

    return Math.min(2.6, Math.max(1, contentLength / 13))
  }

  // Rough pixel half-width of a rendered pill (viewBox units ≈ px). Floored to
  // the node label width so short words with long Chinese labels still get
  // enough separation.
  function getNodeHalfWidth(nodeId: string) {
    const node = visibleNodeById.get(nodeId)
    const text = node?.text.trim() ?? ''
    const charWidth = node?.kind === 'action' ? 13.5 : 10.5
    const pillHalf = (text.length * charWidth + 32) / 2

    return Math.min(175, Math.max(78, pillHalf))
  }

  function getSubtreeWeight(
    nodeId: string,
    visiting = new Set<string>(),
  ): number {
    const cachedWeight = subtreeWeightById.get(nodeId)

    if (cachedWeight !== undefined) {
      return cachedWeight
    }

    if (visiting.has(nodeId)) {
      return 1
    }

    const nextVisiting = new Set(visiting)
    nextVisiting.add(nodeId)
    const children = childrenByParent.get(nodeId) ?? []
    const weight =
      children.length === 0
        ? getNodeWidthWeight(nodeId)
        : Math.max(
            getNodeWidthWeight(nodeId),
            children.reduce(
            (total, childId) =>
              total + getSubtreeWeight(childId, nextVisiting),
            0,
            ),
          )

    subtreeWeightById.set(nodeId, Math.max(weight, 1))
    return Math.max(weight, 1)
  }

  getSubtreeWeight(rootId)

  const positions = new Map<string, TreePoint>()
  let deepestY = TREE_TOP_PADDING

  function layoutSubtree(
    nodeId: string,
    left: number,
    right: number,
    depth: number,
    inheritedYOffset = 0,
  ) {
    const x = (left + right) / 2
    const y = TREE_TOP_PADDING + depth * TREE_LEVEL_GAP + inheritedYOffset

    positions.set(nodeId, { x, y })
    deepestY = Math.max(deepestY, y)

    const children = childrenByParent.get(nodeId) ?? []

    if (children.length === 0) {
      return
    }

    const totalWeight = children.reduce(
      (total, childId) => total + getSubtreeWeight(childId),
      0,
    )
    let cursor = left
    // Greedy multi-row packing: a child that would overlap its left neighbour
    // drops to the next vertical lane instead of crowding the same line. Keeps
    // wide phrases from merging without needing more horizontal room.
    const LANE_STEP = 82
    const NODE_GAP = 18
    const MAX_ROWS = 3
    const rowRightEdge: number[] = []

    children.forEach((childId) => {
      const childWeight = getSubtreeWeight(childId)
      const width = ((right - left) * childWeight) / totalWeight
      const centerX = cursor + width / 2
      const halfWidth = getNodeHalfWidth(childId)
      const leftEdge = centerX - halfWidth

      let row = rowRightEdge.findIndex((edge) => leftEdge >= edge + NODE_GAP)

      if (row === -1) {
        if (rowRightEdge.length < MAX_ROWS) {
          row = rowRightEdge.length
          rowRightEdge.push(-Infinity)
        } else {
          row = rowRightEdge.reduce(
            (best, edge, index, all) => (edge < all[best] ? index : best),
            0,
          )
        }
      }

      rowRightEdge[row] = centerX + halfWidth

      layoutSubtree(
        childId,
        cursor,
        cursor + width,
        depth + 1,
        inheritedYOffset + row * LANE_STEP,
      )
      cursor += width
    })
  }

  layoutSubtree(rootId, 70, TREE_WIDTH - 70, 0)

  const treeHeight = deepestY + TREE_BOTTOM_PADDING

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

  return {
    activeStep,
    layoutNodes,
    layoutLinks,
    positions,
    treeHeight,
  }
}

function makeSketchPath(
  link: SentenceGrowthLink,
  from: TreePoint,
  to: TreePoint,
  exitX?: number,
  entryX?: number,
) {
  if (link.kind === 'modifier') {
    const approachesFromLeft = from.x <= to.x
    const sideDirection = approachesFromLeft ? -1 : 1
    const start = {
      x: from.x,
      y: from.y - 42,
    }
    // End in the clear gap just *below* the target pill rather than at its
    // center. The node pills sit above the SVG (z-index), so an arrowhead aimed
    // at the center gets hidden behind wide pills; coming up into the bottom
    // keeps it visible regardless of pill width.
    const end = {
      x: to.x + sideDirection * 44,
      y: to.y + 60,
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

  // Core link: parent (from) sits above the child (to). Route it as a vertical
  // channel — leave the parent straight down, shift sideways in the empty band
  // between the two rows, then drop straight into the child — so the line stays
  // in the gaps between cards instead of slicing across them. The exit point is
  // fanned toward the child's side so several links from the same parent leave
  // at different x and never stack or cross right below the parent.
  const startX = exitX ?? from.x
  const endX = entryX ?? to.x
  let start: TreePoint
  let end: TreePoint
  let controlA: TreePoint
  let controlB: TreePoint

  if (Math.abs(to.y - from.y) < 70) {
    // Horizontal link between same-row nodes (e.g. a shared actor): arc up into
    // the empty band above the row so it clears the cards sitting on the row
    // instead of passing behind them.
    start = { x: startX, y: from.y - 46 }
    end = { x: endX, y: to.y - 50 }
    const arcY = Math.min(start.y, end.y) - 78
    controlA = { x: startX, y: arcY }
    controlB = { x: endX, y: arcY }
  } else {
    // Vertical exit/entry with a slanted middle third (not a flat horizontal
    // segment), so the link still travels in the gap between rows but reads
    // clearly as one connector instead of a faint floating line.
    start = { x: startX, y: from.y + 44 }
    end = { x: endX, y: to.y - 50 }
    const span = end.y - start.y
    controlA = { x: startX, y: start.y + span * 0.38 }
    controlB = { x: endX, y: start.y + span * 0.62 }
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
  } =
    buildTreeLayout(growth, activeStepIndex)
  // Size the canvas to the fully grown tree so its height stays stable while
  // the animation reveals nodes step by step.
  const treeHeight = buildTreeLayout(
    growth,
    Math.max(growth.steps.length - 1, 0),
  ).treeHeight
  const rootActionNode = getRootActionNode(growth)

  // Spread the exit points of core links that share a parent evenly across the
  // parent's bottom edge (ordered by child x), so sibling links leave at
  // different x and never stack or cross right below the parent.
  const coreExitX = new Map<string, number>()
  const coreLinksByParent = new Map<string, SentenceGrowthLink[]>()
  layoutLinks.forEach((link) => {
    if (link.kind !== 'core') {
      return
    }
    const siblings = coreLinksByParent.get(link.from) ?? []
    siblings.push(link)
    coreLinksByParent.set(link.from, siblings)
  })
  coreLinksByParent.forEach((links, parentId) => {
    const parentX = positions.get(parentId)?.x ?? 0
    const sorted = [...links].sort(
      (a, b) => (positions.get(a.to)?.x ?? 0) - (positions.get(b.to)?.x ?? 0),
    )
    const count = sorted.length
    const spacing = count > 1 ? Math.min(36, 80 / (count - 1)) : 0
    sorted.forEach((link, index) => {
      coreExitX.set(link.id, parentX + (index - (count - 1) / 2) * spacing)
    })
  })

  // Same idea for the arrowhead side: when one node receives several core
  // links, spread the entry points across its top edge (ordered by source x) so
  // the arrowheads don't stack into one indistinguishable blob.
  const coreEntryX = new Map<string, number>()
  const coreLinksByChild = new Map<string, SentenceGrowthLink[]>()
  layoutLinks.forEach((link) => {
    if (link.kind !== 'core') {
      return
    }
    const siblings = coreLinksByChild.get(link.to) ?? []
    siblings.push(link)
    coreLinksByChild.set(link.to, siblings)
  })
  coreLinksByChild.forEach((links, childId) => {
    if (links.length < 2) {
      return
    }
    const childX = positions.get(childId)?.x ?? 0
    const sorted = [...links].sort(
      (a, b) => (positions.get(a.from)?.x ?? 0) - (positions.get(b.from)?.x ?? 0),
    )
    const count = sorted.length
    const spacing = Math.min(34, 76 / (count - 1))
    sorted.forEach((link, index) => {
      coreEntryX.set(link.id, childX + (index - (count - 1) / 2) * spacing)
    })
  })

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
          preserveAspectRatio="none"
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

          {layoutLinks.map((link) => {
            const from = positions.get(link.from)
            const to = positions.get(link.to)

            if (!from || !to) {
              return null
            }

            const pathD = makeSketchPath(
              link,
              from,
              to,
              coreExitX.get(link.id),
              coreEntryX.get(link.id),
            )

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

function SentenceGrowthPlayer({ path, headerSlot }: SentenceGrowthPlayerProps) {
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
            <SentenceGrowthLines lines={sentenceLines} />

            {headerSlot}

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

            <TreeLegend />
          </div>
        </div>
      </div>
    </section>
  )
}

function TreeLegend() {
  const [open, setOpen] = useState(false)

  return (
    <div className={`sentence-tree-legend ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="legend-toggle"
        aria-expanded={open}
        aria-label={open ? '收起图例' : '展开图例说明'}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="legend-toggle-icon" aria-hidden="true">
          i
        </span>
        图例
      </button>

      <div className="legend-content" aria-hidden={!open}>
        <div className="legend-line">
          <div className="legend-group">
            <span className="legend-group-title">卡片</span>
            <span className="legend-chip">
              <i className="legend-swatch action" />
              动作（动词）
            </span>
            <span className="legend-chip">
              <i className="legend-swatch core" />
              主干成分（施动者、对象等）
            </span>
            <span className="legend-chip">
              <i className="legend-swatch modifier" />
              修饰成分（时间、地点、方式等）
            </span>
          </div>
        </div>

        <div className="legend-line">
          <div className="legend-group">
            <span className="legend-group-title">箭头</span>
            <span className="legend-chip">
              <svg className="legend-arrow" viewBox="0 0 30 10" aria-hidden="true">
                <line x1="1" y1="5" x2="21" y2="5" stroke="#111827" strokeWidth="2" />
                <path d="M20 1 L28 5 L20 9 Z" fill="#111827" />
              </svg>
              主干连接（动作 → 主干）
            </span>
            <span className="legend-chip">
              <svg className="legend-arrow" viewBox="0 0 30 10" aria-hidden="true">
                <line x1="1" y1="5" x2="21" y2="5" stroke="#15803d" strokeWidth="2" />
                <path d="M20 1 L28 5 L20 9 Z" fill="#15803d" />
              </svg>
              修饰连接（修饰 → 被修饰对象）
            </span>
          </div>

          <div className="legend-group">
            <span className="legend-group-title">文字</span>
            <span className="legend-chip">
              卡片上方灰字＝该词在句中的作用
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SentenceGrowthPlayer
