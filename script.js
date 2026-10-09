// ===== CONFIGURAÇÃO =====
// WhatsApp com país + DDD, só números. Ex.: 5561999999999
const WHATSAPP_NUMERO = "55DDDNUMERO";
const MENSAGEM_PADRAO = "Olá, Flávia! Vi seu site e gostaria de saber mais sobre seus quadros.";

// Títulos personalizados para as obras
const TITULOS_ESPECIAIS = {
  1: "Lua e vinil",
  2: "Mulher e ibis",
  3: "Gata de colar",
  4: "Dança sob a lua",
  5: "Retrato em trio",
  6: "Guardião da floresta",
  7: "Abraço dourado"
};

// QUANTIDADE TOTAL DE ESPAÇOS RESERVADOS
const TOTAL_OBRAS = 20; 

// Geração automática das obras (buscando diretamente na raiz: obra-01.jpg até obra-20.jpg)
const OBRAS = Array.from({ length: TOTAL_OBRAS }, (_, index) => {
  const numero = String(index + 1).padStart(2, "0"); // Formata 01, 02... 20
  const numInt = index + 1;
  const titulo = TITULOS_ESPECIAIS[numInt] || `Obra ${numero}`;
  
  return {
    arquivo: `obra-${numero}.jpg`, // Caminho sem a pasta images/
    titulo: titulo,
    alt: `Quadro ${titulo} por Flávia Rebouças`
  };
});

// Helper de Link do WhatsApp
const zap = (msg) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;

// Atualiza os links de WhatsApp na página
const elZapPrincipal = document.getElementById("zap-principal");
if (elZapPrincipal) elZapPrincipal.href = zap(MENSAGEM_PADRAO);

const elZapFlutuante = document.getElementById("zap-flutuante");
if (elZapFlutuante) elZapFlutuante.href = zap(MENSAGEM_PADRAO);

const elZapHero = document.getElementById("zap-hero");
if (elZapHero) elZapHero.href = zap(MENSAGEM_PADRAO);

// Ano automático no rodapé
const elAno = document.getElementById("ano");
if (elAno) elAno.textContent = new Date().getFullYear();

// Corrigir os caminhos das imagens da Hero para a raiz
const imgColA = document.querySelector(".col-a");
if (imgColA) imgColA.src = "obra-02.jpg";

const imgColB = document.querySelector(".col-b");
if (imgColB) imgColB.src = "obra-04.jpg";

const imgColC = document.querySelector(".col-c");
if (imgColC) imgColC.src = "obra-06.jpg";

// Elementos da galeria e lightbox
const galeria = document.getElementById("galeria");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbLegenda = document.getElementById("lb-legenda");
const lbZap = document.getElementById("lb-zap");
let atual = 0, origem = null;

// Renderiza todas as obras na galeria
if (galeria) {
  galeria.innerHTML = "";
  OBRAS.forEach((o, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "quadro";
    b.setAttribute("aria-label", `Ampliar ${o.titulo}`);
    
    // Se a imagem não existir na raiz do repositório, oculta o quadro para não quebrar a tela
    b.innerHTML = `
      <div class="moldura">
        <img src="${o.arquivo}" alt="${o.alt}" loading="lazy" onerror="this.closest('.quadro').style.display='none';">
      </div>
      <span class="legenda">${o.titulo}</span>
    `;
    
    b.addEventListener("click", () => abrir(i, b));
    galeria.appendChild(b);
  });
}

function mostrar(i) {
  atual = (i + OBRAS.length) % OBRAS.length;
  const o = OBRAS[atual];
  if (lbImg) {
    lbImg.src = o.arquivo;
    lbImg.alt = o.alt;
  }
  if (lbLegenda) lbLegenda.textContent = o.titulo;
  if (lbZap) lbZap.href = zap(`Olá, Flávia! Tenho interesse na obra "${o.titulo}". Ainda está disponível?`);
}

function abrir(i, el) {
  origem = el;
  mostrar(i);
  if (lb) {
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    const btnFechar = document.getElementById("lb-fechar");
    if (btnFechar) btnFechar.focus();
  }
}

function fechar() {
  if (lb) {
    lb.hidden = true;
    document.body.style.overflow = "";
  }
  if (origem) origem.focus();
}

// Eventos de fechar e navegar no Lightbox
const lbFechar = document.getElementById("lb-fechar");
if (lbFechar) lbFechar.addEventListener("click", fechar);

const lbAnt = document.getElementById("lb-ant");
if (lbAnt) lbAnt.addEventListener("click", () => mostrar(atual - 1));

const lbProx = document.getElementById("lb-prox");
if (lbProx) lbProx.addEventListener("click", () => mostrar(atual + 1));

if (lb) {
  lb.addEventListener("click", (e) => { 
    if (e.target === lb) fechar(); 
  });
}

document.addEventListener("keydown", (e) => {
  if (!lb || lb.hidden) return;
  if (e.key === "Escape") fechar();
  if (e.key === "ArrowLeft") mostrar(atual - 1);
  if (e.key === "ArrowRight") mostrar(atual + 1);
});
