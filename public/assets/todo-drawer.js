/* 待办事项抽屉 + 铃铛消息着色
 * 规则按角色判定（super_admin / specialist+admin_granted / advisor），新增账号自动适用。
 * 数据与主应用共用 localStorage「admin-demo-db-v3」，登录态读 sessionStorage「admin-session」。
 */
(function () {
  "use strict";

  var DB_KEY = "admin-demo-db-v3";
  var SESSION_KEY = "admin-session";
  var POLL_MS = 2000;

  var COLORS = {
    transfer: { bg: "#eff6ff", fg: "#1d4ed8", border: "#bfdbfe", label: "客户流转" },
    booking: { bg: "#fff7ed", fg: "#c2410c", border: "#fed7aa", label: "到校预约" },
    event: { bg: "#f5f3ff", fg: "#6d28d9", border: "#ddd6fe", label: "活动日程" },
    account: { bg: "#fef2f2", fg: "#b91c1c", border: "#fecaca", label: "审批事项" },
    done: { bg: "#ecfdf5", fg: "#047857", border: "#a7f3d0", label: "已办结" },
  };

  /* 驳回/拒绝时的常用原因快捷选项 */
  var REJECT_PRESETS = {
    rejectReg: ["信息不完整", "非本部门人员"],
    rejectProfile: ["信息不完整", "不符合规范"],
    rejectTransfer: ["跟进记录不全", "目标顾问已达负荷", "不符合转交规则", "原顾问继续跟进"],
    declineTransfer: ["手头客户已饱和", "业务方向不符"],
  };

  function readJSON(storage, key) {
    try {
      var raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function me() {
    return readJSON(sessionStorage, SESSION_KEY);
  }

  function db() {
    return readJSON(localStorage, DB_KEY) || {};
  }

  function isApprover(session) {
    return (
      session &&
      (session.role === "super_admin" ||
        (session.role === "specialist" && session.admin_granted))
    );
  }

  function who(name, myName) {
    return name === myName ? "你" : name;
  }

  function q(name, myName) {
    return "「" + who(name, myName) + "」";
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d)) return String(iso);
    return d.getMonth() + 1 + "月" + d.getDate() + "日";
  }

  function dayDiff(dateStr) {
    var d = new Date(dateStr);
    if (isNaN(d)) return 999;
    var now = new Date();
    var a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.round((b - a) / 86400000);
  }

  function dismissKey(session) {
    return "admin-todo-dismissed-" + (session.account || "");
  }

  function getDismissed(session) {
    return readJSON(localStorage, dismissKey(session)) || [];
  }

  function dismiss(session, id) {
    var list = getDismissed(session);
    if (list.indexOf(id) < 0) list.push(id);
    try {
      localStorage.setItem(dismissKey(session), JSON.stringify(list));
    } catch (e) {}
  }

  /* 按角色生成待办列表 */
  function buildTodos(session, data) {
    if (!session) return [];
    var myName = session.name || "";
    var todos = [];
    var leads = data.leads || [];
    var leadName = function (id) {
      var l = leads.find(function (x) { return x.id === id; });
      return l ? l.name : "客户";
    };

    if (isApprover(session)) {
      (data.registrations || [])
        .filter(function (r) { return r.status === "pending"; })
        .forEach(function (r) {
          todos.push({
            id: "reg-" + r.id,
            goId: r.id,
            cat: "account",
            tag: "账号待审",
            nav: "待处理申请",
            text: q(r.name, myName) + " 申请注册账号（" + r.account + "）",
            actions: [
              { label: "批准", kind: "approveReg", ref: r.id, primary: true },
              { label: "驳回", kind: "rejectReg", ref: r.id },
            ],
          });
        });
      (data.profile_changes || [])
        .filter(function (p) { return p.status === "pending"; })
        .forEach(function (p) {
          var parts = [];
          if (p.nameNew && p.nameNew !== p.name) parts.push("姓名改为「" + p.nameNew + "」");
          if (p.accountNew && p.accountNew !== p.account) parts.push("邮箱改为 " + p.accountNew);
          todos.push({
            id: "pc-" + p.id,
            goId: p.id,
            cat: "account",
            tag: "资料待审",
            nav: "待处理申请",
            text: q(p.name, myName) + " 申请修改资料" + (parts.length ? "（" + parts.join("、") + "）" : ""),
            actions: [
              { label: "同意", kind: "approveProfile", ref: p.id, primary: true },
              { label: "驳回", kind: "rejectProfile", ref: p.id },
            ],
          });
        });
      (data.transfers || [])
        .filter(function (t) { return t.status === "待审批"; })
        .forEach(function (t) {
          todos.push({
            id: "tr-" + t.id,
            goId: t.id,
            cat: "transfer",
            tag: "转交审批",
            nav: "待处理申请",
            text:
              q(t.from, myName) + " 申请将 " + q(leadName(t.lead_id), myName) +
              " 转给 " + q(t.to, myName) + (t.reason ? "（原因：" + t.reason + "）" : ""),
            actions: [
              { label: "同意", kind: "approveTransfer", ref: t.id, primary: true },
              { label: "驳回", kind: "rejectTransfer", ref: t.id },
            ],
          });
        });
    }

    var dismissed = getDismissed(session);
    {
      (data.transfers || [])
        .filter(function (t) { return t.status === "待接收" && t.to === myName; })
        .forEach(function (t) {
          var isAssign = t.kind === "assign" || t.from === "未分配";
          var src = t.by && t.by !== t.from ? q(t.by, myName) : q(t.from, myName);
          todos.push({
            id: "recv-" + t.id,
            goId: t.lead_id,
            cat: "transfer",
            tag: isAssign ? "新客户待接收" : "待接收",
            nav: "工作台",
            text: isAssign
              ? src + " 把新客户 " + q(leadName(t.lead_id), myName) + " 分配给「你」，确认接收后正式归入你的名下"
              : src + " 把客户 " + q(leadName(t.lead_id), myName) + " 从 " + q(t.from, myName) +
                " 名下转交给「你」，确认接收后正式归入你的名下",
            actions: [
              { label: "确认接收", kind: "acceptTransfer", ref: t.id, primary: true },
              { label: "拒绝", kind: "declineTransfer", ref: t.id },
            ],
          });
        });
      /* 被拒收：通知发起人（转出人或分配人），客户仍在原处 */
      (data.transfers || [])
        .filter(function (t) {
          var owner = t.from === "未分配" || t.kind === "assign" ? t.by : t.from;
          return t.status === "接收方拒绝" && owner === myName && dismissed.indexOf("bounce-" + t.id) < 0;
        })
        .forEach(function (t) {
          var unassigned = t.from === "未分配";
          todos.push({
            id: "bounce-" + t.id,
            goId: t.lead_id,
            cat: "transfer",
            tag: "转交被拒",
            nav: "工作台",
            text:
              q(t.to, myName) + " 拒绝接收客户 " + q(leadName(t.lead_id), myName) +
              (t.decline_reason ? "（原因：" + t.decline_reason + "）" : "") +
              (unassigned ? "，该客户仍为未分配，请重新分配" : "，客户已退回 " + q(t.from, myName) + " 名下，请重新处理"),
            actions: [{ label: "知道了", kind: "dismiss", ref: "bounce-" + t.id }],
          });
        });
    }

    /* 到校预约：仅专人处理（不论是否有日常管理权限） */
    (session.role === "specialist" ? data.bookings || [] : [])
      .filter(function (b) {
        var diff = dayDiff(b.visit_date);
        return (
          dismissed.indexOf("bk-" + b.id) < 0 &&
          (diff === 0 || diff === 1 || b.status === "待确认")
        );
      })
      .forEach(function (b) {
        var diff = dayDiff(b.visit_date);
        var when = diff === 0 ? "今天" : diff === 1 ? "明天" : fmtDate(b.visit_date);
        todos.push({
          id: "bk-" + b.id,
          goId: b.id,
          cat: "booking",
          tag: "到校预约",
          nav: "到校预约",
          navRange: diff === 0 ? "今天" : diff === 1 ? "明天" : diff <= 6 ? "一周内" : "一个月内",
          navName: b.name,
          text:
            q(b.name, myName) + " 预约 " + when + (b.slot ? " " + b.slot : "") +
            " 到校咨询（" + (b.people || 1) + " 人）" +
            (b.status === "待确认" ? "，待确认" : ""),
          actions: [{ label: "知道了", kind: "dismiss", ref: "bk-" + b.id }],
        });
      });

    /* 全员：3 天内的活动 */
    (data.events || [])
      .filter(function (e) {
        var diff = dayDiff(e.starts_at);
        return dismissed.indexOf("ev-" + e.id) < 0 && diff >= 0 && diff <= 3;
      })
      .forEach(function (e) {
        var diff = dayDiff(e.starts_at);
        var when = diff === 0 ? "今天" : diff === 1 ? "明天" : diff + " 天后（" + fmtDate(e.starts_at) + "）";
        todos.push({
          id: "ev-" + e.id,
          goId: e.id,
          cat: "event",
          tag: "活动提醒",
          nav: "活动管理",
          navName: e.name,
          text: "活动 " + q(e.name, myName) + " 将于 " + when + " 举行，请关注报名与组织",
          actions: [{ label: "知道了", kind: "dismiss", ref: "ev-" + e.id }],
        });
      });

    return todos;
  }

  /* 执行待办操作：走与主应用相同的 demoCloud 数据层 */
  async function runAction(session, action) {
    var mod = await import("/assets/demo-CUN4h6Gz.js");
    var cloud = mod.demoCloud;
    var data = db();
    var myName = session.name || "";
    var approverNames = (data.profiles || [])
      .filter(function (p) {
        return p.role === "super_admin" || (p.role === "specialist" && p.admin_granted);
      })
      .map(function (p) { return p.name; });
    var leadName = function (id) {
      var l = (data.leads || []).find(function (x) { return x.id === id; });
      return l ? l.name : "客户";
    };
    var notify = function (to, text, kind, ref) {
      return cloud("adminSave", {
        table: "notifications",
        values: {
          to: [...new Set(to.filter(Boolean))],
          text: text,
          kind: kind || "lead",
          ref: ref || "",
          created_at: new Date().toISOString(),
        },
      });
    };

    if (action.kind === "dismiss") {
      dismiss(session, action.ref);
      return;
    }
    if (action.kind === "approveReg" || action.kind === "rejectReg") {
      await cloud("reviewRegistration", {
        id: action.ref,
        decision: action.kind === "approveReg" ? "approve" : "reject",
        actor: session.account,
        reviewer: myName,
        role: "advisor",
        reason: "",
      });
    } else if (action.kind === "approveProfile" || action.kind === "rejectProfile") {
      await cloud("reviewProfileChange", {
        id: action.ref,
        decision: action.kind === "approveProfile" ? "approve" : "reject",
        actor: session.account,
        reason: "",
      });
    } else if (action.kind === "approveTransfer" || action.kind === "rejectTransfer") {
      var t = (data.transfers || []).find(function (x) { return x.id === action.ref; });
      if (!t) return;
      var approve = action.kind === "approveTransfer";
      await cloud("adminSave", {
        table: "transfers",
        id: t.id,
        values: approve
          ? { status: "待接收", reviewed_at: new Date().toISOString(), reviewer: myName }
          : { status: "已驳回", reviewed_at: new Date().toISOString(), reviewer: myName, reject_reason: "" },
      });
      await notify(
        [...approverNames, t.from, t.to],
        approve
          ? "「" + myName + "」同意「" + t.from + "」把「" + leadName(t.lead_id) + "」转给「" + t.to + "」"
          : "「" + myName + "」驳回了「" + t.from + "」把「" + leadName(t.lead_id) + "」转给「" + t.to + "」的申请",
        "lead",
        t.lead_id
      );
    } else if (action.kind === "acceptTransfer" || action.kind === "declineTransfer") {
      var tr = (data.transfers || []).find(function (x) { return x.id === action.ref; });
      if (!tr) return;
      var accept = action.kind === "acceptTransfer";
      await cloud("adminSave", {
        table: "transfers",
        id: tr.id,
        values: {
          status: accept ? "已转交" : "接收方拒绝",
          accepted_at: new Date().toISOString(),
        },
      });
      if (accept) {
        await cloud("adminSave", {
          table: "leads",
          id: tr.lead_id,
          values: {
            owner: tr.to,
            note: tr.from === "未分配" ? "客户分配给 " + tr.to + "（已确认接收）" : "客户由 " + tr.from + " 转交给 " + tr.to + "（已确认接收）",
            author: tr.to,
          },
        });
      }
      await notify(
        [...approverNames, tr.from, tr.to, tr.by],
        accept
          ? "「" + tr.to + "」已接收客户「" + leadName(tr.lead_id) + "」"
          : "「" + tr.to + "」拒绝接收客户「" + leadName(tr.lead_id) + "」" + (tr.from === "未分配" ? "，客户仍为未分配" : "，客户仍在「" + tr.from + "」名下"),
        "lead",
        tr.lead_id
      );
    }
  }

  /* ---------- UI ---------- */
  var btnEl = null;
  var drawerEl = null;
  var lastSnapshot = "";
  var activeCat = "all";

  function el(tag, style, text) {
    var e = document.createElement(tag);
    if (style) e.style.cssText = style;
    if (text != null) e.textContent = text;
    return e;
  }

  function chip(cat, tag) {
    var c = COLORS[cat] || COLORS.done;
    return el(
      "span",
      "display:inline-block;padding:1px 8px;border-radius:999px;font-size:11px;font-weight:700;" +
        "background:" + c.bg + ";color:" + c.fg + ";border:1px solid " + c.border + ";margin-right:6px;flex-shrink:0;",
      "【" + tag + "】"
    );
  }

  function renderButton(bellBtn, count) {
    if (!btnEl) {
      btnEl = el(
        "button",
        "position:relative;display:inline-flex;align-items:center;gap:4px;height:32px;padding:0 12px;" +
          "border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:13px;font-weight:600;" +
          "color:#0f172a;cursor:pointer;margin-right:8px;",
        "待办"
      );
      btnEl.type = "button";
      btnEl.setAttribute("aria-label", "待办事项");
      btnEl.addEventListener("click", function () {
        toggleDrawer(true);
      });
      bellBtn.parentNode.insertBefore(btnEl, bellBtn);
    }
    var old = btnEl.querySelector("[data-todo-badge]");
    if (old) old.remove();
    if (count > 0) {
      var badge = el(
        "span",
        "position:absolute;right:-6px;top:-6px;min-width:20px;height:20px;padding:0 4px;display:grid;" +
          "place-items:center;border-radius:999px;background:#dc2626;color:#fff;font-size:11px;font-weight:700;",
        count > 99 ? "99+" : String(count)
      );
      badge.setAttribute("data-todo-badge", "1");
      btnEl.appendChild(badge);
    }
  }

  function toggleDrawer(open) {
    if (open) {
      if (drawerEl) return;
      renderDrawer();
    } else if (drawerEl) {
      drawerEl.remove();
      drawerEl = null;
    }
  }

  /* 跳转到对应栏目：点击左侧菜单，再按日期范围筛选并高亮对应条目 */
  function goTo(todo) {
    try { goToUnsafe(todo); } catch (e) { console.error("[待办跳转]", e); }
  }
  function goToUnsafe(todo) {
    toggleDrawer(false);
    if (typeof window.__adminGo === "function") {
      /* 使用系统内置跳转：按记录 id 打开栏目，预约会定位到具体日期并展开 */
      window.__adminGo(todo.nav, todo.goId || "");
      return;
    }
    setTimeout(function () {
      var candidates = document.querySelectorAll("nav a, nav button, aside a, aside button");
      for (var i = 0; i < candidates.length; i++) {
        var item = candidates[i];
        if ((item.textContent || "").replace(/\s/g, "").indexOf(todo.nav) >= 0) {
          item.click();
          break;
        }
      }
      setTimeout(function () { try {
        /* 预约页：先切到对应日期范围（今天/明天/一周内/一个月内） */
        if (todo.navRange) {
          var tabs = document.querySelectorAll("main button");
          for (var j = 0; j < tabs.length; j++) {
            if ((tabs[j].textContent || "").trim() === todo.navRange) {
              tabs[j].click();
              break;
            }
          }
        }
        /* 高亮包含目标姓名的条目 */
        if (todo.navName) {
          setTimeout(function () {
            var main = document.querySelector("main") || document.body;
            var all = main.querySelectorAll("button, li, tr, div");
            for (var k = all.length - 1; k >= 0; k--) {
              var node = all[k];
              if (
                node.children.length <= 4 &&
                (node.textContent || "").indexOf(todo.navName) >= 0 &&
                (node.textContent || "").length < 120
              ) {
                node.scrollIntoView({ block: "center", behavior: "smooth" });
                var prev = node.style.cssText;
                node.style.cssText += ";outline:2px solid #f59e0b;outline-offset:2px;border-radius:8px;";
                setTimeout(function () {
                  node.style.cssText = prev;
                }, 4000);
                break;
              }
            }
          }, 600);
        }
      } catch (e) { console.error("[待办跳转]", e); } }, 700);
    }, 150);
  }

  function renderDrawer() {
    var session = me();
    if (!session) return;
    var data = db();
    var todos = buildTodos(session, data);

    var overlay = el(
      "div",
      "position:fixed;inset:0;z-index:9998;background:rgba(15,23,42,0.35);"
    );
    overlay.addEventListener("click", function () { toggleDrawer(false); });

    var panel = el(
      "div",
      "position:fixed;top:0;right:0;bottom:0;width:380px;max-width:92vw;z-index:9999;background:#fff;" +
        "box-shadow:-8px 0 32px rgba(15,23,42,0.18);display:flex;flex-direction:column;"
    );

    var head = el(
      "div",
      "display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e2e8f0;"
    );
    head.appendChild(el("div", "font-size:15px;font-weight:700;color:#0f172a;", "待办事项（" + todos.length + "）"));
    var close = el("button", "border:none;background:none;font-size:18px;cursor:pointer;color:#64748b;", "✕");
    close.addEventListener("click", function () { toggleDrawer(false); });
    head.appendChild(close);
    panel.appendChild(head);

    /* 按颜色分类筛选 */
    var bar = el("div", "display:flex;flex-wrap:wrap;gap:6px;padding:10px 16px;border-bottom:1px solid #e2e8f0;");
    var cats = ["all", "transfer", "booking", "event", "account"];
    cats.forEach(function (cat) {
      var n = cat === "all" ? todos.length : todos.filter(function (t) { return t.cat === cat; }).length;
      if (cat !== "all" && n === 0) return;
      var c = COLORS[cat] || { bg: "#f1f5f9", fg: "#0f172a", border: "#cbd5e1", label: "全部" };
      var on = activeCat === cat;
      var f = el(
        "button",
        "font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer;" +
          "border:1px solid " + c.border + ";" +
          (on ? "background:" + c.fg + ";color:#fff;" : "background:" + c.bg + ";color:" + c.fg + ";"),
        (cat === "all" ? "全部" : c.label) + " " + n
      );
      f.type = "button";
      f.addEventListener("click", function () {
        activeCat = cat;
        toggleDrawer(false);
        toggleDrawer(true);
      });
      bar.appendChild(f);
    });
    panel.appendChild(bar);
    if (activeCat !== "all" && !todos.some(function (t) { return t.cat === activeCat; })) activeCat = "all";
    var shown = activeCat === "all" ? todos : todos.filter(function (t) { return t.cat === activeCat; });

    var body = el("div", "flex:1;overflow-y:auto;padding:12px 16px;");
    if (shown.length === 0) {
      body.appendChild(
        el("p", "text-align:center;color:#94a3b8;font-size:13px;padding:48px 0;", "暂无待办，所有事项都已处理完毕")
      );
    }
    shown.forEach(function (todo) {
      var card = el(
        "div",
        "cursor:pointer;border:1px solid " + (COLORS[todo.cat] || COLORS.done).border + ";border-radius:12px;" +
          "padding:12px;margin-bottom:10px;background:" + (COLORS[todo.cat] || COLORS.done).bg + ";"
      );
      var line = el("div", "display:flex;align-items:flex-start;gap:2px;");
      line.appendChild(chip(todo.cat, todo.tag));
      line.appendChild(el("span", "font-size:13px;line-height:1.6;color:#0f172a;", todo.text));
      card.appendChild(line);
      /* 点击卡片任意位置（按钮除外）跳到对应栏目和具体日期/记录 */
      card.addEventListener("click", function (ev) {
        if (ev.target.closest && ev.target.closest("button")) return;
        goTo(todo);
      });
      if ((todo.actions && todo.actions.length) || todo.nav) {
        var row = el("div", "display:flex;gap:8px;margin-top:10px;justify-content:flex-end;");
        if (todo.nav) {
          var navBtn = el(
            "button",
            "font-size:12px;font-weight:600;padding:5px 14px;border-radius:8px;cursor:pointer;" +
              "background:#fff;color:#1d4ed8;border:1px solid #93c5fd;",
            "前往" + todo.nav + " →"
          );
          navBtn.type = "button";
          navBtn.addEventListener("click", function () {
            goTo(todo);
          });
          row.appendChild(navBtn);
        }
        (todo.actions || []).forEach(function (action) {
          var b = el(
            "button",
            "font-size:12px;font-weight:600;padding:5px 14px;border-radius:8px;cursor:pointer;" +
              (action.primary
                ? "background:#1d4ed8;color:#fff;border:1px solid #1d4ed8;"
                : "background:#fff;color:#334155;border:1px solid #cbd5e1;"),
            action.label
          );
          b.type = "button";
          b.addEventListener("click", async function () {
            b.disabled = true;
            try {
              await runAction(session, action);
              if (action.kind === "dismiss") {
                toggleDrawer(false);
                refresh(true);
              } else {
                location.reload();
              }
            } catch (err) {
              alert(err && err.message ? err.message : "操作失败");
              b.disabled = false;
            }
          });
          row.appendChild(b);
        });
        card.appendChild(row);
      }
      body.appendChild(card);
    });
    panel.appendChild(body);

    drawerEl = el("div");
    drawerEl.appendChild(overlay);
    drawerEl.appendChild(panel);
    document.body.appendChild(drawerEl);
  }

  /* 铃铛消息着色：按文案类别加彩色标签 */
  var BELL_RULES = [
    { re: /转给|转交|分给|分配|接收/, cat: "transfer", tag: "客户" },
    { re: /预约|到校|到访/, cat: "booking", tag: "预约" },
    { re: /活动|开放日|宣讲/, cat: "event", tag: "活动" },
    { re: /驳回|拒绝|注册|待审/, cat: "account", tag: "审批" },
    { re: /通过|完成|同意/, cat: "done", tag: "办结" },
  ];

  function decorateBell() {
    var bellBtn = document.querySelector('button[aria-label^="消息"]');
    if (!bellBtn) return;
    var container = bellBtn.parentElement;
    if (!container) return;
    var items = container.querySelectorAll("li button:not([data-todo-tagged])");
    items.forEach(function (item) {
      item.setAttribute("data-todo-tagged", "1");
      var text = item.textContent || "";
      for (var i = 0; i < BELL_RULES.length; i++) {
        if (BELL_RULES[i].re.test(text)) {
          var c = COLORS[BELL_RULES[i].cat];
          var tag = el(
            "span",
            "display:inline-block;padding:0 6px;border-radius:999px;font-size:10px;font-weight:700;white-space:nowrap;" +
              "background:" + c.bg + ";color:" + c.fg + ";border:1px solid " + c.border + ";margin-right:4px;",
            BELL_RULES[i].tag
          );
          var target = item.querySelector("p span:last-child") || item.firstChild;
          if (target && target.parentNode) target.parentNode.insertBefore(tag, target);
          break;
        }
      }
    });
  }

  function refresh(force) {
    var session = me();
    var bellBtn = document.querySelector('button[aria-label^="消息"]');
    if (!session || !bellBtn) {
      if (btnEl) { btnEl.remove(); btnEl = null; }
      toggleDrawer(false);
      return;
    }
    var todos = buildTodos(session, db());
    var snapshot = JSON.stringify(todos.map(function (t) { return t.id; }));
    if (force || snapshot !== lastSnapshot) {
      lastSnapshot = snapshot;
      renderButton(bellBtn, todos.length);
      if (drawerEl) {
        toggleDrawer(false);
        renderDrawer();
      }
    }
    decorateBell();
  }

  var observer = new MutationObserver(function () { refresh(false); });
  function start() {
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(function () { refresh(false); }, POLL_MS);
    refresh(true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
