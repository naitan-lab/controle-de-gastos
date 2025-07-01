const form = document.getElementById('form-gasto');
const descricaoInput = document.getElementById('descricao');
const valorInput = document.getElementById('valor');
const categoriaInput = document.getElementById('categoria');
const dataInput = document.getElementById('data');
const lista = document.getElementById('lista-gastos');
const totalSpan = document.getElementById('total');

let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const descricao = descricaoInput.value.trim();
  const valor = parseFloat(valorInput.value);
  const categoria = categoriaInput.value.trim();
  const data = dataInput.value;

  if (!descricao || isNaN(valor) || !categoria || !data) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const gasto = {
    id: Date.now(),
    descricao,
    valor,
    categoria,
    data,
  };

  gastos.push(gasto);
  salvarDados();
  atualizarTudo();
  form.reset();
});

function adicionarGastoNaLista(gasto) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${gasto.descricao} - R$ ${gasto.valor.toFixed(2)} (${
    gasto.categoria
  })</span>
    <button onclick="removerGasto(${
      gasto.id
    })" title="Excluir gasto">🗑️</button>
  `;
  lista.appendChild(li);
}

function atualizarLista(filtrados = null) {
  const listaAtual = filtrados || gastos;
  lista.innerHTML = '';
  listaAtual.forEach(adicionarGastoNaLista);
}

function atualizarTotal(filtrados = null) {
  const listaAtual = filtrados || gastos;
  const total = listaAtual.reduce((acc, g) => acc + g.valor, 0);
  totalSpan.textContent = `R$ ${total.toFixed(2)}${
    filtrados ? ' (filtrado)' : ''
  }`;
}

function removerGasto(id) {
  gastos = gastos.filter(g => g.id !== id);
  salvarDados();
  atualizarTudo();
}

function salvarDados() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

function filtrarPorMes() {
  const filtro = document.getElementById('filtro-mes').value;
  if (!filtro) return;

  const [ano, mes] = filtro.split('-');

  const gastosFiltrados = gastos.filter(g => {
    const data = new Date(g.data);
    return (
      data.getFullYear() == parseInt(ano) &&
      data.getMonth() + 1 == parseInt(mes)
    );
  });

  atualizarLista(gastosFiltrados);
  atualizarTotal(gastosFiltrados);
}

function limparFiltro() {
  document.getElementById('filtro-mes').value = '';
  atualizarTudo();
}

function atualizarTudo() {
  atualizarLista();
  atualizarTotal();
}

atualizarTudo();
