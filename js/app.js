const APP_KEYS = {
  auth: "simulacroAuth",
  ig: "simulacroIGState",
  news: "simulacroNewsState",
};
const NEWS_DECK_SIZE = 15;
const NEWS_REAL_IN_DECK = 8;
const NEWS_FAKE_IN_DECK = 7;
const NEWS_FEEDBACK = {
  fully_true: {
    headline: "La noticia ocurrió realmente y la información es correcta.",
    hint: "El referente existe y la formulación coincide con fuentes verificables.",
  },
  altered: {
    headline: "Esta noticia sí ocurrió, pero el hecho mostrado fue alterado.",
    hint: "Hay un evento real detrás, pero el titular distorsiona lo que pasó.",
  },
  misleading: {
    headline:
      "La noticia está basada en un evento real, pero la información presentada es engañosa.",
    hint: "La trama apela a algo conocido para hacer creíble un relato incompleto.",
  },
  manipulated: {
    headline: "El evento existió, pero los datos fueron manipulados.",
    hint: "Cifras, citas o contexto fueron ajustados para empujar una lectura falsa.",
  },
  fully_false: {
    headline: "Esta noticia es completamente falsa.",
    hint: "No hay respaldo verificable: el simulacro fabrica credibilidad sin referente.",
  },
};
const modalState = { list: [], idx: 0, profile: null };

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initLoader();
  initCursorGlow();
  initParticles();
  initReveal();
  initParallax();
  initPageState();
  initLogin();
  initVoting();
  initGeneratedProfiles();
  initNewsLab();
  initMemoryAlbum();
  initJuryPanel();
  initBars();
});

function getStore() {
  return {
    set(key, value) {
      const raw = JSON.stringify(value);
      try {
        localStorage.setItem(key, raw);
      } catch {
        try {
          sessionStorage.setItem(key, raw);
        } catch {
          window.__simMem = window.__simMem || {};
          window.__simMem[key] = raw;
        }
      }
    },
    get(key) {
      try {
        const v = localStorage.getItem(key);
        if (v) return JSON.parse(v);
      } catch {}
      try {
        const v = sessionStorage.getItem(key);
        if (v) return JSON.parse(v);
      } catch {}
      if (window.__simMem && window.__simMem[key]) {
        try {
          return JSON.parse(window.__simMem[key]);
        } catch {}
      }
      return null;
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {}
      try {
        sessionStorage.removeItem(key);
      } catch {}
      if (window.__simMem) delete window.__simMem[key];
    },
  };
}
const store = getStore();

function ensureGuestSession() {
  let auth = store.get(APP_KEYS.auth);
  if (!auth) {
    auth = { username: "Invitado", guest: true, ts: Date.now() };
    store.set(APP_KEYS.auth, auth);
  }
  return auth;
}

function initAuth() {
  const auth = ensureGuestSession();
  const nav = document.querySelector(".nav");
  if (!nav || auth.guest) return;
  const logout = document.createElement("button");
  logout.type = "button";
  logout.className = "btn ghost";
  logout.style.padding = "8px 10px";
  logout.style.fontSize = ".8rem";
  logout.textContent = "Cerrar sesion";
  logout.addEventListener("click", () => {
    store.remove(APP_KEYS.auth);
    ensureGuestSession();
    window.location.href = "index.html";
  });
  nav.appendChild(logout);
}

function initLogin() {
  const form = document.getElementById("fake-login");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = form.querySelector("input");
    const username =
      userInput && userInput.value ? userInput.value.trim() : "usuario";
    store.set(APP_KEYS.auth, { username, guest: false, ts: Date.now() });
    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Validando sesion...";
    setTimeout(() => {
      window.location.href = "teoria.html";
    }, 700);
  });
}

function initLoader() {
  const loader = document.querySelector(".loader");
  if (!loader) return;
  setTimeout(() => loader.classList.add("hide"), 1700);
}
function initCursorGlow() {
  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;
  window.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  }));
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180,220,255,.55)";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}
function initReveal() {
  const cards = document.querySelectorAll(".card");
  if (!cards.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(
        (e) => e.isIntersecting && e.target.classList.add("reveal"),
      );
    },
    { threshold: 0.14 },
  );
  cards.forEach((c) => obs.observe(c));
  setTimeout(() => {
    cards.forEach((c) => c.classList.add("reveal"));
  }, 260);
}
function initParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    hero.style.transform = `translate(${x}px, ${y}px)`;
  });
}
function initPageState() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll(".nav a")
    .forEach(
      (a) => a.getAttribute("href") === path && a.classList.add("active"),
    );
}

function initVoting() {
  const voteButtons = document.querySelectorAll("[data-vote]");
  const result = document.getElementById("vote-result");
  if (voteButtons.length && result) {
    voteButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const choice = btn.dataset.vote;
        voteButtons.forEach((b) => (b.disabled = true));
        result.classList.remove("hidden");
        result.innerHTML =
          choice === "laura"
            ? "<strong>Elegiste a Laura Cepeda.</strong> El formato hiperproducido suele percibirse como más confiable por impacto visual."
            : "<strong>Elegiste a Kimberly Loaiza.</strong> El contenido crítico puede sentirse más auténtico aunque reciba menos visibilidad.";
      }),
    );
  }
  const quiz = document.getElementById("quiz-form");
  if (!quiz) return;
  quiz.addEventListener("submit", (e) => {
    e.preventDefault();
    const output = document.getElementById("quiz-output");
    const d = new FormData(quiz);
    let score = 0;
    if (d.get("q1") === "hiperreal") score++;
    if (d.get("q2") === "si") score++;
    if (d.get("q3") === "si") score++;
    if (d.get("q4") === "no") score++;
    output.classList.remove("hidden");
    const lines = [
      d.get("q1") === "hiperreal"
        ? "Autenticidad: te inclinas por el perfil hiperproducido."
        : "Autenticidad: te inclinas por el perfil más cotidiano.",
      d.get("q2") === "si"
        ? "Memorias: varias escenas te parecieron creíbles como recuerdo colectivo."
        : "Memorias: detectaste artificio o algo que no encajaba.",
      d.get("q3") === "si"
        ? "Redes: confiarías en la imagen como evidencia en tu feed."
        : "Redes: cuestionarías la imagen o buscarías otra fuente.",
      d.get("q4") === "no"
        ? "Emoción: puedes emocionarte aunque el hecho no sea totalmente verdadero."
        : "Emoción: para ti, la emoción exige que el hecho haya ocurrido tal cual.",
    ];
    output.innerHTML =
      `<strong>Tu registro:</strong> ${score}/4 respuestas coinciden con la hipótesis del proyecto.<br>` +
      `<span class="muted" style="display:block;margin-top:8px">${lines.join("<br>")}</span>`;
  });
}

function initGeneratedProfiles() {
  const profiles = document.querySelectorAll(".generated-profile");
  if (!profiles.length) return;
  const state = store.get(APP_KEYS.ig) || {
    follows: { modelo: false, feminista: false },
    followers: { modelo: 48200, feminista: 3200 },
    likes: {},
    comments: {},
    commentTotals: {},
    shares: {},
    saves: {},
    likedByUser: {},
  };
  state.follows = state.follows || { modelo: false, feminista: false };
  state.followers = state.followers || { modelo: 48200, feminista: 3200 };
  state.likes = state.likes || {};
  state.comments = state.comments || {};
  state.commentTotals = state.commentTotals || {};
  state.shares = state.shares || {};
  state.saves = state.saves || {};
  state.likedByUser = state.likedByUser || {};
  const modelImages = [
    "assets/images/laura/6ecd893879cd5980a3263a48a515cddb.jpg",
    "assets/images/laura/dad338a2fc3e094fc1d659859975aa70.jpg",
    "assets/images/laura/hermosa-chica-rubia-traje-bano-abierto-posa-playa-arena-cerca-olas-mar-enrollan_78492-6567.avif",
    "assets/images/laura/istockphoto-1192709519-1024x1024.jpg",
    "assets/images/laura/mujer.webp",
    "assets/images/kimberly/movimiento-feminista-e1538669896851.webp",
  ];
  const feministImages = [
    "assets/images/kimberly/951df16f7337bcbc477081bd284102c0.jpg",
    "assets/images/kimberly/f488160d949959327148b12286c813eb.jpg",
    "assets/images/kimberly/Feminismo-antiespecista.jpg",
    "assets/images/kimberly/hq720.jpg",
    "assets/images/kimberly/2RZY53KDXMXO23ZCPB2WP37T7U.avif",
    "assets/images/kimberly/movimiento-feminista-e1538669896851.webp",
    "assets/images/kimberly/_94933827_a84d36d6-98d3-4c09-a6f5-60292900a3a9.jpg.webp",
  ];
  const harsh = [
    "hater_77: Nadie te toma en serio.",
    "perfil_troll: Siempre lo mismo con tus marchas.",
    "anon_critico: Tu discurso cansa.",
    "user_fake01: Con 200 seguidores no representas a nadie.",
    "silencio_ya: Muy dramatica para llamar atencion.",
    "ironico_404: Esto no cambia nada.",
    "nada_nuevo: Otra vez victimizandote.",
    "sin_filtro: Mejor deja de publicar.",
    "realista_crudo: Puro show para redes.",
    "ghost_man: Te falta informacion real.",
    "debate_duro: No comparto nada de esto.",
    "masa_critica: Siempre exageran los mismos temas.",
    "directo_aqui: Cambia de contenido.",
    "agresivo_x: Nadie te cree.",
    "offline_01: Todo por engagement.",
    "claro_no: Te contradices sola.",
    "palabras_sin: Mucho texto, poca accion.",
    "feed_hater: Que cansancio tu perfil.",
    "rudo_coment: Todo es teatro.",
    "final_troll: Borrate mejor.",
  ];
  const glam = [
    "manu_fit: Bellisima total.",
    "carlos_23: Que linda sonrisa.",
    "leo_mx: Reina, impecable.",
    "daniel_vlog: Wow, perfecta.",
    "seba_hot: Top post del dia.",
    "nicolas_gym: Eres otro nivel.",
    "rafael_likes: Increible cuerpo.",
    "andres89: Demasiado hermosa.",
    "joel_style: Muy top ese look.",
    "samuel_king: Te amo.",
  ];
  const sharedTopics = [
    "Salud mental digital",
    "Algoritmos y ansiedad",
    "Desinformación emocional",
    "Filtros y autoestima",
    "Acoso en plataformas",
    "Fatiga por hiperconexión",
  ];

  document.querySelectorAll(".follow-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = btn.dataset.followProfile;
      const was = state.follows[p];
      state.follows[p] = !was;
      state.followers[p] += was ? -1 : 1;
      store.set(APP_KEYS.ig, state);
      renderFollowers(state);
    });
  });
  renderFollowers(state);

  profiles.forEach((profile) => {
    const type = profile.dataset.profileType;
    const images = type === "modelo" ? modelImages : feministImages;
    const comments = type === "modelo" ? glam : harsh;
    profile.querySelector(".avatar").src = images[0];
    addImageFallback(profile.querySelector(".avatar"));
    const wrap = profile.querySelector(".generated-posts");
    wrap.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const key = `${type}-${i}`;
      if (!state.likes[key])
        state.likes[key] =
          type === "modelo" ? 48200 - i * 2400 : 3200 - i * 220;
      if (!state.comments[key]) state.comments[key] = comments.slice(0, 10);
      if (
        Array.isArray(state.comments[key]) &&
        state.comments[key].length < 8
      ) {
        state.comments[key] = [
          ...state.comments[key],
          ...comments.slice(0, 8 - state.comments[key].length),
        ];
      }
      if (!state.commentTotals[key])
        state.commentTotals[key] =
          type === "modelo" ? 12000 - i * 700 : 400 - i * 28;
      if (!state.shares[key])
        state.shares[key] = type === "modelo" ? 8700 - i * 420 : 420 - i * 24;
      if (!state.saves[key])
        state.saves[key] = type === "modelo" ? 12300 - i * 600 : 510 - i * 26;
      const post = document.createElement("article");
      post.className = "post ig-post";
      const postTitle = sharedTopics[i];
      const caption =
        type === "modelo"
          ? [
              "Hoy hablo de salud mental digital, pero con energia de verano. #lifestyle",
              "Mismo tema: ansiedad algorítmica. Formato visual perfecto. #body #wellness",
              "Desinformación emocional explicada entre glow y estética.",
              "Filtros y autoestima: tema serio, feed impecable.",
              "Acoso online: reflexiono desde un shooting de playa.",
              "Fatiga digital y autocuidado en clave aspiracional.",
            ][i]
          : [
              "La salud mental digital es un problema colectivo, no una tendencia.",
              "Los algoritmos amplifican ansiedad y comparaciones dañinas.",
              "La desinformación también manipula emociones.",
              "Filtros extremos afectan autoestima, especialmente en adolescentes.",
              "Acoso digital: testimonios, evidencia y rutas de denuncia.",
              "Fatiga por hiperconexión: necesitamos límites y alfabetización mediática.",
            ][i];
      post.innerHTML = `
        <img alt="Post ${type} ${i + 1}" src="${images[(i + 1) % images.length]}" data-post-key="${key}" data-post-title="${postTitle}">
        <div class="ig-actions"><button type="button" class="btn ghost like-btn heart-btn ${state.likedByUser[key] ? "liked" : ""}" aria-label="Me gusta">❤</button><span class="like-count">${formatLikes(state.likes[key])}</span></div>
        <p class="ig-news"><strong>Noticia:</strong> ${postTitle}. ${type === "modelo" ? "Presentada con estética hiperproducida y performativa." : "Presentada con enfoque crítico, social y contextual."}</p>
        <p class="ig-caption">${caption}</p>
        <p class="muted ig-metrics">💬 ${formatLikes(state.commentTotals[key])} · ↗ ${formatLikes(state.shares[key])} compartidos · 🔖 ${formatLikes(state.saves[key])} guardados</p>
        <div class="ig-comments"></div>
        <form class="comment-form"><input type="text" maxlength="90" placeholder="Comenta este post..."><button type="submit" class="btn ghost">Enviar</button></form>
      `;
      const box = post.querySelector(".ig-comments");
      state.comments[key].forEach((c) => box.appendChild(renderComment(c)));
      const imageEl = post.querySelector("img");
      addImageFallback(imageEl);
      const count = post.querySelector(".like-count");
      post.querySelector(".like-btn").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        const alreadyLiked = Boolean(state.likedByUser[key]);
        state.likedByUser[key] = !alreadyLiked;
        state.likes[key] += alreadyLiked ? -1 : 1;
        count.textContent = formatLikes(state.likes[key]);
        btn.classList.toggle("liked", !alreadyLiked);
        btn.classList.add("like-burst");
        setTimeout(() => btn.classList.remove("like-burst"), 230);
        store.set(APP_KEYS.ig, state);
      });
      post.querySelector(".comment-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector("input");
        const t = input.value.trim();
        if (!t) return;
        state.comments[key].push(`tu_usuario: ${t}`);
        state.commentTotals[key] += 1;
        box.appendChild(renderComment(`tu_usuario: ${t}`));
        input.value = "";
        store.set(APP_KEYS.ig, state);
      });
      imageEl.addEventListener("click", () => {
        const list = Array.from(wrap.querySelectorAll("img"));
        modalState.list = list;
        modalState.idx = list.indexOf(imageEl);
        modalState.profile = type;
        openPostModal({
          title: `${type === "modelo" ? "@laura.cepeda" : "@kimberly.loaiza"} · ${postTitle}`,
          image: imageEl.src,
          likes: state.likes[key],
          comments: state.comments[key],
          commentTotal: state.commentTotals[key],
          shares: state.shares[key],
          saves: state.saves[key],
          key,
        });
      });
      wrap.appendChild(post);
    }
  });
  store.set(APP_KEYS.ig, state);
}

function openPostModal(post) {
  const modal = document.getElementById("post-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  requestAnimationFrame(() => modal.classList.add("show"));
  const img = document.getElementById("modal-post-image");
  const title = document.getElementById("modal-post-title");
  const likes = document.getElementById("modal-post-likes");
  const commentsBox = document.getElementById("modal-post-comments");
  img.src = post.image;
  addImageFallback(img);
  title.textContent = post.title;
  likes.textContent = `${formatLikes(post.likes)} likes · 💬 ${formatLikes(post.commentTotal || (post.comments || []).length)} · ↗ ${formatLikes(post.shares || 0)} · 🔖 ${formatLikes(post.saves || 0)}`;
  commentsBox.innerHTML = "";
  post.comments.forEach((c) => commentsBox.appendChild(renderComment(c)));
  const closeBtn = document.getElementById("close-post-modal");
  if (closeBtn)
    closeBtn.onclick = () => {
      modal.classList.remove("show");
      setTimeout(() => modal.classList.add("hidden"), 200);
    };
  const likeBtn = document.getElementById("modal-like-btn");
  if (likeBtn) {
    likeBtn.textContent = "❤";
    likeBtn.classList.add("heart-btn");
    likeBtn.onclick = () => {
      const state = store.get(APP_KEYS.ig) || {
        likes: {},
        comments: {},
        commentTotals: {},
        shares: {},
        saves: {},
        likedByUser: {},
        follows: { modelo: false, feminista: false },
        followers: { modelo: 48200, feminista: 3200 },
      };
      state.likedByUser = state.likedByUser || {};
      const alreadyLiked = Boolean(state.likedByUser[post.key]);
      state.likedByUser[post.key] = !alreadyLiked;
      state.likes[post.key] = Math.max(
        0,
        (state.likes[post.key] || post.likes) + (alreadyLiked ? -1 : 1),
      );
      store.set(APP_KEYS.ig, state);
      likeBtn.classList.toggle("liked", !alreadyLiked);
      likeBtn.classList.add("like-burst");
      setTimeout(() => likeBtn.classList.remove("like-burst"), 230);
      likes.textContent = `${formatLikes(state.likes[post.key])} likes · 💬 ${formatLikes(post.commentTotal || (post.comments || []).length)} · ↗ ${formatLikes(post.shares || 0)} · 🔖 ${formatLikes(post.saves || 0)}`;
    };
  }
  const prev = document.getElementById("modal-prev");
  const next = document.getElementById("modal-next");
  if (prev) prev.onclick = () => navigateModalPost(-1);
  if (next) next.onclick = () => navigateModalPost(1);
}

function navigateModalPost(step) {
  if (!modalState.list.length) return;
  modalState.idx =
    (modalState.idx + step + modalState.list.length) % modalState.list.length;
  const imgEl = modalState.list[modalState.idx];
  const key = imgEl.dataset.postKey;
  const title = imgEl.dataset.postTitle;
  const state = store.get(APP_KEYS.ig) || { likes: {}, comments: {} };
  openPostModal({
    title: `${modalState.profile === "modelo" ? "@laura.cepeda" : "@kimberly.loaiza"} · ${title}`,
    image: imgEl.src,
    likes: state.likes[key] || 0,
    comments: state.comments[key] || [],
    commentTotal: state.commentTotals?.[key] || 0,
    shares: state.shares?.[key] || 0,
    saves: state.saves?.[key] || 0,
    key,
  });
}

function renderComment(text) {
  const row = document.createElement("div");
  row.className = "ig-comment-row";
  const avatar = document.createElement("img");
  avatar.className = "ig-comment-avatar";
  const [user, ...rest] = String(text).split(":");
  const uname = (user || "user").trim();
  avatar.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(uname)}`;
  addImageFallback(avatar);
  const p = document.createElement("p");
  if (rest.length) {
    p.innerHTML = `<span class="ig-comment-user">${uname}:</span>${rest.join(":").trim()}`;
  } else {
    p.textContent = text;
  }
  row.appendChild(avatar);
  row.appendChild(p);
  return row;
}

function renderFollowers(state) {
  document.querySelectorAll("[data-followers-text]").forEach((el) => {
    const p = el.dataset.followersText;
    el.textContent = `${formatLikes(state.followers[p])} seguidores`;
  });
  document.querySelectorAll(".follow-btn").forEach((btn) => {
    const p = btn.dataset.followProfile;
    btn.textContent = state.follows[p] ? "Siguiendo" : "Seguir perfil";
  });
}

function buildNewsDetail(item) {
  if (item.detail) return item.detail;
  const kind =
    item.feedbackKind || (item.status ? "fully_true" : "fully_false");
  const section = item.section || "medios digitales";
  const source = item.source || "fuente no verificada";
  switch (kind) {
    case "fully_true":
      return (
        `<strong>Qué pasó:</strong> ${item.copy}<br>` +
        `<strong>Por qué es confiable:</strong> ${item.why} Puedes contrastarlo con ${source}.<br>` +
        `<strong>Clave en ${section}:</strong> aquí el referente existe; el reto es no confundir formato convincente con verificación.`
      );
    case "altered":
      return (
        `<strong>Qué hay de real:</strong> en ${section} sí circulan debates o avances parecidos, pero no en la forma del titular.<br>` +
        `<strong>Cómo se alteró:</strong> se cambió alcance (de rumor a “ya está en producción”), se mezcló experimento con adopción masiva o se añadió un detalle clave sin respaldo: “${item.copy}”.<br>` +
        `<strong>Verificación:</strong> ${item.why} La fuente ${source} no sustenta la versión publicada.`
      );
    case "misleading":
      return (
        `<strong>Base real:</strong> el titular apela a algo plausible en ${section} (tendencia, tecnología o miedo social conocido).<br>` +
        `<strong>Por qué engaña:</strong> omite contexto, salta de un caso aislado a “todos lo hacen” o presenta correlación como causalidad. ${item.copy}<br>` +
        `<strong>Detalle:</strong> ${item.why}`
      );
    case "manipulated":
      return (
        `<strong>Evento de fondo:</strong> ${item.copy}<br>` +
        `<strong>Manipulación:</strong> se retocaron cifras, citas, capturas o testimonios para forzar una lectura. La fuente ${source} no confirma la versión viral.<br>` +
        `<strong>Verificación:</strong> ${item.why}`
      );
    default:
      return (
        `<strong>Qué afirma el titular:</strong> ${item.copy}<br>` +
        `<strong>Por qué es falsa:</strong> ${item.why} No hay respaldo en ${source}.<br>` +
        `<strong>Truco del simulacro:</strong> imita tono periodístico y autoridad visual para que el vacío de referente pase desapercibido.`
      );
  }
}

function getNewsFeedbackHtml(item, correct) {
  const kind =
    item.feedbackKind || (item.status ? "fully_true" : "fully_false");
  const copy = NEWS_FEEDBACK[kind] || NEWS_FEEDBACK.fully_false;
  const verdict = correct
    ? "Tu respuesta es correcta."
    : "Tu respuesta es incorrecta.";
  return (
    `<strong>${copy.headline}</strong><br>` +
    `<span class="news-verdict ${correct ? "news-verdict-ok" : "news-verdict-bad"}">${verdict}</span><br>` +
    `<span class="muted">${copy.hint}</span><br>` +
    `<span class="news-feedback-detail muted">${buildNewsDetail(item)}</span>`
  );
}

function buildMemoryRevealHtml(memories, correct, total, confAvg) {
  const real = memories.filter((m) => m.status);
  const fake = memories.filter((m) => !m.status);
  const pct = Math.round((correct / total) * 100);
  const realList = real
    .map(
      (m) =>
        `<li><strong>${m.date} · ${m.title}</strong><br><span class="muted">${m.revealNote || m.text}</span></li>`,
    )
    .join("");
  const fakeList = fake
    .map(
      (m) =>
        `<li><strong>${m.date} · ${m.title}</strong><br><span class="muted">${m.revealNote || m.text}</span></li>`,
    )
    .join("");
  return (
    `<div class="reveal-overlay">` +
    `<strong>Tu lectura: ${correct}/${total} aciertos (${pct}%). Confianza promedio: ${confAvg}%.</strong>` +
    `<p class="muted" style="margin-top:10px">Estas tarjetas no son recuerdos privados del grupo. Son <strong>memorias culturales digitales</strong>: escenas que muchas personas vimos en redes, noticias o tendencias (pandemia, mundiales, filtros, IA). La mente las mezcla con lo vivido y a veces sentimos que “estuvimos ahí” aunque solo las consumimos en pantalla.</p>` +
    `<h4 style="margin-top:14px;font-size:1rem">Sí ocurrieron (${real.length})</h4>` +
    `<ul class="memory-reveal-list">${realList}</ul>` +
    `<h4 style="margin-top:14px;font-size:1rem">No ocurrieron como se plantean (${fake.length})</h4>` +
    `<ul class="memory-reveal-list">${fakeList}</ul>` +
    `<p style="margin-top:14px"><em>“La imagen ya no documenta la realidad. La produce.”</em><br>` +
    `<em>“¿Cuántas de tus memorias vienen de experiencias propias… y cuántas de lo que internet te hizo sentir que viviste?”</em></p>` +
    `</div>`
  );
}

function initNewsLab() {
  const lab = document.getElementById("news-lab");
  if (!lab) return;
  const result = document.getElementById("news-result");
  const hud = document.getElementById("round-hud");
  const nextBtn = document.getElementById("next-round");
  const restartBtn = document.getElementById("restart-rounds");
  const progressBar = document.getElementById("news-progress-bar");
  const progressText = document.getElementById("news-progress-text");
  const state = store.get(APP_KEYS.news) || {
    total: NEWS_DECK_SIZE,
    score: 0,
    confidence: [],
    fooledBy: {},
    answered: {},
    deck: [],
  };
  if (!state.fooledBy) state.fooledBy = {};
  if (!state.answered) state.answered = {};
  if (!Array.isArray(state.confidence)) state.confidence = [];
  const rounds = buildNewsRounds();
  const bank = rounds.flatMap((r) =>
    r.items.map((item) => ({ ...item, section: r.section })),
  );
  const buildBalancedDeck = () => {
    const realItems = shuffleArray(
      bank.filter((item) => item.status === true),
    ).slice(0, NEWS_REAL_IN_DECK);
    const fakeItems = shuffleArray(
      bank.filter((item) => item.status === false),
    ).slice(0, NEWS_FAKE_IN_DECK);
    const combined = [...realItems, ...fakeItems];
    if (combined.length < NEWS_DECK_SIZE)
      return shuffleArray(bank).slice(0, NEWS_DECK_SIZE);
    return shuffleArray(combined);
  };
  if (!bank.length) {
    lab.innerHTML =
      "<p class='muted'>No se pudo cargar el laboratorio de noticias.</p>";
    return;
  }
  const deckOutdated =
    !Array.isArray(state.deck) ||
    !state.deck.length ||
    state.total !== NEWS_DECK_SIZE ||
    state.deck.length !== NEWS_DECK_SIZE;
  if (deckOutdated) {
    state.deck = buildBalancedDeck();
    state.total = NEWS_DECK_SIZE;
    state.score = 0;
    state.confidence = [];
    state.fooledBy = {};
    state.answered = {};
    store.set(APP_KEYS.news, state);
  }

  const answeredCount = () => Object.keys(state.answered).length;
  const updateProgress = () => {
    const done = answeredCount();
    const pct = Math.round((done / state.total) * 100);
    if (progressBar) {
      progressBar.setAttribute("data-value", String(pct));
      progressBar.style.width = `${pct}%`;
    }
    if (progressText)
      progressText.textContent = `${pct}% completado · ${done} de ${state.total} noticias respondidas`;
  };
  const render = () => {
    lab.classList.add("reveal");
    result.classList.add("hidden");
    result.classList.remove("news-result-wrong");
    if (nextBtn) nextBtn.classList.add("hidden");
    if (restartBtn) restartBtn.classList.remove("hidden");
    lab.innerHTML = "";
    hud.textContent = `Laboratorio activo · ${state.total} noticias mezcladas · Aciertos ${state.score}`;
    updateProgress();
    state.deck.forEach((item, idx) => {
      const cardKey = `${idx}-${item.title}`;
      const answerRecord = state.answered[cardKey];
      const card = document.createElement("article");
      card.className = "news-item";
      card.innerHTML = `
        <div class="news-image"><img alt="Noticia ${item.type}" src="${getNewsImage(item.type, item.title)}"></div>
        <div class="news-copy">
          <p class="muted">Seccion: ${item.section}</p>
          <h4>${item.title}</h4>
          <p>${item.copy}</p>
          <p class="muted">Fuente mostrada: ${item.source}</p>
          <div class="option-row">
            <button class="btn ghost" type="button" data-answer="real">Creo que es verdadera</button>
            <button class="btn ghost" type="button" data-answer="falsa">Creo que es falsa</button>
          </div>
          <label class="memory-tag">Confianza: <span data-news-conf-text>50%</span></label>
          <input type="range" min="1" max="100" value="50" data-news-conf>
          <p class="muted news-feedback"></p>
        </div>
      `;
      addImageFallback(card.querySelector("img"));
      const conf = card.querySelector("[data-news-conf]");
      const confTxt = card.querySelector("[data-news-conf-text]");
      const feedback = card.querySelector(".news-feedback");
      conf.addEventListener(
        "input",
        () => (confTxt.textContent = `${conf.value}%`),
      );
      card.querySelectorAll("[data-answer]").forEach((btn) =>
        btn.addEventListener("click", () => {
          if (state.answered[cardKey]) return;
          const guessedReal = btn.dataset.answer === "real";
          const correct = guessedReal === item.status;
          if (correct) state.score += 1;
          if (!item.status && guessedReal) {
            state.fooledBy[item.title] = (state.fooledBy[item.title] || 0) + 1;
          }
          state.confidence.push(Number(conf.value));
          state.answered[cardKey] = {
            guessedReal,
            status: item.status,
            confidence: Number(conf.value),
          };
          store.set(APP_KEYS.news, state);
          card.classList.add(correct ? "news-correct" : "news-wrong");
          card.style.boxShadow = correct
            ? "0 0 0 1px rgba(72, 255, 152, 0.7), 0 0 36px rgba(72, 255, 152, 0.35)"
            : "0 0 0 1px rgba(255, 87, 122, 0.8), 0 0 32px rgba(255, 87, 122, 0.4)";
          feedback.innerHTML = getNewsFeedbackHtml(item, correct);
          feedback.classList.add("news-feedback-rich");
          card
            .querySelectorAll("[data-answer]")
            .forEach((b) => (b.disabled = true));
          conf.disabled = true;
          updateProgress();

          if (answeredCount() >= state.total) {
            result.classList.remove("hidden");
            const confAvg = Math.round(
              state.confidence.reduce((a, b) => a + b, 0) /
                Math.max(state.confidence.length, 1),
            );
            const fooled = Object.entries(state.fooledBy)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([t]) => `• ${t}`)
              .join("<br>");
            result.innerHTML =
              `<strong>Resultado final:</strong> ${state.score}/${state.total} (${Math.round((state.score / state.total) * 100)}%) · Confianza promedio ${confAvg}%` +
              `<br><br><strong>Simulacros que más engañaron:</strong><br>${fooled || "• Ninguno"}` +
              `<br><br><strong>Las redes sociales ya no reflejan identidades. Las producen.</strong><br>` +
              `La apariencia no solo modifica la realidad. Empieza a reemplazarla.`;
          }
        }),
      );
      if (answerRecord) {
        const wasCorrect = answerRecord.guessedReal === answerRecord.status;
        card.classList.add(wasCorrect ? "news-correct" : "news-wrong");
        conf.value = String(answerRecord.confidence);
        confTxt.textContent = `${answerRecord.confidence}%`;
        conf.disabled = true;
        card
          .querySelectorAll("[data-answer]")
          .forEach((b) => (b.disabled = true));
        feedback.innerHTML = getNewsFeedbackHtml(item, wasCorrect);
        feedback.classList.add("news-feedback-rich");
      }
      lab.appendChild(card);
    });

    if (answeredCount() >= state.total) {
      result.classList.remove("hidden");
      const confAvg = Math.round(
        state.confidence.reduce((a, b) => a + b, 0) /
          Math.max(state.confidence.length, 1),
      );
      const fooled = Object.entries(state.fooledBy)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => `• ${t}`)
        .join("<br>");
      result.innerHTML =
        `<strong>Resultado final:</strong> ${state.score}/${state.total} (${Math.round((state.score / state.total) * 100)}%) · Confianza promedio ${confAvg}%` +
        `<br><br><strong>Simulacros que más engañaron:</strong><br>${fooled || "• Ninguno"}` +
        `<br><br><strong>Las redes sociales ya no reflejan identidades. Las producen.</strong><br>` +
        `La apariencia no solo modifica la realidad. Empieza a reemplazarla.`;
    }
  };
  if (nextBtn) nextBtn.addEventListener("click", () => render());
  restartBtn.addEventListener("click", () => {
    state.deck = buildBalancedDeck();
    state.total = NEWS_DECK_SIZE;
    state.score = 0;
    state.confidence = [];
    state.fooledBy = {};
    state.answered = {};
    store.set(APP_KEYS.news, state);
    render();
  });
  render();
}

function buildNewsRounds() {
  let falseKindIndex = 0;
  const falseKinds = [
    "fully_false",
    "altered",
    "misleading",
    "manipulated",
  ];
  const withFeedbackKinds = (rounds) =>
    rounds.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        feedbackKind: item.status
          ? "fully_true"
          : falseKinds[falseKindIndex++ % falseKinds.length],
      })),
    }));
  return withFeedbackKinds([
    {
      section: "Tecnologia y redes",
      items: [
        {
          status: false,
          type: "ia",
          title:
            "Instagram prueba función de recuerdos nostalgicos automáticos",
          copy: "Mezcla fotos archivadas y actividad del usuario.",
          source: "ig-labs-beta.net",
          why: "No hay anuncio oficial verificable.",
        },
        {
          status: false,
          type: "ia",
          title:
            "TikTok analiza expresiones faciales para recomendar contenido emocional",
          copy: "Uso de reconocimiento emocional en cámara.",
          source: "tiktok-emotion-track.com",
          why: "Afirmacion sin política pública confirmada.",
        },
        {
          status: false,
          type: "modelo",
          title:
            "Influencers venden packs de autenticidad con fotos casuales preparadas",
          copy: "Contenido planeado para parecer espontáneo.",
          source: "creator-pack-trends.io",
          why: "Se presenta como hecho masivo sin evidencia sólida.",
        },
        {
          status: true,
          type: "ia",
          title:
            "Meta confirmó herramientas de IA para edición automática de imagen y video",
          copy: "Las plataformas amplían funciones de edición generativa.",
          source: "about.fb.com",
          why: "Existe respaldo oficial de la compañía.",
        },
      ],
    },
    {
      section: "Identidad digital",
      items: [
        {
          status: false,
          type: "modelo",
          title:
            "Agencia en Corea administra influencers totalmente virtuales sin aviso",
          copy: "Cuentas con millones y colaboraciones.",
          source: "k-avatar-agency.net",
          why: "No hay documentación confiable del caso.",
        },
        {
          status: false,
          type: "feminista",
          title:
            "Estudiantes crean perfiles hiperrealistas para probar trato social",
          copy: "Usuarios habrían formado relaciones con perfiles falsos.",
          source: "campus-social-lab.info",
          why: "Narrativa creíble sin fuente académica verificable.",
        },
        {
          status: false,
          type: "modelo",
          title:
            "TikTok viraliza rutinas imperfectas planificadas durante horas",
          copy: "La estética real se usa como marketing.",
          source: "trendcore-tok.news",
          why: "No hay estudio sólido que confirme la tendencia exacta.",
        },
        {
          status: true,
          type: "modelo",
          title:
            "Aumentó el uso de filtros faciales y edición extrema en redes",
          copy: "Reportes y análisis muestran crecimiento sostenido.",
          source: "informes de comunicación digital",
          why: "Tema respaldado por observatorios y estudios.",
        },
      ],
    },
    {
      section: "Memoria digital",
      items: [
        {
          status: false,
          type: "ia",
          title:
            "Usuarios recuerdan un apagón mundial de Instagram que nunca ocurrió",
          copy: "Circularon capturas y relatos del supuesto evento.",
          source: "viral-memory-threads.com",
          why: "No hay registro real de ese apagón global.",
        },
        {
          status: false,
          type: "educacion",
          title: "Startup recrea recuerdos familiares completos con IA",
          copy: "Álbumes ficticios desde pocas fotos antiguas.",
          source: "memoryforge-hype.app",
          why: "Producto sin trazabilidad empresarial real.",
        },
        {
          status: false,
          type: "educacion",
          title: "App crea videos falsos de infancia con estética analógica",
          copy: "Se comparten como recuerdos reales.",
          source: "childhood-reel-ai.net",
          why: "No hay evidencia de adopción masiva verificada.",
        },
        {
          status: true,
          type: "educacion",
          title: "Imágenes digitales pueden modificar memoria emocional",
          copy: "La evidencia visual altera cómo recordamos hechos.",
          source: "literatura de psicología cognitiva",
          why: "Existe investigación consolidada sobre el fenómeno.",
        },
      ],
    },
    {
      section: "IA y cultura",
      items: [
        {
          status: false,
          type: "algoritmos",
          title: "Editorial publicó novela IA fingiendo autora humana",
          copy: "El engaño se habría descubierto meses después.",
          source: "book-ai-scandal.news",
          why: "Caso sin fuente editorial verificable.",
        },
        {
          status: false,
          type: "algoritmos",
          title: "Museo digital exhibe artistas ficticios creados por IA",
          copy: "Con biografías y entrevistas inventadas.",
          source: "museum-future-archive.eu",
          why: "No se valida el evento descrito.",
        },
        {
          status: false,
          type: "algoritmos",
          title:
            "Festival aceptó cortos con actores sintéticos indistinguibles",
          copy: "Audiencia no detectó diferencia.",
          source: "cine-synth-awards.live",
          why: "No hay registro oficial de esa edición.",
        },
        {
          status: true,
          type: "algoritmos",
          title:
            "IA generativa produce textos e imágenes difíciles de distinguir",
          copy: "Debate abierto sobre autoría y autenticidad.",
          source: "reportes de industria creativa",
          why: "Afirmación respaldada ampliamente.",
        },
      ],
    },
    {
      section: "Moda y belleza",
      items: [
        {
          status: false,
          type: "modelo",
          title: "Marca reemplaza modelos reales por rostros IA sin avisar",
          copy: "Defienden belleza totalmente digital.",
          source: "beauty-meta-campaign.io",
          why: "No existe comunicado comprobable.",
        },
        {
          status: false,
          type: "modelo",
          title:
            "App permite ver versión hiperperfecta del rostro en tiempo real",
          copy: "Psicólogos alertan efectos negativos.",
          source: "perfectface-live.app",
          why: "No hay respaldo técnico y regulatorio claro.",
        },
        {
          status: false,
          type: "modelo",
          title: "Influencers simulan viajes de lujo con escenarios digitales",
          copy: "Fotos virales hechas en estudio.",
          source: "lux-fake-trip.media",
          why: "Historia plausible sin fuente verificable.",
        },
        {
          status: true,
          type: "modelo",
          title:
            "Filtros digitales se relacionan con presión estética y autoestima",
          copy: "Estudios vinculan comparación social y malestar corporal.",
          source: "estudios de salud mental digital",
          why: "Tema con evidencia académica real.",
        },
      ],
    },
    {
      section: "Educación",
      items: [
        {
          status: false,
          type: "educacion",
          title: "Universidad implementa tutores IA con apariencia humana",
          copy: "Alumnos prefieren hablar con avatares.",
          source: "campus-avatar-update",
          why: "Caso sin prueba institucional.",
        },
        {
          status: false,
          type: "educacion",
          title:
            "Colegio recrea recuerdos escolares digitales para graduaciones",
          copy: "Video híbrido de memorias editadas.",
          source: "school-memory-hub",
          why: "No se evidencia programa real.",
        },
        {
          status: false,
          type: "educacion",
          title: "Estudiantes sustentan tesis con personaje IA emocional",
          copy: "Docentes no detectaron el experimento.",
          source: "thesis-ai-theater.com",
          why: "Afirmación no trazable.",
        },
        {
          status: true,
          type: "educacion",
          title: "La IA transforma procesos educativos y producción académica",
          copy: "Herramientas generativas cambian dinámicas de aprendizaje.",
          source: "informes educación + IA",
          why: "Afirmación ampliamente documentada.",
        },
      ],
    },
    {
      section: "Medios y política",
      items: [
        {
          status: false,
          type: "ia",
          title: "Canal regional probó presentadora virtual 24h",
          copy: "Público no notó que era IA.",
          source: "news-avatar-24.net",
          why: "No hay registro verificable de emisión oficial.",
        },
        {
          status: false,
          type: "ia",
          title: "Video viral muestra político admitiendo guiones IA",
          copy: "Circuló días antes de desmentido.",
          source: "politic-clip-source.live",
          why: "Caso no confirmado en fuentes confiables.",
        },
        {
          status: false,
          type: "ia",
          title: "Campaña recrea voces históricas con IA para anuncios",
          copy: "Generó polémica en redes.",
          source: "voice-campaign-now",
          why: "No hay fuente primaria sólida.",
        },
        {
          status: true,
          type: "ia",
          title:
            "Deepfakes son un desafío creciente para la información digital",
          copy: "Impacto político y social en aumento.",
          source: "informes de verificación y seguridad",
          why: "Consenso experto real.",
        },
      ],
    },
    {
      section: "Relaciones humanas",
      items: [
        {
          status: false,
          type: "ia",
          title: "App permite hablar con simulaciones de personas fallecidas",
          copy: "Usa mensajes y audios antiguos.",
          source: "aftertalk-emotion.ai",
          why: "No hay evidencia de lanzamiento estable.",
        },
        {
          status: false,
          type: "modelo",
          title:
            "Influencer mantuvo relación sentimental con chatbot por meses",
          copy: "Seguidores creyeron que era real.",
          source: "creator-lovebot.trend",
          why: "Historia sin fuentes verificables.",
        },
        {
          status: false,
          type: "ia",
          title: "Red social crea amigos virtuales según estado emocional",
          copy: "Usuarios reportan vínculos intensos.",
          source: "friend-ai-network.social",
          why: "Narrativa plausible sin respaldo técnico.",
        },
        {
          status: true,
          type: "ia",
          title: "Aumentan vínculos emocionales con asistentes virtuales",
          copy: "Cada vez más usuarios desarrollan apego conversacional.",
          source: "estudios interacción humano-IA",
          why: "Fenómeno documentado en investigación reciente.",
        },
      ],
    },
    {
      section: "Entretenimiento",
      items: [
        {
          status: false,
          type: "algoritmos",
          title:
            "Plataforma prepara series con actores completamente digitales",
          copy: "Personajes adaptados al gusto del usuario.",
          source: "stream-ai-cast.net",
          why: "No existe anuncio oficial verificable.",
        },
        {
          status: false,
          type: "algoritmos",
          title: "Concierto holográfico mezcló artistas reales e IA sin aviso",
          copy: "La audiencia lo descubrió después.",
          source: "holo-music-leak",
          why: "No hay fuente primaria confiable.",
        },
        {
          status: false,
          type: "algoritmos",
          title: "Streamer usó avatar hiperrealista secreto durante meses",
          copy: "Audiencia creyó que era persona real.",
          source: "avatar-hidden-stream",
          why: "Caso sin verificación consistente.",
        },
        {
          status: true,
          type: "algoritmos",
          title: "VTubers y avatares virtuales crecen globalmente",
          copy: "Creadores digitales amplían audiencia en plataformas.",
          source: "reportes industria creator economy",
          why: "Tendencia comprobable en métricas públicas.",
        },
      ],
    },
    {
      section: "Hiperrealidad",
      items: [
        {
          status: false,
          type: "ia",
          title: "App mide qué tan auténtica es tu identidad digital",
          copy: "Entrega porcentaje de simulación.",
          source: "auth-meter-pro.ai",
          why: "No existe herramienta validada públicamente.",
        },
        {
          status: false,
          type: "ia",
          title:
            "Startup reemplaza recuerdos traumáticos por memorias positivas",
          copy: "Promesa de terapia artificial.",
          source: "memory-rewrite-startup",
          why: "Afirmación extraordinaria sin evidencia clínica.",
        },
        {
          status: false,
          type: "educacion",
          title: "Usuarios prefieren recuerdos editados a fotos originales",
          copy: "Tendencia viral en comunidades.",
          source: "memory-trend-loop",
          why: "No hay estudio serio que sostenga esa cifra.",
        },
        {
          status: true,
          type: "educacion",
          title:
            "Redes sociales transforman percepción de autenticidad y realidad",
          copy: "La identidad digital se vuelve más performativa.",
          source: "investigación en cultura digital",
          why: "Afirmación respaldada en bibliografía contemporánea.",
        },
      ],
    },
  ]);
}

function initMemoryAlbum() {
  const grid = document.querySelector(".memory-grid");
  if (!grid) return;
  const memories = getMemoryDataset();
  const state = store.get("memoryArchiveState") || {
    answers: {},
    confidence: {},
    revealed: false,
  };
  state.answers = state.answers || {};
  state.confidence = state.confidence || {};
  grid.innerHTML = "";
  memories.forEach((m, idx) => {
    const card = document.createElement("article");
    card.className = "memory card memory-item";
    card.classList.add("reveal");
    card.dataset.memoryTitle = m.title;
    card.dataset.memoryStory = m.text;
    card.dataset.memoryImg = m.image;
    card.dataset.status = m.status ? "true" : "false";
    card.style.setProperty(
      "--r",
      `${(idx % 2 ? 1 : -1) * (1 + (idx % 3) * 0.6)}deg`,
    );
    const confidence = state.confidence[m.title] || 50;
    card.innerHTML = `
      <img class="shot" alt="${m.title}">
      <p class="muted">${m.date}</p>
      <h4>${m.title}</h4>
      <p>${m.text}</p>
      <div class="memory-controls">
        <div class="option-row">
          <button class="btn ghost" type="button" data-memory-vote="real">Creo que ocurrió</button>
          <button class="btn ghost" type="button" data-memory-vote="fake">Creo que es falsa</button>
        </div>
        <label class="memory-tag">Confianza: <span data-confidence-text>${confidence}%</span></label>
        <input type="range" min="1" max="100" value="${confidence}" data-confidence-range>
        <p class="muted memory-feedback"></p>
      </div>
    `;
    const img = card.querySelector(".shot");
    img.src = m.image;
    addImageFallback(img);
    img.addEventListener("click", () => openMemoryModal(card));
    const feedback = card.querySelector(".memory-feedback");
    card.querySelectorAll("[data-memory-vote]").forEach((b) =>
      b.addEventListener("click", () => {
        state.answers[m.title] = b.dataset.memoryVote;
        card
          .querySelectorAll("[data-memory-vote]")
          .forEach((btn) => btn.classList.remove("memory-vote-active"));
        b.classList.add("memory-vote-active");
        card.classList.add("memory-vote-pop");
        setTimeout(() => card.classList.remove("memory-vote-pop"), 260);
        feedback.textContent =
          b.dataset.memoryVote === "real"
            ? "Guardado: marcaste que ocurrió."
            : "Guardado: marcaste que es falsa.";
        store.set("memoryArchiveState", state);
        maybeEnableReveal();
      }),
    );
    const range = card.querySelector("[data-confidence-range]");
    const txt = card.querySelector("[data-confidence-text]");
    range.addEventListener("input", () => {
      txt.textContent = `${range.value}%`;
      state.confidence[m.title] = Number(range.value);
      store.set("memoryArchiveState", state);
    });
    if (state.answers[m.title]) {
      const selected = card.querySelector(
        `[data-memory-vote="${state.answers[m.title]}"]`,
      );
      if (selected) selected.classList.add("memory-vote-active");
      feedback.textContent =
        state.answers[m.title] === "real"
          ? "Guardado: marcaste que ocurrió."
          : "Guardado: marcaste que es falsa.";
    }
    grid.appendChild(card);
  });

  if (!document.getElementById("memory-reveal-action")) {
    const revealBox = document.createElement("section");
    revealBox.className = "card memory-reveal-box";
    revealBox.classList.add("reveal");
    revealBox.innerHTML = `
      <button id="memory-reveal-action" class="btn ghost" type="button" disabled>Revelar resultados de memorias</button>
      <p id="memory-reveal-text" class="muted"></p>
    `;
    grid.parentElement.appendChild(revealBox);
  }
  const revealBtn = document.getElementById("memory-reveal-action");
  const revealText = document.getElementById("memory-reveal-text");
  const memoryByTitle = Object.fromEntries(memories.map((m) => [m.title, m]));
  revealBtn.onclick = () => {
    let correct = 0;
    let confidenceTotal = 0;
    document.querySelectorAll(".memory-item").forEach((card) => {
      const title = card.dataset.memoryTitle;
      const m = memoryByTitle[title];
      const real = card.dataset.status === "true";
      const guess = state.answers[title] === "real";
      const ok = real === guess;
      if (ok) correct += 1;
      confidenceTotal += Number(state.confidence[title] || 50);
      card.classList.add(real ? "revealed-true" : "revealed-false");
      const fb = card.querySelector(".memory-feedback");
      if (fb && m) {
        fb.innerHTML = `<strong>${real ? "Sí ocurrió" : "No ocurrió como se plantea"}</strong><br><span class="muted">${m.revealNote || m.text}</span>`;
      }
    });
    state.revealed = true;
    store.set("memoryArchiveState", state);
    const total = memories.length;
    const confAvg = Math.round(confidenceTotal / total);
    revealText.innerHTML = buildMemoryRevealHtml(
      memories,
      correct,
      total,
      confAvg,
    );
  };

  function maybeEnableReveal() {
    const answered = Object.keys(state.answers).length;
    const btn = document.getElementById("memory-reveal-action");
    if (btn) btn.disabled = answered < memories.length;
  }
  maybeEnableReveal();
  const close = document.getElementById("close-memory-modal");
  if (close)
    close.addEventListener("click", () => {
      const modal = document.getElementById("memory-modal");
      if (modal) {
        modal.classList.remove("show");
        setTimeout(() => modal.classList.add("hidden"), 200);
      }
    });
}

const MEMORY_REVEAL_NOTES = {
  "Las calles vacías durante la pandemia":
    "Sí ocurrió: desde marzo de 2020 hubo confinamientos globales, calles vacías y vida migrada a pantallas. Fue uno de los eventos más documentados del siglo XXI.",
  "El apagón mundial de TikTok":
    "No ocurrió así: TikTok ha tenido caídas puntuales en regiones, pero no un apagón mundial de 48 horas. Es un falso recuerdo colectivo alimentado por capturas y rumores.",
  "La final del Mundial 2022":
    "Sí ocurrió: la final Argentina–Francia fue el 18 de diciembre de 2022 en Catar, vista por cientos de millones en streaming y redes.",
  "El festival de drones de Bogotá":
    "No ocurrió: no hubo un festival masivo de drones en Bogotá como se describe. La imagen evoca espectáculos tecnológicos vistos en otras ciudades, no un hecho local verificable.",
  "El auge de las videollamadas":
    "Sí ocurrió: entre 2020 y 2022 Zoom, Meet y Teams reemplazaron oficinas, clases y reuniones familiares para millones de personas.",
  "La influencer desaparecida durante un live":
    "No ocurrió: es narrativa de creepypasta digital. Los lives con glitches existen, pero no hay caso verificado de una influencer que desapareciera en directo de esa forma.",
  "El boom de los filtros faciales":
    "Sí ocurrió: desde 2020–2021 creció el uso de filtros AR en Instagram, Snapchat y TikTok, con debates sobre autoestima y comparación corporal.",
  "La red social RememberMe":
    "No ocurrió: no existió una plataforma masiva con ese nombre. Mezcla la idea de apps reales de restauración con IA y la fantasía de un archivo emocional global.",
  "El crecimiento de influencers virtuales":
    "Sí ocurrió: VTubers y avatares de marca (p. ej. Lil Miquela, personajes de campañas) ganaron visibilidad entre 2020 y 2024.",
  "El concierto holográfico perdido":
    "No ocurrió: hubo conciertos híbridos y hologramas puntuales, pero no un evento global “perdido” que millones vieran y luego desapareciera sin rastro.",
  "El aumento masivo de filtros en videollamadas":
    "Sí ocurrió: en 2023–2024 muchas personas usaron filtros incluso en trabajo y estudio remoto, no solo en redes personales.",
  "La cafetería viral construida solo para Instagram":
    "Parcialmente inventado: sí existen locales “instagrammables”, pero este caso específico es una escena genérica, no un café documentado con ese nombre.",
  "El crecimiento de los deepfakes":
    "Sí ocurrió: desde 2022–2024 aumentaron videos y audios sintéticos en política, famosos y estafas, alertando a verificadores de medios.",
  "El reality show protagonizado por IA":
    "No ocurrió: hay experimentos y cortos con IA, pero no un reality masivo en prime time donde todos los concursantes fueran generados sin aviso al público.",
  "La explosión de contenido 'día en mi vida'":
    "Sí ocurrió: el formato vlog cotidiano se volvió estándar en TikTok y YouTube entre 2022 y 2024, con rutinas hipereditadas.",
  "El museo de recuerdos artificiales":
    "No ocurrió: hay exposiciones sobre IA y memoria, pero no un museo permanente con ese nombre que recorriera memorias 100 % fabricadas.",
  "El uso de IA para restaurar fotografías antiguas":
    "Sí ocurrió: herramientas como MyHeritage, Remini y modelos generativos popularizaron colorear y reconstruir fotos familiares desde 2022.",
  "La tendencia de alquilar familias falsas para redes sociales":
    "Exagerado / no masivo: circulan anécdotas y sátiras, pero no hay evidencia de una tendencia global y sostenida de “alquilar familias” para posts.",
  "El crecimiento de asistentes virtuales emocionales":
    "Sí ocurrió: ChatGPT, Replika y asistentes de voz generaron debates sobre apego, soledad y límites afectivos desde 2023.",
  "El archivo perdido del internet emocional":
    "No ocurrió: es leyenda digital. Mezcla foros antiguos, nostalgia por la web 1.0 y miedo a que la memoria colectiva esté en servidores opacos.",
};

function getMemoryDataset() {
  const items = [
    {
      date: "Marzo 2020",
      title: "Las calles vacías durante la pandemia",
      text: "Durante meses las ciudades quedaron en silencio. Las videollamadas reemplazaron reuniones y millones vivieron aislados frente a pantallas.",
      status: true,
      image:
        "https://images.pexels.com/photos/3987152/pexels-photo-3987152.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Enero 2021",
      title: "El apagón mundial de TikTok",
      text: "Miles de usuarios afirmaron recordar el día en que TikTok desapareció globalmente durante casi 48 horas.",
      status: false,
      image:
        "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Diciembre 2022",
      title: "La final del Mundial 2022",
      text: "Celebraciones, videos virales y millones de personas viendo la final en tiempo real desde sus teléfonos.",
      status: true,
      image:
        "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Agosto 2023",
      title: "El festival de drones de Bogotá",
      text: "Un supuesto espectáculo tecnológico iluminó el cielo nocturno con miles de drones sincronizados.",
      status: false,
      image:
        "https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Abril 2020",
      title: "El auge de las videollamadas",
      text: "Las pantallas reemplazaron oficinas, clases y encuentros familiares durante años.",
      status: true,
      image:
        "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Noviembre 2021",
      title: "La influencer desaparecida durante un live",
      text: "Miles siguieron un stream lleno de glitches antes de que la transmisión terminara abruptamente.",
      status: false,
      image:
        "https://images.pexels.com/photos/4792729/pexels-photo-4792729.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Junio 2021",
      title: "El boom de los filtros faciales",
      text: "Millones comenzaron a modificar digitalmente sus rostros hasta volver irreconocible la diferencia entre filtro y realidad.",
      status: true,
      image:
        "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Septiembre 2022",
      title: "La red social RememberMe",
      text: "La plataforma prometía crear recuerdos alternativos usando inteligencia artificial y fotografías antiguas.",
      status: false,
      image:
        "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Mayo 2023",
      title: "El crecimiento de influencers virtuales",
      text: "Cada vez más marcas comenzaron a usar personajes digitales como figuras públicas reales.",
      status: true,
      image:
        "https://images.pexels.com/photos/8438951/pexels-photo-8438951.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Octubre 2023",
      title: "El concierto holográfico perdido",
      text: "Miles de usuarios afirmaban haber visto un concierto transmitido globalmente que nunca fue encontrado nuevamente.",
      status: false,
      image:
        "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Febrero 2024",
      title: "El aumento masivo de filtros en videollamadas",
      text: "Las personas comenzaron a usar filtros faciales incluso en reuniones laborales y clases virtuales.",
      status: true,
      image:
        "https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Marzo 2024",
      title: "La cafetería viral construida solo para Instagram",
      text: "Un café minimalista se volvió famoso porque todos sus espacios estaban diseñados únicamente para fotografías.",
      status: false,
      image:
        "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Julio 2023",
      title: "El crecimiento de los deepfakes",
      text: "Videos manipulados comenzaron a circular masivamente haciendo difícil distinguir realidad de simulación.",
      status: true,
      image:
        "https://images.pexels.com/photos/5473958/pexels-photo-5473958.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Noviembre 2024",
      title: "El reality show protagonizado por IA",
      text: "Millones siguieron un programa donde los participantes eran completamente generados artificialmente.",
      status: false,
      image:
        "https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Enero 2024",
      title: "La explosión de contenido 'día en mi vida'",
      text: "Los vlogs cotidianos transformaron actividades normales en espectáculos digitales hiperproducidos.",
      status: true,
      image:
        "https://images.pexels.com/photos/6896221/pexels-photo-6896221.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Abril 2024",
      title: "El museo de recuerdos artificiales",
      text: "Una exposición permitía recorrer memorias completamente fabricadas mediante inteligencia artificial.",
      status: false,
      image:
        "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Mayo 2024",
      title: "El uso de IA para restaurar fotografías antiguas",
      text: "Millones comenzaron a usar inteligencia artificial para colorear y reconstruir fotos familiares.",
      status: true,
      image:
        "https://images.pexels.com/photos/1684149/pexels-photo-1684149.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Junio 2024",
      title: "La tendencia de alquilar familias falsas para redes sociales",
      text: "Usuarios contrataban actores para aparentar estilos de vida perfectos en internet.",
      status: false,
      image:
        "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Febrero 2025",
      title: "El crecimiento de asistentes virtuales emocionales",
      text: "Cada vez más personas desarrollaron vínculos afectivos con inteligencias artificiales conversacionales.",
      status: true,
      image:
        "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      date: "Marzo 2025",
      title: "El archivo perdido del internet emocional",
      text: "Miles compartieron recuerdos de una página misteriosa que aparentemente almacenaba memorias digitales colectivas.",
      status: false,
      image:
        "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  ];
  return items.map((m) => ({
    ...m,
    revealNote: MEMORY_REVEAL_NOTES[m.title] || m.text,
  }));
}

function openMemoryModal(item) {
  const modal = document.getElementById("memory-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  requestAnimationFrame(() => modal.classList.add("show"));
  const img = document.getElementById("memory-modal-image");
  img.src = item.dataset.memoryImg;
  addImageFallback(img);
  document.getElementById("memory-modal-title").textContent =
    item.dataset.memoryTitle;
  document.getElementById("memory-modal-story").textContent =
    item.dataset.memoryStory;
}

function initJuryPanel() {
  const panel = document.getElementById("jury-panel");
  if (!panel) return;
  const summary = document.getElementById("jury-summary");
  const refresh = document.getElementById("refresh-jury");
  const exportBtn = document.getElementById("export-jury");
  const build = () => {
    const auth = store.get(APP_KEYS.auth) || { username: "usuario" };
    const ig = store.get(APP_KEYS.ig) || {
      followers: { modelo: 48200, feminista: 3200 },
      follows: { modelo: false, feminista: false },
      likes: {},
      comments: {},
      shares: {},
      saves: {},
    };
    const news = store.get(APP_KEYS.news) || {
      total: NEWS_DECK_SIZE,
      score: 0,
    };
    const commentsCount = Object.values(ig.comments || {}).reduce(
      (acc, arr) => acc + arr.length,
      0,
    );
    summary.value = `Informe jurado - Cultura y Simulacro
Usuario: ${auth.username}
Noticias respondidas: ${Object.keys(news.answered || {}).length}/${news.total}
Aciertos: ${news.score}/${news.total}
Followers Laura Cepeda: ${ig.followers.modelo}
Followers Kimberly Loaiza: ${ig.followers.feminista}
Sigue modelo: ${ig.follows.modelo ? "si" : "no"}
Sigue feminista: ${ig.follows.feminista ? "si" : "no"}
Likes acumulados: ${Object.values(ig.likes || {}).reduce((a, b) => a + b, 0)}
Comentarios: ${commentsCount}`;
  };
  build();
  refresh.addEventListener("click", build);
  exportBtn.addEventListener("click", () => {
    build();
    const blob = new Blob([summary.value], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte-jurado-simulacro.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function getNewsImage(type, seedText = "") {
  const pools = {
    modelo: [
      "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    feminista: [
      "https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    salud: [
      "https://images.pexels.com/photos/708848/pexels-photo-708848.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/3845658/pexels-photo-3845658.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    ia: [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/8297486/pexels-photo-8297486.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    educacion: [
      "https://images.pexels.com/photos/1184572/pexels-photo-1184572.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    infancia: [
      "https://images.pexels.com/photos/8423055/pexels-photo-8423055.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    algoritmos: [
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    neutral: [
      "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1181438/pexels-photo-1181438.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
  };
  const arr = pools[type] || pools.neutral;
  const seed = String(seedText || type)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return arr[seed % arr.length];
}

function addImageFallback(img) {
  if (!img) return;
  img.addEventListener(
    "error",
    () => {
      img.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1f3554'/><stop offset='1' stop-color='#531f4f'/></linearGradient></defs>
        <rect width='800' height='500' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#dce8ff' font-family='Arial' font-size='30'>Imagen no disponible</text>
      </svg>`,
        );
    },
    { once: true },
  );
}

function formatLikes(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}
function shuffleArray(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function initBars() {
  const bars = document.querySelectorAll(".bar span[data-value]");
  if (!bars.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = `${entry.target.getAttribute("data-value")}%`;
        }
      });
    },
    { threshold: 0.3 },
  );
  bars.forEach((bar) => observer.observe(bar));
  updateRealMetrics();
}

function updateRealMetrics() {
  const news = store.get(APP_KEYS.news) || { score: 0, total: 10 };
  const ig = store.get(APP_KEYS.ig) || {
    followers: { modelo: 48200, feminista: 3200 },
    likes: {},
    comments: {},
    shares: {},
    saves: {},
  };
  const memoryState = store.get("memoryArchiveState") || { confidence: {} };
  const newsPct = Math.max(
    0,
    Math.min(
      100,
      Math.round((news.score / Math.max(news.total || 10, 1)) * 100),
    ),
  );
  const confAvg =
    Array.isArray(news.confidence) && news.confidence.length
      ? Math.round(
          news.confidence.reduce((a, b) => a + b, 0) / news.confidence.length,
        )
      : 50;
  const followBase = Math.max(ig.followers.modelo + ig.followers.feminista, 1);
  const followPct = Math.round((ig.followers.modelo / followBase) * 100);
  const totalLikes = Object.values(ig.likes || {}).reduce((a, b) => a + b, 0);
  const totalComments = Object.values(ig.comments || {}).reduce(
    (a, arr) => a + arr.length,
    0,
  );
  const totalShares = Object.values(ig.shares || {}).reduce((a, b) => a + b, 0);
  const totalSaves = Object.values(ig.saves || {}).reduce((a, b) => a + b, 0);
  const engagePct = Math.max(
    1,
    Math.min(
      100,
      Math.round(
        ((totalLikes + totalShares + totalSaves) /
          Math.max(
            totalLikes + totalComments * 50 + totalShares + totalSaves,
            1,
          )) *
          100,
      ),
    ),
  );
  const confVals = Object.values(memoryState.confidence || {});
  const memoryPct = confVals.length
    ? Math.round(confVals.reduce((a, b) => a + b, 0) / confVals.length)
    : Math.max(15, Math.min(95, Math.round((100 - newsPct) * 0.7 + 20)));

  setMetric(
    "metric-news",
    "metric-news-text",
    newsPct,
    `Acierto real en noticias: ${news.score}/${news.total || 10} (${newsPct}%). Confianza promedio: ${confAvg}%.`,
  );
  setMetric(
    "metric-follow",
    "metric-follow-text",
    followPct,
    `Preferencia por perfil modelo: ${followPct}% frente a perfil feminista.`,
  );
  setMetric(
    "metric-engage",
    "metric-engage-text",
    engagePct,
    `Engagement estético (likes/comentarios): ${engagePct}%.`,
  );
  setMetric(
    "metric-memory",
    "metric-memory-text",
    memoryPct,
    `Percepcion de credibilidad de memorias (estimada por interacción): ${memoryPct}%.`,
  );
}

function setMetric(spanId, textId, value, text) {
  const bar = document.getElementById(spanId);
  const label = document.getElementById(textId);
  if (!bar || !label) return;
  bar.setAttribute("data-value", String(value));
  bar.style.width = `${value}%`;
  label.textContent = text;
}
