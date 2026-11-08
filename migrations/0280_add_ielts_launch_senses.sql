-- IELTS meaning review: 1 corrections (see docs/ielts-review/meaning-fixes-0280.md).
UPDATE ielts_words SET meaning_zh = 'v. 发起,推出;发射 n. 发射;发起,推出', updated_at = CURRENT_TIMESTAMP
WHERE id = 'launch' AND meaning_zh = 'v. 发起,推出 n. 发射';
