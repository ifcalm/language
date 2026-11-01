-- Align IELTS example translations with the 0261 meanings (see docs/ielts-review/meaning-fixes-0261.md).
UPDATE ielts_examples SET sentence_zh = '大多数蝙蝠在夜间活动,白天在洞穴里睡觉。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'nocturnal-1' AND sentence_zh = '大多数蝙蝠是夜行性的,白天在洞穴里睡觉。';

UPDATE ielts_examples SET sentence_zh = '我最喜欢的咖啡杯边沿有一道小裂纹。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'rim-1' AND sentence_zh = '我最喜欢的咖啡杯边缘有一道小裂纹。';

UPDATE ielts_examples SET sentence_zh = '这种昆虫分泌一种天然黏合剂,把卵粘在叶子上。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'adhesive-1' AND sentence_zh = '这种昆虫分泌一种天然粘合剂,把卵粘在叶子上。';
