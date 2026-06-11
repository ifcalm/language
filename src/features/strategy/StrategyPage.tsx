import type { ViewId } from '../../app/routing'
import StrategySentenceTrees from './StrategySentenceTrees'
import './strategy.css'

interface StrategyPageProps {
  onChangeView: (view: ViewId) => void
}

const sections = [
  {
    no: '01',
    title: '句子才是学习单位',
    body:
      '单词是材料，句子才真正描述一件事。学习英语的目标不是收集更多孤立单词，而是能从一串词中还原出它正在表达的事件。',
  },
  {
    no: '02',
    title: '先找到动作',
    body:
      '阅读一句话时，先找到它的动词。动词告诉我们正在发生什么，也是进入句子结构最稳定的入口。',
  },
  {
    no: '03',
    title: '确认最小主干',
    body:
      '先保留一句能够独立表达事件的短句。它像最小可运行版本：信息不多，但结构完整，后面的细节都建立在它之上。',
  },
  {
    no: '04',
    title: '看动词带出什么',
    body:
      '不同动词会自然带出不同的信息：谁发起动作、动作涉及谁、需要完成什么。先看这些关系，不必记忆复杂的语法术语。',
  },
  {
    no: '05',
    title: '一次只增加一个细节',
    body:
      '不要直接面对整句。每一步只补充一种信息，例如频率、位置、时间或目的，并确保主干始终清楚。',
  },
  {
    no: '06',
    title: '阅读时先折叠修饰',
    body:
      '造句是从主干向外生长，阅读长句则反向执行。先暂时折叠场景和时间，看懂主干之后，再把细节逐层放回来。',
  },
]

function StrategyPage({ onChangeView }: StrategyPageProps) {
  return (
    <article className="strategy-page">
      <header className="strategy-document-header">
        <span className="strategy-filename">strategy.md</span>
        <h1>像读代码一样理解英文</h1>
        <p className="strategy-lead">
          先找到动词，确认主干，再逐步展开修饰。
        </p>
        <p className="strategy-source">
          方法参考王垠
          <a
            href="https://www.yinwang.org/blog-cn/2018/11/23/grammar"
            target="_blank"
            rel="noreferrer"
          >
            《解谜英语语法》
          </a>
          ，并按 English Orbit 的学习方式重新整理。
        </p>
      </header>

      <div className="strategy-document-body">
        {sections.map((section) => (
          <section key={section.no} className="strategy-section is-text-only">
            <div className="strategy-section-heading">
              <span>{section.no}</span>
              <h2>{section.title}</h2>
            </div>
            <p>{section.body}</p>
          </section>
        ))}

        <section className="strategy-section strategy-examples-section">
          <div className="strategy-section-heading">
            <span>07</span>
            <h2>用树看清关系</h2>
          </div>
          <p>
            每张图只回答一件事：主干是什么，新增内容属于什么场景，
            它挂在哪一层。曲线表示句子的生长关系，而不是语法术语。
          </p>

          <StrategySentenceTrees />
        </section>

        <section className="strategy-section strategy-loop-section">
          <div className="strategy-section-heading">
            <span>08</span>
            <h2>在真实语境中反复练习</h2>
          </div>
          <p>
            使用技术文档、文章、错误信息和日常表达作为素材。学习不是一次记住，
            而是在不同场景中反复遇见相同的结构，慢慢形成稳定语感。
          </p>

          <div className="strategy-loop" aria-label="学习循环">
            <span>选择动词</span>
            <i>→</i>
            <span>找到主干</span>
            <i>→</i>
            <span>辨认场景</span>
            <i>→</i>
            <span>阅读完整句</span>
            <i>↺</i>
          </div>

          <div className="strategy-actions">
            <button type="button" onClick={() => onChangeView('verbs')}>
              去动词模块练习
            </button>
            <button type="button" onClick={() => onChangeView('vocabulary')}>
              查看词汇
            </button>
          </div>
        </section>
      </div>
    </article>
  )
}

export default StrategyPage
