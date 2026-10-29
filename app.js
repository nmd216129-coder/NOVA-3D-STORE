
let wishlist = [];
let cart = [];
let currentProduct = null;
let rotation = 0;
let activeFilter = "All";

const money = n => "৳" + Number(n).toLocaleString("en-BD");
const grid = document.getElementById("productGrid");

function safe(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function imageHTML(p) {
  return `<img src="${safe(p.image)}" alt="${safe(p.name)}"
    loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
    <span class="placeholder" style="display:none">${safe(p.category.toUpperCase())}</span>`;
}

function renderProducts() {
  const list = products.filter(p =>
    activeFilter === "All" ||
    p.category === activeFilter ||
    p.gender === activeFilter
  );

  grid.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image" onclick="openViewer(${p.id})">
        ${imageHTML(p)}
        <span class="product-tag">${safe(p.tag)}</span>
        <button class="heart ${wishlist.includes(p.id)?"on":""}"
          onclick="event.stopPropagation();toggleWishlist(${p.id})">
          ${wishlist.includes(p.id)?"♥":"♡"}
        </button>
      </div>
      <div class="product-info">
        <div class="stars">★★★★★ <span style="color:#aaa">5.0</span></div>
        <h3>${safe(p.name)}</h3>
        <div class="category">${safe(p.gender)} · ${safe(p.category)}</div>
        <div class="product-bottom">
          <strong class="price">${money(p.price)}</strong>
          <button class="small-button" onclick="openViewer(${p.id})">VIEW 3D</button>
          <button class="small-button" onclick="addToCart(${p.id})">ADD +</button>
        </div>
      </div>
    </article>
  `).join("");

  document.getElementById("wishCount").textContent = wishlist.length;
  document.getElementById("cartCount").textContent =
    cart.reduce((sum,item)=>sum+item.qty,0);
}

document.querySelector(".filters").addEventListener("click",e=>{
  const b=e.target.closest("[data-filter]");
  if(!b)return;
  activeFilter=b.dataset.filter;
  document.querySelectorAll(".filter").forEach(x=>
    x.classList.toggle("active",x===b)
  );
  renderProducts();
});

function toggleWishlist(id) {
  wishlist = wishlist.includes(id)
    ? wishlist.filter(x=>x!==id) : [...wishlist,id];
  renderProducts();
  notify("Wishlist updated");
}

function showWishlist() {
  activeFilter = "All";
  const saved = products.filter(p=>wishlist.includes(p.id));
  grid.innerHTML = saved.map(p=>`
    <article class="product">
      <div class="product-image" onclick="openViewer(${p.id})">
        ${imageHTML(p)}
      </div>
      <div class="product-info">
        <h3>${safe(p.name)}</h3>
        <p class="price">${money(p.price)}</p>
        <button class="small-button" onclick="toggleWishlist(${p.id});showWishlist()">REMOVE</button>
      </div>
    </article>
  `).join("");
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
  if(!saved.length) notify("Your wishlist is empty");
}

function openViewer(id) {
  currentProduct = products.find(p=>p.id===id);
  rotation = 0;
  document.getElementById("viewerImage").src = currentProduct.image;
  document.getElementById("viewerImage").alt = currentProduct.name;
  document.getElementById("viewerName").textContent = currentProduct.name;
  document.getElementById("viewerCategory").textContent =
    currentProduct.gender + " · " + currentProduct.category;
  document.getElementById("viewerPrice").textContent = money(currentProduct.price);
  document.getElementById("viewerDescription").textContent =
    "Explore this NOVA demo product. Replace this description with your product details.";
  document.getElementById("productViewer").classList.add("show");
  updateRotation();
}

function closeViewer() {
  document.getElementById("productViewer").classList.remove("show");
}

function rotateProduct(direction) {
  rotation += direction * 45;
  updateRotation();
}

function updateRotation() {
  document.getElementById("viewerImage").style.transform =
    `rotateY(${rotation}deg) rotateX(2deg)`;
}

document.getElementById("viewerAdd").onclick = () => {
  if(currentProduct) addToCart(currentProduct.id);
};

function addToCart(id) {
  const item = cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  document.getElementById("cartCount").textContent =
    cart.reduce((sum,x)=>sum+x.qty,0);
  notify("Added to bag");
}

function showCart() {
  if(!cart.length) {
    notify("Your bag is empty");
    return;
  }
  const details = cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `${p.name} × ${item.qty} — ${money(p.price*item.qty)}`;
  }).join("\n");
  const total=cart.reduce((sum,item)=>
    sum+products.find(p=>p.id===item.id).price*item.qty,0);
  alert("YOUR NOVA BAG\n\n"+details+"\n\nTOTAL: "+money(total)+
    "\n\nDemo only — payment is not connected.");
}

function notify(message) {
  const el=document.getElementById("toast");
  el.textContent=message;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2000);
}

document.getElementById("productViewer").addEventListener("click",e=>{
  if(e.target.id==="productViewer")closeViewer();
});

renderProducts();
