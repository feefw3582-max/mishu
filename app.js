const STORAGE_KEYS = {
  tasks: "raymond-plan-task-state",
  review: "raymond-plan-review-state",
  dailyKpis: "raymond-plan-daily-kpi-state",
  weeklyKpis: "raymond-plan-weekly-kpi-state",
};

const priorityMeta = {
  p0: {
    label: "P0",
    title: "不能出问题",
    principle: "健康、实习、学校安全线优先，先守底线再追进度。",
  },
  p1: {
    label: "P1",
    title: "今天核心推进",
    principle: "只做对 5月MVP、求职复盘、英语词汇最有杠杆的动作。",
  },
  p2: {
    label: "P2",
    title: "持续积累",
    principle: "337、行业阅读、作品集表达和手绘不断线。",
  },
  p3: {
    label: "P3",
    title: "限时低频",
    principle: "投递、刷岗位、改简历必须限时，不能替代真正产出。",
  },
};

const monthStrategy = {
  5: {
    stage: "5月冲刺期",
    p1: "Agent项目、求职复盘、英语词汇",
    p2: "337理论课、行业阅读、马克笔",
    p3: "投递简历、刷岗位、改简历，投递日30分钟封顶",
  },
  6: {
    stage: "6月交付期",
    p1: "337一轮结束、英语真题、求职面试",
    p2: "Agent维护、作品集优化、手绘",
    p3: "原则上不新增Agent功能",
  },
  late: {
    stage: "7-12月考研主线期",
    p1: "英语真题、337背诵、手绘强化、关键面试",
    p2: "作品集维护、求职不断线、阶段复盘",
    p3: "低价值信息流和临时换方向",
  },
};

const schedule = [
  {
    start: "00:00",
    end: "00:20",
    title: "睡前收尾",
    description: "关闭学习状态，只做复盘、明日计划和放松，不再启动复杂任务。",
    command: "立刻停重任务，用20分钟完成复盘并准备睡觉。",
    p0: ["停止复杂开发、深度Debug、刷岗位、改简历", "把睡眠放到第一优先级，00:30必须睡觉"],
    p1: ["写完今天完成/未完成", "确认明天最重要的一件事"],
    p2: ["只允许轻复盘：英语错词或337概念快速过一遍"],
    p3: ["不要临时推翻计划", "不要继续刷岗位制造焦虑"],
    output: "复盘记录 + 明日最重要1件事",
  },
  {
    start: "00:20",
    end: "00:30",
    title: "放松入睡",
    description: "进入睡眠准备，任何产出型任务都要停止。",
    command: "离开屏幕，准备睡觉；今天到此结束。",
    p0: ["放下设备，确保00:30入睡", "不做任何会让大脑兴奋的任务"],
    p1: ["没有P1，睡眠就是当前主线"],
    p2: ["可做1分钟呼吸放松"],
    p3: ["不补进度，不开新任务"],
    output: "准时入睡",
  },
  {
    start: "00:30",
    end: "07:30",
    title: "固定睡眠",
    description: "7小时睡眠硬约束。此时任何学习和开发都属于破坏P0。",
    command: "现在应该睡觉，不要用努力感破坏第二天效率。",
    p0: ["睡眠优先，保证7小时", "如果醒了也不要打开招聘和项目代码"],
    p1: ["无"],
    p2: ["无"],
    p3: ["所有任务延后到07:30之后"],
    output: "恢复体力和认知状态",
  },
  {
    start: "07:30",
    end: "08:00",
    title: "起床准备",
    description: "洗漱、早餐、出门。不刷短视频，不刷招聘，不临时改计划。",
    command: "只完成出门动作，准时进入早通勤英语主战场。",
    p0: ["准时起床、洗漱、早餐、出门", "不刷短视频，不刷招聘"],
    p1: ["确认今天第一块英语学习会在08:00开始"],
    p2: ["快速看一眼今天是否有学校或实习硬DDL"],
    p3: ["不改简历，不临时重排全天计划"],
    output: "08:00准时出门或进入通勤学习",
  },
  {
    start: "08:00",
    end: "08:30",
    title: "早通勤：英语新词1",
    description: "英语是5月底5000词首轮的刚性目标，早通勤先吃掉新词。",
    command: "背50个新词，别切去招聘或短视频。",
    p0: ["保持通勤安全，不熬夜后硬撑高强度输入"],
    p1: ["英语新词50个", "看到能识别主要含义"],
    p2: ["记录3个高频错词，晚间回看"],
    p3: ["不刷岗位，不改简历"],
    output: "新词50个",
  },
  {
    start: "08:30",
    end: "09:00",
    title: "早通勤：英语新词2",
    description: "继续新词，保证早通勤完成100个新词。",
    command: "继续背50个新词，完成早通勤新词KPI。",
    p0: ["保持通勤节奏和安全"],
    p1: ["再完成英语新词50个", "合计新词100个"],
    p2: ["把不熟的词标记到错词列表"],
    p3: ["不临时切换到行业长文"],
    output: "累计新词100个",
  },
  {
    start: "09:00",
    end: "09:30",
    title: "早通勤：英语复习",
    description: "用复习巩固正确率，目标是掌握而不是只刷数量。",
    command: "复习100-150个词，优先错词和低熟词。",
    p0: ["保持通勤安全，不做需要大量输入的事"],
    p1: ["英语复习100-150个", "正确率向80%以上逼近"],
    p2: ["标记今日仍不稳的词"],
    p3: ["不刷社交媒体和岗位"],
    output: "复习100-150个",
  },
  {
    start: "09:30",
    end: "10:00",
    title: "行业阅读",
    description: "轻量输入产品、AI、互联网洞察，不做无限查资料。",
    command: "读一个案例或一篇行业内容，写下1条可用于面试的洞察。",
    p0: ["准备进入上班状态，避免迟到或分心"],
    p1: ["收束早通勤英语成果"],
    p2: ["记录1条产品/AI/互联网洞察"],
    p3: ["不打开无目标信息流"],
    output: "行业洞察1条",
  },
  {
    start: "10:00",
    end: "10:30",
    title: "上班启动",
    description: "实习优先，明确当天工作事项，不把个人项目和公司项目混在一起。",
    command: "先处理实习基本事务，明确今天公司任务。",
    p0: ["查看实习任务、回复必要消息", "不使用公司敏感资料，不混用个人项目和公司项目"],
    p1: ["把个人Agent开发目标压成今天一个小节点"],
    p2: ["检查是否有学校DDL提醒"],
    p3: ["不一上班就刷岗位"],
    output: "当天工作事项清楚",
  },
  {
    start: "10:30",
    end: "12:00",
    title: "Agent开发块1",
    description: "写核心功能、调接口、修小Bug、做小范围测试。目标是可运行或问题明确。",
    command: "把一个Agent小模块推进到可运行、可测试或问题明确。",
    p0: ["不影响本职实习，不触碰公司敏感资料"],
    p1: ["明确当天开发节点", "完成一个小模块", "本地运行或小范围测试"],
    p2: ["记录关键Prompt、接口、问题定位"],
    p3: ["不做大规模重构，不无限查资料"],
    output: "一个Agent小模块可运行/可测试/问题明确",
  },
  {
    start: "12:00",
    end: "13:00",
    title: "午间轻任务",
    description: "先恢复状态，再做轻阅读或产品案例，不用午休硬扛高强度开发。",
    command: "吃饭休息优先；状态允许就记录1条产品洞察。",
    p0: ["午饭、休息、恢复状态"],
    p1: ["不抢占下午核心任务的精力"],
    p2: ["行业阅读或产品案例1条"],
    p3: ["不刷岗位超过计划范围"],
    output: "恢复状态 + 产品洞察1条",
  },
  {
    start: "13:00",
    end: "14:00",
    title: "求职复盘固定块",
    description: "把求职变成可沉淀资产：面试卡片、项目表达、产品案例。",
    command: "做1张面试卡片，不要只焦虑投递。",
    p0: ["不影响实习基本事务"],
    p1: ["复盘1个PM面试题", "打磨1段项目表达", "新增1张面试卡片"],
    p2: ["整理1个产品案例或产品观点"],
    p3: ["投递不是当前主任务，除非今天明确是投递日"],
    output: "面试卡片1张 + 项目表达1段",
  },
  {
    start: "14:00",
    end: "15:30",
    title: "Agent开发块2",
    description: "延续上午功能，联调、Debug、写测试、保存版本。",
    command: "把上午功能收口，不能只写代码不运行。",
    p0: ["实习有急事则实习优先"],
    p1: ["继续上午功能开发", "联调/Debug", "写测试或整理代码", "至少保存一次版本"],
    p2: ["把可复用内容写成README或项目日志素材"],
    p3: ["不新开大功能，不临时换技术栈"],
    output: "功能进入可测试状态或问题定位清楚",
  },
  {
    start: "15:30",
    end: "16:30",
    title: "337理论课",
    description: "5月不断线，6月主线推进。一段学习必须能复述。",
    command: "看一段337网课，整理3个核心概念和1个可能考题。",
    p0: ["不挤掉实习硬任务"],
    p1: ["6月时337是P1，要优先保证一轮结束"],
    p2: ["5月完成337 1小时：视频片段 + 笔记复盘"],
    p3: ["不只看视频不写输出"],
    output: "3个核心概念 + 1个可能考题",
  },
  {
    start: "16:30",
    end: "17:30",
    title: "Agent文档 / 作品集轻任务",
    description: "把工程成果翻译成能展示、能面试、能写进简历的表达。",
    command: "沉淀一段README、Demo脚本或简历项目描述。",
    p0: ["不影响当天实习收尾"],
    p1: ["为三个Agent补齐README、Demo说明、讲解稿"],
    p2: ["产出1段作品集文案或项目表达"],
    p3: ["不陷入字体、配色等非关键打磨"],
    output: "可沉淀内容1段 + 项目表达1段",
  },
  {
    start: "17:30",
    end: "19:30",
    title: "工作收尾 + 学校安全线",
    description: "完成实习必须事务，检查学校课程、作业、DDL、考试和小组任务。",
    command: "先清实习和学校风险，再决定晚间任务。",
    p0: ["完成实习当天必须事务", "检查学校作业、DDL、课程汇报、考试、小组任务、挂科风险"],
    p1: ["明确晚间Agent整合或英语/337补短板"],
    p2: ["整理白天遗留问题，晚上只处理明显Bug"],
    p3: ["不把投递和改简历扩张成一整晚"],
    output: "工作不拖 + 学校无遗漏 + 晚间任务清楚",
  },
  {
    start: "19:30",
    end: "20:15",
    title: "晚通勤：英语复习",
    description: "晚通勤主打复习，补足当天词汇正确率。",
    command: "复习约200个词，别在通勤里刷岗位。",
    p0: ["保持通勤安全，避免疲劳刷屏"],
    p1: ["英语复习200个左右"],
    p2: ["补早上错词和低熟词"],
    p3: ["不刷岗位、不改简历、不刷短视频"],
    output: "复习约200个词",
  },
  {
    start: "20:15",
    end: "20:45",
    title: "面试表达口头回顾",
    description: "把项目说清楚，比继续盲投更有价值。",
    command: "口头复述1个项目问题，控制在3分钟内。",
    p0: ["不影响通勤安全"],
    p1: ["复述1个项目问题：用户、痛点、场景、功能、技术、价值"],
    p2: ["记录表达卡顿点"],
    p3: ["不打开新岗位列表"],
    output: "1个项目问题可口头表达",
  },
  {
    start: "20:45",
    end: "21:00",
    title: "晚间任务确认",
    description: "回家后只执行，不临时推翻计划。",
    command: "确认21:30后要跑哪个Demo或补哪个短板。",
    p0: ["不把疲惫状态误判成需要大改计划"],
    p1: ["明确回家后第一件任务"],
    p2: ["把问题压缩成可在30-60分钟解决的小动作"],
    p3: ["不新增大功能"],
    output: "晚间第一任务明确",
  },
  {
    start: "21:00",
    end: "21:30",
    title: "回家缓冲",
    description: "吃饭、洗澡、休息，先恢复状态再进入晚间核心时间。",
    command: "先恢复，不要一回家就开复杂Debug。",
    p0: ["吃饭、洗澡、休息"],
    p1: ["为21:30整合测试保存精力"],
    p2: ["如果非常疲惫，降低晚间任务强度"],
    p3: ["不躺着刷短视频拖到深夜"],
    output: "恢复状态",
  },
  {
    start: "21:30",
    end: "22:30",
    title: "Agent整合/测试",
    description: "晚上只跑Demo、修明显Bug、提交版本、写日志，不新开大功能。",
    command: "跑白天开发结果，明确能否可运行。",
    p0: ["避免深夜复杂开发，不牺牲00:30睡眠"],
    p1: ["跑Demo", "修明显Bug", "保存版本", "写项目日志或README一小段"],
    p2: ["把问题整理成明天白天可解决的清单"],
    p3: ["不大规模重构，不临时换技术栈"],
    output: "可运行状态确认 + 版本保存 + 项目日志",
  },
  {
    start: "22:30",
    end: "23:20",
    title: "英语/337补充",
    description: "按短板选择：英语未达标优先英语，英语达标则337，疲惫则轻复盘。",
    command: "补当天最短板，不开新战线。",
    p0: ["不做会拖到00:00后的重任务"],
    p1: ["英语错词或337复盘二选一"],
    p2: ["长难句或337概念轻复盘"],
    p3: ["不新增Agent功能，不继续深Debug"],
    output: "当天短板被补一轮",
  },
  {
    start: "23:20",
    end: "00:00",
    title: "当日复盘 + 明日计划",
    description: "记录完成情况、未完成项、明天最重要的一件事，23:50开始关闭学习状态。",
    command: "写复盘，23:50后停止重任务。",
    p0: ["确保00:00后不做复杂开发", "把睡眠节奏守住"],
    p1: ["记录Agent、求职、英语、337、工作/学校、健康完成情况"],
    p2: ["确认明天最重要的一件事"],
    p3: ["不因没完成而补偿性熬夜"],
    output: "复盘完成 + 明日计划明确",
  },
];

const milestones = [
  {
    id: "may10",
    title: "5月10日前",
    deadline: "2026-05-10",
    summary: "3个Agent可运行MVP",
    items: [
      ["music-mvp", "音乐生成Agent完成MVP", "可输入主题/情绪/风格/BPM/长度并生成结构化Demo"],
      ["stress-mvp", "压力疏导Agent完成MVP", "三轮以上对话并生成今天的压力应对计划"],
      ["focus-mvp", "专注力Agent完成MVP", "计时器、冲动记录、10秒延迟和复盘闭环可运行"],
      ["readme-draft", "每个Agent都有README初稿", "定位、功能、运行方式写清楚"],
      ["demo-basic", "每个Agent都有基础Demo", "本地可运行或有清晰录屏路径"],
      ["story-clear", "每个Agent能讲清楚", "用户、痛点、场景、功能、技术、价值"],
    ],
  },
  {
    id: "may31",
    title: "5月31日前",
    deadline: "2026-05-31",
    summary: "实习强推进 + 英语5000词首轮",
    items: [
      ["pm-push", "大厂PM实习强推进", "面试/内推/高质量投递持续发生"],
      ["words-5000", "英语考研词汇5000个全部过完", "完成首轮覆盖"],
      ["words-3300", "至少掌握3300个词", "看到能识别主要含义，正确率>=80%"],
      ["portfolio-v1", "三个Agent有作品集初版", "能展示问题、流程、结果和价值"],
      ["resume-agent", "三个Agent有简历项目描述", "每个项目一段可投递表达"],
      ["interview-35", "面试卡片不少于35张", "覆盖项目、产品、行业、行为题"],
      ["theory-70", "337理论课完成约70%", "笔记不断线"],
      ["marker-weekly", "马克笔每周至少1次", "不断线即可，不追求一次过量"],
    ],
  },
  {
    id: "june07",
    title: "6月7日前",
    deadline: "2026-06-07",
    summary: "3个Agent工程展示级",
    items: [
      ["agent-engineering", "三个Agent达到工程展示级别", "功能闭环、异常处理和基础UI稳定"],
      ["agent-demo-record", "三个Agent有可运行Demo或录屏Demo", "面试时可直接展示"],
      ["agent-readme-full", "三个Agent有完整README", "部署、功能、限制、迭代方向清晰"],
      ["agent-portfolio-pages", "三个Agent有作品集页面", "作品集能独立讲项目"],
      ["script-3min", "三个Agent有3分钟讲解稿", "高密度讲清楚用户价值"],
      ["script-15min", "三个Agent有15分钟深挖稿", "能回答技术、产品和取舍"],
      ["resume-final", "简历中加入三个Agent项目", "面向PM实习岗位改写"],
    ],
  },
  {
    id: "june30",
    title: "6月30日前",
    deadline: "2026-06-30",
    summary: "337一轮结束 + 英语真题阶段",
    items: [
      ["theory-one-round", "337理论课一轮结束", "完成课程和核心框架"],
      ["theory-notes", "337一轮笔记完成", "形成可复习材料"],
      ["english-papers", "英语开始真题阶段", "从背词切到真题和模块训练"],
      ["paper-6-8", "6月完成6-8套真题或等量模块训练", "以复盘质量为准"],
      ["sketch-2", "手绘提高到每周2次", "形成稳定节奏"],
      ["interview-rhythm", "求职进入稳定面试节奏", "不断线但不过度消耗"],
    ],
  },
  {
    id: "lateYear",
    title: "7月-12月",
    deadline: "2026-12-31",
    summary: "考研主线 + 求职不断线",
    items: [
      ["july-english", "7月英语15套真题第一轮完成", "337进入二轮"],
      ["august-second", "8月英语二刷，337背诵，手绘强化", "建立背诵和输出节奏"],
      ["september-main", "9月考研成为主线", "求职降频但不断线"],
      ["october-offer", "10月拿到知名互联网PM机会", "机会落地或进入强推进"],
      ["november-sprint", "11月考研冲刺", "真题、背诵、手绘整合"],
      ["december-exam", "12月稳定上考场", "英语一80、337理论125、手绘130为目标"],
    ],
  },
];

const agents = [
  {
    id: "music",
    name: "流行音乐生成Agent",
    positioning: "帮助内容创作者、短视频创作者、音乐爱好者快速生成流行音乐Demo。",
    sections: [
      {
        title: "MVP功能",
        items: [
          "用户输入主题、情绪、风格、BPM、歌曲长度",
          "生成歌词",
          "生成Verse / Chorus / Bridge结构",
          "生成和弦走向",
          "生成旋律描述或MIDI结构",
          "支持流行、R&B、电子、民谣风格控制",
          "页面可播放Demo音频或模拟音频",
          "支持重新生成",
          "README初版",
        ],
      },
      {
        title: "作品集表达",
        items: [
          "强调把音乐创作拆成可控模块",
          "突出用户能控制生成方向，而不是被动等待随机输出",
        ],
      },
    ],
  },
  {
    id: "stress",
    name: "压力疏导Agent",
    positioning: "帮助压力较大的人通过对话识别压力来源，并找到低门槛、可执行的放松方式。",
    sections: [
      {
        title: "MVP功能",
        items: [
          "用户输入压力/情绪",
          "识别学习、工作、人际、未来不确定性、身体疲劳等压力来源",
          "判断轻度压力、中度压力、高压状态",
          "推荐呼吸练习、身体放松、写作倾倒、认知重构、短休息计划",
          "三轮以上对话流程",
          "生成今天的压力应对计划",
          "安全边界提示：不做医学诊断，不替代心理咨询",
          "README初版",
        ],
      },
      {
        title: "作品集表达",
        items: [
          "强调不是简单安慰，而是把压力应对流程产品化",
          "突出识别来源、判断状态、匹配策略、输出计划",
        ],
      },
    ],
  },
  {
    id: "focus",
    name: "专注力恢复与反短视频Agent",
    positioning: "帮助用户减少刷短视频冲动，恢复专注力，形成专注行为反馈闭环。",
    sections: [
      {
        title: "MVP功能",
        items: [
          "专注计时器",
          "用户设置任务目标",
          "分心冲动记录",
          "刷短视频冲动干预",
          "微任务拆解",
          "10秒延迟机制",
          "专注结束复盘",
          "今日专注报告",
          "README初版",
        ],
      },
      {
        title: "作品集表达",
        items: [
          "强调不是普通番茄钟，而是行为干预型Agent",
          "突出从想专注到真的开始专注之间的断点",
          "突出分心冲动即时干预和复盘反馈闭环",
        ],
      },
    ],
  },
];

const timelineItems = [
  ["07:30-08:00", "起床准备", "洗漱、早餐、出门", ["P0", "不刷短视频"]],
  ["08:00-10:00", "早通勤", "英语词汇、行业阅读、轻复盘", ["P1", "新词100个"]],
  ["10:00-19:30", "上班", "实习优先；空闲时做Agent开发、求职复盘、337", ["P0/P1", "不混用资料"]],
  ["19:30-21:00", "晚通勤", "英语复习、面试表达回顾", ["P1", "不刷岗位"]],
  ["21:00-21:30", "回家缓冲", "吃饭、洗澡、休息", ["P0", "恢复状态"]],
  ["21:30-00:00", "晚间核心时间", "5月Agent整合测试；6月337+英语", ["P1/P2", "不新开大功能"]],
  ["00:00-00:30", "睡前收尾", "复盘、明日计划、放松入睡", ["P0", "00:30睡觉"]],
];

const dailyKpis = [
  {
    priority: "p0",
    title: "P0 底线",
    summary: "健康、实习、学校安全线不能出问题。",
    items: [
      {
        id: "sleep",
        title: "睡眠硬约束",
        target: "00:30-07:30睡满7小时；00:00后不复杂开发、不深度Debug。",
        window: "00:00-07:30",
      },
      {
        id: "internship",
        title: "实习基本事务",
        target: "必要消息回复、当天必须事务完成，不影响本职工作。",
        window: "10:00-19:30",
      },
      {
        id: "school-safety",
        title: "学校安全检查",
        target: "检查作业、DDL、课程汇报、考试、小组任务和挂科风险。",
        window: "18:30-19:00",
      },
    ],
  },
  {
    priority: "p1",
    title: "P1 今日核心",
    summary: "直接服务5月MVP、求职、英语的硬产出。",
    items: [
      {
        id: "english-vocab",
        title: "英语词汇",
        target: "新词100个；复习300-350个；错词做标记。",
        window: "08:00-10:00 + 19:30-20:15",
      },
      {
        id: "agent-dev",
        title: "Agent开发",
        target: "5月3-4小时；一个模块进入可运行、可测试或问题明确。",
        window: "10:30-12:00 + 14:00-15:30 + 21:30-22:30",
      },
      {
        id: "job-review",
        title: "求职复盘",
        target: "新增1张面试卡片；优化1段项目表达；记录1个产品案例。",
        window: "13:00-14:00",
      },
    ],
  },
  {
    priority: "p2",
    title: "P2 持续积累",
    summary: "不抢主线，但每天都要有沉淀。",
    items: [
      {
        id: "theory-337",
        title: "337理论课",
        target: "5月1小时；输出3个核心概念和1个可能考题。",
        window: "15:30-16:30 / 22:30-23:20",
      },
      {
        id: "industry-reading",
        title: "行业阅读",
        target: "记录1条产品、AI或互联网洞察。",
        window: "09:30-10:00 / 12:30-13:00",
      },
      {
        id: "portfolio-doc",
        title: "项目文档/作品集",
        target: "沉淀1段README、Demo脚本、简历描述或作品集文案。",
        window: "16:30-17:30",
      },
    ],
  },
  {
    priority: "p3",
    title: "P3 限时低频",
    summary: "防止焦虑型动作挤掉真正产出。",
    items: [
      {
        id: "applications",
        title: "投递/刷岗位/改简历",
        target: "只在投递日执行，30分钟封顶。",
        window: "午间/上班碎片",
      },
      {
        id: "anti-friction",
        title: "防内耗检查",
        target: "不刷短视频；不无限查资料；不临时推翻计划。",
        window: "全天",
      },
    ],
  },
];

const weeklyKpis = [
  {
    priority: "p0",
    title: "P0 周底线",
    summary: "一周内不能爆掉健康、实习、学校。",
    items: [
      {
        id: "weekly-sleep",
        title: "睡眠纪律",
        target: "本周至少6天00:30前入睡；无连续两天熬夜。",
      },
      {
        id: "weekly-school",
        title: "学校安全线",
        target: "本周作业、DDL、考试、小组任务全部检查并处理。",
      },
      {
        id: "weekly-internship",
        title: "实习事务",
        target: "本周实习基本事务无拖延、无遗漏、无敏感资料混用。",
      },
    ],
  },
  {
    priority: "p1",
    title: "P1 周主线",
    summary: "每周必须能看到Agent、英语、求职推进。",
    items: [
      {
        id: "weekly-agent",
        title: "Agent周交付",
        target: "至少完成1个可演示模块，或修到一个Demo可稳定跑。",
      },
      {
        id: "weekly-english",
        title: "英语周进度",
        target: "5月目标：新词500-700个；复习不低于1000个；错词回看。",
      },
      {
        id: "weekly-job",
        title: "求职周资产",
        target: "新增5张以上面试卡片；完成1轮项目表达打磨或模拟复述。",
      },
    ],
  },
  {
    priority: "p2",
    title: "P2 周积累",
    summary: "337、行业、作品集、手绘持续推进。",
    items: [
      {
        id: "weekly-337",
        title: "337理论周进度",
        target: "5月每周至少5小时；6月至少8-10小时；形成可复述笔记。",
      },
      {
        id: "weekly-portfolio",
        title: "作品集/README",
        target: "至少更新1页作品集或1份README关键段落。",
      },
      {
        id: "weekly-marker",
        title: "马克笔/手绘",
        target: "5月每周至少1次；6月提高到每周2次。",
      },
      {
        id: "weekly-industry",
        title: "行业洞察",
        target: "累计记录5条可用于面试的产品/AI/互联网洞察。",
      },
    ],
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getWeekRange(dateString) {
  const date = parseDate(dateString);
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: formatDate(monday),
    end: formatDate(sunday),
    label: `${String(monday.getMonth() + 1).padStart(2, "0")}/${String(monday.getDate()).padStart(
      2,
      "0"
    )}-${String(sunday.getMonth() + 1).padStart(2, "0")}/${String(sunday.getDate()).padStart(2, "0")}`,
  };
}

function getDefaultDate() {
  const now = new Date();
  const current = formatDate(now);
  if (current >= "2026-04-27" && current <= "2026-12-31") {
    return current;
  }
  return "2026-04-27";
}

function getStage(dateString) {
  const month = Number(dateString.slice(5, 7));
  if (month === 5) return monthStrategy[5];
  if (month === 6) return monthStrategy[6];
  if (month >= 7) return monthStrategy.late;
  return {
    stage: "启动准备期",
    p1: "确认5月计划入口和第一个Agent任务",
    p2: "整理工具链、英语词表和337课程入口",
    p3: "不要提前焦虑12月，只准备第一天动作",
  };
}

function findSlot(time) {
  const minutes = toMinutes(time);
  return schedule.find((slot) => {
    const start = toMinutes(slot.start);
    const end = toMinutes(slot.end);
    if (start < end) {
      return minutes >= start && minutes < end;
    }
    return minutes >= start || minutes < end;
  });
}

function buildPriority(slot, stage, dayType) {
  const isWeekend = dayType === "weekend";
  const fallback = isWeekend
    ? {
        p0: ["睡眠、课程/作业/DDL、身体状态检查", "保留恢复时间，不把周末排满"],
        p1: ["补本周最关键缺口：Agent、英语或337三选一", "完成一个可验收产出"],
        p2: ["整理作品集、面试卡片、行业阅读或手绘"],
        p3: ["投递和刷岗位限时30分钟，不能扩张"],
      }
    : null;

  const p0Tasks = isWeekend ? fallback.p0 : slot.p0;
  const p1Tasks = isWeekend
    ? fallback.p1
    : [...slot.p1, `阶段P1：${stage.p1}`];
  const p2Tasks = isWeekend
    ? fallback.p2
    : [...slot.p2, `阶段P2：${stage.p2}`];
  const p3Tasks = isWeekend
    ? fallback.p3
    : [...slot.p3, `阶段P3：${stage.p3}`];

  return [
    {
      key: "p0",
      title: priorityMeta.p0.title,
      goal: priorityMeta.p0.principle,
      tasks: p0Tasks,
      deadline: isWeekend ? "今天结束前，且不破坏睡眠" : slot.end,
    },
    {
      key: "p1",
      title: priorityMeta.p1.title,
      goal: isWeekend ? "补最大缺口，形成一个能看见的产出。" : slot.output,
      tasks: p1Tasks,
      deadline: isWeekend ? "本任务开始后90-120分钟内" : slot.end,
    },
    {
      key: "p2",
      title: priorityMeta.p2.title,
      goal: priorityMeta.p2.principle,
      tasks: p2Tasks,
      deadline: isWeekend ? "当天睡前复盘前" : slot.end,
    },
    {
      key: "p3",
      title: priorityMeta.p3.title,
      goal: priorityMeta.p3.principle,
      tasks: p3Tasks,
      deadline: isWeekend ? "单次不超过30分钟" : slot.end,
    },
  ];
}

function getSavedTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks)) || {};
  } catch {
    return {};
  }
}

function saveTasks(state) {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state));
}

function getTaskState(id) {
  return Boolean(getSavedTasks()[id]);
}

function setTaskState(id, done) {
  const state = getSavedTasks();
  state[id] = done;
  saveTasks(state);
  renderMetrics();
}

function getScopedState(storageKey, scopeKey) {
  try {
    const state = JSON.parse(localStorage.getItem(storageKey)) || {};
    return state[scopeKey] || {};
  } catch {
    return {};
  }
}

function setScopedState(storageKey, scopeKey, itemId, done) {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    state = {};
  }
  state[scopeKey] = state[scopeKey] || {};
  state[scopeKey][itemId] = done;
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function clearScopedState(storageKey, scopeKey) {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    state = {};
  }
  delete state[scopeKey];
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getAllTaskIds() {
  const milestoneIds = milestones.flatMap((group) => group.items.map(([id]) => `milestone:${id}`));
  const agentIds = agents.flatMap((agent) =>
    agent.sections.flatMap((section) =>
      section.items.map((item) => `agent:${agent.id}:${section.title}:${item}`)
    )
  );
  return [...milestoneIds, ...agentIds];
}

function renderDecision(event) {
  if (event) event.preventDefault();
  const date = $("#dateInput").value || getDefaultDate();
  const time = $("#timeInput").value;
  if (!time) return;

  const dayType = $("#dayType").value;
  const slot = findSlot(time);
  const stage = getStage(date);
  const isWeekend = dayType === "weekend";
  const activeSlot = isWeekend
    ? {
        ...slot,
        title: `周末策略：${slot.title}`,
        description: "周末不照搬工作日时间表，优先补最大缺口，同时保留恢复和睡眠。",
        command: "选择本周最大缺口，做一个可验收产出，不把休息日排成惩罚日。",
        output: "一个关键缺口被补上",
      }
    : slot;

  $("#slotTitle").textContent = activeSlot.title;
  $("#slotDescription").textContent = activeSlot.description;
  $("#slotWindow").textContent = `${activeSlot.start} - ${activeSlot.end}`;
  $("#stageBadge").textContent = stage.stage;
  $("#oneCommand").textContent = activeSlot.command;

  const cards = buildPriority(activeSlot, stage, dayType)
    .map(
      (item) => `
        <article class="priority-card ${item.key}" data-rank="${priorityMeta[item.key].label}">
          <h3>${item.title}</h3>
          <p>${item.goal}</p>
          <ul class="task-list">
            ${item.tasks.map((task) => `<li>${task}</li>`).join("")}
          </ul>
          <span class="deadline-chip">完成时间：${item.deadline}</span>
        </article>
      `
    )
    .join("");

  $("#priorityGrid").innerHTML = cards;
}

function renderMilestones() {
  $("#milestoneBoard").innerHTML = milestones
    .map(
      (group) => `
        <article class="kanban-column">
          <div class="column-head">
            <h3>${group.title}</h3>
            <p>${group.summary}</p>
            <span class="deadline-chip">Deadline ${group.deadline}</span>
          </div>
          ${group.items
            .map(([id, title, detail]) => {
              const taskId = `milestone:${id}`;
              const checked = getTaskState(taskId);
              return `
                <label class="task-card ${checked ? "done" : ""}">
                  <input type="checkbox" data-task-id="${taskId}" ${checked ? "checked" : ""} />
                  <span>
                    <strong>${title}</strong>
                    <small>${detail}</small>
                  </span>
                </label>
              `;
            })
            .join("")}
        </article>
      `
    )
    .join("");
}

function renderAgents() {
  $("#agentBoard").innerHTML = agents
    .map(
      (agent) => `
        <article class="agent-card">
          <div class="agent-head">
            <h3>${agent.name}</h3>
            <p>${agent.positioning}</p>
          </div>
          ${agent.sections
            .map(
              (section) => `
                <section class="agent-section">
                  <h4>${section.title}</h4>
                  <div class="agent-items">
                    ${section.items
                      .map((item) => {
                        const taskId = `agent:${agent.id}:${section.title}:${item}`;
                        const checked = getTaskState(taskId);
                        return `
                          <label class="agent-item ${checked ? "done" : ""}">
                            <input type="checkbox" data-task-id="${taskId}" ${checked ? "checked" : ""} />
                            <span>${item}</span>
                          </label>
                        `;
                      })
                      .join("")}
                  </div>
                </section>
              `
            )
            .join("")}
        </article>
      `
    )
    .join("");
}

function renderTimeline() {
  $("#timeline").innerHTML = timelineItems
    .map(
      ([time, title, detail, chips]) => `
        <article class="timeline-item">
          <span class="timeline-time">${time}</span>
          <div class="timeline-title">
            <strong>${title}</strong>
            <span>${detail}</span>
          </div>
          <ul class="timeline-detail">
            ${chips.map((chip) => `<li class="task-chip">${chip}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderMetrics() {
  const allIds = getAllTaskIds();
  const state = getSavedTasks();
  const done = allIds.filter((id) => state[id]).length;
  const total = allIds.length;
  const open = total - done;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const next = milestones.find((group) =>
    group.items.some(([id]) => !state[`milestone:${id}`])
  );

  $("#overallProgress").textContent = `${percent}%`;
  $("#doneCount").textContent = done;
  $("#openCount").textContent = open;
  $("#nextDeadline").textContent = next ? next.title : "全部完成";
}

function getKpiTotals(groups, state) {
  const items = groups.flatMap((group) =>
    group.items.map((item) => ({ ...item, priority: group.priority }))
  );
  const done = items.filter((item) => state[item.id]).length;
  const total = items.length;
  const open = total - done;
  const progress = total ? Math.round((done / total) * 100) : 0;
  return { items, done, open, total, progress };
}

function renderKpiGroups(groups, state, kind) {
  const renderItems = (items, group) => {
    if (!items.length) {
      return `<div class="kpi-empty">${group.priority.toUpperCase()} 当前没有${kind === "daily" ? "今日" : "本周"}未完成项。</div>`;
    }

    return items
      .map((item) => {
        const checked = Boolean(state[item.id]);
        const windowText = item.window ? `<span class="kpi-meta">时间窗：${item.window}</span>` : "";
        return `
          <label class="kpi-item ${checked ? "done" : ""}">
            <input type="checkbox" data-kpi-kind="${kind}" data-kpi-id="${item.id}" ${
              checked ? "checked" : ""
            } />
            <span>
              <strong>${item.title}</strong>
              <small>${item.target}</small>
              ${windowText}
            </span>
          </label>
        `;
      })
      .join("");
  };

  return groups
    .map((group) => {
      const openItems = group.items.filter((item) => !state[item.id]);
      const doneItems = group.items.filter((item) => state[item.id]);

      return `
        <article class="kpi-column">
          <div class="kpi-column-head ${group.priority}">
            <h3>${group.title}</h3>
            <p>${group.summary}</p>
          </div>
          <section class="kpi-section">
            <div class="kpi-section-title">
              <span>待完成</span>
              <span>${openItems.length}</span>
            </div>
            ${renderItems(openItems, group)}
          </section>
          <section class="kpi-section">
            <div class="kpi-section-title">
              <span>已完成</span>
              <span>${doneItems.length}</span>
            </div>
            ${doneItems.length ? renderItems(doneItems, group) : `<div class="kpi-empty">完成后会自动移到这里，方便复盘。</div>`}
          </section>
        </article>
      `;
    })
    .join("");
}

function renderDailyKpis() {
  const input = $("#dailyDateInput");
  if (!input) return;

  const date = input.value || getDefaultDate();
  input.value = date;

  const state = getScopedState(STORAGE_KEYS.dailyKpis, date);
  const totals = getKpiTotals(dailyKpis, state);
  const p0Open = totals.items.filter((item) => item.priority === "p0" && !state[item.id]).length;

  $("#dailyProgress").textContent = `${totals.progress}%`;
  $("#dailyDone").textContent = totals.done;
  $("#dailyOpen").textContent = totals.open;
  $("#dailyP0Open").textContent = p0Open;
  $("#dailyKpiBoard").innerHTML = renderKpiGroups(dailyKpis, state, "daily");
}

function renderWeeklyKpis() {
  const input = $("#weeklyDateInput");
  if (!input) return;

  const date = input.value || getDefaultDate();
  input.value = date;
  const range = getWeekRange(date);
  const state = getScopedState(STORAGE_KEYS.weeklyKpis, range.start);
  const totals = getKpiTotals(weeklyKpis, state);

  $("#weeklyProgress").textContent = `${totals.progress}%`;
  $("#weeklyDone").textContent = totals.done;
  $("#weeklyOpen").textContent = totals.open;
  $("#weeklyRange").textContent = range.label;
  $("#weeklyKpiBoard").innerHTML = renderKpiGroups(weeklyKpis, state, "weekly");
}

function bindKpiControls() {
  $("#dailyDateInput").addEventListener("change", renderDailyKpis);
  $("#weeklyDateInput").addEventListener("change", renderWeeklyKpis);

  $("#resetDailyButton").addEventListener("click", () => {
    const date = $("#dailyDateInput").value || getDefaultDate();
    clearScopedState(STORAGE_KEYS.dailyKpis, date);
    renderDailyKpis();
  });

  $("#resetWeeklyButton").addEventListener("click", () => {
    const date = $("#weeklyDateInput").value || getDefaultDate();
    clearScopedState(STORAGE_KEYS.weeklyKpis, getWeekRange(date).start);
    renderWeeklyKpis();
  });
}

function bindKpiEvents() {
  document.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-kpi-kind]");
    if (!checkbox) return;

    const kind = checkbox.dataset.kpiKind;
    const itemId = checkbox.dataset.kpiId;
    const storageKey = kind === "daily" ? STORAGE_KEYS.dailyKpis : STORAGE_KEYS.weeklyKpis;
    const scopeKey =
      kind === "daily"
        ? $("#dailyDateInput").value || getDefaultDate()
        : getWeekRange($("#weeklyDateInput").value || getDefaultDate()).start;

    setScopedState(storageKey, scopeKey, itemId, checkbox.checked);
    const item = checkbox.closest(".kpi-item");
    if (item) item.classList.toggle("done", checkbox.checked);

    if (kind === "daily") renderDailyKpis();
    if (kind === "weekly") renderWeeklyKpis();
  });
}

function bindTaskEvents() {
  document.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-task-id]");
    if (!checkbox) return;
    const taskId = checkbox.dataset.taskId;
    setTaskState(taskId, checkbox.checked);
    const card = checkbox.closest(".task-card, .agent-item");
    if (card) card.classList.toggle("done", checkbox.checked);
  });
}

function loadReview() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.review)) || {};
  } catch {
    return {};
  }
}

function saveReview() {
  const state = {
    doneReview: $("#doneReview").value,
    missedReview: $("#missedReview").value,
    tomorrowReview: $("#tomorrowReview").value,
    frictionReview: $("#frictionReview").value,
  };
  localStorage.setItem(STORAGE_KEYS.review, JSON.stringify(state));
}

function bindReview() {
  const state = loadReview();
  ["doneReview", "missedReview", "tomorrowReview", "frictionReview"].forEach((id) => {
    const element = $(`#${id}`);
    element.value = state[id] || "";
    element.addEventListener("input", saveReview);
  });
  $("#clearReviewButton").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.review);
    ["doneReview", "missedReview", "tomorrowReview", "frictionReview"].forEach((id) => {
      $(`#${id}`).value = "";
    });
  });
}

function fillNow() {
  const now = new Date();
  $("#dateInput").value = getDefaultDate();
  $("#timeInput").value = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
}

function bindControls() {
  $("#timeForm").addEventListener("submit", renderDecision);
  $("#useNowButton").addEventListener("click", () => {
    fillNow();
    renderDecision();
  });
  $("#resetProgressButton").addEventListener("click", () => {
    const confirmed = window.confirm("确认重置所有看板勾选状态？");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEYS.tasks);
    renderMilestones();
    renderAgents();
    renderMetrics();
  });
}

function setActivePage(page) {
  const target = $(`[data-page="${page}"]`) ? page : "home";
  const navTarget = ["agents", "rhythm", "reminders", "review"].includes(target)
    ? "more"
    : target;
  $$(".page-view").forEach((view) => {
    view.classList.toggle("active", view.dataset.page === target);
  });
  $$("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === navTarget);
  });
  document.body.dataset.page = target;
  window.scrollTo(0, 0);
}

function getPageFromHash() {
  return (window.location.hash || "#decision").replace("#", "") || "decision";
}

function bindPageNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-page-link]");
    if (!link) return;
    event.preventDefault();
    const page = link.dataset.pageLink;
    history.pushState(null, "", `#${page}`);
    setActivePage(page);
  });

  window.addEventListener("popstate", () => setActivePage(getPageFromHash()));
  window.addEventListener("hashchange", () => setActivePage(getPageFromHash()));
}

function init() {
  $("#dateInput").value = getDefaultDate();
  $("#dailyDateInput").value = getDefaultDate();
  $("#weeklyDateInput").value = getDefaultDate();
  renderMilestones();
  renderAgents();
  renderTimeline();
  renderDailyKpis();
  renderWeeklyKpis();
  renderMetrics();
  bindTaskEvents();
  bindKpiEvents();
  bindReview();
  bindKpiControls();
  bindControls();
  bindPageNavigation();
  fillNow();
  renderDecision();
  setActivePage(getPageFromHash());
}

init();

STORAGE_KEYS.reminders = "raymond-plan-reminders-enabled";

let reminderTimer = null;
let serviceWorkerRegistration = null;

function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function supportsNotifications() {
  return "Notification" in window && "serviceWorker" in navigator;
}

function getReminderElements() {
  return {
    pwaStatus: $("#pwaStatus"),
    reminderStatus: $("#reminderStatus"),
    nextReminderText: $("#nextReminderText"),
    enableButton: $("#enableReminderButton"),
    testButton: $("#testReminderButton"),
    disableButton: $("#disableReminderButton"),
  };
}

function updateReminderStatus(message) {
  const { reminderStatus, pwaStatus } = getReminderElements();
  if (reminderStatus) reminderStatus.textContent = message;

  if (!pwaStatus) return;
  if (!supportsNotifications()) {
    pwaStatus.textContent = "不支持通知";
  } else if (isStandaloneApp()) {
    pwaStatus.textContent = "已作为App打开";
  } else {
    pwaStatus.textContent = "建议先添加到主屏";
  }
}

function isReminderEnabled() {
  return localStorage.getItem(STORAGE_KEYS.reminders) === "true";
}

function setReminderEnabled(enabled) {
  localStorage.setItem(STORAGE_KEYS.reminders, String(enabled));
}

function getNextSlotStart(now = new Date()) {
  const todayStart = new Date(now);
  todayStart.setSeconds(0, 0);

  const candidates = schedule.map((slot) => {
    const [hours, minutes] = slot.start.split(":").map(Number);
    const date = new Date(todayStart);
    date.setHours(hours, minutes, 0, 0);
    if (date <= now) date.setDate(date.getDate() + 1);
    return { slot, date };
  });

  return candidates.sort((a, b) => a.date - b.date)[0];
}

function getReminderPayload(slot, date = new Date()) {
  const dateString = formatDate(date);
  const dayType = $("#dayType") ? $("#dayType").value : "weekday";
  const stage = getStage(dateString);
  const priorities = buildPriority(slot, stage, dayType);
  const p0 = priorities.find((item) => item.key === "p0");
  const p1 = priorities.find((item) => item.key === "p1");

  return {
    title: `Raymond，现在是${slot.title}`,
    body: `P0：${p0.tasks[0]}。P1：${p1.tasks[0]}。完成时间：${slot.end}。`,
    tag: `raymond-${slot.start}`,
  };
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  if (serviceWorkerRegistration) return serviceWorkerRegistration;

  serviceWorkerRegistration = await navigator.serviceWorker.register("./service-worker.js");
  await navigator.serviceWorker.ready;
  return serviceWorkerRegistration;
}

async function showReminder(payload) {
  if (!supportsNotifications() || Notification.permission !== "granted") {
    return false;
  }

  const registration = await registerServiceWorker();
  if (registration && "showNotification" in registration) {
    await registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag || "raymond-current-task",
      icon: "./icon.svg",
      badge: "./icon.svg",
      vibrate: [120, 80, 120],
      data: { url: "./#decision" },
    });
    return true;
  }

  new Notification(payload.title, {
    body: payload.body,
    icon: "./icon.svg",
    tag: payload.tag || "raymond-current-task",
  });
  return true;
}

function clearReminderTimer() {
  if (reminderTimer) {
    window.clearTimeout(reminderTimer);
    reminderTimer = null;
  }
}

function scheduleNextReminder() {
  clearReminderTimer();

  const { nextReminderText } = getReminderElements();
  if (!isReminderEnabled() || !supportsNotifications() || Notification.permission !== "granted") {
    if (nextReminderText) nextReminderText.textContent = "下一次提醒：未安排";
    return;
  }

  const next = getNextSlotStart();
  const delay = Math.max(1000, next.date.getTime() - Date.now());
  const nextText = `${String(next.date.getMonth() + 1).padStart(2, "0")}-${String(
    next.date.getDate()
  ).padStart(2, "0")} ${String(next.date.getHours()).padStart(2, "0")}:${String(
    next.date.getMinutes()
  ).padStart(2, "0")} / ${next.slot.title}`;

  if (nextReminderText) nextReminderText.textContent = `下一次提醒：${nextText}`;

  reminderTimer = window.setTimeout(async () => {
    await showReminder(getReminderPayload(next.slot, next.date));
    scheduleNextReminder();
  }, Math.min(delay, 2147483647));
}

async function enableReminders() {
  if (!supportsNotifications()) {
    updateReminderStatus("当前浏览器不支持网页通知。iPhone 需要 iOS 16.4+，并从主屏幕打开网页APP。");
    return;
  }

  await registerServiceWorker();

  const permission =
    Notification.permission === "default"
      ? await Notification.requestPermission()
      : Notification.permission;

  if (permission !== "granted") {
    setReminderEnabled(false);
    updateReminderStatus("通知未授权。请在 iPhone 设置里允许该网页APP通知后再试。");
    return;
  }

  setReminderEnabled(true);
  updateReminderStatus("已开启前端时间提醒。保持网页APP打开或后台短时间存活时，会按时间块提醒。");
  scheduleNextReminder();
}

async function testReminder() {
  if (!supportsNotifications()) {
    updateReminderStatus("当前浏览器不支持网页通知，无法测试。");
    return;
  }

  if (Notification.permission !== "granted") {
    await enableReminders();
  }

  if (Notification.permission !== "granted") return;

  const time = `${String(new Date().getHours()).padStart(2, "0")}:${String(
    new Date().getMinutes()
  ).padStart(2, "0")}`;
  const slot = findSlot(time);
  await showReminder(getReminderPayload(slot));
  updateReminderStatus("测试提醒已发送。如果没看到，请检查系统通知权限和专注模式。");
}

function disableReminders() {
  setReminderEnabled(false);
  clearReminderTimer();
  updateReminderStatus("已关闭前端时间提醒。浏览器通知权限不会被本页面撤销，可在系统设置中关闭。");
  const { nextReminderText } = getReminderElements();
  if (nextReminderText) nextReminderText.textContent = "下一次提醒：未安排";
}

async function initPwa() {
  const { enableButton, testButton, disableButton } = getReminderElements();

  if ("serviceWorker" in navigator) {
    try {
      await registerServiceWorker();
      updateReminderStatus(
        isReminderEnabled()
          ? "提醒已开启。正在根据当前时间安排下一次提醒。"
          : "PWA 已就绪。先添加到主屏幕，再开启提醒。"
      );
    } catch {
      updateReminderStatus("PWA 离线缓存注册失败，但网页主体仍可使用。");
    }
  } else {
    updateReminderStatus("当前浏览器不支持 Service Worker，不能作为完整 PWA 运行。");
  }

  if (enableButton) enableButton.addEventListener("click", enableReminders);
  if (testButton) testButton.addEventListener("click", testReminder);
  if (disableButton) disableButton.addEventListener("click", disableReminders);

  if (isReminderEnabled() && supportsNotifications() && Notification.permission === "granted") {
    scheduleNextReminder();
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) scheduleNextReminder();
  });
  window.addEventListener("pageshow", scheduleNextReminder);
}

initPwa();
