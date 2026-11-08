import { useEffect, useState } from 'react'
import { loadIeltsExamples, type IeltsTopicExamples } from '../../data/ielts'

export function useIeltsExamples(topicId: string) {
  const [state, setState] = useState<{
    topicId: string | null
    data: IeltsTopicExamples | null
    error: string
  }>({ topicId: null, data: null, error: '' })

  useEffect(() => {
    let cancelled = false

    loadIeltsExamples(topicId).then(
      (data) => !cancelled && setState({ topicId, data, error: '' }),
      () =>
        !cancelled &&
        setState({ topicId, data: null, error: '例句加载失败，请检查网络后刷新重试。' }),
    )

    return () => {
      cancelled = true
    }
  }, [topicId])

  return state.topicId === topicId ? state : { topicId, data: null, error: '' }
}
