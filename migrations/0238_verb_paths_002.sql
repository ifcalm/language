-- Generated verb paths batch batch-002.
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
    'sink-primary',
    'sink',
    'sink',
    'error rate sinks',
    '下降',
    'The API error rate sank.',
    'API 错误率下降了。',
    'The API error rate sank to nearly zero after the patch.',
    '补丁发布后，API 错误率降到了接近零。',
    'software-monitoring',
    '[{"step_no":1,"label":"主干","sentence_en":"The API error rate sank.","sentence_zh":"API 错误率下降了。","focus_text":"sank","note_zh":"先看错误率下降这一核心信息。","segments":[{"text":"The API error rate sank","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":2,"label":"时间","sentence_en":"The API error rate sank after the patch.","sentence_zh":"补丁发布后，API 错误率下降了。","focus_text":"after the patch","note_zh":"加入发生变化的时间。","segments":[{"text":"The API error rate sank ","kind":"core"},{"text":"after the patch","kind":"modifier"},{"text":".","kind":"punctuation"}]},{"step_no":3,"label":"程度","sentence_en":"The API error rate sank to nearly zero after the patch.","sentence_zh":"补丁发布后，API 错误率降到了接近零。","focus_text":"to nearly zero","note_zh":"加入错误率下降到什么程度。","segments":[{"text":"The API error rate sank ","kind":"core"},{"text":"to nearly zero","kind":"modifier"},{"text":" after the patch","kind":"core"},{"text":".","kind":"punctuation"}]}]',
    '{"nodes":[{"id":"sink-action","text":"sank","kind":"action","group":"action"},{"id":"api-error-rate","text":"The API error rate","kind":"core","group":"core"},{"id":"after-patch","text":"after the patch","kind":"modifier","group":"modifier"},{"id":"nearly-zero","text":"to nearly zero","kind":"modifier","group":"modifier"}],"links":[{"id":"sink-action->api-error-rate","from":"sink-action","to":"api-error-rate","kind":"core","label":"核心内容"},{"id":"after-patch->sink-action","from":"after-patch","to":"sink-action","kind":"modifier","label":"时间"},{"id":"nearly-zero->sink-action","from":"nearly-zero","to":"sink-action","kind":"modifier","label":"程度"}],"steps":[{"step_no":1,"label":"主干","sentence_en":"The API error rate sank.","sentence_zh":"API 错误率下降了。","show_nodes":["sink-action","api-error-rate"],"show_links":["sink-action->api-error-rate"],"focus_node":"sink-action","note_zh":"先看错误率下降这一核心信息。"},{"step_no":2,"label":"时间","sentence_en":"The API error rate sank after the patch.","sentence_zh":"补丁发布后，API 错误率下降了。","show_nodes":["after-patch"],"show_links":["after-patch->sink-action"],"focus_node":"after-patch","note_zh":"加入发生变化的时间。"},{"step_no":3,"label":"程度","sentence_en":"The API error rate sank to nearly zero after the patch.","sentence_zh":"补丁发布后，API 错误率降到了接近零。","show_nodes":["nearly-zero"],"show_links":["nearly-zero->sink-action"],"focus_node":"nearly-zero","note_zh":"加入错误率下降到什么程度。"}]}'
  ),
  (
    'sit-primary',
    'sit',
    'sit',
    'server sits in a rack',
    '位于',
    'The backup server sits in a locked rack.',
    '备用服务器位于一个上锁的机架中。',
    'The backup server sits in a locked rack at our disaster recovery site until it is needed.',
    '备用服务器一直位于我们灾难恢复站点的一个上锁机架中，直到需要使用时为止。',
    'data-center',
    '[{"step_no":1,"label":"主干","sentence_en":"The backup server sits in a locked rack.","sentence_zh":"备用服务器位于一个上锁的机架中。","focus_text":"sits","note_zh":"先看备用服务器及其所在位置。","segments":[{"text":"The backup server sits in a locked rack","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":2,"label":"位置细节","sentence_en":"The backup server sits in a locked rack at our disaster recovery site.","sentence_zh":"备用服务器位于我们灾难恢复站点的一个上锁机架中。","focus_text":"at our disaster recovery site","note_zh":"加入机架所在站点的细节。","segments":[{"text":"The backup server sits in a locked rack ","kind":"core"},{"text":"at our disaster recovery site","kind":"modifier"},{"text":".","kind":"punctuation"}]},{"step_no":3,"label":"时间","sentence_en":"The backup server sits in a locked rack at our disaster recovery site until it is needed.","sentence_zh":"备用服务器一直位于我们灾难恢复站点的一个上锁机架中，直到需要使用时为止。","focus_text":"until it is needed","note_zh":"加入这种状态持续到什么时候。","segments":[{"text":"The backup server sits in a locked rack at our disaster recovery site ","kind":"core"},{"text":"until it is needed","kind":"modifier"},{"text":".","kind":"punctuation"}]}]',
    '{"nodes":[{"id":"sit-action","text":"sits","kind":"action","group":"action"},{"id":"backup-server","text":"The backup server","kind":"core","group":"core"},{"id":"locked-rack","text":"in a locked rack","kind":"core","group":"core"},{"id":"recovery-site","text":"at our disaster recovery site","kind":"modifier","group":"modifier"},{"id":"until-needed","text":"until it is needed","kind":"modifier","group":"modifier"}],"links":[{"id":"sit-action->backup-server","from":"sit-action","to":"backup-server","kind":"core","label":"核心对象"},{"id":"sit-action->locked-rack","from":"sit-action","to":"locked-rack","kind":"core","label":"核心位置"},{"id":"recovery-site->locked-rack","from":"recovery-site","to":"locked-rack","kind":"modifier","label":"位置细节"},{"id":"until-needed->sit-action","from":"until-needed","to":"sit-action","kind":"modifier","label":"时间"}],"steps":[{"step_no":1,"label":"主干","sentence_en":"The backup server sits in a locked rack.","sentence_zh":"备用服务器位于一个上锁的机架中。","show_nodes":["sit-action","backup-server","locked-rack"],"show_links":["sit-action->backup-server","sit-action->locked-rack"],"focus_node":"sit-action","note_zh":"先看备用服务器及其所在位置。"},{"step_no":2,"label":"位置细节","sentence_en":"The backup server sits in a locked rack at our disaster recovery site.","sentence_zh":"备用服务器位于我们灾难恢复站点的一个上锁机架中。","show_nodes":["recovery-site"],"show_links":["recovery-site->locked-rack"],"focus_node":"recovery-site","note_zh":"加入机架所在站点的细节。"},{"step_no":3,"label":"时间","sentence_en":"The backup server sits in a locked rack at our disaster recovery site until it is needed.","sentence_zh":"备用服务器一直位于我们灾难恢复站点的一个上锁机架中，直到需要使用时为止。","show_nodes":["until-needed"],"show_links":["until-needed->sit-action"],"focus_node":"until-needed","note_zh":"加入这种状态持续到什么时候。"}]}'
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
