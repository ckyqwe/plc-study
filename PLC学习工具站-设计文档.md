# PLC 学习工具站 · 可执行设计文档 v1.0

> 状态：已立项（2026-08-23 t22 定稿）｜执行窗口：2026-08-24 ~ 08-29
> 本文档是唯一施工依据。任何 Agent 拿到本文档即可按「分日实施计划」逐步完成建站、交互、部署与验收，无需再向用户追问需求。
> 上级文档：`PLC学习工具站-Spec.md`（本档为实现细则）。

---

## 0. 执行总则（Agent 必读）

1. **技术栈锁定**：纯静态站（HTML + CSS + 原生 JS），无框架、无构建、无后端。数据用 `data.js`（写死的 JS 数组）+ `localStorage`（收藏持久化）。
2. **单页应用**：全部功能在一个 `index.html` 内完成（分类筛选 + 卡片展示 + 收藏栏），不建多页。
3. **内容真实性**：知识点卡片内容 = 工业自动化通识（见 §7），**上线前必须用课程笔记/教材复核一遍**（8/1 教训：AI 给的内容要抽查，不编造）。
4. **风格继承**：视觉延续用户导航站（`E:\学习资料\AI\项目\AI 工具导航站`）的「浅色多彩卡片 + 渐变门面」风格，但必须**是新站**，不改导航站任何文件。
5. **项目路径**：新目录 `E:\学习资料\AI\项目\PLC学习工具站`。建站代码全放这里。
6. **部署方式**：GitHub Pages（用户已有 ckyqwe 账号与流程经验）。仓库名建议 `plc-study`（分支 master，Pages 用 master+/(root)）。实际部署时若仓库名被占用则改同类名（如 `plc-study-cards`），并在验收记录中注明。
7. **每个文件写完后自查**（§8 验收清单），全部通过才算 Day 完成。

---

## 1. 文件结构（共 4 个文件）

```
E:\学习资料\AI\项目\PLC学习工具站\
├── index.html      # 单页：门面 + 筛选 + 卡片区 + 收藏栏 + 页脚
├── style.css       # 全部样式（含 @media 手机适配）
├── data.js         # PLC 知识点数据（纯数据，无逻辑）
└── script.js       # 交互：筛选 + 收藏 + localStorage
```

**依赖关系**：`index.html` 依次引入 `style.css` → `data.js` → `script.js`。`data.js` 先于 `script.js`（script 要读数据渲染卡片）。

---

## 2. 页面结构（index.html 的 DOM 规格）

```html
<body data-page="home">
  <nav class="navbar">            <!-- 顶部导航 -->
    <div class="navbar-inner">
      <a class="nav-brand" href="#">PLC 学习站</a>
      <div class="nav-links">
        <a href="#" data-filter="all"    class="nav-filter active">全部</a>
        <a href="#" data-filter="basics" class="nav-filter">什么是PLC</a>
        <a href="#" data-filter="ladder" class="nav-filter">梯形图</a>
        <a href="#" data-filter="io"     class="nav-filter">输入输出</a>
        <a href="#" data-filter="lang"   class="nav-filter">编程语言</a>
        <a href="#" data-filter="fav"    class="nav-filter">⭐ 收藏</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="hero">            <!-- 门面：渐变背景（仿导航站但独立） -->
      <h1>PLC <span>学习工具站</span></h1>
      <p>✨ 工科生的口袋复习卡：翻卡片、点星收藏、随手复习</p>
    </div>

    <div class="fav-bar" id="favBar" style="display:none">   <!-- 收藏栏 -->
      <div class="fav-bar-title">⭐ 我的收藏</div>
      <div class="fav-list" id="favList"></div>   <!-- script.js 动态生成 -->
    </div>

    <div class="tool-grid" id="cardGrid"></div>   <!-- 卡片区：data.js + script.js 动态渲染 -->
  </div>

  <div class="footer">猪猪的 PLC 学习工具站 · 用爱发电 · v1.0</div>
  <script src="data.js"></script>
  <script src="script.js"></script>
</body>
```

**要点**：
- 筛选用 `.nav-filter` 链接 + `data-filter` 属性（all / basics / ladder / io / lang / fav 六档）。
- 卡片区 `#cardGrid` 完全由 JS 渲染（先清空 innerHTML 再重建），不写死卡片。
- 收藏筛选档（fav）=「只看收藏的卡片」。

---

## 3. 数据规格（data.js）

### 3.1 结构

```js
// PLC 学习工具站 · 知识点数据
// 字段说明：
//   id       唯一标识，如 "p1"
//   cat      分类：basics=ladder=io=lang=(见 §3.2)
//   title    卡片标题（一句话）
//   content  卡片正文（2~4 句，通识向，待复核）
//   tag      分类标签文字，如 "什么是PLC"
//   keywords 用于搜索的额外关键词（逗号分隔，如 "可编程逻辑控制器,继电器"）
var PLC_CARDS = [ /* ...卡片对象数组，见 §7 内容库... */ ];

// 分类定义（供筛选渲染用）
var PLC_CATS = {
  basics: { tag: "什么是PLC" },
  ladder: { tag: "梯形图" },
  io:     { tag: "输入输出" },
  lang:   { tag: "编程语言" }
};
```

### 3.2 分类标识

| cat 值 | 中文标签 | 计划卡片数 |
|---|---|---|
| `basics` | 什么是 PLC | 3 |
| `ladder` | 梯形图 | 3 |
| `io` | 输入输出 | 3 |
| `lang` | 编程语言 | 3 |

共 **12 张卡片**（初版；用户后续可自行扩充 `data.js`）。

---

## 4. 交互规格（script.js）

### 4.1 功能清单（5 项）

1. **渲染卡片**：`renderCards(list)` —— 清空 `#cardGrid`，把传入的卡片数组逐个生成 `.tool-card` DOM，每张卡含 ★ 按钮（类 `.fav-btn`）。
2. **分类筛选**：点击 `.nav-filter` → 取 `data-filter` → 高亮当前档 → 按 cat 过滤 `PLC_CARDS` → `renderCards`。`fav` 档 = 只显示已收藏的卡片（逻辑见 4.3）。
3. **搜索过滤**（选学，Day3 有余力再加）：门面下加一个 `.search-box` 输入框，输入时按 `title + keywords` 模糊过滤（`indexOf` 匹配，仿导航站 script.js 第 22-48 行）。不实现也可以，实现则要同时支持「筛选档 + 搜索词」叠加。
4. **收藏功能**（核心，必须实现）：
   - localStorage key：**`favPLC`**（与导航站的 `favTools` 区分开，互不干扰）。
   - 存 JSON 数组，元素 `{ id, title, cat }`（只存 id 即可唯一定位卡片，title/cat 冗余存是为了收藏栏显示）。
   - `getFavs()` → 读 `localStorage.getItem('favPLC')`，try/catch，无/坏数据返回 `[]`。
   - `isFav(id)` → 数组里找 `item.id === id`。
   - `toggleFav(card)` → 有则删、无则加，写回，返回新状态。
   - ★ 按钮点击：切换收藏 → 按钮加/去 `.faved` 类（金色）→ 重绘收藏栏 `#favBar`。
   - 收藏栏 `#favBar`：无收藏 `display:none`；每项 = 链接（点回该卡片位置/或显示标题）+「取消」按钮。
5. **收藏档联动**：当前筛选档是 `fav` 时，某卡取消收藏后要**实时从页面消失**（重新按收藏列表渲染）；其他档取消收藏不影响卡片存在。

### 4.2 函数命名约定（保证 Agent 与脚本一致）

```js
function renderCards(list) {}     // 渲染卡片列表到 #cardGrid
function getFavs() {}             // 读收藏
function saveFavs(favs) {}        // 写收藏
function isFav(id) {}             // 是否已收藏
function toggleFav(card) {}       // 切换收藏，返回 true/false
function renderFavBar() {}        // 重绘收藏栏
function setFilter(filter) {}     // 设置当前筛选档并渲染
```

### 4.3 卡片 DOM 规格（script.js 生成）

```html
<div class="tool-card cat-basics" data-id="p1">
  <div class="tool-title">什么是 PLC</div>
  <div class="tool-desc">可编程逻辑控制器……</div>
  <button class="fav-btn">★</button>   <!-- 收藏后加 .faved 金色 -->
</div>
```

- 卡片类：`tool-card cat-<cat>`（cat 决定卡片顶部彩条颜色，仿导航站 `--cat` 变量方案）。
- `data-id` = 卡片 id，收藏逻辑靠它定位。

---

## 5. 样式规格（style.css）

### 5.1 设计基调

- **门面 hero**：渐变背景 `linear-gradient(135deg, #0ea5e9 0%, #6366f1 55%, #a855f7 100%)`（PLC=工业蓝紫系，与导航站的蓝粉区分），白字，圆角大卡片，可加呼吸动画（仿导航站 8/21 改动）。
- **卡片**：白底圆角 (12px)，顶部 4px 彩条 `var(--cat)`，hover 上浮 + 阴影加深。
- **分类配色**（每个 cat 一组主/浅色，仿导航站 `--cat`/`--cat2` 双变量）：
  - `cat-basics`：蓝 `#0ea5e9` / 浅 `#7dd3fc`
  - `cat-ladder`：绿 `#22c55e` / 浅 `#86efac`
  - `cat-io`：橙 `#f97316` / 浅 `#fdba74`
  - `cat-lang`：紫 `#a855f7` / 浅 `#d8b4fe`
- **字体**：Microsoft YaHei 等系统字体；正文 14px、标题 17px、门面 h1 38px。
- **收藏金色**：`.faved` → 边框/星星 `#f59e0b`（仿导航站 faved）。

### 5.2 响应式（手机适配，必须）

```css
@media (max-width: 600px) {
  .hero { padding: 32px 16px 28px; border-radius: 14px; }
  .nav-links a { font-size: 14px; margin-left: 10px; }
  .tool-grid { grid-template-columns: 1fr; }   /* 手机上单列 */
  .tool-card { padding: 14px 16px; }
}
```

桌面端 `tool-grid`：`grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));`

---

## 6. 部署流程（8/29 执行）

1. `cd E:\学习资料\AI\项目\PLC学习工具站`
2. `git init`（本机 git init 默认分支 = **master**，注意！）→ `git add .` → `git commit -m "PLC学习工具站 v1.0"`
3. GitHub 新建仓库 `plc-study`（公开，否则免费账号不能公开 Pages），`git remote add origin https://github.com/ckyqwe/plc-study.git`
4. `git push origin master`
5. GitHub 仓库 Settings → Pages → Source 选 **master + /(root)** → Save
6. 等 1~3 分钟，访问 `https://ckyqwe.github.io/plc-study/` 验证
7. **404 排障口诀**（用户 8/16 实测）：①Pages 的 Branch 必须 = 仓库默认分支（git init 是 master，Pages 残留 main 最常见，以 `git branch` 为准）②私有仓库必须改 Public ③首次构建 1-2 分钟。

---

## 7. 内容库（12 张卡片草稿——工业自动化通识）

> ⚠️ 上线前用户核对：这些是通识写法，**必须**对照 PLC 课程笔记/教材复核后启用；与课程不一致处按教材改。

### basics（什么是 PLC）
1. **可编程逻辑控制器**：PLC = Programmable Logic Controller，工业控制里的"小电脑"，专门扛粉尘、高温、震动，7×24 小时干活。
2. **继电器柜的升级版**：老式控制用一堆继电器接线，改逻辑要改线；PLC 把逻辑写进程序，改逻辑=改程序，不用拆线。
3. **扫一遍又一遍**：PLC 的工作循环 = 读输入 → 跑程序 → 写输出，每圈几毫秒，循环往复（扫描周期）。

### ladder（梯形图）
4. **长得像电路图**：梯形图左右两条竖线像电源母线，中间横线像电路，左边条件（常开/常闭触点），右边结果（线圈）。
5. **常开常闭**：常开（NO）= 平时不通、按下才通；常闭（NC）= 平时通、按下断开——编程里的"开关"逻辑。
6. **线圈输出**：梯形图最右端的线圈 = 结果，通了就"输出"（点亮灯/启动电机）；一条梯级 = 一个"如果条件成立就输出"。

### io（输入输出）
7. **输入**：按钮、接近开关、传感器把信号送进 PLC（数字量输入 DI）；"PLC 怎么知道外面发生了什么"。
8. **输出**：PLC 控制灯、继电器、电机接触器（数字量输出 DO）；"PLC 怎么动手干活"。
9. **I/O 点数**：一台 PLC 能接多少输入/输出是固定点数（如 24 点），选型先数你要接几个按钮几个灯。

### lang（编程语言）
10. **三种主流语言**：梯形图 LD（电工友好）、指令表 IL（像汇编，一行一条指令）、结构化文本 ST（像高级语言，适合复杂计算）。
11. **IEC 61131-3 标准**：PLC 编程语言的国际标准，一共五种（LD/IL/ST/FBD/SFC），学 PLC 语言先认这个标准。
12. **选哪种**：逻辑控制（启停/互锁）用梯形图；数据处理/数学运算用 ST；顺序流程用 SFC。

---

## 8. 验收清单（每完成一日勾一项，全部通过 = 挑战成功）

| # | 验收项 | 对应 Spec | 验证方式 |
|---|---|---|---|
| 1 | 页面能打开，4 类共 12 卡显示 | 成功标准① | 本地双击 index.html |
| 2 | 分类筛选正常（6 档含收藏档） | 成功标准① | 点每个筛选链接验证 |
| 3 | 点星收藏 → 刷新后收藏还在 | 成功标准② | 收藏 2 张 → F5 → 星星仍金色 |
| 4 | 手机打开不挤、单列显示 | 成功标准③ | 手机访问真机测 / 浏览器缩到 400px |
| 5 | 已部署到 GitHub Pages 有公开网址 | 成功标准④ | 打开 https://ckyqwe.github.io/plc-study/ |
| 6 | 用户能用自己的话讲"我做了个复习收藏站" | 成功标准⑤ | 8/28 t27 口头验收 |

---

## 9. 分日实施计划（Agent 按此逐步执行）

| 日期 | 任务 | 本日输出 | 完成标准 |
|---|---|---|---|
| 8/24 | **t23 Day1 搭骨架** | 建目录；写 `index.html`（§2 结构）+ `data.js`（§7 12 卡）+ `style.css` 基础（§5.1 门面+卡片） | 本地打开能看到门面 + 12 卡（无收藏功能） |
| 8/25 | **t24 Day2 样式** | 完善 style.css：分类彩条、hover、渐变门面动画、收藏金色 | 对照导航站审美，卡片美观、分类色区分明显 |
| 8/26 | **t25 Day3 交互** | 写 `script.js`：渲染 + 筛选 + 收藏 + 收藏栏（§4 全量）；有余力加搜索框 | 收藏/筛选全通（验收清单 #2 #3） |
| 8/27 | **t26 Day4 完善** | 手机响应式（§5.2）+ 内容复核（§7 对照教材）+ 细节修复 | 手机单列可看；内容与课程一致 |
| 8/28 | **t27 Day5 讲项目** | 用户用自己的话讲"我做了个复习收藏站"（6 问口头验收） | 用户能讲：文件/数据/收藏/筛选/部署的链路 |
| 8/29 | **t28 Day6 部署演示** | 按 §6 部署到 GitHub Pages + 全验收清单打勾 | 公开网址可开、全部验收项 ✅ |

**每日执行纪律**：开工先读本文档对应章节；每写完一个文件自查（HTML 引用的 id/class 必须与 CSS/JS 一致）；本日验收不过不进入下一日；任何偏离本文档的改动（目录名/配色/功能增减）必须写入 changelog 并让用户知情。

---

## 10. 已知边界（不做）

- ❌ 账号/登录/多人数据
- ❌ 数据库/后端
- ❌ 在线编辑工具（用户直接改 data.js 即可）
- ❌ 题库/自测模式（用户 8/23 拍板不做，收藏即复习）
- ❌ 与导航站合并（两个独立站，风格相近但代码分离）