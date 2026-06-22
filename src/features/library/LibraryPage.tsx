import { useMemo, useState } from 'react'
import {
  difficultyLabels,
  formatLabels,
  resources,
  skillLabels,
  type Difficulty,
  type LearningResource,
  type Skill,
} from '../../data/resources'

function LibraryPage() {
  const [resourceSkill, setResourceSkill] = useState<Skill | 'all'>('all')
  const [resourceLevel, setResourceLevel] = useState<Difficulty | 'all'>('all')
  const [query, setQuery] = useState('')

  const filteredResources = useMemo(
    () =>
      resources.filter((resource) => {
        const matchesSkill = resourceSkill === 'all' || resource.skill === resourceSkill
        const matchesLevel =
          resourceLevel === 'all' || resource.difficulty === resourceLevel
        const normalizedQuery = query.trim().toLowerCase()
        const matchesQuery =
          normalizedQuery.length === 0 ||
          resource.title.toLowerCase().includes(normalizedQuery) ||
          resource.summary.toLowerCase().includes(normalizedQuery) ||
          resource.tags.some((tag) => tag.includes(normalizedQuery))

        return matchesSkill && matchesLevel && matchesQuery
      }),
    [query, resourceLevel, resourceSkill],
  )

  return (
    <>
      <section className="panel library-toolbar">
        <div className="section-heading">
          <h2>资源库</h2>
          <span>作为参考资料，不作为任务清单</span>
        </div>
        <div className="filters">
          <input
            placeholder="搜索资源、标签或用途"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            value={resourceSkill}
            onChange={(event) =>
              setResourceSkill(event.target.value as Skill | 'all')
            }
          >
            <option value="all">全部技能</option>
            {Object.entries(skillLabels).map(([skill, label]) => (
              <option key={skill} value={skill}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={resourceLevel}
            onChange={(event) =>
              setResourceLevel(event.target.value as Difficulty | 'all')
            }
          >
            <option value="all">全部难度</option>
            {Object.entries(difficultyLabels).map(([level, label]) => (
              <option key={level} value={level}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="resource-grid">
        {filteredResources.map((resource: LearningResource) => (
          <article key={resource.id} className="panel resource-card">
            <div className="resource-meta">
              <span>{skillLabels[resource.skill]}</span>
              <span>{difficultyLabels[resource.difficulty]}</span>
              <span>{formatLabels[resource.format]}</span>
            </div>
            <h3>{resource.title}</h3>
            <p>{resource.summary}</p>
            <footer>
              <small>{resource.minutes} 分钟</small>
              <a href={resource.url} target="_blank" rel="noreferrer">
                打开资源
              </a>
            </footer>
          </article>
        ))}
      </section>
    </>
  )
}

export default LibraryPage
