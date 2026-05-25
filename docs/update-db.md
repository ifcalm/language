### 该文件记录需要更改的点

1、vocabulary_scenarios、vocabulary_scenario_links、vocabulary_senses、vocabulary_collocations 数据表删除，对应的关联逻辑也删除。
2、profiles、daily_logs、vocabulary_items这3张表也删除，后续需要的时候我会在加回来，表名称也要修改。
3、core_vocabulary表去掉字段entry_type、primary_part_of_speech、level、frequency_band、learning_priority、publish_status、note、reviewed_at，对应的逻辑应用也去掉。
4、vocabulary_pronunciations表去掉字段normalized_word、accent、audio_source、sort_order、publish_status、reviewed_at、locale、phonetic_source、phonetic_source_url、audio_provider、voice_id、audio_object_key、audio_format、license、attribution、quality_status、metadata_json，对应的逻辑应用也删除。
5、vocabulary_examples表去掉字段normalized_word、sense_id、source_type、source_ref、difficulty、example_order、publish_status、reviewed_at。
6、数据库表重命名：
    - vocabulary_examples -> vocab_examples
    - vocabulary_pronunciations -> vocab_pronunciations
    - core_vocabulary -> vocab
