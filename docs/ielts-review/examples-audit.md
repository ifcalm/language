# 雅思例句排查记录(2026-10-30)

范围:`ielts_examples` 全部 4882 句。结论:发现 18 句问题,已通过迁移 `0258_fix_ielts_examples_audit` 修正。

## 排查方式

| 项目 | 覆盖 | 结果 |
|---|---|---|
| 线上 D1 与源文件逐字比对 | 4882 句 | 完全一致 |
| 结构:`target` 出现次数、句长、标点、大小写、a/an、重复句、重复译文 | 4882 句 | 无错误 |
| 美式拼写和美式用词 | 4882 句 | 26 条命中,均为词条本身或误报 |
| 译文是否对应词条义项(程序筛出 526 句后人工阅读) | 526 句 | 见下表 |
| 含年份、人名、地名的句子(程序筛出后人工阅读) | 108 句 | 见下表 |
| `each`/`every` 句式、绝对化表述(程序筛出后人工阅读) | 约 115 句 | 见下表 |
| 其余句子逐句通读 | 未做 | 只有编写时读过一遍 |

事实类内容是根据已有知识判断的,没有查阅外部资料。

## 已修改(18 句)

| 词条 | 问题 | 修改前 | 修改后 | 新译文 | 新 target |
|---|---|---|---|---|---|
| be-likely-to | `target` 多了 less | Children from poor families are less likely to attend university. | Children who read at home are likely to do well at school. | 在家读书的孩子很可能在学校表现好。 | are likely to |
| bodily | 搭配不地道,应为 body temperature | Sweat helps to keep bodily temperature at a safe level. | Sleep affects many bodily functions, including digestion and breathing. | 睡眠影响许多身体机能,包括消化和呼吸。 | bodily |
| lens | 句中是“晶状体”,词条释义是“透镜” | A lens at the front of the eye focuses light onto the retina. | A lens bends light so that a telescope can show distant stars clearly. | 透镜使光线弯曲,让望远镜能清晰地显示遥远的恒星。 | lens |
| penguin | 过度概括,只有部分企鹅如此 | Male penguins keep the eggs warm during the long Antarctic winter. | Male emperor penguins keep the eggs warm during the long Antarctic winter. | 在漫长的南极冬季,雄帝企鹅负责为蛋保暖。 | penguins |
| finch | 说法存疑,达尔文当时并未注意到这一点 | Darwin noticed that the beak of each finch suited its particular diet. | Scientists noticed that the beak of each finch suited its particular diet. | 科学家注意到,每只雀的喙都适合它特定的食物。 | finch |
| descendant | 狗并非直接来自现代灰狼 | Today's dogs are all descendants of the grey wolf. | Today's dogs are all descendants of ancient wolves. | 如今的狗都是古代狼的后裔。 | descendants |
| oxygen | 过于绝对,存在极少数例外 | All animals need oxygen in order to produce energy. | Almost all animals need oxygen in order to produce energy. | 几乎所有动物都需要氧气来产生能量。 | oxygen |
| sea-level | “大部分”不准确 | Much of the Netherlands lies below sea level and is protected by walls. | Large parts of the Netherlands lie below sea level and are protected by walls. | 荷兰大片地区低于海平面,靠堤坝保护。 | sea level |
| harm | 过于绝对 | Most pesticides do more harm than good in the long term. | Some pesticides do more harm than good in the long term. | 从长远来看,有些农药弊大于利。 | harm |
| margin | 用了现实中存在的政党名,且情节虚构 | The Green Party won by a narrow margin in the 2015 election. | The opposition party won by a narrow margin in the 2015 election. | 反对党在 2015 年选举中以微弱差额获胜。 | margin |
| celebrity | 为凑单数,句子不自然 | Young people are often too interested in the lives of each celebrity. | Young people are often too interested in the lives of celebrities. | 年轻人常常对名人的生活过于感兴趣。 | celebrities |
| antenna | 为凑单数,句子不自然 | Insects use each antenna to touch and smell things around them. | Insects use their antennae to touch and smell things around them. | 昆虫用触角触碰和嗅闻周围的东西。 | antennae |
| blood-vessel | 为凑单数,句子不自然 | Smoking damages the walls of each blood vessel and raises the risk of illness. | Smoking damages the walls of the blood vessels and raises the risk of illness. | 吸烟会损害血管壁,增加患病风险。 | blood vessels |
| capillary | 为凑单数,句子不自然 | Oxygen passes from the blood into the tissues through each tiny capillary. | Oxygen passes from the blood into the tissues through tiny capillaries. | 氧气通过微小的毛细血管从血液进入组织。 | capillaries |
| spore | 为凑单数,句子不自然 | The wind can carry each spore a long way from the parent plant. | The wind can carry spores a long way from the parent plant. | 风能把孢子带到离母株很远的地方。 | spores |
| reality-show | 为凑单数,且过于绝对 | I think that every reality show on television is a bit silly. | I think that most reality shows on television are a bit silly. | 我觉得电视上的大多数真人秀都有点傻。 | reality shows |
| muscular | “姐夫”无法确定,应避开 | My brother-in-law goes to the gym every day and is very muscular. | My neighbour goes to the gym every day and is very muscular. | 我的邻居每天去健身房,肌肉很发达。 | muscular |
| acidic | 译文不通顺(仅改译文) | Water in the lake became more acidic after years of pollution. | 不变 | 多年污染后,湖水的酸性变强了。 | acidic |

## 不改但需知道

- **义项覆盖:** 59 个多词性词条只有一句例句,第二词性没有例句;449 个词条的例句数少于分号分隔的义项数。这是编写时“优先覆盖主要义项”的结果,不算错误。
- **事实句:** 108 句含年份、人名或地名。除上表外,没有发现明显错误,但没有查证。
- **敏感词条:** 程序列出 36 句(如 rape、suicide、abortion、massacre),都是中性陈述,是否保留取决于用户群体。
- **句式重复:** 最常见的开头是 “The number of”(13 次)和 “There was a”(11 次),出现频率不高。
- **`target` 与原形不同:** 15 条属于正常变形或短语变化(如 grind → ground),填词时应判断句中形式。
