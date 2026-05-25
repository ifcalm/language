-- Top 500 public vocabulary proofreading v1.
--
-- Scope:
-- - Mark core fields, first-pass senses, and examples for Top 101-500 as reviewed.
-- - Correct selected learner-facing POS, Chinese meanings, English definitions, and examples.
-- - Normalize selected obvious US/UK IPA strings in core_vocabulary and pronunciation rows.
-- - Keep generated pronunciation audio quality_status unchanged; audio listening review is separate.

UPDATE core_vocabulary
SET reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE learning_priority BETWEEN 101 AND 500;

UPDATE vocabulary_senses
SET usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id IN (
  SELECT id FROM core_vocabulary WHERE learning_priority BETWEEN 101 AND 500
);

UPDATE vocabulary_examples
SET reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-500-proofread-v1'
WHERE vocabulary_id IN (
  SELECT id FROM core_vocabulary WHERE learning_priority BETWEEN 101 AND 500
);

-- Core learner-facing correction: however
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '然而；不过；但是',
    definition_en = 'used to introduce a statement that contrasts with what was said before',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'however';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '然而；不过；但是',
    definition_en = 'used to introduce a statement that contrasts with what was said before',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'however' AND sense_order = 1;

-- Core learner-facing correction: open
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '打开的；开放的',
    definition_en = 'not closed, or available for people to enter or use',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'open';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '打开的；开放的',
    definition_en = 'not closed, or available for people to enter or use',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'open' AND sense_order = 1;

-- Core learner-facing correction: against
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '反对；逆着；靠着',
    definition_en = 'opposing someone or something, or touching something for support',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'against';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '反对；逆着；靠着',
    definition_en = 'opposing someone or something, or touching something for support',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'against' AND sense_order = 1;

-- Core learner-facing correction: second
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '第二的；其次的',
    definition_en = 'coming after the first in order',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'second';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '第二的；其次的',
    definition_en = 'coming after the first in order',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'second' AND sense_order = 1;

-- Core learner-facing correction: young
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '年幼的；年轻的',
    definition_en = 'not old, or at an early stage of life',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'young';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '年幼的；年轻的',
    definition_en = 'not old, or at an early stage of life',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'young' AND sense_order = 1;

-- Core learner-facing correction: less
UPDATE core_vocabulary
SET primary_part_of_speech = 'determiner',
    meaning_zh = '更少的；较少的',
    definition_en = 'a smaller amount or degree',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'less';

UPDATE vocabulary_senses
SET part_of_speech = 'determiner',
    meaning_zh = '更少的；较少的',
    definition_en = 'a smaller amount or degree',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'less' AND sense_order = 1;

-- Core learner-facing correction: rather
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '相当；颇；宁愿',
    definition_en = 'fairly, or more preferably',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'rather';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '相当；颇；宁愿',
    definition_en = 'fairly, or more preferably',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'rather' AND sense_order = 1;

-- Core learner-facing correction: view
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '视野；景色；看法',
    definition_en = 'what you can see, or an opinion about something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'view';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '视野；景色；看法',
    definition_en = 'what you can see, or an opinion about something',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'view' AND sense_order = 1;

-- Core learner-facing correction: human
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '人；人类',
    definition_en = 'a person; a member of the human species',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'human';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '人；人类',
    definition_en = 'a person; a member of the human species',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'human' AND sense_order = 1;

-- Core learner-facing correction: situation
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '情况；处境',
    definition_en = 'the conditions or facts at a particular time',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'situation';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '情况；处境',
    definition_en = 'the conditions or facts at a particular time',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'situation' AND sense_order = 1;

-- Core learner-facing correction: condition
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '状况；条件',
    definition_en = 'the state of something, or something required before something else happens',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'condition';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '状况；条件',
    definition_en = 'the state of something, or something required before something else happens',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'condition' AND sense_order = 1;

-- Core learner-facing correction: care
UPDATE core_vocabulary
SET primary_part_of_speech = 'verb',
    meaning_zh = '关心；照顾',
    definition_en = 'to feel concern or look after someone or something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'care';

UPDATE vocabulary_senses
SET part_of_speech = 'verb',
    meaning_zh = '关心；照顾',
    definition_en = 'to feel concern or look after someone or something',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'care' AND sense_order = 1;

-- Core learner-facing correction: force
UPDATE core_vocabulary
SET primary_part_of_speech = 'verb',
    meaning_zh = '强迫；迫使',
    definition_en = 'to make someone do something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'force';

UPDATE vocabulary_senses
SET part_of_speech = 'verb',
    meaning_zh = '强迫；迫使',
    definition_en = 'to make someone do something',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'force' AND sense_order = 1;

-- Core learner-facing correction: light
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '轻的；明亮的；浅色的',
    definition_en = 'not heavy, bright, or pale in color',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'light';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '轻的；明亮的；浅色的',
    definition_en = 'not heavy, bright, or pale in color',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'light' AND sense_order = 1;

-- Core learner-facing correction: real
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '真实的；实际的',
    definition_en = 'true, actual, and not imagined',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'real';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '真实的；实际的',
    definition_en = 'true, actual, and not imagined',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'real' AND sense_order = 1;

-- Core learner-facing correction: bear
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '熊',
    definition_en = 'a large strong wild animal',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'bear';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '熊',
    definition_en = 'a large strong wild animal',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'bear' AND sense_order = 1;

-- Core learner-facing correction: sense
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '意思；感觉；理解力',
    definition_en = 'a meaning, feeling, or ability to understand something',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'sense';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '意思；感觉；理解力',
    definition_en = 'a meaning, feeling, or ability to understand something',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'sense' AND sense_order = 1;

-- Core learner-facing correction: among
UPDATE core_vocabulary
SET primary_part_of_speech = 'preposition',
    meaning_zh = '在……之中；在……之间',
    definition_en = 'in or through the middle of a group',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'among';

UPDATE vocabulary_senses
SET part_of_speech = 'preposition',
    meaning_zh = '在……之中；在……之间',
    definition_en = 'in or through the middle of a group',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'among' AND sense_order = 1;

-- Core learner-facing correction: especially
UPDATE core_vocabulary
SET primary_part_of_speech = 'adverb',
    meaning_zh = '特别地；尤其',
    definition_en = 'more than usual or more than others',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'especially';

UPDATE vocabulary_senses
SET part_of_speech = 'adverb',
    meaning_zh = '特别地；尤其',
    definition_en = 'more than usual or more than others',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'especially' AND sense_order = 1;

-- Core learner-facing correction: strong
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '强壮的；强的；坚定的',
    definition_en = 'having power, force, or good ability',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'strong';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '强壮的；强的；坚定的',
    definition_en = 'having power, force, or good ability',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'strong' AND sense_order = 1;

-- Core learner-facing correction: particular
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '特定的；特别的',
    definition_en = 'a specific one, or special compared with others',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'particular';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '特定的；特别的',
    definition_en = 'a specific one, or special compared with others',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'particular' AND sense_order = 1;

-- Core learner-facing correction: step
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '步骤；一步；脚步',
    definition_en = 'one movement of your foot, or one action in a process',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'step';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '步骤；一步；脚步',
    definition_en = 'one movement of your foot, or one action in a process',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'step' AND sense_order = 1;

-- Core learner-facing correction: true
UPDATE core_vocabulary
SET primary_part_of_speech = 'adjective',
    meaning_zh = '真实的；真正的；确实的',
    definition_en = 'correct, real, or based on facts',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'true';

UPDATE vocabulary_senses
SET part_of_speech = 'adjective',
    meaning_zh = '真实的；真正的；确实的',
    definition_en = 'correct, real, or based on facts',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'true' AND sense_order = 1;

-- Core learner-facing correction: phone
UPDATE core_vocabulary
SET primary_part_of_speech = 'noun',
    meaning_zh = '电话；手机',
    definition_en = 'a device used to call or communicate with people',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'phone';

UPDATE vocabulary_senses
SET part_of_speech = 'noun',
    meaning_zh = '电话；手机',
    definition_en = 'a device used to call or communicate with people',
    usage_note = 'Self-authored learner sense; first-pass reviewed.',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'phone' AND sense_order = 1;

-- Example correction: sense
UPDATE vocabulary_examples
SET sentence_en = 'This word has more than one sense.',
    sentence_zh = '这个词有不止一个意思。',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-500-proofread-v1'
WHERE vocabulary_id = 'sense' AND example_order = 1;

-- Example correction: phone
UPDATE vocabulary_examples
SET sentence_en = 'My phone is on the table.',
    sentence_zh = '我的手机在桌子上。',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-500-proofread-v1'
WHERE vocabulary_id = 'phone' AND example_order = 1;

-- Example correction: customer
UPDATE vocabulary_examples
SET sentence_en = 'The customer asked for help.',
    sentence_zh = '那位顾客寻求帮助。',
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP,
    source_type = 'manual',
    source_ref = 'top-500-proofread-v1'
WHERE vocabulary_id = 'customer' AND example_order = 1;

-- IPA normalization: through
UPDATE core_vocabulary
SET phonetic_us = '/θruː/',
    phonetic_uk = '/θruː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'through';

UPDATE vocabulary_pronunciations
SET phonetic = '/θruː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'through' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/θruː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'through' AND accent = 'uk';

-- IPA normalization: between
UPDATE core_vocabulary
SET phonetic_us = '/bɪˈtwiːn/',
    phonetic_uk = '/bɪˈtwiːn/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'between';

UPDATE vocabulary_pronunciations
SET phonetic = '/bɪˈtwiːn/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'between' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/bɪˈtwiːn/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'between' AND accent = 'uk';

-- IPA normalization: feel
UPDATE core_vocabulary
SET phonetic_us = '/fiːl/',
    phonetic_uk = '/fiːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'feel';

UPDATE vocabulary_pronunciations
SET phonetic = '/fiːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'feel' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/fiːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'feel' AND accent = 'uk';

-- IPA normalization: too
UPDATE core_vocabulary
SET phonetic_us = '/tuː/',
    phonetic_uk = '/tuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'too';

UPDATE vocabulary_pronunciations
SET phonetic = '/tuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'too' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/tuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'too' AND accent = 'uk';

-- IPA normalization: leave
UPDATE core_vocabulary
SET phonetic_us = '/liːv/',
    phonetic_uk = '/liːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'leave';

UPDATE vocabulary_pronunciations
SET phonetic = '/liːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'leave' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/liːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'leave' AND accent = 'uk';

-- IPA normalization: meet
UPDATE core_vocabulary
SET phonetic_us = '/miːt/',
    phonetic_uk = '/miːt/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'meet';

UPDATE vocabulary_pronunciations
SET phonetic = '/miːt/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'meet' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/miːt/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'meet' AND accent = 'uk';

-- IPA normalization: each
UPDATE core_vocabulary
SET phonetic_us = '/iːtʃ/',
    phonetic_uk = '/iːtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'each';

UPDATE vocabulary_pronunciations
SET phonetic = '/iːtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'each' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/iːtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'each' AND accent = 'uk';

-- IPA normalization: school
UPDATE core_vocabulary
SET phonetic_us = '/skuːl/',
    phonetic_uk = '/skuːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'school';

UPDATE vocabulary_pronunciations
SET phonetic = '/skuːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'school' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/skuːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'school' AND accent = 'uk';

-- IPA normalization: week
UPDATE core_vocabulary
SET phonetic_us = '/wiːk/',
    phonetic_uk = '/wiːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'week';

UPDATE vocabulary_pronunciations
SET phonetic = '/wiːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'week' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/wiːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'week' AND accent = 'uk';

-- IPA normalization: include
UPDATE core_vocabulary
SET phonetic_us = '/ɪnˈkluːd/',
    phonetic_uk = '/ɪnˈkluːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'include';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɪnˈkluːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'include' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɪnˈkluːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'include' AND accent = 'uk';

-- IPA normalization: group
UPDATE core_vocabulary
SET phonetic_us = '/ɡruːp/',
    phonetic_uk = '/ɡruːp/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'group';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɡruːp/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'group' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɡruːp/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'group' AND accent = 'uk';

-- IPA normalization: seem
UPDATE core_vocabulary
SET phonetic_us = '/siːm/',
    phonetic_uk = '/siːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'seem';

UPDATE vocabulary_pronunciations
SET phonetic = '/siːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'seem' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/siːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'seem' AND accent = 'uk';

-- IPA normalization: keep
UPDATE core_vocabulary
SET phonetic_us = '/kiːp/',
    phonetic_uk = '/kiːp/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'keep';

UPDATE vocabulary_pronunciations
SET phonetic = '/kiːp/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'keep' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/kiːp/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'keep' AND accent = 'uk';

-- IPA normalization: move
UPDATE core_vocabulary
SET phonetic_us = '/muːv/',
    phonetic_uk = '/muːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'move';

UPDATE vocabulary_pronunciations
SET phonetic = '/muːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'move' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/muːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'move' AND accent = 'uk';

-- IPA normalization: believe
UPDATE core_vocabulary
SET phonetic_us = '/bɪˈliːv/',
    phonetic_uk = '/bɪˈliːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'believe';

UPDATE vocabulary_pronunciations
SET phonetic = '/bɪˈliːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'believe' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/bɪˈliːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'believe' AND accent = 'uk';

-- IPA normalization: increase
UPDATE core_vocabulary
SET phonetic_us = '/ɪnˈkriːs/',
    phonetic_uk = '/ɪnˈkriːs/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'increase';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɪnˈkriːs/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'increase' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ɪnˈkriːs/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'increase' AND accent = 'uk';

-- IPA normalization: lead
UPDATE core_vocabulary
SET phonetic_us = '/liːd/',
    phonetic_uk = '/liːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'lead';

UPDATE vocabulary_pronunciations
SET phonetic = '/liːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'lead' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/liːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'lead' AND accent = 'uk';

-- IPA normalization: student
UPDATE core_vocabulary
SET phonetic_us = '/ˈstuːdənt/',
    phonetic_uk = '/ˈstjuːdənt/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'student';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈstuːdənt/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'student' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈstjuːdənt/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'student' AND accent = 'uk';

-- IPA normalization: room
UPDATE core_vocabulary
SET phonetic_us = '/ruːm/',
    phonetic_uk = '/ruːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'room';

UPDATE vocabulary_pronunciations
SET phonetic = '/ruːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'room' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ruːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'room' AND accent = 'uk';

-- IPA normalization: reason
UPDATE core_vocabulary
SET phonetic_us = '/ˈriːzən/',
    phonetic_uk = '/ˈriːzən/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'reason';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈriːzən/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'reason' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈriːzən/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'reason' AND accent = 'uk';

-- IPA normalization: least
UPDATE core_vocabulary
SET phonetic_us = '/liːst/',
    phonetic_uk = '/liːst/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'least';

UPDATE vocabulary_pronunciations
SET phonetic = '/liːst/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'least' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/liːst/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'least' AND accent = 'uk';

-- IPA normalization: speak
UPDATE core_vocabulary
SET phonetic_us = '/spiːk/',
    phonetic_uk = '/spiːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'speak';

UPDATE vocabulary_pronunciations
SET phonetic = '/spiːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'speak' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/spiːk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'speak' AND accent = 'uk';

-- IPA normalization: view
UPDATE core_vocabulary
SET phonetic_us = '/vjuː/',
    phonetic_uk = '/vjuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'view';

UPDATE vocabulary_pronunciations
SET phonetic = '/vjuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'view' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/vjuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'view' AND accent = 'uk';

-- IPA normalization: lose
UPDATE core_vocabulary
SET phonetic_us = '/luːz/',
    phonetic_uk = '/luːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'lose';

UPDATE vocabulary_pronunciations
SET phonetic = '/luːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'lose' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/luːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'lose' AND accent = 'uk';

-- IPA normalization: continue
UPDATE core_vocabulary
SET phonetic_us = '/kənˈtɪnjuː/',
    phonetic_uk = '/kənˈtɪnjuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'continue';

UPDATE vocabulary_pronunciations
SET phonetic = '/kənˈtɪnjuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'continue' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/kənˈtɪnjuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'continue' AND accent = 'uk';

-- IPA normalization: deal
UPDATE core_vocabulary
SET phonetic_us = '/diːl/',
    phonetic_uk = '/diːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'deal';

UPDATE vocabulary_pronunciations
SET phonetic = '/diːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'deal' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/diːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'deal' AND accent = 'uk';

-- IPA normalization: soon
UPDATE core_vocabulary
SET phonetic_us = '/suːn/',
    phonetic_uk = '/suːn/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'soon';

UPDATE vocabulary_pronunciations
SET phonetic = '/suːn/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'soon' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/suːn/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'soon' AND accent = 'uk';

-- IPA normalization: center
UPDATE core_vocabulary
SET phonetic_us = '/ˈsentər/',
    phonetic_uk = '/ˈsentə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'center';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈsentər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'center' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈsentə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'center' AND accent = 'uk';

-- IPA normalization: value
UPDATE core_vocabulary
SET phonetic_us = '/ˈvæljuː/',
    phonetic_uk = '/ˈvæljuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'value';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈvæljuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'value' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈvæljuː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'value' AND accent = 'uk';

-- IPA normalization: real
UPDATE core_vocabulary
SET phonetic_us = '/ˈriːəl/',
    phonetic_uk = '/ˈrɪəl/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'real';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈriːəl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'real' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈrɪəl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'real' AND accent = 'uk';

-- IPA normalization: food
UPDATE core_vocabulary
SET phonetic_us = '/fuːd/',
    phonetic_uk = '/fuːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'food';

UPDATE vocabulary_pronunciations
SET phonetic = '/fuːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'food' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/fuːd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'food' AND accent = 'uk';

-- IPA normalization: future
UPDATE core_vocabulary
SET phonetic_us = '/ˈfjuːtʃər/',
    phonetic_uk = '/ˈfjuːtʃə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'future';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈfjuːtʃər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'future' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈfjuːtʃə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'future' AND accent = 'uk';

-- IPA normalization: reach
UPDATE core_vocabulary
SET phonetic_us = '/riːtʃ/',
    phonetic_uk = '/riːtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'reach';

UPDATE vocabulary_pronunciations
SET phonetic = '/riːtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'reach' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/riːtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'reach' AND accent = 'uk';

-- IPA normalization: music
UPDATE core_vocabulary
SET phonetic_us = '/ˈmjuːzɪk/',
    phonetic_uk = '/ˈmjuːzɪk/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'music';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈmjuːzɪk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'music' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈmjuːzɪk/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'music' AND accent = 'uk';

-- IPA normalization: free
UPDATE core_vocabulary
SET phonetic_us = '/friː/',
    phonetic_uk = '/friː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'free';

UPDATE vocabulary_pronunciations
SET phonetic = '/friː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'free' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/friː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'free' AND accent = 'uk';

-- IPA normalization: receive
UPDATE core_vocabulary
SET phonetic_us = '/rɪˈsiːv/',
    phonetic_uk = '/rɪˈsiːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'receive';

UPDATE vocabulary_pronunciations
SET phonetic = '/rɪˈsiːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'receive' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/rɪˈsiːv/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'receive' AND accent = 'uk';

-- IPA normalization: law
UPDATE core_vocabulary
SET phonetic_us = '/lɔː/',
    phonetic_uk = '/lɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'law';

UPDATE vocabulary_pronunciations
SET phonetic = '/lɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'law' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/lɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'law' AND accent = 'uk';

-- IPA normalization: team
UPDATE core_vocabulary
SET phonetic_us = '/tiːm/',
    phonetic_uk = '/tiːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'team';

UPDATE vocabulary_pronunciations
SET phonetic = '/tiːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'team' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/tiːm/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'team' AND accent = 'uk';

-- IPA normalization: easy
UPDATE core_vocabulary
SET phonetic_us = '/ˈiːzi/',
    phonetic_uk = '/ˈiːzi/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'easy';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈiːzi/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'easy' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈiːzi/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'easy' AND accent = 'uk';

-- IPA normalization: human
UPDATE core_vocabulary
SET phonetic_us = '/ˈhjuːmən/',
    phonetic_uk = '/ˈhjuːmən/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'human';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈhjuːmən/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'human' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈhjuːmən/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'human' AND accent = 'uk';

-- IPA normalization: computer
UPDATE core_vocabulary
SET phonetic_us = '/kəmˈpjuːtər/',
    phonetic_uk = '/kəmˈpjuːtə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'computer';

UPDATE vocabulary_pronunciations
SET phonetic = '/kəmˈpjuːtər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'computer' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/kəmˈpjuːtə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'computer' AND accent = 'uk';

-- IPA normalization: rule
UPDATE core_vocabulary
SET phonetic_us = '/ruːl/',
    phonetic_uk = '/ruːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'rule';

UPDATE vocabulary_pronunciations
SET phonetic = '/ruːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'rule' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ruːl/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'rule' AND accent = 'uk';

-- IPA normalization: agree
UPDATE core_vocabulary
SET phonetic_us = '/əˈɡriː/',
    phonetic_uk = '/əˈɡriː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'agree';

UPDATE vocabulary_pronunciations
SET phonetic = '/əˈɡriː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'agree' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/əˈɡriː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'agree' AND accent = 'uk';

-- IPA normalization: war
UPDATE core_vocabulary
SET phonetic_us = '/wɔːr/',
    phonetic_uk = '/wɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'war';

UPDATE vocabulary_pronunciations
SET phonetic = '/wɔːr/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'war' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/wɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'war' AND accent = 'uk';

-- IPA normalization: shop
UPDATE core_vocabulary
SET phonetic_us = '/ʃɑːp/',
    phonetic_uk = '/ʃɒp/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'shop';

UPDATE vocabulary_pronunciations
SET phonetic = '/ʃɑːp/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'shop' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ʃɒp/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'shop' AND accent = 'uk';

-- IPA normalization: major
UPDATE core_vocabulary
SET phonetic_us = '/ˈmeɪdʒər/',
    phonetic_uk = '/ˈmeɪdʒə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'major';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈmeɪdʒər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'major' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈmeɪdʒə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'major' AND accent = 'uk';

-- IPA normalization: choose
UPDATE core_vocabulary
SET phonetic_us = '/tʃuːz/',
    phonetic_uk = '/tʃuːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'choose';

UPDATE vocabulary_pronunciations
SET phonetic = '/tʃuːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'choose' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/tʃuːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'choose' AND accent = 'uk';

-- IPA normalization: father
UPDATE core_vocabulary
SET phonetic_us = '/ˈfɑːðər/',
    phonetic_uk = '/ˈfɑːðə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'father';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈfɑːðər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'father' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈfɑːðə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'father' AND accent = 'uk';

-- IPA normalization: forward
UPDATE core_vocabulary
SET phonetic_us = '/ˈfɔːrwərd/',
    phonetic_uk = '/ˈfɔːwəd/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'forward';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈfɔːrwərd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'forward' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈfɔːwəd/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'forward' AND accent = 'uk';

-- IPA normalization: bear
UPDATE core_vocabulary
SET phonetic_us = '/ber/',
    phonetic_uk = '/beə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'bear';

UPDATE vocabulary_pronunciations
SET phonetic = '/ber/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'bear' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/beə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'bear' AND accent = 'uk';

-- IPA normalization: please
UPDATE core_vocabulary
SET phonetic_us = '/pliːz/',
    phonetic_uk = '/pliːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'please';

UPDATE vocabulary_pronunciations
SET phonetic = '/pliːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'please' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/pliːz/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'please' AND accent = 'uk';

-- IPA normalization: eat
UPDATE core_vocabulary
SET phonetic_us = '/iːt/',
    phonetic_uk = '/iːt/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'eat';

UPDATE vocabulary_pronunciations
SET phonetic = '/iːt/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'eat' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/iːt/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'eat' AND accent = 'uk';

-- IPA normalization: draw
UPDATE core_vocabulary
SET phonetic_us = '/drɔː/',
    phonetic_uk = '/drɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'draw';

UPDATE vocabulary_pronunciations
SET phonetic = '/drɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'draw' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/drɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'draw' AND accent = 'uk';

-- IPA normalization: door
UPDATE core_vocabulary
SET phonetic_us = '/dɔːr/',
    phonetic_uk = '/dɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'door';

UPDATE vocabulary_pronunciations
SET phonetic = '/dɔːr/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'door' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/dɔː/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'door' AND accent = 'uk';

-- IPA normalization: approach
UPDATE core_vocabulary
SET phonetic_us = '/əˈproʊtʃ/',
    phonetic_uk = '/əˈprəʊtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'approach';

UPDATE vocabulary_pronunciations
SET phonetic = '/əˈproʊtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'approach' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/əˈprəʊtʃ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'approach' AND accent = 'uk';

-- IPA normalization: teacher
UPDATE core_vocabulary
SET phonetic_us = '/ˈtiːtʃər/',
    phonetic_uk = '/ˈtiːtʃə/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'teacher';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈtiːtʃər/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'teacher' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/ˈtiːtʃə/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'teacher' AND accent = 'uk';

-- IPA normalization: charge
UPDATE core_vocabulary
SET phonetic_us = '/tʃɑːrdʒ/',
    phonetic_uk = '/tʃɑːdʒ/',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'charge';

UPDATE vocabulary_pronunciations
SET phonetic = '/tʃɑːrdʒ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'charge' AND accent = 'us';

UPDATE vocabulary_pronunciations
SET phonetic = '/tʃɑːdʒ/',
    updated_at = CURRENT_TIMESTAMP
WHERE vocabulary_id = 'charge' AND accent = 'uk';
