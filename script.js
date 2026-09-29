// Tabs: show one section at a time, driven by the URL hash (#about, #work, ...)
document.documentElement.classList.add("js");

const panels = [...document.querySelectorAll(".panel")];
const tabs = [...document.querySelectorAll(".tabs a")];

function show() {
  const id = location.hash.slice(1);
  const target = panels.find((p) => p.id === id) || panels[0];
  panels.forEach((p) => p.classList.toggle("active", p === target));
  tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("href") === "#" + target.id));
}

window.addEventListener("hashchange", () => {
  show();
  window.scrollTo({ top: 0 });
});
show();

// Dark mode switch: light (white) by default, remembers the visitor's choice
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

function setTheme(theme) {
  root.dataset.theme = theme;
  toggle.checked = theme === "dark";
}

try { setTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light"); }
catch (e) { setTheme("light"); }

toggle.addEventListener("change", () => {
  setTheme(toggle.checked ? "dark" : "light");
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

document.getElementById("year").textContent = new Date().getFullYear();

// Pool shot divider: a draw shot on loop. The player takes two practice strokes, draws back
// and strikes; the cue ball slows under friction, passes almost all its speed to the 8-ball,
// then its backspin grabs and pulls it back to the cue while the 8-ball rolls into the pocket.
// Positions are worked out from simple physics each frame so speeds stay consistent at any width.
const cueLine = document.querySelector(".cue-line");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (cueLine && !calm && window.requestAnimationFrame) {
  const stick = cueLine.querySelector(".cue-stick");
  const cueBall = cueLine.querySelector(".cue-ball");
  const eight = cueLine.querySelector(".eight-ball");

  const R = 4;                 // ball radius (px)
  const DEG = 180 / Math.PI;
  const easeInOut = (p) => 0.5 - Math.cos(Math.PI * p) / 2;
  const easeOut = (p) => 1 - (1 - p) * (1 - p);
  const clamp = (p) => Math.min(1, Math.max(0, p));

  // timeline (ms from the start of each loop)
  const FEATHER = 550;             // one practice stroke; two are taken
  const BACK = 1300;               // final backswing starts
  const BACK_END = 1900;
  const STROKE = 2050;             // forward stroke starts after a short pause
  const HIT = 2150;                // tip meets cue ball
  const FOLLOW = 150;              // follow-through
  const RETRACT = 2850;            // stick eases back to rest
  const ROLL = 600;                // cue ball travel time to the 8-ball
  const T1 = HIT + ROLL;           // balls collide
  const SKID = 80;                 // cue ball sits while backspin bites
  const GRAB = 350;                // backspin accelerates it backwards
  const SETTLE = 1500;             // then it rolls to a stop at the cue
  const HOME = T1 + SKID + GRAB + SETTLE;
  const DROP = 200;                // 8-ball falling into the pocket
  const RERACK = HOME + 250;       // 8-ball reappears
  const FADE = 300;
  const LOOP = RERACK + FADE + 1100;

  let g;                           // geometry + derived speeds for the current width
  function measure() {
    const W = cueLine.clientWidth;
    const home = 0.12 * W;         // matches .cue-ball { left: 12% }
    const eHome = 0.7 * W;         // matches .eight-ball { left: 70% }
    const contact = eHome - 2 * R;
    const pocket = W - 6;          // matches .pocket
    const d1 = contact - home;
    const d2 = pocket - eHome;
    const v1 = (0.75 * d1) / ROLL; // cue ball speed at impact (it slowed to 60% of its start)
    const ve = 0.95 * v1;          // 8-ball leaves with nearly all of it
    const vp = 0.5 * ve;           // still rolling as it reaches the pocket
    const t2 = (2 * d2) / (ve + vp);
    g = { home, eHome, contact, pocket, d1, ve, a2: (ve - vp) / t2, t2 };
  }

  let spin0 = 0;                   // cue ball rotation carried between loops

  function draw(t) {
    // --- cue stick ---
    let o = 0;
    if (t < 2 * FEATHER) o = -5 * (1 - Math.cos((2 * Math.PI * t) / FEATHER)) / 2;
    else if (t < BACK) o = 0;
    else if (t < BACK_END) o = -16 * easeInOut((t - BACK) / (BACK_END - BACK));
    else if (t < STROKE) o = -16;
    else if (t < HIT) { const p = (t - STROKE) / (HIT - STROKE); o = -16 + 16 * p * p; }
    else if (t < HIT + FOLLOW) o = 6 * easeOut((t - HIT) / FOLLOW);
    else if (t < RETRACT) o = 6;
    else o = 6 * (1 - easeInOut(clamp((t - RETRACT) / 500)));

    // --- cue ball: decelerates to the 8, skids, then draws back ---
    let x = g.home, spin = 0;
    const vb = (2 * g.d1) / (GRAB + SETTLE);
    if (t >= HIT && t < T1) {
      const p = (t - HIT) / ROLL;
      const s = (g.d1 * (p - 0.2 * p * p)) / 0.8;
      x = g.home + s;
      spin = (-2 * s) / R;                          // struck low: backspin
    } else if (t >= T1) {
      const u = t - T1 - SKID;
      let back = 0;
      if (u > 0 && u < GRAB) back = (0.5 * vb * u * u) / GRAB;
      else if (u >= GRAB) {
        const w = Math.min(u - GRAB, SETTLE);
        back = 0.5 * vb * GRAB + vb * w - (0.5 * vb * w * w) / SETTLE;
      }
      x = g.contact - back;
      spin = (-2 * g.d1) / R - clamp((t - T1) / SKID) - back / R;
    }

    // --- 8-ball: rolls to the pocket, drops, re-racks ---
    let ex = g.eHome, eSpin = 0, eScale = 1, eOp = 1;
    if (t >= T1 && t < T1 + g.t2) {
      const u = t - T1;
      const s = g.ve * u - 0.5 * g.a2 * u * u;
      ex = g.eHome + s;
      eSpin = s / R;
    } else if (t >= T1 + g.t2 && t < T1 + g.t2 + DROP) {
      const p = (t - T1 - g.t2) / DROP;
      ex = g.pocket + 2 * p;
      eSpin = (g.pocket - g.eHome) / R;
      eScale = 1 - 0.7 * p;
      eOp = 1 - p;
    } else if (t >= T1 + g.t2 + DROP && t < RERACK) {
      eOp = 0;
    } else if (t >= RERACK && t < RERACK + FADE) {
      const p = easeOut((t - RERACK) / FADE);
      eOp = p;
      eScale = 0.6 + 0.4 * p;
    }

    stick.style.transform = `translate(${o.toFixed(2)}px, -50%)`;
    cueBall.style.transform =
      `translate(calc(-50% + ${(x - g.home).toFixed(2)}px), -50%) rotate(${((spin0 + spin) * DEG).toFixed(1)}deg)`;
    eight.style.transform =
      `translate(calc(-50% + ${(ex - g.eHome).toFixed(2)}px), -50%) rotate(${(eSpin * DEG).toFixed(1)}deg) scale(${eScale.toFixed(3)})`;
    eight.style.opacity = eOp.toFixed(3);
    return spin;
  }

  measure();
  let t = -600;                    // short pause before the first shot
  let last = null;
  let endSpin = 0;

  function tick(now) {
    // clamp the step so a backgrounded tab doesn't skip ahead
    if (last !== null) t += Math.min(now - last, 50);
    last = now;
    if (t >= LOOP) {
      t -= LOOP;
      spin0 = (spin0 + endSpin) % (2 * Math.PI);
      measure();                   // pick up any resize between shots
    }
    endSpin = draw(Math.max(t, 0));
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
