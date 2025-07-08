// Product data
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        description: "Professional audio experience with noise cancellation",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Electronics",
        inStock: 50
    },
    {
        id: 2,
        name: "Designer Smart Watch",
        description: "Elegant timepiece with smart functionality",
        price: 459.00,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Electronics",
        inStock: 30
    },
    {
        id: 3,
        name: "Leather Messenger Bag",
        description: "Handcrafted premium leather with timeless design",
        price: 189.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Accessories",
        inStock: 25
    },
    {
        id: 4,
        name: "Pro Smartphone",
        description: "Latest technology with professional camera system",
        price: 999.00,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Electronics",
        inStock: 40
    },
    {
        id: 5,
        name: "Artisan Coffee Maker",
        description: "Professional-grade brewing for perfect coffee",
        price: 329.00,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Appliances",
        inStock: 20
    },
    {
        id: 6,
        name: "Designer Sunglasses",
        description: "UV protection with sophisticated style",
        price: 159.00,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Accessories",
        inStock: 35
    },
    {
        id: 7,
        name: "Professional Laptop",
        description: "High-performance computing for modern professionals",
        price: 1299.00,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Electronics",
        inStock: 15
    },
    {
        id: 8,
        name: "Fitness Tracker Pro",
        description: "Advanced health monitoring with sleek design",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Electronics",
        inStock: 45
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();
    updateCartCount();
});

// Load products into the grid
function loadProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-content">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-plus"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    updateCartCount();
    showAddedToCartFeedback(productId);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    updateCartCount();
}

// Update quantity in cart
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in navigation
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Update cart sidebar UI
function updateCartUI() {
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
        cartItems.appendChild(cartEmpty);
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItems.appendChild(cartItem);
        });
        
        updateCartTotal();
    }
}

// Create cart item element
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <h5 class="cart-item-name">${item.name}</h5>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                <i class="fas fa-minus"></i>
            </button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return cartItem;
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Show cart
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Close cart
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Show added to cart feedback
function showAddedToCartFeedback(productId) {
    const button = document.querySelector(`button[onclick="addToCart(${productId})"]`);
    const originalHTML = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.classList.add('added');
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('added');
    }, 1000);
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // For demo purposes, show an alert
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout functionality would process ${cart.length} items for $${total.toFixed(2)}. In a real application, this would redirect to a payment processor like Stripe.`);
}

// Search functionality (basic implementation)
document.querySelector('.search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #8c8c8c;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p style="font-size: 1.125rem;">No products found matching "${searchTerm}"</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
});

// Newsletter subscription
document.querySelector('.newsletter-btn').addEventListener('click', function() {
    const email = document.querySelector('.newsletter-input').value;
    
    if (email && email.includes('@')) {
        alert('Thank you for subscribing to our newsletter!');
        document.querySelector('.newsletter-input').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    if (e.target === cartOverlay) {
        closeCart();
    }
});

// Handle escape key to close cart
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        closeCart();
    }
});