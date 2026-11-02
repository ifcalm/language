# 雅思词库音标核查(2026-11-02)

把 D1 `ielts_pronunciations` 全部读音与 ODE(英式)、NOAD(美式)程序比对,差异大的逐条人工裁决。共修正 267 处读音,另把 15 个词拆成分词性读音,合计涉及 259 个词条。迁移 `0265_fix_ielts_phonetics_audit`、`0266_fix_ielts_phonetics_by_pos` 已应用到线上 D1 并记账。读音行数从 9182 变为 9214。音标原本由 ipa-dict 加人工校正生成,这是第一次全量核对词典。

## 方法

- **底本:** 本机 ODE 和 NOAD 的 IPA。
- **取值:** 写法转成项目风格(英音参照 Oxford,美音参照 Cambridge)。差异是错误还是变体由人工判断,其中部分判断依据对 Oxford Learner's 和 Cambridge 读音的记忆,**这两部词典没有实际查阅**。所以少数新音标不是 ODE、NOAD 的首选读音,比如 `sanctuary-uk`、`artisan-uk`。
- **第一轮:** 词头相同就比对全部读音,命中任一即通过。人工通读了差异分数不低于 0.6 的约 400 条。
- **第二轮:** 第一轮的索引混入了其他词性的读音和变形词,读音对应错词性时查不出来,比如 `sow` 标成了“母猪”的读音。第二轮重建索引,只保留词头读音,并按释义的词性匹配,又通读了分数不低于 0.35 的新增条目和所有同形异义词。
- **词组和变形词:** 词典查不到整词时按单词比对,复数、-ing、-ed 用词根加词尾。

## 音频

### 生成方式

`scripts/generate-ielts-audio.mjs` 只对分词性词条和 `IPA_READINGS` 名单用 SSML 读音标,其余词条按纯文本朗读,发音来自 Google 词库。所以大多数音标错误只影响显示,没有进入音频。

### 发现的问题:音色不报错地忽略音标

音色遇到不支持的符号时不报错,基本按文本朗读。此前项目的音标直接传给音色,所以**英音的分词性音频长期没有真正区分读音**,比如 `increase` 的名词和动词时长相同。

| 音色 | 不接受的符号 | 现在的写法 |
|---|---|---|
| en-GB-Studio-C | `r`、`e`、`i`、`u` | `ɹ`、`ɛ`(`eɪ`、`eə` 不变)、`iː`、`uː` |
| en-US-Studio-O | `ɝː`、重读的 `iə` | `ɝ`、`iːə`(`uə` 也写成 `uːə`) |

映射写在生成脚本的 `voiceIpa`,只影响发给音色的请求,不影响页面显示的音标。用 `iː`、`uː` 还能避免 `iə` 被压成一个音节:写成 `iːə` 后,`malaria`、`meridian`、`obedient` 的时长与纯文本音频完全一致。

修复后验证:

- 所有走 SSML 的 362 种写法都被音色接受。
- 英音两种词性之间的声学距离(下表为 25 个词的抽样)明显拉开:

| 组别 | 修复前中位数 | 修复后中位数 | 修复后最小值 |
|---|---|---|---|
| 原有分词性词条(10 个) | 1.64 | 5.77 | 3.38 |
| 新增分词性词条(15 个) | 3.00 | 6.30 | 3.61 |

### 现有音频是否和音标一致

用修正后的音标合成对照音频,与现有音频比较声学距离,并用 40 条未改动的读音校准。**同一天早些时候的比对结果作废**,因为当时还没有符号映射,含这些符号的词距离偏低。下面是修复后的结果:

| 组别 | 英音中位数 | 英音最大值 | 美音中位数 | 美音最大值 |
|---|---|---|---|---|
| 未改动的对照读音 | 3.13 | 4.69 | 3.54 | 5.33 |
| 修正过的读音 | 2.22 | 10.88 | 3.06 | 7.56 |

同形异义词还合成了另一种读音,看现有音频更接近哪一种。66 条里 6 条明显读成了另一种:`compact-uk`、`compact-us`、`patent-uk`、`underline-uk`、`underline-us`、`rewrite-uk`。`sow`、`discount`、`insert-uk`、`convert` 等其余词条读音正确,或者无法区分。

### 处理结果

- **改按音标生成:** 共 38 条,写入 `IPA_READINGS`。包括上面 6 条读错的、15 条距离超过对照组最大值的单词,以及第一轮选入的 17 条。第一轮的 17 条是按作废的比对选的,没有逐条复核,由于走 SSML,音频按音标朗读,所以保留。
- **重新生成:** 分词性词条全部按新映射重新生成;`best-seller`、`pay-slip`、`notice-board` 按 0264 改过的文本重新生成。
- **文件数:** 覆盖 96 个音频文件,新增 62 个。上线内容与本地逐字节一致。再跑生成脚本没有待处理项。

### 局限

- **没有人工试听。** 声学距离只能发现明显偏差,对照组的阈值也只是粗筛,短词噪声较大。
- **没有全量比对音频。** 只比对了修正过的读音、同形异义词和对照组,其余约 8900 条纯文本音频没有检查。
- **缓存:** R2 文件带 `immutable, max-age=1 年`,覆盖的 96 个文件在原路径。边缘节点没有缓存,但已经播放过这些词的浏览器最长一年内可能继续用旧文件。新增的分词性音频路径是新的,不受影响。

## 没有改的

| 类别 | 条数 | 处理理由 |
|---|---|---|
| 英音 `ɔː` 与 `ʊə`(pure、mature、tourism) | 17 条单词,另有含这些词的词组 | 主流词典都收录两种读法,属于风格差异 |
| 英音非重读 `juː` 与 `ju`(argument、regulate) | 约 24 条 | 只差长音符号 |
| 美音 `ær` 与 `er`(arrow、carrier) | 12 条 | NOAD 按合并后的读音标,Cambridge 区分,与项目约定一致 |
| 词组内部重音(blood pressure、rush hour) | 59 条 | 词组是逐词转写的,不是词典的复合词重音。要改得单独定规则 |
| 词典认可的变体(halt、transit、intrinsic、innovative、recuperate、terrain、ion、pedagogy) | 约 30 条 | 项目读法也是常见读法 |
| 只差重音移动的跨词性词(`inland`、`overall`、`overseas`、`contrary`) | 4 个词 | 重音随语境移动,或另一读法是少见义项,不拆分词性 |

其他未处理项:

- **判断不了的同形异义词音频:** `accent-uk`、`discard-us`、`insert-us`、`recharge-uk`、`recharge-us`、`transform-uk`、`transform-us` 与两种读音的距离接近,保留原音频。
- **距离高的词组音频:** `on-the-contrary-uk`、`plastic-bag-uk` 超过对照组最大值,但词组没有走过 SSML,保留纯文本。
- **没有音标的 4 个词条(8 条读音):** `broaden one's horizons`、`can't stand doing sth.`、`convert A into B`、`object to (doing) sth.`,因为含占位词。
- **0264 的另外 5 个词条:** `first-aid-kit`、`hang-gliding`、`neolithic`、`paleolithic`、`empty-nester` 的朗读文本改过,读音不受影响,没有重新生成。
- **R2 上的旧音频:** 15 个拆分词性的词,原来的 30 个音频文件还留在 R2。要等新数据部署后才不再被引用,所以这次没有删。
- **`jewellery`:** 没有填美式拼写 `jewelry`,这是拼写问题,不属于本次范围。
- **`scripts/fixtures/ielts-phonetics.json`:** 仍是 0264 之前的生成结果,构建不读它。`npm run ielts:phonetics` 已验证不报错。

## 第一轮修改清单(迁移 0265)

共 253 处。第一列是读音 id,后缀 `-uk`、`-us` 表示口音。

### 音段错误(错音、多音、缺音)(85 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `adequate-us` | /ˈædəkweɪt/ | /ˈædɪkwət/ |
| `advertisement-us` | /ædˈvɝːtəzmənt/ | /ˌædvɚˈtaɪzmənt/ |
| `algorithm-uk` | /ˈælɡərɪθəm/ | /ˈælɡərɪðəm/ |
| `altruism-uk` | /ˈɔːltruːɪzəm/ | /ˈæltruːɪzəm/ |
| `alzheimers-disease-uk` | /ˈælzhaɪməz dɪˈziːz/ | /ˈæltshaɪməz dɪˈziːz/ |
| `alzheimers-disease-us` | /ˈælzhaɪmɚz dɪˈziːz/ | /ˈɑːltshaɪmɚz dɪˈziːz/ |
| `archipelago-uk` | /ˌɑːkɪpɪˈleɪɡəʊ/ | /ˌɑːkɪˈpeləɡəʊ/ |
| `archipelago-us` | /ˌɑːrtʃəpəˈleɪɡoʊ/ | /ˌɑːrkəˈpeləɡoʊ/ |
| `artisan-uk` | /ˈɑːtɪsən/ | /ˌɑːtɪˈzæn/ |
| `asphalt-uk` | /ˈæsfɒlt/ | /ˈæsfælt/ |
| `canyon-uk` | /ˈkæniən/ | /ˈkænjən/ |
| `cheongsam-us` | /ˌtʃɑːŋˈsɑːm/ | /ˌtʃɑːŋˈsæm/ |
| `committee-uk` | /kəˈmɪttiː/ | /kəˈmɪti/ |
| `congruent-us` | /ˈkɔːnɡruent/ | /ˈkɑːŋɡruənt/ |
| `consume-uk` | /kənˈsuːm/ | /kənˈsjuːm/ |
| `consumer-uk` | /kənˈsuːmə/ | /kənˈsjuːmə/ |
| `consumerism-uk` | /kənˈsuːmərɪzəm/ | /kənˈsjuːmərɪzəm/ |
| `current-account-us` | /ˈkɑːrənt əˈkaʊnt/ | /ˈkɝːənt əˈkaʊnt/ |
| `current-us` | /ˈkɑːrənt/ | /ˈkɝːənt/ |
| `degradation-uk` | /dɪɡrəˈdeɪʃən/ | /ˌdeɡrəˈdeɪʃən/ |
| `deterrent-uk` | /dɪˈtɜːrənt/ | /dɪˈterənt/ |
| `doctorate-uk` | /ˈdɒktəreɪt/ | /ˈdɒktərət/ |
| `eco-friendly-uk` | /ˌekəʊ ˈfrendli/ | /ˌiːkəʊ ˈfrendli/ |
| `eco-friendly-us` | /ˌekoʊ ˈfrendli/ | /ˌiːkoʊ ˈfrendli/ |
| `ecotourism-uk` | /ˈekətɔːrɪzəm/ | /ˈiːkəʊtʊərɪzəm/ |
| `ecotourism-us` | /ˈekoʊtʊrɪzəm/ | /ˈiːkoʊtʊrɪzəm/ |
| `epidemiology-uk` | /ˌepɪˌdemɪˈɒlədʒi/ | /ˌepɪˌdiːmiˈɒlədʒi/ |
| `epidemiology-us` | /ˌepəˌdemiˈɑːlədʒi/ | /ˌepəˌdiːmiˈɑːlədʒi/ |
| `glacier-uk` | /ˈɡleɪʃə/ | /ˈɡlæsiə/ |
| `granary-us` | /ˈɡræneri/ | /ˈɡreɪnəri/ |
| `handsome-uk` | /ˈhændsʌm/ | /ˈhænsəm/ |
| `humanitarian-uk` | /ˌhjuːmənɪˈteəriən/ | /hjuːˌmænɪˈteəriən/ |
| `hurricane-us` | /ˈhʌrəkeɪnz/ | /ˈhɝːəkeɪn/ |
| `illuminate-us` | /ɪˈluːmɪnɪt/ | /ɪˈluːməneɪt/ |
| `inadequate-us` | /ɪˈnædəkweɪt/ | /ɪnˈædɪkwət/ |
| `increasingly-us` | /ɪnˈkriːsɪŋɡli/ | /ɪnˈkriːsɪŋli/ |
| `innate-uk` | /ɪnˈneɪt/ | /ɪˈneɪt/ |
| `insulation-uk` | /ˌɪnsuːˈleɪʃən/ | /ˌɪnsjuːˈleɪʃən/ |
| `insulator-uk` | /ˈɪnsuːleɪtə/ | /ˈɪnsjuːleɪtə/ |
| `invertebrate-uk` | /ɪnˈvɜːtɪbreɪt/ | /ɪnˈvɜːtɪbrət/ |
| `jewellery-us` | /ˈdʒuːeləri/ | /ˈdʒuːəlri/ |
| `licensed-uk` | /ˈlaɪsənsd/ | /ˈlaɪsənst/ |
| `lingua-franca-uk` | /ˈlɪŋɡjuːə ˈfræŋkə/ | /ˌlɪŋɡwə ˈfræŋkə/ |
| `luxurious-uk` | /lʌɡʒˈjʊriəs/ | /lʌɡˈʒʊəriəs/ |
| `luxurious-us` | /ləɡˈʒʌriəs/ | /ləɡˈʒʊriəs/ |
| `market-research-uk` | /ˈmɑːkɪt ˈriːsətʃ/ | /ˈmɑːkɪt rɪˈsɜːtʃ/ |
| `monograph-uk` | /ˈmɒnəʊɡræf/ | /ˈmɒnəɡrɑːf/ |
| `moth-uk` | /mɔːθ/ | /mɒθ/ |
| `mother-tongue-uk` | /ˈmɒthɜː tʌŋ/ | /ˈmʌðə tʌŋ/ |
| `multilingual-us` | /ˌmʌltaɪˈlɪŋwəl/ | /ˌmʌltiˈlɪŋɡwəl/ |
| `nature-versus-nurture-uk` | /ˈneɪtʃə ˈvɜːsɪz ˈnɜːtʃə/ | /ˈneɪtʃə ˈvɜːsəs ˈnɜːtʃə/ |
| `overall-uk` | /ˈəʊvəɔːl/ | /ˌəʊvərˈɔːl/ |
| `paparazzi-us` | /ˌpɑːpɑːˈrɔːzi/ | /ˌpɑːpəˈrɑːtsi/ |
| `partisan-uk` | /ˈpɑːtɪsən/ | /ˌpɑːtɪˈzæn/ |
| `pension-scheme-uk` | /ˈpenzaɪɒn skiːm/ | /ˈpenʃən skiːm/ |
| `pension-uk` | /ˈpenzaɪɒn/ | /ˈpenʃən/ |
| `physiotherapy-uk` | /ˈfɪzɪəʊθɪrəpi/ | /ˌfɪziəʊˈθerəpi/ |
| `postgraduate-uk` | /ˈpəʊstɡrədjuːeɪt/ | /ˌpəʊstˈɡrædʒuət/ |
| `postgraduate-us` | /ˈpoʊstɡrædʒəweɪt/ | /ˌpoʊstˈɡrædʒuət/ |
| `preservation-uk` | /prɪsəˈveɪʃən/ | /ˌprezəˈveɪʃən/ |
| `prestigious-us` | /pɚˈstiːdʒəs/ | /preˈstɪdʒəs/ |
| `problematic-uk` | /ˌprɒbəlˈmætɪk/ | /ˌprɒbləˈmætɪk/ |
| `promotion-prospects-us` | /pɚˈmoʊʃən ˈprɑːspekts/ | /prəˈmoʊʃən ˈprɑːspekts/ |
| `promotion-us` | /pɚˈmoʊʃən/ | /prəˈmoʊʃən/ |
| `qualitative-uk` | /ˈkwɒlɪteɪtɪv/ | /ˈkwɒlɪtətɪv/ |
| `rainforest-us` | /ˈraɪnfɔːrəst/ | /ˈreɪnfɔːrəst/ |
| `reassure-uk` | /ˌriːəʃˈjɔː/ | /ˌriːəˈʃʊə/ |
| `rehabilitation-uk` | /rɪhəˌbɪlɪˈteɪʃən/ | /ˌriːəˌbɪlɪˈteɪʃən/ |
| `relativity-uk` | /rɪləˈtɪvɪti/ | /ˌreləˈtɪvɪti/ |
| `residual-uk` | /rɪˈsɪdʒuːəl/ | /rɪˈzɪdjuːəl/ |
| `resume-uk` | /ˈrezəmeɪ/ | /rɪˈzjuːm/ |
| `resume-us` | /ˈrezəmeɪ/ | /rɪˈzuːm/ |
| `sanctuary-uk` | /ˈsɑːnktjuːəri/ | /ˈsæŋktʃuəri/ |
| `savoury-us` | /ˈsɑːvoʊjʌri/ | /ˈseɪvəri/ |
| `syrup-us` | /ˈsʌrəp/ | /ˈsɪrəp/ |
| `temperamental-us` | /ˌtempɚˈmentəl/ | /ˌtemprəˈmentəl/ |
| `tertiary-education-uk` | /ˈtɜːʃjəri ˌedʒuːˈkeɪʃən/ | /ˈtɜːʃəri ˌedʒuːˈkeɪʃən/ |
| `time-consuming-uk` | /taɪm kənˈsuːmɪŋ/ | /taɪm kənˈsjuːmɪŋ/ |
| `tissue-us` | /ˈtɪsju/ | /ˈtɪʃuː/ |
| `ultrasonic-uk` | /ˌʊltrəˈsɒnɪk/ | /ˌʌltrəˈsɒnɪk/ |
| `ultraviolet-uk` | /ˌʊltrəˈvaɪələt/ | /ˌʌltrəˈvaɪələt/ |
| `urine-us` | /ˈjʌrən/ | /ˈjʊrən/ |
| `vegan-us` | /ˈveɡən/ | /ˈviːɡən/ |
| `vertebrate-uk` | /ˈvɜːtɪbreɪt/ | /ˈvɜːtɪbrət/ |
| `windscreen-us` | /ˈwaɪndskriːn/ | /ˈwɪndskriːn/ |

### 主重音位置错误(20 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `adverse-uk` | /ædˈvɜːs/ | /ˈædvɜːs/ |
| `capillary-uk` | /ˈkæpɪləri/ | /kəˈpɪləri/ |
| `confound-uk` | /ˈkɒnfaʊnd/ | /kənˈfaʊnd/ |
| `confound-us` | /ˈkɑːnfaʊnd/ | /kənˈfaʊnd/ |
| `elsewhere-us` | /ˈelswer/ | /ˌelsˈwer/ |
| `gourmet-us` | /ˈɡʊrmeɪ/ | /ɡʊrˈmeɪ/ |
| `loudspeaker-uk` | /ˈlaʊdspiːkə/ | /ˌlaʊdˈspiːkə/ |
| `multitasking-uk` | /ˈmʌltɪtɑːskɪŋ/ | /ˌmʌltiˈtɑːskɪŋ/ |
| `multitasking-us` | /ˈmʌltɪtæskɪŋ/ | /ˌmʌltiˈtæskɪŋ/ |
| `obsolete-us` | /ˈɑːbsəlɪt/ | /ˌɑːbsəˈliːt/ |
| `outsource-us` | /aʊtˈsɔːrs/ | /ˈaʊtsɔːrs/ |
| `physiotherapy-us` | /ˈfɪzioʊθerəpi/ | /ˌfɪzioʊˈθerəpi/ |
| `premiere-uk` | /ˌpremiˈeə/ | /ˈpremieə/ |
| `proof-of-address-uk` | /pruːf əv ˈædres/ | /pruːf əv əˈdres/ |
| `pseudoscience-uk` | /ˌsjuːdəʊˈsaɪəns/ | /ˈsjuːdəʊsaɪəns/ |
| `refugee-uk` | /ˈrefjuːdʒiː/ | /ˌrefjuːˈdʒiː/ |
| `refugee-us` | /ˈrefjudʒi/ | /ˌrefjuˈdʒiː/ |
| `renaissance-us` | /ˌrenəˈsɑːns/ | /ˈrenəsɑːns/ |
| `semiconductor-us` | /ˌsemaɪkənˈdʌktɚ/ | /ˈsemikəndʌktɚ/ |
| `vaccine-uk` | /vækˈsiːn/ | /ˈvæksiːn/ |

### s / z 混淆(28 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `acquisition-uk` | /əkwɪˈsɪʃən/ | /ˌækwɪˈzɪʃən/ |
| `amusement-park-uk` | /əˈmjuːsmənt pɑːk/ | /əˈmjuːzmənt pɑːk/ |
| `amusement-uk` | /əˈmjuːsmənt/ | /əˈmjuːzmənt/ |
| `appraisal-uk` | /əˈpreɪsəl/ | /əˈpreɪzəl/ |
| `charismatic-uk` | /ˌkærɪˈsmætɪk/ | /ˌkærɪzˈmætɪk/ |
| `deposit-uk` | /dɪˈpɒsɪt/ | /dɪˈpɒzɪt/ |
| `devise-us` | /dɪˈvaɪs/ | /dɪˈvaɪz/ |
| `disaster-uk` | /dɪˈsɑːstə/ | /dɪˈzɑːstə/ |
| `dissolve-uk` | /dɪˈsɒlv/ | /dɪˈzɒlv/ |
| `envisage-uk` | /ɪnˈvɪsɪdʒ/ | /ɪnˈvɪzɪdʒ/ |
| `husbandry-uk` | /ˈhʌsbəndri/ | /ˈhʌzbəndri/ |
| `irresistible-uk` | /ɪrɪˈsɪstəbəl/ | /ˌɪrɪˈzɪstəbəl/ |
| `mosaic-uk` | /məˈseɪɪk/ | /məʊˈzeɪɪk/ |
| `natural-disaster-uk` | /ˈnætʃərəl dɪˈsɑːstə/ | /ˈnætʃərəl dɪˈzɑːstə/ |
| `prerequisite-uk` | /priːˈrekwɪsɪt/ | /ˌpriːˈrekwəzɪt/ |
| `preservative-uk` | /prɪˈsɜːvətɪv/ | /prɪˈzɜːvətɪv/ |
| `preserve-uk` | /prɪˈsɜːv/ | /prɪˈzɜːv/ |
| `resemble-uk` | /rɪˈsembəl/ | /rɪˈzembəl/ |
| `residue-uk` | /ˈresɪdjuː/ | /ˈrezɪdjuː/ |
| `resign-uk` | /rɪˈsaɪn/ | /rɪˈzaɪn/ |
| `resign-us` | /rɪˈsaɪn/ | /rɪˈzaɪn/ |
| `resist-uk` | /rɪˈsɪst/ | /rɪˈzɪst/ |
| `resort-uk` | /rɪˈsɔːt/ | /rɪˈzɔːt/ |
| `resort-us` | /rɪˈsɔːrt/ | /rɪˈzɔːrt/ |
| `security-deposit-uk` | /sɪˈkjɔːrɪti dɪˈpɒsɪt/ | /sɪˈkjɔːrɪti dɪˈpɒzɪt/ |
| `transaction-uk` | /trænˈsækʃən/ | /trænˈzækʃən/ |
| `well-preserved-uk` | /wel prɪˈsɜːvd/ | /wel prɪˈzɜːvd/ |
| `wisdom-uk` | /ˈwɪsdəm/ | /ˈwɪzdəm/ |

### n / ŋ 混淆(9 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `anchor-uk` | /ˈænkə/ | /ˈæŋkə/ |
| `congruent-uk` | /ˈkɒnɡruːənt/ | /ˈkɒŋɡruənt/ |
| `conquest-uk` | /ˈkɒnkwest/ | /ˈkɒŋkwest/ |
| `greengrocer-uk` | /ˈɡriːŋɡrəʊsə/ | /ˈɡriːnɡrəʊsə/ |
| `juvenile-delinquency-uk` | /ˈdʒuːvənaɪl dɪˈlɪnkwənsi/ | /ˈdʒuːvənaɪl dɪˈlɪŋkwənsi/ |
| `ongoing-uk` | /ˈɒŋɡəʊɪŋ/ | /ˈɒnɡəʊɪŋ/ |
| `rectangular-uk` | /rekˈtænɡjʊlə/ | /rekˈtæŋɡjʊlə/ |
| `tranquil-uk` | /ˈtrænkwɪl/ | /ˈtræŋkwɪl/ |
| `triangular-uk` | /traɪˈænɡjʊlə/ | /traɪˈæŋɡjʊlə/ |

### æ / ɑː 混淆(15 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `advanced-uk` | /ədˈvænst/ | /ədˈvɑːnst/ |
| `asteroid-uk` | /ˈɑːstərɔɪd/ | /ˈæstərɔɪd/ |
| `by-contrast-uk` | /baɪ ˈkɒntræst/ | /baɪ ˈkɒntrɑːst/ |
| `canteen-uk` | /kɑːnˈtiːn/ | /kænˈtiːn/ |
| `elasticity-uk` | /ɪlɑːˈstɪsɪti/ | /ˌiːlæˈstɪsɪti/ |
| `fantasy-uk` | /ˈfɑːntəsi/ | /ˈfæntəsi/ |
| `gymnastics-uk` | /dʒɪmˈnɑːstɪks/ | /dʒɪmˈnæstɪks/ |
| `in-contrast-uk` | /ɪn ˈkɒntræst/ | /ɪn ˈkɒntrɑːst/ |
| `mantle-uk` | /ˈmɑːntəl/ | /ˈmæntəl/ |
| `masters-degree-uk` | /ˈmæstəz dɪˈɡriː/ | /ˈmɑːstəz dɪˈɡriː/ |
| `morale-uk` | /məˈræl/ | /məˈrɑːl/ |
| `passive-uk` | /ˈpɑːsɪv/ | /ˈpæsɪv/ |
| `plastic-bag-uk` | /ˈplɑːstɪk bæɡ/ | /ˈplæstɪk bæɡ/ |
| `plastic-uk` | /ˈplɑːstɪk/ | /ˈplæstɪk/ |
| `procrastinate-uk` | /prəˈkrɑːstɪneɪt/ | /prəˈkræstɪneɪt/ |

### 元音强弱错误(非重读音节写成完整元音,或相反)(96 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `abacus-uk` | /ˈæbækəs/ | /ˈæbəkəs/ |
| `abnormal-uk` | /əbˈnɔːməl/ | /æbˈnɔːməl/ |
| `acknowledge-us` | /ækˈnɑːlɪdʒ/ | /əkˈnɑːlɪdʒ/ |
| `adaptation-uk` | /ədəpˈteɪʃən/ | /ˌædæpˈteɪʃən/ |
| `administration-us` | /ædˌmɪnɪˈstreɪʃən/ | /ədˌmɪnɪˈstreɪʃən/ |
| `admire-us` | /ædˈmaɪr/ | /ədˈmaɪr/ |
| `admission-us` | /ædˈmɪʃən/ | /ədˈmɪʃən/ |
| `ambassador-uk` | /əmˈbæsədə/ | /æmˈbæsədə/ |
| `ammonia-uk` | /æˈməʊniə/ | /əˈməʊniə/ |
| `astronomical-uk` | /əstrəˈnɒmɪkəl/ | /ˌæstrəˈnɒmɪkəl/ |
| `authentic-us` | /əˈθentɪk/ | /ɔːˈθentɪk/ |
| `authenticity-uk` | /ɔːθɪnˈtɪsɪti/ | /ˌɔːθenˈtɪsɪti/ |
| `authority-uk` | /əˈθɒrɪti/ | /ɔːˈθɒrɪti/ |
| `autonomy-us` | /əˈtɑːnəmi/ | /ɔːˈtɑːnəmi/ |
| `baboon-uk` | /bæˈbuːn/ | /bəˈbuːn/ |
| `calligraphy-uk` | /kæˈlɪɡrəfi/ | /kəˈlɪɡrəfi/ |
| `calorie-uk` | /ˈkælɔːri/ | /ˈkæləri/ |
| `chancellor-uk` | /ˈtʃɑːnselə/ | /ˈtʃɑːnsələ/ |
| `circumference-uk` | /sɜːˈkʌmfrəns/ | /səˈkʌmfərəns/ |
| `column-uk` | /ˈkɒlʌm/ | /ˈkɒləm/ |
| `condensation-uk` | /kɒndɪnˈseɪʃən/ | /ˌkɒndenˈseɪʃən/ |
| `congress-uk` | /ˈkɒŋɡrəs/ | /ˈkɒŋɡres/ |
| `connectivity-uk` | /kɒnɪkˈtɪvɪti/ | /ˌkɒnekˈtɪvɪti/ |
| `contrary-uk` | /ˈkɒntreri/ | /ˈkɒntrəri/ |
| `counsellor-uk` | /ˈkaʊnselə/ | /ˈkaʊnsələ/ |
| `courageous-uk` | /kʌˈreɪdʒəs/ | /kəˈreɪdʒəs/ |
| `curriculum-uk` | /kʌˈrɪkjʊləm/ | /kəˈrɪkjʊləm/ |
| `decibel-uk` | /ˈdesɪbəl/ | /ˈdesɪbel/ |
| `decorator-uk` | /ˈdekɔːreɪtə/ | /ˈdekəreɪtə/ |
| `demography-uk` | /deˈmɒɡrəfi/ | /dɪˈmɒɡrəfi/ |
| `disobedient-uk` | /ˌdɪsəʊˈbiːdiənt/ | /ˌdɪsəˈbiːdiənt/ |
| `dividend-uk` | /ˈdɪvɪdənd/ | /ˈdɪvɪdend/ |
| `driverless-car-uk` | /ˈdraɪvəles kɑː/ | /ˈdraɪvələs kɑː/ |
| `endemic-uk` | /ɪnˈdemɪk/ | /enˈdemɪk/ |
| `essential-us` | /eˈsenʃəl/ | /ɪˈsenʃəl/ |
| `exponential-us` | /ˌekspoʊˈnenʃəl/ | /ˌekspəˈnenʃəl/ |
| `fermentation-uk` | /fɜːmɪnˈteɪʃən/ | /ˌfɜːmenˈteɪʃən/ |
| `genetic-engineering-uk` | /dʒeˈnetɪk ˌendʒɪˈnɪərɪŋ/ | /dʒəˈnetɪk ˌendʒɪˈnɪərɪŋ/ |
| `genetic-uk` | /dʒeˈnetɪk/ | /dʒəˈnetɪk/ |
| `genetically-modified-uk` | /dʒeˈnetɪkli ˈmɒdɪfaɪd/ | /dʒəˈnetɪkli ˈmɒdɪfaɪd/ |
| `grassland-uk` | /ˈɡrɑːslənd/ | /ˈɡrɑːslænd/ |
| `gregarious-uk` | /ɡreˈɡeəriəs/ | /ɡrɪˈɡeəriəs/ |
| `guarantee-uk` | /ˌɡærɑːnˈtiː/ | /ˌɡærənˈtiː/ |
| `hospitality-industry-uk` | /ˌhɒspɪˈtælɪti ˈɪndʌstri/ | /ˌhɒspɪˈtælɪti ˈɪndəstri/ |
| `hostility-uk` | /həˈstɪlɪti/ | /hɒˈstɪlɪti/ |
| `impetus-uk` | /ˈɪmpetəs/ | /ˈɪmpɪtəs/ |
| `industry-uk` | /ˈɪndʌstri/ | /ˈɪndəstri/ |
| `liberate-us` | /ˈlɪbʌreɪt/ | /ˈlɪbəreɪt/ |
| `locust-uk` | /ˈləʊkʌst/ | /ˈləʊkəst/ |
| `longevity-uk` | /lənˈdʒevɪti/ | /lɒnˈdʒevɪti/ |
| `malaria-uk` | /mæˈleəriə/ | /məˈleəriə/ |
| `memorise-uk` | /ˈmemɔːraɪz/ | /ˈmeməraɪz/ |
| `meridian-uk` | /meˈrɪdiən/ | /məˈrɪdiən/ |
| `meteorite-uk` | /ˈmiːtɪɔːraɪt/ | /ˈmiːtiəraɪt/ |
| `meteorite-us` | /ˈmiːtiɔːraɪt/ | /ˈmiːtiəraɪt/ |
| `meteorology-uk` | /ˌmiːtɪɔːˈrɒlədʒi/ | /ˌmiːtiəˈrɒlədʒi/ |
| `monsoon-uk` | /mənˈsuːn/ | /mɒnˈsuːn/ |
| `mutualism-us` | /ˈmjuːtʃuʌlɪzəm/ | /ˈmjuːtʃuəlɪzəm/ |
| `neighbouring-uk` | /ˈneɪbɜːrɪŋ/ | /ˈneɪbərɪŋ/ |
| `nostalgic-uk` | /nəˈstældʒɪk/ | /nɒˈstældʒɪk/ |
| `obedience-uk` | /əʊˈbiːdiəns/ | /əˈbiːdiəns/ |
| `obedient-uk` | /əʊˈbiːdiənt/ | /əˈbiːdiənt/ |
| `obesity-us` | /əˈbiːsəti/ | /oʊˈbiːsəti/ |
| `objective-reporting-uk` | /ɒbˈdʒektɪv rɪˈpɔːtɪŋ/ | /əbˈdʒektɪv rɪˈpɔːtɪŋ/ |
| `objective-uk` | /ɒbˈdʒektɪv/ | /əbˈdʒektɪv/ |
| `obscure-uk` | /ɒbˈskjɔː/ | /əbˈskjʊə/ |
| `observatory-uk` | /ɒbˈzɜːvətəri/ | /əbˈzɜːvətəri/ |
| `observe-uk` | /ɒbˈzɜːv/ | /əbˈzɜːv/ |
| `obsession-uk` | /ɒbˈseʃən/ | /əbˈseʃən/ |
| `obtain-uk` | /ɒbˈteɪn/ | /əbˈteɪn/ |
| `obtuse-uk` | /ɒbˈtjuːs/ | /əbˈtjuːs/ |
| `on-the-contrary-uk` | /ɒn ðə ˈkɒntreri/ | /ɒn ðə ˈkɒntrəri/ |
| `orchestra-uk` | /ˈɔːkestrə/ | /ˈɔːkɪstrə/ |
| `ostentatious-uk` | /ˌɒstənˈteɪʃəs/ | /ˌɒstenˈteɪʃəs/ |
| `particularly-us` | /pɑːrˈtɪkjəlɚli/ | /pɚˈtɪkjəlɚli/ |
| `petrol-us` | /ˈpetroʊl/ | /ˈpetrəl/ |
| `premiere-us` | /preˈmɪr/ | /prɪˈmɪr/ |
| `probation-uk` | /prəʊˈbeɪʃən/ | /prəˈbeɪʃən/ |
| `profound-us` | /proʊˈfaʊnd/ | /prəˈfaʊnd/ |
| `proliferate-us` | /proʊˈlɪfəreɪt/ | /prəˈlɪfəreɪt/ |
| `prolific-us` | /proʊˈlɪfɪk/ | /prəˈlɪfɪk/ |
| `prosperity-uk` | /prəˈsperɪti/ | /prɒˈsperɪti/ |
| `salinity-uk` | /seɪˈlɪnɪti/ | /səˈlɪnɪti/ |
| `saturn-uk` | /ˈsætɜːn/ | /ˈsætən/ |
| `savanna-uk` | /sæˈvænə/ | /səˈvænə/ |
| `savoury-uk` | /ˈseɪvɜːri/ | /ˈseɪvəri/ |
| `subjective-uk` | /sʌbˈdʒektɪv/ | /səbˈdʒektɪv/ |
| `subsist-uk` | /sʌbˈsɪst/ | /səbˈsɪst/ |
| `subtract-uk` | /sʌbˈtrækt/ | /səbˈtrækt/ |
| `supposedly-uk` | /sʌˈpəʊzɪdli/ | /səˈpəʊzɪdli/ |
| `syllabus-uk` | /ˈsɪlæbəs/ | /ˈsɪləbəs/ |
| `syrup-uk` | /ˈsɪrʌp/ | /ˈsɪrəp/ |
| `taboo-uk` | /tæˈbuː/ | /təˈbuː/ |
| `take-advantage-of-us` | /teɪk ædˈvæntɪdʒ əv/ | /teɪk ədˈvæntɪdʒ əv/ |
| `thermometer-uk` | /θɜːˈmɒmɪtə/ | /θəˈmɒmɪtə/ |
| `torrential-us` | /tɔːˈrenʃəl/ | /təˈrenʃəl/ |

## 第二轮修改清单(迁移 0266)

### 读音修正(14 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `sow-uk` | /saʊ/ | /səʊ/ |
| `sow-us` | /saʊ/ | /soʊ/ |
| `underline-uk` | /ˈʌndəlaɪn/ | /ˌʌndəˈlaɪn/ |
| `underline-us` | /ˈʌndɚlaɪn/ | /ˌʌndɚˈlaɪn/ |
| `overestimate-uk` | /ˌəʊvəˈrestɪmət/ | /ˌəʊvərˈestɪmeɪt/ |
| `reuse-us` | /rɪˈjuːs/ | /ˌriːˈjuːz/ |
| `hydroelectric-uk` | /ˌhaɪdrəʊˈlektrɪk/ | /ˌhaɪdrəʊɪˈlektrɪk/ |
| `automobile-uk` | /ˈɔːtəməbɪəl/ | /ˈɔːtəməbiːl/ |
| `automobile-us` | /ˈɔːtəmoʊbɪl/ | /ˈɔːtəmoʊbiːl/ |
| `aisle-uk` | /aɪəl/ | /aɪl/ |
| `aisle-us` | /aɪəl/ | /aɪl/ |
| `solely-us` | /ˈsoʊəli/ | /ˈsoʊlli/ |
| `temperament-us` | /ˈtempɚmənt/ | /ˈtemprəmənt/ |
| `realism-us` | /ˈriəlɪzm/ | /ˈriəlɪzəm/ |

### 拆分词性(15 个词)

| 词 | 词性 | 英音 | 美音 |
|---|---|---|---|
| `compound` | n. | /ˈkɒmpaʊnd/ | /ˈkɑːmpaʊnd/ |
| `compound` | adj. | /ˈkɒmpaʊnd/ | /ˈkɑːmpaʊnd/ |
| `compound` | v. | /kəmˈpaʊnd/ | /kəmˈpaʊnd/ |
| `conduct` | v. | /kənˈdʌkt/ | /kənˈdʌkt/ |
| `conduct` | n. | /ˈkɒndʌkt/ | /ˈkɑːndʌkt/ |
| `conflict` | n. | /ˈkɒnflɪkt/ | /ˈkɑːnflɪkt/ |
| `conflict` | v. | /kənˈflɪkt/ | /kənˈflɪkt/ |
| `content` | adj. | /kənˈtent/ | /kənˈtent/ |
| `content` | n. | /ˈkɒntent/ | /ˈkɑːntent/ |
| `contract` | n. | /ˈkɒntrækt/ | /ˈkɑːntrækt/ |
| `contract` | v. | /kənˈtrækt/ | /kənˈtrækt/ |
| `convict` | v. | /kənˈvɪkt/ | /kənˈvɪkt/ |
| `convict` | n. | /ˈkɒnvɪkt/ | /ˈkɑːnvɪkt/ |
| `desert` | n. | /ˈdezət/ | /ˈdezɚt/ |
| `desert` | v. | /dɪˈzɜːt/ | /dɪˈzɝːt/ |
| `experiment` | n. | /ɪkˈsperɪmənt/ | /ɪkˈsperəmənt/ |
| `experiment` | v. | /ɪkˈsperɪment/ | /ɪkˈsperəment/ |
| `exploit` | v. | /ɪkˈsplɔɪt/ | /ɪkˈsplɔɪt/ |
| `exploit` | n. | /ˈeksplɔɪt/ | /ˈeksplɔɪt/ |
| `extract` | v. | /ɪkˈstrækt/ | /ɪkˈstrækt/ |
| `extract` | n. | /ˈekstrækt/ | /ˈekstrækt/ |
| `implement` | v. | /ˈɪmplɪment/ | /ˈɪmpləment/ |
| `implement` | n. | /ˈɪmplɪmənt/ | /ˈɪmpləmənt/ |
| `project` | n. | /ˈprɒdʒekt/ | /ˈprɑːdʒekt/ |
| `project` | v. | /prəˈdʒekt/ | /prəˈdʒekt/ |
| `separate` | v. | /ˈsepəreɪt/ | /ˈsepəreɪt/ |
| `separate` | adj. | /ˈseprət/ | /ˈseprət/ |
| `transport` | n. | /ˈtrænspɔːt/ | /ˈtrænspɔːrt/ |
| `transport` | v. | /trænˈspɔːt/ | /trænˈspɔːrt/ |
| `update` | v. | /ˌʌpˈdeɪt/ | /ˌʌpˈdeɪt/ |
| `update` | n. | /ˈʌpdeɪt/ | /ˈʌpdeɪt/ |
