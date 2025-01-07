let products = [];
let cart = [];

// Fetch products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        products = data.products;
        
        // Check which page we're on and call appropriate function
        if (document.querySelector('.products-grid')) {
            displayProducts();
        } else if (document.querySelector('.product-detail-page')) {
            loadProductDetail();
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in grid
function displayProducts(filteredProducts = products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="navigateToProduct('${product.id}')">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price"><i class="fas fa-tag"></i> $${product.price}</p>
            <p><i class="fas fa-star"></i> ${product.description.substring(0, 50)}...</p>
            <button class="view-details">
                View Details <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `).join('');
}

// Navigate to product detail page
function navigateToProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Load product detail page
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    const container = document.getElementById('product-container');
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h1>${product.name}</h1>
                <p class="price"><i class="fas fa-tag"></i> $${product.price}</p>
                <div class="product-meta">
                    ${product.inStock ? '<span><i class="fas fa-check-circle"></i> In Stock</span>' : ''}
                    ${product.freeShipping ? '<span><i class="fas fa-shipping-fast"></i> Free Shipping</span>' : ''}
                    <span><i class="fas fa-undo"></i> 30-Day Returns</span>
                </div>
                <p class="description">${product.description}</p>
                <div class="features">
                    ${product.features.map(feature => `
                        <p><i class="fas fa-check"></i> ${feature}</p>
                    `).join('')}
                </div>
                <button class="add-to-cart" onclick="addToCart('${product.id}')">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Add to cart and proceed to thank you page
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
    });

    // Save to localStorage
    localStorage.setItem('lastOrder', JSON.stringify({
        product: product.name,
        price: product.price,
        date: new Date().toISOString()
    }));
    
    // Redirect to thank you page
    window.location.href = 'thank-you.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts); 