-- 25 IELTS readings of two-syllable words had no stress mark (bias, client, diet, trial, tyre ...); five US ones also lacked the long vowel or used a reduced vowel their UK reading and Cambridge do not (fluent, fuel, truant, sewage).
UPDATE ielts_pronunciations SET phonetic = '/ˈbaɪəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bias-uk' AND phonetic = '/baɪəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈbaɪəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bias-us' AND phonetic = '/baɪəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈbaɪəst/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'biased-uk' AND phonetic = '/baɪəst/';

UPDATE ielts_pronunciations SET phonetic = '/ˈbaɪəst/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'biased-us' AND phonetic = '/baɪəst/';

UPDATE ielts_pronunciations SET phonetic = '/ˈbaʊəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bowel-uk' AND phonetic = '/baʊəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈbaʊəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bowel-us' AND phonetic = '/baʊəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkwaɪə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'choir-uk' AND phonetic = '/kwaɪə/';

UPDATE ielts_pronunciations SET phonetic = '/ˈklaɪənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'client-uk' AND phonetic = '/klaɪənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈklaɪənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'client-us' AND phonetic = '/klaɪənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdaɪət/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'diet-uk' AND phonetic = '/daɪət/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdaɪət/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'diet-us' AND phonetic = '/daɪət/';

UPDATE ielts_pronunciations SET phonetic = '/ˈfluːənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'fluent-us' AND phonetic = '/fluənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈfjuːəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'fuel-us' AND phonetic = '/fjuəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈaɪən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'iron-uk' AND phonetic = '/aɪən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈraɪət/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'riot-uk' AND phonetic = '/raɪət/';

UPDATE ielts_pronunciations SET phonetic = '/ˈraɪət/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'riot-us' AND phonetic = '/raɪət/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsuːɪdʒ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'sewage-us' AND phonetic = '/suədʒ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈspaɪə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'spire-uk' AND phonetic = '/spaɪə/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtraɪəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'trial-uk' AND phonetic = '/traɪəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtraɪəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'trial-us' AND phonetic = '/traɪəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtraɪəmf/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'triumph-us' AND phonetic = '/traɪəmf/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtruːənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'truant-us' AND phonetic = '/truənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtaɪə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tyre-uk' AND phonetic = '/taɪə/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvaʊəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'vowel-uk' AND phonetic = '/vaʊəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvaʊəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'vowel-us' AND phonetic = '/vaʊəl/';
