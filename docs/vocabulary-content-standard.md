# Vocabulary content standard v2

English Orbit's public vocabulary content should stay small, stable, and learner-facing. The current schema intentionally avoids storing source/provenance/review workflow fields in the core learning tables.

## Complete word unit

A vocabulary entry is considered usable when it has the learner-facing content below.

| Content | Storage | Requirement |
|---|---|---|
| Word and normalized word | `vocab.word`, `vocab.normalized_word` | Required |
| Chinese core meaning | `vocab.meaning_zh` | Required |
| English short definition | `vocab.definition_en` | Required |
| Frequency rank | `vocab.frequency_rank` | Required |
| US IPA | `vocab.phonetic_us` | Required |
| UK IPA | `vocab.phonetic_uk` | Required |
| Pronunciation audio | `vocab_pronunciations` | At least two rows for current US/UK historical assets |
| Example | `vocab_examples` | At least one English example |
| Scene memory image | `vocab_visuals` | Optional; at most one published image per word |

## Field boundaries

### `vocab`

`vocab` owns the stable, frequently-read summary of a word. `frequency_rank`
drives default ordering and coverage checks, but the public vocabulary API no
longer exposes Top 100 / 500 / 1000 / 3000 learning-band filters.

### `vocab_pronunciations`

The pronunciation table stores only:

- the word relation
- the phonetic text
- the public audio URL

Provider, voice, object key, license, attribution, quality status, and generated metadata belong in batch manifests, generation notes, or scripts.

### `vocab_examples`

Examples should be natural, grammatical, and short enough to learn from. The table stores only the example and optional Chinese explanation. Source and difficulty labels are not part of the business model.

### `vocab_visuals`

Scene images reinforce one concrete meaning instead of trying to illustrate every sense of a word. The story may be unrelated to programming or vocabulary learning, but the target word must remain central to the action, object, or relationship. Each published image should:

- bind to a short, natural example belonging to the same vocabulary entry
- communicate one action or relationship without readable text inside the image
- prefer a constructive micro-story shown through behavior rather than slogans
- keep the word meaning accurate even when the story carries an emotional or moral theme
- use the public R2 URL from `english-orbit/vocabulary/visuals/...`
- include concise Chinese alternative text

Generation prompts, source files, content hashes, and batch metadata belong in the batch manifest rather than D1.

## Positive story themes

Vocabulary visuals may use the following theme library during story planning. These values are authoring guidance only: do not add them to D1, the batch manifest, or the learner-facing UI. They should be expressed naturally through the sentence and a character's action, and should not be forced into every word.

| Category | Suggested themes |
|---|---|
| Integrity | 诚实、真诚、正直、守信、可靠、言行一致、尊重事实、坚持原则、公平、公正、透明、知错能改 |
| Courage and growth | 勇敢、自信、坚韧、毅力、坚持、抗挫、主动、独立、果断、迎接挑战、适应变化、重新开始、勇于求助 |
| Self-discipline | 自律、耐心、专注、勤奋、节制、克制、谨慎、谦逊、从容、自省、反思、守时、有条理、善始善终、劳逸平衡 |
| Positive outlook | 乐观、希望、热情、积极、感恩、知足、自我接纳、情绪稳定、幽默、欣赏美好、相信改善、珍惜当下 |
| Kindness and care | 善良、友善、仁爱、同情心、同理心、体贴、关怀、陪伴、鼓励、安慰、帮助他人、保护弱者、尊重生命、成就他人 |
| Respect and inclusion | 尊重、礼貌、理解、倾听、宽容、包容、尊重差异、尊重隐私、尊重边界、平等对待、接纳多样性、反对歧视、无障碍意识、维护尊严 |
| Cooperation | 合作、团结、互助、分享、信任、忠诚、沟通、协商、谦让、共同承担、分享成果、化解分歧、支持伙伴、兑现承诺 |
| Service | 服务意识、奉献、志愿精神、利他、热心公益、社区参与、照顾老人、关爱儿童、帮助陌生人、分享知识、为他人创造便利 |
| Learning and truth | 好奇、求知、求真、探索、开放思维、独立思考、批判思维、严谨、尊重证据、主动提问、持续学习、复盘总结、接受反馈、学以致用 |
| Wisdom and creativity | 创造力、想象力、解决问题、系统思考、发现规律、灵活应变、善于观察、审慎判断、长远思考、化繁为简、持续改进、合理创新 |
| Responsibility and craft | 负责、担当、敬业、专业、认真、细致、质量意识、用户同理心、主动沟通、诚实报告问题、及时修复错误、审慎发布、工匠精神、保护用户利益 |
| Civic life | 公德、守序、守法、文明礼让、规则意识、公共安全、维护公共资源、社区责任、公平竞争、主持正义、帮助弱者、负责任地表达观点 |
| Nature and life | 珍爱生命、保护动物、敬畏自然、环境保护、节约资源、减少浪费、可持续意识、爱护植物、保持环境整洁、绿色出行、与自然和谐相处 |
| Health and safety | 珍惜健康、自我照顾、规律生活、锻炼、卫生意识、食品安全、交通安全、风险意识、冷静应急、保护自己、保护他人、心理健康、适时休息 |
| Leadership | 以身作则、倾听意见、公平决策、勇于负责、保护团队、授权他人、培养新人、鼓励成长、承担失败、分享成果、保持谦逊、坚持长期价值 |

Use this core set first when a smaller prompt vocabulary is helpful:

`善良、勇敢、诚实、责任、担当、坚持、耐心、自律、乐观、求真、好奇、创造、尊重、同理、包容、公平、合作、分享、守信、服务、感恩、环保、冷静、成长`

The values should be visible in what a character does. Avoid medals, heart icons, motivational slogans, exaggerated victory poses, or moralizing captions. Negative events may appear, but the focal point should be the constructive response.

Articles and other function words should use paired grammar micro-stories rather than literal object illustrations. For example, introduce `a wallet` in one scene and refer to `the wallet` in the continuation, while preserving a recognizable visual detail across both scenes.

## Subject diversity

The collection should feel as broad as the vocabulary itself. Visual consistency comes from art direction, lighting, materials, and composition, not from repeating the same people. Choose the scene's leading subject from the meaning and story:

- people and communities
- animals, birds, insects, marine life, and other living creatures
- plants, trees, flowers, crops, fungi, and ecosystems
- weather, water, landforms, seasons, geology, and astronomy
- food, clothing, tools, furniture, vehicles, buildings, and everyday objects
- machines, infrastructure, scientific equipment, data, and abstract systems

A scene may be entirely human-free when another subject communicates the meaning more clearly. Across a large batch, track subject-domain balance so people do not become the automatic visual answer.

When people are appropriate, vary age, skin tone, facial structure, body type, hairstyle, clothing, ability or mobility, occupation, family structure, and cultural or geographic setting. Diversity should follow naturally from the story, avoid stereotypes, and never reduce a person to a visual token. Do not repeatedly reuse the same face, hairstyle, body silhouette, green-shirt outfit, or small cast of character templates.

## Removed public-content tables

The following tables were removed to keep the first public data model focused:

- `vocabulary_senses`
- `vocabulary_collocations`
- `vocabulary_scenarios`
- `vocabulary_scenario_links`

If we later build true multi-sense learning, verb patterns, or sentence structures, they should be designed as new focused tables rather than restored as broad placeholder tables.

## Quality practice

Quality still matters, but it should happen before data enters the public business tables or be tracked outside the learner-facing schema:

- data manifests
- generation notes
- Git history
- `content_edit_logs`
- explicit proofreading issues/PRs

## Checks

```bash
npm run vocabulary:coverage:top100
npm run pronunciations:coverage:top100
```

Remote checks should be intentional:

```bash
node scripts/check-vocabulary-content-completeness.mjs --remote
node scripts/check-pronunciation-completeness.mjs --remote
```
