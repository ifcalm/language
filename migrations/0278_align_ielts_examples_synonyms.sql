-- IELTS example review: 5 fixes (see docs/ielts-review/examples-fixes-0278.md).
UPDATE ielts_examples SET sentence_zh = '科学家警告,如果冰盖继续融化,将发生大灾难。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'catastrophe-1' AND sentence_en = 'Scientists warn of a catastrophe if the ice sheets continue to melt.' AND sentence_zh = '科学家警告,如果冰盖继续融化,将发生灾难。' AND target = 'catastrophe';

UPDATE ielts_examples SET sentence_zh = '学习园艺学的学生学习如何种植水果、蔬菜和花卉。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'horticulture-1' AND sentence_en = 'Students of horticulture learn how to grow fruit, vegetables and flowers.' AND sentence_zh = '学习园艺的学生学习如何种植水果、蔬菜和花卉。' AND target = 'horticulture';

UPDATE ielts_examples SET sentence_zh = '到 2030 年,电子书销量可能超过纸质书。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'surpass-1' AND sentence_en = 'Sales of e-books may surpass those of printed books by 2030.' AND sentence_zh = '到 2030 年,电子书销量可能超越纸质书。' AND target = 'surpass';

UPDATE ielts_examples SET sentence_zh = '我觉得有幽默感的人特别有魅力。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'attractive-1' AND sentence_en = 'I find people with a good sense of humour really attractive.' AND sentence_zh = '我觉得有幽默感的人特别有吸引力。' AND target = 'attractive';

UPDATE ielts_examples SET sentence_zh = '当地人仍在使用祖辈传下来的耕作方法。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'forefather-1' AND sentence_en = 'Local people still use the farming methods of their forefathers.' AND sentence_zh = '当地人仍在使用祖先的耕作方法。' AND target = 'forefathers';
