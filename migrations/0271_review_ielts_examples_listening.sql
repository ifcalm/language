-- IELTS example review: 23 fixes (see docs/ielts-review/examples-fixes-0271.md).
UPDATE ielts_examples SET sentence_en = 'Walk along the avenue until you reach the museum on your right.', sentence_zh = '沿着这条大街一直走,博物馆就在你右边。', target = 'avenue', updated_at = CURRENT_TIMESTAMP
WHERE id = 'avenue-1' AND sentence_en = 'The theatre is on Park Avenue, opposite the main post office.' AND sentence_zh = '剧院在公园大街,就在邮政总局对面。' AND target = 'Avenue';

UPDATE ielts_examples SET sentence_en = 'Always use the crosswalk when you cross this busy street.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'crosswalk-1' AND sentence_en = 'Always use the crosswalk when you get across this busy street.' AND sentence_zh = '过这条繁忙的街道时,一定要走人行横道。' AND target = 'crosswalk';

UPDATE ielts_examples SET sentence_en = 'Walk clockwise around the lake and you''ll reach the boathouse first.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'clockwise-1' AND sentence_en = 'Walk clockwise around the lake and you''ll reach the boat house first.' AND sentence_zh = '沿顺时针方向绕湖走,你会先到船屋。' AND target = 'clockwise';

UPDATE ielts_examples SET sentence_zh = '入口处的雕像塑造的是这所学校的创办人。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'statue-1' AND sentence_en = 'The statue at the entrance shows the man who started the school.' AND sentence_zh = '入口处的雕像塑的是这所学校的创办人。' AND target = 'statue';

UPDATE ielts_examples SET sentence_en = 'The company works in wholesale, selling fruit to shops and restaurants.', sentence_zh = '这家公司做批发生意,把水果卖给商店和餐馆。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'wholesale-1' AND sentence_en = 'The shop buys its goods at wholesale and sells them at a higher price.' AND sentence_zh = '这家店以批发价进货,然后以更高的价格出售。' AND target = 'wholesale';

UPDATE ielts_examples SET sentence_en = 'The department store has clothes on the first floor and furniture on the top floor.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'department-store-1' AND sentence_en = 'The department store has clothes on the first floor and furniture on the top.' AND sentence_zh = '百货商店二楼卖衣服,顶楼卖家具。' AND target = 'department store';

UPDATE ielts_examples SET sentence_en = 'The village holds a great feast with music at the end of the harvest.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'feast-1' AND sentence_en = 'The village holds a great feast with music at the end of harvest.' AND sentence_zh = '收获季结束时,村里会举办盛宴,还有音乐表演。' AND target = 'feast';

UPDATE ielts_examples SET sentence_en = 'This cash machine only gives out notes in denominations of twenty pounds.', sentence_zh = '这台取款机只吐面额二十英镑的钞票。', target = 'denominations', updated_at = CURRENT_TIMESTAMP
WHERE id = 'denomination-1' AND sentence_en = 'The machine only gives out notes in a denomination of twenty pounds.' AND sentence_zh = '这台机器只吐面额二十英镑的钞票。' AND target = 'denomination';

UPDATE ielts_examples SET sentence_zh = '如果多缴了税,你也许可以申请退还部分税款。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'rebate-1' AND sentence_en = 'You may be able to claim a tax rebate if you''ve paid too much.' AND sentence_zh = '如果多缴了税,你也许可以申请部分退款。' AND target = 'rebate';

UPDATE ielts_examples SET sentence_en = 'My fingers went numb after a few minutes in the freezing water.', sentence_zh = '在冰水里泡了几分钟,我的手指就麻木了。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'numb-1' AND sentence_en = 'My fingers went numb after an hour in the freezing water.' AND sentence_zh = '在冰水里泡了一小时后,我的手指都麻木了。' AND target = 'numb';

UPDATE ielts_examples SET sentence_en = 'I have to juggle my part-time job and my coursework every week.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'juggle-2' AND sentence_en = 'I have to juggle my part-time job and my course work every week.' AND sentence_zh = '我每周都要兼顾兼职和课程作业。' AND target = 'juggle';

UPDATE ielts_examples SET sentence_zh = '他在比赛中想挥拳打另一名球员,被罚下场。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'punch-1' AND sentence_en = 'He was sent off for trying to punch another player during the game.' AND sentence_zh = '他在比赛中试图拳击另一名球员,被罚下场。' AND target = 'punch';

UPDATE ielts_examples SET sentence_zh = '水族馆有一个大水箱,可以看工作人员给鲨鱼喂食。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'aquarium-1' AND sentence_en = 'The aquarium has a large tank where you can watch sharks being fed.' AND sentence_zh = '水族馆有一个大水箱,可以看到鲨鱼喂食。' AND target = 'aquarium';

UPDATE ielts_examples SET sentence_zh = '孩子们造了一只小木筏,让它漂过池塘。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'raft-1' AND sentence_en = 'The children built a small raft and floated it across the pond.' AND sentence_zh = '孩子们造了一只小木筏,划过了池塘。' AND target = 'raft';

UPDATE ielts_examples SET sentence_zh = '导师明天会考你们前三章的内容。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'quiz-2' AND sentence_en = 'The tutor will quiz you on the first three chapters tomorrow.' AND sentence_zh = '导师明天会就前三章对你们进行测验。' AND target = 'quiz';

UPDATE ielts_examples SET sentence_zh = '我们的样本是来自不同年龄段的一百个人。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'sample-1' AND sentence_en = 'We used a sample of one hundred people from different age groups.' AND sentence_zh = '我们使用了一个来自不同年龄段的一百人样本。' AND target = 'sample';

UPDATE ielts_examples SET sentence_zh = '用自己的话给这篇文章写一份简短摘要。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'summary-1' AND sentence_en = 'Write a brief summary of the article in your own words.' AND sentence_zh = '用你自己的话写一篇这篇文章的简短摘要。' AND target = 'summary';

UPDATE ielts_examples SET sentence_zh = '一个由三位专家组成的小组将评审学生的项目。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'panel-1' AND sentence_en = 'A panel of three experts will judge the students'' projects.' AND sentence_zh = '由三位专家组成的专家组将评审学生的项目。' AND target = 'panel';

UPDATE ielts_examples SET sentence_en = 'Please direct any enquiries about fees to the main office.', target = 'enquiries', updated_at = CURRENT_TIMESTAMP
WHERE id = 'enquiry-1' AND sentence_en = 'Please direct any enquiry about fees to the main office.' AND sentence_zh = '有关费用的任何询问,请直接联系总办公室。' AND target = 'enquiry';

UPDATE ielts_examples SET sentence_en = 'Coursework counts for forty per cent of your final mark.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'coursework-1' AND sentence_en = 'Coursework counts for forty percent of your final mark.' AND sentence_zh = '课程作业占你最终成绩的百分之四十。' AND target = 'Coursework';

UPDATE ielts_examples SET sentence_en = 'Students can get a ten per cent discount if they show their cards.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'discount-1' AND sentence_en = 'Students can get a ten percent discount if they show their cards.' AND sentence_zh = '学生出示证件可以享受九折优惠。' AND target = 'discount';

UPDATE ielts_examples SET sentence_en = 'You need a mark of at least sixty per cent to pass the module.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'mark-1' AND sentence_en = 'You need a mark of at least sixty percent to pass the module.' AND sentence_zh = '这门课程模块至少要得百分之六十的分数才算通过。' AND target = 'mark';

UPDATE ielts_examples SET sentence_en = 'Service isn''t included, so people usually leave a tip of ten per cent.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tip-1' AND sentence_en = 'Service isn''t included, so people usually leave a tip of ten percent.' AND sentence_zh = '服务费不含在内,所以人们通常留百分之十的小费。' AND target = 'tip';
