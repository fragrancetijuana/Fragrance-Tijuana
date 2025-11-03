/* -------------------------
  CONFIGURACION FIREBASE
---------------------------*/
const firebaseConfig = {
  apiKey: "AIzaSyDLHPEqk794NGXwFZKPbkuXMuUv64ipMzE",
  authDomain: "fragrance-tijuana2.firebaseapp.com",
  projectId: "fragrance-tijuana2",
  storageBucket: "fragrance-tijuana2.firebasestorage.app",
  messagingSenderId: "1012758409761",
  appId: "1:1012758409761:web:50c0c4320136cb874a6960",
  measurementId: "G-QBCVPLWCJ0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* -------------------------
  PRODUCTOS
---------------------------*/
const products = [
  { id:'stronger-100', name:'Stronger With You Parfum', image:'img/stronger.jpg', size:'100ml', price:3000 },
  { id:'badboy-100', name:'Bad Boy (Carolina Herrera) Le Parfum', image:'img/badboy.jpg', size:'100ml', price:3200 },
  { id:'onenight-100', name:'One Night (Carlo Corinto Paris Man)', image:'img/onenight.jpg', size:'100ml', price:2800 },
  { id:'explorer-100', name:'Montblanc “Explorer Platinum”', image:'img/explorer.jpg', size:'100ml', price:2950 }
];

/* -------------------------
  RENDER CATÁLOGO
---------------------------*/
const grid = document.getElementById('grid');
products.forEach(p=>{
  const el = document.createElement('div');
  el.className = "card rounded-2xl p-4 flex flex-col";
  el.innerHTML = `
    <div class="img-fit mb-4"><img src="${p.image}" alt="${p.name}"></div>
    <div class="flex-1">
      <div class="font-semibold text-white">${p.name}</div>
      <div class="text-sm text-gray-300">${p.size} • Completo</div>
      <div class="mt-3 text-white font-medium">$${p.price} MXN</div>
    </div>
    <div class="mt-4 flex gap-2">
      <button class="flex-1 px-4 py-2 rounded-xl btn-accent" onclick='addToCart("${p.id}")'>Añadir</button>
      <button class="px-4 py-2 rounded-xl ghost" onclick='buyNow("${p.id}")'>Comprar</button>
    </div>
  `;
  grid.appendChild(el);
});

/* -------------------------
  CARRITO (LOCALSTORAGE)
---------------------------*/
let cart = JSON.parse(localStorage.getItem('ft_cart')||'[]');
updateCartUI();

function addToCart(id){
  const prod = products.find(x=>x.id===id);
  if(!prod) return;
  cart.push(prod);
  localStorage.setItem('ft_cart', JSON.stringify(cart));
  updateCartUI();
  alert('Añadido al carrito');
}

function addToCartExtern(name,img,price,size){
  cart.push({id:Date.now(), name, image:img, price, size});
  localStorage.setItem('ft_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  document.getElementById('cart-count').innerText = cart.length;
  const itemsWrap = document.getElementById('cart-items');
  if(!itemsWrap) return;
  itemsWrap.innerHTML = '';
  let total = 0;
  cart.forEach((it,idx)=>{
    total += it.price;
    const row = document.createElement('div');
    row.className = 'flex items-center gap-3';
    row.innerHTML = `
      <img src="${it.image}" class="w-16 h-16 rounded" />
      <div class="flex-1">
        <div class="font-medium">${it.name}</div>
        <div class="text-sm text-gray-400">${it.size}</div>
      </div>
      <div class="text-white font-semibold">$${it.price}</div>
      <button class="ml-4 text-sm text-red-400" onclick="removeFromCart(${idx})">Eliminar</button>
    `;
    itemsWrap.appendChild(row);
  });
}

function removeFromCart(i){
  cart.splice(i,1);
  localStorage.setItem('ft_cart', JSON.stringify(cart));
  updateCartUI();
}

function clearCart(){ 
  cart=[]; 
  localStorage.setItem('ft_cart','[]'); 
  updateCartUI(); 
}

/* -------------------------
  MODALES
---------------------------*/
document.getElementById('open-cart').addEventListener('click', ()=>document.getElementById('cart-modal').classList.remove('hidden'));
function closeCart(){ document.getElementById('cart-modal').classList.add('hidden'); }

document.getElementById('btn-account').addEventListener('click', ()=> {
  document.getElementById('login-modal').classList.remove('hidden');
  checkAuthState();
});
function closeLogin(){ document.getElementById('login-modal').classList.add('hidden'); }

/* -------------------------
  AUTH FIREBASE
---------------------------*/
function checkAuthState(){
  auth.onAuthStateChanged(user=>{
    if(user){
      document.getElementById('auth-forms').classList.add('hidden');
      document.getElementById('auth-user').classList.remove('hidden');
      document.getElementById('user-info').innerText = `Sesión: ${user.email || user.displayName}`;
      document.getElementById('btn-account').innerText = 'Mi cuenta';
    } else {
      document.getElementById('auth-forms').classList.remove('hidden');
      document.getElementById('auth-user').classList.add('hidden');
      document.getElementById('btn-account').innerText = 'Iniciar sesión';
    }
  });
}

function emailSignUp(){
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, pass).then(()=>alert('Cuenta creada')).catch(e=>alert(e.message));
}

function emailSignIn(){
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, pass).then(()=>alert('Bienvenido')).catch(e=>alert(e.message));
}

function googleSignIn(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(e=>alert(e.message));
}

function logout(){ auth.signOut(); alert('Sesión cerrada'); }

/* -------------------------
  CHECKOUT VIA WHATSAPP
---------------------------*/
function checkout() {
  if(cart.length === 0) {
    alert('Carrito vacío');
    return;
  }

  let mensaje = "Hola, quiero hacer un pedido:\n";
  let total = 0;
  cart.forEach((item, idx) => {
    mensaje += `${idx+1}. ${item.name} - ${item.size} - $${item.price} MXN\n`;
    total += item.price;
  });
  mensaje += `Total: $${total} MXN`;

  const whatsappURL = `https://wa.me/526647813813?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');
}

function buyNow(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;

  const mensaje = `Hola, quiero comprar:\n${p.name} - ${p.size} - $${p.price} MXN`;
  const whatsappURL = `https://wa.me/526647813813?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');
}
