-- IELTS example review: 12 fixes (see docs/ielts-review/examples-fixes-0276.md).
UPDATE ielts_examples SET sentence_en = 'Almost every cell in the body contains a complete set of genes.', sentence_zh = '体内几乎每个细胞都含有一整套基因。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'cell-1' AND sentence_en = 'Every cell in the body contains a complete set of genes.' AND sentence_zh = '体内每个细胞都含有一整套基因。' AND target = 'cell';

UPDATE ielts_examples SET sentence_zh = '镇上暴发了食物中毒,几家餐厅因此关门。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'outbreak-1' AND sentence_en = 'An outbreak of food poisoning closed several restaurants in the town.' AND sentence_zh = '一场食物中毒事件的爆发导致镇上几家餐厅关闭。' AND target = 'outbreak';

UPDATE ielts_examples SET sentence_en = 'Some salamanders can grow a new limb if one is lost.', sentence_zh = '有些蝾螈失去肢体后能再长出新的。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'limb-1' AND sentence_en = 'Some lizards can grow a new limb if one is lost.' AND sentence_zh = '有些蜥蜴失去肢体后能再长出新的。' AND target = 'limb';

UPDATE ielts_examples SET sentence_en = 'Most adolescents need more sleep than adults, but many get far less.', sentence_zh = '大多数青少年需要的睡眠比成年人多,但很多人睡得远远不够。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'adolescent-1' AND sentence_en = 'Most adolescents need more sleep than either children or adults.' AND sentence_zh = '大多数青少年比儿童和成年人都需要更多睡眠。' AND target = 'adolescents';

UPDATE ielts_examples SET sentence_en = 'Millions of people in the region live in slums without clean water.', target = 'slums', updated_at = CURRENT_TIMESTAMP
WHERE id = 'slum-1' AND sentence_en = 'Millions of people in the region live in a slum without clean water.' AND sentence_zh = '该地区有数百万人住在没有清洁用水的贫民窟。' AND target = 'slum';

UPDATE ielts_examples SET sentence_en = 'Traffic jams cost the economy a great deal in lost working time.', sentence_zh = '交通堵塞造成工作时间损失,给经济带来巨大代价。', target = 'Traffic jams', updated_at = CURRENT_TIMESTAMP
WHERE id = 'traffic-jam-1' AND sentence_en = 'Each traffic jam costs the economy a great deal in lost working time.' AND sentence_zh = '每次交通堵塞都因工作时间损失给经济带来巨大代价。' AND target = 'traffic jam';

UPDATE ielts_examples SET sentence_zh = '桥上的每个钢螺栓都要定期检查,看是否有损坏的迹象。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bolt-1' AND sentence_en = 'Each steel bolt in the bridge is checked regularly for signs of weakness.' AND sentence_zh = '桥上的每个钢螺栓都定期检查是否有松动迹象。' AND target = 'bolt';

UPDATE ielts_examples SET sentence_en = 'Tourism accounts for about ten per cent of the country''s GDP.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'gdp-1' AND sentence_en = 'Tourism accounts for about ten percent of the country''s GDP.' AND sentence_zh = '旅游业约占该国国内生产总值的百分之十。' AND target = 'GDP';

UPDATE ielts_examples SET sentence_en = 'The advertising campaign increased sales by more than twenty per cent.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'advertising-campaign-1' AND sentence_en = 'The advertising campaign increased sales by more than twenty percent.' AND sentence_zh = '这次广告宣传活动使销售额增长了百分之二十多。' AND target = 'advertising campaign';

UPDATE ielts_examples SET sentence_en = 'New cars begin to depreciate as soon as they are driven out of the showroom.', sentence_zh = '新车一开出展厅就开始贬值。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'depreciate-1' AND sentence_en = 'New cars begin to depreciate as soon as they leave the factory.' AND sentence_zh = '新车一出厂就开始贬值。' AND target = 'depreciate';

UPDATE ielts_examples SET sentence_en = 'Cybercrime costs businesses billions of pounds every year.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'cybercrime-1' AND sentence_en = 'Cybercrime costs businesses billions of pounds in lost money each year.' AND sentence_zh = '网络犯罪每年使企业损失数十亿英镑。' AND target = 'Cybercrime';

UPDATE ielts_examples SET sentence_zh = '银行投入大量资金提高在线支付的安全性。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'security-1' AND sentence_en = 'Banks have spent large sums on improving the security of online payments.' AND sentence_zh = '银行投入大量资金提高在线支付的安全。' AND target = 'security';
