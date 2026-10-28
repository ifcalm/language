# IELTS vocabulary static data

雅思词汇是独立于 COCA 词库(D1 `vocab` 表)的模块,数据**直接打包为前端静态资源**,运行时不查询 D1。

与 `src/data/vocabulary/` 方向相反是有意为之:COCA 词库曾需要后台编辑所以迁到 D1;雅思词表固定、不需要后台,静态资源走 CDN 长缓存,访问更快。

## 数据流

```
docs/ielts-vocabulary.md                       唯一数据源:单词、词性、释义、话题(人工编辑)
scripts/fixtures/ielts-phonetics.json          由 ipa-dict 生成的英/美音标(脚本生成)
scripts/fixtures/ielts-phonetics-overrides.json 人工校正的音标与按词性区分的读音(人工编辑,优先)
scripts/fixtures/ielts-pronunciations.json     从 D1 拉取的已有音频(与 COCA 重叠的词)
        │  npm run ielts:build
        ▼
src/data/ielts/generated/
  catalog.json                                 模块与话题目录,随页面加载(约 1.5 KB gzip)
  listening|reading|writing|speaking.json      各模块词条,按需动态加载
```

- 修改词条:编辑 `docs/ielts-vocabulary.md` → `npm run ielts:phonetics` → `npm run ielts:build` → 提交。
- 修正音标:编辑 `ielts-phonetics-overrides.json`(`{uk, us}` 整词校正,或 `byPos` 按词性给读音)→ `npm run ielts:build`。
- 刷新音频:`npm run ielts:pronunciations:fetch`(只读查询 D1)→ `npm run ielts:build`。
- `npm run ielts:check` 校验 `generated/` 与源文件是否一致。
- `generated/` 与 `ielts-phonetics.json` 由脚本生成,不要手改。

## 音标规范

- 来源:[ipa-dict](https://github.com/open-dict-data/ipa-dict)(MIT)的 `en_UK` / `en_US`,由 `scripts/lib/ipa-normalize.mjs` 统一为学习词典风格。
- 英音参照 Oxford Learner's 写法:`/ɪnˈkriːs/`、`/əˈbændən/`;美音参照 Cambridge 美音写法:`/ˈwɔːtɚ/`、`/ɡəˈrɑːʒ/`。
- 重音符号放在音节开头;单音节词不标重音;主重音之后不标次重音;用 `ɡ` 不用 `g`;不使用 `ɐ ɹ ɫ` 等宽式符号。
- 词组中的虚词用弱读(`/meɪk ˈjuːs əv/`);连字符复合词主重音在最后一部分(`/ˌsemi dɪˈtætʃt/`)。
- `en_UK` 缺失的词由美音按非儿化规则推导英音(约 200 个),词典两边都缺的词与名动重音不同的词写在 overrides 中。
- 带占位符的句型(如 *convert A into B*)不标音标。

## 词条字段

- `id`:由单词生成的稳定 slug(如 `security-deposit`;带重音符号的拼写加 `-accented`),用于路由与本地学习进度。
- `group`:可选,所在话题内的小节序号,对应 `IeltsTopicSummary.groups`。
- `senses`:`[{ pos, meaning }]`,由 md 中的“词性 释义”解析。
- `phoneticUk` / `phoneticUs`:英/美音标。
- `posPhonetics`:可选,词性不同读音不同时按词性给出(如 increase n. `/ˈɪnkriːs/`、v. `/ɪnˈkriːs/`)。
- `audioKey`:可选,音频地址为 `{IELTS_AUDIO_BASE_URL}/{uk|us}/{audioKey}.m4a`,用 `getIeltsAudioUrl()` 生成。
