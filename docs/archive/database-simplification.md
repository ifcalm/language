# 数据库简化归档

归档日期：2026-05-31

这份文档用于归档 English Orbit 在公共词汇数据阶段做过的一次数据库简化决策。原始记录来自早期临时文件 `docs/update-db.md`，本文件仅作为历史留痕，不参与应用运行、构建或部署流程。

## 背景

项目早期为了快速验证词汇、读音、例句、场景、用户学习记录等方向，设计过相对完整的数据表和字段。后续产品方向逐渐明确：第一阶段优先打磨公共英语学习内容，减少过度设计，避免来源、审核、版权、业务状态等整理过程字段进入核心业务流程。

因此，我们对数据库模型做了一次收敛：保留学习体验真正需要的数据，删除暂时不会使用的表和字段，并将部分表名改得更短、更直白。

## 归档事项

### 删除暂不需要的公共内容表

以下表与“单词场景”或过细义项拆分相关，当前阶段不再作为主功能保留：

- `vocabulary_scenarios`
- `vocabulary_scenario_links`
- `vocabulary_senses`
- `vocabulary_collocations`

对应的关联逻辑也同步移除。

### 删除暂不需要的用户个性化表

以下表属于后续用户系统、学习记录和个性化词库方向。当前阶段先聚焦公共内容，暂不保留：

- `profiles`
- `daily_logs`
- `vocabulary_items`

后续如果重新设计用户体系，再按新的命名和数据模型补回。

### 精简核心词汇表字段

`core_vocabulary` 去掉以下字段：

- `entry_type`
- `primary_part_of_speech`
- `level`
- `frequency_band`
- `learning_priority`
- `publish_status`
- `note`
- `reviewed_at`

相关业务逻辑也同步移除。

### 精简读音表字段

`vocabulary_pronunciations` 去掉以下字段：

- `normalized_word`
- `accent`
- `audio_source`
- `sort_order`
- `publish_status`
- `reviewed_at`
- `locale`
- `phonetic_source`
- `phonetic_source_url`
- `audio_provider`
- `voice_id`
- `audio_object_key`
- `audio_format`
- `license`
- `attribution`
- `quality_status`
- `metadata_json`

保留重点是学习侧真正使用的发音数据，例如音标和音频地址。

### 精简例句表字段

`vocabulary_examples` 去掉以下字段：

- `normalized_word`
- `sense_id`
- `source_type`
- `source_ref`
- `difficulty`
- `example_order`
- `publish_status`
- `reviewed_at`

对应逻辑也同步删除。

### 数据表重命名

为让表名更短、更直白，完成以下命名调整：

| 原表名 | 新表名 |
| --- | --- |
| `core_vocabulary` | `vocab` |
| `vocabulary_pronunciations` | `vocab_pronunciations` |
| `vocabulary_examples` | `vocab_examples` |

## 设计原则

这次简化遵循几个原则：

1. 数据整理阶段该保证的来源、版权、质量，不必都进入业务表字段。
2. 第一阶段先服务公共学习内容，不提前承载复杂用户体系。
3. 表名优先直白、短小、容易记忆。
4. 业务查询路径尽量简单，避免每个功能都被过度关联拖慢。
5. 后续需要用户个性化功能时，再按真实产品需求重新建模。
