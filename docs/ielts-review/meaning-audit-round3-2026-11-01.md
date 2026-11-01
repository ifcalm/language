# 雅思词库释义第三轮核查(2026-11-01)

范围:D1 `ielts_words` 全部 4557 条,基于迁移 0260 之后的数据。这份清单已全部写入 D1(迁移 0261),3 句例句译文随之对齐(迁移 0262),对比表见 `meaning-fixes-0261.md`。

## 结论

上一轮写入 275 处后,释义里明显的错误已经很少。这一轮多部词典交叉核查,只发现 4 条释义有误导,另有 40 条用词、标记或近义词问题。其余 108 条是义项或词性不全,不算错误。

| 类别 | 条数 | 处理建议 |
|---|---|---|
| 释义不准或有误导 | 4 | 建议修改 |
| 用词、英美标记和格式 | 34 | 建议修改 |
| 近义词同释义无法区分 | 6 | 建议修改 |
| 缺少常用义项或词性 | 108 | 按需选用 |
| **合计** | **152** | |

词条后带 * 的是 0259 或 0260 改过的条目,这一轮再次调整。

## 核查方法

和前两轮的区别是,判断不再依赖单一来源。

| 证据 | 来源 | 用来发现什么 |
|---|---|---|
| 英汉正查 | 《牛津英汉汉英词典》、譯典通英漢雙向字典 | 释义用词是否有词典依据,首要义项是否被覆盖 |
| 汉英反查 | 《牛津英汉汉英词典》的汉英部分 | 中文词译回英文时,是否对得上这个英文词 |
| 英英释义 | Oxford Dictionary of English | 词性顺序、英式用法标记 |
| 例句词性 | 用 macOS 自然语言框架标注 4390 句例句中目标词的词性 | 只作线索:例句用到的词性,释义是否标了。标注有误差,不作为修改依据 |
| 中文规范 | 《现代汉语规范词典》 | 中文词是否规范,如“黏附” |
| 词族和同释义 | 程序比对 | 派生词释义是否脱节,近义词是否完全同义 |
| 补充来源 | 有道词典 | 只用于本地词典未收的词,或复核新用词 |

流程:

1. 全部 4557 条跑完上述信号,1514 条至少触发一个信号,全部人工裁决。0259 和 0260 改过的 275 条无条件复查。
2. 每条建议的新用词再核对一次词典。有 5 处不是词典原词:占……的比例、使加剧、虚假外表、水电煤气费、在……范围内变动,都是由词典释义或现有释义组合而成的说法。
3. 没有触发任何信号的 3043 条,随机抽 150 条逐条对照词典,没有发现错误或误导。这是抽样结果,不等于这部分完全没有问题。

判定标准:现有释义被词典支持且不误导的不改;词典有但雅思用不到的义项不补;解释性括号不再新增,只保留 (英)(美)、复数、不可数和介词等用法标记。

## 已知局限

- 这一轮中有 2893 条无信号词条没有逐条复读,只在第二轮读过。
- 裁决时词典内容按长度截断显示,义项极多的词靠后的义项可能没看到。
- “首要义项”依据词典的排列顺序,不是雅思真题的词频统计。
- 例句词性标注有误差。写入后发现 8 条理由误称例句用到了某个词性,已从理由中删除;这 8 条的释义修改本身有词典依据,没有变化。
- 本地词典内容只用于核查,报告里只摘录很短的片段。

## 写入时的连带影响

有 3 句例句的译文含这批改动要替换的说法,已在迁移 0262 中修正:

- nocturnal-1: 大多数蝙蝠是夜行性的,白天在洞穴里睡觉。
- rim-1: 我最喜欢的咖啡杯边缘有一道小裂纹。
- adhesive-1: 这种昆虫分泌一种天然粘合剂,把卵粘在叶子上。

## 一、释义不准或有误导

建议修改。中文意思和英文含义有偏差。

| 词条 | 所在话题 | 现在 | 建议 | 理由 | 牛津英汉 | 譯典通 |
|---|---|---|---|---|---|---|
| intellect | 阅读 · 医学与心理 | n. 才智,理智 | n. 才智,智力 | 牛津英汉和譯典通释义都是智力、思维能力,“理智”对应 reason | noun ① ( intelligence, faculty of reasoning )… | n. 1 智力 ； 理解力 ； 思维能力 2 非凡的才智，出众的才华 … |
| persuade | 阅读 · 学术高频动词 | v. 劝说 | v. 说服,劝说 | 牛津英汉和譯典通首义都是说服,persuade 强调说服成功,“劝说”不一定成功 | transitive verb ① ( influence ) 说服 ② ( convin… | vt. ( past persuaded , pp persuaded… |
| prosecute * | 写作 · 政府、法律与治理 | v. 提起公诉,检控 | v. 起诉,提起公诉 | 牛津英汉释义是起诉,上一轮去掉“起诉”过度,本词例句也译不起诉 | transitive verb ① Law 起诉 ② formal ( pursue ) … | vt. ( past prosecuted , pp prosecut… |
| trapezoid | 阅读 · 物质科学与数学 | n. 梯形 | n. 梯形(美) | 牛津英汉、譯典通和 ODE 都说明英式 trapezoid 指不规则四边形,梯形是美式义 | noun ① British ( with no sides parallel ) 不规则… | n. 1 【 英国英语 】 【 数学 】 不规则四边形 2 【 美国英… |

## 二、用词、英美标记和格式

建议修改。不影响词义理解,但能让词表前后一致、用词更规范。

| 词条 | 所在话题 | 现在 | 建议 | 理由 | 牛津英汉 | 譯典通 |
|---|---|---|---|---|---|---|
| adhere * | 阅读 · 学术高频动词 | v. 遵守,坚持(to);粘附 | v. 遵守,坚持(to);黏附 | 现代汉语规范词典和牛津英汉都写“黏附” | intransitive verb ① literal 黏附 ② figurative (… | vi. ( past adhered , pp adhered , p… |
| anticlockwise | 听力 · 旅游、交通与方位 | adv. 逆时针地 | adv. 逆时针地(英) | 牛津英汉和 ODE 都标注英式,美式说 counterclockwise,与词表其他英式词一致 | adjective , adverb British 逆时针的（地） nìshízhēn … | a. 反时针方向的 同义参见 backward |
| account for * | 阅读 · 逻辑关系与评价 | phr. 解释;占比 | phr. 解释,说明;占……的比例 | 上一轮的“占比”是名词,放在动词短语里不通 | account for your carelessness 总有一天你会因为自己的粗心大意… | account for his absence from school… |
| car park | 听力 · 旅游、交通与方位 | phr. 停车场 | phr. 停车场(英) | 牛津英汉和 ODE 都标注英式,美式说 parking lot,与词表其他英式词一致 | noun ( mainly British ) 停车场 | car park = parking lot |
| current account | 听力 · 购物、餐饮与银行 | phr. 活期账户 | phr. 活期账户(英) | 牛津英汉和 ODE 都标注英式,美式说 checking account | noun British 活期账户 | current account ph. 1 往来帐户 2 活期存款 |
| flatmate | 听力 · 住宿与租房 | n. 合租室友 | n. 合租室友(英) | 牛津英汉和 ODE 都标注英式,美式说 roommate | noun British 合住公寓套间者 |  |
| GP | 听力 · 健康、运动与休闲 | n. 全科医生 | n. 全科医生(英) | 牛津英汉和 ODE 都标注英式 | → GP abbreviation British = general practitio… | GP abbr. 1 = Gallup Poll ( 美国 ) 盖洛普… |
| nocturnal | 阅读 · 生命科学 | adj. 夜行性的 | adj. 夜间的,夜间活动的 | “夜行性的”是术语说法,牛津英汉释义是夜间的、夜间活动的 | adjective ( night-time ) 夜间的 ‹ activity , hab… | a. 1 夜的 ； 夜间发生的 2 夜间活动的 3 夜间开花的 衍生 … |
| postcode | 听力 · 住宿与租房 | n. 邮编 | n. 邮编(英) | 牛津英汉和 ODE 都标注英式,美式说 zip code | noun British 邮政编码 | n. 【 英国英语 】 邮递区号 ； 邮政编码 |
| roundabout | 听力 · 旅游、交通与方位 | n. 环岛 | n. 环岛(英) | 牛津英汉和 ODE 都标注英式,美式说 traffic circle | A. noun British ① ( in fairground ) 旋转木马 ② ( … | a. 1 绕道的 ； ( 说话，做事等 ) 绕圈子的，不直截了当的 2… |
| ring road | 听力 · 旅游、交通与方位 | phr. 环路 | phr. 环路(英) | 牛津英汉和 ODE 都标注英式,美式说 beltway | noun British 环路 |  |
| takeaway | 听力 · 购物、餐饮与银行 | n. 外卖 | n. 外卖(英) | 牛津英汉、譯典通和 ODE 都标注英式,美式说 takeout | British A. adjective 外卖的 ‹ food › B. noun ① (… | n. 【 英国英语 】 1 ( 从餐馆 ) 带出去吃的简便食物 ； 外… |
| state school | 写作 · 教育 | phr. 公立学校 | phr. 公立学校(英) | 牛津英汉和 ODE 都标注英式,美式说 public school | state school noun British 公立学校 |  |
| terraced house | 听力 · 住宿与租房 | phr. 联排房屋 | phr. 联排房屋(英) | 牛津英汉和 ODE 都标注英式,美式说 row house | , terrace house noun British 排屋 |  |
| utilities | 听力 · 住宿与租房 | n. 水电煤等公用事业费 | n. 公用事业;水电煤气费 | “水电煤等公用事业费”过长,牛津英汉和譯典通释义是公用事业 | A. noun ① ( usefulness ) 实用 ② ( also public u… | n. 1 效用，实用，功利 2 有用之物 3 公用事业 ； 公用事业公… |
| windscreen | 阅读 · 城市、经济与科技 | n. 挡风玻璃 | n. 挡风玻璃(英) | 牛津英汉和 ODE 都标注英式,美式说 windshield | noun British 挡风玻璃 |  |
| arrest | 写作 · 政府、法律与治理 | v./n. 逮捕 | n./v. 逮捕 | 词表统一把名词写在前面,写作 n./v. | A. transitive verb ① ( seize legally ) 逮捕 ② (… | vt. ( past arrested , pp arrested ,… |
| ban | 阅读 · 学术高频动词 | v./n. 禁止 | n./v. 禁止 | 词表统一把名词写在前面,写作 n./v. | A. transitive verb present participle banning… | n. 1 禁止 ； 禁令 2 褫夺公权的判决（或公告） 3 禁忌 4 … |
| broadcast | 写作 · 科技与媒体 | v./n. 广播 | n./v. 广播 | 词表统一把名词写在前面,写作 n./v. | A. noun 广播 . transitive verb past tense , pas… | vt. ( past broadcast , past broadca… |
| defeat | 阅读 · 语言与历史 | v./n. 击败 | n./v. 击败 | 词表统一把名词写在前面,写作 n./v. | A. noun ① and Military , Politics , Sport ( l… | vt. ( past defeated , pp defeated ,… |
| drift | 阅读 · 自然地理与气候 | v./n. 漂流,漂移 | n./v. 漂流,漂移 | 词表统一把名词写在前面,写作 n./v. | A. intransitive verb ① ( be carried by curren… | vi. ( past drifted , pp drifted , p… |
| escort | 听力 · 旅游、交通与方位 | v./n. 护送,陪同 | n./v. 护送,陪同 | 词表统一把名词写在前面,写作 n./v. | ① Military 护送部队 ; Nautical 护航舰 ; ( by police … | n. 1 护卫队 ； 护航队 ； 护航舰 ； 护航飞机 ； 仪队 2 … |
| halt | 阅读 · 学术高频动词 | v./n. 停止 | n./v. 停止 | 词表统一把名词写在前面,写作 n./v. | A. noun ① ( stop ) 停止 ② ( pause for rest ) 暂停… | n. 1 暂停，停止 ； 终止 2 【 英国英语 】 ( 铁路 ) 小… |
| overlap | 阅读 · 学术高频动词 | v./n. 重叠,交叠 | n./v. 重叠,交叠 | 词表统一把名词写在前面,写作 n./v. | present participle overlapping past tense, pa… | vt. ( past overlapped , pp overlapp… |
| paraphrase | 听力 · 校园学习与研究 | v./n. 改述,释义 | n./v. 改述,释义 | 词表统一把名词写在前面,写作 n./v. | A. noun 释义 . transitive verb 解释 ‹ poem , pass… | n. 1 释义，意译，改述 2 演释曲 vt. ( past para… |
| patrol | 写作 · 政府、法律与治理 | v./n. 巡逻 | n./v. 巡逻 | 词表统一把名词写在前面,写作 n./v. | A. noun ① and ( surveillance, activity ) 巡逻 ②… | n. 1 巡逻，侦察 2 巡逻兵 3 巡逻队 ； 巡逻舰队 ； 巡逻机… |
| regret | 口语 · 情感与态度 | v./n. 后悔 | n./v. 后悔 | 词表统一把名词写在前面,写作 n./v. | A. transitive verb present participle regrett… | vt. ( past regretted , pp regretted… |
| rescue | 阅读 · 学术高频动词 | v./n. 营救 | n./v. 营救 | 词表统一把名词写在前面,写作 n./v. | A. transitive verb ① ( save from danger ) 解救 … | vt. ( past rescued , pp rescued , p… |
| sneeze | 听力 · 健康、运动与休闲 | v./n. 打喷嚏 | n./v. 打喷嚏 | 词表统一把名词写在前面,写作 n./v. | A. intransitive verb 打喷嚏 . noun ( act ) 喷嚏 ; … | n. 喷嚏（声） vi. ( past sneezed , pp sn… |
| split | 阅读 · 学术高频动词 | v./n. 分裂;分摊 | n./v. 分裂;分摊 | 词表统一把名词写在前面,写作 n./v. | A. transitive verb present participle splitti… | vt. ( past split , pp split , prese… |
| swap | 听力 · 购物、餐饮与银行 | v./n. 交换,调换 | n./v. 交换,调换 | 词表统一把名词写在前面,写作 n./v. | A. transitive verb present participle swappin… | vt. ( past swapped , pp swapped , p… |
| upgrade | 阅读 · 城市、经济与科技 | v./n. 升级 | n./v. 升级 | 词表统一把名词写在前面,写作 n./v. | ① ( improve ) 改进 ‹ product , machinery › ② ( … | n. 1 上坡 2 升级 ； 提高品级（或标准） vt. ( past… |
| vote | 写作 · 政府、法律与治理 | v./n. 投票 | n./v. 投票 | 词表统一把名词写在前面,写作 n./v. | A. noun ① ( choice ) 票 ② ( ballot ) 投票 ③ ④ ( … | n. 1 选举，投票，表决 2 票，选票 16 votes in fa… |
| worship | 阅读 · 语言与历史 | v./n. 崇拜 | n./v. 崇拜 | 词表统一把名词写在前面,写作 n./v. | A. noun ① Religion ( veneration ) 敬神 ② ( reli… | n. 1 崇拜 ； 敬仰 ； 敬神 2 礼拜，礼拜仪式 3 【 英国英… |

## 三、近义词同释义无法区分

建议修改。只收词典释义确实不同的组。

| 词条 | 所在话题 | 现在 | 建议 | 理由 | 牛津英汉 | 譯典通 |
|---|---|---|---|---|---|---|
| barrel * | 阅读 · 城市、经济与科技 | n. 桶 | n. 大桶;一桶 | 和 bucket 同译“桶”,譯典通释义是大桶和一桶的量,石油计量单位也用 | A. noun ① ( for wine, beer ) 桶 ② ( measure of… | n. 1 ( 中间粗两端细的 ) 大桶 2 一桶的量 ； ( 液量单位… |
| boom | 阅读 · 城市、经济与科技 | n. 繁荣 | n. 繁荣,暴涨 | 和 prosperity 同译“繁荣”,牛津英汉释义含暴涨,boom 强调突然激增 | A. noun ① ( of artillery, thunder, sea, waves… | n. 1 ( 雷，大炮等的 ) 隆隆声 ； ( 波浪的 ) 澎湃声 ；… |
| rim | 口语 · 物品与地点 | n. 边缘 | n. 边沿 | 和 brink 同译“边缘”,牛津英汉释义是边沿,常指杯沿等圆形物的边 | A. noun ① ( of container ) 边沿 ② ( of wheel ) … | n. 1 ( 尤指圆形物的 ) 边，缘 ； 边缘 2 ( 镶在器物周围… |
| flaw | 阅读 · 学术论证与抽象概念 | n. 缺陷 | n. 缺陷,瑕疵 | 和 defect 同译“缺陷”,牛津英汉首义是瑕疵 | A. noun ① ( imperfection ) ( in textile, gem … | n. 1 裂隙 ； 裂缝 2 缺点 ； 瑕疵 vt. ( past f… |
| fee | 听力 · 购物、餐饮与银行 | n. 费用 | n. 服务费,费用 | 和 expense 同译“费用”,牛津英汉首义是服务费 | noun ① ( for professional, artistic service )… | n. 1 ( 付给律师，医生等的 ) 酬金，服务费 2 费用（如学费，… |
| expense | 阅读 · 城市、经济与科技 | n. 费用 | n. 费用,开支 | 和 fee 同译“费用”,牛津英汉和譯典通都有开销义 | A. noun ① ( cost ) 费用 ② ( loss ) 代价 ③ ( cause… | n. 1 费用 ； 价钱 ； 支出 ； 消耗 2 开支 ； 经费 3 … |

## 四、缺少常用义项或词性

按需选用。现有释义没有错,只是不完整。全部加上后词卡会变长。

| 词条 | 所在话题 | 现在 | 建议 | 理由 | 牛津英汉 | 譯典通 |
|---|---|---|---|---|---|---|
| access | 写作 · 科技与媒体 | n./v. 访问,获取 | n. 使用权,机会;入口 v. 访问,获取 | 名词 have access to 是使用的权利或机会,牛津英汉和譯典通都没有“访问”作名词义 | A. noun ① ( means of entry ) 入口 ② ( ability t… | n. 1 接近，进入 ； 接近的机会，进入的权利 ； 使用 2 通道，… |
| accessory | 口语 · 人物:性格与外貌 | n. 配饰 | n. 配件,附件;配饰 | 牛津英汉和譯典通首义都是附件,现在只有配饰 | A. noun ① ( piece of equipment ) 附件 ② Clothin… | n. 1 附件，配件 ； 附加物件 2 妇女饰品 ； 房间陈设 3 从… |
| accent | 阅读 · 语言与历史 | n. 口音 | n. 口音;重音 | 牛津英汉和譯典通都有重音义,语言学阅读常见 | ① ( general ) 口音 ② Linguistics , Music ( stre… | n. 1 重音 ； 重音符号 2 口音，腔调 3 语调，声调 4 强调… |
| address | 阅读 · 学术高频动词 | v. 处理,应对 | v. 处理,应对;发表演说 n. 地址 | 三部词典首义都是名词地址,发表演说也是常用义 | A. noun ① ( place of residence ) 地址 ② ( speec… | n. 1 住址，地址 2 ( 信封等上的 ) 姓名和地址 3 演说，致… |
| adhesive | 阅读 · 物质科学与数学 | n. 粘合剂 | n. 黏合剂 adj. 黏合的 | 牛津英汉和譯典通都先列形容词,规范写法是“黏合剂” | A. adjective 黏合的 . noun 黏合剂 | a. 黏的 ； 黏着的 ； 有黏性的 n. 胶黏剂 ； 黏着剂 衍生 … |
| affinity | 写作 · 家庭、社会与老龄化 | n. 亲近感 | n. 喜爱,亲近感;类同 | 牛津英汉和譯典通都有喜爱和类同义,现在只有亲近感 | noun ① ( resemblance ) 类同 ② ( liking, attract… | n. 1 喜好，本性，倾向 2 姻亲关系 ； 密切关系 3 ( 语言、… |
| appropriate | 阅读 · 逻辑关系与评价 | adj. 恰当的 | adj. 恰当的 v. 占用,挪用 | 三部词典都有动词义,阅读里 appropriate funds 指挪用 | ① ( suitable ) 合适的 ② ( relevant ) 有关的 ‹ depar… | a. ( er more appropriate , est most… |
| assault | 写作 · 政府、法律与治理 | n. 袭击 | n./v. 袭击 | 三部词典都有动词义,ODE 和牛津英汉先列动词 | A. transitive verb ① Law 袭击 ② figurative ( cr… | n. 1 攻击，袭击 ； 谴责，抨击 2 【 法律 】 侵犯人身 3 … |
| assignment | 听力 · 校园学习与研究 | n. 作业 | n. 作业;任务;分配 | 牛津英汉和譯典通首义都是任务,现在只有作业 | noun ① ( task, piece of work ) 任务 ② School , … | n. 1 ( 分派的 ) 任务 ； 工作 2 ( 课外 ) 作业，功课… |
| bend | 听力 · 旅游、交通与方位 | n. 弯道 | n. 弯道 v. 弯曲 | 三部词典首义都是动词弯曲,现在只有名词 | A. transitive verb past tense, past participl… | vt. ( past bent , pp bent , present… |
| bleach | 阅读 · 物质科学与数学 | n. 漂白剂 | n. 漂白剂 v. 漂白 | 三部词典都有动词义 | A. noun and ① ( also household bleach ) 漂白剂 ②… | vt. ( past bleached , pp bleached ,… |
| bloom | 阅读 · 生命科学 | v. 开花 | n. 花;开花期 v. 开花 | 三部词典都有名词义 | A. noun ① ( flower ) 花 ② ③ ( on skin, fruit )… | n. 1 ( 尤指观赏的 ) 花 ； ( 一棵树或一季内开的 ) 全部… |
| brief * | 听力 · 校园学习与研究 | adj. 简短的 n. 任务说明 v. 简要介绍 | adj. 短暂的;简短的 n. 任务说明 v. 简要介绍 | 牛津英汉和譯典通首义都是短暂的,a brief visit 现在没有覆盖 | A. adjective ① ( lasting a short time ) 短暂的 ‹… | a. ( er briefer , est briefest ) 1 … |
| brilliant | 口语 · 人物:性格与外貌 | adj. 杰出的;聪明的 | adj. 杰出的,聪明的;明亮的 | ODE 和牛津英汉首义都是明亮的,现在只有才华义 | adjective ① ( shining ) 明亮的 ‹ sunshine , diam… | a. ( er more brilliant , est most b… |
| ancient | 阅读 · 语言与历史 | adj. 古代的 | adj. 古代的,古老的 | 牛津英汉和譯典通都有古老的,ancient custom 不一定指古代 | A. adjective ① ( dating from BC ) 古代的 ; ( dat… | a. ( er more ancient , est most anc… |
| ambitious | 口语 · 人物:性格与外貌 | adj. 有抱负的 | adj. 有抱负的,雄心勃勃的 | 譯典通首义是有雄心的,an ambitious plan 指计划雄心勃勃 | adjective ① ( full of ambition ) 有志向的 ② ( dif… | a. ( er more ambitious , est most a… |
| argument | 阅读 · 学术论证与抽象概念 | n. 论点;争论 | n. 论点,理由;争论,争吵 | 牛津英汉和譯典通首义都是争吵,口语 have an argument 是吵架 | noun ① and ( quarrel ) 争吵 ② and ( discussion … | n. 1 争执，争吵 ； 辩论 2 理由，论据 ； 论点 3 说理 ；… |
| attachment | 写作 · 家庭、社会与老龄化 | n. 依恋 | n. 依恋;附件 | 牛津英汉和譯典通都有附件义,邮件附件是日常用法 | noun ① ( affection ) 爱慕 ; ( devotion ) 忠诚 ② (… | n. 1 连接 ； 安装 ； 附着 2 附属物 ； 附件 ； 附加装置… |
| caravan | 听力 · 旅游、交通与方位 | n. 房车 | n. 房车(英);商队 | 牛津英汉和 ODE 都标注房车义为英式,譯典通首义是商队,历史阅读常见 | noun ① British ( for touring, holidays ) 活动房车… | n. 1 ( 来往于沙漠的 ) 商队，香客队伍，移民队伍 2 ( 移动… |
| ceramic | 口语 · 物品与地点 | n. 陶瓷 | n. 陶瓷 adj. 陶瓷的 | 三部词典都有形容词义,本词例句也用作形容词 | A. adjective 陶瓷的 . ceramics plural noun ① plu… | a. 陶器的 ； 制陶艺术的 |
| cheerful | 口语 · 人物:性格与外貌 | adj. 开朗的 | adj. 开朗的,高兴的 | 牛津英汉和譯典通首义都是高兴的,现在只有性格义 | adjective ① ( happy ) 高兴的 ‹ smile , dispositi… | a. ( er more cheerful , est most ch… |
| classics | 写作 · 教育 | n. 经典著作 | n. 经典著作;古典学 | 牛津英汉有古典学课程义,英国大学常见专业 | noun ① plus plural verb ( classical works ) (… | a. 1 最优秀的，第一流的 2 典型的 3 经典的 4 古典的，古希… |
| collateral | 听力 · 购物、餐饮与银行 | n. 抵押品 | n. 抵押品 adj. 附带的 | 牛津英汉和譯典通都有形容词义,collateral damage 是常见搭配 | A. adjective ① ( subordinate ) 附带的 ‹ evidence… | a. 1 并行的 2 附属的，附带的 3 旁系的 ； 间接的 4 担保… |
| compound | 阅读 · 物质科学与数学 | n. 化合物 | n. 化合物 adj. 复合的 v. 使加剧 | 三部词典都有形容词和动词义,compound the problem 是阅读常见用法 | ① ( enclosure with buildings ) 有围墙的建筑群 ② Sout… | n. 1 混合物 ； 化合物 ； 复合物 2 复合字，复合句 a. 1… |
| condone | 写作 · 政府、法律与治理 | v. 纵容 | v. 容忍,纵容 | 牛津英汉释义是容忍,ODE 释义是接受不良行为,只写“纵容”语气过重 | transitive verb ① ( tolerate ) 容忍 ‹ terrorism… | vt. ( past condoned , pp condoned ,… |
| convict | 写作 · 政府、法律与治理 | v. 定罪 | v. 定罪 n. 囚犯 | 牛津英汉有名词囚犯义,历史话题常见 | « judge , jury , court » 判决…有罪 … . intransiti… | vt. ( past convicted , pp convicted… |
| cost | 阅读 · 城市、经济与科技 | n. 成本 | n. 成本,费用;代价 v. 花费 | 三部词典都有动词和代价义,现在只有成本 | A. transitive verb past tense, past participl… | n. 1 费用 ； 成本 2 代价 ； 损失 3 【 法律 】 诉讼费… |
| cruise | 听力 · 旅游、交通与方位 | n. 游轮旅行 | n. 游轮旅行 v. 乘船游览 | 三部词典都先列动词 | A. intransitive verb ① ( sail for pleasure ) … | vi. ( past cruised , pp cruised , p… |
| complaint | 写作 · 政府、法律与治理 | n. 投诉 | n. 投诉,抱怨 | 牛津英汉和譯典通首义都是抱怨,投诉只是其中一种 | noun ① and ( general ) 抱怨 ; ( official ) 抗议 ②… | n. 1 抱怨 ； 抗议 ； 怨言 ； 抱怨的缘由 2 【 法律 】 … |
| celestial | 阅读 · 物质科学与数学 | adj. 天体的 | adj. 天空的,天体的;天国的 | 牛津英汉和譯典通都有天空的、天国的,celestial body 才是天体 | adjective ① ( heavenly ) 天国的 ② ( of the sky )… | a. 1 天的，天空的 2 天国的 ； 神圣的 3 精妙的 ； 极佳的… |
| delicacy | 口语 · 物品与地点 | n. 美味佳肴 | n. 美味佳肴;精致;微妙 | 牛津英汉首义是精致,譯典通也有微妙义,现在只有佳肴 | noun ① ( of beauty, features ) 精致 ; ( of colo… | n. 1 精美 ； 柔软 ； 娇嫩 ； 优雅 2 灵敏，敏感 ； 灵巧… |
| desert | 阅读 · 自然地理与气候 | n. 沙漠 | n. 沙漠 v. 抛弃,遗弃 | 三部词典都有动词义,ODE 和牛津英汉先列动词 | A. transitive verb ① ( abandon ) 抛弃 ‹ friend … | n. 沙漠 ； 荒野 a. 1 沙漠的 2 荒芜的 ； 无人居住的 n… |
| design | 阅读 · 学术高频动词 | v. 设计 | n./v. 设计 | 三部词典都有名词义,现在只标动词 | A. noun ① ( arrangement, conception ) 设计 ② ( … | vt. ( past designed , pp designed ,… |
| dip | 写作 · 小作文:图表与流程 | n./v. 小幅下降 | n./v. 小幅下降;蘸,浸 | 牛津英汉和譯典通首义都是浸、蘸,现在只有图表义 | Dip abbreviation = diploma // A. transitive v… | vt. ( past dipped , pp dipped , pre… |
| double | 写作 · 小作文:图表与流程 | v. 翻倍 | v. 翻倍 adj. 两倍的 | 三部词典首义都是形容词,现在只有动词 | A. adjective ① ( intended for two ) 供两者用的 ② (… | a. 1 两倍的 ； 加倍的 2 双的 ； 成双的 ； 双层的 3 两… |
| elective | 听力 · 校园学习与研究 | n. 选修课 | n. 选修课 adj. 选修的 | 牛津英汉和譯典通都有形容词义 | A. adjective ① ( elected ) 选举产生的 ‹ post , ass… | a. 选举的 ； 选修的 n. 【 美国英语 】 选修课程 衍生 ad… |
| editorial | 写作 · 科技与媒体 | n. 社论 | n. 社论 adj. 编辑的 | 牛津英汉和譯典通都有形容词义,editorial team 常见 | A. noun 社论 . adjective 编辑的 | a. 1 编辑（上）的 ； 编者的 ； 主管的 2 社论的 ； 社论式… |
| exploit | 阅读 · 学术高频动词 | v. 开发;剥削 | v. 开发,利用;剥削 n. 功绩 | 牛津英汉有利用义,exploit an opportunity 不是开发;三部词典都有名词功绩 | 英雄业绩 . transitive verb \| BrE ɪkˈsplɔɪt , ɛkˈs… | n. 1 功绩，功勋 ； 辉煌的成就 ； 英勇的行为 2 【 电脑 】… |
| expressive | 口语 · 人物:性格与外貌 | adj. 善于表达的 | adj. 富有表现力的,善于表达的 | 牛津英汉首义是富有表情的,本词例句是脸很有表现力 | adjective ① ( showing thought, feeling ) 富有表情… | a. 1 表现的 ； 表达……的 2 表情丰富的 ； 意味深长的 n.… |
| extract | 写作 · 小作文:图表与流程 | v. 提取 | v. 提取 n. 摘录 | 三部词典都有名词义,阅读 an extract from 常见 | ① ( pull out ) 取出 ‹ bullet › ; 挑出 ‹ splinter … | vt. ( past extracted , pp extracted… |
| facade | 阅读 · 城市、经济与科技 | n. 建筑正面 | n. 建筑正面;虚假外表 | 牛津英汉和譯典通都有比喻义,阅读常见 | noun ① literal ( of a building ) 正面 ② figurat… | n. 1 ( 建筑物的 ) 正面 ； 前面 2 表面 ； 外观 |
| fancy | 口语 · 物品与地点 | adj. 花哨的;高档的 | adj. 花哨的;高档的 v. 想要(英) | 牛津英汉首义是英式动词想要,口语 fancy doing 常见 | A. transitive verb ① British informal ( wish … | n. 1 爱好 ； 迷恋 2 想像 ； 想像力 ； 幻想 3 想法 ；… |
| favour | 阅读 · 学术高频动词 | v. 支持,偏爱 | v. 支持,偏爱 n. 赞同;恩惠 | 牛津英汉和 ODE 都有名词义,do someone a favour 是常用说法 | A. noun ① ( approval ) 赞同 ② ( preferential tr… | = favor (→ favor ) |
| folk | 写作 · 全球化、文化与旅游 | adj. 民间的 | n. 人们 adj. 民间的 | 三部词典首义都是名词人们 | A. plural noun ① informal ( people ) 人们 ② fol… | n. 1 ( 某一民族，种族或社会阶层中的 ) 广大成员 ； ……人 … |
| gut | 阅读 · 医学与心理 | n. 肠道 | n. 肠道;勇气 adj. 本能的 | 牛津英汉和譯典通都有勇气义,gut feeling 是常用说法 | A. noun ① guts plural informal ( insides ) 内脏… | n. 1 肠，肠子 2 内脏 3 【 口语 】 勇气，胆量，毅力 4 … |
| hatch | 阅读 · 生命科学 | v. 孵化 | v. 孵化;策划 n. 舱口 | 三部词典都有舱口和策划义 | A. noun ① Nautical , Aviation 舱口 ② ( in house… | vt. ( past hatched , pp hatched , p… |
| implement | 阅读 · 学术高频动词 | v. 实施 | v. 实施 n. 工具 | 三部词典首义都是名词工具 | 工具 . transitive verb \| BrE ˈɪmplɪmɛnt , AmE ˈ… | n. 1 工具 ； 器具 ； 用具 2 装备 ； 家具 3 手段 ； … |
| flight | 听力 · 旅游、交通与方位 | n. 航班 | n. 航班;飞行 | 三部词典首义都是飞行,动物和航空话题常见 | A. noun ① ( flying ) 飞 ② ( of bird, insect, p… | n. 1 飞翔，飞行 2 ( 飞机的 ) 班次 ； ( 某班次的 ) … |
| indifferent | 口语 · 情感与态度 | adj. 冷漠的 | adj. 冷漠的,漠不关心的 | 牛津英汉和譯典通首义都是不关心,本词例句是无所谓 | adjective ① ( unconcerned ) 漠不关心的 ② ( mediocr… | a. 1 不感兴趣的 ； 不关心的 ； 冷淡的 2 不偏不倚的 ； 中… |
| instant | 写作 · 科技与媒体 | adj. 即时的 | adj. 即时的;速溶的 | 牛津英汉和譯典通都有速食义,instant coffee 是日常用法 | A. adjective ① ( immediate ) 立刻的 ② attributiv… | a. 1 立即的，即刻的 2 紧迫的，迫切的 ； 迫在眉睫的 3 ( … |
| khaki | 口语 · 物品与地点 | adj. 卡其色的 | n. 卡其布 adj. 卡其色的 | 牛津英汉和 ODE 都先列名词 | A. noun ① ( textile ) 卡其布 ② ( colour ) 暗绿色 . … | a. 1 土黄色的，卡其色的 2 卡其布做的 n. 1 卡其色 2 卡… |
| lift | 听力 · 住宿与租房 | n. 电梯(英) | n. 电梯(英) v. 举起;解除 | 三部词典首义都是动词,lift a ban 是阅读常见用法 | A. transitive verb ① ( pick up ) 拿起 ‹ plate ,… | vt. ( past lifted , pp lifted , pre… |
| major | 听力 · 校园学习与研究 | n. 主修专业 v. 主修 | adj. 主要的,重要的 n. 主修专业 v. 主修 | 三部词典首义都是形容词,这是最常用的义项 | A. adjective ① ( important ) 重要的 ② ( serious … | a. 1 ( 数量大小称度等 ) 较大的 ； 较多的 ； 较大范围的 … |
| materialism | 写作 · 家庭、社会与老龄化 | n. 物质主义 | n. 物质主义;唯物主义 | 牛津英汉和譯典通都有唯物主义义,哲学阅读常见 | noun ① ( desire for material possessions ) 实利… | n. 1 唯物论 ； 唯物主义 2 实利主义 衍生 n. materi… |
| monitor | 阅读 · 学术高频动词 | v. 监控 | v. 监控,监测 n. 显示器,监测器 | 三部词典首义都是名词 | A. noun ① ( TV screen ) 电视监视屏 ; ( computer sc… | n. 1 【 电脑 】 显示器 ； 荧幕 2 ( 学校的 ) 班长，级… |
| musical | 写作 · 科技与媒体 | n. 音乐剧 | n. 音乐剧 adj. 音乐的 | 三部词典首义都是形容词 | A. adjective ① ( relating to music ) 音乐的 ② ( … | a. 1 音乐的，关于音乐的 2 音乐般的，美妙的，悦耳的 3 喜爱音… |
| integrate | 阅读 · 学术高频动词 | v. 整合 | v. 整合,融入 | integrate into society 是写作常见用法,牛津英汉释义是使融入 | A. transitive verb ① ( incorporate ) 使成为一体 ② … | vt. ( past integrated , pp integrat… |
| involve | 阅读 · 学术高频动词 | v. 涉及 | v. 涉及;使参与 | 牛津英汉和譯典通都有使参与义,be involved in 是高频用法 | transitive verb ① ( entail ) 需要 ② ( affect ) … | vt. ( past involved , pp involved ,… |
| outline | 听力 · 校园学习与研究 | n. 大纲 | n. 大纲,概要;轮廓 v. 概述 | 牛津英汉和譯典通首义都是轮廓,都有动词概述义 | A. noun ① ( of object ) ( of mountain, tree, … | n. 1 外形 ； 轮廓 2 略图 ； 素描 3 提纲，概要 ； 要点… |
| overall | 写作 · 小作文:图表与流程 | adj. 总体的 | adj. 总体的 adv. 总体上 | 写作小作文 Overall 开头是副词用法,三部词典都有,本词例句也用作副词 | 总体的 ‹ effect , performance , impression › ; 综… | n. 1 工作裤 2 【 英国英语 】 工作服 ； 防护服 ； ( 妇… |
| peer | 阅读 · 医学与心理 | n. 同龄人 | n. 同龄人,同行 v. 盯着看 | 牛津英汉和 ODE 都先列动词,peer review 的 peer 指同行 | intransitive verb 仔细看 // noun ① ( equal in ra… | vi. ( past peered , pp peered , pre… |
| perspective | 阅读 · 学术论证与抽象概念 | n. 视角 | n. 视角,观点;透视法 | 牛津英汉和譯典通都有观点和透视义 | noun ① ( in art ) 透视法 ② ( attitude, point of … | n. 1 透视图法，远近画法 2 透视图 3 看法，观点 4 洞察力，… |
| pottery | 听力 · 健康、运动与休闲 | n. 陶艺 | n. 陶艺;陶器 | 牛津英汉和譯典通都有陶器义,历史阅读常见 | noun ① ( craft ) 制陶手艺 ; ( profession ) 制陶行业 ②… | n. 1 陶器 2 陶器制造术 3 陶器厂 同义参见 china |
| recharge | 口语 · 兴趣与生活方式 | v. 恢复精力 | v. 充电;恢复精力 | 牛津英汉和 ODE 释义都是充电,“恢复精力”是引申义,基本义不能缺 | transitive verb 给…充电 … | vt. ( past recharged , pp recharged… |
| refreshing | 口语 · 情感与态度 | adj. 令人耳目一新的 | adj. 令人耳目一新的;提神的 | 牛津英汉和譯典通首义都是提神的 | adjective ① ( invigorating ) 提神的 ‹ drink , br… | a. ( er more refreshing , est most … |
| release | 写作 · 政府、法律与治理 | v. 释放;发布 | n./v. 释放;发布 | 三部词典都有名词义,本词例句也用作名词 | A. transitive verb ① ( set free ) 释放 ‹ person… | vt. ( past released , pp released ,… |
| reserve | 听力 · 校园学习与研究 | v. 预约,预留 n. 保护区 | v. 预约,预留 n. 保护区;储备 | 牛津英汉首义是储备,oil reserves 阅读常见 | A. noun ① and ( of oil, food, parts, ammuniti… | vt. ( past reserved , pp reserved ,… |
| rigid | 阅读 · 逻辑关系与评价 | adj. 严格的;僵化的,死板的 | adj. 严格的;僵化的,死板的;坚硬的 | 牛津英汉和 ODE 首义都是坚硬、不易弯曲,材料话题常见 | adjective ① ( stiff, firm ) 坚硬的 ‹ structure ,… | a. ( er more rigid , est most rigid… |
| solvent | 阅读 · 物质科学与数学 | n. 溶剂 | n. 溶剂 adj. 有偿付能力的 | 牛津英汉和 ODE 都先列形容词,经济阅读常见 | A. adjective ① ( able to meet financial oblig… | a. 1 有偿付能力的 2 有溶解力的 n. 1 溶媒，溶剂 2 解决… |
| strand * | 阅读 · 医学与心理 | n. 股,缕;链 | n. 股,缕;链 v. 使搁浅 | 三部词典都有动词义,be stranded 是常用说法 | A. transitive verb ① ( leave or drive ashore … | n. 海滨，海滩 ； 河岸 ； 湖滨 vt. ( past stran… |
| swarm | 阅读 · 生命科学 | n. 虫群 | n. 虫群,一大群 | 牛津英汉和譯典通都有一大群义,不只指虫 | A. noun ① ( large group of insects ) 一大群 ② ( … | n. 1 ( 昆虫等的 ) 群 ； 蜂群 2 ( 密集的 ) 一大群，… |
| tap | 阅读 · 学术高频动词 | v. 开发利用;轻拍 | v. 开发利用;轻拍 n. 水龙头(英) | 牛津英汉首义是英式名词水龙头,听力房屋话题常见 | A. noun ① ( mainly British ) ( faucet ) 龙头 ② … | vt. ( past tapped , pp tapped , pre… |
| terminal | 听力 · 旅游、交通与方位 | n. 航站楼;终点站 | n. 航站楼;终点站 adj. 晚期的 | 三部词典都有形容词义,terminal illness 是常见搭配 | A. adjective ① ( fatal ) 晚期的 ‹ disease , canc… | a. 1 末端的 ； 终点的 ； 极限的 2 每期的，定期的 ； 学期… |
| tip | 听力 · 购物、餐饮与银行 | n. 小费;提示,建议 v. 给小费 | n. 小费;提示,建议;尖端 v. 给小费 | 牛津英汉和譯典通首义都是尖端,the tip of the iceberg 常见 | A. noun ① ( end ) ( of stick, umbrella, sword… | n. 1 顶端 ； 尖端 2 ( 鸟或飞机的 ) 翼尖 3 顶端附加的… |
| token | 听力 · 健康、运动与休闲 | n. 代币;象征 | n. 代币;象征 adj. 象征性的 | 牛津英汉和譯典通都有形容词义 | A. noun ① ( for machine, phone ) ( of metal )… | n. 1 标记，标志 ； 象征 2 纪念品 3 代价券，（代币）筹码 … |
| reward | 阅读 · 医学与心理 | n. 奖励 | n./v. 奖励;回报 | 牛津英汉和譯典通都有动词和回报义 | A. noun ① ( recompense ) 报偿 ② ( money ) 酬金 ③ … | n. 1 报答 ； 报偿 ； 奖赏 ； 报应 2 酬金 ； 赏金 ； … |
| resolution | 阅读 · 学术论证与抽象概念 | n. 决议;解决;分辨率 | n. 决心;决议;解决;分辨率 | 牛津英汉和譯典通首义都是决心,New Year's resolution 是常用说法 | noun ① ( determination ) 坚定 ② ( decision ) 决心… | n. 1 决心 ； 决定 2 ( 会议等的 ) 正式决定，决议 3 分… |
| trick | 口语 · 兴趣与生活方式 | n. 戏法;诀窍 | n. 戏法;诀窍;诡计 v. 欺骗 | 牛津英汉和譯典通首义都是诡计,都有动词义 | A. noun ① ( cunning or deceitful act ) 诡计 ; (… | n. 1 诡计 ； 骗局 ； 谋略 ； 花招 2 恶作剧 3 轻率愚蠢… |
| triple | 写作 · 小作文:图表与流程 | v. 增至三倍 | v. 增至三倍 adj. 三倍的 | 三部词典首义都是形容词,现在只有动词 | A. adjective ① ( having three parts ) 有三部分的 ‹… | a. 1 三倍的 ； 三重的 2 由三部分构成的 ； 三方的 n. 1… |
| underground | 听力 · 旅游、交通与方位 | n. 地铁(英) | n. 地铁(英) adj. 地下的 | 三部词典首义都是形容词地下的 | ① ( below ground ) 地下的 ② ( secret ) 秘密的 . adv… | a. 1 地下的，地面下的 2 秘密的，不公开的 3 ( 电影，戏剧等… |
| update | 阅读 · 学术高频动词 | v. 更新 | v. 更新 n. 最新消息 | 三部词典都有名词义,give an update 是常用说法 | 更新 . noun \| BrE ˈʌpdeɪt , AmE ˈəpˌdeɪt \| 最新报道 | vt. ( past updated , pp updated , p… |
| vintage | 口语 · 物品与地点 | adj. 复古的 | adj. 复古的,老式的 n. 酿造年份 | 牛津英汉和譯典通首义都是酿造年份,“老式的”也在牛津英汉释义内 | A. noun ① ( year, season ) 酿造年份 ② ( wine ) [ … | n. 1 ( 优良品牌的 ) 葡萄酒 2 葡萄收获或酿酒季节 3 葡萄… |
| wage * | 听力 · 工作与求职 | n. 工资 | n. 工资 v. 发动 | wage war、wage a campaign 是阅读常见动词用法,牛津英汉有此义 | A. noun B. transitive verb 发动 ‹ campaign › | n. 1 薪水 ； 报酬 2 【 古语 】 ( 罪恶的 ) 代价，报应… |
| intersection | 听力 · 旅游、交通与方位 | n. 十字路口 | n. 十字路口;交点 | 牛津英汉首义是交点,数学和图表话题常见,和 intersect 相交义对应 | noun ① ( point of connection ) 交点 ② ( road ju… | n. 1 横断，交叉 2 交叉点 ； 道路交叉口 ； 十字路口 3 【… |
| crossroads | 听力 · 旅游、交通与方位 | n. 十字路口 | n. 十字路口;关键时刻 | 牛津英汉和譯典通都有比喻义 at a crossroads,和 intersection 也能区分 | noun plural crossroads ① literal 十字路口 ② figur… | n. 1 十字路口 2 转折点 ； 重大的抉择时刻 crossroad… |
| tutor | 听力 · 校园学习与研究 | n. 导师 | n. 导师;家庭教师 | 牛津英汉和譯典通首义都是家庭教师,口语常见 | A. noun ① ( private teacher ) a (private) tut… | n. 1 家庭教师，私人教师 2 辅导教师 3 【 美国英语 】 ( … |
| validate | 阅读 · 学术论证与抽象概念 | v. 证实 | v. 证实;使生效 | 牛津英汉首义是使生效,和 substantiate 也能区分 | transitive verb ① ( make legal, official ) 使…… | vt. ( past validated , pp validated… |
| aid | 写作 · 政府、法律与治理 | n. 援助 | n./v. 援助,帮助 | 三部词典都有动词义,hearing aid 也用名词 | AID abbreviation ① = Artificial Insemination … | vt. ( past aided , pp aided , prese… |
| arrow | 听力 · 旅游、交通与方位 | n. 箭头 | n. 箭;箭头 | 牛津英汉和譯典通首义都是箭,历史阅读常见 | A. noun ① ( missile ) 箭 ② ( symbol ) 箭头 . tra… | n. 1 箭 2 箭状物 3 ( 指示方向等的 ) 箭号，箭头 vt.… |
| canvas | 写作 · 全球化、文化与旅游 | n. 画布 | n. 画布;帆布 | 牛津英汉和譯典通首义都是帆布 | noun ① ( cloth ) 帆布 ② and ( for art ) 油画布 ③ (… | n. 1 帆布 2 油画布 ； 油画 3 风帆 4 帐篷 5 马戏团 … |
| cell | 阅读 · 医学与心理 | n. 细胞 | n. 细胞;牢房 | 牛津英汉和譯典通首义都是单人牢房,犯罪话题常见 | noun ① ( for prisoner ) 单人牢房 ; ( for monk ) [… | n. 1 单人牢房，小囚房 2 ( 修道院的 ) 单人小室 3 【 生… |
| chip | 阅读 · 城市、经济与科技 | n. 芯片 | n. 芯片;碎片;炸薯条(英) | 牛津英汉有碎片和英式炸薯条义,听力餐饮场景常见 | A. noun ① ( fragment ) 碎片 ② ( mark, flaw ) 缺损… | n. 1 屑片，碎片 2 缺口，瑕疵 3 炸马铃薯条 ； 炸洋芋片 4… |
| confirm | 听力 · 旅游、交通与方位 | v. 确认 | v. 确认,证实 | 牛津英汉首义是证实,阅读 confirm a theory 不是确认 | transitive verb ① ( state as true ) 证实 ‹ theo… | vt. ( past confirmed , pp confirmed… |
| consumption | 阅读 · 城市、经济与科技 | n. 消费 | n. 消费;消耗 | 牛津英汉和譯典通首义都是消耗,energy consumption 不是消费 | noun ① ( consuming of food, drink ) 消耗 ; ( am… | n. 1 消耗 ； 用尽 2 消耗量 ； 消费量 3 消费 4 憔悴 … |
| contribute | 阅读 · 学术高频动词 | v. 贡献 | v. 贡献;捐献;促成 | 牛津英汉有捐献义,contribute to 也常指促成 | A. transitive verb ① ( give ) 捐献 ‹ money , ai… | vt. ( past contributed , pp contrib… |
| discharge | 写作 · 环境保护 | v. 排放 n. 排放物 | v. 排放;允许出院 n. 排放物 | 牛津英汉首义是允许出院,听力医疗场景常见 | ① ( release ) 允许…出院 … ‹ patient › ; 允许…退伍 … ‹… | vt. ( past discharged , pp discharg… |
| energy | 阅读 · 物质科学与数学 | n. 能量 | n. 能量;能源;活力 | 牛津英汉有活力和能源义,写作能源话题常用 | noun ① ( strength, vitality ) 活力 ② energies p… | n. 1 活力，干劲 2 精力，能力 3 【 物理学 】 能，能量 |
| episode | 口语 · 兴趣与生活方式 | n. 一集 | n. 一集;事件 | 牛津英汉和譯典通首义都是事件 | noun ① ( event ) 一个事件 ; ( group of events ) 一… | n. 1 ( 整个事情中的 ) 一个事件 2 ( 文艺作品中的 ) 插… |
| gap | 写作 · 小作文:图表与流程 | n. 差距 | n. 差距;缺口,空白 | 牛津英汉和譯典通首义都是空隙、缺口 | noun ① ( empty space ) 空白处 ; ( empty distance… | n. 1 豁口，裂口，缺口 2 峡谷 ； 山口 3 间断 ； 间隔 ；… |
| innocent | 写作 · 政府、法律与治理 | adj. 无辜的 | adj. 无辜的;天真的 | 牛津英汉和譯典通都有天真义 | A. adjective ① Law ( not guilty ) 无罪的 ② ( bla… | a. ( er more innocent , est most in… |
| proof | 阅读 · 学术论证与抽象概念 | n. 证明 | n. 证据,证明 | 牛津英汉和譯典通首义都是证据 | A. noun ① ( evidence ) 证据 ② ( corroboration )… | n. 1 证据 ； 物证 2 检验，考验 3 证明 ； 论证 4 【 … |
| range | 写作 · 小作文:图表与流程 | n. 范围 v. 在……范围内变动 | n. 范围;一系列 v. 在……范围内变动 | a range of 表示一系列,是阅读写作高频用法,牛津英汉和譯典通都有此义 | A. noun ① ( variety ) 种类 ② Business ( of prod… | n. 1 排，行 ； 一系列 2 山脉 3 ( 变化等的 ) 幅度 ；… |
| resort | 口语 · 物品与地点 | n. 度假胜地 | n. 度假胜地 v. 诉诸 | 牛津英汉和譯典通都有动词义,resort to 是常见搭配 | A. noun ① ( action, strategy ) 招数 ② ( holiday… | vi. ( past resorted , pp resorted ,… |
| scholarship | 听力 · 购物、餐饮与银行 | n. 奖学金 | n. 奖学金;学术 | 牛津英汉和譯典通都有学问、学术义 | noun ① ( learning ) 学问 ; ( academic study ) 学… | n. 1 学问，学识 ； 学术成就 2 奖学金 |
| stage | 写作 · 小作文:图表与流程 | n. 阶段 | n. 阶段;舞台 | 牛津英汉和譯典通首义都是舞台 | A. noun ① ( platform ) ( for play, show, cere… | n. 1 舞台 2 戏剧，戏剧艺术 ； 演戏 ； 戏剧界 3 注意中心… |
| symbol | 阅读 · 语言与历史 | n. 符号 | n. 象征;符号 | 牛津英汉和譯典通首义都是象征 | noun ① ( emblem ) 象征 ② ( mark, sign ) 符号 | n. 1 象征，标志 2 记号，符号 vt. 象征 同义参见 exam… |
| league | 听力 · 健康、运动与休闲 | n. 联赛 | n. 联赛;联盟 | 牛津英汉和譯典通首义都是联盟,历史和政治阅读常见 | noun ① ( alliance ) 联盟 ② ( collaboration ) 联合… | n. 1 同盟，联盟 2 盟约 3 联合会，社团 ； 【 体育 】 (… |
| mimicry | 阅读 · 生命科学 | n. 拟态 | n. 模仿;拟态 | 牛津英汉和譯典通首义都是模仿,拟态只是生物义 | noun 模仿 | n. 1 模仿 ； 模拟 ； 学样 2 【 生物学/生理学/生物化学 … |

