# COCA 5000 高频词地基表核对报告

## 1. 结构检查结论

- Markdown 表格可解析行数：4483
- rank 最小值：1
- rank 最大值：4999
- rank 唯一值数量：4361
- 1-5000 中缺失 rank 数：639
- 重复 rank 值数量：121
- 涉及重复 rank 的行数：243
- 美音音标为空：3 行
- 英音音标为空：298 行
- 词类标注为空：4269 行

## 2. 关键问题

### 2.1 不是严格完整的 COCA 前 5000

当前文件共有 4483 行，且 1-5000 的 rank 中缺失 639 个 rank。  
前 60 个缺失 rank 如下：

9, 27, 29, 49, 91, 104, 106, 116, 128, 129, 136, 149, 155, 179, 182, 187, 190, 196, 199, 208, 222, 240, 260, 262, 298, 318, 323, 327, 329, 349, 357, 368, 376, 388, 407, 429, 437, 456, 463, 477, 484, 496, 509, 512, 534, 541, 545, 554, 580, 582, 583, 604, 605, 618, 620, 632, 644, 645, 683, 692

完整缺失 rank 已导出到 `coca5000_missing_ranks.csv`。

### 2.2 后段存在重复编号

检测到表格在第 4353 行附近 rank 从 4999 回落到 4346，之后追加了分类词汇，导致 rank 重复。  
建议将追加词汇从主表拆出，改成“软件开发/法律/商务补充词表”，不要继续使用 COCA # 作为编号。

重复 rank 详情已导出到 `coca5000_duplicate_ranks.csv`。

### 2.3 音标字段不完整且存在多音词问题

英音音标缺失较多，共 298 行。  
美音音标为空的行有 3 行，主要是追加技术词条列错位或未填。

对于 use、live、lead、read、record、project、produce、present、object、conduct、contract、content、permit、increase、decrease 等词，当前表通常只给了一种读音，但释义覆盖了多个词类/义项，容易误导学习者。

优先复核清单已导出到 `coca5000_priority_review_items.csv`。

### 2.4 释义存在少量明显不自然或错配

抽查发现：
- software：建议把“软设备”改成“软件；软件系统”。
- slice：“菜刀”不适合作为 slice 的常用义。
- wind：释义主要是“风”，但当前给的是 /waɪnd/，应补 /wɪnd/。
- bow：释义主要是“弓/琴弓”，但当前给的是 /baʊ/，应补 /boʊ/。
- tear：眼泪与撕裂读音不同，应分开。
- subject：释义疑似截断。
- gone、times、pending 等追加词的词类标注需要复核。

## 3. 软件开发词汇覆盖情况

当前表中已经包含一批技术词，如 software、system、program、development、algorithm、cache、compiler、frontend、backend、latency、throughput、token 等。

但如果目标是“工作英语 + 软件开发沟通”，还建议补充 API、HTTP、JSON、Docker、Kubernetes、authentication、authorization、deployment、rollback、scalability、maintainability、compatibility、concurrency、mutex、goroutine 等。

我已整理补充词表到 `software_dev_vocab_supplement.md`。

## 4. 建议的修订顺序

1. 先修复表结构：拆分主表和补充表。
2. 用官方 COCA Top 5000 表补齐缺失 rank。
3. 将“COCA #”只保留给官方频率排名；自定义补充词使用独立编号。
4. 对多音词拆分为多个义项，例如 use_v / use_n，live_v / live_adj。
5. 补齐词类标注：名词、动词、形容词、副词、介词、连词、代词、限定词、助动词等。
6. 音标统一风格：建议采用学习者友好的音位转写，不混用过多 allophone，如大量 /ɫ/。
7. 对软件开发词汇单独维护“技术补充词表”，不要混在 COCA rank 主表里。
