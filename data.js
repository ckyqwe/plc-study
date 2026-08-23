// PLC 学习工具站 · 知识点数据
// 字段说明：
//   id       唯一标识，如 "p1"
//   cat      分类：basics / ladder / io / lang（见下方 PLC_CATS）
//   title    卡片标题（一句话）
//   content  卡片正文（2~4 句，工业自动化通识，上线前按教材复核）
//   tag      分类标签文字，如 "什么是PLC"
//   keywords 用于搜索的额外关键词（逗号分隔，如 "可编程逻辑控制器,继电器"）
var PLC_CARDS = [
  // ===== basics：什么是 PLC（3 张） =====
  {
    id: "p1",
    cat: "basics",
    title: "可编程逻辑控制器",
    content: "PLC = Programmable Logic Controller，工业控制里的\"小电脑\"，专门扛粉尘、高温、震动，7×24 小时干活。",
    tag: "什么是PLC",
    keywords: "可编程逻辑控制器,Programmable Logic Controller,工业控制,小电脑"
  },
  {
    id: "p2",
    cat: "basics",
    title: "继电器柜的升级版",
    content: "老式控制用一堆继电器接线，改逻辑要改线；PLC 把逻辑写进程序，改逻辑=改程序，不用拆线。",
    tag: "什么是PLC",
    keywords: "继电器,接线,改程序,升级"
  },
  {
    id: "p3",
    cat: "basics",
    title: "扫一遍又一遍",
    content: "PLC 的工作循环 = 读输入 → 跑程序 → 写输出，每圈几毫秒，循环往复（扫描周期）。",
    tag: "什么是PLC",
    keywords: "扫描周期,工作循环,读输入,写输出"
  },

  // ===== ladder：梯形图（3 张） =====
  {
    id: "p4",
    cat: "ladder",
    title: "长得像电路图",
    content: "梯形图左右两条竖线像电源母线，中间横线像电路，左边条件（常开/常闭触点），右边结果（线圈）。",
    tag: "梯形图",
    keywords: "电路图,母线,触点,线圈"
  },
  {
    id: "p5",
    cat: "ladder",
    title: "常开常闭",
    content: "常开（NO）= 平时不通、按下才通；常闭（NC）= 平时通、按下断开——编程里的\"开关\"逻辑。",
    tag: "梯形图",
    keywords: "NO,NC,常开触点,常闭触点,开关"
  },
  {
    id: "p6",
    cat: "ladder",
    title: "线圈输出",
    content: "梯形图最右端的线圈 = 结果，通了就\"输出\"（点亮灯/启动电机）；一条梯级 = 一个\"如果条件成立就输出\"。",
    tag: "梯形图",
    keywords: "输出,线圈,梯级,点亮灯,启动电机"
  },

  // ===== io：输入输出（3 张） =====
  {
    id: "p7",
    cat: "io",
    title: "输入",
    content: "按钮、接近开关、传感器把信号送进 PLC（数字量输入 DI）；\"PLC 怎么知道外面发生了什么\"。",
    tag: "输入输出",
    keywords: "按钮,接近开关,传感器,数字量输入,DI"
  },
  {
    id: "p8",
    cat: "io",
    title: "输出",
    content: "PLC 控制灯、继电器、电机接触器（数字量输出 DO）；\"PLC 怎么动手干活\"。",
    tag: "输入输出",
    keywords: "灯,继电器,电机接触器,数字量输出,DO"
  },
  {
    id: "p9",
    cat: "io",
    title: "I/O 点数",
    content: "一台 PLC 能接多少输入/输出是固定点数（如 24 点），选型先数你要接几个按钮几个灯。",
    tag: "输入输出",
    keywords: "IO点数,选型,24点,输入输出点数"
  },

  // ===== lang：编程语言（3 张） =====
  {
    id: "p10",
    cat: "lang",
    title: "三种主流语言",
    content: "梯形图 LD（电工友好）、指令表 IL（像汇编，一行一条指令）、结构化文本 ST（像高级语言，适合复杂计算）。",
    tag: "编程语言",
    keywords: "LD,IL,ST,梯形图,指令表,结构化文本"
  },
  {
    id: "p11",
    cat: "lang",
    title: "IEC 61131-3 标准",
    content: "PLC 编程语言的国际标准，一共五种（LD/IL/ST/FBD/SFC），学 PLC 语言先认这个标准。",
    tag: "编程语言",
    keywords: "IEC61131-3,国际标准,LD,IL,ST,FBD,SFC"
  },
  {
    id: "p12",
    cat: "lang",
    title: "选哪种",
    content: "逻辑控制（启停/互锁）用梯形图；数据处理/数学运算用 ST；顺序流程用 SFC。",
    tag: "编程语言",
    keywords: "逻辑控制,启停,互锁,数据处理,数学运算,顺序流程,SFC"
  },

  // ===== 第二批（8/1 落地：内容来自工程师知识库教程，直接录入） =====
  // ===== basics：PLC 基础（新增 4 张） =====
  {
    id: "p13",
    cat: "basics",
    title: "PLC 基本组成",
    content: "CPU（执行程序/处理逻辑）、输入模块（接按钮传感器）、输出模块（驱动继电器电机）、电源模块（24VDC/220VAC）、编程器（写程序调试）。",
    tag: "什么是PLC",
    keywords: "CPU,输入模块,输出模块,电源模块,编程器,24VDC,220VAC,组成"
  },
  {
    id: "p14",
    cat: "basics",
    title: "扫描周期四步",
    content: "输入采样→程序执行→输出刷新→通信服务，一圈 1~100ms，循环往复。",
    tag: "什么是PLC",
    keywords: "扫描周期,输入采样,程序执行,输出刷新,通信服务,循环"
  },
  {
    id: "p23",
    cat: "basics",
    title: "电机启停自锁",
    content: "启动按钮→线圈→线圈常开触点并联在启动按钮上（自锁）；停止按钮(常闭)串在回路里。经典入门电路。",
    tag: "什么是PLC",
    keywords: "电机启停,自锁,启动按钮,停止按钮,常开触点,常闭触点,经典电路"
  },
  {
    id: "p24",
    cat: "basics",
    title: "交通信号灯控制",
    content: "用定时器 TON 顺序切换红/黄/绿灯，每个灯延固定时后切换（实战进阶例）。",
    tag: "什么是PLC",
    keywords: "交通信号灯,红绿灯,TON,定时器,顺序切换,实战"
  },

  // ===== ladder：梯形图（新增 2 张） =====
  {
    id: "p15",
    cat: "ladder",
    title: "上升沿/下降沿",
    content: "P 触点=信号从0变1瞬间导通一个周期；N 触点=从1变0瞬间导通。",
    tag: "梯形图",
    keywords: "上升沿,下降沿,P触点,N触点,边沿,瞬间导通"
  },
  {
    id: "p16",
    cat: "ladder",
    title: "与/或/非逻辑",
    content: "两个触点串联=AND（都通才输出）；并联=OR（任一通就输出）；常闭触点做 NOT。",
    tag: "梯形图",
    keywords: "AND,OR,NOT,与逻辑,或逻辑,非逻辑,串联,并联,常闭触点"
  },

  // ===== io：输入输出（新增 2 张） =====
  {
    id: "p17",
    cat: "io",
    title: "地址编码规则",
    content: "西门子 S7-200 格式——输入 I[字节].[位]（如 I0.0）、输出 Q[字节].[位]、内部继电器 M、定时器 T、计数器 C。",
    tag: "输入输出",
    keywords: "地址编码,S7-200,西门子,I0.0,Q,字节,位,内部继电器M,定时器T,计数器C"
  },
  {
    id: "p18",
    cat: "io",
    title: "I/O 配置示例：电机启停",
    content: "I0.0 启动按钮(常开)、I0.1 停止按钮(常闭)、Q0.0 电机接触器、Q0.1 运行灯。",
    tag: "输入输出",
    keywords: "I0.0,I0.1,Q0.0,Q0.1,电机启停,启动按钮,停止按钮,接触器,运行灯"
  },

  // ===== lang：编程语言（新增 4 张） =====
  {
    id: "p19",
    cat: "lang",
    title: "基本位逻辑指令",
    content: "LD 装载/LDN 取反装载/A 与/AN 与非/O 或/ON 或非/= 赋值。",
    tag: "编程语言",
    keywords: "LD,LDN,A,AN,O,ON,装载,取反,与,或,非,赋值,位逻辑"
  },
  {
    id: "p20",
    cat: "lang",
    title: "定时器 TON",
    content: "通电延时——输入接通后延时指定时间才输出；T37 + 100 = 1 秒（10ms×100）。",
    tag: "编程语言",
    keywords: "TON,通电延时,定时器,T37,10ms,延时"
  },
  {
    id: "p21",
    cat: "lang",
    title: "计数器指令",
    content: "数脉冲次数，到设定值就动作（如 C 计数器）。",
    tag: "编程语言",
    keywords: "计数器,C计数器,脉冲,设定值,计数"
  },
  {
    id: "p22",
    cat: "lang",
    title: "置位/复位指令 S/R",
    content: "S 把输出置1并保持，R 复位为0——做自锁用。",
    tag: "编程语言",
    keywords: "置位,S,复位,R,自锁,保持输出"
  }
];

// 分类定义（供筛选渲染用）
var PLC_CATS = {
  basics: { tag: "什么是PLC" },
  ladder: { tag: "梯形图" },
  io:     { tag: "输入输出" },
  lang:   { tag: "编程语言" }
};
