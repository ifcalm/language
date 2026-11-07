-- IELTS example review: 19 fixes (see docs/ielts-review/examples-fixes-0274.md).
UPDATE ielts_examples SET sentence_zh = '到目前为止,科学家还没有找到其他星球存在生命的证据。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'proof-1' AND sentence_en = 'So far, scientists have found no proof of life on other planets.' AND sentence_zh = '到目前为止,科学家还没有找到其他星球存在生命的证明。' AND target = 'proof';

UPDATE ielts_examples SET sentence_zh = '最新发现表明,蜜蜂能够辨认不同的人脸。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'suggest-1' AND sentence_en = 'Recent findings suggest that bees can recognise individual human faces.' AND sentence_zh = '最新发现表明,蜜蜂能够识别人类的面孔。' AND target = 'suggest';

UPDATE ielts_examples SET sentence_en = 'Each of these approaches has its own merits, depending on the situation.', target = 'merits', updated_at = CURRENT_TIMESTAMP
WHERE id = 'merit-1' AND sentence_en = 'Each of these approaches has its own merit, depending on the situation.' AND sentence_zh = '根据情况不同,这些方法各有优点。' AND target = 'merit';

UPDATE ielts_examples SET sentence_zh = '干旱让节约用水成了农民非做不可的事。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'necessity-1' AND sentence_en = 'The drought made careful use of water an absolute necessity for farmers.' AND sentence_zh = '干旱使节约用水成为农民的绝对必要之事。' AND target = 'necessity';

UPDATE ielts_examples SET sentence_zh = '这些照片有明显经过电脑处理的痕迹。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'manipulation-1' AND sentence_en = 'The photographs showed clear signs of manipulation by computer.' AND sentence_zh = '这些照片有明显的计算机操纵痕迹。' AND target = 'manipulation';

UPDATE ielts_examples SET sentence_zh = '语言只是民族文化身份的一个方面。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'facet-1' AND sentence_en = 'Language is only one facet of a people''s cultural identity.' AND sentence_zh = '语言只是一个民族文化身份的一个方面。' AND target = 'facet';

UPDATE ielts_examples SET sentence_zh = '人们天生有一种倾向:坏消息比好消息记得更牢。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tendency-1' AND sentence_en = 'People have a natural tendency to remember bad news better than good news.' AND sentence_zh = '人们天生倾向于比好消息更容易记住坏消息。' AND target = 'tendency';

UPDATE ielts_examples SET sentence_en = 'Fishermen are being encouraged to adopt more sustainable fishing methods.', sentence_zh = '人们正鼓励渔民采用更可持续的捕鱼方法。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'sustainable-1' AND sentence_en = 'Farmers are being encouraged to adopt more sustainable methods of fishing.' AND sentence_zh = '人们鼓励渔民采用更可持续的捕鱼方法。' AND target = 'sustainable';

UPDATE ielts_examples SET sentence_zh = '学校为学习跟不上的孩子开设了补充课程。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'supplementary-1' AND sentence_en = 'Supplementary classes were offered to children who had fallen behind.' AND sentence_zh = '学校为落后的孩子提供了补充课程。' AND target = 'Supplementary';

UPDATE ielts_examples SET sentence_zh = '这份报告没有探讨农村贫困的根源。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'address-1' AND sentence_en = 'The report fails to address the causes of poverty in rural areas.' AND sentence_zh = '这份报告未能处理农村贫困的根源。' AND target = 'address';

UPDATE ielts_examples SET sentence_zh = '大多数人都想要一份有固定收入的稳定工作。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'secure-2' AND sentence_en = 'Most people want a secure job that offers a regular income.' AND sentence_zh = '大多数人都想要一份收入稳定的安稳工作。' AND target = 'secure';

UPDATE ielts_examples SET sentence_zh = '需要进一步检查才能查明病因。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'clarify-1' AND sentence_en = 'Further tests are needed to clarify the cause of the illness.' AND sentence_zh = '需要进一步检查来澄清病因。' AND target = 'clarify';

UPDATE ielts_examples SET sentence_en = 'Flat maps inevitably distort the curved surface of the Earth.', sentence_zh = '平面地图难免会使地球的曲面变形。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'distort-1' AND sentence_en = 'The curved surface of the Earth tends to distort flat maps.' AND sentence_zh = '地球的曲面往往会使平面地图变形。' AND target = 'distort';

UPDATE ielts_examples SET sentence_zh = '这种疾病仅局限在该国南部的一小片地区。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'confine-1' AND sentence_en = 'The disease was confined to a small area in the south of the country.' AND sentence_zh = '这种疾病被限制在该国南部的一小片地区。' AND target = 'confined';

UPDATE ielts_examples SET sentence_en = 'The treaty will bind all member countries to reduce their carbon emissions.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bind-1' AND sentence_en = 'The treaty will bind all member countries to reducing their carbon emissions.' AND sentence_zh = '这项条约将约束所有成员国减少碳排放。' AND target = 'bind';

UPDATE ielts_examples SET sentence_zh = '孩子们常常感到压力,觉得自己的行为必须和朋友一样。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'conform-1' AND sentence_en = 'Children often feel pressure to conform to the behaviour of their friends.' AND sentence_zh = '孩子们常常感到要与朋友的行为保持一致的压力。' AND target = 'conform';

UPDATE ielts_examples SET sentence_en = 'Many of the fish caught by the boats are discarded because nobody wants them.', sentence_zh = '船只捕到的鱼有很多因为没人要而被丢弃。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'discard-1' AND sentence_en = 'Most of the fish caught by the boats are discarded as unwanted.' AND sentence_zh = '船只捕捞的大部分鱼都被当作不需要的东西丢弃了。' AND target = 'discarded';

UPDATE ielts_examples SET sentence_zh = '城市不断发展,必须建设新的供水系统。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'necessitate-1' AND sentence_en = 'The growth of the city will necessitate a new water supply.' AND sentence_zh = '城市的发展使得新的供水系统成为必要。' AND target = 'necessitate';

UPDATE ielts_examples SET sentence_en = 'The events are described in reverse order, beginning with the most recent.', sentence_zh = '这些事件按相反的顺序叙述,从最近发生的讲起。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'reverse-2' AND sentence_en = 'The second study produced exactly the reverse result.' AND sentence_zh = '第二项研究得出了完全相反的结果。' AND target = 'reverse';
