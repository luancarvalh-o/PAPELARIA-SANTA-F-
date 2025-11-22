// Shopping cart functionality with localStorage

const CART_STORAGE_KEY = "psf_cart"

// Get cart from localStorage
function getCart() {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error("Error reading cart:", error)
    return []
  }
}

// Save cart to localStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    updateCartCount()
  } catch (error) {
    console.error("Error saving cart:", error)
  }
}

// Add item to cart
function addToCart(productId, productName, productPrice) {
  const cart = getCart()

  // Check if item already exists
  const existingItem = cart.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      productId,
      name: productName,
      price: Number.parseFloat(productPrice),
      quantity: 1,
    })
  }

  saveCart(cart)

  // Show feedback
  showCartNotification(`${productName} adicionado ao carrinho!`)
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart()
  cart = cart.filter((item) => item.productId !== productId)
  saveCart(cart)

  // Reload cart page if we're on it
  if (window.location.pathname.includes("cart.html")) {
    loadCart()
  }
}

// Update item quantity
function updateQuantity(productId, change) {
  const cart = getCart()
  const item = cart.find((item) => item.productId === productId)

  if (item) {
    item.quantity += change

    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      saveCart(cart)

      // Reload cart page if we're on it
      if (window.location.pathname.includes("cart.html")) {
        loadCart()
      }
    }
  }
}

// Clear entire cart
function clearCart() {
  if (confirm("Tem certeza que deseja limpar o carrinho?")) {
    localStorage.removeItem(CART_STORAGE_KEY)
    updateCartCount()

    // Reload cart page if we're on it
    if (window.location.pathname.includes("cart.html")) {
      loadCart()
    }
  }
}

// Get cart total
function getCartTotal() {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Get cart item count
function getCartCount() {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}

// Update cart count badge in UI
function updateCartCount() {
  const badge = document.getElementById("cartCount")
  if (badge) {
    badge.textContent = getCartCount()
  }
}

// Show cart notification
function showCartNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `

  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Add CSS animations
if (!document.getElementById("cartAnimationStyles")) {
  const style = document.createElement("style")
  style.id = "cartAnimationStyles"
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

// Declare loadCart function
function loadCart() {
  // Implementation for loading cart
  console.log("Loading cart...")
}
