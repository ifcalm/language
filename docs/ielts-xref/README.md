# 雅思词库交叉对比报告(2026-10-28)

对象:`docs/ielts-vocabulary.md`(3647 条,其中单词 3148、词组 499)。
目的:用公开、许可明确的词表检验**收词**是否合理——哪些该补、哪些可能太基础或太生僻。外部资料只作判断依据,不搬运其释义或编排。

## 参考资料与许可

| 资料 | 许可 | 使用的字段 |
|---|---|---|
| [ECDICT](https://github.com/skywind3000/ECDICT)(`ecdict.csv`,77 万词条) | MIT | `tag` 中的 `ielts` / `zk`(中考)标签、`frq`(当代语料词频排名)、`bnc`(BNC 词频排名)、`exchange`(词形还原) |
| [NGSL 1.2](https://www.newgeneralservicelist.com/new-general-service-list) | CC BY-SA 4.0 | 2809 个通用核心词及频率排名 |
| [NAWL 1.2](https://www.newgeneralservicelist.com/new-academic-word-list) | CC BY-SA 4.0 | 959 个学术词 |

本目录 CSV 只含单词、是否命中各参考表、频率排名,不含参考资料的释义。频率与标签数据来自上述项目,引用时需注明出处。

## 方法

- 英美拼写互认(analyse/analyze、labour/labor、centre/center 等),参考表的屈折形式先还原为原形。
- “词频”取 ECDICT `frq` 与 `bnc` 中较靠前的排名,数字越小越常用。
- **基础词**:ECDICT 标 `zk`(中考词),或 NGSL 前 1000,或词频排名 ≤ 1500。
- **生僻词**:词频排名 > 25000 或无词频。
- **专有名词**:ECDICT 原词首字母大写(国名、星期、宗教等)。
- **同词族**:与我们已收词同词根的派生词(如已收 allocate,缺 allocation)。

## 核心数据

| 指标 | 结果 |
|---|---|
| ECDICT 标 `ielts` 的单词(还原后) | 4765 |
| 我们已覆盖 | 1595(**33%**) |
| NAWL 学术词 | 959 |
| 我们已覆盖 | 363(**38%**) |
| 我们的单词中带 ECDICT `ielts` 标签 | 1603 / 3148(51%) |

两个覆盖率都偏低:**现有词表的“题材词”很多,但通用学术词和雅思常见词缺口明显**。反过来,我们有约一半单词不在 ECDICT 雅思标签里,主要是话题专业词(如 seismology、troposphere)和复合词(如 well-rounded、eco-friendly),这部分是我们的特色,不代表错误。

## 缺口拆解(ECDICT 雅思词 + NAWL,未被覆盖的 3522 个)

| 类别 | 数量 | 处理建议 | 文件 |
|---|---|---|---|
| 基础词(中考词 / NGSL 前 1000 / 高频) | 778 | 按现行规则不收 | `basic-gap.csv` |
| 专有名词 | 61 | 不收 | — |
| 生僻词 | 69 | 不收 | — |
| 同词族派生词 | 679(其中 NAWL 232) | 作为已收词的“派生词”字段补入,不单独成条 | `word-family-candidates.csv` |
| **真正的新词** | **1935** | 分级审核后补入 | `add-candidates.csv` |

新词按优先级分三级:

| 级别 | 规则 | 数量 | 示例 |
|---|---|---|---|
| **P1** | 在 NAWL 中(学术核心) | 333 | undermine、hierarchy、rhetoric、stance、legitimate、depict、consent、discourse、scenario、prominent |
| **P2** | ECDICT 雅思词,词频排名 ≤ 8000 | 905 | institute、derive、contemporary、boundary、assistance、agenda、transition、reputation、recommendation |
| **P3** | ECDICT 雅思词,词频排名 8000–25000 | 697 | outweigh、curtail、augment、equitable、imperative、prolong、perpetual、relinquish、retrospect |

P2、P3 里混有一般性生活词(如 golf、cream、wedding、blush),ECDICT 的雅思标签收得较宽,需要逐条判断,不宜整批导入。

## 我们这边需要复核的

| 类别 | 数量 | 说明 | 文件 |
|---|---|---|---|
| 高频 / 基础词 | 435 | 其中 174 个是中考词(passport、interview、research、temperature 等);315 个同时在 ECDICT 雅思标签或 NAWL 中 | `ours-high-frequency.csv` |
| 低频词 | 59 | 词频排名 > 25000 且不在任何参考表(如 diffract、hieroglyph、vivisection、indolent) | `ours-low-frequency.csv` |
| ECDICT 查无此词 | 4 | en-suite、résumé、exam-oriented、dual-income,均为合法写法,无需处理 | — |

高频词不建议直接删除:像 government、evidence、policy、research 虽然常见,却是雅思阅读写作的核心词;passport、headache 是听力拼写高频词。更合适的做法是给词条加**难度层级**(基础 / 核心 / 进阶),而不是删掉。

## 需要拍板的问题

1. **规模目标**:P1 全收 + P2 筛选后收,词表约增至 4500–5000 条;再加 P3 精选,约 5500 条。
2. **基础词规则**:维持“不收中考词”,还是改为“收但标记为基础层级”?这决定 174 个已收中考词和 778 个基础缺口词的去留。
3. **词族**:派生词是否作为词条内字段(推荐),还是单独成条?
4. **审核方式**:候选词由我逐条判断并写原创释义、归入话题,每批出清单给你抽查。

## 复现

参考数据下载到临时目录(不入仓库):

```
ecdict.csv                       https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv
NGSL_12_stats.csv                https://www.newgeneralservicelist.com/s/NGSL_12_stats.csv
NAWL_12_lemmatized_for_research  https://newgeneralservicelist.com/s/NAWL_12_lemmatized_for_research.csv
```

## 处理结果(2026-10-28,方案:P1 全收 + P2 筛选)

| 项目 | 数量 | 说明 |
|---|---|---|
| P1 收录 | 329 / 333 | 未收:fiber、aluminum、artifact(已有英式拼写 fibre、aluminium、artefact),noisy(按基础词规则排除) |
| P2 收录 | 582 / 905 | 未收:生活基础词(golf、lemon、carrot)、口语俚语(cop、idiot、wee)、专有名词(catholic、sydney)、小说叙事动作词(shrug、mutter、giggle)、美式拼写重复项 |
| 新增话题 | 2 | 阅读 2.5「抽象概念与学术名词」、2.6「学术形容词与副词」 |
| 词表总量 | 3647 → **4558** | 单词 4059,词组 499 |

收录后覆盖率:

| 指标 | 之前 | 之后 |
|---|---|---|
| ECDICT 雅思词 | 1595 / 4765(33%) | 2331 / 4765(**49%**) |
| NAWL 学术词 | 363 / 959(38%) | 687 / 959(**72%**) |

NAWL 剩余缺口主要是已收词的派生词(见 `word-family-candidates.csv`),待“派生词作为词条字段”方案确定后处理。P3(697 个)暂未处理。
