const products = [
  { id: 1, name: "Air Shift Runner", price: 4890, icon: "👟" },
  { id: 2, name: "Street Edition", price: 3690, icon: "🥾" },
  { id: 3, name: "Nova Backpack", price: 2190, icon: "🎒" },
  { id: 4, name: "Studio Headphones", price: 3290, icon: "🎧" },
  { id: 5, name: "Cloud Sneaker", price: 5290, icon: "👟" },
  { id: 6, name: "Arc Watch", price: 5990, icon: "⌚" }
];

let cart = JSON.parse(localStorage.getItem("novaCart") || "[]");

const productsBox = document.querySelector("#products");

productsBox.innerHTML = products.map(p => `
  <article class="product">
    <div class="emoji">${p.icon}</div>
    <h3>${p.name}</h3>
    <p>৳${p.price.toLocaleString("en-BD")}</p>
    <button onclick="addToCart(${p.id})">
      Add to Cart
    </button>
  </article>
`).join("");

function addToCart(id) {
  const item = cart.find(p => p.id === id);

  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
}

function saveCart() {
  localStorage.setItem("novaCart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  document.querySelector("#count").textContent =
    cart.reduce((sum, p) => sum + p.qty, 0);

  document.querySelector("#total").textContent =
    cart.reduce((sum, p) => sum + p.price * p.qty, 0)
      .toLocaleString("en-BD");

  document.querySelector("#cartItems").innerHTML =
    cart.length
      ? cart.map(p => `
        <p>
          ${p.name} × ${p.qty}
          <button onclick="removeItem(${p.id})">Remove</button>
        </p>
      `).join("")
      : "Your bag is empty.";
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
}

document.querySelector("#cartToggle").onclick = () => {
  document.querySelector("#cart").classList.add("open");
};

document.querySelector("#closeCart").onclick = () => {
  document.querySelector("#cart").classList.remove("open");
};

document.querySelector("#checkout").onclick = () => {
  alert("This is a demo. Real checkout is not connected.");
};

renderCart();

let installPrompt;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
  document.querySelector("#installBtn").hidden = false;
});

document.querySelector("#installBtn").onclick = async () => {
  if (!installPrompt) return;

  await installPrompt.prompt();
  installPrompt = null;
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(console.error);
}
