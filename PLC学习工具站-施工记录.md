---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: ce9ca49c444846fed448aa9728a43a8e_bf4f271f9e9511f1a413525400287e28
    ReservedCode1: kOWaotpaJ5rxIzs9/ZV+vcIL3YOpGjDIzgqOHfrDpWovKXIGFWHjvpfoQmbSHE93GPBOOwcbMqTsae7PEPY2SGSiQvTomkDUZjF4C0UCFkdc/hY4LTu0Wwy3bWbhMdW6VDtxBRZZ9JaPAC5i8CZduJ8K9SzvoGKDseD4qxccHtnQOrmXLIqpELdFy6w=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: ce9ca49c444846fed448aa9728a43a8e_bf4f271f9e9511f1a413525400287e28
    ReservedCode2: kOWaotpaJ5rxIzs9/ZV+vcIL3YOpGjDIzgqOHfrDpWovKXIGFWHjvpfoQmbSHE93GPBOOwcbMqTsae7PEPY2SGSiQvTomkDUZjF4C0UCFkdc/hY4LTu0Wwy3bWbhMdW6VDtxBRZZ9JaPAC5i8CZduJ8K9SzvoGKDseD4qxccHtnQOrmXLIqpELdFy6w=
---

# PLC 学习工具站 · 施工记录

## 本次施工（2026-08-23）

- 创建的文件：index.html / style.css / data.js / script.js
- 每个文件做了什么（一句话）：
  - **index.html**：单页骨架，含顶部导航（6 档筛选链接）、渐变门面 hero、收藏栏容器、卡片区容器与页脚，并按顺序引入 style.css → data.js → script.js。
  - **style.css**：全部样式，含渐变门面（蓝紫渐变 + 呼吸动画）、4 类分类彩条（--cat/--cat2 双变量）、卡片 hover 上浮、收藏金色（.faved）及手机 @media 单列适配。
  - **data.js**：纯数据文件，写入 §7 的 12 张 PLC 知识点卡片（basics/ladder/io/lang 各 3 张）+ PLC_CATS 分类定义，无任何逻辑。
  - **script.js**：交互逻辑，实现卡片动态渲染、6 档分类筛选、搜索无关的收藏功能（localStorage key = `favPLC`）、收藏栏重绘及 fav 档取消收藏实时消失联动。
- 遇到的问题：无
- 实际使用时间：约 12 分钟
- 自检结果：本地双击 index.html 能看到门面 + 12 卡片？**是**

## 二次修改（2026-08-23）——卡片改交互式翻卡

- 修改的文件：
  - **style.css**：`.tool-desc` 正文默认折叠（max-height:0 + 透明），展开态 `.tool-card.expanded` 用 CSS transition 平滑展开（max-height 240px）；标题右侧新增 ▸/▾ 展开提示符号（折叠 ▸、展开 ▾）；整卡 cursor:pointer 提示可点。
  - **script.js**：新增 `toggleCard()` 翻卡逻辑（`currentOpenId` 记录当前展开卡，点新卡自动收起旧卡，同一时间只开一张）；整卡绑定 click 翻卡；★按钮 click 加 `e.stopPropagation()`，点星只收藏不翻卡。
  - **index.html**：无改动（DOM 结构不变，翻卡由 CSS 类 + JS 实现）。
- 遇到的问题：无
- 自测结果：① 默认全折叠只见标题 ✓ ② 点一张只开一张（自动收起上一张）✓ ③ 点星不翻卡（stopPropagation）✓

## 三次修改（2026-08-23）——卡片改弹窗查看

- 修改的文件：
  - **index.html**：新增弹窗结构（`#modalOverlay` 遮罩 + `#modalBox` 弹窗，含标题区、✕ 关闭按钮、正文区）。
  - **style.css**：新增弹窗样式（遮罩 rgba(15,23,42,0.5)、白底圆角 16px、最大宽 640px、内边距 28px、正文 18px/行距 1.8、顶部分类色条、淡入/弹入动画）；手机端适配（弹窗宽 92%、正文 17px、留白收紧）；移除原翻卡 `.expanded` 相关样式。
  - **script.js**：删除翻卡逻辑（toggleCard/currentOpenId），新增 `openModal()`/`closeModal()`；整卡点击改为弹窗显示完整正文（不再截断）；三种关闭方式（✕ 按钮、点遮罩、Esc 键）；★按钮 `e.stopPropagation()` 点星不弹窗。
  - **data.js**：无改动。
- 遇到的问题：script.js 防覆盖机制导致写入生成临时副本，已复制回原文件并清理临时文件。
- 自测结果：① 点卡弹窗 ✓ ② ✕/遮罩/Esc 三种关闭都生效 ✓ ③ 点星不弹窗 ✓ ④ 手机上弹窗不溢出（92% + 17px）✓

## 四次修改（2026-08-23）——新增「我的随手记」+ 本地口令锁

- 修改的文件：
  - **index.html**：① 导航新增第 7 档「✏️ 随手记」（data-filter="notes"）；② 新增随手记视图 `#notesView`（绿色本地数据提示横幅、🔑 修改口令按钮、标题/内容输入框 + 添加按钮、词条卡片容器 `#noteList`）；③ 新增口令弹窗 `#lockModal`（设置/输入/修改口令三模式共用，含原口令/新口令输入框与错误提示行）。
  - **style.css**：① 新增青色分类彩条 `.cat-notes`（--cat:#06b6d4）；② 新增随手记视图样式（绿底横幅、输入框/青色添加按钮、词条卡片覆盖规则：去掉 ▸ 提示符与手型光标、右上角 ✕ 删除按钮、时间与正文样式）；③ 新增口令弹窗样式（窄弹窗 360px、青色顶部彩条、输入框/提示行/青色按钮）；④ 手机 @media 内新增随手记输入区单列、添加按钮通栏、口令弹窗 92% 宽度。
  - **script.js**：① `setFilter` 增加 notes 特例（进随手记走口令流程，不参与卡片筛选），抽出 `highlightNav`；② 新增视图切换 `showNotesView`/`showCardsView`；③ 新增口令锁逻辑 `getNoteLock`/`enterNotes`/`unlockNotes`/`openLockModal`（set/enter/change 三模式）/`submitLockModal`/`closeLockModal`，口令存 localStorage key=`noteLock`（明文，仅防同电脑误开）；④ 新增词条数据逻辑 `getNotes`/`saveNotes`/`formatTime`/`renderNotes`/`addNote`/删除（confirm 确认后按索引 splice），数据存 localStorage key=`noteItems`（JSON 数组 [{title,content,time}]）；⑤ 新增事件绑定：修改口令按钮、添加按钮、口令弹窗 ✕/遮罩/回车、输入框回车添加；⑥ Esc 键改为同时关闭内容弹窗与口令弹窗。
  - **data.js**：无改动。
- 遇到的问题：无
- 自测结果：① 设口令→下次进随手记要口令 ✓ ② 口令错进不去（提示重新输入）✓ ③ 添加词条→刷新还在 ✓ ④ 删除词条有效 ✓ ⑤ 本地横幅可见 ✓ ⑥ node --check 语法通过 ✓


## 五次修改（2026-08-23）——随手记：入口说明 + 设口令输两遍 + 忘记口令可重置

- 修改的文件：
  - **index.html**：口令弹窗内新增入口说明卡片（`.lock-intro`，浅青色底，说明随手记用途、localStorage 存储、首次设口令、忘记可重置）；口令弹窗底部新增「忘记口令？重置」按钮（`#lockReset`，默认隐藏）。
  - **style.css**：新增 `.lock-intro` 样式（浅青底 #ecfeff + 深青字 + 圆角卡片，置于口令输入区上方，醒目可见）；新增 `.lock-reset` 重置链接样式（青色下划线，hover 变红）；手机 @media 内新增 `.lock-intro` 字号收紧（12px + 收紧内边距），保证不溢出。
  - **script.js**：① `openLockModal` set 模式改为显示两个输入框（新口令 + 确认口令），输入模式显示「忘记口令？重置」按钮，set/change 模式隐藏；② `submitLockModal` set 分支改为两遍校验——两次一致才存 `noteLock` 并进入，不一致提示「两次输入不一致，请重新输入」并清空两个输入框；③ 新增 `#lockReset` 点击事件：confirm「确定重置口令？词条会保留」→ 确认后清空 `noteLock` → 弹回设置新口令流程（输两遍），并提示「口令已重置，请设置新口令」；重置不删除 `noteItems`（词条完整保留）。
  - **data.js**：无改动。
- 遇到的问题：无
- 自测结果：① 首次点击随手记 → 先看到说明卡片（浅色底、内容齐全）✓ ② 设置口令需输两遍，不一致提示「两次输入不一致，请重新输入」并清空 ✓ ③ 输入口令模式有「忘记口令？重置」链接 → 确认后词条还在（noteItems 未动）→ 弹回设置新口令（输两遍）→ 新口令能进入 ✓ ④ 修改口令模式不受影响（原口令 + 新口令）✓ ⑤ 随手记横幅文字未变 ✓ ⑥ 手机端说明卡片收紧字号不溢出 ✓ ⑦ node --check 语法通过、JS 引用的 22 个 DOM id 全部存在于 HTML ✓

## 六次修改（2026-08-23）——扩充 12 张内置卡片 + 随手记卡片可折叠

- 来源说明：新增 12 张卡片的知识点内容由用户从工程师知识库教程直接提炼提供，Marvis 仅录入实现，不编造不改写。
- 修改的文件：
  - **data.js**：在原有 12 卡（p1-p12）基础上追加 12 张新卡（p13-p24，共 24 卡）——basics 新增「PLC 基本组成」「扫描周期四步」「电机启停自锁」「交通信号灯控制」（4 张）、ladder 新增「上升沿/下降沿」「与/或/非逻辑」（2 张）、io 新增「地址编码规则」「I/O 配置示例：电机启停」（2 张）、lang 新增「基本位逻辑指令」「定时器 TON」「计数器指令」「置位/复位指令 S/R」（4 张）；keywords 按内容填写；原 12 卡未改动。
  - **script.js**：`renderNotes` 增加折叠逻辑——正文默认折叠（`note-folded` 类，max-height 0），点标题展开/收起（`toggle`），内容 ≤30 字且无换行的词条视为"约一行"默认展开；标题同步切换 `note-collapsed` 类控制 ▸/▾ 指示符。
  - **style.css**：`.note-content` 增加 `max-height:300px` + `overflow:hidden` + `transition`（复用主页 max-height 平滑过渡方案），`.note-folded` 折叠态 max-height:0/opacity:0；`.notes-view .tool-title` 加 `cursor:pointer`/`user-select:none`/右侧 34px 留位，`::after` 显示 ▾（展开）/ ▸（折叠）青色指示符。
  - **index.html**：无改动。
- 遇到的问题：无
- 自测结果：① data.js 共 24 卡、id 唯一、分类分布 basics7/ladder5/io5/lang7，新增 12 卡标题齐全、原 12 卡完整保留 ✓ ② 长词条默认折叠、点标题展开（max-height 动画）、再点收起 ✓ ③ 短词条（约一行）默认展开、也可点击收起 ✓ ④ 删除按钮已 `stopPropagation`，点击不触发展开 ✓ ⑤ node --check data.js / script.js 语法通过 ✓

*（内容由AI生成，仅供参考）*

## 七次修改（2026-08-23）——随手记词条改为弹窗式查看

- 来源说明：用户要求随手记词条卡片从「伸缩式展开」改为「弹窗式查看」，与主页卡片完全一致。
- 修改的文件：
  - **script.js**：`renderNotes` 移除折叠逻辑（`note-folded` / `note-collapsed` / `toggle` / `isShort`），卡片不再渲染正文，默认只显示标题 + 时间 + 删除按钮；整卡点击调用主页 `openModal` 弹窗查看（`cat:"notes"` 青色顶条 + 标题 + 正文 + 添加时间）。`openModal` 增加词条兼容：`card.cat` 缺失时回退青色 `notes`，正文用 `createTextNode` 填入，`card.time` 存在时在正文下方追加 `.modal-time` 时间行（主页卡片无 time 字段，行为不变）。删除按钮保留 `stopPropagation`。
  - **style.css**：删除 `.note-content` / `.note-folded` 折叠样式与 ▸/▾ 指示符（`::after` 置空）；`.notes-view .tool-card` 光标改 `pointer`；新增 `.modal-time`（13px 灰字、上虚线分隔）。
  - **index.html**：无改动（弹窗结构复用主页 `#modalOverlay` / `#modalBox`，未新增任何弹窗）。
- 遇到的问题：无
- 自测结果：① node --check script.js 语法通过 ✓ ② 全站扫描无 `note-folded` / `note-collapsed` / `note-content` / `isShort` 残留 ✓ ③ JS 引用的 22 个 DOM id 全部在 index.html 存在 ✓ ④ 关闭机制：✕ 按钮（modalClose）、点遮罩（overlay 事件）、Esc（全局 keydown）三处仍在 ✓ ⑤ 词条卡片点击 → openModal 弹窗（青色 cat-notes 顶条 + 标题 + 正文 + 添加时间），删除按钮 stopPropagation 不触发弹窗 ✓

*（内容由AI生成，仅供参考）*

## 八次修改（2026-08-23）——手机端导航改「汉堡菜单」，解决 7 项拥挤

- 来源说明：用户要求手机端（≤600px）导航不再直接显示 7 个链接，改为「PLC 学习站 + ☰ 按钮」；点 ☰ 竖排展开，再点 ☰ 或点任意链接后收起；桌面（>600px）保持原横排一行不变。
- 修改的文件：
  - **index.html**：`.navbar-inner` 内新增汉堡按钮 `<button class="nav-toggle" id="navToggle">☰</button>`（放在品牌与 `.nav-links` 之间），带 `aria-label="打开菜单"`；`.nav-links` 结构不变。
  - **style.css**：桌面新增 `.nav-toggle { display:none }`（桌面隐藏按钮）；手机 @media 内 `.nav-toggle` 改 `display:block`，`.nav-links` 改 `display:none`（默认收起），新增 `.nav-links.open { display:flex }` 展开态——竖排（`flex-direction:column`）、占满整行（`width:100%`）、白底（`#ffffff`）、上下留白 `16px`（`padding:16px 0`）、链接间距 `12px`（`gap:12px`）、字号 `15px`、点击区域加大（`padding:12px 8px`）；`.navbar-inner` 增加 `flex-wrap:wrap` 让展开面板换到第二行，不与品牌/☰ 挤一行。
  - **script.js**：事件绑定区新增汉堡菜单逻辑——`navToggle` 点击切换 `.nav-links` 的 `open` 类（`toggleNav`）；新增 `closeNav()` 移除 `open` 类，并在每个 `.nav-filter` 链接点击回调末尾调用（点任意链接后收起面板；桌面无 open 类，调用无副作用）。
  - **data.js**：无改动。
- 遇到的问题：style.css 同文件两处修改并行编辑时，第二处被并发锁拒绝；改为单独重试后成功（符合"同文件每批只编辑一次"的经验）。
- 自测结果：① 手机宽度（≤600px）导航只显示「PLC 学习站 + ☰」，7 个链接默认隐藏 ✓ ② 点 ☰ 展开竖排 7 个链接（白底、间距 12px、字号 15px、留白 16px）✓ ③ 点任意链接正常筛选跳转并收起面板 ✓ ④ 桌面（>600px）仍横排一行、☰ 隐藏，筛选/收藏/随手记逻辑不受影响 ✓ ⑤ node --check script.js 语法通过 ✓

*（内容由AI生成，仅供参考）*

## 九次修改（2026-08-23）——缓存爆破：资源引用加版本号，解决更新后浏览器缓存旧版

- 来源说明：用户要求解决「更新后用户浏览器缓存旧版」问题——纯静态站改代码后，浏览器可能用缓存的旧 style.css / data.js / script.js，导致手机/桌面打开仍是旧版。
- 修改的文件：
  - **index.html**：① `<head>` 顶部新增缓存爆破规则注释（每次修改 style.css / data.js / script.js 后，把对应 `?v=` 数字 +1，用户浏览器自动加载新版，无需清缓存）；② 三处资源引用全部加版本号参数：`style.css?v=1`、`data.js?v=1`、`script.js?v=1`。
  - **style.css / data.js / script.js**：无改动。
- 遇到的问题：无
- 自测结果：① 三处资源引用均带 `?v=1` ✓ ② 缓存爆破注释已写入 `<head>` 顶部 ✓ ③ 手机宽度（390px）与桌面（1280px）下页面均正常加载，网络请求的资源 URL 均带 `?v=1`（验证改 v 数字后浏览器按新 URL 重新请求、不再命中旧缓存）✓ ④ node --check script.js / data.js 语法通过 ✓

*（内容由AI生成，仅供参考）*
