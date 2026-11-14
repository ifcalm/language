-- Checked the 300 new IELTS entries against ODE and NOAD: painstaking is pains + taking, so /z/; patriotism takes the first British reading /peɪ/.
UPDATE ielts_pronunciations SET phonetic = '/ˈpeɪnzteɪkɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'painstaking-uk' AND phonetic = '/ˈpeɪnsteɪkɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpeɪnzteɪkɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'painstaking-us' AND phonetic = '/ˈpeɪnsteɪkɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpeɪtriətɪzəm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'patriotism-uk' AND phonetic = '/ˈpætriətɪzəm/';
