// produtos.js - lista demo e renderização

const PRODUCTS = [
  {id:1,title:'Kettlebell 8kg',price:99.90,image:'images/kettlebell.jpg',desc:'Kettlebell para treino funcional.'},
  {id:2,title:'Halter 10kg',price:149.90,image:'images/halter.jpg',desc:'Halter com pegada ergonômica.'},
  {id:3,title:'Tapete de Yoga',price:59.90,image:'images/tapete.jpg',desc:'Tapete antiderrapante.'}
];

function formatCurrency(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function renderProdutosList(){
  const el = document.getElementById('produtos-list');
  if(!el) return;
  el.innerHTML = PRODUCTS.map(p=>`
    <div class="produto-card">
      <img src="${p.image}" alt="${p.title}"/>
      <h4>${p.title}</h4>
      <small>${p.desc}</small>
      <p><strong>${formatCurrency(p.price)}</strong></p>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button data-id="${p.id}" class="btn add-to-cart">Adicionar</button>
        <a class="btn" href="produto-detalhe.html?id=${p.id}">Ver</a>
      </div>
    </div>
  `).join('');

  // bind botões
  el.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      addToCart(id,1);
      alert('Produto adicionado ao carrinho (simulado)');
    });
  });
}

function renderProdutoDetalhe(){
  const el = document.getElementById('produto-detalhe');
  if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ el.innerHTML = '<p>Produto não encontrado.</p>'; return; }
  el.innerHTML = `
    <img src="${p.image}" alt="${p.title}"/>
    <div>
      <h2>${p.title}</h2>
      <p>${p.desc}</p>
      <p><strong>${formatCurrency(p.price)}</strong></p>
      <div style="margin-top:12px">
        <button class="btn" id="det-add">Adicionar ao carrinho</button>
      </div>
    </div>
  `;
  document.getElementById('det-add').addEventListener('click', ()=>{ addToCart(p.id,1); alert('Adicionado ao carrinho'); });
}

// auto render
document.addEventListener('DOMContentLoaded', ()=>{
  renderProdutosList();
  renderProdutoDetalhe();
});
