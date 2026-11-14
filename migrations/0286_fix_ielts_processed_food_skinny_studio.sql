-- IELTS fixes: processed food (UK) took the short vowel of the US reading; skinny was glossed too strongly for its example; studio-2 translated "third floor" as 三楼 while every other example counts floors the British way.
UPDATE ielts_pronunciations SET phonetic = '/ˈprəʊsest fuːd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'processed-food-uk' AND phonetic = '/ˈprɒsest fuːd/';

UPDATE ielts_words SET meaning_zh = 'adj. 极瘦的,皮包骨的', updated_at = CURRENT_TIMESTAMP
WHERE id = 'skinny' AND meaning_zh = 'adj. 骨瘦如柴的';

UPDATE ielts_examples SET sentence_zh = '广播演播室在四楼,就在电梯旁边。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'studio-2' AND sentence_zh = '广播演播室在三楼,就在电梯旁边。';
