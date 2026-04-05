document.addEventListener("DOMContentLoaded", () => {
  // Hamburger Menu Toggle
  const menuBtn = document.getElementById("hamburger");
  const navbar = document.querySelector(".navbar");
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });

  // Scroll Hide Navbar
  window.addEventListener("scroll", () => {
    navbar.classList.remove("active");
  });

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateContactForm()) {
        alert("Please enter a valid email.");
        return;
      }

      emailjs.sendForm('service_ws2xd0f', 'template_djd0drr', this)
        .then(() => {
          alert("Message sent successfully!");
          contactForm.reset();
        })
        .catch(error => {
          console.error("EmailJS error:", error);
          alert("Failed to send message. Please try again later.");
        });
    });
  }

  // Registration Form Submission
  const regForm = document.getElementById("register-form");
  if (regForm) {
    regForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("reg-email").value.trim();
      const mobile = document.getElementById("reg-mobile").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;

      if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (!/^[6-9]\d{9}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      emailjs.sendForm("service_ws2xd0f", "template_djd0drr", this)
        .then(() => {
          alert("Registered successfully! Confirmation sent to your email.");
          regForm.reset();
        })
        .catch(error => {
          console.error("EmailJS error:", error);
          alert("Something went wrong. Try again later.");
        });
    });
  }

  // Search Functionality
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

      noResultsMessage.style.display = hasMatch ? "none" : "block";
    });
  }

  // Cart Modal Show/Hide
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

  // Cart Functionality
  const cart = [];

  document.querySelectorAll(".fa-shopping-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productBox = btn.closest(".box");
      const name = productBox.querySelector("h3").innerText;
      const price = parseFloat(productBox.querySelector(".price").innerText.replace("₹", ""));
      
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
      alert(`${name} added to cart.`);
    });
  });

  function updateCartUI() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    let lineTotal = item.price * item.quantity;
    let discount = 0;
    let discountText = "";

    const name = item.name.toLowerCase();

    if (name.includes("velvet")) {
      discount = lineTotal * 0.20;
      discountText = " (20% off)";
    } else if (name.includes("marble")) {
      discount = lineTotal * 0.30;
      discountText = " (30% off)";
    if (name.includes("chocolate")) {
      discount = lineTotal * 0.35;
      discountText = " (35% off)";
    }

    lineTotal -= discount;

    const p = document.createElement("p");
    p.innerHTML = `
      ${item.name} - ₹${item.price} × 
      <select onchange="updateQuantity(${i}, this.value)">
        ${[...Array(10).keys()].map(n => `<option value="${n+1}" ${n+1 === item.quantity ? 'selected' : ''}>${n+1}</option>`).join('')}
      </select>
      = ₹${lineTotal.toFixed(2)}
      <span style="color:green;">${discountText}</span>
      <button onclick="removeItem(${i})">Remove</button>
    `;

    cartItemsDiv.appendChild(p);
    total += lineTotal;
  });

  cartTotal.innerText = total.toFixed(2);
}
window.updateQuantity = function(index, quantity) {
  cart[index].quantity = parseInt(quantity);
  updateCartUI();
};


  function updateCartUI() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    let lineTotal = item.price * item.quantity;
    let discount = 0;
    let discountText = "";

    const name = item.name.toLowerCase();

    if (name.includes("chocolate")) {
      discount = lineTotal * 0.35;
      discountText = " (35% off)";
    }

    lineTotal -= discount;

    const p = document.createElement("p");
    p.innerHTML = `
      ${item.name} - ₹${item.price} × 
      <select onchange="updateQuantity(${i}, this.value)">
        ${[...Array(10).keys()].map(n => `<option value="${n+1}" ${n+1 === item.quantity ? 'selected' : ''}>${n+1}</option>`).join('')}
      </select>
      = ₹${lineTotal.toFixed(2)}
      <span style="color:green;">${discountText}</span>
      <button onclick="removeItem(${i})">Remove</button>
    `;

    cartItemsDiv.appendChild(p);
    total += lineTotal;
  });

  cartTotal.innerText = total.toFixed(2);
}
window.updateQuantity = function(index, quantity) {
  cart[index].quantity = parseInt(quantity);
  updateCartUI();
};

  window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
  };

  // Slide Navigation (if needed)
  const slides = document.querySelectorAll(".home .slides-container .slide");
  let index = 0;

  window.showSlide = function (nextIndex) {
    if (slides.length === 0) return;
    slides[index].classList.remove("active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("active");
  };

  window.next = () => showSlide(index + 1);
  window.prev = () => showSlide(index - 1);
});

// Contact form email validation
function validateContactForm() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
  emailInput.classList.remove("invalid");

  if (!emailPattern.test(email)) {
    emailInput.classList.add("invalid");
    return false;
  }
  return true;
}

window.getLiveLocation = function () {
  const output = document.getElementById("location-output");

  if (!navigator.geolocation) {
    output.innerText = "Geolocation is not supported by your browser.";
    return;
  }

  output.innerText = "Fetching location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      const apiKey = "67aaa457ea1d475ea8f0bca4879978ea";  // Your OpenCage API Key
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data && data.results && data.results.length > 0) {
            const address = data.results[0].formatted;

            // Show in visual output and fill in textarea
            output.innerHTML = `Detected address: <strong>${address}</strong>`;
            document.getElementById("address").value = address;
            localStorage.setItem("userAddress", address);
          } else {
            output.innerText = "Unable to retrieve address.";
          }
        })
        .catch(err => {
          console.error(err);
          output.innerText = "Failed to retrieve address.";
        });
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          output.innerText = "Location access denied by user.";
          break;
        case error.POSITION_UNAVAILABLE:
          output.innerText = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          output.innerText = "Location request timed out.";
          break;
        default:
          output.innerText = "An unknown error occurred.";
      }
    }
  );
};
// Like/Unlike functionality
document.querySelectorAll(".fa-heart").forEach((heartIcon) => {
  heartIcon.addEventListener("click", function (e) {
    e.preventDefault();

    // Toggle 'liked' class and change icon color
    this.classList.toggle("liked");

    // Optional: Save to localStorage for persistence (keyed by product name)
    const productName = this.closest(".box").querySelector("h3").innerText;
    const liked = this.classList.contains("liked");

    const likes = JSON.parse(localStorage.getItem("likedProducts") || "{}");
    likes[productName] = liked;
    localStorage.setItem("likedProducts", JSON.stringify(likes));
  });
});

// Load liked state from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const likes = JSON.parse(localStorage.getItem("likedProducts") || "{}");

  document.querySelectorAll(".box").forEach((box) => {
    const name = box.querySelector("h3").innerText;
    if (likes[name]) {
      const heart = box.querySelector(".fa-heart");
      if (heart) heart.classList.add("liked");
    }
  });
});
// Eye icon click to view full image
document.querySelectorAll(".fa-eye").forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", function (e) {
    e.preventDefault();
    const box = this.closest(".box");
    const imgSrc = box.querySelector("img").src;
    document.getElementById("modal-image").src = imgSrc;
    document.getElementById("image-modal").style.display = "flex";
  });
});

// Close modal
document.getElementById("close-image-modal").addEventListener("click", () => {
  document.getElementById("image-modal").style.display = "none";
});

// ✅ Checkout button handler with proper cart validation
document.getElementById("checkout-btn")?.addEventListener("click", () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    
    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    window.location.href = "checkout.html"; // Redirect to the checkout page
  } catch (e) {
    alert("Your cart is empty.");
  }
});
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const totalSpan = document.getElementById('total');

  cartItemsDiv.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    totalSpan.textContent = '0';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<span>${item.name}</span><span>₹${item.price}</span>`;
    cartItemsDiv.appendChild(div);
    total += parseFloat(item.price);
  });

  totalSpan.textContent = total.toFixed(2);
}

displayCart(); // Call it on page load

