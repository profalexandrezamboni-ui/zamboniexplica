// ===== Configuração (único lugar para editar) =====
const CONFIG = {
  // Link do checkout da assinatura na Kiwify (plano Assinante fundador, R$ 9,90/mês).
  CHECKOUT_URL: "https://pay.kiwify.com.br/kOr6u1x",
  ABRE:  "2026-12-01T00:00:00-03:00",   // início da pré-venda (Brasília)
  FECHA: "2026-12-07T23:59:59-03:00",   // fim da pré-venda (Brasília)
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
  const ctas = document.querySelectorAll(".btn.cta");
  const label = (b, txt) => { b.innerHTML = txt + ' <span class="arr">→</span>'; };

  if (est === "antes"){
    status.innerHTML = 'A pré-venda de fundador abre em <b>1º de dezembro</b> · primeira edição no domingo, 13/12, às 8h';
    ctas.forEach(b => {
      b.href = "#amostra";
      if (!b.closest(".dock")) label(b, "A pré-venda abre em 1º de dezembro · ver a amostra");
      else label(b, "Ver amostra");
    });
    document.querySelectorAll(".cta-note").forEach(n => {
      n.innerHTML = 'Pré-venda de fundador de 1º a 7 de dezembro, por R$ 9,90/mês. Para ser avisado, ative as notificações do <a class="link" href="https://www.instagram.com/profalexandrezamboni/" target="_blank" rel="noopener">@profalexandrezamboni</a>.';
    });
  } else if (est === "aberta"){
    status.innerHTML = 'Pré-venda de fundador aberta <b>até segunda, 7/12, às 23h59</b> · primeira edição no domingo, 13/12, às 8h';
    ctas.forEach(b => {
      if (CONFIG.CHECKOUT_URL){ b.href = CONFIG.CHECKOUT_URL; b.rel = "noopener"; }
      else { b.href = "#oferta"; b.dataset.semCheckout = "1"; }
    });
  } else {
    status.innerHTML = 'A pré-venda de fundador foi encerrada · obrigado a quem entrou';
    ctas.forEach(b => {
      b.removeAttribute("href"); b.setAttribute("aria-disabled","true");
      b.innerHTML = b.closest(".dock") ? "Encerrada" : "Pré-venda encerrada";
    });
    document.querySelectorAll(".cta-note").forEach(n => {
      n.textContent = "As assinaturas estão fechadas por enquanto. Quando reabrirem, o aviso sai no @profalexandrezamboni.";
    });
  }
}

// ===== As seis perguntas, aplicadas ao caso do hotel =====
const PERGUNTAS = [
  ["Qual é a afirmação exata?",
   "Nas redes, o caso virou duas frases prontas: “o hotel matou a hóspede” e “ela sentou na janela, a culpa é dela”. Repare que nenhuma das duas responde à pergunta que importa. A meu ver, ela é mais precisa: se uma hóspede se senta no batente e uma peça da estrutura cede, o hotel responde, mesmo com o risco que ela assumiu?"],
  ["O que sabemos e de qual fonte?",
   "Antes de opinar, a gente separa o que se sabe de onde veio cada informação. As câmeras mostram que ela se sentou no batente, apoiou as costas numa estrutura de alumínio e a peça cedeu. A polícia investiga a morte como acidental e apura se o hotel tem responsabilidade. E perceba: a perícia ainda não concluiu a causa.",
   "Fontes citadas na edição: Polícia Civil e SSP-MA, segundo g1 e Metrópoles."],
  ["O que é fato, relato, inferência ou opinião?",
   "É aqui que a maioria das discussões se perde. Fato: a peça cedeu, e as câmeras mostram isso. Relato: o namorado disse que os dois tinham bebido. Inferência: “ela caiu porque bebeu” e, da mesma forma, “a janela era irregular”, enquanto a perícia não disser. Opinião qualificada: um engenheiro que analisou o vídeo, mas sem laudo."],
  ["Que outras explicações cabem nos dados?",
   "Eu vejo pelo menos três: uma falha da instalação, se a peça funcionava como proteção contra queda; um uso incompatível com a função, se ela era só parte da janela; ou as duas coisas juntas. E essa última, a meu ver, é a que mais gente esquece."],
  ["O que falta saber e poderia mudar a conclusão?",
   "Se você me perguntar o que eu precisaria saber: qual era a função da peça que cedeu, como estava fixada, a altura do peitoril, que força provocou o desprendimento e, principalmente, o laudo da perícia. Qualquer um desses itens, sozinho, pode virar a análise de lado."],
  ["O que é responsável concluir agora?",
   "Pelo Código de Defesa do Consumidor, o hotel responde por defeito do serviço independentemente de culpa, mas pode se defender provando que não havia defeito ou que a conduta da vítima foi a causa exclusiva. E, se as duas coisas contribuíram, a indenização pode ser reduzida. A meu ver, hoje não dá para cravar nem uma coisa nem outra.",
   "Base legal citada na edição: CDC, art. 14; Código Civil, arts. 945 e 948."],
];

function initPerguntas(){
  const btns = [...document.querySelectorAll(".qbtn")];
  const panel = document.getElementById("qpanel");
  const show = (i, focus) => {
    btns.forEach((b,j) => { b.setAttribute("aria-selected", j===i ? "true":"false"); b.tabIndex = j===i ? 0 : -1; });
    const [t, p, s] = PERGUNTAS[i];
    panel.innerHTML = `<div class="fade"><div class="kicker">Pergunta ${i+1} · no caso do hotel</div><h3>${t}</h3><p>${p}</p>${s ? `<div class="src">${s}</div>` : ""}</div>`;
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
  const onScroll = () => {
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const r = oferta.getBoundingClientRect();
    const atOffer = r.top < innerHeight && r.bottom > 0;
    dock.classList.toggle("show", pastHero && !atOffer);
  };
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
}

aplicarEstado(); initPerguntas(); initFaq(); initScroll();
