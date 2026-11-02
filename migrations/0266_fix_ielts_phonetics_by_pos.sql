-- IELTS phonetics audit, second pass: 14 readings, and 15 words split by part of speech (see docs/ielts-review/phonetics-audit-2026-11-02.md).
UPDATE ielts_pronunciations SET phonetic = '/səʊ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'sow-uk' AND phonetic = '/saʊ/';

UPDATE ielts_pronunciations SET phonetic = '/soʊ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'sow-us' AND phonetic = '/saʊ/';

UPDATE ielts_pronunciations SET phonetic = '/ˌʌndəˈlaɪn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'underline-uk' AND phonetic = '/ˈʌndəlaɪn/';

UPDATE ielts_pronunciations SET phonetic = '/ˌʌndɚˈlaɪn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'underline-us' AND phonetic = '/ˈʌndɚlaɪn/';

UPDATE ielts_pronunciations SET phonetic = '/ˌəʊvərˈestɪmeɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'overestimate-uk' AND phonetic = '/ˌəʊvəˈrestɪmət/';

UPDATE ielts_pronunciations SET phonetic = '/ˌriːˈjuːz/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'reuse-us' AND phonetic = '/rɪˈjuːs/';

UPDATE ielts_pronunciations SET phonetic = '/ˌhaɪdrəʊɪˈlektrɪk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'hydroelectric-uk' AND phonetic = '/ˌhaɪdrəʊˈlektrɪk/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɔːtəməbiːl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'automobile-uk' AND phonetic = '/ˈɔːtəməbɪəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɔːtəmoʊbiːl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'automobile-us' AND phonetic = '/ˈɔːtəmoʊbɪl/';

UPDATE ielts_pronunciations SET phonetic = '/aɪl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'aisle-uk' AND phonetic = '/aɪəl/';

UPDATE ielts_pronunciations SET phonetic = '/aɪl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'aisle-us' AND phonetic = '/aɪəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsoʊlli/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'solely-us' AND phonetic = '/ˈsoʊəli/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtemprəmənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'temperament-us' AND phonetic = '/ˈtempɚmənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈriəlɪzəm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'realism-us' AND phonetic = '/ˈriəlɪzm/';

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'compound-n-uk', 'compound', 'uk', 'n.', '/ˈkɒmpaʊnd/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/compound-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'compound-uk' AND phonetic = '/ˈkɒmpaʊnd/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'compound-adj-uk', 'compound', 'uk', 'adj.', '/ˈkɒmpaʊnd/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/compound-adj.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'compound-uk' AND phonetic = '/ˈkɒmpaʊnd/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'compound-v-uk', 'compound', 'uk', 'v.', '/kəmˈpaʊnd/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/compound-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'compound-uk' AND phonetic = '/ˈkɒmpaʊnd/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'compound-n-us', 'compound', 'us', 'n.', '/ˈkɑːmpaʊnd/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/compound-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'compound-us' AND phonetic = '/ˈkɑːmpaʊnd/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'compound-adj-us', 'compound', 'us', 'adj.', '/ˈkɑːmpaʊnd/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/compound-adj.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'compound-us' AND phonetic = '/ˈkɑːmpaʊnd/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'compound-v-us', 'compound', 'us', 'v.', '/kəmˈpaʊnd/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/compound-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'compound-us' AND phonetic = '/ˈkɑːmpaʊnd/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conduct-v-uk', 'conduct', 'uk', 'v.', '/kənˈdʌkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/conduct-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conduct-uk' AND phonetic = '/kənˈdʌkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conduct-n-uk', 'conduct', 'uk', 'n.', '/ˈkɒndʌkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/conduct-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conduct-uk' AND phonetic = '/kənˈdʌkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conduct-v-us', 'conduct', 'us', 'v.', '/kənˈdʌkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/conduct-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conduct-us' AND phonetic = '/kənˈdʌkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conduct-n-us', 'conduct', 'us', 'n.', '/ˈkɑːndʌkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/conduct-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conduct-us' AND phonetic = '/kənˈdʌkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conflict-n-uk', 'conflict', 'uk', 'n.', '/ˈkɒnflɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/conflict-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conflict-uk' AND phonetic = '/ˈkɒnflɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conflict-v-uk', 'conflict', 'uk', 'v.', '/kənˈflɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/conflict-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conflict-uk' AND phonetic = '/ˈkɒnflɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conflict-n-us', 'conflict', 'us', 'n.', '/ˈkɑːnflɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/conflict-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conflict-us' AND phonetic = '/ˈkɑːnflɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'conflict-v-us', 'conflict', 'us', 'v.', '/kənˈflɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/conflict-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'conflict-us' AND phonetic = '/ˈkɑːnflɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'content-adj-uk', 'content', 'uk', 'adj.', '/kənˈtent/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/content-adj.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'content-uk' AND phonetic = '/kənˈtent/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'content-n-uk', 'content', 'uk', 'n.', '/ˈkɒntent/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/content-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'content-uk' AND phonetic = '/kənˈtent/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'content-adj-us', 'content', 'us', 'adj.', '/kənˈtent/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/content-adj.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'content-us' AND phonetic = '/kənˈtent/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'content-n-us', 'content', 'us', 'n.', '/ˈkɑːntent/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/content-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'content-us' AND phonetic = '/kənˈtent/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'contract-n-uk', 'contract', 'uk', 'n.', '/ˈkɒntrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/contract-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'contract-uk' AND phonetic = '/ˈkɒntrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'contract-v-uk', 'contract', 'uk', 'v.', '/kənˈtrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/contract-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'contract-uk' AND phonetic = '/ˈkɒntrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'contract-n-us', 'contract', 'us', 'n.', '/ˈkɑːntrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/contract-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'contract-us' AND phonetic = '/ˈkɑːntrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'contract-v-us', 'contract', 'us', 'v.', '/kənˈtrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/contract-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'contract-us' AND phonetic = '/ˈkɑːntrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'convict-v-uk', 'convict', 'uk', 'v.', '/kənˈvɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/convict-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'convict-uk' AND phonetic = '/kənˈvɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'convict-n-uk', 'convict', 'uk', 'n.', '/ˈkɒnvɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/convict-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'convict-uk' AND phonetic = '/kənˈvɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'convict-v-us', 'convict', 'us', 'v.', '/kənˈvɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/convict-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'convict-us' AND phonetic = '/kənˈvɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'convict-n-us', 'convict', 'us', 'n.', '/ˈkɑːnvɪkt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/convict-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'convict-us' AND phonetic = '/kənˈvɪkt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'desert-n-uk', 'desert', 'uk', 'n.', '/ˈdezət/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/desert-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'desert-uk' AND phonetic = '/ˈdezət/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'desert-v-uk', 'desert', 'uk', 'v.', '/dɪˈzɜːt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/desert-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'desert-uk' AND phonetic = '/ˈdezət/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'desert-n-us', 'desert', 'us', 'n.', '/ˈdezɚt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/desert-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'desert-us' AND phonetic = '/ˈdezɚt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'desert-v-us', 'desert', 'us', 'v.', '/dɪˈzɝːt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/desert-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'desert-us' AND phonetic = '/ˈdezɚt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'experiment-n-uk', 'experiment', 'uk', 'n.', '/ɪkˈsperɪmənt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/experiment-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'experiment-uk' AND phonetic = '/ɪkˈsperɪmənt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'experiment-v-uk', 'experiment', 'uk', 'v.', '/ɪkˈsperɪment/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/experiment-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'experiment-uk' AND phonetic = '/ɪkˈsperɪmənt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'experiment-n-us', 'experiment', 'us', 'n.', '/ɪkˈsperəmənt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/experiment-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'experiment-us' AND phonetic = '/ɪkˈsperəmənt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'experiment-v-us', 'experiment', 'us', 'v.', '/ɪkˈsperəment/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/experiment-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'experiment-us' AND phonetic = '/ɪkˈsperəmənt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'exploit-v-uk', 'exploit', 'uk', 'v.', '/ɪkˈsplɔɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/exploit-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'exploit-uk' AND phonetic = '/ɪkˈsplɔɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'exploit-n-uk', 'exploit', 'uk', 'n.', '/ˈeksplɔɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/exploit-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'exploit-uk' AND phonetic = '/ɪkˈsplɔɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'exploit-v-us', 'exploit', 'us', 'v.', '/ɪkˈsplɔɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/exploit-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'exploit-us' AND phonetic = '/ɪkˈsplɔɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'exploit-n-us', 'exploit', 'us', 'n.', '/ˈeksplɔɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/exploit-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'exploit-us' AND phonetic = '/ɪkˈsplɔɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'extract-v-uk', 'extract', 'uk', 'v.', '/ɪkˈstrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/extract-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'extract-uk' AND phonetic = '/ɪkˈstrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'extract-n-uk', 'extract', 'uk', 'n.', '/ˈekstrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/extract-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'extract-uk' AND phonetic = '/ɪkˈstrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'extract-v-us', 'extract', 'us', 'v.', '/ɪkˈstrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/extract-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'extract-us' AND phonetic = '/ɪkˈstrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'extract-n-us', 'extract', 'us', 'n.', '/ˈekstrækt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/extract-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'extract-us' AND phonetic = '/ɪkˈstrækt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'implement-v-uk', 'implement', 'uk', 'v.', '/ˈɪmplɪment/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/implement-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'implement-uk' AND phonetic = '/ˈɪmplɪment/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'implement-n-uk', 'implement', 'uk', 'n.', '/ˈɪmplɪmənt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/implement-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'implement-uk' AND phonetic = '/ˈɪmplɪment/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'implement-v-us', 'implement', 'us', 'v.', '/ˈɪmpləment/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/implement-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'implement-us' AND phonetic = '/ˈɪmpləment/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'implement-n-us', 'implement', 'us', 'n.', '/ˈɪmpləmənt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/implement-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'implement-us' AND phonetic = '/ˈɪmpləment/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'project-n-uk', 'project', 'uk', 'n.', '/ˈprɒdʒekt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/project-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'project-uk' AND phonetic = '/ˈprɒdʒekt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'project-v-uk', 'project', 'uk', 'v.', '/prəˈdʒekt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/project-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'project-uk' AND phonetic = '/ˈprɒdʒekt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'project-n-us', 'project', 'us', 'n.', '/ˈprɑːdʒekt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/project-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'project-us' AND phonetic = '/ˈprɑːdʒekt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'project-v-us', 'project', 'us', 'v.', '/prəˈdʒekt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/project-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'project-us' AND phonetic = '/ˈprɑːdʒekt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'separate-v-uk', 'separate', 'uk', 'v.', '/ˈsepəreɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/separate-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'separate-uk' AND phonetic = '/ˈsepəreɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'separate-adj-uk', 'separate', 'uk', 'adj.', '/ˈseprət/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/separate-adj.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'separate-uk' AND phonetic = '/ˈsepəreɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'separate-v-us', 'separate', 'us', 'v.', '/ˈsepəreɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/separate-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'separate-us' AND phonetic = '/ˈsepəreɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'separate-adj-us', 'separate', 'us', 'adj.', '/ˈseprət/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/separate-adj.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'separate-us' AND phonetic = '/ˈsepəreɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'transport-n-uk', 'transport', 'uk', 'n.', '/ˈtrænspɔːt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/transport-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'transport-uk' AND phonetic = '/trænˈspɔːt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'transport-v-uk', 'transport', 'uk', 'v.', '/trænˈspɔːt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/transport-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'transport-uk' AND phonetic = '/trænˈspɔːt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'transport-n-us', 'transport', 'us', 'n.', '/ˈtrænspɔːrt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/transport-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'transport-us' AND phonetic = '/trænˈspɔːrt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'transport-v-us', 'transport', 'us', 'v.', '/trænˈspɔːrt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/transport-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'transport-us' AND phonetic = '/trænˈspɔːrt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'update-v-uk', 'update', 'uk', 'v.', '/ˌʌpˈdeɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/update-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'update-uk' AND phonetic = '/ˌʌpˈdeɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'update-n-uk', 'update', 'uk', 'n.', '/ˈʌpdeɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/uk/update-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'update-uk' AND phonetic = '/ˌʌpˈdeɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'update-v-us', 'update', 'us', 'v.', '/ˌʌpˈdeɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/update-v.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'update-us' AND phonetic = '/ˌʌpˈdeɪt/');

INSERT INTO ielts_pronunciations (id, word_id, accent, pos, phonetic, audio_url)
SELECT 'update-n-us', 'update', 'us', 'n.', '/ˈʌpdeɪt/', 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/us/update-n.m4a'
WHERE EXISTS (SELECT 1 FROM ielts_pronunciations WHERE id = 'update-us' AND phonetic = '/ˌʌpˈdeɪt/');

DELETE FROM ielts_pronunciations WHERE id = 'compound-uk' AND phonetic = '/ˈkɒmpaʊnd/';

DELETE FROM ielts_pronunciations WHERE id = 'compound-us' AND phonetic = '/ˈkɑːmpaʊnd/';

DELETE FROM ielts_pronunciations WHERE id = 'conduct-uk' AND phonetic = '/kənˈdʌkt/';

DELETE FROM ielts_pronunciations WHERE id = 'conduct-us' AND phonetic = '/kənˈdʌkt/';

DELETE FROM ielts_pronunciations WHERE id = 'conflict-uk' AND phonetic = '/ˈkɒnflɪkt/';

DELETE FROM ielts_pronunciations WHERE id = 'conflict-us' AND phonetic = '/ˈkɑːnflɪkt/';

DELETE FROM ielts_pronunciations WHERE id = 'content-uk' AND phonetic = '/kənˈtent/';

DELETE FROM ielts_pronunciations WHERE id = 'content-us' AND phonetic = '/kənˈtent/';

DELETE FROM ielts_pronunciations WHERE id = 'contract-uk' AND phonetic = '/ˈkɒntrækt/';

DELETE FROM ielts_pronunciations WHERE id = 'contract-us' AND phonetic = '/ˈkɑːntrækt/';

DELETE FROM ielts_pronunciations WHERE id = 'convict-uk' AND phonetic = '/kənˈvɪkt/';

DELETE FROM ielts_pronunciations WHERE id = 'convict-us' AND phonetic = '/kənˈvɪkt/';

DELETE FROM ielts_pronunciations WHERE id = 'desert-uk' AND phonetic = '/ˈdezət/';

DELETE FROM ielts_pronunciations WHERE id = 'desert-us' AND phonetic = '/ˈdezɚt/';

DELETE FROM ielts_pronunciations WHERE id = 'experiment-uk' AND phonetic = '/ɪkˈsperɪmənt/';

DELETE FROM ielts_pronunciations WHERE id = 'experiment-us' AND phonetic = '/ɪkˈsperəmənt/';

DELETE FROM ielts_pronunciations WHERE id = 'exploit-uk' AND phonetic = '/ɪkˈsplɔɪt/';

DELETE FROM ielts_pronunciations WHERE id = 'exploit-us' AND phonetic = '/ɪkˈsplɔɪt/';

DELETE FROM ielts_pronunciations WHERE id = 'extract-uk' AND phonetic = '/ɪkˈstrækt/';

DELETE FROM ielts_pronunciations WHERE id = 'extract-us' AND phonetic = '/ɪkˈstrækt/';

DELETE FROM ielts_pronunciations WHERE id = 'implement-uk' AND phonetic = '/ˈɪmplɪment/';

DELETE FROM ielts_pronunciations WHERE id = 'implement-us' AND phonetic = '/ˈɪmpləment/';

DELETE FROM ielts_pronunciations WHERE id = 'project-uk' AND phonetic = '/ˈprɒdʒekt/';

DELETE FROM ielts_pronunciations WHERE id = 'project-us' AND phonetic = '/ˈprɑːdʒekt/';

DELETE FROM ielts_pronunciations WHERE id = 'separate-uk' AND phonetic = '/ˈsepəreɪt/';

DELETE FROM ielts_pronunciations WHERE id = 'separate-us' AND phonetic = '/ˈsepəreɪt/';

DELETE FROM ielts_pronunciations WHERE id = 'transport-uk' AND phonetic = '/trænˈspɔːt/';

DELETE FROM ielts_pronunciations WHERE id = 'transport-us' AND phonetic = '/trænˈspɔːrt/';

DELETE FROM ielts_pronunciations WHERE id = 'update-uk' AND phonetic = '/ˌʌpˈdeɪt/';

DELETE FROM ielts_pronunciations WHERE id = 'update-us' AND phonetic = '/ˌʌpˈdeɪt/';
