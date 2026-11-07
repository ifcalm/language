-- IELTS example review: 8 fixes (see docs/ielts-review/examples-fixes-0272.md).
UPDATE ielts_examples SET sentence_en = 'I''m not very adventurous, so I usually order the same dish when I eat out.', sentence_zh = '我不太爱冒险,所以在外面吃饭通常都点同一道菜。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'adventurous-1' AND sentence_en = 'I''m not very adventurous, so I usually order the same food every time.' AND sentence_zh = '我不太爱冒险,所以每次都点同样的食物。' AND target = 'adventurous';

UPDATE ielts_examples SET sentence_en = 'I''m content with a simple life and don''t need expensive things.', sentence_zh = '我满足于简单的生活,不需要昂贵的东西。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'content-1' AND sentence_en = 'I''m pretty content with my life at the moment, to be honest.' AND sentence_zh = '说实话,我对现在的生活挺满足的。' AND target = 'content';

UPDATE ielts_examples SET sentence_en = 'Delicate garments like this silk shirt should always be washed by hand.', sentence_zh = '像这件真丝衬衫这样娇贵的衣服一定要手洗。', target = 'garments', updated_at = CURRENT_TIMESTAMP
WHERE id = 'garment-1' AND sentence_en = 'That jacket is my favourite garment, and I''ve had it since I was eighteen.' AND sentence_zh = '那件夹克是我最喜欢的衣服,我十八岁起就有了。' AND target = 'garment';

UPDATE ielts_examples SET sentence_zh = '这种辣鱼汤是我们这一带的美味佳肴。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'delicacy-1' AND sentence_en = 'This spicy fish soup is a local delicacy in my part of the country.' AND sentence_zh = '这种辣鱼汤是我们这个地区的当地美味佳肴。' AND target = 'delicacy';

UPDATE ielts_examples SET sentence_zh = '我们当地的博物馆有一幅巨大的画,画的是从前的一个贵族家庭。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'noble-1' AND sentence_en = 'Our local museum has a huge painting of a noble family from the past.' AND sentence_zh = '我们当地的博物馆有一幅巨大的画,画的是过去的一个高贵家族。' AND target = 'noble';

UPDATE ielts_examples SET sentence_zh = '我喜欢前景里有些有趣东西的照片,比如花。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'foreground-1' AND sentence_en = 'I like photos with something interesting in the foreground, such as flowers.' AND sentence_zh = '我喜欢前景有趣的照片,比如前景是花朵。' AND target = 'foreground';

UPDATE ielts_examples SET sentence_en = 'My parents learned the waltz before their wedding, and they still dance it sometimes.', updated_at = CURRENT_TIMESTAMP
WHERE id = 'waltz-1' AND sentence_en = 'My parents learned to waltz before their wedding, and they still dance sometimes.' AND sentence_zh = '我父母婚前学了华尔兹,现在有时还会跳。' AND target = 'waltz';

UPDATE ielts_examples SET sentence_zh = '周五下班后,我喜欢和同事们聚一聚。', updated_at = CURRENT_TIMESTAMP
WHERE id = 'socialise-1' AND sentence_en = 'I like to socialise with my colleagues after work on Fridays.' AND sentence_zh = '我喜欢周五下班后和同事们交往聚会。' AND target = 'socialise';
