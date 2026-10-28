# IELTS vocabulary static data

雅思词汇是独立于 COCA 词库(D1 `vocab` 表)的模块,数据**直接打包为前端静态资源**,运行时不查询 D1。

与 `src/data/vocabulary/` 方向相反是有意为之:COCA 词库曾需要后台编辑所以迁到 D1;雅思词表固定、不需要后台,静态资源走 CDN 长缓存,访问更快。

## 数据流

```
docs/ielts-vocabulary.md          唯一数据源(人工编辑这里)
scripts/fixtures/ielts-pronunciations.json   从 D1 拉取的已有音标/音频(与 COCA 重叠的词)
        │  npm run ielts:build
        ▼
src/data/ielts/generated/
  catalog.json                    模块与话题目录,随页面加载(约 1.4 KB gzip)
  listening|reading|writing|speaking.json   各模块词条,按需动态加载
```

- 修改词条:编辑 `docs/ielts-vocabulary.md` → `npm run ielts:build` → 提交 md 与 `generated/`。
- 刷新音标/音频:`npm run ielts:pronunciations:fetch`(只读查询 D1)→ `npm run ielts:build`。
- `npm run ielts:check` 校验 `generated/` 与源文件是否一致。
- `generated/` 下的文件由脚本生成,不要手改。

## 词条字段

- `id`:由单词生成的稳定 slug(如 `security-deposit`),用于路由与本地学习进度。
- `senses`:`[{ pos, meaning }]`,由 md 中的“词性 释义”解析。
- `phoneticUk` / `phoneticUs`:可选,来自 COCA 词库。
- `audioKey`:可选,音频地址为 `{IELTS_AUDIO_BASE_URL}/{uk|us}/{audioKey}.m4a`,用 `getIeltsAudioUrl()` 生成。
