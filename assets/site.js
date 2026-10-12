/* johncalo.dev interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Nav ---------- */
  var nav = $(".nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  var menuBtn = $(".menu-btn");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$(".mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); } });

  var navLinks = $$(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "services", "work", "about", "contact"].forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });
  }

  /* ---------- Hero workflow (demo) ---------- */
  var FLOW = [
    { name: "Lead Captured", text: "A form, ad, chat or missed call creates the contact the moment it happens.", tech: "GoHighLevel forms · Webhooks" },
    { name: "AI Agent", text: "The agent replies in seconds and asks the first questions in plain language.", tech: "Claude / OpenAI · VAPI · Retell" },
    { name: "Qualification", text: "Answers are scored for fit and intent, so only ready buyers move forward.", tech: "Agent logic · Custom fields" },
    { name: "CRM Integration", text: "Fields, tags and pipeline stage are written to the CRM, no copy and paste.", tech: "GoHighLevel · HubSpot · REST APIs" },
    { name: "Automated Follow-Up", text: "SMS and email follow-ups run on the lead's stage until they book or opt out.", tech: "n8n · Make · Twilio" },
    { name: "Appointment Booked", text: "A slot is booked on the live calendar and confirmations and reminders go out.", tech: "GoHighLevel calendars" }
  ];
  var flowEl = $("#flow");
  if (flowEl) {
    var nodes = $$(".node", flowEl), svg = $(".flow-svg", flowEl), paths = [];
    var insp = { step: $("#insp-step"), name: $("#insp-name"), text: $("#insp-text"), tech: $("#insp-tech") };
    var cur = 0, timer = null, paused = reduce;
    var pauseBtn = $("#flow-pause");

    var draw = function () {
      if (!svg || getComputedStyle(svg).display === "none") return;
      var box = flowEl.getBoundingClientRect();
      svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
      svg.innerHTML = "";
      paths = [];
      for (var i = 0; i < nodes.length - 1; i++) {
        var a = nodes[i].getBoundingClientRect(), b = nodes[i + 1].getBoundingClientRect();
        var ax, ay, bx, by, d;
        if (Math.abs(a.top - b.top) < 4) {
          var ltr = b.left > a.left;
          ax = (ltr ? a.right : a.left) - box.left; ay = a.top + a.height / 2 - box.top;
          bx = (ltr ? b.left : b.right) - box.left; by = b.top + b.height / 2 - box.top;
          d = "M" + ax + " " + ay + " L" + bx + " " + by;
        } else {
          ax = a.left + a.width / 2 - box.left; ay = a.bottom - box.top;
          bx = b.left + b.width / 2 - box.left; by = b.top - box.top;
          var my = (ay + by) / 2;
          d = "M" + ax + " " + ay + " C" + ax + " " + my + " " + bx + " " + my + " " + bx + " " + by;
        }
        var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", d); svg.appendChild(p); paths.push(p);
      }
      paint();
    };
    var paint = function () {
      nodes.forEach(function (n, i) {
        n.classList.toggle("is-active", i === cur);
        n.classList.toggle("is-done", i < cur);
        n.setAttribute("aria-pressed", String(i === cur));
        $(".node-st", n).textContent = i === cur ? "Running" : i < cur ? "Done" : "Queued";
      });
      paths.forEach(function (p, i) { p.classList.toggle("is-lit", i === cur - 1); });
      var f = FLOW[cur];
      insp.step.textContent = "Step " + (cur + 1) + " of " + FLOW.length;
      insp.name.textContent = f.name; insp.text.textContent = f.text; insp.tech.textContent = f.tech;
    };
    var go = function (i) { cur = (i + FLOW.length) % FLOW.length; paint(); };
    var tick = function () { go(cur + 1); };
    var start = function () { stop(); if (!paused) timer = setInterval(tick, 2400); };
    var stop = function () { if (timer) clearInterval(timer); timer = null; };
    var setPaused = function (v) { paused = v; pauseBtn.textContent = v ? "Play" : "Pause"; pauseBtn.setAttribute("aria-pressed", String(v)); v ? stop() : start(); };

    nodes.forEach(function (n, i) {
      n.addEventListener("click", function () { go(i); setPaused(true); });
      n.addEventListener("mouseenter", function () { stop(); go(i); });
      n.addEventListener("mouseleave", function () { if (!paused) start(); });
      n.addEventListener("focus", function () { stop(); go(i); });
    });
    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    setPaused(reduce);
    draw();
    window.addEventListener("resize", function () { requestAnimationFrame(draw); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (!paused) start(); } else stop(); }); }).observe(flowEl);
    }
  }

  /* ---------- Generic tablist helper (arrow keys) ---------- */
  var tablist = function (list, tabs, select) {
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % tabs.length;
        if (k === "ArrowLeft" || k === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
        if (k === "Home") n = 0; if (k === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n); tabs[n].focus(); }
      });
    });
  };

  /* ---------- Case study tabs ---------- */
  $$(".case").forEach(function (c) {
    var tabs = $$(".tab", c), panels = $$(".panel", c);
    var select = function (i) {
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = i !== j; });
    };
    tablist($(".tabs", c), tabs, select);
    select(0);
  });

  /* ---------- Screenshot switcher (voice case) ---------- */
  $$(".shot-switch").forEach(function (sw) {
    var media = sw.closest(".case-media"), img = $(".browser-shot img", media), url = $(".browser-url", media), note = $(".media-note", media);
    $$("button", sw).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", sw).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        img.src = b.dataset.src; img.alt = b.dataset.alt; url.textContent = b.dataset.url;
        if (note && b.dataset.note) note.textContent = b.dataset.note;
      });
    });
  });

  /* ---------- Work filters ---------- */
  var filters = $$(".filter"), cards = $$(".work-card");
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      var cat = f.dataset.filter;
      filters.forEach(function (x) { x.setAttribute("aria-pressed", String(x === f)); });
      cards.forEach(function (c) { c.hidden = cat !== "all" && c.dataset.cat.split(" ").indexOf(cat) === -1; });
    });
  });

  /* ---------- Interactive automation demo ---------- */
  var STEPS = [
    { name: "Incoming Lead", text: "A new lead fills in a form on a Facebook ad. A webhook fires and the contact is created in the CRM before anyone on the team sees it.",
      tech: ["Lead form", "Webhook", "GoHighLevel"],
      rec: { status: "New", fit: "Not scored yet", tags: "new-lead", next: "AI first reply" } },
    { name: "AI Analysis", text: "The AI agent reads the message, works out which service the lead wants and how urgent it is, then replies by SMS within seconds.",
      tech: ["Claude / OpenAI", "Prompted agent", "SMS"],
      rec: { status: "Contacted", fit: "Intent: wants a quote", tags: "new-lead, ai-engaged", next: "Ask qualifying questions" } },
    { name: "Qualification", text: "The agent asks the qualifying questions one at a time and checks the answers against the business's rules for a good fit.",
      tech: ["Agent logic", "Custom fields"],
      rec: { status: "Qualifying", fit: "Fit confirmed: budget and timeline", tags: "ai-engaged, qualified", next: "Update CRM" } },
    { name: "CRM Update", text: "Every answer is written to custom fields, tags are applied and the opportunity moves to the right pipeline stage, with the team notified.",
      tech: ["GoHighLevel API", "Pipelines", "Notifications"],
      rec: { status: "Qualified · pipeline stage moved", fit: "Fit confirmed: budget and timeline", tags: "qualified, sales-ready", next: "Send booking link" } },
    { name: "Follow-Up", text: "If the lead goes quiet, an automated SMS and email sequence follows up on a schedule and stops the moment they reply or book.",
      tech: ["n8n / Make", "Twilio", "Email"],
      rec: { status: "Follow-up running", fit: "Fit confirmed: budget and timeline", tags: "sales-ready, nurture", next: "Wait for booking" } },
    { name: "Booking", text: "The lead picks a time from the live calendar. The appointment is created, confirmations go out and reminders are queued before the call.",
      tech: ["Calendar", "Confirmations", "Reminders"],
      rec: { status: "Booked", fit: "Fit confirmed: budget and timeline", tags: "sales-ready, booked", next: "Call on the calendar, reminders queued" } }
  ];
  var demo = $("#demo-steps");
  if (demo) {
    var steps = $$(".step", demo), bar = $(".bar", demo);
    var dT = $("#step-title"), dX = $("#step-text"), dTech = $("#step-tech"), dCount = $("#step-count");
    var recEls = { status: $("#rec-status"), fit: $("#rec-fit"), tags: $("#rec-tags"), next: $("#rec-next") };
    var at = 0;
    var selectStep = function (i) {
      at = i;
      steps.forEach(function (s, j) {
        s.setAttribute("aria-selected", String(j === i)); s.tabIndex = j === i ? 0 : -1;
        s.classList.toggle("is-done", j < i);
      });
      if (bar) bar.style.width = (88 * i / (steps.length - 1)) + "%";
      var st = STEPS[i];
      dT.textContent = st.name; dX.textContent = st.text;
      dTech.innerHTML = st.tech.map(function (t) { return '<span class="chip">' + t + "</span>"; }).join("");
      dCount.textContent = "Step " + (i + 1) + " of " + STEPS.length;
      Object.keys(recEls).forEach(function (k) {
        var el = recEls[k], v = st.rec[k];
        if (el.textContent !== v) { el.textContent = v; el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); setTimeout(function () { el.classList.remove("flash"); }, 900); }
      });
    };
    tablist(demo, steps, selectStep);
    $("#step-prev").addEventListener("click", function () { selectStep((at - 1 + steps.length) % steps.length); });
    $("#step-next").addEventListener("click", function () { selectStep((at + 1) % steps.length); });
    selectStep(0);
  }

  /* ---------- Video testimonials: load the player on click ---------- */
  $$(".video-play").forEach(function (b) {
    b.addEventListener("click", function () {
      var frame = b.parentElement, id = b.dataset.id, kind = b.dataset.kind;
      var src = kind === "youtube" ? "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0" : "https://drive.google.com/file/d/" + id + "/preview";
      var f = document.createElement("iframe");
      f.src = src; f.title = b.getAttribute("aria-label"); f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
      frame.innerHTML = ""; frame.appendChild(f);
    });
  });
  var vids = $(".videos");
  $$("[data-scroll]").forEach(function (b) {
    b.addEventListener("click", function () { vids.scrollBy({ left: (b.dataset.scroll === "next" ? 1 : -1) * Math.min(vids.clientWidth * 0.9, 640), behavior: reduce ? "auto" : "smooth" }); });
  });

  /* ---------- WhatsApp contact button opens the existing widget ---------- */
  $$("[data-open-whatsapp]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      var launch = document.querySelector("#jc-wa .jcw-launch");
      if (launch) { e.preventDefault(); e.stopPropagation(); if (!document.querySelector("#jc-wa.is-open")) launch.click(); }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var rev = $$(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    rev.forEach(function (el) { ro.observe(el); });
  } else rev.forEach(function (el) { el.classList.add("is-in"); });

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
