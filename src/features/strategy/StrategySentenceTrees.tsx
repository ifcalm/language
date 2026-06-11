import type { CSSProperties, ReactNode } from 'react'

type NodeTone = 'action' | 'core' | 'modifier'
type EdgeTone = 'structure' | 'modifier' | 'shared'

interface DiagramNodeProps {
  x: number
  y: number
  width: number
  height?: number
  label: string
  lines: string[]
  tone: NodeTone
}

interface HandArrowProps {
  id: string
  d: string
  tone?: EdgeTone
  label?: string
  labelX?: number
  labelY?: number
  delay?: number
}

interface DiagramCardProps {
  number: string
  title: string
  sentence: string
  children: ReactNode
}

function DiagramDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={`${id}-structure-arrow`}
        viewBox="0 0 10 10"
        refX="8.5"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#16181d" />
      </marker>
      <marker
        id={`${id}-modifier-arrow`}
        viewBox="0 0 10 10"
        refX="8.5"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#258744" />
      </marker>
    </defs>
  )
}

function DiagramNode({
  x,
  y,
  width,
  height = 72,
  label,
  lines,
  tone,
}: DiagramNodeProps) {
  const textStart = y + height / 2 - ((lines.length - 1) * 12) / 2 + 6

  return (
    <g className={`strategy-diagram-node is-${tone}`}>
      <text className="strategy-diagram-node-label" x={x} y={y - 12}>
        {label}
      </text>
      {tone === 'action' ? (
        <ellipse
          cx={x + width / 2}
          cy={y + height / 2}
          rx={width / 2}
          ry={height / 2}
        />
      ) : (
        <rect x={x} y={y} width={width} height={height} rx="12" />
      )}
      <text
        className="strategy-diagram-node-copy"
        x={x + width / 2}
        y={textStart}
      >
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x={x + width / 2} dy={index ? 24 : 0}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

function HandArrow({
  id,
  d,
  tone = 'structure',
  label,
  labelX,
  labelY,
  delay = 0,
}: HandArrowProps) {
  const style = { '--curve-delay': `${delay}ms` } as CSSProperties
  const marker =
    tone === 'modifier'
      ? `url(#${id}-modifier-arrow)`
      : `url(#${id}-structure-arrow)`

  return (
    <g
      className={`strategy-hand-arrow is-${tone}`}
      style={style}
      aria-hidden="true"
    >
      <path
        className="strategy-hand-arrow-echo"
        d={d}
        pathLength={1}
      />
      <path
        className="strategy-hand-arrow-main"
        d={d}
        pathLength={1}
        markerEnd={marker}
      />
      {label && labelX !== undefined && labelY !== undefined && (
        <text className="strategy-hand-arrow-label" x={labelX} y={labelY}>
          {label}
        </text>
      )}
    </g>
  )
}

function TestSuiteTree() {
  const id = 'test-suite'

  return (
    <svg viewBox="0 0 960 700" role="img" aria-labelledby={`${id}-title`}>
      <title id={`${id}-title`}>
        Our team usually runs the full test suite on the release branch before
        each release 的详细树状结构
      </title>
      <DiagramDefs id={id} />

      <HandArrow
        id={id}
        d="M 430 205 C 390 248, 300 255, 260 300"
        delay={60}
      />
      <HandArrow
        id={id}
        d="M 530 205 C 575 245, 670 255, 700 300"
        delay={120}
      />
      <HandArrow
        id={id}
        d="M 188 480 C 190 445, 218 420, 235 372"
        tone="modifier"
        delay={180}
      />
      <HandArrow
        id={id}
        d="M 700 480 C 705 440, 700 420, 700 372"
        tone="modifier"
        delay={240}
      />
      <HandArrow
        id={id}
        d="M 210 110 C 275 100, 330 118, 397 150"
        tone="modifier"
        delay={300}
      />
      <HandArrow
        id={id}
        d="M 755 110 C 670 88, 610 110, 558 150"
        tone="modifier"
        delay={360}
      />
      <HandArrow
        id={id}
        d="M 480 620 C 485 540, 500 370, 500 208"
        tone="modifier"
        delay={420}
      />

      <DiagramNode
        x={400}
        y={135}
        width={160}
        height={74}
        label="动作核心"
        lines={['runs']}
        tone="action"
      />
      <DiagramNode
        x={135}
        y={300}
        width={210}
        label="谁做"
        lines={['team']}
        tone="core"
      />
      <DiagramNode
        x={585}
        y={300}
        width={230}
        label="做什么"
        lines={['test suite']}
        tone="core"
      />
      <DiagramNode
        x={115}
        y={480}
        width={145}
        label="所属"
        lines={['Our']}
        tone="modifier"
      />
      <DiagramNode
        x={635}
        y={480}
        width={130}
        label="范围"
        lines={['full']}
        tone="modifier"
      />
      <DiagramNode
        x={95}
        y={55}
        width={170}
        label="频率"
        lines={['usually']}
        tone="modifier"
      />
      <DiagramNode
        x={680}
        y={45}
        width={235}
        height={80}
        label="位置 / 环境"
        lines={['on the release', 'branch']}
        tone="modifier"
      />
      <DiagramNode
        x={365}
        y={620}
        width={230}
        label="时间"
        lines={['before each release']}
        tone="modifier"
      />
    </svg>
  )
}

function ReportTree() {
  const id = 'report'

  return (
    <svg viewBox="0 0 960 820" role="img" aria-labelledby={`${id}-title`}>
      <title id={`${id}-title`}>
        The project manager asked me to send the report to the client before
        Friday’s meeting 的详细树状结构
      </title>
      <DiagramDefs id={id} />

      <HandArrow
        id={id}
        d="M 420 180 C 360 215, 245 220, 205 275"
        delay={60}
      />
      <HandArrow
        id={id}
        d="M 480 185 C 470 220, 460 235, 460 275"
        delay={120}
      />
      <HandArrow
        id={id}
        d="M 540 180 C 600 215, 690 220, 730 275"
        delay={180}
      />
      <HandArrow
        id={id}
        d="M 680 345 C 600 375, 510 360, 485 340"
        tone="shared"
        label="me 也是 send 的执行者"
        labelX={505}
        labelY={382}
        delay={240}
      />
      <HandArrow
        id={id}
        d="M 700 350 C 675 405, 610 430, 585 485"
        delay={300}
      />
      <HandArrow
        id={id}
        d="M 755 350 C 790 405, 820 430, 815 485"
        delay={360}
      />
      <HandArrow
        id={id}
        d="M 820 675 C 940 620, 940 420, 830 320"
        tone="modifier"
        delay={420}
      />
      <HandArrow
        id={id}
        d="M 125 500 C 145 450, 165 405, 180 347"
        tone="modifier"
        delay={480}
      />

      <DiagramNode
        x={395}
        y={110}
        width={170}
        height={76}
        label="动作核心"
        lines={['asked']}
        tone="action"
      />
      <DiagramNode
        x={80}
        y={275}
        width={245}
        height={76}
        label="谁发起"
        lines={['manager']}
        tone="core"
      />
      <DiagramNode
        x={390}
        y={275}
        width={140}
        height={72}
        label="请谁"
        lines={['me']}
        tone="core"
      />
      <DiagramNode
        x={660}
        y={275}
        width={180}
        height={76}
        label="嵌套动作"
        lines={['send']}
        tone="action"
      />
      <DiagramNode
        x={490}
        y={485}
        width={190}
        label="发送什么"
        lines={['the report']}
        tone="core"
      />
      <DiagramNode
        x={740}
        y={485}
        width={170}
        label="发给谁"
        lines={['the client']}
        tone="core"
      />
      <DiagramNode
        x={45}
        y={500}
        width={160}
        label="领域"
        lines={['project']}
        tone="modifier"
      />
      <DiagramNode
        x={630}
        y={675}
        width={260}
        height={80}
        label="什么时候之前"
        lines={['before Friday’s', 'meeting']}
        tone="modifier"
      />
    </svg>
  )
}

function LogsTree() {
  const id = 'logs'

  return (
    <svg viewBox="0 0 960 900" role="img" aria-labelledby={`${id}-title`}>
      <title id={`${id}-title`}>
        The logs show that the server stopped working after we changed the
        configuration last night 的详细树状结构
      </title>
      <DiagramDefs id={id} />

      <HandArrow
        id={id}
        d="M 415 170 C 355 205, 245 215, 210 265"
        delay={60}
      />
      <HandArrow
        id={id}
        d="M 545 170 C 610 205, 700 215, 730 265"
        delay={120}
      />
      <HandArrow
        id={id}
        d="M 730 340 C 730 385, 730 405, 730 445"
        delay={180}
      />
      <HandArrow
        id={id}
        d="M 470 610 C 535 565, 620 505, 690 335"
        tone="modifier"
        label="整个 changed 事件说明停止时间"
        labelX={360}
        labelY={545}
        delay={240}
      />
      <HandArrow
        id={id}
        d="M 420 665 C 365 700, 275 710, 235 750"
        delay={300}
      />
      <HandArrow
        id={id}
        d="M 540 665 C 590 700, 650 710, 680 750"
        delay={360}
      />
      <HandArrow
        id={id}
        d="M 820 750 C 755 700, 670 655, 565 635"
        tone="modifier"
        delay={420}
      />

      <DiagramNode
        x={395}
        y={95}
        width={170}
        height={76}
        label="动作核心"
        lines={['show']}
        tone="action"
      />
      <DiagramNode
        x={115}
        y={265}
        width={190}
        label="什么显示"
        lines={['the logs']}
        tone="core"
      />
      <DiagramNode
        x={625}
        y={265}
        width={220}
        height={78}
        label="显示的事件"
        lines={['stopped working']}
        tone="action"
      />
      <DiagramNode
        x={640}
        y={445}
        width={180}
        label="谁停止"
        lines={['the server']}
        tone="core"
      />
      <DiagramNode
        x={395}
        y={590}
        width={170}
        height={76}
        label="时间事件"
        lines={['changed']}
        tone="action"
      />
      <DiagramNode
        x={155}
        y={750}
        width={150}
        label="谁改变"
        lines={['we']}
        tone="core"
      />
      <DiagramNode
        x={580}
        y={750}
        width={210}
        label="改变什么"
        lines={['the configuration']}
        tone="core"
      />
      <DiagramNode
        x={790}
        y={735}
        width={145}
        label="时间"
        lines={['last night']}
        tone="modifier"
      />
    </svg>
  )
}

const examples = [
  {
    id: 'test-suite',
    number: '01',
    title: '测试流程',
    sentence:
      'Our team usually runs the full test suite on the release branch before each release.',
    diagram: <TestSuiteTree />,
  },
  {
    id: 'report',
    number: '02',
    title: '任务传递',
    sentence:
      'The project manager asked me to send the report to the client before Friday’s meeting.',
    diagram: <ReportTree />,
  },
  {
    id: 'logs',
    number: '03',
    title: '日志与状态变化',
    sentence:
      'The logs show that the server stopped working after we changed the configuration last night.',
    diagram: <LogsTree />,
  },
]

function DiagramCard({
  number,
  title,
  sentence,
  children,
}: DiagramCardProps) {
  return (
    <article className="strategy-tree-example">
      <header>
        <span>{number}</span>
        <div>
          <h3>{title}</h3>
          <code>{sentence}</code>
        </div>
      </header>
      <div className="strategy-tree-canvas">{children}</div>
    </article>
  )
}

function StrategySentenceTrees() {
  return (
    <>
      <div className="strategy-tree-legend" aria-label="结构图图例">
        <span className="is-action">动作</span>
        <span className="is-core">动作带出的核心部分</span>
        <span className="is-modifier">修饰内容 → 被修饰节点</span>
      </div>
      <div className="strategy-tree-gallery">
        {examples.map((example) => (
          <DiagramCard
            key={example.id}
            number={example.number}
            title={example.title}
            sentence={example.sentence}
          >
            {example.diagram}
          </DiagramCard>
        ))}
      </div>
    </>
  )
}

export default StrategySentenceTrees
