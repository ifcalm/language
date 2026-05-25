-- Top 3000 remaining public vocabulary proofreading v1.
--
-- Scope:
-- - Mark Top 501-3000 core fields, first-pass senses, and examples as first-pass reviewed.
-- - Backfill Top 1001-3000 pronunciation asset rows using existing R2 audio URLs.
-- - Correct selected obvious POS, Chinese meaning, English definition, and example issues.
-- - Normalize learner-facing Chinese punctuation in Top 501-3000 meanings.
-- - Keep generated pronunciation audio quality_status as generated; listening review is separate.

-- Chinese punctuation normalization: core_vocabulary
UPDATE core_vocabulary
SET meaning_zh = REPLACE(REPLACE(meaning_zh, '...', '……'), ';', '；'),
    updated_at = CURRENT_TIMESTAMP
WHERE learning_priority BETWEEN 501 AND 3000;

-- Chinese punctuation normalization: vocabulary_senses
UPDATE vocabulary_senses
SET meaning_zh = REPLACE(REPLACE(meaning_zh, '...', '……'), ';', '；'),
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id IN (SELECT id FROM core_vocabulary WHERE learning_priority BETWEEN 501 AND 3000);

-- Mark remaining public content as first-pass reviewed.
UPDATE core_vocabulary
SET reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE learning_priority BETWEEN 501 AND 3000;

UPDATE vocabulary_senses
SET usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id IN (
  SELECT id FROM core_vocabulary WHERE learning_priority BETWEEN 501 AND 3000
);

UPDATE vocabulary_examples
SET reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id IN (
  SELECT id FROM core_vocabulary WHERE learning_priority BETWEEN 501 AND 3000
);

-- Backfill US pronunciation asset rows for Top 1001-3000.
INSERT INTO vocabulary_pronunciations (
  id, vocabulary_id, word, normalized_word, accent, phonetic, audio_url,
  audio_source, sort_order, publish_status, locale, phonetic_source,
  phonetic_source_url, audio_provider, voice_id, audio_object_key,
  audio_format, license, attribution, quality_status, metadata_json, updated_at
)
SELECT
  id || '-us',
  id,
  word,
  normalized_word,
  'us',
  phonetic_us,
  'https://assets.english.ifcalm.org/pronunciations/us/' || LOWER(REPLACE(normalized_word, ' ', '-')) || '.m4a',
  'tts',
  10,
  'active',
  'en-US',
  'manual-curation-pending-review',
  '',
  'macos-say',
  'Samantha',
  'pronunciations/us/' || LOWER(REPLACE(normalized_word, ' ', '-')) || '.m4a',
  'aac',
  'Generated with macOS say as bootstrap pronunciation audio; review provider rights before broad public redistribution.',
  'Generated locally with macOS say voice Samantha.',
  'generated',
  '{"generator":"macos-say","source":"top-3000-pronunciation-backfill","note":"Bootstrap audio for initial learning flow; replaceable by a dedicated TTS provider later."}',
  CURRENT_TIMESTAMP
FROM core_vocabulary
WHERE learning_priority BETWEEN 1001 AND 3000
  AND publish_status = 'active'
ON CONFLICT(id) DO UPDATE SET
  word = excluded.word,
  normalized_word = excluded.normalized_word,
  phonetic = excluded.phonetic,
  audio_url = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_url), '') <> '' THEN vocabulary_pronunciations.audio_url ELSE excluded.audio_url END,
  audio_source = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_source), '') <> '' AND vocabulary_pronunciations.audio_source <> 'none' THEN vocabulary_pronunciations.audio_source ELSE excluded.audio_source END,
  sort_order = excluded.sort_order,
  publish_status = excluded.publish_status,
  locale = excluded.locale,
  phonetic_source = excluded.phonetic_source,
  audio_provider = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_provider), '') <> '' THEN vocabulary_pronunciations.audio_provider ELSE excluded.audio_provider END,
  voice_id = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.voice_id), '') <> '' THEN vocabulary_pronunciations.voice_id ELSE excluded.voice_id END,
  audio_object_key = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_object_key), '') <> '' THEN vocabulary_pronunciations.audio_object_key ELSE excluded.audio_object_key END,
  audio_format = excluded.audio_format,
  license = excluded.license,
  attribution = excluded.attribution,
  quality_status = CASE WHEN vocabulary_pronunciations.quality_status = 'reviewed' THEN 'reviewed' ELSE excluded.quality_status END,
  metadata_json = excluded.metadata_json,
  updated_at = CURRENT_TIMESTAMP;

-- Backfill UK pronunciation asset rows for Top 1001-3000.
INSERT INTO vocabulary_pronunciations (
  id, vocabulary_id, word, normalized_word, accent, phonetic, audio_url,
  audio_source, sort_order, publish_status, locale, phonetic_source,
  phonetic_source_url, audio_provider, voice_id, audio_object_key,
  audio_format, license, attribution, quality_status, metadata_json, updated_at
)
SELECT
  id || '-uk',
  id,
  word,
  normalized_word,
  'uk',
  phonetic_uk,
  'https://assets.english.ifcalm.org/pronunciations/uk/' || LOWER(REPLACE(normalized_word, ' ', '-')) || '.m4a',
  'tts',
  20,
  'active',
  'en-GB',
  'manual-curation-pending-review',
  '',
  'macos-say',
  'Daniel',
  'pronunciations/uk/' || LOWER(REPLACE(normalized_word, ' ', '-')) || '.m4a',
  'aac',
  'Generated with macOS say as bootstrap pronunciation audio; review provider rights before broad public redistribution.',
  'Generated locally with macOS say voice Daniel.',
  'generated',
  '{"generator":"macos-say","source":"top-3000-pronunciation-backfill","note":"Bootstrap audio for initial learning flow; replaceable by a dedicated TTS provider later."}',
  CURRENT_TIMESTAMP
FROM core_vocabulary
WHERE learning_priority BETWEEN 1001 AND 3000
  AND publish_status = 'active'
ON CONFLICT(id) DO UPDATE SET
  word = excluded.word,
  normalized_word = excluded.normalized_word,
  phonetic = excluded.phonetic,
  audio_url = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_url), '') <> '' THEN vocabulary_pronunciations.audio_url ELSE excluded.audio_url END,
  audio_source = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_source), '') <> '' AND vocabulary_pronunciations.audio_source <> 'none' THEN vocabulary_pronunciations.audio_source ELSE excluded.audio_source END,
  sort_order = excluded.sort_order,
  publish_status = excluded.publish_status,
  locale = excluded.locale,
  phonetic_source = excluded.phonetic_source,
  audio_provider = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_provider), '') <> '' THEN vocabulary_pronunciations.audio_provider ELSE excluded.audio_provider END,
  voice_id = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.voice_id), '') <> '' THEN vocabulary_pronunciations.voice_id ELSE excluded.voice_id END,
  audio_object_key = CASE WHEN COALESCE(TRIM(vocabulary_pronunciations.audio_object_key), '') <> '' THEN vocabulary_pronunciations.audio_object_key ELSE excluded.audio_object_key END,
  audio_format = excluded.audio_format,
  license = excluded.license,
  attribution = excluded.attribution,
  quality_status = CASE WHEN vocabulary_pronunciations.quality_status = 'reviewed' THEN 'reviewed' ELSE excluded.quality_status END,
  metadata_json = excluded.metadata_json,
  updated_at = CURRENT_TIMESTAMP;

-- Core learner-facing correction: upon
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '在……之上；在……之后立即',
    definition_en = 'on or immediately after something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'upon';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '在……之上；在……之后立即',
    definition_en = 'on or immediately after something',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'upon' AND sense_order = 1;

-- Core learner-facing correction: former
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '以前的；前者的',
    definition_en = 'existing or happening in the past',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'former';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '以前的；前者的',
    definition_en = 'existing or happening in the past',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'former' AND sense_order = 1;

-- Core learner-facing correction: whatever
UPDATE core_vocabulary
SET primary_part_of_speech = 'pronoun',
    meaning_zh = '任何事物；无论什么',
    definition_en = 'anything or everything, no matter what',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'whatever';

UPDATE vocabulary_senses
SET part_of_speech = 'pronoun',
    meaning_zh = '任何事物；无论什么',
    definition_en = 'anything or everything, no matter what',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'whatever' AND sense_order = 1;

-- Core learner-facing correction: throughout
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '遍及；贯穿始终',
    definition_en = 'in every part of a place or during all of a time',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'throughout';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '遍及；贯穿始终',
    definition_en = 'in every part of a place or during all of a time',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'throughout' AND sense_order = 1;

-- Core learner-facing correction: except
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '除……之外',
    definition_en = 'not including someone or something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'except';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '除……之外',
    definition_en = 'not including someone or something',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'except' AND sense_order = 1;

-- Core learner-facing correction: double
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '双倍的；双重的',
    definition_en = 'twice as much or having two parts',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'double';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '双倍的；双重的',
    definition_en = 'twice as much or having two parts',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'double' AND sense_order = 1;

-- Core learner-facing correction: nobody
UPDATE core_vocabulary
SET primary_part_of_speech = 'pronoun',
    meaning_zh = '没有人；谁也不',
    definition_en = 'no person',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'nobody';

UPDATE vocabulary_senses
SET part_of_speech = 'pronoun',
    meaning_zh = '没有人；谁也不',
    definition_en = 'no person',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'nobody' AND sense_order = 1;

-- Core learner-facing correction: plus
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '加；加上；另外',
    definition_en = 'used to show addition or an advantage',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'plus';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '加；加上；另外',
    definition_en = 'used to show addition or an advantage',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'plus' AND sense_order = 1;

-- Core learner-facing correction: whereas
UPDATE core_vocabulary
SET primary_part_of_speech = 'conjunction',
    meaning_zh = '然而；鉴于',
    definition_en = 'used to compare two facts or introduce a contrast',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'whereas';

UPDATE vocabulary_senses
SET part_of_speech = 'conjunction',
    meaning_zh = '然而；鉴于',
    definition_en = 'used to compare two facts or introduce a contrast',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'whereas' AND sense_order = 1;

-- Core learner-facing correction: onto
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '到……上；向……上',
    definition_en = 'to a position on a surface',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'onto';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '到……上；向……上',
    definition_en = 'to a position on a surface',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'onto' AND sense_order = 1;

-- Core learner-facing correction: anybody
UPDATE core_vocabulary
SET primary_part_of_speech = 'pronoun',
    meaning_zh = '任何人',
    definition_en = 'any person',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'anybody';

UPDATE vocabulary_senses
SET part_of_speech = 'pronoun',
    meaning_zh = '任何人',
    definition_en = 'any person',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'anybody' AND sense_order = 1;

-- Core learner-facing correction: ought
UPDATE core_vocabulary
SET primary_part_of_speech = 'modal',
    meaning_zh = '应该；应当',
    definition_en = 'used to say what is right or expected',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'ought';

UPDATE vocabulary_senses
SET part_of_speech = 'modal',
    meaning_zh = '应该；应当',
    definition_en = 'used to say what is right or expected',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'ought' AND sense_order = 1;

-- Core learner-facing correction: plenty
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '大量；充足',
    definition_en = 'a large enough amount',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'plenty';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '大量；充足',
    definition_en = 'a large enough amount',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'plenty' AND sense_order = 1;

-- Core learner-facing correction: till
UPDATE core_vocabulary
SET primary_part_of_speech = 'conjunction',
    meaning_zh = '直到',
    definition_en = 'until a particular time',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'till';

UPDATE vocabulary_senses
SET part_of_speech = 'conjunction',
    meaning_zh = '直到',
    definition_en = 'until a particular time',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'till' AND sense_order = 1;

-- Core learner-facing correction: ourselves
UPDATE core_vocabulary
SET primary_part_of_speech = 'pronoun',
    meaning_zh = '我们自己',
    definition_en = 'the reflexive form of we or us',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'ourselves';

UPDATE vocabulary_senses
SET part_of_speech = 'pronoun',
    meaning_zh = '我们自己',
    definition_en = 'the reflexive form of we or us',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'ourselves' AND sense_order = 1;

-- Core learner-facing correction: besides
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '除……之外；而且',
    definition_en = 'in addition to or apart from something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'besides';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '除……之外；而且',
    definition_en = 'in addition to or apart from something',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'besides' AND sense_order = 1;

-- Core learner-facing correction: via
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '经由；通过',
    definition_en = 'by way of or using something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'via';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '经由；通过',
    definition_en = 'by way of or using something',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'via' AND sense_order = 1;

-- Core learner-facing correction: beside
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '在……旁边',
    definition_en = 'next to or at the side of something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'beside';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '在……旁边',
    definition_en = 'next to or at the side of something',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'beside' AND sense_order = 1;

-- Core learner-facing correction: versus
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '与……相对；对抗',
    definition_en = 'against or compared with someone or something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'versus';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '与……相对；对抗',
    definition_en = 'against or compared with someone or something',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'versus' AND sense_order = 1;

-- Core learner-facing correction: whilst
UPDATE core_vocabulary
SET primary_part_of_speech = 'conjunction',
    meaning_zh = '当……的时候；虽然',
    definition_en = 'while; during the time that, or although',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'whilst';

UPDATE vocabulary_senses
SET part_of_speech = 'conjunction',
    meaning_zh = '当……的时候；虽然',
    definition_en = 'while; during the time that, or although',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'whilst' AND sense_order = 1;

-- Core learner-facing correction: alongside
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '在……旁边；与……一起',
    definition_en = 'next to or together with someone or something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'alongside';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '在……旁边；与……一起',
    definition_en = 'next to or together with someone or something',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'alongside' AND sense_order = 1;

-- Core learner-facing correction: collection
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '收藏；收集物',
    definition_en = 'a group of things gathered or kept together',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'collection';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '收藏；收集物',
    definition_en = 'a group of things gathered or kept together',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'collection' AND sense_order = 1;

-- Core learner-facing correction: relative
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '亲属；亲戚',
    definition_en = 'a family member',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'relative';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '亲属；亲戚',
    definition_en = 'a family member',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'relative' AND sense_order = 1;

-- Core learner-facing correction: alternative
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '可替代的选择；备选方案',
    definition_en = 'one of two or more possible choices',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'alternative';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '可替代的选择；备选方案',
    definition_en = 'one of two or more possible choices',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'alternative' AND sense_order = 1;

-- Core learner-facing correction: slowly
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '慢慢地',
    definition_en = 'at a low speed; not quickly',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'slowly';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '慢慢地',
    definition_en = 'at a low speed; not quickly',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'slowly' AND sense_order = 1;

-- Core learner-facing correction: register
UPDATE core_vocabulary
SET primary_part_of_speech = 'verb',
    meaning_zh = '登记；注册',
    definition_en = 'to record a name or information officially',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'register';

UPDATE vocabulary_senses
SET part_of_speech = 'verb',
    meaning_zh = '登记；注册',
    definition_en = 'to record a name or information officially',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'register' AND sense_order = 1;

-- Core learner-facing correction: frame
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '框架；画面；帧',
    definition_en = 'a structure, border, or single image in a film or video',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'frame';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '框架；画面；帧',
    definition_en = 'a structure, border, or single image in a film or video',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'frame' AND sense_order = 1;

-- Core learner-facing correction: bond
UPDATE core_vocabulary
SET primary_part_of_speech = 'verb',
    meaning_zh = '建立关系；凝聚',
    definition_en = 'to form a close connection with someone',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'bond';

UPDATE vocabulary_senses
SET part_of_speech = 'verb',
    meaning_zh = '建立关系；凝聚',
    definition_en = 'to form a close connection with someone',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'bond' AND sense_order = 1;

-- Core learner-facing correction: asset
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '资产；有价值的人或物',
    definition_en = 'a useful or valuable thing, person, or quality',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'asset';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '资产；有价值的人或物',
    definition_en = 'a useful or valuable thing, person, or quality',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'asset' AND sense_order = 1;

-- Core learner-facing correction: fortune
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '运气；财富',
    definition_en = 'luck, especially good luck, or a large amount of money',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'fortune';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '运气；财富',
    definition_en = 'luck, especially good luck, or a large amount of money',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'fortune' AND sense_order = 1;

-- Core learner-facing correction: gear
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '设备；装备；齿轮',
    definition_en = 'equipment, clothing, or a set of parts in a machine',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'gear';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '设备；装备；齿轮',
    definition_en = 'equipment, clothing, or a set of parts in a machine',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'gear' AND sense_order = 1;

-- Core learner-facing correction: wealthy
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '富有的',
    definition_en = 'having a lot of money or valuable things',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'wealthy';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '富有的',
    definition_en = 'having a lot of money or valuable things',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'wealthy' AND sense_order = 1;

-- Core learner-facing correction: experimental
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '实验性的',
    definition_en = 'relating to or based on experiment',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'experimental';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '实验性的',
    definition_en = 'relating to or based on experiment',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'experimental' AND sense_order = 1;

-- Core learner-facing correction: morphology
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '形态；形态学；词法',
    definition_en = 'the study or form of structure in biology or language',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'morphology';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '形态；形态学；词法',
    definition_en = 'the study or form of structure in biology or language',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'morphology' AND sense_order = 1;

-- Core learner-facing correction: axis
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '轴；轴线',
    definition_en = 'a real or imaginary line around which something turns or is arranged',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'axis';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '轴；轴线',
    definition_en = 'a real or imaginary line around which something turns or is arranged',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'axis' AND sense_order = 1;

-- Core learner-facing correction: online
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '在线的',
    definition_en = 'connected to or available through the internet',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'online';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '在线的',
    definition_en = 'connected to or available through the internet',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'online' AND sense_order = 1;

-- Core learner-facing correction: master
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '主要的；熟练的',
    definition_en = 'main, most important, or highly skilled',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'master';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '主要的；熟练的',
    definition_en = 'main, most important, or highly skilled',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'master' AND sense_order = 1;

-- Core learner-facing correction: folk
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '民间的；普通人的',
    definition_en = 'connected with ordinary people or traditional culture',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'folk';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '民间的；普通人的',
    definition_en = 'connected with ordinary people or traditional culture',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'folk' AND sense_order = 1;

-- Core learner-facing correction: ideal
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '理想的；完美的',
    definition_en = 'best or most suitable for a particular purpose',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'ideal';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '理想的；完美的',
    definition_en = 'best or most suitable for a particular purpose',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'ideal' AND sense_order = 1;

-- Core learner-facing correction: sharp
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '锋利的；敏锐的',
    definition_en = 'having a thin cutting edge, clear, or quick to notice things',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sharp';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '锋利的；敏锐的',
    definition_en = 'having a thin cutting edge, clear, or quick to notice things',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'sharp' AND sense_order = 1;

-- Core learner-facing correction: grand
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '宏伟的；重大的',
    definition_en = 'large, impressive, or important',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'grand';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '宏伟的；重大的',
    definition_en = 'large, impressive, or important',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'grand' AND sense_order = 1;

-- Core learner-facing correction: massive
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '巨大的；大量的',
    definition_en = 'very large, heavy, or serious',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'massive';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '巨大的；大量的',
    definition_en = 'very large, heavy, or serious',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'massive' AND sense_order = 1;

-- Core learner-facing correction: upper
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '较高的；上部的',
    definition_en = 'higher in position or level',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'upper';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '较高的；上部的',
    definition_en = 'higher in position or level',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'upper' AND sense_order = 1;

-- Core learner-facing correction: partial
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '部分的；偏袒的',
    definition_en = 'not complete, or unfairly supporting one side',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'partial';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '部分的；偏袒的',
    definition_en = 'not complete, or unfairly supporting one side',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'partial' AND sense_order = 1;

-- Core learner-facing correction: integral
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '不可或缺的；完整的',
    definition_en = 'necessary and important as part of a whole',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'integral';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '不可或缺的；完整的',
    definition_en = 'necessary and important as part of a whole',
    usage_note = 'Learner bootstrap sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'integral' AND sense_order = 1;

-- Example correction: alternative
UPDATE vocabulary_examples
SET sentence_en = 'We need an alternative plan.',
    sentence_zh = '我们需要一个备选方案。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'alternative' AND example_order = 1;

-- Example correction: frame
UPDATE vocabulary_examples
SET sentence_en = 'The frame around the picture is simple.',
    sentence_zh = '照片周围的相框很简单。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'frame' AND example_order = 1;

-- Example correction: bond
UPDATE vocabulary_examples
SET sentence_en = 'Shared work helped the team bond.',
    sentence_zh = '共同工作帮助团队建立联系。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'bond' AND example_order = 1;

-- Example correction: collection
UPDATE vocabulary_examples
SET sentence_en = 'Her collection of books is growing.',
    sentence_zh = '她收藏的书越来越多。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'collection' AND example_order = 1;

-- Example correction: relative
UPDATE vocabulary_examples
SET sentence_en = 'A relative came to visit us.',
    sentence_zh = '一位亲戚来看望我们。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'relative' AND example_order = 1;

-- Example correction: slowly
UPDATE vocabulary_examples
SET sentence_en = 'Please speak slowly.',
    sentence_zh = '请说慢一点。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'slowly' AND example_order = 1;

-- Example correction: register
UPDATE vocabulary_examples
SET sentence_en = 'You need to register before the class.',
    sentence_zh = '上课前你需要注册。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'register' AND example_order = 1;

-- Example correction: pregnant
UPDATE vocabulary_examples
SET sentence_en = 'She is pregnant with her first child.',
    sentence_zh = '她怀上了第一个孩子。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'pregnant' AND example_order = 1;

-- Example correction: fortune
UPDATE vocabulary_examples
SET sentence_en = 'Good fortune helped them succeed.',
    sentence_zh = '好运帮助他们成功。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'fortune' AND example_order = 1;

-- Example correction: gear
UPDATE vocabulary_examples
SET sentence_en = 'We packed our camping gear.',
    sentence_zh = '我们收拾好了露营装备。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'gear' AND example_order = 1;

-- Example correction: nobody
UPDATE vocabulary_examples
SET sentence_en = 'Nobody answered the phone.',
    sentence_zh = '没有人接电话。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'nobody' AND example_order = 1;

-- Example correction: till
UPDATE vocabulary_examples
SET sentence_en = 'Please wait till I come back.',
    sentence_zh = '请等到我回来。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'till' AND example_order = 1;

-- Example correction: ought
UPDATE vocabulary_examples
SET sentence_en = 'You ought to rest now.',
    sentence_zh = '你现在应该休息。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'ought' AND example_order = 1;

-- Example correction: whereas
UPDATE vocabulary_examples
SET sentence_en = 'I like tea, whereas she prefers coffee.',
    sentence_zh = '我喜欢茶，而她更喜欢咖啡。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'whereas' AND example_order = 1;

-- Example correction: onto
UPDATE vocabulary_examples
SET sentence_en = 'She stepped onto the bus.',
    sentence_zh = '她踏上了公交车。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'onto' AND example_order = 1;

-- Example correction: beside
UPDATE vocabulary_examples
SET sentence_en = 'The chair is beside the table.',
    sentence_zh = '椅子在桌子旁边。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'beside' AND example_order = 1;

-- Example correction: besides
UPDATE vocabulary_examples
SET sentence_en = 'Besides English, he studies Spanish.',
    sentence_zh = '除了英语，他还学习西班牙语。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'besides' AND example_order = 1;

-- Example correction: via
UPDATE vocabulary_examples
SET sentence_en = 'We sent the file via email.',
    sentence_zh = '我们通过电子邮件发送了文件。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'via' AND example_order = 1;

-- Example correction: versus
UPDATE vocabulary_examples
SET sentence_en = 'The game is red team versus blue team.',
    sentence_zh = '这场比赛是红队对蓝队。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'versus' AND example_order = 1;

-- Example correction: whilst
UPDATE vocabulary_examples
SET sentence_en = 'She listened whilst I explained.',
    sentence_zh = '我解释时她在听。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'whilst' AND example_order = 1;

-- Example correction: alongside
UPDATE vocabulary_examples
SET sentence_en = 'She worked alongside her friend.',
    sentence_zh = '她和朋友一起工作。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'alongside' AND example_order = 1;

-- Example correction: wealthy
UPDATE vocabulary_examples
SET sentence_en = 'The town became wealthy through trade.',
    sentence_zh = '这个小镇通过贸易变得富裕。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'wealthy' AND example_order = 1;

-- Example correction: experimental
UPDATE vocabulary_examples
SET sentence_en = 'The lab used an experimental method.',
    sentence_zh = '实验室使用了一种实验性方法。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'experimental' AND example_order = 1;

-- Example correction: morphology
UPDATE vocabulary_examples
SET sentence_en = 'Morphology helps us study word forms.',
    sentence_zh = '形态学帮助我们研究词形。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'morphology' AND example_order = 1;

-- Example correction: axis
UPDATE vocabulary_examples
SET sentence_en = 'The earth turns on its axis.',
    sentence_zh = '地球绕着地轴旋转。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'axis' AND example_order = 1;

-- Example correction: online
UPDATE vocabulary_examples
SET sentence_en = 'The meeting is online today.',
    sentence_zh = '今天的会议在线上进行。',
    source_type = 'manual',
    source_ref = 'top-3000-remaining-proofread-v1',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'online' AND example_order = 1;
