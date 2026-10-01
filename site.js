"use strict";
/* ==========================================================================
   Dra. Maria Clara — cenas do Grotesk Zero adaptadas
   ⚠️ A CONFIRMAR COM A DOUTORA: o WhatsApp abaixo é o que está hoje no site e
   no Google, um (11). Trocar pelo número 85 assim que existir.
   ========================================================================== */
const CONFIG = {
  whatsapp: "5511970540776",
  whatsappDisplay: "(11) 97054-0776",
  mensagem: "Olá, Dra. Maria Clara! Vim pelo site e gostaria de agendar uma consulta.",
};
const waLink = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg || CONFIG.mensagem)}`;
document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = waLink(a.dataset.wa || "");
  a.target = "_blank"; a.rel = "noopener";
  if (a.hasAttribute("data-wa-display")) a.textContent = CONFIG.whatsappDisplay;
});

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = matchMedia("(pointer: coarse)").matches;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp01 = v => Math.min(Math.max(v, 0), 1);
const BONE = "#fbf3ec", INK = "#4a2328";

/* ---------- substrato: scroll suave ---------- */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -10 }); }
  }));
}

/* ---------- cursor ---------- */
if (!touch && !reduce) {
  const cur = $("#cursor");
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; });
  gsap.ticker.add(() => {
    cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
  });
  $$("a,button,summary,.lic-row").forEach(el => {
    el.addEventListener("pointerenter", () => cur.classList.add("is-link"));
    el.addEventListener("pointerleave", () => cur.classList.remove("is-link"));
  });
} else { $("#cursor").style.display = "none"; }

/* ---------- hero: letras + entrada ---------- */
$$(".hero-title [data-chars]").forEach(row => {
  row.innerHTML = row.dataset.chars.split("").map(c => `<span class="ch">${c}</span>`).join("");
});
const veil = $("#veil");
if (reduce) { veil.remove(); }
else {
  const intro = gsap.timeline({ delay: 0.25 });
  intro.to(veil, { yPercent: -100, duration: 0.9, ease: "power3.inOut" })
    .set(veil, { display: "none" })
    .from(".reg-v", { scaleY: 0, duration: 1.0, ease: "expo.out" }, "-=0.45")
    .from(".reg-h", { scaleX: 0, duration: 1.0, ease: "expo.out" }, "<")
    .to(".reg-cross", { opacity: 0.5, duration: 0.6 }, "<0.3")
    .to("#heroPhoto", { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.out" }, "-=0.8")
    .to(".hero-title .row > span", { y: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, "-=1.1")
    .to("#heroSub", { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=0.5")
    .to("#heroCta", { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=0.6");
}

/* hero: o cursor troca o peso das letras (o eixo variável, sentido) */
const heroChs = $$("#heroTitle .ch");
if (!touch && !reduce && heroChs.length) {
  let hx = -9999, hy = -9999, heroOn = false;
  const hero = $("#hero");
  hero.addEventListener("pointermove", e => { hx = e.clientX; hy = e.clientY; heroOn = true; });
  hero.addEventListener("pointerleave", () => { heroOn = false; });
  const states = heroChs.map(ch => {
    const thin = ch.closest(".row").classList.contains("thin");
    return { ch, w: thin ? 100 : 900, base: thin ? 100 : 900 };
  });
  gsap.ticker.add(() => {
    for (const s of states) {
      let target = s.base;
      if (heroOn) {
        const r = s.ch.getBoundingClientRect();
        const d = Math.hypot(hx - (r.left + r.width / 2), hy - (r.top + r.height / 2));
        const f = Math.max(0, 1 - d / 340);
        target = s.base === 900 ? 900 - 800 * f : 100 + 800 * f;
      }
      s.w += (target - s.w) * 0.16;
      s.ch.style.fontVariationSettings = `'wght' ${s.w.toFixed(0)}, 'wdth' 100`;
    }
  });
}

/* ---------- faixas: infinitas + acopladas à velocidade do scroll ---------- */
const R1 = "CONSULTÓRIO · EM CASA · ONLINE · ";
const R2 = "0 A 3 ANOS · SEM PRESSA · BASEADA EM EVIDÊNCIA · ";
$("#ribbon1").innerHTML = `<span>${R1.repeat(5)}</span><span>${R1.repeat(5)}</span>`;
$("#ribbon2").innerHTML = `<span>${R2.repeat(4)}</span><span>${R2.repeat(4)}</span>`;
if (!reduce) {
  const r1 = { x: 0 }, r2 = { x: -50 };
  let vel = 0;
  ScrollTrigger.create({ onUpdate: self => { vel = self.getVelocity() / 4000; } });
  gsap.ticker.add((t, dt) => {
    const base = dt * 0.0022;
    r1.x -= base * (1 + Math.min(Math.abs(vel), 3)); if (r1.x <= -50) r1.x += 50;
    r2.x += base * (1 + Math.min(Math.abs(vel), 3)); if (r2.x >= 0) r2.x -= 50;
    $("#ribbon1").style.transform = `translate3d(${r1.x}%,0,0)`;
    $("#ribbon2").style.transform = `translate3d(${r2.x}%,0,0)`;
  });
}

/* ---------- portal: atravessa o "0", a paleta vira no traço ---------- */
{
  const stage = $("#portalStage"), oWrap = $("#oWrap"), line = $("#portalLine");
  const oGlyph = stage.querySelector(".o-glyph");
  const shards = $$(".shard");
  const prox = { p: 0 };
  const eyebrow = stage.querySelector(".portal-eyebrow");
  const FLIP = 0.69;
  if (!reduce) {
    gsap.to(prox, {
      p: 1, ease: "none",
      scrollTrigger: { trigger: "#portal", start: "top bottom", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      onUpdate: () => {
        const p = prox.p;
        const travel = clamp01((p - 0.15) / 0.597);
        if (p < FLIP + 0.03) {
          const fs = 64 * Math.pow(46, travel);
          const dx = 6 * gsap.parseEase("power2.inOut")(clamp01((travel - 0.1) / 0.7));
          oGlyph.style.fontSize = fs.toFixed(2) + "vmin";
          oWrap.style.transform = `translate3d(${dx.toFixed(2)}%,0,0)`;
        }
        eyebrow.style.opacity = 1 - clamp01((p - 0.42) / 0.16);
        stage.classList.toggle("inked", p >= FLIP);
        const ip = clamp01((p - 0.40) / 0.60);
        const lk = clamp01((p - 0.66) / 0.10);
        line.style.opacity = lk;
        line.style.transform = `translate(-50%,-50%) translateY(${(1 - lk) * 22}px)`;
        shards.forEach((sh, i) => {
          const depth = sh.classList.contains("s-near") ? 190 : sh.classList.contains("s-mid") ? 130 : 85;
          const drift = (i % 2 ? 1 : -1) * ip * 7;
          sh.style.transform = `translate3d(${drift.toFixed(2)}vw,${(-ip * depth).toFixed(2)}vh,0)`;
        });
        stage.style.backgroundColor = gsap.utils.interpolate(BONE, INK)(clamp01((p - 0.613) / 0.077));
        oWrap.style.opacity = p >= FLIP ? 0 : 1;
      }
    });
  } else { stage.classList.add("inked"); stage.style.backgroundColor = INK; oWrap.style.display = "none"; line.style.opacity = 1; }
}

/* ---------- manifesto: as palavras acendem ---------- */
{
  const p = $("#maniText");
  p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
  const words = $$("#maniText .w");
  if (!reduce) {
    ScrollTrigger.create({
      trigger: "#manifesto", start: "top 85%", end: "bottom bottom", scrub: 0.4,
      onUpdate: self => {
        const n = Math.floor(clamp01((self.progress - 0.05) / 0.75) * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < n));
      }
    });
    $$(".mani-shard").forEach((sh, i) => gsap.fromTo(sh,
      { yPercent: i ? -70 : 80 },
      { yPercent: i ? 80 : -100, ease: "none",
        scrollTrigger: { trigger: "#manifesto", start: "top bottom", end: "bottom top", scrub: true } }));
  } else words.forEach(w => w.classList.add("on"));
}

/* ---------- eixo: CRESCER ganha peso a cada consulta do calendário da SBP ---------- */
{
  const IDADES = ["1ª semana", "1 mês", "2 meses", "4 meses", "6 meses", "9 meses", "12 meses", "18 meses", "24 meses"];
  const word = $("#zeroWord"), hud = $("#axisHud"), tick = $("#railTick"),
        num = $("#wghtNum"), name = $("#wghtName"), rail = $("#axisRail");
  for (let i = 0; i < 9; i++) { const n = document.createElement("i"); n.style.left = (i / 8 * 100) + "%"; rail.appendChild(n); }
  let detent = -1;
  const apply = idx => {
    if (idx === detent) return; detent = idx;
    word.style.fontVariationSettings = `'wght' ${100 + idx * 100}`;
    num.textContent = "consulta " + String(idx + 1).padStart(2, "0");
    name.textContent = IDADES[idx];
    name.classList.remove("stamped"); void name.offsetWidth; name.classList.add("stamped");
  };
  if (!reduce) {
    const st = { p: 0 };
    gsap.to(st, { p: 1, ease: "none",
      scrollTrigger: { trigger: "#axis", start: "top bottom", end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true },
      onUpdate: () => {
        const p = st.p;
        const rev = gsap.parseEase("expo.out")(clamp01((p - 0.08) / 0.34));
        word.style.transform = `translateY(${(1 - rev) * 115}%)`;
        hud.style.opacity = clamp01((p - 0.30) / 0.12);
        const wp = clamp01((p - 0.44) / 0.52);
        apply(Math.round(wp * 8));
        tick.style.left = (wp * 100) + "%";
      } });
  } else { word.style.transform = "none"; hud.style.opacity = 1; apply(8); }
}

/* ---------- o que acompanho: demos no hover ---------- */
{
  const anims = {
    count: el => { const o = { n: 0 };
      gsap.to(o, { n: 28, duration: 0.9, ease: "power2.out", onUpdate: () => el.textContent = `0 → ${Math.round(o.n)} dias` }); },
    case: el => gsap.fromTo(el, { letterSpacing: "0.2em", opacity: 0.4 }, { letterSpacing: "0em", opacity: 1, duration: 0.6, ease: "expo.out" }),
    alt: el => gsap.fromTo(el, { fontVariationSettings: "'wght' 100" }, { fontVariationSettings: "'wght' 800", duration: 0.7, ease: "expo.out" }),
    arrows: el => gsap.fromTo(el, { x: -16, opacity: 0.3 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }),
  };
  $$(".feat-row").forEach(row => {
    const demo = row.querySelector(".demo");
    const kind = demo.dataset.anim;
    row.addEventListener("pointerenter", () => { if (!reduce && anims[kind]) anims[kind](demo); });
  });
}

/* ---------- galeria: horizontal fixada + parallax interno ---------- */
{
  const track = $("#track");
  if (!reduce) {
    const dist = () => track.scrollWidth - innerWidth;
    const move = gsap.to(track, { x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: "#hPin", start: "top 12%", end: () => "+=" + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
    $$(".frame").forEach(f => {
      gsap.fromTo(f, { clipPath: "inset(0 0 0 28%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: f, containerAnimation: move, start: "left 90%" } });
      gsap.fromTo(f.querySelector("img"), { xPercent: -8 }, { xPercent: 0, ease: "none",
        scrollTrigger: { trigger: f, containerAnimation: move, start: "left right", end: "right left", scrub: true } });
    });
  }
}

/* ---------- interlúdio ---------- */
if (!reduce) {
  gsap.fromTo("#interImg", { yPercent: -8 }, { yPercent: 8, ease: "none",
    scrollTrigger: { trigger: "#interlude", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".interlude .knock span", { yPercent: 70, opacity: 0, stagger: 0.16, duration: 1.5, ease: "expo.out",
    scrollTrigger: { trigger: "#interlude", start: "top 78%" } });
}

/* ---------- reveals genéricos ---------- */
if (!reduce) {
  ScrollTrigger.batch(".reveal", { start: "top 88%",
    onEnter: els => gsap.from(els, { y: 30, autoAlpha: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }) });
}

/* ---------- rodapé: o peso segue o cursor ---------- */
{
  const mark = $("#footMark");
  mark.innerHTML = "MARIA CLARA".split("").map(c => c === " " ? "&nbsp;" : `<span class="fch">${c}</span>`).join("");
  const fchs = $$("#footMark .fch");
  if (!touch && !reduce) {
    addEventListener("pointermove", e => {
      const t = e.clientX / innerWidth;
      fchs.forEach((ch, i) => {
        const d = Math.abs(i / (fchs.length - 1) - t);
        ch.style.fontVariationSettings = `'wght' ${(900 - Math.min(d * 2.2, 1) * 750).toFixed(0)}`;
      });
    });
  }
}
if (!reduce) {
  gsap.fromTo(".foot-zero", { yPercent: 16 }, { yPercent: -6, ease: "none",
    scrollTrigger: { trigger: "#footer", start: "top bottom", end: "bottom bottom", scrub: true } });
}

/* ---------- barra de WhatsApp no celular: aparece depois do hero ---------- */
{
  const bar = $(".wa-bar");
  ScrollTrigger.create({ trigger: "#hero", start: "bottom 60%", onEnter: () => bar.classList.add("on"), onLeaveBack: () => bar.classList.remove("on") });
}

addEventListener("load", () => ScrollTrigger.refresh());
