# vocab 词库场景达标核对报告(2026-06)

> 目标用户:程序开发者,提升阅读能力。
> 核对场景:日常交流、程序开发、工作对接、工作交流。
> 数据来源:远程 D1 `english-orbit-db` 的 `vocab` 表全量导出(5453 行,单次 SQL)。

## 1. 总体结论

- 词库规模 5453 词(COCA 高频底表 + 软件开发补充词表),**四场景基础覆盖良好(75%–90%)**,
  但每个场景都存在高频缺口,合计补充 83 词后达标(见迁移 `0233`)。
- 中文释义抽检覆盖全部 5453 条,发现 **273 条需要修复**(见迁移 `0232`),
  修复后释义可靠性达到可对外提供的水平。

## 2. 覆盖度核对结果(修复前)

| 场景 | 核对词表命中率 | 主要缺口示例 |
|---|---|---|
| 程序开发-基础概念 | 84% | callback、constructor、null、pointer、override、static |
| 程序开发-Web/后端 | 80% | fetch、header、socket、template、validate、encode/decode |
| 程序开发-工程协作 | 82% | clone、rebase、hotfix、lint、outage、readme、changelog |
| 程序开发-性质概念 | 61% | deprecated、immutable、nested、overflow、stateless、idempotent |
| 工作对接 | 75% | deliverable、timeline、sync、blocker、kickoff、prioritize |
| 工作交流 | 86% | clarification、regards、sincerely、tentative、follow-up |
| 日常交流 | 90% | luggage、snack、microwave、cashier、haircut、sleepy |

补充词条统一追加在 `frequency_rank >= 5454`,带 UK/US IPA,音频走既有发音管线另行生成。

## 3. 释义问题分类(共 273 条修复)

### 3.1 英文原词泄漏进中文释义(约 177 条)

形如 `sense → "感觉； sense"`、`trail → "trail；小路"`,个别条目甚至只有英文
(`spare → "spare"`)或带错形(`regulate → "regulation；管理"`、`gather → "...； gathering"`)。
已全部改写为纯中文释义。git/docker/http/json/cd/dvd/id/Dr/cookie 等英文本身就是释义
一部分的技术词条予以保留。

### 3.2 释义错误或缺主义项(约 50 条)

修复前示例:

- `steep`:"浸渍；悬崖" → 应为"陡峭的;急剧的;浸泡"
- `coup`:"政变;d'é"(乱码截断)→ "政变"
- `pro`:"正面地;可编程远程操作" → "赞成;职业的;专业人士"
- `stable`:只有"马房;牛棚",缺"稳定的"
- `convert`:只有"皈依者",缺"转换"
- `elect`:缺动词"选举";`festival`:缺名词"节日";`ill`:缺"生病的"
- `incident`:"故障事件"(IT 味过重)→ "事件;事故"
- `butterfly`:混入"蝶式棉块;翼形皮癣"等垃圾义项

### 3.3 面向开发者阅读的义项补充(17 条)

为通用词补上开发语境常用义,如:`array` 数组、`script` 脚本、`thread` 线程、
`exception` 异常、`float` 浮点数、`render` 渲染、`mount` 挂载、`prompt` 提示词、
`resume` 简历、`transaction` 事务、`load` 加载、`escape` 转义、`listener` 监听器、
`session` 会话、`pool` 池、`mask` 掩码、`production` 生产环境。

### 3.4 截断/杂质释义(约 29 条)

形如 `various → "...;个"`、`nice → "...;精"`、`machine → "...;机"`(疑似源数据按
长度截断),以及 `glance → "辉矿类"`、`barn → "靶(恩)(核反应截面单位)"` 等冷僻杂质。

## 4. 结构性问题(本轮未改动,仅记录)

- `frequency_rank` 在 4346–4999 区间几乎全部双重占用(COCA 原表与补充词表沿用同段编号),
  1–4345 区间有 637 个缺号(源表本身不全)。当前应用分层只用到 top-3000,不受影响;
  若未来要做"按真实词频排序"的功能,建议把 4346 之后的补充词整体重编号。
- 新增 83 词(rank 5454–5536)暂无发音音频,需跑发音生成 + R2 上传管线补齐
  `vocab_pronunciations` 及音频文件。

## 5. 相关文件

- 历史线上批次：释义修复、场景补充词
- 上一轮审计:`docs/coca5000_audit_report.md`、`docs/software_dev_vocab_supplement.md`
