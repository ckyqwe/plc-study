// PLC 学习工具站 · 交互脚本
// 功能：渲染卡片 + 分类筛选 + 收藏（localStorage key = favPLC）+ 点击卡片弹窗查看完整内容

// ===== 1. 状态 =====
var currentFilter = "all"; // 当前筛选档：all / basics / ladder / io / lang / fav

// ===== 2. 渲染卡片 =====
// 清空 #cardGrid，把传入的卡片数组逐个生成 .tool-card DOM
// 卡片只显示标题（问题面），完整内容放在弹窗里展示
function renderCards(list) {
  var grid = document.getElementById("cardGrid");
  grid.innerHTML = ""; // 先清空，再重建（不写死卡片）

  list.forEach(function (card) {
    var div = document.createElement("div");
    div.className = "tool-card cat-" + card.cat; // 如 cat-basics，决定顶部彩条颜色
    div.dataset.id = card.id;                     // 收藏逻辑靠 data-id 定位

    // 标题
    var title = document.createElement("div");
    title.className = "tool-title";
    title.textContent = card.title;

    // 星星收藏按钮
    var btn = document.createElement("button");
    btn.className = "fav-btn" + (isFav(card.id) ? " faved" : ""); // 已收藏则加金色类
    btn.textContent = "★";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();      // 点星只收藏，不触发弹窗
      toggleFav(card);          // 切换收藏状态（内部写回 localStorage）
      this.classList.toggle("faved"); // 按钮加/去金色类
      renderFavBar();           // 重绘收藏栏

      // 收藏档联动：在 fav 档取消收藏 → 卡片实时从页面消失
      if (currentFilter === "fav") {
        renderCards(getFilteredCards());
      }
    });

    div.appendChild(title);
    div.appendChild(btn);
    // 整卡点击 → 弹出弹窗查看完整内容
    div.addEventListener("click", function () {
      openModal(card);
    });
    grid.appendChild(div);
  });
}

// ===== 2.5 弹窗逻辑 =====
// 打开弹窗：把卡片标题 + 完整正文填入弹窗并显示
function openModal(card) {
  var overlay = document.getElementById("modalOverlay");
  var box = document.getElementById("modalBox");
  var title = document.getElementById("modalTitle");
  var body = document.getElementById("modalBody");

  box.className = "modal cat-" + (card.cat || "notes"); // 顶部分类色条：卡片跟分类，词条用青色
  title.textContent = card.title;
  // 先清空再填正文（避免上一次残留）
  body.innerHTML = "";
  body.appendChild(document.createTextNode(card.content));
  // 词条附加添加时间（主页卡片无 time 字段，行为不受影响）
  if (card.time) {
    var t = document.createElement("div");
    t.className = "modal-time";
    t.textContent = "添加时间：" + card.time;
    body.appendChild(t);
  }
  overlay.style.display = "flex";          // 显示遮罩 + 弹窗
}

// 关闭弹窗
function closeModal() {
  var overlay = document.getElementById("modalOverlay");
  overlay.style.display = "none";
}

// ===== 2.7 随手记：视图切换 =====
// 显示随手记视图（隐藏卡片区与收藏栏）
function showNotesView() {
  document.getElementById("favBar").style.display = "none";
  document.getElementById("cardGrid").style.display = "none";
  document.getElementById("notesView").style.display = "block";
}

// 显示卡片视图（隐藏随手记）
function showCardsView() {
  document.getElementById("notesView").style.display = "none";
  document.getElementById("cardGrid").style.display = "";
  renderFavBar(); // 恢复收藏栏显示状态
}

// ===== 2.8 随手记：口令锁（localStorage key = noteLock，明文，仅防同电脑误开） =====
// 读取当前口令（没有则返回空字符串）
function getNoteLock() {
  return localStorage.getItem("noteLock") || "";
}

// 进入随手记：第一次 → 设置口令；之后 → 输入口令
function enterNotes() {
  var lock = getNoteLock();
  if (!lock) {
    openLockModal("set");   // 还没设置过口令 → 设置
  } else {
    openLockModal("enter"); // 已有口令 → 输入验证
  }
}

// 口令验证通过后真正进入随手记
function unlockNotes() {
  currentFilter = "notes";   // 记录当前视图，供导航高亮
  highlightNav("notes");
  showNotesView();
  renderNotes();
}

// 打开口令弹窗：mode = set(设置) / enter(输入) / change(修改)
function openLockModal(mode) {
  var overlay = document.getElementById("lockModal");
  var title = document.getElementById("lockModalTitle");
  var input = document.getElementById("lockInput");
  var newInput = document.getElementById("lockNewInput");
  var tip = document.getElementById("lockTip");
  var btn = document.getElementById("lockBtn");
  var resetBtn = document.getElementById("lockReset");

  input.value = "";
  newInput.value = "";
  tip.textContent = "";
  overlay.dataset.mode = mode;

  if (mode === "set") {
    title.textContent = "设置口令";
    newInput.style.display = "";           // 设置模式：显示"确认口令"输入框（输两遍）
    input.placeholder = "新口令";
    newInput.placeholder = "确认口令";
    btn.textContent = "设置并进入";
    resetBtn.style.display = "none";
  } else if (mode === "enter") {
    title.textContent = "输入口令";
    newInput.style.display = "none";
    input.placeholder = "请输入口令";
    btn.textContent = "进入";
    resetBtn.style.display = "";           // 输入模式：显示"忘记口令？重置"
  } else { // change
    title.textContent = "修改口令（需先输入原口令）";
    newInput.style.display = "";
    input.placeholder = "原口令";
    newInput.placeholder = "新口令";
    btn.textContent = "修改";
    resetBtn.style.display = "none";
  }

  overlay.style.display = "flex";
  input.focus();
}

// 关闭口令弹窗
function closeLockModal() {
  document.getElementById("lockModal").style.display = "none";
}

// 口令弹窗确认按钮的统一处理（按当前 mode 分支）
function submitLockModal() {
  var overlay = document.getElementById("lockModal");
  var mode = overlay.dataset.mode;
  var input = document.getElementById("lockInput");
  var newInput = document.getElementById("lockNewInput");
  var tip = document.getElementById("lockTip");

  if (mode === "set") {
    // 设置口令：新口令 + 确认口令，两次一致才保存
    var v = input.value;
    var v2 = newInput.value;
    if (!v || !v2) { tip.textContent = "请两次都输入口令"; return; }
    if (v !== v2) {
      tip.textContent = "两次输入不一致，请重新输入";
      input.value = "";
      newInput.value = "";
      input.focus();
      return;
    }
    localStorage.setItem("noteLock", v);
    closeLockModal();
    unlockNotes();
  } else if (mode === "enter") {
    // 输入口令：与 noteLock 比对，错误则提示重输
    if (input.value === getNoteLock()) {
      closeLockModal();
      unlockNotes();
    } else {
      tip.textContent = "口令错误，请重新输入";
      input.value = "";
      input.focus();
    }
  } else { // change
    // 修改口令：先验证原口令，再保存新口令
    if (input.value !== getNoteLock()) {
      tip.textContent = "原口令错误";
      input.value = "";
      input.focus();
      return;
    }
    var nv = newInput.value.trim();
    if (!nv) { tip.textContent = "新口令不能为空"; return; }
    localStorage.setItem("noteLock", nv);
    closeLockModal();
  }
}

// ===== 2.9 随手记：词条数据（localStorage key = noteItems） =====
// 读取词条数组（JSON，结构 [{title, content, time}]），解析失败返回空数组
function getNotes() {
  try {
    var raw = localStorage.getItem("noteItems");
    if (!raw) return [];
    var arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

// 保存词条数组
function saveNotes(notes) {
  localStorage.setItem("noteItems", JSON.stringify(notes));
}

// 格式化时间：YYYY-MM-DD HH:mm
function formatTime(d) {
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
         " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
}

// 渲染随手记卡片列表
function renderNotes() {
  var list = document.getElementById("noteList");
  var notes = getNotes();
  list.innerHTML = "";

  notes.forEach(function (note, idx) {
    var div = document.createElement("div");
    div.className = "tool-card cat-notes"; // 复用卡片样式 + 青色分类
    div.dataset.index = idx;

    var title = document.createElement("div");
    title.className = "tool-title";
    title.textContent = note.title || "未命名";

    var time = document.createElement("div");
    time.className = "note-time";
    time.textContent = note.time;

    // 删除按钮（右上角 ✕）
    var del = document.createElement("button");
    del.className = "note-del";
    del.textContent = "✕";
    del.title = "删除这条随手记";
    del.addEventListener("click", function (e) {
      e.stopPropagation(); // 阻止冒泡，避免触发卡片弹窗
      if (confirm("确定删除这条随手记？")) {
        var notes2 = getNotes();
        notes2.splice(idx, 1);   // 按索引删除
        saveNotes(notes2);
        renderNotes();
      }
    });

    div.appendChild(title);
    div.appendChild(time);
    div.appendChild(del);
    // 整卡点击 → 复用主页弹窗查看（标题 + 正文 + 添加时间，青色顶条）
    div.addEventListener("click", function () {
      openModal({
        cat: "notes",
        title: note.title || "未命名",
        content: note.content || "",
        time: note.time
      });
    });
    list.appendChild(div);
  });
}

// 添加词条
function addNote() {
  var title = document.getElementById("noteTitle").value.trim();
  var content = document.getElementById("noteContent").value.trim();

  if (!title && !content) {
    alert("标题和内容至少填一个");
    return;
  }

  var notes = getNotes();
  notes.push({
    title: title || content.slice(0, 12), // 标题为空时取内容前 12 字
    content: content,
    time: formatTime(new Date())
  });
  saveNotes(notes);

  // 清空输入框并重渲染
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  renderNotes();
}

// ===== 2.10 随手记：事件绑定 =====
// 修改口令按钮
document.getElementById("btnChangeLock").addEventListener("click", function () {
  openLockModal("change");
});

// 添加按钮
document.getElementById("btnAddNote").addEventListener("click", addNote);

// 口令弹窗：✕ 关闭
document.getElementById("lockModalClose").addEventListener("click", closeLockModal);

// 口令弹窗：点遮罩关闭
document.getElementById("lockModal").addEventListener("click", function (e) {
  if (e.target === this) closeLockModal();
});

// 口令弹窗：确认按钮
document.getElementById("lockBtn").addEventListener("click", submitLockModal);

// 口令输入框按回车 → 确认
document.getElementById("lockInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") submitLockModal();
});
document.getElementById("lockNewInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") submitLockModal();
});

// 忘记口令：重置（词条保留，回到设置新口令流程，输两遍）
document.getElementById("lockReset").addEventListener("click", function () {
  if (confirm("确定重置口令？词条会保留")) {
    localStorage.removeItem("noteLock");
    openLockModal("set");
    document.getElementById("lockTip").textContent = "口令已重置，请设置新口令（输两遍）";
  }
});

// 随手记输入框按回车 → 添加
document.getElementById("noteTitle").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addNote();
});
document.getElementById("noteContent").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addNote();
});

// ===== 3. 收藏读写（localStorage key = favPLC） =====
// 读收藏：存 JSON 数组 [{ id, title, cat }]，无/坏数据返回 []
function getFavs() {
  try {
    var raw = localStorage.getItem("favPLC");
    if (!raw) return [];
    var arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return []; // 数据损坏时兜底为空，不报错
  }
}

// 写收藏
function saveFavs(favs) {
  localStorage.setItem("favPLC", JSON.stringify(favs));
}

// 是否已收藏
function isFav(id) {
  return getFavs().some(function (item) {
    return item.id === id;
  });
}

// 切换收藏：有则删、无则加，写回并返回新状态 true/false
function toggleFav(card) {
  var favs = getFavs();
  var idx = favs.findIndex(function (item) {
    return item.id === card.id;
  });

  if (idx >= 0) {
    favs.splice(idx, 1); // 已收藏 → 删除
    saveFavs(favs);
    return false;
  } else {
    favs.push({ id: card.id, title: card.title, cat: card.cat }); // 冗余存 title/cat 供收藏栏显示
    saveFavs(favs);
    return true;
  }
}

// ===== 4. 收藏栏重绘 =====
// 无收藏时隐藏收藏栏；每项 = 链接（点击回该卡片位置）+「取消」按钮
function renderFavBar() {
  var bar = document.getElementById("favBar");
  var list = document.getElementById("favList");
  var favs = getFavs();

  if (favs.length === 0) {
    bar.style.display = "none"; // 无收藏 → 隐藏
    return;
  }

  bar.style.display = "block";
  list.innerHTML = "";

  favs.forEach(function (item) {
    var li = document.createElement("span");
    li.className = "fav-item";

    // 链接：点击切到对应分类并定位卡片（收藏项本身可点回）
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = item.title;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      setFilter(item.cat); // 切到该卡片的分类档
      // 定位到该卡片（滚动到 data-id 匹配的卡片附近）
      var target = document.querySelector('.tool-card[data-id="' + item.id + '"]');
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.style.outline = "2px solid #f59e0b"; // 短暂高亮提示
        setTimeout(function () { target.style.outline = "none"; }, 1500);
      }
    });

    // 「取消」按钮
    var rm = document.createElement("button");
    rm.className = "fav-remove";
    rm.textContent = "取消";
    rm.addEventListener("click", function () {
      // 从收藏数组里删掉这一项
      var favs2 = getFavs().filter(function (f) {
        return f.id !== item.id;
      });
      saveFavs(favs2);
      renderFavBar();   // 重绘收藏栏
      renderCards(getFilteredCards()); // 重绘卡片（星星同步去金）
    });

    li.appendChild(a);
    li.appendChild(rm);
    list.appendChild(li);
  });
}

// ===== 5. 筛选 =====
// 按当前筛选档取卡片列表：fav 档 = 只显示已收藏的卡片
function getFilteredCards() {
  if (currentFilter === "fav") {
    var favs = getFavs();
    var ids = favs.map(function (f) { return f.id; });
    return PLC_CARDS.filter(function (card) {
      return ids.indexOf(card.id) >= 0;
    });
  }
  if (currentFilter === "all") {
    return PLC_CARDS;
  }
  return PLC_CARDS.filter(function (card) {
    return card.cat === currentFilter;
  });
}

// 高亮当前导航档
function highlightNav(filter) {
  document.querySelectorAll(".nav-filter").forEach(function (a) {
    a.classList.toggle("active", a.dataset.filter === filter);
  });
}

// 设置当前筛选档并渲染
function setFilter(filter) {
  // 随手记是独立视图：走口令流程，不参与卡片筛选
  if (filter === "notes") {
    enterNotes();
    return;
  }

  currentFilter = filter;
  highlightNav(filter);
  showCardsView();      // 切回卡片视图
  renderCards(getFilteredCards());
}

// ===== 6. 事件绑定 =====
// 手机端汉堡菜单：点 ☰ 展开/收起 7 个链接（桌面按钮隐藏，这段逻辑对桌面无副作用）
var navToggle = document.getElementById("navToggle");
var navLinks = document.querySelector(".nav-links");

function toggleNav() {
  navLinks.classList.toggle("open");   // 有 open 类就展开，再点就收起
}

function closeNav() {
  navLinks.classList.remove("open");   // 点任意链接后收起面板
}

navToggle.addEventListener("click", function () {
  toggleNav();
});

// 导航筛选链接
document.querySelectorAll(".nav-filter").forEach(function (a) {
  a.addEventListener("click", function (e) {
    e.preventDefault();
    setFilter(this.dataset.filter);
    closeNav();                        // 手机端点链接后收起面板（桌面无 open 类，无副作用）
  });
});

// ===== 7. 初始化 =====
setFilter("all");    // 渲染全部 12 张卡片
renderFavBar();      // 恢复收藏栏状态

// 弹窗关闭事件（三种方式）：
// ① 右上角 ✕ 按钮
document.getElementById("modalClose").addEventListener("click", closeModal);
// ② 点击遮罩（非弹窗本体）关闭
document.getElementById("modalOverlay").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});
// ③ 按 Esc 键关闭（内容弹窗 + 口令弹窗都关）
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { closeModal(); closeLockModal(); }
});
