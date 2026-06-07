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
    'abandon-primary',
    'abandon',
    'abandon',
    'abandon a risky rollout',
    '放弃上线计划',
    'The team abandoned the rollout.',
    '团队放弃了这次上线。',
    'After the staging tests failed, the team abandoned the risky rollout to protect customer data.',
    '预发布环境测试失败后，团队放弃了这次风险较高的上线，以保护客户数据。',
    'deploy',
    '[{"step_no":1,"label":"主干","sentence_en":"The team abandoned the rollout.","sentence_zh":"团队放弃了这次上线。","focus_text":"abandoned","note_zh":"先看核心：团队放弃了这次上线。","segments":[{"text":"The team abandoned the rollout","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":2,"label":"加一点对象细节","sentence_en":"The team abandoned the risky rollout.","sentence_zh":"团队放弃了这次风险较高的上线。","focus_text":"risky","note_zh":"这一步说明这次上线存在较高风险。","segments":[{"text":"The team abandoned the ","kind":"core"},{"text":"risky","kind":"modifier"},{"text":" rollout","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":3,"label":"加一点时间","sentence_en":"After the staging tests failed, the team abandoned the risky rollout.","sentence_zh":"预发布环境测试失败后，团队放弃了这次风险较高的上线。","focus_text":"After the staging tests failed","note_zh":"这一步说明团队在什么时候放弃上线。","segments":[{"text":"After the staging tests failed","kind":"modifier"},{"text":", the team abandoned the risky rollout","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":4,"label":"加一点目的","sentence_en":"After the staging tests failed, the team abandoned the risky rollout to protect customer data.","sentence_zh":"预发布环境测试失败后，团队放弃了这次风险较高的上线，以保护客户数据。","focus_text":"to protect customer data","note_zh":"这一步说明放弃上线是为了保护客户数据。","segments":[{"text":"After the staging tests failed, the team abandoned the risky rollout ","kind":"core"},{"text":"to protect customer data","kind":"modifier"},{"text":".","kind":"punctuation"}]}]',
    '{"nodes":[{"id":"the-team","text":"the team","kind":"core","group":"core"},{"id":"abandoned","text":"abandoned","kind":"action","group":"action"},{"id":"the-rollout","text":"the rollout","kind":"core","group":"core"},{"id":"risky","text":"risky","kind":"modifier","group":"modifier"},{"id":"after-the-staging-tests-failed","text":"After the staging tests failed","kind":"modifier","group":"modifier"},{"id":"to-protect-customer-data","text":"to protect customer data","kind":"modifier","group":"modifier"}],"links":[{"id":"abandoned->the-team","from":"abandoned","to":"the-team","kind":"core","label":"谁放弃了计划"},{"id":"abandoned->the-rollout","from":"abandoned","to":"the-rollout","kind":"core","label":"放弃了什么"},{"id":"risky->the-rollout","from":"risky","to":"the-rollout","kind":"modifier","label":"说明上线计划的风险"},{"id":"after-the-staging-tests-failed->abandoned","from":"after-the-staging-tests-failed","to":"abandoned","kind":"modifier","label":"说明什么时候放弃"},{"id":"to-protect-customer-data->abandoned","from":"to-protect-customer-data","to":"abandoned","kind":"modifier","label":"说明放弃计划的目的"}],"steps":[{"step_no":1,"label":"主干","sentence_en":"The team abandoned the rollout.","sentence_zh":"团队放弃了这次上线。","show_nodes":["the-team","abandoned","the-rollout"],"show_links":["abandoned->the-team","abandoned->the-rollout"],"focus_node":"abandoned","note_zh":"先看核心：团队放弃了这次上线。"},{"step_no":2,"label":"加一点对象细节","sentence_en":"The team abandoned the risky rollout.","sentence_zh":"团队放弃了这次风险较高的上线。","show_nodes":["risky"],"show_links":["risky->the-rollout"],"focus_node":"risky","note_zh":"这一步说明这次上线存在较高风险。"},{"step_no":3,"label":"加一点时间","sentence_en":"After the staging tests failed, the team abandoned the risky rollout.","sentence_zh":"预发布环境测试失败后，团队放弃了这次风险较高的上线。","show_nodes":["after-the-staging-tests-failed"],"show_links":["after-the-staging-tests-failed->abandoned"],"focus_node":"after-the-staging-tests-failed","note_zh":"这一步说明团队在什么时候放弃上线。"},{"step_no":4,"label":"加一点目的","sentence_en":"After the staging tests failed, the team abandoned the risky rollout to protect customer data.","sentence_zh":"预发布环境测试失败后，团队放弃了这次风险较高的上线，以保护客户数据。","show_nodes":["to-protect-customer-data"],"show_links":["to-protect-customer-data->abandoned"],"focus_node":"to-protect-customer-data","note_zh":"这一步说明放弃上线是为了保护客户数据。"}]}'
  ),
  (
    'absorb-primary',
    'absorb',
    'absorb',
    'absorb traffic spikes',
    '缓冲流量高峰',
    'The message queue absorbs traffic spikes.',
    '消息队列缓冲流量高峰。',
    'During product launches, the message queue absorbs sudden traffic spikes without overwhelming downstream workers.',
    '产品发布期间，消息队列会缓冲突发流量高峰，避免下游 Worker 过载。',
    'queue',
    '[{"step_no":1,"label":"主干","sentence_en":"The message queue absorbs traffic spikes.","sentence_zh":"消息队列缓冲流量高峰。","focus_text":"absorbs","note_zh":"先看核心：消息队列缓冲流量高峰。","segments":[{"text":"The message queue absorbs traffic spikes","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":2,"label":"加一点对象细节","sentence_en":"The message queue absorbs sudden traffic spikes.","sentence_zh":"消息队列缓冲突发流量高峰。","focus_text":"sudden","note_zh":"这一步说明流量高峰来得很突然。","segments":[{"text":"The message queue absorbs ","kind":"core"},{"text":"sudden","kind":"modifier"},{"text":" traffic spikes","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":3,"label":"加一点场景","sentence_en":"During product launches, the message queue absorbs sudden traffic spikes.","sentence_zh":"产品发布期间，消息队列会缓冲突发流量高峰。","focus_text":"During product launches","note_zh":"这一步说明流量高峰出现的场景。","segments":[{"text":"During product launches","kind":"modifier"},{"text":", the message queue absorbs sudden traffic spikes","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":4,"label":"加一点结果","sentence_en":"During product launches, the message queue absorbs sudden traffic spikes without overwhelming downstream workers.","sentence_zh":"产品发布期间，消息队列会缓冲突发流量高峰，避免下游 Worker 过载。","focus_text":"without overwhelming downstream workers","note_zh":"这一步说明缓冲流量可以避免下游 Worker 过载。","segments":[{"text":"During product launches, the message queue absorbs sudden traffic spikes ","kind":"core"},{"text":"without overwhelming downstream workers","kind":"modifier"},{"text":".","kind":"punctuation"}]}]',
    '{"nodes":[{"id":"the-message-queue","text":"the message queue","kind":"core","group":"core"},{"id":"absorbs","text":"absorbs","kind":"action","group":"action"},{"id":"traffic-spikes","text":"traffic spikes","kind":"core","group":"core"},{"id":"sudden","text":"sudden","kind":"modifier","group":"modifier"},{"id":"during-product-launches","text":"During product launches","kind":"modifier","group":"modifier"},{"id":"without-overwhelming-downstream-workers","text":"without overwhelming downstream workers","kind":"modifier","group":"modifier"}],"links":[{"id":"absorbs->the-message-queue","from":"absorbs","to":"the-message-queue","kind":"core","label":"什么在缓冲流量"},{"id":"absorbs->traffic-spikes","from":"absorbs","to":"traffic-spikes","kind":"core","label":"缓冲什么"},{"id":"sudden->traffic-spikes","from":"sudden","to":"traffic-spikes","kind":"modifier","label":"说明流量高峰的特点"},{"id":"during-product-launches->absorbs","from":"during-product-launches","to":"absorbs","kind":"modifier","label":"说明什么时候缓冲流量"},{"id":"without-overwhelming-downstream-workers->absorbs","from":"without-overwhelming-downstream-workers","to":"absorbs","kind":"modifier","label":"说明缓冲流量带来的结果"}],"steps":[{"step_no":1,"label":"主干","sentence_en":"The message queue absorbs traffic spikes.","sentence_zh":"消息队列缓冲流量高峰。","show_nodes":["the-message-queue","absorbs","traffic-spikes"],"show_links":["absorbs->the-message-queue","absorbs->traffic-spikes"],"focus_node":"absorbs","note_zh":"先看核心：消息队列缓冲流量高峰。"},{"step_no":2,"label":"加一点对象细节","sentence_en":"The message queue absorbs sudden traffic spikes.","sentence_zh":"消息队列缓冲突发流量高峰。","show_nodes":["sudden"],"show_links":["sudden->traffic-spikes"],"focus_node":"sudden","note_zh":"这一步说明流量高峰来得很突然。"},{"step_no":3,"label":"加一点场景","sentence_en":"During product launches, the message queue absorbs sudden traffic spikes.","sentence_zh":"产品发布期间，消息队列会缓冲突发流量高峰。","show_nodes":["during-product-launches"],"show_links":["during-product-launches->absorbs"],"focus_node":"during-product-launches","note_zh":"这一步说明流量高峰出现的场景。"},{"step_no":4,"label":"加一点结果","sentence_en":"During product launches, the message queue absorbs sudden traffic spikes without overwhelming downstream workers.","sentence_zh":"产品发布期间，消息队列会缓冲突发流量高峰，避免下游 Worker 过载。","show_nodes":["without-overwhelming-downstream-workers"],"show_links":["without-overwhelming-downstream-workers->absorbs"],"focus_node":"without-overwhelming-downstream-workers","note_zh":"这一步说明缓冲流量可以避免下游 Worker 过载。"}]}'
  ),
  (
    'accept-primary',
    'accept',
    'accept',
    'accept signed requests',
    '接受请求',
    'The endpoint accepts requests.',
    '该接口接受请求。',
    'During the migration, the endpoint accepts signed requests from trusted clients.',
    '迁移期间，该接口接受来自可信客户端的带签名请求。',
    'api',
    '[{"step_no":1,"label":"主干","sentence_en":"The endpoint accepts requests.","sentence_zh":"该接口接受请求。","focus_text":"accepts","note_zh":"先看核心：接口接受请求。","segments":[{"text":"The endpoint accepts requests","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":2,"label":"加一点对象细节","sentence_en":"The endpoint accepts signed requests.","sentence_zh":"该接口接受带签名的请求。","focus_text":"signed","note_zh":"这一步说明接口接受哪类请求。","segments":[{"text":"The endpoint accepts ","kind":"core"},{"text":"signed","kind":"modifier"},{"text":" requests","kind":"core"},{"text":".","kind":"punctuation"}]},{"step_no":3,"label":"加一点来源","sentence_en":"The endpoint accepts signed requests from trusted clients.","sentence_zh":"该接口接受来自可信客户端的带签名请求。","focus_text":"from trusted clients","note_zh":"这一步说明这些请求来自哪里。","segments":[{"text":"The endpoint accepts signed requests ","kind":"core"},{"text":"from trusted clients","kind":"modifier"},{"text":".","kind":"punctuation"}]},{"step_no":4,"label":"加一点时间","sentence_en":"During the migration, the endpoint accepts signed requests from trusted clients.","sentence_zh":"迁移期间，该接口接受来自可信客户端的带签名请求。","focus_text":"During the migration","note_zh":"这一步说明接口在什么时候接受这些请求。","segments":[{"text":"During the migration","kind":"modifier"},{"text":", the endpoint accepts signed requests from trusted clients","kind":"core"},{"text":".","kind":"punctuation"}]}]',
    '{"nodes":[{"id":"the-endpoint","text":"the endpoint","kind":"core","group":"core"},{"id":"accepts","text":"accepts","kind":"action","group":"action"},{"id":"requests","text":"requests","kind":"core","group":"core"},{"id":"signed","text":"signed","kind":"modifier","group":"modifier"},{"id":"from-trusted-clients","text":"from trusted clients","kind":"modifier","group":"modifier"},{"id":"during-the-migration","text":"During the migration","kind":"modifier","group":"modifier"}],"links":[{"id":"accepts->the-endpoint","from":"accepts","to":"the-endpoint","kind":"core","label":"什么接受请求"},{"id":"accepts->requests","from":"accepts","to":"requests","kind":"core","label":"接受什么"},{"id":"signed->requests","from":"signed","to":"requests","kind":"modifier","label":"说明请求类型"},{"id":"from-trusted-clients->requests","from":"from-trusted-clients","to":"requests","kind":"modifier","label":"说明请求来自哪里"},{"id":"during-the-migration->accepts","from":"during-the-migration","to":"accepts","kind":"modifier","label":"说明什么时候接受请求"}],"steps":[{"step_no":1,"label":"主干","sentence_en":"The endpoint accepts requests.","sentence_zh":"该接口接受请求。","show_nodes":["the-endpoint","accepts","requests"],"show_links":["accepts->the-endpoint","accepts->requests"],"focus_node":"accepts","note_zh":"先看核心：接口接受请求。"},{"step_no":2,"label":"加一点对象细节","sentence_en":"The endpoint accepts signed requests.","sentence_zh":"该接口接受带签名的请求。","show_nodes":["signed"],"show_links":["signed->requests"],"focus_node":"signed","note_zh":"这一步说明接口接受哪类请求。"},{"step_no":3,"label":"加一点来源","sentence_en":"The endpoint accepts signed requests from trusted clients.","sentence_zh":"该接口接受来自可信客户端的带签名请求。","show_nodes":["from-trusted-clients"],"show_links":["from-trusted-clients->requests"],"focus_node":"from-trusted-clients","note_zh":"这一步说明这些请求来自哪里。"},{"step_no":4,"label":"加一点时间","sentence_en":"During the migration, the endpoint accepts signed requests from trusted clients.","sentence_zh":"迁移期间，该接口接受来自可信客户端的带签名请求。","show_nodes":["during-the-migration"],"show_links":["during-the-migration->accepts"],"focus_node":"during-the-migration","note_zh":"这一步说明接口在什么时候接受这些请求。"}]}'
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
