/* Patch-bay board for the homepage, plus the release ruler in write-up 03.
   No dependencies. Safe to load on pages without the board. */
(function(){
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function el(name, attrs, parent){
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // Tools. u = position along the rail (desktop px). Row A is the top rail on desktop, the left rail on phones.
  // slots = jack order along the rail; null leaves a jack empty so loops have room.
  var NODES = {
    wordpress:{label:"WordPress",   row:"A", u:64,  slots:["02"]},
    calendly:{label:"Calendly",     row:"A", u:194, slots:["10"]},
    whmcs:   {label:"WHMCS",        row:"A", u:310, slots:["04w"]},
    intercom:{label:"Intercom",     row:"A", u:440, slots:["04w","10","01","04a","05a",null,null,null,"05b","03i"]},
    chrome:  {label:"Chrome",       row:"A", u:670, slots:["03i","03a","03c",null,"08a",null,null,null,"08b"]},
    cloudways:{label:"Cloudways",   row:"B", u:74,  slots:["02"]},
    gchat:   {label:"Google Chat",  row:"B", u:222, slots:["01g"]},
    asana:   {label:"Asana",        row:"B", u:366, slots:["01a","04a","03a","06"]},
    claude:  {label:"Claude Code",  row:"B", u:550, slots:["06",null,"03c","07"]},
    gdrive:  {label:"Google Drive", row:"B", u:740, slots:["07",null,"09a",null,null,null,"09b"]}
  };

  // Each wire is one project. Depths are fractions of the gap between the rails.
  // href: a write-up page (relative), or a row in the project table on this page.
  var WIRES = [
    {id:"01", title:"AI escalation detector", route:"Intercom → Asana, Google Chat", kind:"IT services",
     segs:[{t:"split", from:["intercom","01"], to:[["gchat","01g"],["asana","01a"]], at:[282,.56], h:.3, k:.22}],
     text:"Checks incoming support conversations for escalations and sorts them into six kinds, from cancellations and refunds to legal threats. It started as two Zaps in Oct 2025 and is now a Python service on Cloud Run, with shadow mode and an eval harness.",
     facts:[["~62","AI verdicts a week"],["988","automated tests"],["25 Jun 2026","live since"]], href:"work/escalation-detector.html"},
    {id:"02", title:"Website migrations and builds", route:"WordPress → Cloudways, Cloudflare", kind:"IT services",
     segs:[{t:"cross", a:["wordpress","02"], b:["cloudways","02"], h1:.45, h2:.45}],
     text:"Did WordPress migrations and a cutover on Cloudways, with colleagues, and built two new sites where there was nothing to move. Two moves went live. Two clinic sites stopped at staging when the client withdrew.",
     facts:[["2 of 12","DNS records changed at one cutover"],["48,050","files restored by hand"],["156","tests in a migration skill, PR still open"]], href:"work/website-migrations.html"},
    {id:"03", title:"Staff Chrome side panel", route:"Chrome → Intercom, Asana, Claude Code", kind:"IT services",
     segs:[{t:"row", a:["intercom","03i"], b:["chrome","03i"], s:.16},
           {t:"cross", a:["chrome","03a"], b:["asana","03a"], h1:.5, h2:.42},
           {t:"cross", a:["chrome","03c"], b:["claude","03c"], h1:.4, h2:.4}],
     text:"Calendar, customer lookup, an Asana card with a timer, and Intercom tickets in one panel. A Claude Code auto-timer drives the real Asana timer from hooks.",
     facts:[["v0.3.1 → v0.3.56","while I owned it"],["218/218","end-to-end tests"]], href:"work/chrome-side-panel.html"},
    {id:"04", title:"Intercom integration suite", route:"Intercom → WHMCS, Asana", kind:"IT services",
     segs:[{t:"row", a:["whmcs","04w"], b:["intercom","04w"], s:.2},
           {t:"cross", a:["intercom","04a"], b:["asana","04a"], h1:.55, h2:.35}],
     text:"A billing sidebar and an Asana sidebar inside Intercom, plus a service that adds each contact's email domain.",
     facts:[["10","people on the support team"],["Near zero","running cost on Cloud Run"]], href:"work/intercom-integrations.html"},
    {id:"05", title:"Email routing cleanup", route:"Email → Intercom", kind:"IT services",
     segs:[{t:"loop", node:"intercom", a:"05a", b:"05b", s:.15}],
     text:"Alerts were landing on people. I simulated rules against real traffic first and rejected one that would have spam-tagged 51 real emails.",
     facts:[["99 → 37","emails reaching people"],["14/14","alerts routed right after go-live"]], href:"work/email-routing.html"},
    {id:"06", title:"Automating my own job", route:"Claude Code → Asana", kind:"IT services",
     segs:[{t:"row", a:["asana","06"], b:["claude","06"], s:.2}],
     text:"Skills for my sprint check, session wrap-up, time log, Friday status and quarterly goal update. Read-only by default, drafts only, read back every write.",
     facts:[["6,133","minutes logged in 77 entries"]], href:"work/automating-my-job.html"},
    {id:"07", title:"claude-sync", route:"Claude Code → Google Drive", kind:"Personal",
     segs:[{t:"row", a:["claude","07"], b:["gdrive","07"], s:.22}],
     text:"A VS Code extension that syncs Claude Code sessions, skills and settings across devices through each user's own Google Drive.",
     facts:[["v2.5.4",""],["47","tests"]], href:"work/claude-sync.html"},
    {id:"08", title:"Video Downloader v2", route:"Chrome", kind:"Personal",
     segs:[{t:"loop", node:"chrome", a:"08a", b:"08b", s:.15}],
     text:"A Chrome extension that saves HLS/DASH streams as real MP4s, with its own demuxer and muxer.",
     facts:[["~5.6k","lines of JS"]], href:"work/video-downloader.html"},
    {id:"09", title:"AI document filing pipeline", route:"Google Drive", kind:"Client",
     segs:[{t:"loop", node:"gdrive", a:"09a", b:"09b", s:.15}],
     text:"I took over an existing document-AI project for a client and rebuilt it: batch processing for long PDFs, an Apps Script web app and Gemini extraction that names and files each document.",
     facts:[["2025 to 2026",""]], href:"#p-09"},
    {id:"10", title:"Intercom + Calendly booking app", route:"Intercom → Calendly", kind:"IT services",
     segs:[{t:"row", a:["calendly","10"], b:["intercom","10"], s:.38}],
     text:"A booking app that connects Intercom and Calendly.",
     facts:[["Jul 2026","went live"]], href:"#p-10"}
  ];

  // Two drawings of the same board. Desktop: rails run across. Phone: rails run down, cords cross sideways.
  var LAYOUTS = {
    wide:{vw:840, vh:500, A:76, B:430, gap:14, uf:function(u){ return u; }, swap:false, railFrom:14, railTo:826},
    tall:{vw:370, vh:590, A:116, B:254, gap:12, uf:function(u){ return 34 + u*.66; }, swap:true, railFrom:22, railTo:568}
  };

  var board = document.getElementById("board");
  if (board) initBoard();
  initRuler();

  function initBoard(){
    var mq = window.matchMedia("(max-width: 760px)");
    var wiresById = {}, nodeEls = {}, groups = {}, buttons = {}, order = [];
    var selected = "01", timer = null, L = null;
    WIRES.forEach(function(w){ wiresById[w.id] = w; order.push(w.id); });

    function draw(){
      L = mq.matches ? LAYOUTS.tall : LAYOUTS.wide;
      var D = L.B - L.A;
      while (board.firstChild) board.removeChild(board.firstChild);
      board.setAttribute("viewBox", "0 0 "+L.vw+" "+L.vh);

      function P(u, v){ var p = L.swap ? [v, u] : [u, v]; return p[0].toFixed(1)+","+p[1].toFixed(1); }
      function rv(row){ return row === "A" ? L.A : L.B; }

      var gRails = el("g",{"aria-hidden":"true"},board), gWires = el("g",{},board),
          gTop = el("g",{"class":"live","pointer-events":"none","aria-hidden":"true"},board),
          gJacks = el("g",{"aria-hidden":"true"},board), gNodes = el("g",{"aria-hidden":"true"},board);
      gTop.id = "board-top";

      function lineAttrs(v, cls){
        return L.swap ? {x1:v, y1:L.railFrom, x2:v, y2:L.railTo, "class":cls}
                      : {x1:L.railFrom, y1:v, x2:L.railTo, y2:v, "class":cls};
      }
      [[L.A, 1], [L.B, -1]].forEach(function(r){
        el("line", lineAttrs(r[0], "rail"), gRails);
        el("line", lineAttrs(r[0] + r[1]*7, "rail-2"), gRails);
      });

      // jack positions
      var jack = {};
      Object.keys(NODES).forEach(function(k){
        var n = NODES[k], c = L.uf(n.u), m = n.slots.length;
        n.slots.forEach(function(s, i){
          if (!s) return;
          jack[k+":"+s] = c + (i - (m-1)/2) * L.gap;
        });
      });

      function row(a, b, s){
        var ua = jack[a[0]+":"+a[1]], ub = jack[b[0]+":"+b[1]], r = NODES[a[0]].row, v = rv(r), d = r === "A" ? 1 : -1;
        return "M"+P(ua,v)+" C"+P(ua, v+d*s*D)+" "+P(ub, v+d*s*D)+" "+P(ub,v);
      }
      function cross(a, b, h1, h2){
        var ua = jack[a[0]+":"+a[1]], ub = jack[b[0]+":"+b[1]];
        return "M"+P(ua,L.A)+" C"+P(ua, L.A+h1*D)+" "+P(ub, L.B-h2*D)+" "+P(ub,L.B);
      }
      function loop(node, a, b, s){
        var u1 = jack[node+":"+a], u2 = jack[node+":"+b], r = NODES[node].row, v = rv(r), d = r === "A" ? 1 : -1, e = (u2-u1)*.42;
        var depth = Math.max(s*D, 34);
        return "M"+P(u1,v)+" C"+P(u1-e, v+d*depth)+" "+P(u2+e, v+d*depth)+" "+P(u2,v);
      }

      Object.keys(groups).forEach(function(k){ delete groups[k]; });
      WIRES.forEach(function(w){
        var g = el("g",{"class":"wire","data-id":w.id,tabindex:w.id === selected ? "0" : "-1",role:"button",
          "aria-pressed":w.id === selected ? "true" : "false","aria-controls":"readout",
          "aria-label":w.id+" "+w.title+", "+w.route},gWires);
        var knot = null;
        w.segs.forEach(function(s){
          var ds = [];
          if (s.t === "row") ds.push(row(s.a, s.b, s.s));
          else if (s.t === "cross") ds.push(cross(s.a, s.b, s.h1, s.h2));
          else if (s.t === "loop") ds.push(loop(s.node, s.a, s.b, s.s));
          else if (s.t === "split"){
            var uI = jack[s.from[0]+":"+s.from[1]], us = L.uf(s.at[0]), vs = L.A + s.at[1]*D;
            ds.push("M"+P(uI,L.A)+" C"+P(uI, L.A+s.h*D)+" "+P(us, vs-s.k*D)+" "+P(us,vs));
            s.to.forEach(function(t){
              var ut = jack[t[0]+":"+t[1]];
              ds.push("M"+P(us,vs)+" C"+P(us, vs+s.k*D)+" "+P(ut, L.B-.3*D)+" "+P(ut,L.B));
            });
            var kp = P(us,vs).split(",");
            knot = {cx:kp[0], cy:kp[1]};
          }
          ds.forEach(function(d){ el("path",{d:d,"class":"cord"},g); });
          ds.forEach(function(d){ el("path",{d:d,"class":"hit"},g); });
        });
        if (knot) el("circle",{cx:knot.cx, cy:knot.cy, r:3.2, "class":"knot"},g);

        g.addEventListener("pointerenter", function(){ heat(w.id); clearTimeout(timer); timer = setTimeout(function(){ select(w.id); }, 120); });
        g.addEventListener("pointerleave", function(){ clearTimeout(timer); cool(); });
        g.addEventListener("click", function(){ clearTimeout(timer); select(w.id); reveal(); });
        g.addEventListener("focus", function(){ select(w.id); heat(w.id); board.classList.toggle("kbd", focusVisible(g)); });
        g.addEventListener("blur", function(){ board.classList.remove("kbd"); cool(); });
        g.addEventListener("keydown", function(e){ keys(e, w.id, groups); });
        groups[w.id] = g;
      });

      // jacks and plugs
      Object.keys(jack).forEach(function(key){
        var node = key.split(":")[0], slot = key.split(":")[1], c = P(jack[key], rv(NODES[node].row)).split(",");
        el("circle",{cx:c[0], cy:c[1], r:5.5, "class":"jack"},gJacks);
        el("circle",{cx:c[0], cy:c[1], r:2.4, "class":"plug", "data-w":slot.slice(0,2)},gJacks);
      });

      // tool names
      Object.keys(NODES).forEach(function(k){
        var n = NODES[k], g = el("g",{"class":"node"},gNodes), c = L.uf(n.u), t;
        if (!L.swap){
          t = el("text",{x:c, y:n.row === "A" ? L.A - 24 : L.B + 40, "text-anchor":"middle", "class":"lbl"},g);
        } else {
          t = el("text",{x:n.row === "A" ? L.A - 16 : L.B + 16, y:c + 6, "text-anchor":n.row === "A" ? "end" : "start", "class":"lbl"},g);
        }
        t.textContent = n.label;
        nodeEls[k] = g;
      });

      paint();
    }

    function focusVisible(node){
      try { return node.matches(":focus-visible"); } catch (e) { return true; }
    }

    // Arrow keys move between projects, Home/End jump to the ends. Enter/Space selects.
    function keys(e, id, set){
      var i = order.indexOf(id), next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = order[(i + 1) % order.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = order[(i - 1 + order.length) % order.length];
      else if (e.key === "Home") next = order[0];
      else if (e.key === "End") next = order[order.length - 1];
      else if (set === groups && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); select(id); return; }
      if (next){ e.preventDefault(); select(next); heat(next); set[next].focus(); }
    }

    function toolsOf(w){
      var on = {};
      w.segs.forEach(function(s){
        if (s.t === "loop") on[s.node] = 1;
        else if (s.t === "split"){ on[s.from[0]] = 1; s.to.forEach(function(t){ on[t[0]] = 1; }); }
        else { on[s.a[0]] = 1; on[s.b[0]] = 1; }
      });
      return on;
    }

    // hovering dims everything else, but only while the pointer is on a cord
    function heat(id){
      board.classList.add("hovering");
      Object.keys(groups).forEach(function(k){ groups[k].classList.toggle("hot", k === id); });
      var on = toolsOf(wiresById[id]);
      Object.keys(nodeEls).forEach(function(k){ nodeEls[k].classList.toggle("on", !!on[k]); });
    }
    function cool(){ board.classList.remove("hovering"); }

    // on the tall phone board the readout sits below it, so a tap scrolls it into view
    function reveal(){
      if (!mq.matches) return;
      var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("readout").scrollIntoView({block:"nearest", behavior:calm ? "auto" : "smooth"});
    }

    // the selected cord is redrawn on a top layer so the original stays put and keeps its events
    function paint(){
      var top = document.getElementById("board-top");
      while (top.firstChild) top.removeChild(top.firstChild);
      var g = groups[selected];
      Array.prototype.forEach.call(g.querySelectorAll(".cord,.knot"), function(p){ top.appendChild(p.cloneNode(false)); });
      Array.prototype.forEach.call(board.querySelectorAll(".plug"), function(p){
        p.classList.toggle("on", p.getAttribute("data-w") === selected);
      });
      Object.keys(groups).forEach(function(k){
        groups[k].setAttribute("aria-pressed", k === selected ? "true" : "false");
        groups[k].setAttribute("tabindex", k === selected ? "0" : "-1");
      });
    }

    var R = {
      n:document.getElementById("r-n"), kind:document.getElementById("r-kind"), title:document.getElementById("r-title"),
      route:document.getElementById("r-route"), text:document.getElementById("r-text"),
      facts:document.getElementById("r-facts"), more:document.getElementById("r-more")
    };

    function select(id){
      if (!wiresById[id]) return;
      selected = id;
      var w = wiresById[id];
      paint();
      Object.keys(buttons).forEach(function(k){ buttons[k].setAttribute("aria-pressed", k === id ? "true" : "false"); });
      R.n.textContent = w.id; R.kind.textContent = w.kind; R.title.textContent = w.title;
      R.route.textContent = w.route; R.text.textContent = w.text;
      while (R.facts.firstChild) R.facts.removeChild(R.facts.firstChild);
      w.facts.forEach(function(f){
        var li = document.createElement("li"), b = document.createElement("b");
        b.textContent = f[0]; li.appendChild(b);
        if (f[1]) li.appendChild(document.createTextNode(f[1]));
        R.facts.appendChild(li);
      });
      var page = w.href.charAt(0) !== "#";
      R.more.textContent = page ? "Read the write-up →" : "In the project list ↓";
      R.more.setAttribute("href", w.href);
    }

    // size the readout to its tallest project, so the index list below it never moves on hover
    // (the CSS min-height stays as the no-JS fallback)
    function fitReadout(){
      var ro = document.getElementById("readout"), keep = selected, max = 0;
      ro.style.minHeight = "";
      order.forEach(function(id){ select(id); max = Math.max(max, ro.offsetHeight); });
      select(keep);
      ro.style.minHeight = max + "px";
    }

    var index = document.getElementById("index");
    while (index.firstChild) index.removeChild(index.firstChild);
    WIRES.forEach(function(w){
      var li = document.createElement("li"), b = document.createElement("button"), n = document.createElement("span"), t = document.createElement("span");
      b.type = "button";
      b.setAttribute("aria-controls", "readout");
      n.className = "n"; n.textContent = w.id; t.textContent = w.title;
      b.appendChild(n); b.appendChild(t);
      b.addEventListener("click", function(){ select(w.id); });
      b.addEventListener("keydown", function(e){ keys(e, w.id, buttons); });
      b.addEventListener("blur", cool);
      b.addEventListener("pointerenter", function(){ heat(w.id); clearTimeout(timer); timer = setTimeout(function(){ select(w.id); }, 120); });
      b.addEventListener("pointerleave", function(){ clearTimeout(timer); cool(); });
      li.appendChild(b); index.appendChild(li); buttons[w.id] = b;
    });

    // a link like index.html#board-06 opens with that project selected
    var m = /^#board-(\d\d)$/.exec(location.hash);
    if (m && wiresById[m[1]]) selected = m[1];

    draw();
    select(selected);
    fitReadout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitReadout);
    var redraw = function(){ draw(); fitReadout(); };
    if (mq.addEventListener) mq.addEventListener("change", redraw); else if (mq.addListener) mq.addListener(redraw);
    var resizeTimer = null;
    window.addEventListener("resize", function(){ clearTimeout(resizeTimer); resizeTimer = setTimeout(fitReadout, 150); });
  }

  // release ruler for the side panel write-up (homepage 03, and its write-up page if it reuses #ruler)
  function initRuler(){
    var ruler = document.getElementById("ruler");
    if (!ruler) return;
    var x0 = 4, x1 = 296, yb = 28, ink = "#15181A";
    el("line",{x1:x0,y1:yb,x2:x1,y2:yb,stroke:ink,"stroke-width":1},ruler);
    for (var v = 1; v <= 56; v++){
      var x = x0 + (v-1) * (x1-x0) / 55, tall = (v === 1 || v === 56) ? 18 : (v % 5 === 0 ? 11 : 6);
      el("line",{x1:x.toFixed(2),y1:yb,x2:x.toFixed(2),y2:yb-tall,stroke:ink,"stroke-width":(v===1||v===56)?1.6:.8},ruler);
    }
    var a = el("text",{x:x0,y:yb+20},ruler); a.textContent = "v0.3.1";
    var b = el("text",{x:x1,y:yb+20,"text-anchor":"end"},ruler); b.textContent = "v0.3.56";
    var c = el("text",{x:x0,y:yb+40},ruler); c.textContent = "while I owned it";
  }
})();
