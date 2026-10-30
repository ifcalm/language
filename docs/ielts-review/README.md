# 雅思词库释义审校(2026-10-30)

对 D1 `ielts_words` 全部 4557 条释义逐条人工审校,按模块分 6 批完成。每批的修改清单(`batch-*.md`)、原始数据(`batch-*.json`)与迁移文件一一对应。

## 审校标准

1. 释义是否准确。
2. 雅思常用义是否缺失、是否排在前面(尤其是写作、学术阅读里的高频义)。
3. 词性是否正确、完整。
4. 近义词是否用了同一个释义而无法区分。

## 结果

| 批次 | 范围 | 条数 | 修改 | 迁移 |
|---|---|---|---|---|
| 1 | 听力 | 815 | 22 | `0245_review_ielts_meanings_listening` |
| 2 | 阅读:学术核心词(论证、抽象名词、逻辑、评价、学术动词) | 795 | 28 | `0246_review_ielts_meanings_reading_academic` |
| 3 | 阅读:自然科学(地理气候、生命科学、物质科学与数学) | 815 | 22 | `0247_review_ielts_meanings_reading_science` |
| 4 | 阅读:人文社科(医学心理、语言历史、城市经济科技) | 727 | 23 | `0248_review_ielts_meanings_reading_society` |
| 5 | 写作 | 990 | 18 | `0249_review_ielts_meanings_writing` |
| 6 | 口语 | 415 | 22 | `0250_review_ielts_meanings_speaking` |
| **合计** | | **4557** | **135(约 3%)** | |

所有迁移已应用到线上 D1 并在 `d1_migrations` 记账。每条 UPDATE 都以审校时的原释义为条件,只有内容未被他人改动时才会生效;6 批共 135 条全部更新成功。

## 主要问题类型

| 类型 | 数量(约) | 例子 |
|---|---|---|
| 漏掉雅思常用义 | 70 | balance 平衡、charge 指控、position 立场、implication 影响、perception 看法、raise 提高/筹集/提出、remote 远程的 |
| 近义词释义相同、无法区分 | 50 | highlight / underline / emphasise、cite / quote、acquire / obtain、contagious / infectious、revenue / income、sue / prosecute、recreation / entertainment / amusement |
| 释义不准或不自然 | 15 | homestay(原与 host family 相同)、eventually(原“终于”)、paramount(原“至高无上的”)、whereas(原含“鉴于”) |

## 顺带的改进

- 解析器新增两项检查:同一词条重复出现同一词性、同一词性内释义重复,构建时直接报错(发现并修复了 atmosphere“氛围”重复)。
- `scripts/generate-ielts-meaning-migration.mjs`:把审校清单转成带条件保护的迁移文件和对比表,以后修改释义沿用同一流程。

## 仍未覆盖

- 释义只审了“对不对、全不全”,没有为每个词补英文释义或用法说明。
- 同义词辨析只在释义层面区分;系统的易混词辨析(60–80 组)仍待整理。
- 例句尚未编写。
