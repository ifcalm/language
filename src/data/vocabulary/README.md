# Vocabulary frontend data notes

Core Vocabulary 已迁移到 D1。这个目录现在只保留前端展示所需的类型定义与中文标签，不再保存本地词库数据。

## D1 公共词库表

当前公共学习数据只保留三张表：

- `vocab`：单词、核心释义、频率排序、美音/英音 IPA。
- `vocab_pronunciations`：读音音标与音频 URL。
- `vocab_examples`：例句与中文解释。

前端通过 `/api/vocabulary` 读取词库。列表接口现在只保留分页与搜索；`vocab.frequency_rank` 仍用于排序和展示，不再提供 Top 100 / 500 / 1000 / 3000 的分层筛选入口。

来源、审核、授权、生成方式等信息不参与前端业务模型，应放在文档、批次 manifest、迁移说明或编辑日志中。
