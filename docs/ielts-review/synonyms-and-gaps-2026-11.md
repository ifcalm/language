# 释义缺漏补充与近义词区分(2026-11-07)

**结论:**
- 补 8 处释义缺漏,区分 23 个近义词条,共改 31 条释义(迁移 `0277_review_ielts_meanings_synonyms`)。
- 5 句例句译文随之对齐(迁移 `0278_align_ielts_examples_synonyms`)。
- 释义完全相同的词条组从 59 组减到 37 组。剩下的都是真同义词,不改。
- 两个迁移已写入线上 D1 并在 `d1_migrations` 记账,31 条释义和 5 句例句全部更新成功。对比表见 `meaning-fixes-0277.md`、`examples-fixes-0278.md`。

## 来源

- Cambridge 英汉(简体),线上,本次重新抓取了 128 个词条及 3 个短语所在页面。
- 牛津英汉汉英词典,macOS 本地。

每个新增或替换的说法都至少在其中一部词典里有对应。

## 一、补释义缺漏(8 条)

都是前几轮核查中记下、当时没改的。只增不删;如果所在话题用的正是新义项,就把它排到最前。

| 词条 | 修改后 | 依据 |
|---|---|---|
| `noble` | adj. 高贵的;高尚的;贵族的 | Cambridge“贵族的” |
| `comparable` | adj. 相当的;可比的 | Cambridge“相当的”;图表话题用的是这个义项 |
| `militant` | adj. 激进的;好战的 n. 激进分子 | Cambridge、牛津英汉都有“激进的”,牛津英汉有名词“激进分子” |
| `norm` | n. 规范;常态 | 牛津英汉“常态” |
| `palette` | n. 调色板;用色 | Cambridge“用色风格”,牛津英汉“一组颜色” |
| `gravity` | n. 重力,引力;严重性 | Cambridge“重力,引力” |
| `transparent` | adj. 透明的;公开的 | Cambridge“公开和诚实的” |
| `ignite` | v. 点燃;激起 | Cambridge“激起” |

## 二、近义词区分(23 条)

区分的标准:两个词在用法或范围上确有差别,而且能用不同的中文说法体现,不加解释性括号。只在语体正式程度上有差别的,不改。

区分的方式有两种:

- **换成更准确的说法**,如:
  - `ripe` 改为“熟的,成熟的”,区别于指人的 `mature`;
  - `garment` 改为“衣服”,指一件衣服;
  - `horticulture` 改为“园艺学”;
  - `surpass` 改为“超过,胜过”,把“超越”留给 `transcend`;
  - `catastrophe` 改为“大灾难”;
  - `forefather` 改为“祖辈”;
  - `outer` 改为“外层的,外围的”。
- **补上对方没有的常用义项**,如:
  - `fatal` 加“灾难性的”;
  - `take advantage of` 加“占便宜”;
  - `virtually` 加“实际上”;
  - `ritual` 加“例行公事”;
  - `thus` 加“这样”;
  - `dubious` 加“半信半疑的”;
  - `unearth` 加“发现”;
  - `inadequate` 加“不胜任的”;
  - `comply with` 加“符合”。

有 4 条是替换而不是新增(原说法被换掉):`forefather`、`garment`、`outer`、`surpass`。被换掉的说法并不算错,只是和近义词撞了。

## 三、保留相同释义的 37 组

这些组的词在核心义上没有能用中文区分的差别,主要分三类:

- **语体正式程度不同:** 如 `forbid`/`prohibit`、`strict`/`stringent`、`despite`/`notwithstanding`、`calculate`/`compute`、`hazard`/`peril`、`furthermore`/`moreover`。
- **英美说法或使用场合不同:** 如 `luggage`/`baggage`、`jail`/`prison`。
- **完全同义:** 如 `PhD`/`doctorate`、`capital punishment`/`death penalty`、`due to`/`owing to`、`cosmos`/`universe`。

`inmate`/`prisoner`、`hieroglyph`/`pictograph` 也有细微差别(`inmate` 也指精神病院病人;`hieroglyph` 多指古埃及文字),但不加括号就写不出来,这次没改。

## 已知局限

- 是否“雅思用得到”、是否值得区分,仍是人工判断。
- 只区分了释义完全相同的组;释义部分重叠的近义词(如 `acquire`/`obtain` 都含“获得”)没有逐一处理。
