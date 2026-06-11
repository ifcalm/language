-- Generated verb paths batch batch-001.
-- Generated under docs/verb-sentence-growth-standard.md.

PRAGMA foreign_keys = ON;

INSERT INTO verb_paths (
  id,
  verb_id,
  verb,
  title,
  meaning_zh,
  core_sentence_en,
  core_sentence_zh,
  full_sentence_en,
  full_sentence_zh,
  scene,
  steps_json,
  growth_json
) VALUES
  (
    'simulate-primary',
    'simulate',
    'simulate',
    'simulate network failures',
    '模拟网络故障',
    'The test harness simulates network failures.',
    '测试工具模拟网络故障。',
    'The test harness simulates network failures in the staging environment during deployment drills.',
    '测试工具在部署演练期间，在预发布环境中模拟网络故障。',
    'staging-test',
    '[{"step_no":1,"label":"主干","sentence_en":"The test harness simulates network failures.","sentence_zh":"测试工具模拟网络故障。","focus_text":"simulates","note_zh":"先看主干：测试工具模拟网络故障。","segments":[{"text":"The test harness simulates network failures","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":2,"label":"场景","sentence_en":"The test harness simulates network failures in the staging environment.","sentence_zh":"测试工具在预发布环境中模拟网络故障。","focus_text":"in the staging environment","note_zh":"加入场景，说明模拟发生在哪里。","segments":[{"text":"The test harness simulates network failures ","kind":"core"},{"text":"in the staging environment","kind":"modifier"},{"text":".","kind":"punctuation"}]},{"step_no":3,"label":"时间","sentence_en":"The test harness simulates network failures in the staging environment during deployment drills.","sentence_zh":"测试工具在部署演练期间，在预发布环境中模拟网络故障。","focus_text":"during deployment drills","note_zh":"加入时间，说明模拟在何时进行。","segments":[{"text":"The test harness simulates network failures in the staging environment ","kind":"core"},{"text":"during deployment drills","kind":"modifier"},{"text":".","kind":"punctuation"}]}]',
    '{"nodes":[{"id":"test-harness","text":"The test harness","kind":"core","group":"core"},{"id":"simulates","text":"simulates","kind":"action","group":"action"},{"id":"network-failures","text":"network failures","kind":"core","group":"core"},{"id":"in-the-staging-environment","text":"in the staging environment","kind":"modifier","group":"modifier"},{"id":"during-deployment-drills","text":"during deployment drills","kind":"modifier","group":"modifier"}],"links":[{"id":"simulates->test-harness","from":"simulates","to":"test-harness","kind":"core","label":"参与者"},{"id":"simulates->network-failures","from":"simulates","to":"network-failures","kind":"core","label":"对象"},{"id":"in-the-staging-environment->simulates","from":"in-the-staging-environment","to":"simulates","kind":"modifier","label":"场景"},{"id":"during-deployment-drills->simulates","from":"during-deployment-drills","to":"simulates","kind":"modifier","label":"时间"}],"steps":[{"step_no":1,"label":"主干","sentence_en":"The test harness simulates network failures.","sentence_zh":"测试工具模拟网络故障。","show_nodes":["test-harness","simulates","network-failures"],"show_links":["simulates->test-harness","simulates->network-failures"],"focus_node":"simulates","note_zh":"先看主干：测试工具模拟网络故障。"},{"step_no":2,"label":"场景","sentence_en":"The test harness simulates network failures in the staging environment.","sentence_zh":"测试工具在预发布环境中模拟网络故障。","show_nodes":["in-the-staging-environment"],"show_links":["in-the-staging-environment->simulates"],"focus_node":"in-the-staging-environment","note_zh":"加入场景，说明模拟发生在哪里。"},{"step_no":3,"label":"时间","sentence_en":"The test harness simulates network failures in the staging environment during deployment drills.","sentence_zh":"测试工具在部署演练期间，在预发布环境中模拟网络故障。","show_nodes":["during-deployment-drills"],"show_links":["during-deployment-drills->simulates"],"focus_node":"during-deployment-drills","note_zh":"加入时间，说明模拟在何时进行。"}]}'
  ),
  (
    'sing-primary',
    'sing',
    'sing',
    'sing folk songs',
    '唱民谣',
    'Maya sings folk songs.',
    '玛雅唱民谣。',
    'Maya sings folk songs she learned from her grandmother at the neighborhood cafe every Friday evening.',
    '玛雅每周五晚上都在社区咖啡馆唱她从祖母那里学来的民谣。',
    'neighborhood-cafe',
    '[{"step_no":1,"label":"主干","sentence_en":"Maya sings folk songs.","sentence_zh":"玛雅唱民谣。","focus_text":"sings","note_zh":"先看主干：玛雅唱民谣。","segments":[{"text":"Maya sings folk songs","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":2,"label":"对象细节","sentence_en":"Maya sings folk songs she learned from her grandmother.","sentence_zh":"玛雅唱她从祖母那里学来的民谣。","focus_text":"she learned from her grandmother","note_zh":"加入对象细节，说明这些民谣是她从祖母那里学来的。","segments":[{"text":"Maya sings folk songs ","kind":"core"},{"text":"she learned from her grandmother","kind":"modifier"},{"text":".","kind":"punctuation"}]},{"step_no":3,"label":"场景","sentence_en":"Maya sings folk songs she learned from her grandmother at the neighborhood cafe.","sentence_zh":"玛雅在社区咖啡馆唱她从祖母那里学来的民谣。","focus_text":"at the neighborhood cafe","note_zh":"加入场景，说明她在哪里唱。","segments":[{"text":"Maya sings folk songs she learned from her grandmother ","kind":"core"},{"text":"at the neighborhood cafe","kind":"modifier"},{"text":".","kind":"punctuation"}]},{"step_no":4,"label":"时间","sentence_en":"Maya sings folk songs she learned from her grandmother at the neighborhood cafe every Friday evening.","sentence_zh":"玛雅每周五晚上都在社区咖啡馆唱她从祖母那里学来的民谣。","focus_text":"every Friday evening","note_zh":"加入时间，说明她每周五晚上都唱。","segments":[{"text":"Maya sings folk songs she learned from her grandmother at the neighborhood cafe ","kind":"core"},{"text":"every Friday evening","kind":"modifier"},{"text":".","kind":"punctuation"}]}]',
    '{"nodes":[{"id":"maya","text":"Maya","kind":"core","group":"core"},{"id":"sings","text":"sings","kind":"action","group":"action"},{"id":"folk-songs","text":"folk songs","kind":"core","group":"core"},{"id":"she-learned-from-her-grandmother","text":"she learned from her grandmother","kind":"modifier","group":"modifier"},{"id":"at-the-neighborhood-cafe","text":"at the neighborhood cafe","kind":"modifier","group":"modifier"},{"id":"every-friday-evening","text":"every Friday evening","kind":"modifier","group":"modifier"}],"links":[{"id":"sings->maya","from":"sings","to":"maya","kind":"core","label":"参与者"},{"id":"sings->folk-songs","from":"sings","to":"folk-songs","kind":"core","label":"内容"},{"id":"she-learned-from-her-grandmother->folk-songs","from":"she-learned-from-her-grandmother","to":"folk-songs","kind":"modifier","label":"对象细节"},{"id":"at-the-neighborhood-cafe->sings","from":"at-the-neighborhood-cafe","to":"sings","kind":"modifier","label":"场景"},{"id":"every-friday-evening->sings","from":"every-friday-evening","to":"sings","kind":"modifier","label":"时间"}],"steps":[{"step_no":1,"label":"主干","sentence_en":"Maya sings folk songs.","sentence_zh":"玛雅唱民谣。","show_nodes":["maya","sings","folk-songs"],"show_links":["sings->maya","sings->folk-songs"],"focus_node":"sings","note_zh":"先看主干：玛雅唱民谣。"},{"step_no":2,"label":"对象细节","sentence_en":"Maya sings folk songs she learned from her grandmother.","sentence_zh":"玛雅唱她从祖母那里学来的民谣。","show_nodes":["she-learned-from-her-grandmother"],"show_links":["she-learned-from-her-grandmother->folk-songs"],"focus_node":"she-learned-from-her-grandmother","note_zh":"加入对象细节，说明这些民谣是她从祖母那里学来的。"},{"step_no":3,"label":"场景","sentence_en":"Maya sings folk songs she learned from her grandmother at the neighborhood cafe.","sentence_zh":"玛雅在社区咖啡馆唱她从祖母那里学来的民谣。","show_nodes":["at-the-neighborhood-cafe"],"show_links":["at-the-neighborhood-cafe->sings"],"focus_node":"at-the-neighborhood-cafe","note_zh":"加入场景，说明她在哪里唱。"},{"step_no":4,"label":"时间","sentence_en":"Maya sings folk songs she learned from her grandmother at the neighborhood cafe every Friday evening.","sentence_zh":"玛雅每周五晚上都在社区咖啡馆唱她从祖母那里学来的民谣。","show_nodes":["every-friday-evening"],"show_links":["every-friday-evening->sings"],"focus_node":"every-friday-evening","note_zh":"加入时间，说明她每周五晚上都唱。"}]}'
  )
ON CONFLICT(id) DO UPDATE SET
  verb_id = excluded.verb_id,
  verb = excluded.verb,
  title = excluded.title,
  meaning_zh = excluded.meaning_zh,
  core_sentence_en = excluded.core_sentence_en,
  core_sentence_zh = excluded.core_sentence_zh,
  full_sentence_en = excluded.full_sentence_en,
  full_sentence_zh = excluded.full_sentence_zh,
  scene = excluded.scene,
  steps_json = excluded.steps_json,
  growth_json = excluded.growth_json,
  updated_at = CURRENT_TIMESTAMP;
