-- Top 100 public vocabulary proofreading v1.
--
-- Scope:
-- - Mark core fields, first-pass senses, and examples for Top 100 as reviewed.
-- - Correct learner-facing part-of-speech mismatches for common function words.
-- - Normalize selected US/UK IPA strings in core_vocabulary and pronunciation rows.
-- - Keep generated pronunciation audio quality_status unchanged; audio listening review is separate.

BEGIN TRANSACTION;

UPDATE core_vocabulary
SET reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE learning_priority <= 100;

UPDATE vocabulary_senses
SET reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id IN (
  SELECT id FROM core_vocabulary WHERE learning_priority <= 100
);

UPDATE vocabulary_examples
SET reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-100-proofread-v1'
WHERE vocabulary_id IN (
  SELECT id FROM core_vocabulary WHERE learning_priority <= 100
);

-- Core learner-facing correction: more
UPDATE core_vocabulary
SET primary_part_of_speech = 'determiner',
    meaning_zh = '更多的；更多',
    definition_en = 'a greater amount, number, or degree',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'more';

UPDATE vocabulary_senses
SET part_of_speech = 'determiner',
    meaning_zh = '更多的；更多',
    definition_en = 'a greater amount, number, or degree',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'more' AND sense_order = 1;

-- Core learner-facing correction: up
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '向上；起来；完全地',
    definition_en = 'toward a higher position, or into an active or complete state',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'up';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '向上；起来；完全地',
    definition_en = 'toward a higher position, or into an active or complete state',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'up' AND sense_order = 1;

-- Core learner-facing correction: out
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '出去；在外；出来',
    definition_en = 'away from the inside of a place or situation',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'out';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '出去；在外；出来',
    definition_en = 'away from the inside of a place or situation',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'out' AND sense_order = 1;

-- Core learner-facing correction: no
UPDATE core_vocabulary
SET primary_part_of_speech = 'determiner',
    meaning_zh = '没有；无；不',
    definition_en = 'not any; not one',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'no';

UPDATE vocabulary_senses
SET part_of_speech = 'determiner',
    meaning_zh = '没有；无；不',
    definition_en = 'not any; not one',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'no' AND sense_order = 1;

-- Core learner-facing correction: any
UPDATE core_vocabulary
SET primary_part_of_speech = 'determiner',
    meaning_zh = '任何；任一；一些',
    definition_en = 'one, some, or all, used when it does not matter which',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'any';

UPDATE vocabulary_senses
SET part_of_speech = 'determiner',
    meaning_zh = '任何；任一；一些',
    definition_en = 'one, some, or all, used when it does not matter which',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'any' AND sense_order = 1;

-- Core learner-facing correction: much
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '很；非常；许多',
    definition_en = 'to a great degree or by a large amount',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'much';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '很；非常；许多',
    definition_en = 'to a great degree or by a large amount',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'much' AND sense_order = 1;

-- Core learner-facing correction: back
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '回；返回；向后',
    definition_en = 'to or toward a previous place, state, or position',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'back';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '回；返回；向后',
    definition_en = 'to or toward a previous place, state, or position',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'back' AND sense_order = 1;

-- Core learner-facing correction: such
UPDATE core_vocabulary
SET primary_part_of_speech = 'determiner',
    meaning_zh = '这样的；如此的',
    definition_en = 'of this or that kind, or to such a degree',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'such';

UPDATE vocabulary_senses
SET part_of_speech = 'determiner',
    meaning_zh = '这样的；如此的',
    definition_en = 'of this or that kind, or to such a degree',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'such' AND sense_order = 1;

-- Core learner-facing correction: work
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '工作；劳动；任务；作品',
    definition_en = 'a job, task, activity, or effort done to achieve something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'work';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '工作；劳动；任务；作品',
    definition_en = 'a job, task, activity, or effort done to achieve something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'work' AND sense_order = 1;

-- Example correction: no
UPDATE vocabulary_examples
SET sentence_en = 'There is no time to wait.',
    sentence_zh = '没有时间等了。',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-100-proofread-v1'
WHERE vocabulary_id = 'no' AND example_order = 1;

-- Example correction: out
UPDATE vocabulary_examples
SET sentence_en = 'Please take the trash out.',
    sentence_zh = '请把垃圾拿出去。',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-100-proofread-v1'
WHERE vocabulary_id = 'out' AND example_order = 1;

-- Example correction: also
UPDATE vocabulary_examples
SET sentence_en = 'She also speaks English.',
    sentence_zh = '她也会说英语。',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-100-proofread-v1'
WHERE vocabulary_id = 'also' AND example_order = 1;

-- IPA normalization: be
UPDATE core_vocabulary
SET phonetic_us = '/biː, bɪ/',
    phonetic_uk = '/biː, bɪ/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'be';

UPDATE vocabulary_pronunciations
SET phonetic = '/biː, bɪ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'be' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/biː, bɪ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'be' AND accent = 'uk';

-- IPA normalization: to
UPDATE core_vocabulary
SET phonetic_us = '/tuː, tə/',
    phonetic_uk = '/tuː, tə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'to';

UPDATE vocabulary_pronunciations
SET phonetic = '/tuː, tə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'to' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/tuː, tə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'to' AND accent = 'uk';

-- IPA normalization: you
UPDATE core_vocabulary
SET phonetic_us = '/juː, jə/',
    phonetic_uk = '/juː, jə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'you';

UPDATE vocabulary_pronunciations
SET phonetic = '/juː, jə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'you' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/juː, jə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'you' AND accent = 'uk';

-- IPA normalization: he
UPDATE core_vocabulary
SET phonetic_us = '/hiː, i/',
    phonetic_uk = '/hiː, i/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'he';

UPDATE vocabulary_pronunciations
SET phonetic = '/hiː, i/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'he' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/hiː, i/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'he' AND accent = 'uk';

-- IPA normalization: we
UPDATE core_vocabulary
SET phonetic_us = '/wiː/',
    phonetic_uk = '/wiː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'we';

UPDATE vocabulary_pronunciations
SET phonetic = '/wiː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'we' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/wiː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'we' AND accent = 'uk';

-- IPA normalization: do
UPDATE core_vocabulary
SET phonetic_us = '/duː, də/',
    phonetic_uk = '/duː, də/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'do';

UPDATE vocabulary_pronunciations
SET phonetic = '/duː, də/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'do' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/duː, də/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'do' AND accent = 'uk';

-- IPA normalization: she
UPDATE core_vocabulary
SET phonetic_us = '/ʃiː/',
    phonetic_uk = '/ʃiː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'she';

UPDATE vocabulary_pronunciations
SET phonetic = '/ʃiː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'she' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ʃiː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'she' AND accent = 'uk';

-- IPA normalization: for
UPDATE core_vocabulary
SET phonetic_us = '/fɔːr, fər/',
    phonetic_uk = '/fɔː, fə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'for';

UPDATE vocabulary_pronunciations
SET phonetic = '/fɔːr, fər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'for' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/fɔː, fə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'for' AND accent = 'uk';

-- IPA normalization: or
UPDATE core_vocabulary
SET phonetic_us = '/ɔːr, ər/',
    phonetic_uk = '/ɔː, ə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'or';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɔːr, ər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'or' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɔː, ə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'or' AND accent = 'uk';

-- IPA normalization: all
UPDATE core_vocabulary
SET phonetic_us = '/ɔːl/',
    phonetic_uk = '/ɔːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'all';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɔːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'all' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɔːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'all' AND accent = 'uk';

-- IPA normalization: more
UPDATE core_vocabulary
SET phonetic_us = '/mɔːr/',
    phonetic_uk = '/mɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'more';

UPDATE vocabulary_pronunciations
SET phonetic = '/mɔːr/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'more' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/mɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'more' AND accent = 'uk';

-- IPA normalization: who
UPDATE core_vocabulary
SET phonetic_us = '/huː/',
    phonetic_uk = '/huː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'who';

UPDATE vocabulary_pronunciations
SET phonetic = '/huː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'who' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/huː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'who' AND accent = 'uk';

-- IPA normalization: see
UPDATE core_vocabulary
SET phonetic_us = '/siː/',
    phonetic_uk = '/siː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'see';

UPDATE vocabulary_pronunciations
SET phonetic = '/siː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'see' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/siː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'see' AND accent = 'uk';

-- IPA normalization: people
UPDATE core_vocabulary
SET phonetic_us = '/ˈpiːpəl/',
    phonetic_uk = '/ˈpiːpəl/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'people';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈpiːpəl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'people' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈpiːpəl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'people' AND accent = 'uk';

-- IPA normalization: need
UPDATE core_vocabulary
SET phonetic_us = '/niːd/',
    phonetic_uk = '/niːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'need';

UPDATE vocabulary_pronunciations
SET phonetic = '/niːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'need' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/niːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'need' AND accent = 'uk';

-- IPA normalization: use
UPDATE core_vocabulary
SET phonetic_us = '/juːz/',
    phonetic_uk = '/juːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'use';

UPDATE vocabulary_pronunciations
SET phonetic = '/juːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'use' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/juːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'use' AND accent = 'uk';

-- IPA normalization: new
UPDATE core_vocabulary
SET phonetic_us = '/nuː/',
    phonetic_uk = '/njuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'new';

UPDATE vocabulary_pronunciations
SET phonetic = '/nuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'new' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/njuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'new' AND accent = 'uk';

-- IPA normalization: there
UPDATE core_vocabulary
SET phonetic_us = '/ðer/',
    phonetic_uk = '/ðeə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'there';

UPDATE vocabulary_pronunciations
SET phonetic = '/ðer/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'there' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ðeə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'there' AND accent = 'uk';

-- IPA normalization: where
UPDATE core_vocabulary
SET phonetic_us = '/wer/',
    phonetic_uk = '/weə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'where';

UPDATE vocabulary_pronunciations
SET phonetic = '/wer/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'where' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/weə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'where' AND accent = 'uk';

-- IPA normalization: well
UPDATE core_vocabulary
SET phonetic_us = '/wel/',
    phonetic_uk = '/wel/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'well';

UPDATE vocabulary_pronunciations
SET phonetic = '/wel/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'well' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/wel/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'well' AND accent = 'uk';

-- IPA normalization: very
UPDATE core_vocabulary
SET phonetic_us = '/ˈveri/',
    phonetic_uk = '/ˈveri/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'very';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈveri/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'very' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈveri/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'very' AND accent = 'uk';

-- IPA normalization: any
UPDATE core_vocabulary
SET phonetic_us = '/ˈeni/',
    phonetic_uk = '/ˈeni/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'any';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈeni/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'any' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈeni/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'any' AND accent = 'uk';

-- IPA normalization: many
UPDATE core_vocabulary
SET phonetic_us = '/ˈmeni/',
    phonetic_uk = '/ˈmeni/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'many';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈmeni/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'many' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈmeni/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'many' AND accent = 'uk';

-- IPA normalization: work
UPDATE core_vocabulary
SET phonetic_us = '/wɝːk/',
    phonetic_uk = '/wɜːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'work';

UPDATE vocabulary_pronunciations
SET phonetic = '/wɝːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'work' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/wɜːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'work' AND accent = 'uk';

-- IPA normalization: first
UPDATE core_vocabulary
SET phonetic_us = '/fɝːst/',
    phonetic_uk = '/fɜːst/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'first';

UPDATE vocabulary_pronunciations
SET phonetic = '/fɝːst/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'first' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/fɜːst/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'first' AND accent = 'uk';

COMMIT;
