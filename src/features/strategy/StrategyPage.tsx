import type { ViewId } from '../../app/routing'
import StrategySentenceTrees from './StrategySentenceTrees'
import './strategy.css'

interface StrategyPageProps {
  onChangeView: (view: ViewId) => void
}

function StrategyPage({ onChangeView }: StrategyPageProps) {
  return (
    <article className="strategy-page">
      <div className="strategy-document-body">
        <section className="strategy-section strategy-examples-section">
          <div className="strategy-section-heading">
            <span>01</span>
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
            <span>02</span>
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
