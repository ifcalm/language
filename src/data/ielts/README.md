# IELTS vocabulary static data

雅思词汇是独立于 COCA 词库(D1 `vocab` 表)的模块。数据在 **D1 管理**,导出为**静态资源**给前端,运行时不查询 D1。

与 `src/data/vocabulary/`(前端直接调 API)不同是有意为之:雅思词表固定,静态资源走 CDN 长缓存,访问更快;D1 负责关联与管理。

## 数据流

```
D1(唯一数据源)
  ielts_words            词条:id、word、spelling_us、meaning_zh
  ielts_pronunciations   音标与音频:每个口音一行,名动异读按词性分行
        │  npm run ielts:export(只读查询 D1)
        ▼
scripts/fixtures/ielts-d1.json   D1 快照,提交到 git(一行一条记录,diff 可读)
src/data/ielts/topics.json       编排文件:模块 / 话题 / 小节与词序,只含词条 id
        │  npm run ielts:build
        ▼
src/data/ielts/generated/
  catalog.json                                 模块与话题目录,随页面加载
  listening|reading|writing|speaking.json      各模块词条,按需动态加载
docs/ielts-vocabulary.md                       供人阅读的完整词表(自动生成)
```

话题是**展示用的编排**,不是词条数据,所以不入库:改分组就是改 `topics.json`,不用写迁移。

- **修改词条、释义、音标**:改 D1(写迁移或直连 API)→ `npm run ielts:export` → `npm run ielts:build` → 提交快照与 `generated/`。
- **调整话题、小节或词序**:改 `topics.json`(话题写 `words`,或写 `groups` 分小节)→ `npm run ielts:build`。
- **新增词条**:先写入 D1 并导出,再把词条 id 加到 `topics.json` 的某个话题里。
- 构建会校验:`topics.json` 中的每个 id 都在 D1、且只出现一次,D1 的每个词都有话题;音频地址必须符合约定格式。
- `npm run ielts:check` 离线校验 `generated/` 与 md 是否与快照、编排文件一致。
- `generated/`、`ielts-d1.json`、`docs/ielts-vocabulary.md` 由脚本生成,不要手改。

## 音标与音频的生成工具

这些脚本用来**产出要写入 D1 的数据**,构建时不再直接读取它们:

- 音标:`npm run ielts:phonetics` 由 [ipa-dict](https://github.com/open-dict-data/ipa-dict)(MIT)生成,`scripts/lib/ipa-normalize.mjs` 统一为学习词典风格(英音参照 Oxford,美音参照 Cambridge),`scripts/fixtures/ielts-phonetics-overrides.json` 为人工校正。
- 音频:`scripts/generate-ielts-audio.mjs`(Google Cloud TTS Studio 音色)生成,`scripts/upload-ielts-audio.mjs` 经 R2 S3 接口上传到 `ielts/pronunciations/v1/{uk|us}/{key}.m4a`,带长期缓存头。路径带版本号,整体重做时换 `v2`。
- 本机走代理时,访问 Google / Cloudflare 的脚本需加 `NODE_USE_ENV_PROXY=1`。

## 音标规范

- 重音符号放在音节开头;单音节词不标重音;主重音之后不标次重音;用 `ɡ` 不用 `g`;不使用 `ɐ ɹ ɫ` 等宽式符号。
- 词组中的虚词用弱读(`/meɪk ˈjuːs əv/`);连字符复合词主重音在最后一部分(`/ˌsemi dɪˈtætʃt/`)。
- 带占位符的句型(如 *convert A into B*)不标音标,但有音频。

## 词条字段

- `id`:稳定 slug,入库后永不修改(如 `security-deposit`;冲突时人工命名,如 résumé → `resume-cv`),用于路由、音频文件名与本地学习进度。
- `spellingUs`:可选,美式拼写,用于搜索。
- `group`:可选,所在话题内的小节序号,对应 `IeltsTopicSummary.groups`。
- `senses`:`[{ pos, meaning }]`,由 D1 的 `meaning_zh` 解析。
- `phoneticUk` / `phoneticUs`:英/美音标。
- `posPhonetics`:可选,词性不同读音不同时按词性给出(如 increase n. `/ˈɪnkriːs/`、v. `/ɪnˈkriːs/`),`audio` 表示该词性有音频。
- `audio`:音频地址为 `ielts/pronunciations/v1/{uk|us}/{id}.m4a`,名动异读为 `{id}-{pos}.m4a`,用 `getIeltsAudioUrl()` 生成。
