# 雅思词库音标核查(2026-11-02)

把 D1 `ielts_pronunciations` 全部 9182 条读音与 ODE(英式)、NOAD(美式)程序比对,差异大的逐条人工裁决。修改 253 处读音,涉及 234 个词条,迁移 `0265_fix_ielts_phonetics_audit`,已应用到线上 D1 并记账。音标原本由 ipa-dict 加人工校正生成,这是第一次全量核对词典。

## 方法

- 从本机 ODE、NOAD 读取音标,按词头和词性建索引,统一两种音标体系后计算差异,并单独比较主重音和重读元音。
- 词组和变形词在词典里查不到整词时,按单词比对,复数、-ing、-ed 用词根加词尾。
- 人工通读了差异分数不低于 0.6 的约 400 条,判断是错误还是词典认可的变体。分数低于 0.6 的只查了主重音和重读元音,没有逐条读。
- 裁决风格沿用项目约定:英音参照 Oxford,美音参照 Cambridge。

## 音频

**`scripts/generate-ielts-audio.mjs` 并不是按音标生成全部音频。** 只有名动异读的 34 个词条用 SSML 读音标,其余词条按纯文本朗读,发音来自 Google 词库。所以这次的音标错误大多只影响显示,没有进入音频。本次修改不涉及名动异读词条,这些词条的请求没有变化,`--ids` 会直接跳过。

为了核对音标和音频是否一致,用修正后的音标合成了对照音频,与现有音频做声学距离(DTW)比较,并用 40 条未改动的词条校准:

| 组别 | 中位距离 | 最大距离 |
|---|---|---|
| 未改动的对照词条(40 条) | 2.21 | 5.39 |
| 本次修改及重新生成的读音(259 条) | 1.40 | 7.88 |

处理结果:

- 超过对照组最大值的 17 条改为按音标用 SSML 生成,名单写入生成脚本的 `IPA_READINGS`:`adequate-us`、`admission-us`、`adverse-uk`、`ammonia-uk`、`authentic-us`、`best-seller-us`、`congruent-us`、`disobedient-uk`、`ecotourism-us`、`exponential-us`、`glacier-uk`、`moth-uk`、`petrol-us`、`prestigious-us`、`syrup-us`、`temperamental-us`、`torrential-us`。
- `best-seller`、`pay-slip`、`notice-board` 的朗读文本在 0264 改过,已重新生成。其中 `best-seller-us` 同时在上面的名单里。
- 实际替换 22 个音频文件,上线内容与本地逐字节一致。其余读音保留原音频。

**局限:** 声学距离只能发现明显偏差,不等于人耳确认。没有人工试听。短词(如 `moth`)的距离噪声较大,未改动的词条里也有接近 5.4 的,所以这个阈值只是粗筛。

**缓存:** R2 文件带 `immutable, max-age=1 年`,这次在原路径覆盖。边缘节点没有缓存(`cf-cache-status: DYNAMIC`),但已经播放过这些词的浏览器可能继续使用旧文件,最长一年。

## 没有改的

| 类别 | 条数 | 处理理由 |
|---|---|---|
| 英音 `ɔː` 与 `ʊə`(pure、mature、tourism) | 17 条单词,另有含这些词的词组 | 主流词典都收录两种读法,属于风格差异 |
| 英音非重读 `juː` 与 `ju`(argument、regulate) | 约 24 条 | 只差长音符号 |
| 美音 `ær` 与 `er`(arrow、carrier) | 12 条 | NOAD 按合并后的读音标,Cambridge 区分,与项目约定一致 |
| 词组内部重音(blood pressure、rush hour) | 59 条 | 词组是逐词转写的,不是词典的复合词重音。要改得单独定规则 |
| 词典认可的变体(halt、transit、intrinsic、innovative、recuperate、terrain、ion、pedagogy) | 约 30 条 | 项目读法也是常见读法 |

其他未处理项:

- 4 个词条(8 条读音)没有音标:`broaden one's horizons`、`can't stand doing sth.`、`convert A into B`、`object to (doing) sth.`,因为含占位词。
- `first-aid-kit`、`hang-gliding`、`neolithic`、`paleolithic`、`empty-nester` 的朗读文本在 0264 也改过,读音不受影响,没有重新生成。这 5 个 id 下次跑 `--ids` 时会重新生成。
- `jewellery` 没有填美式拼写 `jewelry`,这是拼写问题,不属于本次范围。
- `scripts/fixtures/ielts-phonetics.json` 仍是 0264 之前的生成结果,构建不读它。重新运行 `npm run ielts:phonetics` 会更新 16 行,已验证不报错。

## 修改清单

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
