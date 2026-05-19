# Core Vocabulary 数据说明

当前词库是给 English Orbit 自用的“学习底稿”，不是最终词典。

## 词表来源

- 前 50 个词条：项目内人工整理样例，保留例句、搭配和义项拆分，用作卡片质量样板。
- Core 3000 主体：以 [NGSL 1.2](https://www.newgeneralservicelist.com/new-general-service-list) 为基础。
- 补足 3000：使用 [NAWL](https://www.newgeneralservicelist.com/new-academic-word-list) 中未出现在 NGSL 的高频进阶词补齐。
- 当前导入参考了 Lingua Eruditio 的 [NGSL 中文词汇表](https://www.linguaeruditio.com/Glossary/NGSL/CN/NGSL_ch_gloss.html) 与 [NAWL 词汇表](https://www.linguaeruditio.com/Glossary/NAWL/NAWL_gloss.html)，用于初始释义、词性和 IPA 底稿。

## 质量边界

- CEFR 等级目前按词表来源和频率段粗略估计，不等同于权威逐词校准。
- NGSL 词条已有中文简释；NAWL 补充词当前优先保留英文释义，后续需要中文化和人工复核。
- 例句、搭配、读音播放、义项拆分会按批次逐步补齐；学习界面不会展示来源与校验信息，避免干扰学习。

## 频率排序

- 学习界面默认按 `priority` 展示；该字段现在由词表频率重新计算，不再把前 50 个精修样例固定置顶。
- NGSL 词条以 NGSL rank 作为通用英语频率基础。
- NAWL 补充词排在 NGSL 之后，用于补齐 3000 词底稿，因此更适合作为进阶词处理。
- `frequencyBand` 用于分层学习入口：高频 100、日常 500、核心 1000、完整 3000。

## D1 主表：core_vocabulary

`core_vocabulary` 是核心词库的数据库主表，只保存稳定、公共、适合列表查询的信息。
读音、例句、义项、搭配、用户造句和复习记录不放在这张表里，后续通过独立表使用 `vocabulary_id` 关联。

字段说明已经写在 `/Users/lishuaishuai/Projects/githubProjects/language/migrations/0002_core_vocabulary.sql` 的建表 SQL 注释中。

初次导入或重新同步当前 3000 词底稿时，可以生成临时 SQL：

```bash
npm run db:seed:vocabulary
```

默认输出到 `.wrangler/generated/core-vocabulary-seed.sql`。该文件不提交到仓库，只用于执行 D1 导入。
