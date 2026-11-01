-- IELTS spelling review: 15 entries, 3 phonetic pairs, 5 examples (see docs/ielts-review/spelling-check-2026-11-01.md).
UPDATE ielts_words SET word = 'empty nester', normalized_word = 'empty nester', spelling_us = NULL, meaning_zh = 'phr. 空巢者', updated_at = CURRENT_TIMESTAMP
WHERE id = 'empty-nester' AND word = 'empty-nester' AND spelling_us IS NULL AND meaning_zh = 'n. 空巢老人';

UPDATE ielts_words SET word = 'bestseller', normalized_word = 'bestseller', spelling_us = NULL, meaning_zh = 'n. 畅销书', updated_at = CURRENT_TIMESTAMP
WHERE id = 'best-seller' AND word = 'best seller' AND spelling_us IS NULL AND meaning_zh = 'phr. 畅销书';

UPDATE ielts_words SET word = 'payslip', normalized_word = 'payslip', spelling_us = NULL, meaning_zh = 'n. 工资单', updated_at = CURRENT_TIMESTAMP
WHERE id = 'pay-slip' AND word = 'pay slip' AND spelling_us IS NULL AND meaning_zh = 'phr. 工资单';

UPDATE ielts_words SET word = 'noticeboard', normalized_word = 'noticeboard', spelling_us = NULL, meaning_zh = 'n. 布告栏', updated_at = CURRENT_TIMESTAMP
WHERE id = 'notice-board' AND word = 'notice board' AND spelling_us IS NULL AND meaning_zh = 'phr. 布告栏';

UPDATE ielts_words SET word = 'hang-gliding', normalized_word = 'hang-gliding', spelling_us = NULL, meaning_zh = 'n. 悬挂滑翔', updated_at = CURRENT_TIMESTAMP
WHERE id = 'hang-gliding' AND word = 'hang gliding' AND spelling_us IS NULL AND meaning_zh = 'phr. 悬挂滑翔';

UPDATE ielts_words SET word = 'first aid kit', normalized_word = 'first aid kit', spelling_us = NULL, meaning_zh = 'phr. 急救包', updated_at = CURRENT_TIMESTAMP
WHERE id = 'first-aid-kit' AND word = 'first-aid kit' AND spelling_us IS NULL AND meaning_zh = 'phr. 急救包';

UPDATE ielts_words SET word = 'Neolithic', normalized_word = 'neolithic', spelling_us = NULL, meaning_zh = 'adj. 新石器时代的', updated_at = CURRENT_TIMESTAMP
WHERE id = 'neolithic' AND word = 'neolithic' AND spelling_us IS NULL AND meaning_zh = 'adj. 新石器时代的';

UPDATE ielts_words SET word = 'Palaeolithic', normalized_word = 'palaeolithic', spelling_us = 'Paleolithic', meaning_zh = 'adj. 旧石器时代的', updated_at = CURRENT_TIMESTAMP
WHERE id = 'paleolithic' AND word = 'paleolithic' AND spelling_us IS NULL AND meaning_zh = 'adj. 旧石器时代的';

UPDATE ielts_words SET word = 'counsellor', normalized_word = 'counsellor', spelling_us = 'counselor', meaning_zh = 'n. 心理咨询师;顾问', updated_at = CURRENT_TIMESTAMP
WHERE id = 'counsellor' AND word = 'counsellor' AND spelling_us IS NULL AND meaning_zh = 'n. 心理咨询师;顾问';

UPDATE ielts_words SET word = 'judgement', normalized_word = 'judgement', spelling_us = 'judgment', meaning_zh = 'n. 判断', updated_at = CURRENT_TIMESTAMP
WHERE id = 'judgement' AND word = 'judgement' AND spelling_us IS NULL AND meaning_zh = 'n. 判断';

UPDATE ielts_words SET word = 'local speciality', normalized_word = 'local speciality', spelling_us = 'local specialty', meaning_zh = 'phr. 地方特产', updated_at = CURRENT_TIMESTAMP
WHERE id = 'local-speciality' AND word = 'local speciality' AND spelling_us IS NULL AND meaning_zh = 'phr. 地方特产';

UPDATE ielts_words SET word = 'marvellous', normalized_word = 'marvellous', spelling_us = 'marvelous', meaning_zh = 'adj. 了不起的', updated_at = CURRENT_TIMESTAMP
WHERE id = 'marvellous' AND word = 'marvellous' AND spelling_us IS NULL AND meaning_zh = 'adj. 了不起的';

UPDATE ielts_words SET word = 'millimetre', normalized_word = 'millimetre', spelling_us = 'millimeter', meaning_zh = 'n. 毫米', updated_at = CURRENT_TIMESTAMP
WHERE id = 'millimetre' AND word = 'millimetre' AND spelling_us IS NULL AND meaning_zh = 'n. 毫米';

UPDATE ielts_words SET word = 'moustache', normalized_word = 'moustache', spelling_us = 'mustache', meaning_zh = 'n. 小胡子', updated_at = CURRENT_TIMESTAMP
WHERE id = 'moustache' AND word = 'moustache' AND spelling_us IS NULL AND meaning_zh = 'n. 小胡子';

UPDATE ielts_words SET word = 'savoury', normalized_word = 'savoury', spelling_us = 'savory', meaning_zh = 'adj. 咸鲜的', updated_at = CURRENT_TIMESTAMP
WHERE id = 'savoury' AND word = 'savoury' AND spelling_us IS NULL AND meaning_zh = 'adj. 咸鲜的';

UPDATE ielts_pronunciations SET phonetic = '/ˌbestˈselə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'best-seller-uk' AND phonetic = '/best ˈselə/';

UPDATE ielts_pronunciations SET phonetic = '/ˌbestˈselɚ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'best-seller-us' AND phonetic = '/best ˈselɚ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpeɪslɪp/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'pay-slip-uk' AND phonetic = '/peɪ slɪp/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpeɪslɪp/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'pay-slip-us' AND phonetic = '/peɪ slɪp/';

UPDATE ielts_pronunciations SET phonetic = '/ˈnəʊtɪsbɔːd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'notice-board-uk' AND phonetic = '/ˈnəʊtɪs bɔːd/';

UPDATE ielts_pronunciations SET phonetic = '/ˈnoʊtəsbɔːrd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'notice-board-us' AND phonetic = '/ˈnoʊtəs bɔːrd/';

UPDATE ielts_examples SET sentence_en = 'Her first novel became a bestseller in more than twenty countries.', sentence_zh = '她的第一部小说在二十多个国家成为畅销书。', target = 'bestseller', updated_at = CURRENT_TIMESTAMP
WHERE id = 'best-seller-1' AND sentence_en = 'Her first novel became a best-seller in more than twenty countries.';

UPDATE ielts_examples SET sentence_en = 'An empty nester may have more time to travel and take up new hobbies.', sentence_zh = '空巢者可能有更多时间旅行和培养新爱好。', target = 'empty nester', updated_at = CURRENT_TIMESTAMP
WHERE id = 'empty-nester-1' AND sentence_en = 'An empty-nester may have more time to travel and take up new hobbies.';

UPDATE ielts_examples SET sentence_en = 'The exam timetable will be put on the noticeboard outside the office.', sentence_zh = '考试时间表会贴在办公室外的布告栏上。', target = 'noticeboard', updated_at = CURRENT_TIMESTAMP
WHERE id = 'notice-board-1' AND sentence_en = 'The exam timetable will be put on the notice board outside the office.';

UPDATE ielts_examples SET sentence_en = 'Your payslip shows how much tax you''ve paid this month.', sentence_zh = '你的工资单显示了你这个月缴了多少税。', target = 'payslip', updated_at = CURRENT_TIMESTAMP
WHERE id = 'pay-slip-1' AND sentence_en = 'Your pay slip shows how much tax you''ve paid this month.';

UPDATE ielts_examples SET sentence_en = 'Palaeolithic people lived in small groups and made tools from stone.', sentence_zh = '旧石器时代的人小群体生活,用石头制作工具。', target = 'Palaeolithic', updated_at = CURRENT_TIMESTAMP
WHERE id = 'paleolithic-1' AND sentence_en = 'Paleolithic people lived in small groups and made tools from stone.';
