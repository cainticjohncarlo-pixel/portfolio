/* WhatsApp chat widget: personal click-to-chat, no CRM.
   Messages open WhatsApp and go straight to John Carlo's own number.
   Edit the settings block only. */
(function () {
  /* ---------------- settings ---------------- */
  var WA_NUMBER  = "639512420940";                 /* country code + number, digits only */
  var SITE       = "johncalo.dev";
  var NAME       = "John Carlo Caintic";
  var STATUS     = "Typically replies within a few hours";
  var AVATAR     = "/assets/wa-avatar.jpg";
  var GREETING   = "Hi there, I'm John Carlo. Thanks for checking out my work. Tell me a little about your project and I'll get back to you personally.";
  var PAGE_MESSAGES = {
    "/projects/chat-agents":      "Hi John Carlo, I saw your AI chatbot samples on " + SITE + " and want to talk about a project.",
    "/projects/voice-agents":     "Hi John Carlo, I saw your AI voice agent samples on " + SITE + " and want to talk about a project.",
    "/projects/ai-automations":   "Hi John Carlo, I saw your automation and workflow builds on " + SITE + " and want to talk about a project.",
    "/projects/websites-funnels": "Hi John Carlo, I saw your websites and funnels on " + SITE + " and want to talk about a project.",
    "/projects/claude-code":      "Hi John Carlo, I saw your Claude Code builds on " + SITE + " and want to talk about a project.",
    "/book":                      "Hi John Carlo, I'd like to book a call about a project."
  };
  var DEFAULT_MESSAGE = "Hi John Carlo, I saw your portfolio on " + SITE + " and want to talk about a project.";
  /* ------------------------------------------ */

  if (!WA_NUMBER || document.getElementById("jc-wa")) return;

  var path = location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
  var pageMsg = PAGE_MESSAGES[path] || DEFAULT_MESSAGE;
  var hasGhlBubble = !!document.querySelector('script[src*="leadconnectorhq.com/loader.js"]');

  var ICON = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9.03 3 3.33 8.7 3.33 15.7c0 2.24.59 4.43 1.7 6.36L3.2 28.8l6.92-1.8a12.67 12.67 0 0 0 5.92 1.5h.01c7 0 12.71-5.7 12.71-12.7 0-3.4-1.32-6.59-3.72-8.99A12.62 12.62 0 0 0 16.04 3Zm0 23.36h-.01a10.55 10.55 0 0 1-5.37-1.47l-.39-.23-4.1 1.07 1.1-4-.25-.41a10.52 10.52 0 0 1-1.62-5.62c0-5.82 4.74-10.56 10.57-10.56 2.82 0 5.47 1.1 7.46 3.1a10.48 10.48 0 0 1 3.09 7.47c0 5.82-4.74 10.56-10.48 10.56Zm5.79-7.9c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z"/></svg>';

  /* !important on layout rules: the sites' shared CSS sets position:relative on direct body children */
  var css = [
    "#jc-wa{position:fixed!important;right:24px!important;bottom:24px!important;left:auto!important;top:auto!important;z-index:2147483000!important;",
    "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.4}",
    "#jc-wa.jc-wa--beside{right:100px!important}",
    "#jc-wa *{box-sizing:border-box}",
    "#jc-wa .jcw-launch{position:relative;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;padding:0;",
    "background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;margin-left:auto;",
    "box-shadow:0 10px 28px rgba(0,0,0,.32);transition:transform .2s ease,background .2s ease}",
    "#jc-wa .jcw-launch:hover{transform:scale(1.06);background:#1EBE5A}",
    "#jc-wa .jcw-launch:focus-visible,#jc-wa button:focus-visible,#jc-wa textarea:focus-visible{outline:3px solid #9AF0BE;outline-offset:2px}",
    "#jc-wa .jcw-launch svg{width:32px;height:32px}",
    "#jc-wa .jcw-launch .jcw-x{display:none;font-size:26px;line-height:1;font-weight:300}",
    "#jc-wa.is-open .jcw-launch svg{display:none}#jc-wa.is-open .jcw-launch .jcw-x{display:block}",
    "#jc-wa .jcw-dot{position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:#EF4444;border:2px solid #fff}",
    "#jc-wa.is-seen .jcw-dot{display:none}",
    "#jc-wa .jcw-panel{position:absolute;right:0;bottom:76px;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:18px;overflow:hidden;",
    "box-shadow:0 24px 60px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.12);opacity:0;transform:translateY(12px) scale(.98);transform-origin:bottom right;",
    "pointer-events:none;visibility:hidden;transition:opacity .2s ease,transform .2s ease,visibility 0s linear .2s}",
    "#jc-wa.is-open .jcw-panel{opacity:1;transform:none;pointer-events:auto;visibility:visible;transition:opacity .2s ease,transform .2s ease}",
    "#jc-wa .jcw-head{display:flex;align-items:center;gap:12px;padding:16px 16px 14px;background:#075E54;color:#fff}",
    "#jc-wa .jcw-ava{position:relative;flex:none;width:46px;height:46px}",
    "#jc-wa .jcw-ava img{width:46px;height:46px;border-radius:50%;object-fit:cover;display:block;border:2px solid rgba(255,255,255,.85)}",
    "#jc-wa .jcw-ava i{position:absolute;right:0;bottom:1px;width:12px;height:12px;border-radius:50%;background:#25D366;border:2px solid #075E54}",
    "#jc-wa .jcw-who{flex:1;min-width:0}",
    "#jc-wa .jcw-name{font-size:16px;font-weight:600;margin:0;color:#fff}",
    "#jc-wa .jcw-status{font-size:12.5px;margin:2px 0 0;color:rgba(255,255,255,.82)}",
    "#jc-wa .jcw-close{flex:none;width:32px;height:32px;border-radius:50%;border:none;background:transparent;color:#fff;font-size:22px;line-height:1;cursor:pointer;opacity:.85}",
    "#jc-wa .jcw-close:hover{background:rgba(255,255,255,.14);opacity:1}",
    "#jc-wa .jcw-body{padding:20px 16px 18px;background:#EFEAE2;",
    "background-image:radial-gradient(rgba(0,0,0,.035) 1px,transparent 1px);background-size:14px 14px;min-height:140px}",
    "#jc-wa .jcw-bubble{position:relative;max-width:88%;background:#fff;color:#111B21;border-radius:0 12px 12px 12px;padding:10px 12px 22px;",
    "font-size:14.5px;box-shadow:0 1px 1px rgba(0,0,0,.08)}",
    "#jc-wa .jcw-bubble:before{content:'';position:absolute;left:-8px;top:0;border-top:10px solid #fff;border-left:8px solid transparent}",
    "#jc-wa .jcw-bubble b{display:block;font-size:13px;color:#075E54;margin-bottom:3px}",
    "#jc-wa .jcw-time{position:absolute;right:10px;bottom:5px;font-size:11px;color:#667781}",
    "#jc-wa .jcw-foot{padding:14px 16px 12px;background:#fff}",
    "#jc-wa textarea{width:100%;min-height:64px;max-height:140px;resize:vertical;border:1px solid #D9DEE2;border-radius:12px;padding:10px 12px;",
    "font:inherit;font-size:14.5px;color:#111B21;background:#F8FAFB;margin:0 0 10px;display:block}",
    "#jc-wa textarea:focus{border-color:#25D366;background:#fff;outline:none}",
    "#jc-wa .jcw-send{width:100%;height:48px;border:none;border-radius:999px;background:#25D366;color:#fff;cursor:pointer;",
    "font:inherit;font-size:16px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;transition:background .2s ease}",
    "#jc-wa .jcw-send:hover{background:#1EBE5A}",
    "#jc-wa .jcw-send svg{width:20px;height:20px}",
    "#jc-wa .jcw-note{text-align:center;font-size:11.5px;color:#667781;margin:9px 0 0}",
    "@media (max-width:640px){#jc-wa{right:16px!important;bottom:16px!important}#jc-wa.jc-wa--beside{right:88px!important}",
    "#jc-wa .jcw-panel{position:fixed;right:12px;left:12px;bottom:88px;width:auto;max-width:none}}",
    "@media (prefers-reduced-motion:reduce){#jc-wa .jcw-panel,#jc-wa .jcw-launch{transition:none}}",
    "@media print{#jc-wa{display:none!important}}"
  ].join("");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function nowTime() { try { return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } }

  function build() {
    var style = document.createElement("style");
    style.id = "jc-wa-style";
    style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.id = "jc-wa";
    if (hasGhlBubble) root.className = "jc-wa--beside";   /* sit to the left of the GoHighLevel bubble */
    try { if (sessionStorage.getItem("jc-wa-seen")) root.classList.add("is-seen"); } catch (e) {}

    root.innerHTML =
      '<div class="jcw-panel" role="dialog" aria-modal="false" aria-labelledby="jcw-name" id="jcw-panel">' +
        '<div class="jcw-head">' +
          '<div class="jcw-ava"><img src="' + esc(AVATAR) + '" alt="' + esc(NAME) + '" width="46" height="46"><i aria-hidden="true"></i></div>' +
          '<div class="jcw-who"><p class="jcw-name" id="jcw-name">' + esc(NAME) + '</p><p class="jcw-status">' + esc(STATUS) + '</p></div>' +
          '<button type="button" class="jcw-close" aria-label="Close WhatsApp chat">&times;</button>' +
        '</div>' +
        '<div class="jcw-body"><div class="jcw-bubble"><b>' + esc(NAME.split(" ").slice(0, 2).join(" ")) + '</b>' + esc(GREETING) + '<span class="jcw-time">' + esc(nowTime()) + '</span></div></div>' +
        '<div class="jcw-foot">' +
          '<label for="jcw-msg" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Your message</label>' +
          '<textarea id="jcw-msg" rows="3" placeholder="Type your message"></textarea>' +
          '<button type="button" class="jcw-send">' + ICON + '<span>Send a message</span></button>' +
          '<p class="jcw-note">Opens WhatsApp and goes straight to my phone</p>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="jcw-launch" aria-label="Chat with John Carlo on WhatsApp" aria-expanded="false" aria-controls="jcw-panel">' +
        ICON + '<span class="jcw-x" aria-hidden="true">&times;</span><span class="jcw-dot" aria-hidden="true"></span>' +
      '</button>';

    document.body.appendChild(root);

    var launch = root.querySelector(".jcw-launch");
    var closeBtn = root.querySelector(".jcw-close");
    var send = root.querySelector(".jcw-send");
    var box = root.querySelector("#jcw-msg");
    box.value = pageMsg;

    function open() {
      root.classList.add("is-open", "is-seen");
      launch.setAttribute("aria-expanded", "true");
      try { sessionStorage.setItem("jc-wa-seen", "1"); } catch (e) {}
      setTimeout(function () { box.focus(); box.setSelectionRange(box.value.length, box.value.length); }, 120);
    }
    function close() {
      root.classList.remove("is-open");
      launch.setAttribute("aria-expanded", "false");
    }
    function go() {
      var text = (box.value || "").trim() || pageMsg;
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    }

    launch.addEventListener("click", function () { root.classList.contains("is-open") ? close() : open(); });
    closeBtn.addEventListener("click", function () { close(); launch.focus(); });
    send.addEventListener("click", go);
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); go(); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("is-open")) { close(); launch.focus(); } });
    document.addEventListener("click", function (e) { if (root.classList.contains("is-open") && !root.contains(e.target)) close(); });
  }

  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
