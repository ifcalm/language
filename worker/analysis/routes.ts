import { makeErrorResponse, makeJsonResponse } from '../shared/http'

interface SentenceAnalysisEnv extends Env {
  DEEPSEEK_API_KEY?: string
}

const SENTENCE_ANALYSIS_SYSTEM = `你是面向中文开发者的英语句子分析助手。用户在学习编程相关英语。给定一个英文句子和要重点学习的词,用简洁准确的中文帮开发者把这个词放回语境理解。
只输出合法 JSON(不要 markdown、不要代码块),字段如下:
- backbone: { "en": 句子主干(去掉修饰后的核心主谓宾), "zh": 主干的中文 }
- structure: 字符串,1-2 句中文,讲这句里真实出现、且对理解有帮助的结构/语法点(时态、从句、非谓语、被动等)
- usage: 字符串,1-2 句中文,讲这句为什么这么表达 / 地道点 / 搭配,聚焦重点词
- keywords: 数组,2-4 个 { "text": 词或词块, "note": 该词在本句中的中文释义或作用 }
要求:口语化、面向开发者;不要套话、不要逐词翻译、不要超出本句范围。`

export async function handleSentenceAnalyze(
  request: Request,
  env: SentenceAnalysisEnv,
) {
  const apiKey = env.DEEPSEEK_API_KEY

  if (!apiKey) {
    return makeErrorResponse('AI 分析暂未配置（缺少 DEEPSEEK_API_KEY）', 503)
  }

  let body: { sentence?: unknown; word?: unknown; translation?: unknown }

  try {
    body = (await request.json()) as typeof body
  } catch {
    return makeErrorResponse('Invalid JSON payload')
  }

  const sentence = typeof body.sentence === 'string' ? body.sentence.trim() : ''
  const word = typeof body.word === 'string' ? body.word.trim() : ''
  const translation =
    typeof body.translation === 'string' ? body.translation.trim() : ''

  if (!sentence) {
    return makeErrorResponse('Missing sentence')
  }

  if (sentence.length > 400) {
    return makeErrorResponse('Sentence too long')
  }

  const userPrompt = `句子：${sentence}\n重点词：${word || '（无）'}\n参考中文：${
    translation || '（无）'
  }`

  let aiResponse: Response

  try {
    aiResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        messages: [
          { role: 'system', content: SENTENCE_ANALYSIS_SYSTEM },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        stream: false,
      }),
    })
  } catch {
    return makeErrorResponse('AI 服务暂时不可用，请稍后再试', 502)
  }

  if (!aiResponse.ok) {
    const detail = await aiResponse.text().catch(() => '')
    return makeJsonResponse(
      { error: 'AI 分析失败', status: aiResponse.status, detail: detail.slice(0, 200) },
      { status: 502 },
    )
  }

  let completion: {
    choices?: Array<{ message?: { content?: unknown } }>
  }

  try {
    completion = (await aiResponse.json()) as typeof completion
  } catch {
    return makeErrorResponse('AI 返回解析失败', 502)
  }

  const content = completion.choices?.[0]?.message?.content

  if (typeof content !== 'string') {
    return makeErrorResponse('AI 返回为空', 502)
  }

  let analysis: unknown

  try {
    analysis = JSON.parse(content)
  } catch {
    return makeErrorResponse('AI 返回不是合法 JSON', 502)
  }

  return makeJsonResponse({ analysis })
}
