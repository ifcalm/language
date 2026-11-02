-- IELTS cross-check against ODE/NOAD, Dr.eye, WISDOM, Van Dale, Oxford Learner's and Cambridge: 2 spellings, 2 examples, 252 readings (see docs/ielts-review/crosscheck-2026-11-02.md).
UPDATE ielts_words SET word = 'lifespan', normalized_word = 'lifespan', meaning_zh = 'n. 寿命', updated_at = CURRENT_TIMESTAMP
WHERE id = 'life-span' AND word = 'life span' AND spelling_us IS NULL AND meaning_zh = 'phr. 寿命';

UPDATE ielts_words SET word = 'en suite', normalized_word = 'en suite', meaning_zh = 'adj. 带独立卫浴的', updated_at = CURRENT_TIMESTAMP
WHERE id = 'en-suite' AND word = 'en-suite' AND spelling_us IS NULL AND meaning_zh = 'adj. 带独立卫浴的';

UPDATE ielts_examples SET sentence_en = 'The average lifespan of a wild fox is only about three years.', target = 'lifespan', updated_at = CURRENT_TIMESTAMP
WHERE id = 'life-span-1' AND sentence_en = 'The average life-span of a wild fox is only about three years.';

UPDATE ielts_examples SET sentence_en = 'Every bedroom is en suite, so you won''t need to share a shower.', target = 'en suite', updated_at = CURRENT_TIMESTAMP
WHERE id = 'en-suite-1' AND sentence_en = 'Every bedroom is en-suite, so you won''t need to share a shower.';

UPDATE ielts_pronunciations SET phonetic = '/ˈæfluənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'affluent-uk' AND phonetic = '/ˈæfluːənt/';

UPDATE ielts_pronunciations SET phonetic = '/æmˈbɪɡjuəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'ambiguous-uk' AND phonetic = '/æmˈbɪɡjuːəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈænjuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'annual-uk' AND phonetic = '/ˈænjuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈænjuəl liːv/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'annual-leave-uk' AND phonetic = '/ˈænjuːəl liːv/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɑːdjuəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'arduous-uk' AND phonetic = '/ˈɑːdjuːəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɑːɡjuəbli/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'arguably-uk' AND phonetic = '/ˈɑːɡjuːəbli/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkæʒuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'casual-uk' AND phonetic = '/ˈkæʒuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkæʒuəlti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'casualty-uk' AND phonetic = '/ˈkæʒuːəlti/';

UPDATE ielts_pronunciations SET phonetic = '/kənˈspɪkjuəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'conspicuous-uk' AND phonetic = '/kənˈspɪkjuːəs/';

UPDATE ielts_pronunciations SET phonetic = '/dɪˈsɪdjuəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'deciduous-uk' AND phonetic = '/dɪˈsɪdjuːəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈestjuəri/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'estuary-uk' AND phonetic = '/ˈestjuːəri/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˈvækjueɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'evacuate-uk' AND phonetic = '/ɪˈvækjuːeɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˈvæljueɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'evaluate-uk' AND phonetic = '/ɪˈvæljuːeɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˈventʃuəli/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'eventually-uk' AND phonetic = '/ɪˈventʃuːəli/';

UPDATE ielts_pronunciations SET phonetic = '/ˈflʌktʃueɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'fluctuate-uk' AND phonetic = '/ˈflʌktʃuːeɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˌflʌktʃuˈeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'fluctuation-uk' AND phonetic = '/ˌflʌktʃuːˈeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdʒenjuɪn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'genuine-uk' AND phonetic = '/ˈdʒenjuːɪn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɡrædʒuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'gradual-uk' AND phonetic = '/ˈɡrædʒuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɪndɪˈvɪdʒuəlɪzəm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'individualism-uk' AND phonetic = '/ˌɪndɪˈvɪdʒuːəlɪzəm/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɪnfluəns/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'influence-uk' AND phonetic = '/ˈɪnfluːəns/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɪnfluˈenʃəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'influential-uk' AND phonetic = '/ˌɪnfluːˈenʃəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɪntəˈlektʃuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'intellectual-uk' AND phonetic = '/ˌɪntəˈlektʃuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɪntəˈlektʃuəl ˈprɒpəti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'intellectual-property-uk' AND phonetic = '/ˌɪntəˈlektʃuːəl ˈprɒpəti/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˈvæljuəbəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'invaluable-uk' AND phonetic = '/ɪnˈvæljuːəbəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈmænjuəl ˈleɪbə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'manual-labour-uk' AND phonetic = '/ˈmænjuːəl ˈleɪbə/';

UPDATE ielts_pronunciations SET phonetic = '/ˈmjuːtʃuəl ˌʌndəˈstændɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'mutual-understanding-uk' AND phonetic = '/ˈmjuːtʃuːəl ˌʌndəˈstændɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈmjuːtʃuəlɪzəm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'mutualism-uk' AND phonetic = '/ˈmjuːtʃuːəlɪzəm/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpʌŋktʃuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'punctual-uk' AND phonetic = '/ˈpʌŋktʃuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/rɪˈzɪdjuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'residual-uk' AND phonetic = '/rɪˈzɪdjuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈrɪtʃuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'ritual-uk' AND phonetic = '/ˈrɪtʃuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˌsekʃuˈælɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'sexuality-uk' AND phonetic = '/ˌsekʃuːˈælɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsɪtʃueɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'situate-uk' AND phonetic = '/ˈsɪtʃuːeɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈspɪrɪtʃuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'spiritual-uk' AND phonetic = '/ˈspɪrɪtʃuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˌʌndəˈɡrædjuət/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'undergraduate-uk' AND phonetic = '/ˌʌndəˈɡrædjuːət/';

UPDATE ielts_pronunciations SET phonetic = '/ʌnˈjuːʒuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unusual-uk' AND phonetic = '/ʌˈnjuːʒuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvæljuəbəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'valuable-uk' AND phonetic = '/ˈvæljuːəbəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvɜːtʃuəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'virtual-uk' AND phonetic = '/ˈvɜːtʃuːəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvɜːtʃuəl rɪˈælɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'virtual-reality-uk' AND phonetic = '/ˈvɜːtʃuːəl rɪˈælɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvɜːtʃuəli/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'virtually-uk' AND phonetic = '/ˈvɜːtʃuːəli/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvɪʒuəl eɪd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'visual-aid-uk' AND phonetic = '/ˈvɪʒuːəl eɪd/';

UPDATE ielts_pronunciations SET phonetic = '/ˌækjuˈzeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'accusation-uk' AND phonetic = '/ˌækjuːˈzeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌæmjəˈnɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'ammunition-uk' AND phonetic = '/ˌæmjuːˈnɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɑːɡjumənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'argument-uk' AND phonetic = '/ˈɑːɡjuːmənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˌkɒmpjuˈteɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'computation-uk' AND phonetic = '/ˌkɒmpjuːˈteɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/kənˈsekjətɪv/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'consecutive-uk' AND phonetic = '/kənˈsekjuːtɪv/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdepjuti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'deputy-uk' AND phonetic = '/ˈdepjuːti/';

UPDATE ielts_pronunciations SET phonetic = '/ˌdɒkjuˈmentri/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'documentary-uk' AND phonetic = '/ˌdɒkjuːˈmentəri/';

UPDATE ielts_pronunciations SET phonetic = '/ˌdɒkjumenˈteɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'documentation-uk' AND phonetic = '/ˌdɒkjuːmənˈteɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌedʒuˈkeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'education-uk' AND phonetic = '/ˌedʒuːˈkeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌedʒuˈkeɪʃənəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'educational-uk' AND phonetic = '/ˌedʒuːˈkeɪʃənəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈedʒukeɪtə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'educator-uk' AND phonetic = '/ˈedʒuːkeɪtə/';

UPDATE ielts_pronunciations SET phonetic = '/kəmˈpʌlsəri ˌedʒuˈkeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'compulsory-education-uk' AND phonetic = '/kəmˈpʌlsəri ˌedʒuːˈkeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈhaɪə ˌedʒuˈkeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'higher-education-uk' AND phonetic = '/ˈhaɪə ˌedʒuːˈkeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtɜːʃəri ˌedʒuˈkeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tertiary-education-uk' AND phonetic = '/ˈtɜːʃəri ˌedʒuːˈkeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌkəʊ ˌedʒuˈkeɪʃənəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'co-educational-uk' AND phonetic = '/kəʊ ˌedʒuːˈkeɪʃənəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɪnsjuˈleɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'insulation-uk' AND phonetic = '/ˌɪnsjuːˈleɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɪnsjuleɪtə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'insulator-uk' AND phonetic = '/ˈɪnsjuːleɪtə/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˈreɡjələ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'irregular-uk' AND phonetic = '/ɪˈreɡjuːlə/';

UPDATE ielts_pronunciations SET phonetic = '/ˌmænjuˈfæktʃə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'manufacture-uk' AND phonetic = '/ˌmænjuːˈfæktʃə/';

UPDATE ielts_pronunciations SET phonetic = '/ˌmænjuˈfæktʃərə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'manufacturer-uk' AND phonetic = '/ˌmænjuːˈfæktʃərə/';

UPDATE ielts_pronunciations SET phonetic = '/ˈmænjuskrɪpt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'manuscript-uk' AND phonetic = '/ˈmænjuːskrɪpt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈmɒnjumənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'monument-uk' AND phonetic = '/ˈmɒnjuːmənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpredʒədɪs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'prejudice-uk' AND phonetic = '/ˈpredʒuːdɪs/';

UPDATE ielts_pronunciations SET phonetic = '/ˌrefjuˈdʒiː/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'refugee-uk' AND phonetic = '/ˌrefjuːˈdʒiː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈreɡjuleɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'regulate-uk' AND phonetic = '/ˈreɡjuːleɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˌreɡjuˈleɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'regulation-uk' AND phonetic = '/ˌreɡjuːˈleɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌrepjuˈteɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'reputation-uk' AND phonetic = '/ˌrepjuːˈteɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌsɒljuˈbɪlɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'solubility-uk' AND phonetic = '/ˌsɒljuːˈbɪlɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsɒljəbəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'soluble-uk' AND phonetic = '/ˈsɒljuːbəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtrɪbjətri/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tributary-uk' AND phonetic = '/ˈtrɪbjuːtəri/';

UPDATE ielts_pronunciations SET phonetic = '/ˈmʌʃrʊm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'mushroom-uk' AND phonetic = '/ˈmʌʃruːm/';

UPDATE ielts_pronunciations SET phonetic = '/bjʊəˈrɒkrəsi/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bureaucracy-uk' AND phonetic = '/bjɔːˈrɒkrəsi/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkærɪkətʃʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'caricature-uk' AND phonetic = '/ˈkærɪkətʃɔː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkɒntʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'contour-uk' AND phonetic = '/ˈkɒntɔː/';

UPDATE ielts_pronunciations SET phonetic = '/kjʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'cure-uk' AND phonetic = '/kjɔː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkjʊəriəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'curious-uk' AND phonetic = '/ˈkjʊriəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdiːtʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'detour-uk' AND phonetic = '/ˈdiːtɔː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdjʊərəbəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'durable-uk' AND phonetic = '/ˈdjɔːrəbəl/';

UPDATE ielts_pronunciations SET phonetic = '/djuˈreɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'duration-uk' AND phonetic = '/djɔːˈreɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˈdjʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'endure-uk' AND phonetic = '/ɪnˈdjɔː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈfjʊəriəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'furious-uk' AND phonetic = '/ˈfjɔːriəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɡʊəmeɪ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'gourmet-uk' AND phonetic = '/ˈɡɔːmeɪ/';

UPDATE ielts_pronunciations SET phonetic = '/helθ ɪnˈʃʊərəns/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'health-insurance-uk' AND phonetic = '/helθ ɪnˈʃɔːrəns/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɪməˈtʃʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'immature-uk' AND phonetic = '/ˌɪməˈtʃɔː/';

UPDATE ielts_pronunciations SET phonetic = '/ɪmˈpjʊərɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'impurity-uk' AND phonetic = '/ɪmˈpjʊrɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˈʃʊərəns/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'insurance-uk' AND phonetic = '/ɪnˈʃɔːrəns/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdʒʊəri/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'jury-uk' AND phonetic = '/ˈdʒɔːri/';

UPDATE ielts_pronunciations SET phonetic = '/lʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'lure-uk' AND phonetic = '/lɔː/';

UPDATE ielts_pronunciations SET phonetic = '/məˈnjʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'manure-uk' AND phonetic = '/məˈnjɔː/';

UPDATE ielts_pronunciations SET phonetic = '/mæs ˈtʊərɪzəm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'mass-tourism-uk' AND phonetic = '/mæs ˈtɔːrɪzəm/';

UPDATE ielts_pronunciations SET phonetic = '/məˈtʃʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'mature-uk' AND phonetic = '/məˈtʃɔː/';

UPDATE ielts_pronunciations SET phonetic = '/məˈtʃʊə ˈstjuːdənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'mature-student-uk' AND phonetic = '/məˈtʃɔː ˈstjuːdənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈnjʊərɒn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'neuron-uk' AND phonetic = '/ˈnjuːrɒn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈplʊərəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'plural-uk' AND phonetic = '/ˈplɔːrəl/';

UPDATE ielts_pronunciations SET phonetic = '/pjʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'pure-uk' AND phonetic = '/pjɔː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpjʊəli/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'purely-uk' AND phonetic = '/ˈpjɔːli/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpjʊərɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'purity-uk' AND phonetic = '/ˈpjʊrɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈrʊərəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'rural-uk' AND phonetic = '/ˈrɔːrəl/';

UPDATE ielts_pronunciations SET phonetic = '/sɪˈkjʊə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'secure-uk' AND phonetic = '/sɪˈkjɔː/';

UPDATE ielts_pronunciations SET phonetic = '/sɪˈkjʊərɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'security-uk' AND phonetic = '/sɪˈkjɔːrɪti/';

UPDATE ielts_pronunciations SET phonetic = '/sɪˈkjʊərɪti dɪˈpɒzɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'security-deposit-uk' AND phonetic = '/sɪˈkjɔːrɪti dɪˈpɒzɪt/';

UPDATE ielts_pronunciations SET phonetic = '/fuːd sɪˈkjʊərɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'food-security-uk' AND phonetic = '/fuːd sɪˈkjɔːrɪti/';

UPDATE ielts_pronunciations SET phonetic = '/dʒɒb sɪˈkjʊərɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'job-security-uk' AND phonetic = '/dʒɒb sɪˈkjɔːrɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈnæʃənəl sɪˈkjʊərɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'national-security-uk' AND phonetic = '/ˈnæʃənəl sɪˈkjɔːrɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsəʊʃəl sɪˈkjʊərɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'social-security-uk' AND phonetic = '/ˈsəʊʃəl sɪˈkjɔːrɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtʊərɪzəm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tourism-uk' AND phonetic = '/ˈtɔːrɪzəm/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtʊərɪst əˈtrækʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tourist-attraction-uk' AND phonetic = '/ˈtɔːrɪst əˈtrækʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtʊənəmənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tournament-uk' AND phonetic = '/ˈtɔːnəmənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈjʊərɪn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'urine-uk' AND phonetic = '/ˈjɔːrɪn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɔːlmənæk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'almanac-uk' AND phonetic = '/ˈɒlmənæk/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɔːltə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'alter-uk' AND phonetic = '/ˈɒltə/';

UPDATE ielts_pronunciations SET phonetic = '/ɔːlˈðəʊ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'although-uk' AND phonetic = '/ɒlˈðəʊ/';

UPDATE ielts_pronunciations SET phonetic = '/əˈsɔːlt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'assault-uk' AND phonetic = '/əˈsɒlt/';

UPDATE ielts_pronunciations SET phonetic = '/fɔːlt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'fault-uk' AND phonetic = '/fɒlt/';

UPDATE ielts_pronunciations SET phonetic = '/hɔːlt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'halt-uk' AND phonetic = '/hɒlt/';

UPDATE ielts_pronunciations SET phonetic = '/wɔːls/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'waltz-uk' AND phonetic = '/wɒlts/';

UPDATE ielts_pronunciations SET phonetic = '/ˌkrɪstiˈænɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'christianity-uk' AND phonetic = '/ˌkrɪstʃiˈænɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˌkɒnəˈteɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'connotation-uk' AND phonetic = '/kɒnəʊˈteɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˌlekˈtrɒnɪk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'electronic-uk' AND phonetic = '/ˌelɪkˈtrɒnɪk/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˌlekˈtrɒnɪks/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'electronics-uk' AND phonetic = '/ˌelɪkˈtrɒnɪks/';

UPDATE ielts_pronunciations SET phonetic = '/ˌekspɜːˈtiːz/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'expertise-uk' AND phonetic = '/ˌekspəˈtiːz/';

UPDATE ielts_pronunciations SET phonetic = '/ˌprɒdʌkˈtɪvɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'productivity-uk' AND phonetic = '/ˌprɒdəkˈtɪvɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈprəʊtətaɪp/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'prototype-uk' AND phonetic = '/ˈprəʊtəʊtaɪp/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdʒuːniə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'junior-uk' AND phonetic = '/ˈdʒuːnjə/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɔːθenˈtɪsɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'authenticity-us' AND phonetic = '/ˌɔːθənˈtɪsɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˌdiːkɑːmpəˈzɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'decomposition-us' AND phonetic = '/ˌdiːkəmpəˈzɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/dɪˈploʊmə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'diploma-us' AND phonetic = '/dɪˈploʊmɑː/';

UPDATE ielts_pronunciations SET phonetic = '/dəˈrektɪv/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'directive-us' AND phonetic = '/daɪˈrektɪv/';

UPDATE ielts_pronunciations SET phonetic = '/dəˈrektɪv/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'directive-uk' AND phonetic = '/daɪˈrektɪv/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdræstɪk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'drastic-uk' AND phonetic = '/ˈdrɑːstɪk/';

UPDATE ielts_pronunciations SET phonetic = '/enˈdemɪk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'endemic-us' AND phonetic = '/ɪnˈdemɪk/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɪntrəvɜːt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'introvert-uk' AND phonetic = '/ˈɪntrəʊvɜːt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɪntrəvɝːt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'introvert-us' AND phonetic = '/ˈɪntroʊvɝːt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈaɪən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'ion-uk' AND phonetic = '/ˈaɪɒn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈlɔː əbaɪdɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'law-abiding-uk' AND phonetic = '/lɔː əˈbaɪdɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈlɑː əbaɪdɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'law-abiding-us' AND phonetic = '/lɑː əˈbaɪdɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈlaɪflɔːŋ ˈlɝːnɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'lifelong-learning-us' AND phonetic = '/laɪˈflɔːŋ ˈlɝːnɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈloʊkəl ˈspeʃəlti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'local-speciality-us' AND phonetic = '/ˈloʊkəl ˌspeʃiˈælɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈaʊtdɔː ækˈtɪvɪtiz/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'outdoor-activities-uk' AND phonetic = '/aʊtˈdɔː ækˈtɪvɪtiz/';

UPDATE ielts_pronunciations SET phonetic = '/ʌnˈpresɪdentɪd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unprecedented-uk' AND phonetic = '/ʌnˈpresɪdəntɪd/';

UPDATE ielts_pronunciations SET phonetic = '/ˈwaɪdspred/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'widespread-uk' AND phonetic = '/ˌwaɪdˈspred/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɔːtəbaɪˈɒɡrəfi/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'autobiography-uk' AND phonetic = '/ˌɔːtəʊbaɪˈɒɡrəfi/';

UPDATE ielts_pronunciations SET phonetic = '/ˈlaɪlək/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'lilac-us' AND phonetic = '/ˈlaɪlæk/';

UPDATE ielts_pronunciations SET phonetic = '/ˌpeɪliəˈlɪθɪk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'paleolithic-us' AND phonetic = '/ˌpeɪlioʊˈlɪθɪk/';

UPDATE ielts_pronunciations SET phonetic = '/ˈfəʊtəʊkɒpi/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'photocopy-uk' AND phonetic = '/ˈfəʊtəkɒpi/';

UPDATE ielts_pronunciations SET phonetic = '/ˈfəʊtəʊkɒpiə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'photocopier-uk' AND phonetic = '/ˈfəʊtəkɒpɪə/';

UPDATE ielts_pronunciations SET phonetic = '/rɪˈkuːpəreɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'recuperate-uk' AND phonetic = '/rɪˈkjuːpəreɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈruːmmeɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'roommate-uk' AND phonetic = '/ˈruːmeɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈruːmmeɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'roommate-us' AND phonetic = '/ˈruːmeɪt/';

UPDATE ielts_pronunciations SET phonetic = '/səˈpɪriɚ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'superior-us' AND phonetic = '/suˈpɪriɚ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈiː kɒmɜːs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'e-commerce-uk' AND phonetic = '/ˌiː ˈkɒmɜːs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈiː kɑːmɝːs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'e-commerce-us' AND phonetic = '/ˌiː ˈkɑːmɝːs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈiː lɜːnɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'e-learning-uk' AND phonetic = '/iː ˈlɜːnɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈiː lɝːnɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'e-learning-us' AND phonetic = '/iː ˈlɝːnɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈhæŋ ɡlaɪdɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'hang-gliding-uk' AND phonetic = '/hæŋ ˈɡlaɪdɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈhæŋ ɡlaɪdɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'hang-gliding-us' AND phonetic = '/hæŋ ˈɡlaɪdɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkæri ɒn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'carry-on-uk' AND phonetic = '/ˌkæri ɒn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkæri ɑːn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'carry-on-us' AND phonetic = '/ˌkæri ɑːn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsekənd hænd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'second-hand-uk' AND phonetic = '/ˌsekənd hænd/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsekənd hænd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'second-hand-us' AND phonetic = '/ˌsekənd hænd/';

UPDATE ielts_pronunciations SET phonetic = '/ˌsaʊθ ˈwest/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'south-west-uk' AND phonetic = '/saʊθ west/';

UPDATE ielts_pronunciations SET phonetic = '/ˌsaʊθ ˈwest/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'south-west-us' AND phonetic = '/saʊθ west/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtiː dʒʌŋkʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 't-junction-uk' AND phonetic = '/tiː ˈdʒʌŋkʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtiː dʒʌŋkʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 't-junction-us' AND phonetic = '/tiː ˈdʒʌŋkʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈruːɪnz/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'ruins-us' AND phonetic = '/ruənz/';

UPDATE ielts_pronunciations SET phonetic = '/ˌwestənaɪˈzeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'westernisation-uk' AND phonetic = '/ˌwestənɪˈzeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/əˈmiːnɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'amenity-uk' AND phonetic = '/əˈmenɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈæŋkʃəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'anxious-uk' AND phonetic = '/ˈæŋʃəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˌæstrəʊˈfɪzɪks/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'astrophysics-uk' AND phonetic = '/ˌæstrəˈfɪzɪks/';

UPDATE ielts_pronunciations SET phonetic = '/buːð/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'booth-uk' AND phonetic = '/buːθ/';

UPDATE ielts_pronunciations SET phonetic = '/kɑːm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'calm-us' AND phonetic = '/kɑːlm/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkəʊstlaɪn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'coastline-uk' AND phonetic = '/ˈkəʊslaɪn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkɒmpenseɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'compensate-uk' AND phonetic = '/ˈkɒmpənseɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˌkɒmpenˈseɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'compensation-uk' AND phonetic = '/ˌkɒmpənˈseɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkuːpɑːn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'coupon-us' AND phonetic = '/ˈkjuːpɔːn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdaɪəɡnəʊz/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'diagnose-uk' AND phonetic = '/daɪəɡˈnəʊz/';

UPDATE ielts_pronunciations SET phonetic = '/ˌdaɪəɡˈnoʊs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'diagnose-us' AND phonetic = '/daɪəɡˈnoʊs/';

UPDATE ielts_pronunciations SET phonetic = '/iˈkɒlədʒi/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'ecology-uk' AND phonetic = '/eˈkɒlədʒi/';

UPDATE ielts_pronunciations SET phonetic = '/ˌelsˈweə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'elsewhere-uk' AND phonetic = '/ˈelsweə/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˈnækt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'enact-uk' AND phonetic = '/eˈnækt/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˌvaɪrənˈmentəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'environmental-uk' AND phonetic = '/enˌvaɪrənˈmentəl/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˌvaɪrənˈmentəlɪst/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'environmentalist-uk' AND phonetic = '/enˌvaɪrənˈmentəlɪst/';

UPDATE ielts_pronunciations SET phonetic = '/ˈiːpɒk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'epoch-uk' AND phonetic = '/ˈepɒk/';

UPDATE ielts_pronunciations SET phonetic = '/ɪɡˌzæmɪˈneɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'examination-uk' AND phonetic = '/eɡˌzæmɪˈneɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈfæsɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'facet-uk' AND phonetic = '/ˈfæset/';

UPDATE ielts_pronunciations SET phonetic = '/ˈdʒiːnəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'genus-uk' AND phonetic = '/ˈdʒenəs/';

UPDATE ielts_pronunciations SET phonetic = '/ˈhærəsmənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'harassment-uk' AND phonetic = '/həˈræsmənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈhʌrɪkən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'hurricane-uk' AND phonetic = '/ˈhʌrɪkeɪn/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɪndaɪˈrekt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'indirect-uk' AND phonetic = '/ɪndaɪˈrekt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈliːʒɚ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'leisure-us' AND phonetic = '/ˈleʒɚ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈliːʒɚ ˈsentɚ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'leisure-centre-us' AND phonetic = '/ˈleʒɚ ˈsentɚ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈloʊlənd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'lowland-us' AND phonetic = '/ˈloʊlænd/';

UPDATE ielts_pronunciations SET phonetic = '/ˈmɪriəd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'myriad-uk' AND phonetic = '/ˈmɪrɪæd/';

UPDATE ielts_pronunciations SET phonetic = '/ˌniːəˈlɪθɪk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'neolithic-uk' AND phonetic = '/ˌniːəʊˈlɪθɪk/';

UPDATE ielts_pronunciations SET phonetic = '/əˈbeɪ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'obey-uk' AND phonetic = '/əʊˈbeɪ/';

UPDATE ielts_pronunciations SET phonetic = '/ˌɒbdʒekˈtɪvɪti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'objectivity-uk' AND phonetic = '/ɒbdʒɪkˈtɪvɪti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈɒpəzɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'opposite-uk' AND phonetic = '/ˈɒpəsɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈpedəɡɒdʒi/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'pedagogy-uk' AND phonetic = '/ˈpedəɡɒɡi/';

UPDATE ielts_pronunciations SET phonetic = '/ˌself ɪˈstiːm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'self-esteem-uk' AND phonetic = '/self eˈstiːm/';

UPDATE ielts_pronunciations SET phonetic = '/ˌself əˈstiːm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'self-esteem-us' AND phonetic = '/self əˈstiːm/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsɒvrənti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'sovereignty-uk' AND phonetic = '/ˈsɒvərɪnti/';

UPDATE ielts_pronunciations SET phonetic = '/ˈspiːʃiːz/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'species-uk' AND phonetic = '/ˈspiːsiːz/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˈdeɪndʒəd ˈspiːʃiːz/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'endangered-species-uk' AND phonetic = '/ɪnˈdeɪndʒəd ˈspiːsiːz/';

UPDATE ielts_pronunciations SET phonetic = '/sɜːˈveɪləns/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'surveillance-uk' AND phonetic = '/səˈveɪləns/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtɝːʃieri ˌedʒəˈkeɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tertiary-education-us' AND phonetic = '/ˈtɝːʃəri ˌedʒəˈkeɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌθɜːməʊdaɪˈnæmɪks/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'thermodynamics-uk' AND phonetic = '/ˌθɜːmədaɪˈnæmɪks/';

UPDATE ielts_pronunciations SET phonetic = '/ˈθreʃhəʊld/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'threshold-uk' AND phonetic = '/ˈθreʃəʊld/';

UPDATE ielts_pronunciations SET phonetic = '/ˈθreʃhoʊld/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'threshold-us' AND phonetic = '/ˈθreʃoʊld/';

UPDATE ielts_pronunciations SET phonetic = '/trænˈzɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'transition-uk' AND phonetic = '/trænˈsɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˌʌnɪmˈplɔɪd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unemployed-uk' AND phonetic = '/ʌnemˈplɔɪd/';

UPDATE ielts_pronunciations SET phonetic = '/ˌʌnɪmˈplɔɪd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unemployed-us' AND phonetic = '/ˌʌnemˈplɔɪd/';

UPDATE ielts_pronunciations SET phonetic = '/ˌʌnɪmˈplɔɪmənt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unemployment-uk' AND phonetic = '/ʌnemˈplɔɪmənt/';

UPDATE ielts_pronunciations SET phonetic = '/ˌʌnɪmˈplɔɪmənt ˈbenɪfɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unemployment-benefit-uk' AND phonetic = '/ʌnemˈplɔɪmənt ˈbenɪfɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ənˈles/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unless-uk' AND phonetic = '/ʌnˈles/';

UPDATE ielts_pronunciations SET phonetic = '/ˈviːəkəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'vehicle-uk' AND phonetic = '/ˈvɪəkəl/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˈlektrɪk ˈviːəkəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'electric-vehicle-uk' AND phonetic = '/ɪˈlektrɪk ˈvɪəkəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈviːəkəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'vehicle-us' AND phonetic = '/ˈviːhɪkəl/';

UPDATE ielts_pronunciations SET phonetic = '/ɪˈlektrɪk ˈviːəkəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'electric-vehicle-us' AND phonetic = '/ɪˈlektrɪk ˈviːhɪkəl/';

UPDATE ielts_pronunciations SET phonetic = '/vəˈkæbjələri/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'vocabulary-uk' AND phonetic = '/vəʊˈkæbjʊləri/';

UPDATE ielts_pronunciations SET phonetic = '/ekˈseləreɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'accelerate-us' AND phonetic = '/ækˈseləreɪt/';

UPDATE ielts_pronunciations SET phonetic = '/əkˈsesəbəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'accessible-us' AND phonetic = '/ækˈsesəbəl/';

UPDATE ielts_pronunciations SET phonetic = '/əkˈsesəri/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'accessory-us' AND phonetic = '/ækˈsesəri/';

UPDATE ielts_pronunciations SET phonetic = '/ədˈhiːsɪv/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'adhesive-us' AND phonetic = '/ædˈhiːsɪv/';

UPDATE ielts_pronunciations SET phonetic = '/ədˈventʃərəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'adventurous-us' AND phonetic = '/ædˈventʃərəs/';

UPDATE ielts_pronunciations SET phonetic = '/əˈlʌmnaɪ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'alumni-uk' AND phonetic = '/əˈlʌmni/';

UPDATE ielts_pronunciations SET phonetic = '/ˈæmətʃɚ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'amateur-us' AND phonetic = '/ˈæmətɝː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈævənuː/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'avenue-us' AND phonetic = '/ˈævənu/';

UPDATE ielts_pronunciations SET phonetic = '/səˈlestiəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'celestial-uk' AND phonetic = '/səˈlestjəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˌtʃɪmpænˈziː/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'chimpanzee-uk' AND phonetic = '/ˌtʃɪmpənˈziː/';

UPDATE ielts_pronunciations SET phonetic = '/kəmˈpænjən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'companion-uk' AND phonetic = '/kəmˈpæniən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈkɑːnstətuːt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'constitute-us' AND phonetic = '/ˈkɑːnstətut/';

UPDATE ielts_pronunciations SET phonetic = '/ˌkɑːntəˈnuːəti/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'continuity-us' AND phonetic = '/ˌkɑːntəˈnuəti/';

UPDATE ielts_pronunciations SET phonetic = '/ˌdɪfəˈrenʃieɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'differentiate-us' AND phonetic = '/ˌdɪfəˈrentʃieɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ɪmˈplɔɪiː/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'employee-us' AND phonetic = '/ɪmˈplɔɪi/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˌθjuːziˈæstɪk/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'enthusiastic-uk' AND phonetic = '/enˌθjuːzɪˈæstɪk/';

UPDATE ielts_pronunciations SET phonetic = '/ˌfɝːmenˈteɪʃən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'fermentation-us' AND phonetic = '/ˌfɝːmənˈteɪʃən/';

UPDATE ielts_pronunciations SET phonetic = '/ˈfɝːðɚmɔːr/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'furthermore-us' AND phonetic = '/ˌfɝːðɚˈmɔːr/';

UPDATE ielts_pronunciations SET phonetic = '/ˈhɝːbəvɔːr/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'herbivore-us' AND phonetic = '/ˈɝːbɪvɔːr/';

UPDATE ielts_pronunciations SET phonetic = '/hɝːˈbɪvərəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'herbivorous-us' AND phonetic = '/ɚˈbɪvərəs/';

UPDATE ielts_pronunciations SET phonetic = '/ɪnˈvɝːtəbrət/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'invertebrate-us' AND phonetic = '/ɪnˈvɝːtəbreɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈlɑːndʒətuːd/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'longitude-us' AND phonetic = '/ˈlɑːndʒətud/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsiːniə/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'senior-uk' AND phonetic = '/ˈsiːnjə/';

UPDATE ielts_pronunciations SET phonetic = '/ˈsiːniə ˈsɪtɪzən/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'senior-citizen-uk' AND phonetic = '/ˈsiːnjə ˈsɪtɪzən/';

UPDATE ielts_pronunciations SET phonetic = '/səbˈstænʃieɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'substantiate-us' AND phonetic = '/səbˈstæntʃieɪt/';

UPDATE ielts_pronunciations SET phonetic = '/təˈbuː/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'taboo-us' AND phonetic = '/tæˈbuː/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtaɪm kənsjuːmɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'time-consuming-uk' AND phonetic = '/taɪm kənˈsjuːmɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtaɪm kənsuːmɪŋ/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'time-consuming-us' AND phonetic = '/taɪm kənˈsuːmɪŋ/';

UPDATE ielts_pronunciations SET phonetic = '/ˈtrɑːpəsfɪr/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'troposphere-us' AND phonetic = '/ˈtroʊpəsfɪr/';

UPDATE ielts_pronunciations SET phonetic = '/tuːˈtɔːriəl/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tutorial-us' AND phonetic = '/tuˈtɔːriəl/';

UPDATE ielts_pronunciations SET phonetic = '/ˈvɑːljuːm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'volume-us' AND phonetic = '/ˈvɑːljum/';

UPDATE ielts_pronunciations SET phonetic = '/ˈlaɪfspæn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'life-span-uk' AND phonetic = '/laɪf spæn/';

UPDATE ielts_pronunciations SET phonetic = '/ˈlaɪfspæn/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'life-span-us' AND phonetic = '/laɪf spæn/';

UPDATE ielts_pronunciations SET phonetic = '/əkˈseləreɪt/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'accelerate-us' AND phonetic = '/ekˈseləreɪt/';

UPDATE ielts_pronunciations SET phonetic = '/ˈæltruɪzəm/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'altruism-uk' AND phonetic = '/ˈæltruːɪzəm/';

UPDATE ielts_pronunciations SET phonetic = '/lʌɡˈʒʊriəs/', updated_at = CURRENT_TIMESTAMP
WHERE id = 'luxurious-us' AND phonetic = '/ləɡˈʒʊriəs/';
