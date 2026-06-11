export interface TreeNode {
  id: string
  kind: 'verb' | 'noun' | 'mod'
  step: number
  x: number
  y: number
  w: number
  lines: string[]
}

export interface TreeEdge {
  id: string
  kind: 'param' | 'mod'
  step: number
  from: [number, number]
  to: [number, number]
}

export interface TreeFrame {
  id: string
  variant: 'trunk' | 'clause'
  step: number
  x: number
  y: number
  w: number
  h: number
  label: string
}

export interface TreeSpec {
  viewBox: [number, number]
  frames: TreeFrame[]
  nodes: TreeNode[]
  edges: TreeEdge[]
}

const NODE_LINE_HEIGHT = 22
const NODE_PADDING_Y = 13

interface StrategyTreeProps {
  caseId: string
  spec: TreeSpec
  activeStep: number
}

function nodeHeight(lines: string[]) {
  return lines.length * NODE_LINE_HEIGHT + NODE_PADDING_Y * 2
}

function StrategyTree({ caseId, spec, activeStep }: StrategyTreeProps) {
  const [viewWidth, viewHeight] = spec.viewBox

  return (
    <svg
      className="strategy-tree-svg"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      role="img"
      aria-label="语法树动画"
    >
      <defs>
        <marker
          id={`strategy-arrow-${caseId}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
        </marker>
      </defs>

      {spec.frames.map((frame) => (
        <g
          key={frame.id}
          className={`tree-item tree-frame tree-frame-${frame.variant}${
            frame.step <= activeStep ? ' is-visible' : ''
          }`}
        >
          <rect
            x={frame.x}
            y={frame.y}
            width={frame.w}
            height={frame.h}
            rx="18"
          />
          <text x={frame.x + 20} y={frame.y + 30}>
            {frame.label}
          </text>
        </g>
      ))}

      {spec.edges.map((edge) => (
        <line
          key={edge.id}
          className={`tree-item tree-edge tree-edge-${edge.kind}${
            edge.step <= activeStep ? ' is-visible' : ''
          }`}
          x1={edge.from[0]}
          y1={edge.from[1]}
          x2={edge.to[0]}
          y2={edge.to[1]}
          markerEnd={
            edge.kind === 'mod' ? `url(#strategy-arrow-${caseId})` : undefined
          }
        />
      ))}

      {spec.nodes.map((node) => {
        const height = nodeHeight(node.lines)

        return (
          <g
            key={node.id}
            className={`tree-item tree-node tree-node-${node.kind}${
              node.step <= activeStep ? ' is-visible' : ''
            }`}
          >
            <rect x={node.x} y={node.y} width={node.w} height={height} rx="12" />
            {node.lines.map((line, index) => (
              <text
                key={index}
                x={node.x + node.w / 2}
                y={node.y + NODE_PADDING_Y + 16 + index * NODE_LINE_HEIGHT}
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export default StrategyTree
