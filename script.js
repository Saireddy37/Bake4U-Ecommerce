// ✅ GLOBAL CART (ONLY ONE)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {

  // ================= NAVBAR =================
  const menuBtn = document.getElementById("hamburger");
  const navbar = document.querySelector(".navbar");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }

  window.addEventListener("scroll", () => {
    navbar.classList.remove("active");
  });

  // ================= SEARCH =================
  const searchInput = document.getElementById("search-input");
  const noResultsMessage = document.getElementById("no-results-message");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const productBoxes = document.querySelectorAll(".products .box");

      let hasMatch = false;

      productBoxes.forEach(box => {
        const title = box.querySelector("h3").innerText.toLowerCase();
        if (title.includes(query)) {
          box.style.display = "block";
          hasMatch = true;
        } else {
          box.style.display = "none";
        }
      });

      if (noResultsMessage) {
        noResultsMessage.style.display = hasMatch ? "none" : "block";
      }
    });
  }

  // ================= CART MODAL =================
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");

  if (cartBtn && cartModal && closeCart) {
    cartBtn.addEventListener("click", () => {
      cartModal.classList.toggle("visible");
    });

    closeCart.addEventListener("click", () => {
      cartModal.classList.remove("visible");
    });
  }

  // ================= ADD TO CART =================
  document.querySelectorAll(".fa-shopping-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = btn.closest(".box");
      const name = box.querySelector("h3").innerText;
      const price = parseFloat(box.querySelector(".price").innerText.replace("₹", ""));

      const existing = cart.find(item => item.name === name);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();

      alert(`${name} added to cart`);
    });
  });

  // ================= LIKE SYSTEM =================
  document.querySelectorAll(".fa-heart").forEach((heart) => {
    heart.addEventListener("click", function (e) {
      e.preventDefault();

      this.classList.toggle("liked");

      const name = this.closest(".box").querySelector("h3").innerText;
      const liked = this.classList.contains("liked");

      const likes = JSON.parse(localStorage.getItem("likedProducts") || "{}");
      likes[name] = liked;
      localStorage.setItem("likedProducts", JSON.stringify(likes));
    });
  });

  // Load liked items
  const likes = JSON.parse(localStorage.getItem("likedProducts") || "{}");
  document.querySelectorAll(".box").forEach((box) => {
    const name = box.querySelector("h3").innerText;
    if (likes[name]) {
      box.querySelector(".fa-heart")?.classList.add("liked");
    }
  });

  // ================= IMAGE MODAL =================
  document.querySelectorAll(".fa-eye").forEach((eye) => {
    eye.addEventListener("click", function (e) {
      e.preventDefault();
      const imgSrc = this.closest(".box").querySelector("img").src;
      document.getElementById("modal-image").src = imgSrc;
      document.getElementById("image-modal").style.display = "flex";
    });
  });

  document.getElementById("close-image-modal")?.addEventListener("click", () => {
    document.getElementById("image-modal").style.display = "none";
  });

  // ================= SLIDER =================
  const slides = document.querySelectorAll(".slide");
  let index = 0;

  window.showSlide = function (i) {
    if (!slides.length) return;
    slides[index].classList.remove("active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
  };

  window.next = () => showSlide(index + 1);
  window.prev = () => showSlide(index - 1);

  // ================= LOAD CART =================
  updateCartUI();
});

// ================= CART UI =================
function updateCartUI() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsDiv || !cartTotal) return;

  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    let lineTotal = item.price * item.quantity;

    let discount = 0;
    if (item.name.toLowerCase().includes("chocolate")) {
      discount = lineTotal * 0.35;
    }

    lineTotal -= discount;

    const div = document.createElement("div");
    div.innerHTML = `
      ${item.name} - ₹${item.price} × 
      <select onchange="updateQuantity(${i}, this.value)">
        ${[...Array(10).keys()].map(n => 
          `<option value="${n+1}" ${n+1 === item.quantity ? 'selected' : ''}>${n+1}</option>`
        ).join('')}
      </select>
      = ₹${lineTotal.toFixed(2)}
      <button onclick="removeItem(${i})">Remove</button>
    `;

    cartItemsDiv.appendChild(div);
    total += lineTotal;
  });

  cartTotal.innerText = total.toFixed(2);
}

// ================= CART ACTIONS =================
window.updateQuantity = function(index, quantity) {
  cart[index].quantity = parseInt(quantity);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
};

window.removeItem = function(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
};

// ================= CHECKOUT =================
document.getElementById("checkout-btn")?.addEventListener("click", () => {
  if (!cart.length) {
    alert("Cart is empty");
    return;
  }
  window.location.href = "checkout.html";
});

// ================= LOCATION =================
window.getLiveLocation = function () {
  const output = document.getElementById("location-output");

  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    output.innerText = `Lat: ${latitude}, Long: ${longitude}`;
  });
};
