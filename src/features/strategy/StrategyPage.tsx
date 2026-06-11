import type { ViewId } from '../../app/routing'
import './strategy.css'

interface CaseStepPart {
  text: string
  added?: boolean
}

interface CaseStep {
  label: string
  parts: CaseStepPart[]
}

interface StrategyCase {
  id: string
  scene: string
  title: string
  signature: string
  steps: CaseStep[]
  tree: string
  translation: string
  note: string
}

const methodItems = [
  {
    title: '动词是函数',
    code: 'eat(A: 名词, B: 名词)',
    body:
      '每个动词都带一份"签名":要几个参数、放在什么位置、什么类型。背一万个名词不如吃透两百个动词的签名——名词只是填进参数位的素材。',
  },
  {
    title: '句子是 AST',
    code: 'make(coffee, me, happy)',
    body:
      '一串单词只是序列化的形态,它真正编码的是一棵树:动词是根,参数是子节点,修饰成分是挂在节点上的属性。看不懂长句 = 反序列化失败,不是词汇量不够。',
  },
  {
    title: '写句子 = 迭代',
    code: 'eat. → I eat apples. → …',
    body:
      '先写出能"编译通过"的最小句子,再一步步加成分,每一步都保持正确——从正确走向正确,语法就永远不会错。',
  },
  {
    title: '读句子 = 先折叠',
    code: 'fold(修饰) → 主干 → unfold()',
    body:
      '别从左到右逐词扫描。先把修饰成分折叠,找到藏在里面的那个短句主干,确认看懂,再逐层展开细节——和读嵌套代码一个姿势。',
  },
]

const strategyCases: StrategyCase[] = [
  {
    id: 'run',
    scene: '日常协作',
    title: 'run —— 双参数动词,修饰逐层叠加',
    signature: 'run(A: 名词, B: 名词)   // A 跑 B',
    steps: [
      {
        label: '主干',
        parts: [{ text: 'Our team runs the tests.', added: true }],
      },
      {
        label: '加范围',
        parts: [
          { text: 'Our team runs ' },
          { text: 'all', added: true },
          { text: ' the tests.' },
        ],
      },
      {
        label: '加频率',
        parts: [
          { text: 'Our team ' },
          { text: 'usually', added: true },
          { text: ' runs all the tests.' },
        ],
      },
      {
        label: '加地点',
        parts: [
          { text: 'Our team usually runs all the tests ' },
          { text: 'on a new branch', added: true },
          { text: '.' },
        ],
      },
      {
        label: '加时间',
        parts: [
          { text: 'Our team usually runs all the tests on a new branch ' },
          { text: 'before every release', added: true },
          { text: '.' },
        ],
      },
    ],
    tree: `runs (跑)
├── Our team                 ← 参数A:谁
├── the tests                ← 参数B:跑什么
│   └── all                  ← 修饰参数:范围
├── usually                  ← 修饰动词:频率
├── on a new branch          ← 修饰动词:地点
└── before every release     ← 修饰动词:时间`,
    translation: '我们团队通常在每次发布前,在新分支上跑全部测试。',
    note: '句子再长,骨架始终是 Our team runs the tests。先抓骨架,其余都是配置项。',
  },
  {
    id: 'ask',
    scene: '工作沟通',
    title: 'ask —— 三参数动词,参数里嵌着另一次调用',
    signature: 'ask(A, B, C)   // A 请 B 去做 C,而 C 本身是个动作',
    steps: [
      {
        label: '主干',
        parts: [
          { text: 'The manager asked me to send the report.', added: true },
        ],
      },
      {
        label: '给子调用加参数',
        parts: [
          { text: 'The manager asked me to send the report ' },
          { text: 'to the client', added: true },
          { text: '.' },
        ],
      },
      {
        label: '加时间',
        parts: [
          { text: 'The manager asked me to send the report to the client ' },
          { text: 'before the Friday meeting', added: true },
          { text: '.' },
        ],
      },
    ],
    tree: `asked (请)
├── The manager              ← A:谁发起
├── me                       ← B:请谁
└── to send (子调用)          ← C:做什么——又是一个动词!
    ├── the report           ← send 的参数:发什么
    ├── to the client        ← send 的参数:发给谁
    └── before the Friday meeting  ← 修饰 send:何时`,
    translation: '经理让我在周五的会议前把报告发给客户。',
    note: '传统语法管这叫"不定式作宾语",是噪音——它就是三参数函数,第三个参数恰好也是函数。',
  },
  {
    id: 'show',
    scene: '排障现场',
    title: 'show —— 整个从句作参数,句中有句',
    signature: 'show(A, B)   // A 显示 B,B 可以是"一件事"',
    steps: [
      {
        label: '主干:从句整体是参数 B,先当一个块',
        parts: [
          { text: 'The log shows ' },
          { text: 'that the server stopped working', added: true },
          { text: '.' },
        ],
      },
      {
        label: '展开子句,加时间——它自己又是个小句子',
        parts: [
          { text: 'The log shows that the server stopped working ' },
          { text: 'after we changed the settings', added: true },
          { text: '.' },
        ],
      },
      {
        label: '加细节',
        parts: [
          {
            text: 'The log shows that the server stopped working after we changed the settings ',
          },
          { text: 'last night', added: true },
          { text: '.' },
        ],
      },
    ],
    tree: `shows (显示)
├── The log                        ← A:谁显示
└── that …(从句作参数)             ← B:显示"一件事"
    └── stopped working (子树主干)
        ├── the server             ← 谁停了
        └── after …(又一个小句子)  ← 修饰:何时停的
            └── we changed the settings
                └── last night     ← 修饰:改设置的时间`,
    translation: '日志显示,昨晚我们改完设置之后,服务器就停止工作了。',
    note: '参数类型是"名词接口"——单词、短语、整个从句,只要能当"一件事"用,都能填进参数位。树是递归的,英语长句也是。',
  },
]

interface StrategyPageProps {
  onChangeView: (view: ViewId) => void
}

function StrategyPage({ onChangeView }: StrategyPageProps) {
  return (
    <div className="strategy-page">
      <section className="panel strategy-hero">
        <span className="strategy-eyebrow">Learning Strategy</span>
        <h1>把英语当作你已经会的东西来学</h1>
        <p>
          你每天都在读嵌套的函数调用、折叠没用的代码块、从最小可运行版本开始迭代。
          英语句子是同一套东西:动词是函数,句子是语法树,长句是逐步生成的。
          本站的全部设计都围绕这一个方法。
        </p>
        <p className="strategy-source">
          方法论源自王垠《解谜英语语法》(
          <a
            href="https://www.yinwang.org/blog-cn/2018/11/23/grammar"
            target="_blank"
            rel="noreferrer"
          >
            yinwang.org
          </a>
          ),本页按程序员视角重述并配以工作场景例句。
        </p>
      </section>

      <section className="strategy-methods" aria-label="四条核心方法">
        {methodItems.map((item, index) => (
          <article key={item.title} className="panel strategy-method">
            <span className="strategy-method-no">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2>{item.title}</h2>
            <code>{item.code}</code>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="panel strategy-cases-intro">
        <h2>三个长句,三种结构</h2>
        <p>
          下面的句子全部由高频词组成,场景来自你的工作日常。难度不在单词,
          在结构——而结构只有三种套路:参数堆修饰、参数嵌调用、从句当参数。
        </p>
      </section>

      {strategyCases.map((strategyCase) => (
        <article key={strategyCase.id} className="panel strategy-case">
          <header>
            <span className="strategy-case-scene">{strategyCase.scene}</span>
            <h3>{strategyCase.title}</h3>
            <code className="strategy-case-signature">
              {strategyCase.signature}
            </code>
          </header>

          <ol className="strategy-steps">
            {strategyCase.steps.map((step, index) => (
              <li key={step.label}>
                <span className="strategy-step-no">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="strategy-step-label">{step.label}</span>
                  <p className="strategy-step-sentence">
                    {step.parts.map((part, partIndex) => (
                      <span
                        key={partIndex}
                        className={part.added ? 'is-added' : ''}
                      >
                        {part.text}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="strategy-case-result">
            <span>中文</span>
            <p>{strategyCase.translation}</p>
          </div>

          <pre className="strategy-tree" aria-label="语法树">
            {strategyCase.tree}
          </pre>

          <p className="strategy-case-note">{strategyCase.note}</p>
        </article>
      ))}

      <section className="panel strategy-practice">
        <h2>配套练习只有两个</h2>
        <ol>
          <li>
            <strong>练造句</strong>
            :每学一个动词,先看例句,再用它的签名造出几个自己的句子——动词模块的"句子生长"就是为这一步做的。
          </li>
          <li>
            <strong>拆长句</strong>
            :遇到看不懂的句子,抄下来,删掉修饰成分找出主干,再逐层放回去。素材用真实英文(技术文档、英文书),不要用语法教材里人造的句子。
          </li>
        </ol>
        <div className="strategy-practice-actions">
          <button type="button" onClick={() => onChangeView('verbs')}>
            去动词模块练造句
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => onChangeView('vocabulary')}
          >
            去词汇模块攒参数
          </button>
        </div>
      </section>
    </div>
  )
}

export default StrategyPage
