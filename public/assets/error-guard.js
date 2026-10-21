/* 报错兜底：记录真实错误原因，并在“This page didn't load”页面上提供恢复按钮 */
(function () {
  var last = [];
  function record(kind, err) {
    var msg = err && (err.stack || err.message) ? err.stack || err.message : String(err);
    last.push(kind + ": " + msg);
    if (last.length > 5) last.shift();
    try { console.error("[页面报错记录]", kind, msg); } catch (e) {}
  }
  window.addEventListener("error", function (e) { record("error", e.error || e.message); });
  window.addEventListener("unhandledrejection", function (e) { record("promise", e.reason); });
  var origError = console.error;
  console.error = function () {
    try {
      for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        if (a instanceof Error) { last.push("console: " + (a.stack || a.message)); if (last.length > 5) last.shift(); }
      }
    } catch (e) {}
    return origError.apply(console, arguments);
  };

  function recover() {
    try {
      var drop = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("nav-seen-") >= 0) drop.push(k);
      }
      drop.forEach(function (k) { localStorage.removeItem(k); });
      var dropS = [];
      for (var j = 0; j < sessionStorage.length; j++) {
        var s = sessionStorage.key(j);
        if (s && (s.indexOf("nav-open-") >= 0 || s.indexOf("tsr-scroll-restoration") >= 0)) dropS.push(s);
      }
      dropS.forEach(function (k) { sessionStorage.removeItem(k); });
    } catch (e) {}
    location.href = location.pathname + location.search;
  }

  function check() {
    var h = document.querySelector("h1");
    if (!h || (h.textContent || "").indexOf("didn't load") < 0 || h.getAttribute("data-guarded")) return;
    h.setAttribute("data-guarded", "1");
    console.error("[页面报错记录] 出现报错页，最近错误：\n" + (last.join("\n---\n") || "（未捕获到具体错误）"));
    var box = document.createElement("div");
    box.style.cssText = "margin-top:16px;display:flex;flex-direction:column;align-items:center;gap:8px;";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "恢复页面（保留登录和数据）";
    btn.style.cssText = "padding:8px 18px;border-radius:8px;border:none;background:#1e3a8a;color:#fff;font-weight:600;cursor:pointer;";
    btn.addEventListener("click", recover);
    box.appendChild(btn);
    if (last.length) {
      var pre = document.createElement("pre");
      pre.textContent = last[last.length - 1].slice(0, 400);
      pre.style.cssText = "max-width:520px;white-space:pre-wrap;font-size:11px;color:#64748b;text-align:left;";
      box.appendChild(pre);
    }
    h.parentNode.appendChild(box);
  }
  new MutationObserver(check).observe(document.documentElement, { childList: true, subtree: true });
})();
