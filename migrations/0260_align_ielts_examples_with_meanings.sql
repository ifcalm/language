-- Align IELTS example translations with the 0259 meanings, and restore the plug sense its example uses (see docs/ielts-review/meaning-fixes-0260.md).
UPDATE ielts_words SET meaning_zh = 'n. 插头;塞子 v. 堵塞;插上电源', updated_at = CURRENT_TIMESTAMP
WHERE id = 'plug' AND meaning_zh = 'n. 插头;塞子 v. 堵塞';

UPDATE ielts_examples SET sentence_zh = '看到小镇变化这么大,我大为惊讶。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'astonished-1' AND sentence_zh = '看到小镇变化这么大,我很震惊。';

UPDATE ielts_examples SET sentence_zh = '这座岛气候温暖宜人,是冬季热门的旅游目的地。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'balmy-1' AND sentence_zh = '这座岛气候温和宜人,是冬季热门的旅游目的地。';

UPDATE ielts_examples SET sentence_zh = '我们住在一家由当地夫妇经营、提供早餐的小旅馆。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'bed-and-breakfast-1' AND sentence_zh = '我们住在一家由当地夫妇经营的小民宿。';

UPDATE ielts_examples SET sentence_zh = '今天上午经理向我们说明了新项目的任务。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'brief-2' AND sentence_zh = '今天上午经理就新项目给我们做了简报。';

UPDATE ielts_examples SET sentence_zh = '太阳一落山,山里的空气就变得冷飕飕的。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'chilly-1' AND sentence_zh = '太阳一落山,山里的空气就变得寒冷。';

UPDATE ielts_examples SET sentence_zh = '弱势学生往往需要老师的额外帮助。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'disadvantaged-1' AND sentence_zh = '处于劣势的学生往往需要老师的额外帮助。';

UPDATE ielts_examples SET sentence_zh = '20 世纪 90 年代,手机使用量急剧上升。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'dramatic-1' AND sentence_zh = '20 世纪 90 年代,手机使用量剧烈上升。';

UPDATE ielts_examples SET sentence_zh = '移居外国的人可能很难离开家人和朋友。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'emigrant-1' AND sentence_zh = '移民可能很难离开家人和朋友。';

UPDATE ielts_examples SET sentence_zh = '大家都穿着化装舞会服来参加期末派对。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'fancy-dress-1' AND sentence_zh = '大家都穿着化装服来参加期末派对。';

UPDATE ielts_examples SET sentence_zh = '城市周围的绿带严格限制建房。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'green-belt-1' AND sentence_zh = '城市周围的绿化带严格限制建房。';

UPDATE ielts_examples SET sentence_zh = '酒店及餐饮业为年轻人提供了数百万个就业机会。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'hospitality-industry-1' AND sentence_zh = '酒店业为年轻人提供了数百万个就业机会。';

UPDATE ielts_examples SET sentence_zh = '每年有数千名年轻专业人士移民到这个国家。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'immigrate-1' AND sentence_zh = '每年有数千名年轻专业人士移入这个国家。';

UPDATE ielts_examples SET sentence_zh = '在许多欧洲国家,服兵役已不再是强制性的。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'obligatory-1' AND sentence_zh = '在许多欧洲国家,服兵役已不再是义务。';

UPDATE ielts_examples SET sentence_zh = '逾期未还的书要交一小笔费用。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'overdue-1' AND sentence_zh = '过期未还的书要交一小笔费用。';

UPDATE ielts_examples SET sentence_zh = '酒后驾车应受到更重的处罚。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'penalty-1' AND sentence_zh = '酒后驾车应受到更重的惩罚。';

UPDATE ielts_examples SET sentence_zh = '给冰箱插上电源后,等一小时再用。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'plug-2' AND sentence_zh = '给冰箱接通电源后,等一小时再用。';

UPDATE ielts_examples SET sentence_zh = '评价政客应该看行动,而不是承诺。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'politician-1' AND sentence_zh = '评价政治家应该看行动,而不是承诺。';

UPDATE ielts_examples SET sentence_zh = '批评者质疑这些旧法律与现代生活的关联性。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'relevance-1' AND sentence_zh = '批评者质疑这些旧法律与现代生活的相关性。';

UPDATE ielts_examples SET sentence_zh = '其他研究者未能复现最初那项研究的结果。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'replicate-1' AND sentence_zh = '其他研究者未能重现最初那项研究的结果。';

UPDATE ielts_examples SET sentence_zh = '教幼儿可能很累,但这是一份很值得做的工作。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'rewarding-1' AND sentence_zh = '教幼儿可能很累,但这是一份很有回报的工作。';

UPDATE ielts_examples SET sentence_zh = '住在大城市可能既吵闹又令人压力大。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'stressful-1' AND sentence_zh = '住在大城市可能既吵闹又有压力。';

UPDATE ielts_examples SET sentence_zh = '政府计划收紧对塑料袋使用的管制。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'tighten-1' AND sentence_zh = '政府计划加强对塑料袋使用的管制。';

UPDATE ielts_examples SET sentence_zh = '倾盆大雨引发滑坡,堵塞了主干道。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'torrential-1' AND sentence_zh = '暴雨引发滑坡,堵塞了主干道。';

UPDATE ielts_examples SET sentence_zh = '我和朋友要了一间两张床分开的双床房。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'twin-room-1' AND sentence_zh = '我和朋友要了一间有两张床的双人间。';

UPDATE ielts_examples SET sentence_zh = '那里的食物简单质朴,但味道很好。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'unsophisticated-1' AND sentence_zh = '那里的食物简单淳朴,但味道很好。';

UPDATE ielts_examples SET sentence_zh = '这项裁决令许多密切关注此案的人感到意外。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'verdict-1' AND sentence_zh = '这项判决令许多密切关注此案的人感到意外。';
