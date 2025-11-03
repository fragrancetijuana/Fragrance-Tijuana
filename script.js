/* ==========================
   PRODUCTOS
========================== */
const products = [
  // Perfumes completos
  { id:'stronger-100', name:'Stronger With You Parfum', image:'img/stronger.jpg', size:'100ml', price:2499 },
  { id:'badboy-100', name:'Bad Boy (Carolina Herrera) Le Parfum', image:'img/badboy.jpg', size:'100ml', price:2499 },
  { id:'onenight-100', name:'One Night (Carlo Corinto Paris Man)', image:'img/onenight.jpg', size:'100ml', price:1000 },
  { id:'explorer-100', name:'Montblanc Explorer Platinum', image:'img/explorer.jpg', size:'100ml', price:1500 },

  // Decants 10ml
  { id:'stronger-10', name:'Stronger With You Parfum', image:'img/stronger.jpg', size:'10ml', price:250 },
  { id:'badboy-10', name:'Bad Boy', image:'img/badboy.jpg', size:'10ml', price:250 },
  { id:'onenight-10', name:'One Night', image:'img/onenight.jpg', size:'10ml', price:150 },
  { id:'explorer-10', name:'Explorer Platinum', image:'img/explorer.jpg', size:'10ml', price:150 },

  // Decants 5ml
  { id:'stronger-5', name:'Stronger With You Parfum', image:'img/stronger.jpg', size:'5ml', price:150 },
  { id:'badboy-5', name:'Bad Boy', image:'img/badboy.jpg', size:'5ml', price:150 },
  { id:'onenight-5', name:'One Night', image:'img/onenight.jpg', size:'5ml', price:90 },
  { id:'explorer-5', name:'Explorer Platinum', image:'img/explorer.jpg', size:'5ml', price:90 },

  // Decants 3ml
  { id:'stronger-3', name:'Stronger With You Parfum', image:'img/stronger.jpg', size:'3ml', price:90 },
  { id:'badboy-3', name:'Bad Boy', image:'img/badboy.jpg', size:'3ml', price:90 },
  { id:'onenight-3', name:'One Night', image:'img/onenight.jpg', size:'3ml', price:50 },
  { id:'explorer-3', name:'Explorer Platinum', image:'img/explorer.jpg', size:'3ml', price:50 }
];

/* ==========================
   RENDER CATÁLOGO
========================== */
const fullGrid = document.getElementById('full-grid');
const decantGrid = document.getElementById('decant-grid');

products.forEach(p => {
  const el = document.createElement('div');
  el.className = "card rounded-2xl p-4 flex flex-col";
  el.innerHTML = `
    <div class="img-fit mb-4"><img src="${p.image}" alt="${p.name}"></div>
    <div class="flex-1">
      <div class="font-semibold text-white">${p.name}</div>
      <div class="text-sm text-gray-300">${p.size}</div>
      <div class="mt-3 text-white font-medium">$${p.price} MXN</div>
    </div>
    <div class="mt-4 flex gap-2">
      <button class="flex-1 px-4 py-2 rounded-xl btn-accent" onclick='addToCart("${p.id}")'>Añadir</button>
    </div>
  `;
  if(p.size === '100ml'){
    fullGrid.appendChild(el);
  } else {
    el.querySelector('.font-semibold').innerText = `${p.name} - Decant`;
    decantGrid.appendChild(el);
  }
});

/* ==========================
   CARRITO
========================== */
let cart = JSON.parse(localStorage.getItem('ft_cart') || '[]');
updateCartUI();

function addToCart(id) {
  const prod = products.find(x => x.id === id);
  if(!prod) return;
  cart.push(prod);
  localStorage.setItem('ft_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const itemsWrap = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if(!itemsWrap || !cartCount || !cartTotal) return;

  cartCount.innerText = cart.length;
  itemsWrap.innerHTML = '';
  let total = 0;

  cart.forEach((it, idx) => {
    total += it.price;
    const row = document.createElement('div');
    row.className = 'flex items-center gap-3';
    row.innerHTML = `
      <img src="${it.image}" class="w-16 h-16 rounded"/>
      <div class="flex-1">
        <div class="font-medium">${it.name}</div>
        <div class="text-sm text-gray-400">${it.size}</div>
      </div>
      <div class="text-white font-semibold">$${it.price}</div>
      <button class="ml-4 text-sm text-red-400" onclick="removeFromCart(${idx})">Eliminar</button>
    `;
    itemsWrap.appendChild(row);
  });

  cartTotal.innerText = `$${total}`;
}

function removeFromCart(i) {
  cart.splice(i,1);
  localStorage.setItem('ft_cart', JSON.stringify(cart));
  updateCartUI();
}

function clearCart() {
  cart = [];
  localStorage.setItem('ft_cart', '[]');
  updateCartUI();
}

/* ==========================
   MODAL CARRITO
========================== */
document.getElementById('open-cart').addEventListener('click', () => {
  document.getElementById('cart-modal').classList.remove('hidden');
  document.getElementById('cart-modal').style.display = 'flex';
});
function closeCart() {
  document.getElementById('cart-modal').classList.add('hidden');
  document.getElementById('cart-modal').style.display = 'none';
}

/* ==========================
   CHECKOUT VIA WHATSAPP
========================== */
function checkoutWhatsApp() {
  if(cart.length === 0) { alert('Carrito vacío'); return; }

  let mensaje = 'Hola, quiero comprar los siguientes perfumes:\n\n';
  let total = 0;

  cart.forEach(p => {
    mensaje += `- ${p.name} (${p.size}) - $${p.price} MXN\n`;
    total += p.price;
  });

  mensaje += `\nTotal: $${total} MXN`;
  const whatsappURL = `https://wa.me/526647813813?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');
}

