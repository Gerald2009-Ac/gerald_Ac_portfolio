const products = [...document.querySelectorAll(".product-card")];
const cart = new Map();
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");
let toastTimer;

const money = amount => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", maximumFractionDigits: 0
}).format(amount);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function openCart() {
  cartDrawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function addProduct(card) {
  const name = card.dataset.name;
  const product = {
    name,
    price: Number(card.dataset.price),
    image: card.dataset.image,
    quantity: 0
  };
  if (!cart.has(name)) cart.set(name, product);
  cart.get(name).quantity += 1;
  renderCart();
  showToast(`${name} added to your bag`);
}

function changeQuantity(name, delta) {
  const product = cart.get(name);
  if (!product) return;
  product.quantity += delta;
  if (product.quantity <= 0) cart.delete(name);
  renderCart();
}

function renderCart() {
  const entries = [...cart.values()];
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  cartSubtotal.textContent = money(subtotal);
  checkoutButton.disabled = count === 0;

  if (!entries.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is empty. Find a pair you love.</p>';
    return;
  }

  cartItems.innerHTML = entries.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div>
        <h3>${item.name}</h3>
        <span class="item-price">${money(item.price)}</span>
        <div class="qty-controls">
          <button type="button" data-qty="-1" data-name="${item.name}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-qty="1" data-name="${item.name}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button type="button" class="remove-item" data-remove="${item.name}" aria-label="Remove ${item.name}">×</button>
    </div>
  `).join("");
}

document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => addProduct(button.closest(".product-card")));
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);

cartItems.addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");
  if (qtyButton) changeQuantity(qtyButton.dataset.name, Number(qtyButton.dataset.qty));
  if (removeButton) {
    cart.delete(removeButton.dataset.remove);
    renderCart();
  }
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(filter => filter.classList.remove("active"));
    button.classList.add("active");
    applySearchAndFilter();
  });
});

const searchInput = document.getElementById("searchInput");
function applySearchAndFilter() {
  const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  products.forEach(card => {
    const categoryMatches = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchMatches = card.dataset.name.toLowerCase().includes(query) ||
      card.dataset.category.toLowerCase().includes(query);
    const show = categoryMatches && searchMatches;
    card.hidden = !show;
    if (show) visible++;
  });
  document.getElementById("noResults").hidden = visible !== 0;
}
searchInput.addEventListener("input", applySearchAndFilter);
document.getElementById("searchToggle").addEventListener("click", () => {
  const bar = document.getElementById("searchBar");
  bar.classList.toggle("visible");
  if (bar.classList.contains("visible")) searchInput.focus();
});
document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  applySearchAndFilter();
  searchInput.focus();
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletterMessage").textContent =
    "Thanks! This demo form is ready to connect to an email service.";
  event.target.reset();
});

const checkoutModal = document.getElementById("checkoutModal");
function openCheckout() {
  if (cart.size === 0) return;
  closeCart();
  checkoutModal.classList.add("open");
  document.body.classList.add("modal-open");
}
function closeCheckout() {
  checkoutModal.classList.remove("open");
  document.body.classList.remove("modal-open");
}
checkoutButton.addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
checkoutModal.addEventListener("click", event => {
  if (event.target === checkoutModal) closeCheckout();
});
document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  const lines = [...cart.values()].map(item => `${item.quantity} × ${item.name}`).join(", ");
  const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("checkoutMessage").textContent =
    `Preview only — ${lines}. Subtotal: ${money(total)}. No order has been placed.`;
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
  }
});

renderCart();
