
"use strict";

/* =========================================
   NEXORA MARKETPLACE
   Frontend JavaScript
========================================= */

const API_URL = "https://nexora-marketplace-x4x7.onrender.com";
const PRODUCTS_URL = `${API_URL}/api/products`;
const ORDERS_URL = `${API_URL}/api/orders`;

let allProducts = [];
let cart = [];
let activeCategory = "All";
let searchTerm = "";
let isSubmittingOrder = false;


/* =========================================
   ELEMENTS
========================================= */

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const filterButtons = document.getElementById("filter-buttons");

const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartClose = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const checkoutButton = document.getElementById("checkout-btn");

const orderModal = document.getElementById("order-modal");
const orderForm = document.getElementById("order-form");
const orderClose = document.getElementById("order-close");
const orderOverlay = document.getElementById("order-overlay");
const formMessage = document.getElementById("form-message");

const toastMessage = document.getElementById("toast-message");


/* =========================================
   HELPER FUNCTIONS
========================================= */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function formatPrice(price) {
  return "৳" + Number(price || 0).toLocaleString("en-BD");
}

function showToast(message) {
  if (!toastMessage) return;

  toastMessage.textContent = message;
  toastMessage.classList.add("show");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 2800);
}

function setModalState(modal, isOpen) {
  if (!modal) return;

  modal.classList.toggle("open", isOpen);
  modal.setAttribute("aria-hidden", String(!isOpen));

  document.body.style.overflow =
    isAnyModalOpen() ? "hidden" : "";
}

function isAnyModalOpen() {
  return Boolean(
    cartModal?.classList.contains("open") ||
    orderModal?.classList.contains("open")
  );
}


/* =========================================
   LOAD PRODUCTS FROM BACKEND
========================================= */

async function loadProducts() {
  if (!productGrid) return;

  productGrid.innerHTML = `
    <div class="loading-message">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>
  `;

  try {
    const response = await fetch(PRODUCTS_URL);

    if (!response.ok) {
      throw new Error("Could not load products.");
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.products)) {
      throw new Error("Invalid product data.");
    }

    allProducts = data.products;

    displayProducts();
  } catch (error) {
    console.error("Product loading error:", error);

    productGrid.innerHTML = `
      <div class="empty-products">
        <p>Unable to load products right now.</p>
        <p>Please make sure the Nexora backend is running.</p>
        <button class="btn btn-primary" id="retry-products">
          Try Again
        </button>
      </div>
    `;

    document
      .getElementById("retry-products")
      ?.addEventListener("click", loadProducts);
  }
}


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts() {
  if (!productGrid) return;

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const searchableText = [
      product.name,
      product.description,
      product.category
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(
      searchTerm.toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-products">
        <p>No products found.</p>
        <p>Try another search or category.</p>
      </div>
    `;

    return;
  }

  productGrid.innerHTML = filteredProducts
    .map((product) => {
      const id = Number(product.id);
      const name = escapeHTML(product.name);
      const description = escapeHTML(product.description);
      const category = escapeHTML(product.category);
      const badge = escapeHTML(product.badge || "FEATURED");
      const icon = escapeHTML(product.icon || "🛍️");
      const price = formatPrice(product.price);

      const imageHTML = product.image
        ? `
          <img
            class="product-image"
            src="${escapeHTML(product.image)}"
            alt="${name}"
            loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.hidden=false;"
          >
          <div class="product-icon" hidden>${icon}</div>
        `
        : `<div class="product-icon">${icon}</div>`;

      return `
        <article class="product-card">

          <div class="product-image-wrap">
            ${imageHTML}
            <span class="product-badge">${badge}</span>
          </div>

          <div class="product-info">
            <span class="product-category">${category}</span>

            <h3>${name}</h3>

            <p class="product-description">${description}</p>

            <div class="product-bottom">
              <span class="product-price">${price}</span>

              <button
                class="add-to-cart"
                data-product-id="${id}"
                type="button"
              >
                + Add to Cart
              </button>
            </div>
          </div>

        </article>
      `;
    })
    .join("");
}


/* =========================================
   SEARCH PRODUCTS
========================================= */

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim();
    displayProducts();
  });
}


/* =========================================
   FILTER PRODUCTS
========================================= */

if (filterButtons) {
  filterButtons.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");

    if (!button) return;

    activeCategory = button.dataset.category || "All";

    filterButtons
      .querySelectorAll(".filter-btn")
      .forEach((item) => {
        item.classList.toggle("active", item === button);
      });

    displayProducts();
  });
}


/* =========================================
   CART FUNCTIONS
========================================= */

function addToCart(productId) {
  const product = allProducts.find(
    (item) => Number(item.id) === Number(productId)
  );

  if (!product) {
    showToast("Product not found.");
    return;
  }

  const existingItem = cart.find(
    (item) => Number(item.id) === Number(productId)
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      image: product.image || "",
      icon: product.icon || "🛍️",
      quantity: 1
    });
  }

  updateCart();
  showToast(`${product.name} added to cart!`);
}

function updateCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }

  renderCart();
}

function renderCart() {
  if (!cartItems || !cartTotal) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">Your cart is empty.</p>
    `;

    cartTotal.textContent = formatPrice(0);

    if (checkoutButton) checkoutButton.disabled = true;

    return;
  }

  if (checkoutButton) checkoutButton.disabled = false;

  cartItems.innerHTML = cart.map((item) => {
    const itemImage = item.image
      ? `
        <img
          src="${escapeHTML(item.image)}"
          alt="${escapeHTML(item.name)}"
          onerror="this.style.display='none'; this.parentElement.textContent='🛍️';"
        >
      `
      : escapeHTML(item.icon);

    return `
      <div class="cart-item">

        <div class="cart-item-image">
          ${itemImage}
        </div>

        <div class="cart-item-info">
          <h3>${escapeHTML(item.name)}</h3>

          <p>${formatPrice(item.price * item.quantity)}</p>

          <div class="cart-item-actions">
            <button
              type="button"
              data-cart-action="decrease"
              data-product-id="${item.id}"
              aria-label="Decrease quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-cart-action="increase"
              data-product-id="${item.id}"
              aria-label="Increase quantity"
            >+</button>

            <button
              type="button"
              class="remove-item"
              data-cart-action="remove"
              data-product-id="${item.id}"
            >Remove</button>
          </div>
        </div>

      </div>
    `;
  }).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartTotal.textContent = formatPrice(total);
}


/* =========================================
   CART BUTTON EVENTS
========================================= */

if (productGrid) {
  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    addToCart(button.dataset.productId);
  });
}

if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");

    if (!button) return;

    const productId = Number(button.dataset.productId);
    const action = button.dataset.cartAction;

    const item = cart.find(
      (product) => Number(product.id) === productId
    );

    if (!item) return;

    if (action === "increase") {
      item.quantity += 1;
    }

    if (action === "decrease") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart = cart.filter(
          (product) => Number(product.id) !== productId
        );
      }
    }

    if (action === "remove") {
      cart = cart.filter(
        (product) => Number(product.id) !== productId
      );
    }

    updateCart();
  });
}


/* =========================================
   OPEN AND CLOSE CART
========================================= */

document.querySelectorAll(".cart-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    setModalState(cartModal, true);
  });
});

cartClose?.addEventListener("click", () => {
  setModalState(cartModal, false);
});

cartOverlay?.addEventListener("click", () => {
  setModalState(cartModal, false);
});


/* =========================================
   CHECKOUT
========================================= */

checkoutButton?.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }

  setModalState(cartModal, false);
  setModalState(orderModal, true);

  if (formMessage) {
    formMessage.textContent = "";
  }
});

orderClose?.addEventListener("click", () => {
  setModalState(orderModal, false);
});

orderOverlay?.addEventListener("click", () => {
  setModalState(orderModal, false);
});


/* =========================================
   SUBMIT ORDER
========================================= */

if (orderForm) {
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmittingOrder) return;

    if (cart.length === 0) {
      showToast("Your cart is empty.");
      setModalState(orderModal, false);
      return;
    }

    const formData = new FormData(orderForm);

    const customer = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      note: String(formData.get("note") || "").trim()
    };

    if (!customer.name || !customer.phone || !customer.address) {
      if (formMessage) {
        formMessage.textContent =
          "Please complete your name, phone and address.";
      }

      return;
    }

    const order = {
      customer,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    };

    const submitButton = orderForm.querySelector(
      'button[type="submit"]'
    );

    isSubmittingOrder = true;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    if (formMessage) {
      formMessage.textContent = "";
    }

    try {
      const response = await fetch(ORDERS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not submit your order."
        );
      }

      cart = [];
      updateCart();
      orderForm.reset();

      setModalState(orderModal, false);

      showToast(
        result.message ||
        "Order submitted! Please wait for confirmation."
      );
    } catch (error) {
      console.error("Order submission error:", error);

      if (formMessage) {
        formMessage.textContent =
          "Order could not be submitted. Please check the backend and try again.";
      }

      showToast("Order was not submitted. Please try again.");
    } finally {
      isSubmittingOrder = false;

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Order →";
      }
    }
  });
}


/* =========================================
   CLOSE MODALS WITH ESCAPE
========================================= */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  setModalState(cartModal, false);
  setModalState(orderModal, false);
});


/* =========================================
   FOOTER YEAR
========================================= */

const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   INITIALIZE WEBSITE
========================================= */

updateCart();
loadProducts();