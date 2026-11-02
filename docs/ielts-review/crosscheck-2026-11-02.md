# 雅思词库拼写与音标交叉复查(2026-11-02)

拼写全量复查一遍,音标全量复查一遍,都用多个来源交叉比对。修改写入迁移 `0267_fix_ielts_spelling_and_phonetics_crosscheck` 和 `0268_unify_ielts_phonetics_first_choice`(统一首选的 73 处),都已应用到线上 D1 并记账:2 条写法、2 句例句、323 处读音。音频不在本次范围内。

## 来源

| 来源 | 出版方 | 拼写 | 英音 | 美音 | 说明 |
|---|---|---|---|---|---|
| ODE、NOAD 及牛津双语词典 | 牛津 | 有 | 有 | 有 | 共用同一套读音数据,只算一个来源 |
| 譯典通 | Dr.eye(台湾) | 有 | 有 | 有(KK) | 独立 |
| WISDOM 英日词典 | 三省堂 | 有 | 部分 | 有 | 独立 |
| Van Dale 荷英词典 | Van Dale | 有 | 有 | 无 | 独立 |
| 韩英词典 | 韩国出版方 | 有 | 未用 | 未用 | 只用于拼写,读音格式未能可靠解析 |
| macOS 拼写检查器 | Apple | 英式、美式 | 无 | 无 | 只用于拼写 |
| Oxford Learner's(线上) | 牛津 | 不适用 | 有 | 有 | 项目约定的英音标准,用于仲裁 |
| Cambridge(线上) | 剑桥 | 不适用 | 有 | 有 | 项目约定的美音标准,用于仲裁 |

## 拼写

- **方法:** 4557 条全部逐个拆词,用英式、美式拼写检查器检查;整条和单词分别在五组本地词典(牛津系、譯典通、WISDOM、韩英、Van Dale)里查词头、变体和派生词;另查连字符和空格写法、大小写、英式位置是否写成了美式拼写、`spelling_us` 是否漏填或错填。
- **结果:** 没有拼错的词;`spelling_us` 没有漏填或错填;美式拼写全部通过美式检查器。
- **修改 2 条写法(词条 id 不变,例句和例句源文件同步):**
  - `life span` 改为 `lifespan`(词性 phr. 改为 n.):ODE、Oxford Learner's 都连写。音标改为 `/ˈlaɪfspæn/`。
  - `en-suite` 改为 `en suite`:ODE、譯典通、WISDOM、韩英、Van Dale 都不带连字符。
- **保留:** 短语动词(`break down`、`set up` 等,释义是动词,应分写)、`co-educational`、`hard-working`、`north-east`、`waste water` 等写法与 ODE 一致;`encyclopedia`、`neuron` 是 Oxford Learner's 的主词条;`payslip`、`postcode`、`anticlockwise` 是英式专用词,按约定不填美式拼写。

## 音标

### 方法

1. **四来源投票:** 全部 9214 条读音与上表四组本地来源比对。比对前把各家写法转换成项目风格,比如 KK 的 `e` 转成 `eɪ`、DJ 的 `ɔ` 转成 `ɒ`;WISDOM 的英音片段先拼回完整读音再比。
2. **人工审阅分歧:** 牛津系与至少一个独立来源都不同意的,以及至少两个独立来源不同意的,逐条人工审阅。
3. **线上仲裁:** 拟修改的读音、所有保留的分歧读音,以及前两轮的全部修改,都用 Oxford Learner's 和 Cambridge 线上版核对。按项目约定,英音以 Oxford Learner's 为准,美音以 Cambridge 为准,统一用参考词典的首选读音;只是参考词典列出的其他读法,也改为首选。比对是严格比对,长短音、`ɒ`/`ɑː`、`d`/`t` 都算不同。
4. **回归检查:** 改完后重跑四来源投票,确认分歧确实减少。

### 结果

- **与四来源的一致率(改前 → 改后):** 牛津系 97.8% → 98.5%;譯典通 90.7% → 92.2%;WISDOM 91.2% → 92.4%;Van Dale 94.5% → 96.7%。剩下的差异主要是记法差异和各家首选不同。
- **线上仲裁:** 229 条拟修改中,212 条与参考词典首选一致后采用,3 条按首选写法调整后采用;14 条参考词典首选原读音,改回保留,如 `intrinsic-uk`、`widespread-us`、`taoism`。保留的 250 条分歧读音中,164 条是参考词典首选,31 条两者都不符,已经改正;其余是参考词典列出的非首选读法,已统一为首选(见下)。
- **前两轮修改复核:** 0265、0266 的约 330 处修改全部用线上词典复核:274 处是参考词典首选;47 处是列出的非首选读法,其中 19 处已统一为首选,包括我第一轮凭记忆改的 `torrential-us`、`gourmet-us`、`granary-us`、`saturn-uk`、`partisan-uk`;2 处有误,已在本次改正(`altruism-uk`、`luxurious-us`);另有 7 处原值在本次系统性修正中更新(如 `insulation-uk`、`refugee-uk`)。其余 5 处对不上的,3 处是抓错了页面,2 处是美音 cot-caught 写法差异。
- **回归(统一首选之前):** 改动的读音中,与本地来源的分歧减少 153 条、持平 94 条、增加 5 条。增加的 5 条都以参考词典为准,比如 `elsewhere-uk` 按 Oxford Learner's 定为 `/ˌelsˈweə/`。

### 系统性问题

- **非重读 `uː`(70 处):** 原数据在非重读音节写长音,比如 `/ˌedʒuːˈkeɪʃən/`、`/ˈkæʒuːəl/`;Oxford Learner's 和四组来源都写短音 `u` 或 `ə`。`attribute`、`molecule`、`tuition` 这类参考词典本来就写长音的没有改。
- **CURE 元音(38 处,统一时又改了 `assure`、`ensure`、`tour`):** `pure`、`tourism`、`security`、`mature` 等写成了 `ɔː`;Oxford Learner's 首选 `ʊə`,`ɔː` 列为第二读法。Cambridge 英音反过来首选 `ɔː`,按约定以 Oxford Learner's 为准。
- **`al`/`au` 读 `ɒl`(7 处):** `alter`、`fault`、`halt`、`waltz` 等;Oxford Learner's 是 `ɔːl`,Cambridge 英音偏 `ɒl`,按约定以 Oxford Learner's 为准。

### 统一为首选读音

查过线上词典的读音,只要不是参考词典的首选,一律改为首选,共 73 处(迁移 0268)。这样同类词写法一致,比如 `tour` 与 `tourism` 都写 `ʊə`。另有约 30 条没改,原因是:

- **多词性词:** 页面排在第一的是另一个词性的读音,如 `content`、`project`、`increase`,分词性读音本来就对。
- **抓错页面:** `savanna`、`masters-degree`。
- **Mary/marry 写法:** 如 `carry-on-us`,见下。

### 没有改的

- **美音 Mary/marry/merry:** 有的写 `ær`,有的写 `er`(如 `arrogant /ˈerəɡənt/`、`arrow /ˈæroʊ/`),写法不统一,但两种都是正确读音,没有统一。
- **词组内部重音:** 只改了 Oxford Learner's 或 Cambridge 有独立词条、并且标了复合词重音的(如 `law-abiding`、`e-commerce`、`hang-gliding`);其余词组仍按逐词转写。
- **没有覆盖的部分:** 92 条读音在所有来源里都查不到(大多是复数、动名词或新词),只做了人工通读。本地来源全部同意的读音没有再拿线上词典核对。

## 音频

本次没有处理音频:

- **纯文本朗读的读音:** 音频不受音标修改影响。
- **按音标朗读的 5 条美音:** `authentic-us`、`congruent-us`、`exponential-us`、`temperamental-us`、`torrential-us` 的音标在统一时改了,音频仍按旧音标朗读,显示和朗读暂时不一致(两种都是参考词典认可的读音)。重新生成这 5 个文件要覆盖 R2 上的音频,需另行确认。
- **文本变了的 2 条:** `lifespan`、`en suite` 的朗读文本变了,音频还是旧文本生成的。

下次跑生成脚本时,以上 7 条都会重新生成。

## 修改清单

共 323 处读音,另有 2 条写法、2 句例句。第一列是读音 id,后缀 `-uk`、`-us` 表示口音。同一读音在两组都出现时,以后面一组的新音标为准。

### 非重读 u 的长短(英音)(70 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `accusation-uk` | /ˌækjuːˈzeɪʃən/ | /ˌækjuˈzeɪʃən/ |
| `affluent-uk` | /ˈæfluːənt/ | /ˈæfluənt/ |
| `ambiguous-uk` | /æmˈbɪɡjuːəs/ | /æmˈbɪɡjuəs/ |
| `ammunition-uk` | /ˌæmjuːˈnɪʃən/ | /ˌæmjəˈnɪʃən/ |
| `annual-leave-uk` | /ˈænjuːəl liːv/ | /ˈænjuəl liːv/ |
| `annual-uk` | /ˈænjuːəl/ | /ˈænjuəl/ |
| `arduous-uk` | /ˈɑːdjuːəs/ | /ˈɑːdjuəs/ |
| `arguably-uk` | /ˈɑːɡjuːəbli/ | /ˈɑːɡjuəbli/ |
| `argument-uk` | /ˈɑːɡjuːmənt/ | /ˈɑːɡjumənt/ |
| `casual-uk` | /ˈkæʒuːəl/ | /ˈkæʒuəl/ |
| `casualty-uk` | /ˈkæʒuːəlti/ | /ˈkæʒuəlti/ |
| `co-educational-uk` | /kəʊ ˌedʒuːˈkeɪʃənəl/ | /ˌkəʊ ˌedʒuˈkeɪʃənəl/ |
| `compulsory-education-uk` | /kəmˈpʌlsəri ˌedʒuːˈkeɪʃən/ | /kəmˈpʌlsəri ˌedʒuˈkeɪʃən/ |
| `computation-uk` | /ˌkɒmpjuːˈteɪʃən/ | /ˌkɒmpjuˈteɪʃən/ |
| `consecutive-uk` | /kənˈsekjuːtɪv/ | /kənˈsekjətɪv/ |
| `conspicuous-uk` | /kənˈspɪkjuːəs/ | /kənˈspɪkjuəs/ |
| `deciduous-uk` | /dɪˈsɪdjuːəs/ | /dɪˈsɪdjuəs/ |
| `deputy-uk` | /ˈdepjuːti/ | /ˈdepjuti/ |
| `documentary-uk` | /ˌdɒkjuːˈmentəri/ | /ˌdɒkjuˈmentri/ |
| `documentation-uk` | /ˌdɒkjuːmənˈteɪʃən/ | /ˌdɒkjumenˈteɪʃən/ |
| `education-uk` | /ˌedʒuːˈkeɪʃən/ | /ˌedʒuˈkeɪʃən/ |
| `educational-uk` | /ˌedʒuːˈkeɪʃənəl/ | /ˌedʒuˈkeɪʃənəl/ |
| `educator-uk` | /ˈedʒuːkeɪtə/ | /ˈedʒukeɪtə/ |
| `estuary-uk` | /ˈestjuːəri/ | /ˈestjuəri/ |
| `evacuate-uk` | /ɪˈvækjuːeɪt/ | /ɪˈvækjueɪt/ |
| `evaluate-uk` | /ɪˈvæljuːeɪt/ | /ɪˈvæljueɪt/ |
| `eventually-uk` | /ɪˈventʃuːəli/ | /ɪˈventʃuəli/ |
| `fluctuate-uk` | /ˈflʌktʃuːeɪt/ | /ˈflʌktʃueɪt/ |
| `fluctuation-uk` | /ˌflʌktʃuːˈeɪʃən/ | /ˌflʌktʃuˈeɪʃən/ |
| `genuine-uk` | /ˈdʒenjuːɪn/ | /ˈdʒenjuɪn/ |
| `gradual-uk` | /ˈɡrædʒuːəl/ | /ˈɡrædʒuəl/ |
| `higher-education-uk` | /ˈhaɪə ˌedʒuːˈkeɪʃən/ | /ˈhaɪə ˌedʒuˈkeɪʃən/ |
| `individualism-uk` | /ˌɪndɪˈvɪdʒuːəlɪzəm/ | /ˌɪndɪˈvɪdʒuəlɪzəm/ |
| `influence-uk` | /ˈɪnfluːəns/ | /ˈɪnfluəns/ |
| `influential-uk` | /ˌɪnfluːˈenʃəl/ | /ˌɪnfluˈenʃəl/ |
| `insulation-uk` | /ˌɪnsjuːˈleɪʃən/ | /ˌɪnsjuˈleɪʃən/ |
| `insulator-uk` | /ˈɪnsjuːleɪtə/ | /ˈɪnsjuleɪtə/ |
| `intellectual-property-uk` | /ˌɪntəˈlektʃuːəl ˈprɒpəti/ | /ˌɪntəˈlektʃuəl ˈprɒpəti/ |
| `intellectual-uk` | /ˌɪntəˈlektʃuːəl/ | /ˌɪntəˈlektʃuəl/ |
| `invaluable-uk` | /ɪnˈvæljuːəbəl/ | /ɪnˈvæljuəbəl/ |
| `irregular-uk` | /ɪˈreɡjuːlə/ | /ɪˈreɡjələ/ |
| `manual-labour-uk` | /ˈmænjuːəl ˈleɪbə/ | /ˈmænjuəl ˈleɪbə/ |
| `manufacture-uk` | /ˌmænjuːˈfæktʃə/ | /ˌmænjuˈfæktʃə/ |
| `manufacturer-uk` | /ˌmænjuːˈfæktʃərə/ | /ˌmænjuˈfæktʃərə/ |
| `manuscript-uk` | /ˈmænjuːskrɪpt/ | /ˈmænjuskrɪpt/ |
| `monument-uk` | /ˈmɒnjuːmənt/ | /ˈmɒnjumənt/ |
| `mutual-understanding-uk` | /ˈmjuːtʃuːəl ˌʌndəˈstændɪŋ/ | /ˈmjuːtʃuəl ˌʌndəˈstændɪŋ/ |
| `mutualism-uk` | /ˈmjuːtʃuːəlɪzəm/ | /ˈmjuːtʃuəlɪzəm/ |
| `prejudice-uk` | /ˈpredʒuːdɪs/ | /ˈpredʒədɪs/ |
| `punctual-uk` | /ˈpʌŋktʃuːəl/ | /ˈpʌŋktʃuəl/ |
| `refugee-uk` | /ˌrefjuːˈdʒiː/ | /ˌrefjuˈdʒiː/ |
| `regulate-uk` | /ˈreɡjuːleɪt/ | /ˈreɡjuleɪt/ |
| `regulation-uk` | /ˌreɡjuːˈleɪʃən/ | /ˌreɡjuˈleɪʃən/ |
| `reputation-uk` | /ˌrepjuːˈteɪʃən/ | /ˌrepjuˈteɪʃən/ |
| `residual-uk` | /rɪˈzɪdjuːəl/ | /rɪˈzɪdjuəl/ |
| `ritual-uk` | /ˈrɪtʃuːəl/ | /ˈrɪtʃuəl/ |
| `sexuality-uk` | /ˌsekʃuːˈælɪti/ | /ˌsekʃuˈælɪti/ |
| `situate-uk` | /ˈsɪtʃuːeɪt/ | /ˈsɪtʃueɪt/ |
| `solubility-uk` | /ˌsɒljuːˈbɪlɪti/ | /ˌsɒljuˈbɪlɪti/ |
| `soluble-uk` | /ˈsɒljuːbəl/ | /ˈsɒljəbəl/ |
| `spiritual-uk` | /ˈspɪrɪtʃuːəl/ | /ˈspɪrɪtʃuəl/ |
| `tertiary-education-uk` | /ˈtɜːʃəri ˌedʒuːˈkeɪʃən/ | /ˈtɜːʃəri ˌedʒuˈkeɪʃən/ |
| `tributary-uk` | /ˈtrɪbjuːtəri/ | /ˈtrɪbjətri/ |
| `undergraduate-uk` | /ˌʌndəˈɡrædjuːət/ | /ˌʌndəˈɡrædjuət/ |
| `unusual-uk` | /ʌˈnjuːʒuːəl/ | /ʌnˈjuːʒuəl/ |
| `valuable-uk` | /ˈvæljuːəbəl/ | /ˈvæljuəbəl/ |
| `virtual-reality-uk` | /ˈvɜːtʃuːəl rɪˈælɪti/ | /ˈvɜːtʃuəl rɪˈælɪti/ |
| `virtual-uk` | /ˈvɜːtʃuːəl/ | /ˈvɜːtʃuəl/ |
| `virtually-uk` | /ˈvɜːtʃuːəli/ | /ˈvɜːtʃuəli/ |
| `visual-aid-uk` | /ˈvɪʒuːəl eɪd/ | /ˈvɪʒuəl eɪd/ |

### CURE 元音 ʊə(英音)(38 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `bureaucracy-uk` | /bjɔːˈrɒkrəsi/ | /bjʊəˈrɒkrəsi/ |
| `caricature-uk` | /ˈkærɪkətʃɔː/ | /ˈkærɪkətʃʊə/ |
| `contour-uk` | /ˈkɒntɔː/ | /ˈkɒntʊə/ |
| `cure-uk` | /kjɔː/ | /kjʊə/ |
| `curious-uk` | /ˈkjʊriəs/ | /ˈkjʊəriəs/ |
| `detour-uk` | /ˈdiːtɔː/ | /ˈdiːtʊə/ |
| `durable-uk` | /ˈdjɔːrəbəl/ | /ˈdjʊərəbəl/ |
| `duration-uk` | /djɔːˈreɪʃən/ | /djuˈreɪʃən/ |
| `endure-uk` | /ɪnˈdjɔː/ | /ɪnˈdjʊə/ |
| `food-security-uk` | /fuːd sɪˈkjɔːrɪti/ | /fuːd sɪˈkjʊərɪti/ |
| `furious-uk` | /ˈfjɔːriəs/ | /ˈfjʊəriəs/ |
| `gourmet-uk` | /ˈɡɔːmeɪ/ | /ˈɡʊəmeɪ/ |
| `health-insurance-uk` | /helθ ɪnˈʃɔːrəns/ | /helθ ɪnˈʃʊərəns/ |
| `immature-uk` | /ˌɪməˈtʃɔː/ | /ˌɪməˈtʃʊə/ |
| `impurity-uk` | /ɪmˈpjʊrɪti/ | /ɪmˈpjʊərɪti/ |
| `insurance-uk` | /ɪnˈʃɔːrəns/ | /ɪnˈʃʊərəns/ |
| `job-security-uk` | /dʒɒb sɪˈkjɔːrɪti/ | /dʒɒb sɪˈkjʊərɪti/ |
| `jury-uk` | /ˈdʒɔːri/ | /ˈdʒʊəri/ |
| `lure-uk` | /lɔː/ | /lʊə/ |
| `manure-uk` | /məˈnjɔː/ | /məˈnjʊə/ |
| `mass-tourism-uk` | /mæs ˈtɔːrɪzəm/ | /mæs ˈtʊərɪzəm/ |
| `mature-student-uk` | /məˈtʃɔː ˈstjuːdənt/ | /məˈtʃʊə ˈstjuːdənt/ |
| `mature-uk` | /məˈtʃɔː/ | /məˈtʃʊə/ |
| `national-security-uk` | /ˈnæʃənəl sɪˈkjɔːrɪti/ | /ˈnæʃənəl sɪˈkjʊərɪti/ |
| `neuron-uk` | /ˈnjuːrɒn/ | /ˈnjʊərɒn/ |
| `plural-uk` | /ˈplɔːrəl/ | /ˈplʊərəl/ |
| `pure-uk` | /pjɔː/ | /pjʊə/ |
| `purely-uk` | /ˈpjɔːli/ | /ˈpjʊəli/ |
| `purity-uk` | /ˈpjʊrɪti/ | /ˈpjʊərɪti/ |
| `rural-uk` | /ˈrɔːrəl/ | /ˈrʊərəl/ |
| `secure-uk` | /sɪˈkjɔː/ | /sɪˈkjʊə/ |
| `security-deposit-uk` | /sɪˈkjɔːrɪti dɪˈpɒzɪt/ | /sɪˈkjʊərɪti dɪˈpɒzɪt/ |
| `security-uk` | /sɪˈkjɔːrɪti/ | /sɪˈkjʊərɪti/ |
| `social-security-uk` | /ˈsəʊʃəl sɪˈkjɔːrɪti/ | /ˈsəʊʃəl sɪˈkjʊərɪti/ |
| `tourism-uk` | /ˈtɔːrɪzəm/ | /ˈtʊərɪzəm/ |
| `tourist-attraction-uk` | /ˈtɔːrɪst əˈtrækʃən/ | /ˈtʊərɪst əˈtrækʃən/ |
| `tournament-uk` | /ˈtɔːnəmənt/ | /ˈtʊənəmənt/ |
| `urine-uk` | /ˈjɔːrɪn/ | /ˈjʊərɪn/ |

### al/au 拼写读 ɔːl(英音)(7 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `almanac-uk` | /ˈɒlmənæk/ | /ˈɔːlmənæk/ |
| `alter-uk` | /ˈɒltə/ | /ˈɔːltə/ |
| `although-uk` | /ɒlˈðəʊ/ | /ɔːlˈðəʊ/ |
| `assault-uk` | /əˈsɒlt/ | /əˈsɔːlt/ |
| `fault-uk` | /fɒlt/ | /fɔːlt/ |
| `halt-uk` | /hɒlt/ | /hɔːlt/ |
| `waltz-uk` | /wɒlts/ | /wɔːls/ |

### 音段错误(76 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `amenity-uk` | /əˈmenɪti/ | /əˈmiːnɪti/ |
| `anxious-uk` | /ˈæŋʃəs/ | /ˈæŋkʃəs/ |
| `astrophysics-uk` | /ˌæstrəˈfɪzɪks/ | /ˌæstrəʊˈfɪzɪks/ |
| `authenticity-us` | /ˌɔːθənˈtɪsɪti/ | /ˌɔːθenˈtɪsɪti/ |
| `autobiography-uk` | /ˌɔːtəʊbaɪˈɒɡrəfi/ | /ˌɔːtəbaɪˈɒɡrəfi/ |
| `booth-uk` | /buːθ/ | /buːð/ |
| `calm-us` | /kɑːlm/ | /kɑːm/ |
| `christianity-uk` | /ˌkrɪstʃiˈænɪti/ | /ˌkrɪstiˈænɪti/ |
| `coastline-uk` | /ˈkəʊslaɪn/ | /ˈkəʊstlaɪn/ |
| `compensate-uk` | /ˈkɒmpənseɪt/ | /ˈkɒmpenseɪt/ |
| `compensation-uk` | /ˌkɒmpənˈseɪʃən/ | /ˌkɒmpenˈseɪʃən/ |
| `connotation-uk` | /kɒnəʊˈteɪʃən/ | /ˌkɒnəˈteɪʃən/ |
| `coupon-us` | /ˈkjuːpɔːn/ | /ˈkuːpɑːn/ |
| `decomposition-us` | /ˌdiːkəmpəˈzɪʃən/ | /ˌdiːkɑːmpəˈzɪʃən/ |
| `diploma-us` | /dɪˈploʊmɑː/ | /dɪˈploʊmə/ |
| `directive-uk` | /daɪˈrektɪv/ | /dəˈrektɪv/ |
| `directive-us` | /daɪˈrektɪv/ | /dəˈrektɪv/ |
| `drastic-uk` | /ˈdrɑːstɪk/ | /ˈdræstɪk/ |
| `ecology-uk` | /eˈkɒlədʒi/ | /iˈkɒlədʒi/ |
| `electric-vehicle-uk` | /ɪˈlektrɪk ˈvɪəkəl/ | /ɪˈlektrɪk ˈviːəkəl/ |
| `electric-vehicle-us` | /ɪˈlektrɪk ˈviːhɪkəl/ | /ɪˈlektrɪk ˈviːəkəl/ |
| `electronic-uk` | /ˌelɪkˈtrɒnɪk/ | /ɪˌlekˈtrɒnɪk/ |
| `electronics-uk` | /ˌelɪkˈtrɒnɪks/ | /ɪˌlekˈtrɒnɪks/ |
| `enact-uk` | /eˈnækt/ | /ɪˈnækt/ |
| `endangered-species-uk` | /ɪnˈdeɪndʒəd ˈspiːsiːz/ | /ɪnˈdeɪndʒəd ˈspiːʃiːz/ |
| `endemic-us` | /ɪnˈdemɪk/ | /enˈdemɪk/ |
| `environmental-uk` | /enˌvaɪrənˈmentəl/ | /ɪnˌvaɪrənˈmentəl/ |
| `environmentalist-uk` | /enˌvaɪrənˈmentəlɪst/ | /ɪnˌvaɪrənˈmentəlɪst/ |
| `epoch-uk` | /ˈepɒk/ | /ˈiːpɒk/ |
| `examination-uk` | /eɡˌzæmɪˈneɪʃən/ | /ɪɡˌzæmɪˈneɪʃən/ |
| `expertise-uk` | /ˌekspəˈtiːz/ | /ˌekspɜːˈtiːz/ |
| `facet-uk` | /ˈfæset/ | /ˈfæsɪt/ |
| `genus-uk` | /ˈdʒenəs/ | /ˈdʒiːnəs/ |
| `hurricane-uk` | /ˈhʌrɪkeɪn/ | /ˈhʌrɪkən/ |
| `introvert-uk` | /ˈɪntrəʊvɜːt/ | /ˈɪntrəvɜːt/ |
| `introvert-us` | /ˈɪntroʊvɝːt/ | /ˈɪntrəvɝːt/ |
| `ion-uk` | /ˈaɪɒn/ | /ˈaɪən/ |
| `junior-uk` | /ˈdʒuːnjə/ | /ˈdʒuːniə/ |
| `leisure-centre-us` | /ˈleʒɚ ˈsentɚ/ | /ˈliːʒɚ ˈsentɚ/ |
| `leisure-us` | /ˈleʒɚ/ | /ˈliːʒɚ/ |
| `lilac-us` | /ˈlaɪlæk/ | /ˈlaɪlək/ |
| `local-speciality-us` | /ˈloʊkəl ˌspeʃiˈælɪti/ | /ˈloʊkəl ˈspeʃəlti/ |
| `lowland-us` | /ˈloʊlænd/ | /ˈloʊlənd/ |
| `mushroom-uk` | /ˈmʌʃruːm/ | /ˈmʌʃrʊm/ |
| `myriad-uk` | /ˈmɪrɪæd/ | /ˈmɪriəd/ |
| `neolithic-uk` | /ˌniːəʊˈlɪθɪk/ | /ˌniːəˈlɪθɪk/ |
| `obey-uk` | /əʊˈbeɪ/ | /əˈbeɪ/ |
| `objectivity-uk` | /ɒbdʒɪkˈtɪvɪti/ | /ˌɒbdʒekˈtɪvɪti/ |
| `opposite-uk` | /ˈɒpəsɪt/ | /ˈɒpəzɪt/ |
| `paleolithic-us` | /ˌpeɪlioʊˈlɪθɪk/ | /ˌpeɪliəˈlɪθɪk/ |
| `pedagogy-uk` | /ˈpedəɡɒɡi/ | /ˈpedəɡɒdʒi/ |
| `photocopier-uk` | /ˈfəʊtəkɒpɪə/ | /ˈfəʊtəʊkɒpiə/ |
| `photocopy-uk` | /ˈfəʊtəkɒpi/ | /ˈfəʊtəʊkɒpi/ |
| `productivity-uk` | /ˌprɒdəkˈtɪvɪti/ | /ˌprɒdʌkˈtɪvɪti/ |
| `prototype-uk` | /ˈprəʊtəʊtaɪp/ | /ˈprəʊtətaɪp/ |
| `recuperate-uk` | /rɪˈkjuːpəreɪt/ | /rɪˈkuːpəreɪt/ |
| `roommate-uk` | /ˈruːmeɪt/ | /ˈruːmmeɪt/ |
| `roommate-us` | /ˈruːmeɪt/ | /ˈruːmmeɪt/ |
| `ruins-us` | /ruənz/ | /ˈruːɪnz/ |
| `self-esteem-uk` | /self eˈstiːm/ | /ˌself ɪˈstiːm/ |
| `sovereignty-uk` | /ˈsɒvərɪnti/ | /ˈsɒvrənti/ |
| `species-uk` | /ˈspiːsiːz/ | /ˈspiːʃiːz/ |
| `superior-us` | /suˈpɪriɚ/ | /səˈpɪriɚ/ |
| `surveillance-uk` | /səˈveɪləns/ | /sɜːˈveɪləns/ |
| `tertiary-education-us` | /ˈtɝːʃəri ˌedʒəˈkeɪʃən/ | /ˈtɝːʃieri ˌedʒəˈkeɪʃən/ |
| `thermodynamics-uk` | /ˌθɜːmədaɪˈnæmɪks/ | /ˌθɜːməʊdaɪˈnæmɪks/ |
| `threshold-uk` | /ˈθreʃəʊld/ | /ˈθreʃhəʊld/ |
| `threshold-us` | /ˈθreʃoʊld/ | /ˈθreʃhoʊld/ |
| `unemployed-uk` | /ʌnemˈplɔɪd/ | /ˌʌnɪmˈplɔɪd/ |
| `unemployed-us` | /ˌʌnemˈplɔɪd/ | /ˌʌnɪmˈplɔɪd/ |
| `unemployment-benefit-uk` | /ʌnemˈplɔɪmənt ˈbenɪfɪt/ | /ˌʌnɪmˈplɔɪmənt ˈbenɪfɪt/ |
| `unemployment-uk` | /ʌnemˈplɔɪmənt/ | /ˌʌnɪmˈplɔɪmənt/ |
| `unprecedented-uk` | /ʌnˈpresɪdəntɪd/ | /ʌnˈpresɪdentɪd/ |
| `vehicle-uk` | /ˈvɪəkəl/ | /ˈviːəkəl/ |
| `vehicle-us` | /ˈviːhɪkəl/ | /ˈviːəkəl/ |
| `westernisation-uk` | /ˌwestənɪˈzeɪʃən/ | /ˌwestənaɪˈzeɪʃən/ |

### 重音(25 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `carry-on-uk` | /ˌkæri ɒn/ | /ˈkæri ɒn/ |
| `carry-on-us` | /ˌkæri ɑːn/ | /ˈkæri ɑːn/ |
| `diagnose-uk` | /daɪəɡˈnəʊz/ | /ˈdaɪəɡnəʊz/ |
| `diagnose-us` | /daɪəɡˈnoʊs/ | /ˌdaɪəɡˈnoʊs/ |
| `e-commerce-uk` | /ˌiː ˈkɒmɜːs/ | /ˈiː kɒmɜːs/ |
| `e-commerce-us` | /ˌiː ˈkɑːmɝːs/ | /ˈiː kɑːmɝːs/ |
| `e-learning-uk` | /iː ˈlɜːnɪŋ/ | /ˈiː lɜːnɪŋ/ |
| `e-learning-us` | /iː ˈlɝːnɪŋ/ | /ˈiː lɝːnɪŋ/ |
| `elsewhere-uk` | /ˈelsweə/ | /ˌelsˈweə/ |
| `hang-gliding-uk` | /hæŋ ˈɡlaɪdɪŋ/ | /ˈhæŋ ɡlaɪdɪŋ/ |
| `hang-gliding-us` | /hæŋ ˈɡlaɪdɪŋ/ | /ˈhæŋ ɡlaɪdɪŋ/ |
| `harassment-uk` | /həˈræsmənt/ | /ˈhærəsmənt/ |
| `indirect-uk` | /ɪndaɪˈrekt/ | /ˌɪndaɪˈrekt/ |
| `law-abiding-uk` | /lɔː əˈbaɪdɪŋ/ | /ˈlɔː əbaɪdɪŋ/ |
| `law-abiding-us` | /lɑː əˈbaɪdɪŋ/ | /ˈlɑː əbaɪdɪŋ/ |
| `lifelong-learning-us` | /laɪˈflɔːŋ ˈlɝːnɪŋ/ | /ˈlaɪflɔːŋ ˈlɝːnɪŋ/ |
| `outdoor-activities-uk` | /aʊtˈdɔː ækˈtɪvɪtiz/ | /ˈaʊtdɔː ækˈtɪvɪtiz/ |
| `second-hand-uk` | /ˌsekənd hænd/ | /ˈsekənd hænd/ |
| `second-hand-us` | /ˌsekənd hænd/ | /ˈsekənd hænd/ |
| `self-esteem-us` | /self əˈstiːm/ | /ˌself əˈstiːm/ |
| `south-west-uk` | /saʊθ west/ | /ˌsaʊθ ˈwest/ |
| `south-west-us` | /saʊθ west/ | /ˌsaʊθ ˈwest/ |
| `t-junction-uk` | /tiː ˈdʒʌŋkʃən/ | /ˈtiː dʒʌŋkʃən/ |
| `t-junction-us` | /tiː ˈdʒʌŋkʃən/ | /ˈtiː dʒʌŋkʃən/ |
| `widespread-uk` | /ˌwaɪdˈspred/ | /ˈwaɪdspred/ |

### 元音强弱(2 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `unless-uk` | /ʌnˈles/ | /ənˈles/ |
| `vocabulary-uk` | /vəʊˈkæbjʊləri/ | /vəˈkæbjələri/ |

### s / z(1 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `transition-uk` | /trænˈsɪʃən/ | /trænˈzɪʃən/ |

### Oxford Learner's / Cambridge 核对后改正(31 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `accelerate-us` | /ækˈseləreɪt/ | /əkˈseləreɪt/ |
| `accessible-us` | /ækˈsesəbəl/ | /əkˈsesəbəl/ |
| `accessory-us` | /ækˈsesəri/ | /əkˈsesəri/ |
| `adhesive-us` | /ædˈhiːsɪv/ | /ədˈhiːsɪv/ |
| `adventurous-us` | /ædˈventʃərəs/ | /ədˈventʃərəs/ |
| `alumni-uk` | /əˈlʌmni/ | /əˈlʌmnaɪ/ |
| `amateur-us` | /ˈæmətɝː/ | /ˈæmətʃɚ/ |
| `avenue-us` | /ˈævənu/ | /ˈævənuː/ |
| `celestial-uk` | /səˈlestjəl/ | /səˈlestiəl/ |
| `chimpanzee-uk` | /ˌtʃɪmpənˈziː/ | /ˌtʃɪmpænˈziː/ |
| `companion-uk` | /kəmˈpæniən/ | /kəmˈpænjən/ |
| `constitute-us` | /ˈkɑːnstətut/ | /ˈkɑːnstətuːt/ |
| `continuity-us` | /ˌkɑːntəˈnuəti/ | /ˌkɑːntəˈnuːəti/ |
| `differentiate-us` | /ˌdɪfəˈrentʃieɪt/ | /ˌdɪfəˈrenʃieɪt/ |
| `employee-us` | /ɪmˈplɔɪi/ | /ɪmˈplɔɪiː/ |
| `enthusiastic-uk` | /enˌθjuːzɪˈæstɪk/ | /ɪnˌθjuːziˈæstɪk/ |
| `fermentation-us` | /ˌfɝːmənˈteɪʃən/ | /ˌfɝːmenˈteɪʃən/ |
| `furthermore-us` | /ˌfɝːðɚˈmɔːr/ | /ˈfɝːðɚmɔːr/ |
| `herbivore-us` | /ˈɝːbɪvɔːr/ | /ˈhɝːbəvɔːr/ |
| `herbivorous-us` | /ɚˈbɪvərəs/ | /hɝːˈbɪvərəs/ |
| `invertebrate-us` | /ɪnˈvɝːtəbreɪt/ | /ɪnˈvɝːtəbrət/ |
| `longitude-us` | /ˈlɑːndʒətud/ | /ˈlɑːndʒətuːd/ |
| `senior-citizen-uk` | /ˈsiːnjə ˈsɪtɪzən/ | /ˈsiːniə ˈsɪtɪzən/ |
| `senior-uk` | /ˈsiːnjə/ | /ˈsiːniə/ |
| `substantiate-us` | /səbˈstæntʃieɪt/ | /səbˈstænʃieɪt/ |
| `taboo-us` | /tæˈbuː/ | /təˈbuː/ |
| `time-consuming-uk` | /taɪm kənˈsjuːmɪŋ/ | /ˈtaɪm kənsjuːmɪŋ/ |
| `time-consuming-us` | /taɪm kənˈsuːmɪŋ/ | /ˈtaɪm kənsuːmɪŋ/ |
| `troposphere-us` | /ˈtroʊpəsfɪr/ | /ˈtrɑːpəsfɪr/ |
| `tutorial-us` | /tuˈtɔːriəl/ | /tuːˈtɔːriəl/ |
| `volume-us` | /ˈvɑːljum/ | /ˈvɑːljuːm/ |

### 前两轮修改复核后改正(2 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `altruism-uk` | /ˈæltruːɪzəm/ | /ˈæltruɪzəm/ |
| `luxurious-us` | /ləɡˈʒʊriəs/ | /lʌɡˈʒʊriəs/ |

### 统一为参考词典首选读音(73 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `accelerate-us` | /əkˈseləreɪt/ | /ekˈseləreɪt/ |
| `algae-uk` | /ˈælɡiː/ | /ˈældʒiː/ |
| `altitude-us` | /ˈæltətud/ | /ˈæltətuːd/ |
| `amplitude-us` | /ˈæmplətud/ | /ˈæmplətuːd/ |
| `aptitude-us` | /ˈæptətud/ | /ˈæptətuːd/ |
| `assure-uk` | /əˈʃɔː/ | /əˈʃʊə/ |
| `authentic-us` | /ɔːˈθentɪk/ | /ɑːˈθentɪk/ |
| `authenticity-us` | /ˌɔːθenˈtɪsɪti/ | /ˌɑːθenˈtɪsəti/ |
| `automobile-us` | /ˈɔːtəmoʊbiːl/ | /ˈɑːtəmoʊbiːl/ |
| `autonomy-us` | /ɔːˈtɑːnəmi/ | /ɑːˈtɑːnəmi/ |
| `be-subject-to-uk` | /bi ˈsʌbdʒekt tə/ | /bi ˈsʌbdʒɪkt tə/ |
| `buddhism-us` | /ˈbuːdɪzəm/ | /ˈbʊdɪzəm/ |
| `cholesterol-us` | /kəˈlestərɔːl/ | /kəˈlestərɑːl/ |
| `congruent-us` | /ˈkɑːŋɡruənt/ | /kəŋˈɡruənt/ |
| `connectivity-uk` | /ˌkɒnekˈtɪvɪti/ | /kəˌnekˈtɪvɪti/ |
| `contribute-to-uk` | /ˈkɒntrɪbjuːt tə/ | /kənˈtrɪbjuːt tə/ |
| `contribute-to-us` | /kənˈtrɪbjut tə/ | /kənˈtrɪbjuːt tə/ |
| `directory-us` | /daɪˈrektəri/ | /dɪˈrektəri/ |
| `dissect-uk` | /daɪˈsekt/ | /dɪˈsekt/ |
| `duration-us` | /dʊˈreɪʃən/ | /duːˈreɪʃən/ |
| `eco-friendly-us` | /ˌiːkoʊ ˈfrendli/ | /ˈiːkoʊ ˌfrendli/ |
| `economic-us` | /ˌekəˈnɑːmɪk/ | /ˌiːkəˈnɑːmɪk/ |
| `economical-us` | /ˌekəˈnɑːmɪkəl/ | /ˌiːkəˈnɑːmɪkəl/ |
| `elite-us` | /eɪˈliːt/ | /iˈliːt/ |
| `elsewhere-us` | /ˌelsˈwer/ | /ˈelswer/ |
| `ensure-uk` | /ɪnˈʃɔː/ | /ɪnˈʃʊə/ |
| `exit-uk` | /ˈeɡzɪt/ | /ˈeksɪt/ |
| `exponential-us` | /ˌekspəˈnenʃəl/ | /ˌekspoʊˈnenʃəl/ |
| `garage-uk` | /ˈɡærɪdʒ/ | /ˈɡærɑːʒ/ |
| `gourmet-us` | /ɡʊrˈmeɪ/ | /ˈɡʊrmeɪ/ |
| `granary-us` | /ˈɡreɪnəri/ | /ˈɡrænəri/ |
| `gratitude-us` | /ˈɡrætətud/ | /ˈɡrætətuːd/ |
| `greasy-uk` | /ˈɡriːzi/ | /ˈɡriːsi/ |
| `guided-tour-uk` | /ˈɡaɪdɪd tɔː/ | /ˈɡaɪdɪd tʊə/ |
| `indirect-uk` | /ˌɪndaɪˈrekt/ | /ˌɪndəˈrekt/ |
| `inherent-us` | /ɪnˈherənt/ | /ɪnˈhɪrənt/ |
| `institute-us` | /ˈɪnstətut/ | /ˈɪnstətuːt/ |
| `intuition-us` | /ˌɪntuˈɪʃən/ | /ˌɪntuːˈɪʃən/ |
| `latitude-us` | /ˈlætətud/ | /ˈlætətuːd/ |
| `letter-of-recommendation-us` | /ˈletɚ əv ˌrekəmənˈdeɪʃən/ | /ˈletɚ əv ˌrekəmenˈdeɪʃən/ |
| `lifelong-learning-us` | /ˈlaɪflɔːŋ ˈlɝːnɪŋ/ | /ˈlaɪflɑːŋ ˈlɝːnɪŋ/ |
| `magnitude-us` | /ˈmæɡnətud/ | /ˈmæɡnətuːd/ |
| `metaphor-uk` | /ˈmetəfɔː/ | /ˈmetəfə/ |
| `monarch-us` | /ˈmɑːnɑːrk/ | /ˈmɑːnɚk/ |
| `monarchy-us` | /ˈmɑːnɑːrki/ | /ˈmɑːnɚki/ |
| `nutrition-us` | /nuˈtrɪʃən/ | /nuːˈtrɪʃən/ |
| `outgoing-us` | /ˌaʊtˈɡoʊɪŋ/ | /ˈaʊtɡoʊɪŋ/ |
| `package-tour-uk` | /ˈpækɪdʒ tɔː/ | /ˈpækɪdʒ tʊə/ |
| `paparazzi-us` | /ˌpɑːpəˈrɑːtsi/ | /ˌpɑːpɑːˈrɑːtsi/ |
| `partisan-uk` | /ˌpɑːtɪˈzæn/ | /ˈpɑːtɪzæn/ |
| `pseudoscience-uk` | /ˈsjuːdəʊsaɪəns/ | /ˈsuːdəʊsaɪəns/ |
| `realism-us` | /ˈriəlɪzəm/ | /ˈriːəlɪzəm/ |
| `rebellious-uk` | /rɪˈbeliəs/ | /rɪˈbeljəs/ |
| `recommendation-us` | /ˌrekəmənˈdeɪʃən/ | /ˌrekəmenˈdeɪʃən/ |
| `refugee-us` | /ˌrefjuˈdʒiː/ | /ˌrefjʊˈdʒiː/ |
| `residue-us` | /ˈrezədu/ | /ˈrezəduː/ |
| `revenue-us` | /ˈrevənu/ | /ˈrevənuː/ |
| `saturn-uk` | /ˈsætən/ | /ˈsætɜːn/ |
| `schedule-us` | /ˈskedʒul/ | /ˈskedʒuːl/ |
| `semiconductor-us` | /ˈsemikəndʌktɚ/ | /ˌsemikənˈdʌktɚ/ |
| `stance-uk` | /stɑːns/ | /stæns/ |
| `stratum-us` | /ˈstrætəm/ | /ˈstreɪtəm/ |
| `supreme-uk` | /suːˈpriːm/ | /suˈpriːm/ |
| `temperamental-us` | /ˌtemprəˈmentəl/ | /ˌtempɚəˈmentəl/ |
| `torrential-us` | /təˈrenʃəl/ | /tɔːˈrenʃəl/ |
| `transit-uk` | /ˈtrænsɪt/ | /ˈtrænzɪt/ |
| `transmit-us` | /trænzˈmɪt/ | /trænsˈmɪt/ |
| `unique-uk` | /juːˈniːk/ | /juˈniːk/ |
| `vacuum-cleaner-us` | /ˈvækjum ˈkliːnɚ/ | /ˈvækjuːm ˈkliːnɚ/ |
| `wind-turbine-us` | /ˈwɪnd tɝːbaɪn/ | /ˈwɪnd tɝːbɪn/ |
| `withhold-us` | /wɪθˈhoʊld/ | /wɪðˈhoʊld/ |
| `withstand-us` | /wɪθˈstænd/ | /wɪðˈstænd/ |
| `zoology-uk` | /zuːˈɒlədʒi/ | /zuˈɒlədʒi/ |

### 随拼写修改(2 处)

| 读音 | 原音标 | 新音标 |
|---|---|---|
| `life-span-uk` | /laɪf spæn/ | /ˈlaɪfspæn/ |
| `life-span-us` | /laɪf spæn/ | /ˈlaɪfspæn/ |
