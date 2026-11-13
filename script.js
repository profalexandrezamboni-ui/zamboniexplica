// ===== Configuração (único lugar para editar) =====
const CONFIG = {
  CHECKOUT_URL: "https://pay.kiwify.com.br/kOr6u1x",
  CHECKOUT_ANNUAL_URL: "https://pay.kiwify.com.br/xlNLeB4",
  VIP_TELEGRAM_URL: "https://t.me/ZamboniExplicaBot?start=lista_fundador",
  ABRE:  "2026-11-10T00:00:00-03:00",   // vendas abertas imediatamente (modelo perpétuo)
  FECHA: "2099-12-31T23:59:59-03:00",   // carrinho sempre aberto (perpétuo)
};

// Permite conferir os estados: ?estado=antes | aberta | encerrada
function estadoAtual(){
  const p = new URLSearchParams(location.search).get("estado");
  if (["antes","aberta","encerrada"].includes(p)) return p;
  const now = Date.now();
  if (now < Date.parse(CONFIG.ABRE)) return "antes";
  if (now <= Date.parse(CONFIG.FECHA)) return "aberta";
  return "encerrada";
}

function aplicarEstado(){
  const est = estadoAtual();
  const status = document.getElementById("status");
  const mainCtas = document.querySelectorAll(".btn.cta-main");
  const btnMensal = document.getElementById("btn-plan-mensal");
  const btnAnual = document.getElementById("btn-plan-anual");
  const waitlistBox = document.getElementById("waitlist-box");
  const label = (b, txt) => { b.innerHTML = txt + ' <span class="arr">→</span>'; };

  if (est === "antes"){
    status.innerHTML = 'Pré-venda de fundador abre em <b>1º de dezembro</b> · entre na Lista Prioritária gratuita';
    if (waitlistBox) waitlistBox.classList.add("active");
    mainCtas.forEach(b => {
      b.href = "#oferta";
      if (!b.closest(".dock")) label(b, '<span>Entrar na Lista Prioritária de Fundador<span class="px"> — R$ 9,90/mês</span></span>');
      else label(b, "Lista VIP");
    });
    if (btnMensal){
      btnMensal.href = CONFIG.VIP_TELEGRAM_URL;
      btnMensal.target = "_blank";
      btnMensal.rel = "noopener";
      label(btnMensal, "📲 Ser avisado no Telegram (1º/12)");
    }
    if (btnAnual){
      btnAnual.href = CONFIG.VIP_TELEGRAM_URL;
      btnAnual.target = "_blank";
      btnAnual.rel = "noopener";
      label(btnAnual, "📲 Reservar vaga anual no Telegram");
    }
    document.querySelectorAll(".cta-note").forEach(n => {
      n.innerHTML = 'A pré-venda com preço congelado (R$ 9,90/mês ou R$ 99/ano) abre de <b>1º a 7 de dezembro</b>. Entre na Lista Prioritária em 1 toque para receber o link de abertura.';
    });
  } else if (est === "aberta"){
    if (waitlistBox) waitlistBox.classList.remove("active");
    status.innerHTML = 'Meu primeiro projeto social de educação jurídica cidadã · <b>inscrições abertas agora</b> por um valor simbólico (R$ 9,90/mês — 33 centavos/dia)';
    mainCtas.forEach(b => {
      b.href = "#oferta";
      if (!b.closest(".dock")) label(b, '<span>Quero fazer parte do projeto<span class="px"> — R$ 9,90/mês</span></span>');
      else label(b, "Fazer parte");
    });
    if (btnMensal){
      btnMensal.href = CONFIG.CHECKOUT_URL;
      btnMensal.rel = "noopener";
      label(btnMensal, "Entrar no Mensal — R$ 9,90/mês");
    }
    if (btnAnual){
      btnAnual.href = CONFIG.CHECKOUT_ANNUAL_URL;
      btnAnual.rel = "noopener";
      label(btnAnual, "Entrar no Anual — R$ 99/ano");
    }
    document.querySelectorAll(".cta-note").forEach(n => {
      n.innerHTML = 'Inscrições abertas agora por um valor simbólico para manter viva a estrutura (<b>R$ 9,90/mês</b> ou <b>R$ 99/ano</b> com 2 meses grátis) + acesso imediato ao portal.';
    });
  } else {
    if (waitlistBox) waitlistBox.classList.remove("active");
    status.innerHTML = 'A pré-venda de fundador foi encerrada · obrigado a quem entrou';
    [...mainCtas, btnMensal, btnAnual].filter(Boolean).forEach(b => {
      b.removeAttribute("href");
      b.setAttribute("aria-disabled","true");
      b.innerHTML = b.closest(".dock") ? "Encerrada" : "Pré-venda encerrada";
    });
    document.querySelectorAll(".cta-note").forEach(n => {
      n.textContent = "As assinaturas estão fechadas por enquanto. Quando reabrirem, o aviso sai no @profalexandrezamboni.";
    });
  }
}

// ===== As seis perguntas (Degustação aberta nas 1-3 + Suspense editorial nas 4-6) =====
const PERGUNTAS = [
  [
    "Qual é a afirmação exata?",
    "Nas redes, o caso virou duas frases prontas: “o hotel matou a hóspede” e “ela sentou na janela, a culpa é dela”. Repare que nenhuma das duas responde à pergunta que importa. A meu ver, ela é mais precisa: se uma hóspede se senta no batente e uma peça da estrutura cede, o hotel responde, mesmo com o risco que ela assumiu?",
    "Amostra aberta · Pergunta 1 de 6",
    false
  ],
  [
    "O que sabemos e de qual fonte?",
    "Antes de opinar, a gente separa o que se sabe de onde veio cada informação. As câmeras mostram que ela se sentou no batente, apoiou as costas numa estrutura de alumínio e a peça cedeu. A polícia investiga a morte como acidental e apura se o hotel tem responsabilidade. E perceba: a perícia ainda não concluiu a causa.",
    "Fontes citadas na edição: Polícia Civil e SSP-MA, segundo g1 e Metrópoles.",
    false
  ],
  [
    "O que é fato, relato, inferência ou opinião?",
    "É aqui que a maioria das discussões se perde. Fato: a peça cedeu, e as câmeras mostram isso. Relato: o namorado disse que os dois tinham bebido. Inferência: “ela caiu porque bebeu” e, da mesma forma, “a janela era irregular”, enquanto a perícia não disser. Opinião qualificada: um engenheiro que analisou o vídeo, mas sem laudo.",
    "Amostra aberta · Pergunta 3 de 6",
    false
  ],
  [
    "Que outras explicações cabem nos dados?",
    "Na edição completa, examinamos as normas técnicas de engenharia (ABNT NBR 14718 para guarda-corpos vs. NBR 10821 para esquadrias) e a hipótese que quase todo mundo esquece nas redes quando dois fatores acontecem ao mesmo tempo.",
    "",
    true
  ],
  [
    "O que falta saber e poderia mudar a conclusão?",
    "Listamos os 5 pontos técnicos exatos que a perícia precisa responder — e mostramos por que um único detalhe sobre a função daquela peça de alumínio vira o resultado jurídico de ponta-cabeça.",
    "",
    true
  ],
  [
    "O que é responsável concluir agora?",
    "Cruzamos o art. 14 do Código de Defesa do Consumidor com os arts. 945 e 948 do Código Civil em um fluxograma visual passo a passo: quando o hotel fica isento, quando indeniza integralmente e como funciona a divisão proporcional.",
    "",
    true
  ],
];

function initPerguntas(){
  const btns = [...document.querySelectorAll(".qbtn")];
  const panel = document.getElementById("qpanel");
  if (!btns.length || !panel) return;
  const show = (i, focus) => {
    btns.forEach((b,j) => { b.setAttribute("aria-selected", j===i ? "true":"false"); b.tabIndex = j===i ? 0 : -1; });
    const [t, p, s, locked] = PERGUNTAS[i];
    const lockHtml = locked
      ? `<div class="locked-cta"><b>🔒 Desfecho completo exclusivo na Área do Assinante</b>Ao entrar como assinante fundador (R$ 9,90/mês), você lê e ouve imediatamente as 6 perguntas completas desta edição + o Dicionário de 20 Conceitos.<br><a href="#oferta">Ver oferta de fundador →</a></div>`
      : "";
    panel.innerHTML = `<div class="fade"><div class="kicker">Pergunta ${i+1} · no caso do hotel</div><h3>${t}</h3><p>${p}</p>${s ? `<div class="src">${s}</div>` : ""}${lockHtml}</div>`;
    if (focus) btns[i].focus();
  };
  btns.forEach((b,i) => {
    b.addEventListener("click", () => show(i));
    b.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight"){ e.preventDefault(); show((i+1)%btns.length, true); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft"){ e.preventDefault(); show((i-1+btns.length)%btns.length, true); }
    });
  });
  show(0);
}

// ===== Teste Rápido Interativo de 10 Segundos na Amostra =====
window.answerSampleQuiz = function(btn, isCorrect){
  const wrap = btn.closest(".sample-quiz");
  if (!wrap) return;
  wrap.querySelectorAll(".sq-btn").forEach(b => {
    b.classList.remove("correct", "wrong");
  });
  btn.classList.add(isCorrect ? "correct" : "wrong");
  const fb = wrap.querySelector(".sq-feedback");
  if (!fb) return;
  fb.classList.add("show");
  if (isCorrect){
    fb.innerHTML = `<b>✅ Na mosca! Você pensou como a lei pensa.</b> No Direito do Consumidor, o risco assumido pela vítima não apaga automaticamente um eventual defeito da estrutura — os dois fatores entram numa regra específica do Código Civil. <a href="#oferta">Desbloqueie a explicação completa + áudio na Área do Assinante →</a>`;
  } else {
    fb.innerHTML = `<b>🧐 Quase todo mundo responde isso nas redes — mas a lei olha diferente!</b> Nem o hotel responde no automático por tudo, nem o risco da hóspede anula sozinho uma eventual falha da estrutura. Há uma terceira chave no Código Civil que decide esse impasse. <a href="#oferta">Veja o desfecho completo na Área do Assinante →</a>`;
  }
};

// ===== FAQ com animação =====
function initFaq(){
  document.querySelectorAll(".faq details").forEach(d => {
    const s = d.querySelector("summary"), a = d.querySelector(".ans");
    s.addEventListener("click", e => {
      e.preventDefault();
      if (d.open){
        a.style.height = a.scrollHeight + "px";
        requestAnimationFrame(() => { a.style.height = "0px"; });
        a.addEventListener("transitionend", () => { d.open = false; a.style.height = ""; }, {once:true});
      } else {
        d.open = true;
        a.style.height = "0px";
        requestAnimationFrame(() => { a.style.height = a.scrollHeight + "px"; });
        a.addEventListener("transitionend", () => { a.style.height = ""; }, {once:true});
      }
    });
  });
}

// ===== Revelação ao rolar e barra fixa no celular =====
function initScroll(){
  const els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting){
        const sib = [...e.target.parentElement.children].filter(c => c.classList.contains("rv"));
        e.target.style.transitionDelay = (Math.max(0, sib.indexOf(e.target)) * 70) + "ms";
        e.target.classList.add("in"); io.unobserve(e.target);
      }
    }), {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add("in"));

  const dock = document.getElementById("dock");
  const hero = document.querySelector(".hero"), oferta = document.getElementById("oferta");
  if (!dock || !hero || !oferta) return;
  const onScroll = () => {
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const r = oferta.getBoundingClientRect();
    const atOffer = r.top < innerHeight && r.bottom > 0;
    dock.classList.toggle("show", pastHero && !atOffer);
  };
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
}

aplicarEstado(); initPerguntas(); initFaq(); initScroll();
