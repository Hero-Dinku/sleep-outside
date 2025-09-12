import { getLocalStorage } from "./utils.mjs";

// cart.js - Dynamic Cart Display and Total Calculation

// Sample cart data (in a real app, this would come from localStorage or an API)
const cartData = [
  {
    id: "marmot-ajax-3",
    name: "Marmot Ajax Tent - 3-Person, 3-Season",
    color: "Pale Pumpkin/Terracotta",
    price: 199.99,
    quantity: 1,
    image: "images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg",
    link: "product_pages/marmot-ajax-3.html"
  },
  {
    id: "north-face-talus-4",
    name: "The North Face Talus Tent - 4-Person, 3-Season",
    color: "Golden Oak/Saffron Yellow",
    price: 299.99,
    quantity: 2,
    image: "images/tents/the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg",
    link: "product_pages/north-face-talus-4.html"
  },
  {
    id: "kelty-discovery-4",
    name: "Kelty Discovery 4-Person Tent",
    color: "Orange/Gray",
    price: 159.99,
    quantity: 1,
    image: "images/tents/kelty-discovery-4-person-tent~p~kelty001~320.jpg",
    link: "product_pages/kelty-discovery-4.html"
  }
];

// Function to create cart item HTML
function createCartItemHTML(item) {
  const itemTotal = (item.price * item.quantity).toFixed(2);
  
  return `
    <li class="cart-card divider" data-id="${item.id}">
      <a href="${item.link}" class="cart-card__image">
        <img src="${item.image}" alt="${item.name}" />
      </a>
      <div class="cart-card__details">
        <a href="${item.link}">
          <h2 class="card__name">${item.name}</h2>
        </a>
        <p class="cart-card__color">${item.color}</p>
        <div class="cart-card__quantity">
          <label for="qty-${item.id}">Qty:</label>
          <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" max="10" class="quantity-input">
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
        <p class="cart-card__price">$${item.price.toFixed(2)} each</p>
        <p class="cart-card__total"><strong>Total: $${itemTotal}</strong></p>
      </div>
    </li>
  `;
}

// Function to calculate cart totals
function calculateCartTotals() {
  let subtotal = 0;
  let totalItems = 0;
  
  cartData.forEach(item => {
    subtotal += item.price * item.quantity;
    totalItems += item.quantity;
  });
  
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2),
    totalItems: totalItems
  };
}

// Function to create cart summary HTML
function createCartSummaryHTML(totals) {
  return `
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-line">
        <span>Subtotal (${totals.totalItems} items):</span>
        <span>$${totals.subtotal}</span>
      </div>
      <div class="summary-line">
        <span>Tax:</span>
        <span>$${totals.tax}</span>
      </div>
      <div class="summary-line">
        <span>Shipping:</span>
        <span>${totals.shipping === '0.00' ? 'FREE' : '$' + totals.shipping}</span>
      </div>
      <div class="summary-line total-line">
        <span><strong>Total:</strong></span>
        <span><strong>$${totals.total}</strong></span>
      </div>
      <button class="checkout-btn">Proceed to Checkout</button>
    </div>
  `;
}

// Function to update cart display
function updateCartDisplay() {
  const productList = document.querySelector('.product-list');
  const cartSection = document.querySelector('.products');
  
  if (cartData.length === 0) {
    productList.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
    return;
  }
  
  // Clear existing content
  productList.innerHTML = '';
  
  // Add cart items
  cartData.forEach(item => {
    productList.innerHTML += createCartItemHTML(item);
  });
  
  // Add cart summary
  const totals = calculateCartTotals();
  cartSection.innerHTML += createCartSummaryHTML(totals);
  
  // Update cart counter in header (if exists)
  updateCartCounter(totals.totalItems);
}

// Function to update cart counter in header
function updateCartCounter(count) {
  const cartElement = document.querySelector('.cart');
  let counter = cartElement.querySelector('.cart-counter');
  
  if (!counter) {
    counter = document.createElement('span');
    counter.className = 'cart-counter';
    cartElement.appendChild(counter);
  }
  
  counter.textContent = count;
  counter.style.display = count > 0 ? 'block' : 'none';
}

// Function to handle quantity changes
function handleQuantityChange(event) {
  if (event.target.classList.contains('quantity-input')) {
    const itemId = event.target.id.replace('qty-', '');
    const newQuantity = parseInt(event.target.value);
    
    // Find item in cart data and update quantity
    const item = cartData.find(item => item.id === itemId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
      updateCartDisplay();
    }
  }
}

// Function to handle item removal
function handleRemoveItem(event) {
  if (event.target.classList.contains('remove-item')) {
    const itemId = event.target.dataset.id;
    const itemIndex = cartData.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
      cartData.splice(itemIndex, 1);
      updateCartDisplay();
    }
  }
}

// Function to handle checkout
function handleCheckout(event) {
  if (event.target.classList.contains('checkout-btn')) {
    const totals = calculateCartTotals();
    alert(`Thank you for your order!\nTotal: $${totals.total}\nItems: ${totals.totalItems}`);
  }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateCartDisplay();
  
  // Add event listeners
  document.addEventListener('change', handleQuantityChange);
  document.addEventListener('click', handleRemoveItem);
  document.addEventListener('click', handleCheckout);
});

renderCartContents();
