// KI zum Anfassen – kleine Helfer: Icons, Navigation, Einblenden, Zähler, Raster, Quiz, Teilen.
// Keine Cookies, kein Tracking, keine externen Ressourcen.
document.documentElement.classList.add("js");

const ICONS = {
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2"/>',
  speech: '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.7A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 10h7M8.5 13.5h4.5"/>',
  heart: '<path d="M12 20.5s-7.6-4.6-9.6-9.1C.9 8 2.9 4 6.7 4c2.3 0 3.8 1.3 5.3 3 1.5-1.7 3-3 5.3-3 3.8 0 5.8 4 4.3 7.4-2 4.5-9.6 9.1-9.6 9.1z"/><path d="M5.5 11.5h3l1.6-2.6 2.2 5 1.6-2.4h4.6"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/><path d="M9.6 14.6 12 9.4l2.4 5.2M10.4 12.9h3.2"/>',
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c3 .2 5 2.3 5 5.8"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  share: '<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 13v6.5h14V13"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.6"/><path d="M12 17h.01"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 20.5h7M9.5 17h5"/>',
};
const svg = (n) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;

document.addEventListener("DOMContentLoaded", () => {
  // Icons einsetzen
  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = svg(el.dataset.icon); });

  // Navigation unten
  const page = document.body.dataset.page || "start";
  const nav = document.createElement("nav");
  nav.className = "bottom";
  nav.setAttribute("aria-label", "Stationen");
  const items = [["start", "index.html", "home", "Start", "st0"], ["1", "station-1.html", "eye", "Sehen", "st1"],
                 ["2", "station-2.html", "speech", "Sprechen", "st2"], ["3", "station-3.html", "heart", "Fühlen", "st3"]];
  nav.innerHTML = `<div class="in">${items.map(([id, href, icon, label, st]) =>
    `<a href="${href}" class="${st}${id === page ? " active" : ""}"${id === page ? ' aria-current="page"' : ""}>${svg(icon)}<span>${label}</span><span class="dot"></span></a>`).join("")}</div>`;
  document.body.append(nav);

  // Teilen (Web Share API, sonst Link kopieren)
  document.querySelectorAll(".share").forEach((b) => {
    b.innerHTML = svg("share") + "<span>Teilen</span>";
    b.addEventListener("click", async () => {
      const data = { title: document.title, url: location.href };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(location.href); b.querySelector("span").textContent = "Link kopiert"; }
      } catch (e) { /* abgebrochen */ }
    });
  });

  // Piktogramm-Raster vorbereiten (leer), Füllung beim Einblenden
  document.querySelectorAll(".grid100[data-on]").forEach((el) => {
    el.innerHTML = "<i></i>".repeat(100);
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", `${el.dataset.on} von 100`);
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fillGrid(el) {
    const on = parseInt(el.dataset.on, 10);
    const dots = el.querySelectorAll("i");
    if (reduce) { dots.forEach((d, i) => d.classList.toggle("on", i < on)); return; }
    let i = 0;
    const step = () => { for (let k = 0; k < 4 && i < on; k++, i++) dots[i].classList.add("on"); if (i < on) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (reduce) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1100;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Einblenden beim Scrollen
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll(".grid100[data-on]").forEach(fillGrid);
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  // Zahlen ohne .reveal-Elternelement direkt setzen
  document.querySelectorAll("[data-count]").forEach((el) => { if (!el.closest(".reveal")) countUp(el); });

  // Quiz mit Punktestand – nichts wird gespeichert oder übertragen
  document.querySelectorAll(".quiz").forEach((quiz) => setupQuiz(quiz, reduce));
});

const RIGHT_LEADS = ["Genau!", "Richtig!", "Stimmt!", "Sehr gut!"];
const WRONG_LEADS = ["Gar nicht so einfach:", "Knapp daneben:", "Das überrascht viele:", "Gut zu wissen:"];

function setupQuiz(quiz, reduce) {
  const questions = [...quiz.querySelectorAll(".qq")];
  const total = questions.length;
  const bar = quiz.querySelector(".progress span");
  const label = quiz.querySelector(".progress-label");
  const score = quiz.querySelector(".score");
  let answered = 0, correct = 0;

  questions.forEach((q, idx) => {
    const qn = q.querySelector(".qn");
    if (qn) qn.textContent = `Frage ${idx + 1} von ${total}`;
    q.querySelectorAll("button[data-a]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (q.classList.contains("done")) return;
        q.classList.add("done");
        const right = btn.dataset.a === q.dataset.answer;
        btn.classList.add(right ? "right" : "wrong");
        if (!right) q.querySelector(`button[data-a="${q.dataset.answer}"]`).classList.add("right");
        const res = q.querySelector(".res");
        const leads = right ? RIGHT_LEADS : WRONG_LEADS;
        res.insertAdjacentHTML("afterbegin", `<b class="lead">${leads[idx % leads.length]}</b>`);
        answered += 1;
        if (right) correct += 1;
        update();
      });
    });
  });

  function update() {
    if (bar) bar.style.width = `${(answered / total) * 100}%`;
    if (label) label.textContent = answered < total ? `${answered} von ${total} beantwortet` : "Geschafft!";
    if (answered === total) showScore();
  }

  function showScore() {
    // Drei freundliche Stufen – niemand soll sich schlecht fühlen
    let title, text;
    if (correct === total) {
      title = "Volltreffer!";
      text = "Sie durchschauen die Maschine. Verraten Sie uns an der Station, woran Sie es erkannt haben?";
    } else if (correct >= total - 2) {
      title = "Starkes Gespür für KI!";
      text = "Welche Frage hat Sie kurz ins Grübeln gebracht? Erzählen Sie es uns gern an der Station.";
    } else {
      title = "Schön, dass Sie es ausprobiert haben!";
      text = "Genau diese Überraschungen sind der Kern der Station – vielen geht es hier genauso. KI wirkt oft überzeugender, als sie ist. Sprechen Sie uns gern an!";
    }
    score.querySelector("h3").textContent = title;
    score.querySelector("p").textContent = text;
    score.classList.add("show");
    const ring = score.querySelector(".ring");
    const val = score.querySelector(".ring b");
    const target = Math.round((correct / total) * 100);
    if (reduce) { ring.style.setProperty("--p", target); val.textContent = correct; }
    else {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 900, 1), e = 1 - Math.pow(1 - p, 3);
        ring.style.setProperty("--p", target * e);
        val.textContent = Math.round(correct * e);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    score.querySelector(".ring small").textContent = `von ${total}`;
    score.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    if (correct === total && !reduce) confetti();
  }

  const again = score && score.querySelector(".again");
  if (again) again.addEventListener("click", () => {
    questions.forEach((q) => {
      q.classList.remove("done");
      q.querySelectorAll("button").forEach((b) => b.classList.remove("right", "wrong"));
      const lead = q.querySelector(".res .lead");
      if (lead) lead.remove();
    });
    answered = 0; correct = 0;
    score.classList.remove("show");
    update();
    quiz.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
  update();
}

function confetti() {
  const box = document.createElement("div");
  box.className = "confetti";
  const colors = ["#0e7c7b", "#23508e", "#a3283f", "#f2b705", "#1fa6a0"];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.5 + "s";
    p.style.animationDuration = 1.4 + Math.random() * 1.2 + "s";
    box.append(p);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 3500);
}
