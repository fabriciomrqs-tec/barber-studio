document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu-principal");
  function fecharMenu() {
    menu.classList.remove("aberto");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }
  menuToggle.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", fecharMenu));

  const modal = document.getElementById("modal-agendamento");
  const botoes = document.querySelectorAll(".botao-agendar");
  const fechar = document.getElementById("fechar-modal");
  const formulario = document.getElementById("form-agendamento");
  const nome = document.getElementById("nome");
  const servico = document.getElementById("servico");
  const data = document.getElementById("data");
  const horario = document.getElementById("horario");
  const preco = document.getElementById("preco");
  const resultado = document.getElementById("resultado");
  const mensagemGerada = document.getElementById("mensagem-gerada");
  const copiar = document.getElementById("copiar-mensagem");
  const statusCopia = document.getElementById("status-copia");
  let mensagemAtual = "";

  function hojeLocal() {
    const agora = new Date();
    return `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,"0")}-${String(agora.getDate()).padStart(2,"0")}`;
  }
  function atualizarPreco() {
    preco.textContent = Number(servico.value).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
  }
  function limparResultado() {
    resultado.hidden = true;
    mensagemAtual = "";
    statusCopia.textContent = "";
  }
  data.min = hojeLocal();
  atualizarPreco();
  botoes.forEach(botao => botao.addEventListener("click", () => {
    data.min = hojeLocal();
    limparResultado();
    modal.showModal();
    nome.focus();
  }));
  fechar.addEventListener("click", () => modal.close());
  modal.addEventListener("click", evento => { if(evento.target === modal) modal.close(); });
  servico.addEventListener("change", atualizarPreco);
  formulario.addEventListener("input", limparResultado);
  formulario.addEventListener("change", limparResultado);
  formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const nomeCliente = nome.value.trim();
    if (!nomeCliente) { nome.setCustomValidity("Informe seu nome."); nome.reportValidity(); nome.setCustomValidity(""); return; }
    if (data.value < hojeLocal()) { alert("Escolha uma data de hoje em diante."); return; }
    const nomeServico = servico.options[servico.selectedIndex].text.split(" — ")[0];
    const [ano, mes, dia] = data.value.split("-");
    const valor = Number(servico.value).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
    mensagemAtual = `Olá! Meu nome é ${nomeCliente}.\n\nGostaria de solicitar um agendamento na Barber Studio.\n\n✂ Serviço: ${nomeServico}\n📅 Data desejada: ${dia}/${mes}/${ano}\n🕒 Horário desejado: ${horario.value}\n💰 Valor informado: ${valor}\n\nPoderiam confirmar a disponibilidade?`;
    mensagemGerada.textContent = mensagemAtual;
    resultado.hidden = false;
    statusCopia.textContent = "";
    resultado.scrollIntoView({behavior:"smooth",block:"nearest"});
  });
  copiar.addEventListener("click", async () => {
    if (!mensagemAtual) return;
    try {
      await navigator.clipboard.writeText(mensagemAtual);
      statusCopia.textContent = "Mensagem copiada!";
    } catch {
      const campo = document.createElement("textarea");
      campo.value = mensagemAtual;
      campo.style.position = "fixed";
      campo.style.opacity = "0";
      document.body.appendChild(campo);
      campo.focus(); campo.select();
      const copiou = document.execCommand("copy");
      campo.remove();
      statusCopia.textContent = copiou ? "Mensagem copiada!" : "Não foi possível copiar. Selecione o texto acima.";
    }
  });
});
