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

## Visual style

Vocabulary scenes must look deliberately illustrated and must not create a live-action or realistic-human impression. Preferred style families include:

- stylized 3D animation
- editorial 3D illustration
- gouache or painterly storybook illustration
- paper-cut or mixed-media collage
- hand-drawn animation
- graphic novel or comic illustration
- watercolor with expressive linework
- linocut or woodcut-inspired illustration
- screen-print or Risograph-inspired illustration
- textile, felt, or embroidery-inspired illustration
- stop-motion-inspired handcrafted illustration

Choose one coherent style family within each image, but deliberately vary style families across the vocabulary collection. Style selection must follow the word's meaning, scene structure, and emotional tone rather than random rotation or a single default style.

### Style routing

| Scene or learning need | Preferred style families |
|---|---|
| Everyday life, relationships, and warm narrative | Gouache, painterly storybook, watercolor linework |
| Articles, prepositions, spatial relationships, and simple abstract structure | Paper-cut, mixed-media collage, editorial 3D |
| Actions, emotions, transformation, and movement | Hand-drawn animation, stylized 3D animation |
| Pronouns, reference, sequence, cause, and contrast | Graphic novel, comic sequence, paper collage |
| Nature, seasons, quiet observation, and subtle feeling | Watercolor, gouache, textile or felt illustration |
| Technology, systems, data, and modern abstract concepts | Risograph, screen print, editorial 3D, graphic illustration |
| Courage, responsibility, labor, and visually forceful themes | Linocut, woodcut-inspired illustration, graphic novel |
| Craft, care, tradition, and tactile domestic scenes | Embroidery, textile, felt, stop-motion-inspired illustration |

For a batch of 20 or more images, aim to use at least four style families and avoid letting one family become the automatic answer for most words. Adjacent words should not repeat an almost identical composition, palette, material treatment, or character design merely because they share a style family.

Shared product constraints remain stable across styles: landscape 3:2 framing, mature learner-facing art direction, a clear focal action or relationship, no in-image teaching text, no logos or watermarks, and no live-action or realistic-human impression. People should use clearly designed shapes, simplified expressive faces, stylized proportions, and illustrated materials. Avoid realistic skin pores, photographic facial rendering, camera-real depth of field, live-action staging, stock-photo composition, and lighting that makes the scene easy to mistake for a photograph.

When people appear, every foreground or midground face that is large enough to
read must have clear, natural eyes, a nose, a mouth, and an expression appropriate
to the scene. Do not use blank oval faces, featureless masks, mannequin heads, or
heavy shadow that erases the facial features. A turned-away or genuinely tiny
background figure may leave the face unseen, but a visible face must never look
unfinished. Treat a missing-feature face as a generation failure and regenerate
the image before publishing it.

The style may feel mature and emotionally grounded without becoming photorealistic. Avoid both extremes: realistic human rendering on one side, and childish chibi or glossy toy characters on the other.

## Batch generation workflow

Use the resumable pipeline for routine production. It keeps planning, generation,
verification and publishing in one persistent batch state, so a network or model
failure does not discard completed work.

### Automated production mode

The default automated batch is 50 unfinished words. A preview is free and does
not call OpenAI, R2 or D1:

```sh
npm run vocabulary:visuals:pipeline -- --limit 50
```

Planning alone creates and validates the content manifest without generating
images:

```sh
npm run vocabulary:visuals:pipeline -- --limit 50 --plan
```

Generate all missing images, run exhaustive deterministic checks, build a contact
sheet and run sampled semantic QA:

```sh
npm run vocabulary:visuals:pipeline -- --limit 50 --generate
```

After reviewing a new pipeline or prompt configuration, run the complete path,
including concurrent R2 upload and one idempotent D1 import:

```sh
npm run vocabulary:visuals:pipeline -- --limit 50 --publish
```

Once a 50-word production batch has confirmed the current models and prompt rules,
finish the remaining queue unattended while retaining the same 50-word recovery
boundaries:

```sh
npm run vocabulary:visuals:pipeline -- --all --publish
```

The supervisor starts the next batch only after the previous R2/D1 publication
and fixture record succeed. It stops on the first failed generation, QA or
publication step. Running the same command again resumes that failed batch and
then continues through the queue. Individual batches are capped at 100 words;
use `--all` instead of creating one fragile multi-thousand-image batch.

Each command resumes the same stable `.vocabulary-visual-pipeline/rank-X-Y/`
state. Existing plans and valid images are reused. When generation or sampled QA
fails for individual items, regenerate only those items:

```sh
npm run vocabulary:visuals:pipeline -- --limit 50 --generate --retry-failed
```

`OPENAI_API_KEY` is required for planning and generation. Publishing also requires
`CLOUDFLARE_API_TOKEN`. Both may be placed in `.env.local`. The pipeline never
publishes implicitly: production writes require the explicit `--publish` flag.

The main throughput controls are:

| Setting | Default | Purpose |
|---|---:|---|
| `--planner-chunk-size` | 10 | Words returned by one structured planning request |
| `--planner-concurrency` | 2 | Concurrent planning requests |
| `--image-concurrency` | 8 | Concurrent image requests |
| `--qa-concurrency` | 3 | Concurrent sampled visual reviews |
| `VOCABULARY_VISUAL_R2_CONCURRENCY` | 8 | Concurrent R2 object uploads |

Use `--skip-ai-qa` only for an explicitly accepted deterministic-only run. A
sampled semantic failure blocks publishing and should be regenerated before the
batch continues.

### Manual fast mode

Use this 20-word workflow when manually piloting a new style, prompt framework or
content category:

1. Keep the pilot batch at 20 words so generation failures and content revisions
   stay easy to isolate.
2. Read the batch from the checked-in local vocabulary queue, then draft all
   examples, scenes, alternative text, and style routing in one manifest pass.
   Do not query D1 again while planning, generating, or reviewing the batch.
3. Run full local manifest checks before image generation: item count, vocabulary
   ID, word, Chinese meaning, queue membership, unique IDs, required fields, and
   an exact target-word token in every English example.
4. Generate with five concurrent image requests, completing 20 images in four
   waves. Retry only failed requests and save successful outputs immediately.
   Do not pause to present or discuss each image during a routine batch.
5. Build one labeled contact sheet after all images finish. Review the complete
   sheet at overview size, then inspect five images in detail: three selected by
   semantic risk and two selected at random.
   Any blank or featureless readable human face fails the overview review and must
   be regenerated even when that image was not selected for detailed sampling.
6. Treat exact quantities, pronoun reference, comparison, sequence, cause and
   effect, spatial boundaries, and before/after transformations as high-risk visual
   relationships. Prefer these items when selecting the three risk samples.
7. Prepare WebP assets, hashes, the published manifest, and D1 SQL in one command;
   upload R2 objects concurrently and submit D1 SQL as one idempotent batch.

### Local vocabulary queue

The queue is a small source-data snapshot, not a copy of generated image content.
It stores each vocabulary ID, word, Chinese meaning, frequency rank, and stable
one-based list position. Refresh it only when the production vocabulary source or
ordering changes:

```sh
npm run vocabulary:visuals:queue:sync
```

That command reads the complete production vocabulary list with one remote D1
query. Routine batches then read only the local snapshot:

```sh
npm run vocabulary:visuals:queue:batch -- --start 121 --limit 20
```

The reader scans existing batch manifests and skips vocabulary IDs that already
have visual content, including non-contiguous pilot words. `--limit 20` therefore
means 20 unfinished words; the ending queue position may extend beyond
`start + 19`. Pass `--include-completed` only when inspecting the raw queue range.

The publishing script validates every manifest item against this queue. Pass
`--verify-remote` for a dry-run production check; `--publish` performs the same
single read automatically before any upload or D1 write. Both checks validate the
whole current batch in one SQL query rather than querying each word separately.

### Verification policy

Keep inexpensive automated verification exhaustive:

- all source files have the expected count, dimensions, format, and manifest entry
- every manifest item matches the local queue's vocabulary ID, word, and meaning
- immediately before publishing, every current-batch item matches production D1
  in one read query
- every published object key is present in the exact R2 inventory with no extras
- D1 reports the expected number of changes and preserves valid example/visual references

Use sampling for repeated visual and network checks:

- visually inspect three high-risk images and two random images in detail
- read back the first, middle, and last vocabulary detail API responses
- issue public URL checks for two images plus the published manifest

Any sampled failure upgrades the relevant check to the full batch. A semantic
failure also triggers review of other items with the same relationship type.

### Strict mode

Use full per-image visual review and full production API/URL readback when any of
the following applies:

- image model, provider, prompt framework, or major style rules changed
- schema, publishing script, object-key convention, or API response shape changed
- the previous batch produced a semantic, upload, or data-integrity failure
- the batch is a pilot for a new content category
- a full audit is explicitly requested

The standing principle is: keep deterministic checks exhaustive, sample expensive
human and network checks, and escalate automatically when a sample fails.

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
