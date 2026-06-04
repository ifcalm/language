import { useEffect, useMemo, useState } from 'react'
import type {
  SentenceGrowth,
  SentenceGrowthLink,
  SentenceGrowthNode,
  SentenceGrowthStep,
  VerbPath,
  VerbPathStep,
} from './types'

interface SentenceGrowthPlayerProps {
  path: VerbPath
}

type DisplayStep = Pick<
  SentenceGrowthStep,
  'stepNo' | 'label' | 'sentenceEn' | 'sentenceZh' | 'focusNode' | 'noteZh'
> & {
  focusText?: string
  segments?: VerbPathStep['segments']
}

function isFocusedSegment(text: string, focusText: string) {
  const normalizedText = text.trim().toLowerCase()
  const normalizedFocus = focusText.trim().toLowerCase()

  return Boolean(
    normalizedFocus &&
      (normalizedText.includes(normalizedFocus) ||
        normalizedFocus.includes(normalizedText)),
  )
}

function getVisibleIds(growth: SentenceGrowth, activeStepIndex: number) {
  const visibleNodeIds = new Set<string>()
  const visibleLinkIds = new Set<string>()

  for (const step of growth.steps.slice(0, activeStepIndex + 1)) {
    step.showNodes.forEach((nodeId) => visibleNodeIds.add(nodeId))
    step.showLinks.forEach((linkId) => visibleLinkIds.add(linkId))
  }

  return { visibleNodeIds, visibleLinkIds }
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

function getNodeKindLabel(kind: SentenceGrowthNode['kind']) {
  const labels: Record<SentenceGrowthNode['kind'], string> = {
    action: '动作核心',
    core: '主干',
    modifier: '补充',
  }

  return labels[kind]
}

function getNodeKindHint(kind: SentenceGrowthNode['kind']) {
  const hints: Record<SentenceGrowthNode['kind'], string> = {
    action: '先看句子正在发生什么。',
    core: '这是动作旁边最稳定的词块。',
    modifier: '它让句子更具体、更完整。',
  }

  return hints[kind]
}

function getLinkText(link: SentenceGrowthLink, nodeById: Map<string, SentenceGrowthNode>) {
  const from = nodeById.get(link.from)?.text
  const to = nodeById.get(link.to)?.text

  if (!from || !to) {
    return ''
  }

  return `${from} → ${to}`
}

function SentenceTree({
  growth,
  activeStepIndex,
}: {
  growth: SentenceGrowth
  activeStepIndex: number
}) {
  const activeStep = growth.steps[activeStepIndex]
  const { visibleNodeIds, visibleLinkIds } = getVisibleIds(growth, activeStepIndex)
  const visibleNodes = growth.nodes.filter((node) => visibleNodeIds.has(node.id))
  const visibleLinks = growth.links.filter((link) => visibleLinkIds.has(link.id))
  const actionNode = visibleNodes.find((node) => node.kind === 'action')

  if (!actionNode) {
    return null
  }

  const nodeById = new Map(growth.nodes.map((node) => [node.id, node]))
  const coreLinks = visibleLinks.filter(
    (link) => link.kind === 'core' && link.from === actionNode.id,
  )
  const coreNodes = coreLinks
    .map((link) => nodeById.get(link.to))
    .filter((node): node is SentenceGrowthNode => Boolean(node))
  const leftCoreNodes = coreNodes.slice(0, 1)
  const rightCoreNodes = coreNodes.slice(1)
  const actionModifierLinks = visibleLinks.filter(
    (link) => link.kind === 'modifier' && link.to === actionNode.id,
  )
  const focusNode = activeStep?.focusNode
    ? nodeById.get(activeStep.focusNode)
    : undefined
  const activeLink =
    focusNode?.kind === 'modifier'
      ? visibleLinks.find((link) => link.from === focusNode.id)
      : undefined

  function getModifierLinksForTarget(targetId: string) {
    return visibleLinks.filter(
      (link) => link.kind === 'modifier' && link.to === targetId,
    )
  }

  function renderModifier(link: SentenceGrowthLink, direction: 'down' | 'up') {
    const node = nodeById.get(link.from)

    if (!node) {
      return null
    }

    return (
      <div
        key={link.id}
        className={`sentence-tree-modifier ${direction} ${
          node.id === activeStep?.focusNode ? 'focused' : ''
        }`}
      >
        <NodePill node={node} isFocused={node.id === activeStep?.focusNode} />
        {link.label && <small>{link.label}</small>}
      </div>
    )
  }

  return (
    <div className="sentence-tree" aria-label="句子结构树">
      <div className="sentence-tree-title">
        <span>句子树</span>
        {activeLink && (
          <strong>
            {nodeById.get(activeLink.from)?.text} → {nodeById.get(activeLink.to)?.text}
          </strong>
        )}
      </div>

      <div className="sentence-tree-action-modifiers">
        {actionModifierLinks.length > 0 ? (
          actionModifierLinks.map((link) => renderModifier(link, 'down'))
        ) : (
          <span className="sentence-tree-spacer" aria-hidden="true" />
        )}
      </div>

      <div className="sentence-tree-core-row">
        <div className="sentence-tree-core-side left">
          {leftCoreNodes.map((node) => (
            <NodePill
              key={node.id}
              node={node}
              isFocused={node.id === activeStep?.focusNode}
            />
          ))}
        </div>

        <NodePill
          node={actionNode}
          isFocused={actionNode.id === activeStep?.focusNode}
        />

        <div className="sentence-tree-core-side right">
          {rightCoreNodes.map((node) => (
            <NodePill
              key={node.id}
              node={node}
              isFocused={node.id === activeStep?.focusNode}
            />
          ))}
        </div>
      </div>

      <div className="sentence-tree-core-modifiers">
        {[...leftCoreNodes, ...rightCoreNodes].map((node) => {
          const modifierLinks = getModifierLinksForTarget(node.id)

          if (modifierLinks.length === 0) {
            return <span key={node.id} className="sentence-tree-spacer" />
          }

          return (
            <div key={node.id} className="sentence-tree-core-branch">
              <span>{node.text}</span>
              {modifierLinks.map((link) => renderModifier(link, 'up'))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SentenceNodeInspector({
  growth,
  activeStep,
}: {
  growth: SentenceGrowth | null
  activeStep: DisplayStep
}) {
  if (!growth) {
    return (
      <aside className="sentence-node-inspector" aria-label="当前步骤说明">
        <h3>当前步骤</h3>
        <p className="sentence-inspector-muted">正在使用线性句子步骤。</p>
        <div className="sentence-inspector-card">
          <span>当前句子</span>
          <strong>{activeStep.sentenceEn}</strong>
        </div>
      </aside>
    )
  }

  const nodeById = new Map(growth.nodes.map((node) => [node.id, node]))
  const focusNode = activeStep.focusNode
    ? nodeById.get(activeStep.focusNode)
    : undefined
  const relation = focusNode?.kind === 'modifier'
    ? growth.links.find((link) => link.from === focusNode.id)
    : undefined
  const relationText = relation ? getLinkText(relation, nodeById) : ''

  return (
    <aside className="sentence-node-inspector" aria-label="当前节点信息">
      <h3>当前节点</h3>
      <p className="sentence-inspector-muted">当前选中</p>

      {focusNode ? (
        <>
          <div className={`sentence-inspector-selected ${focusNode.kind}`}>
            <span aria-hidden="true" />
            <strong>{focusNode.text}</strong>
            <em>{getNodeKindLabel(focusNode.kind)}</em>
          </div>

          <div className="sentence-inspector-block">
            <span>它在说明</span>
            {relationText ? (
              <strong className="sentence-inspector-relation">
                {relationText}
              </strong>
            ) : (
              <strong>{getNodeKindHint(focusNode.kind)}</strong>
            )}
          </div>

          <div className="sentence-inspector-block">
            <span>说明</span>
            <p>{relation?.label || activeStep.noteZh || getNodeKindHint(focusNode.kind)}</p>
          </div>
        </>
      ) : (
        <p className="sentence-inspector-muted">当前步骤没有选中节点。</p>
      )}

      <div className="sentence-inspector-card">
        <span>当前句子</span>
        <strong>{activeStep.sentenceEn}</strong>
      </div>
    </aside>
  )
}

function renderLegacySentence(step: DisplayStep, pathId: string) {
  if (!step.segments || step.segments.length === 0) {
    return step.sentenceEn
  }

  return step.segments.map((segment, index) => (
    <span
      key={`${pathId}-${step.stepNo}-${segment.text}-${index}`}
      className={`sentence-segment ${segment.kind} ${
        isFocusedSegment(segment.text, step.focusText ?? '') ? 'focused' : ''
      }`}
    >
      {segment.text}
    </span>
  ))
}

function SentenceGrowthPlayer({ path }: SentenceGrowthPlayerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const growth = path.growth
  const steps: DisplayStep[] = growth?.steps ?? path.steps.map((step) => ({
    ...step,
    focusNode: '',
  }))
  const activeStep = steps[activeStepIndex]
  const canGoPrevious = activeStepIndex > 0
  const canGoNext = activeStepIndex < steps.length - 1

  const progress = useMemo(() => {
    if (steps.length <= 1) {
      return 100
    }

    return Math.round((activeStepIndex / (steps.length - 1)) * 100)
  }, [activeStepIndex, steps.length])

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
      <div className="sentence-player-board">
        <div className="sentence-player-stage">
          <p className="sentence-player-label">{activeStep.label}</p>

          {growth && (
            <SentenceTree growth={growth} activeStepIndex={activeStepIndex} />
          )}

          <div className="sentence-player-code">
            <span>// 当前句子</span>
            <p
              key={`${path.id}-${activeStep.stepNo}`}
              className="sentence-player-sentence"
            >
              {growth ? activeStep.sentenceEn : renderLegacySentence(activeStep, path.id)}
            </p>

            {path.coreSentenceEn && (
              <>
                <span>// 核心短句</span>
                <p className="sentence-player-core-sentence">
                  {path.coreSentenceEn}
                </p>
              </>
            )}
          </div>

          {activeStep.sentenceZh && (
            <p className="sentence-player-translation">{activeStep.sentenceZh}</p>
          )}

          {activeStep.noteZh && (
            <p className="sentence-player-note">{activeStep.noteZh}</p>
          )}
        </div>

        <SentenceNodeInspector growth={growth} activeStep={activeStep} />
      </div>

      <div className="sentence-player-timeline">
        <ol className="sentence-player-steps" aria-label="句子生长步骤">
          {steps.map((step, index) => (
            <li key={`${path.id}-${step.stepNo}`}>
              <button
                type="button"
                className={index === activeStepIndex ? 'active' : ''}
                onClick={() => {
                  setActiveStepIndex(index)
                  setIsPlaying(false)
                }}
              >
                <span>{String(step.stepNo)}</span>
                <strong>{step.label}</strong>
              </button>
            </li>
          ))}
        </ol>

        <div className="sentence-player-control-bar">
          <button
            type="button"
            className="sentence-player-play"
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
            {canGoNext ? (isPlaying ? 'Ⅱ' : '▶') : '↻'}
          </button>

          <strong>{activeStepIndex + 1} / {steps.length}</strong>

          <div className="sentence-player-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() => setActiveStepIndex((current) => Math.max(0, current - 1))}
          >
            上一步
          </button>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() =>
              setActiveStepIndex((current) => Math.min(steps.length - 1, current + 1))
            }
          >
            下一步
          </button>
        </div>
      </div>
    </section>
  )
}

export default SentenceGrowthPlayer
