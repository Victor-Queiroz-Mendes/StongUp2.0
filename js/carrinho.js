// carrinho manager avançado
class CarrinhoManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('strongUpCart')) || [];
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.updateCartSummary();
        this.loadSuggestedProducts();
    }

    loadCartItems() {
        const container = document.getElementById('cartItemsContainer');
        const emptyMessage = document.getElementById('emptyCartMessage');
        if (!container) return;
        
        if (this.cart.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            return;
        }

        if (emptyMessage) emptyMessage.style.display = 'none';
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.style.display = 'block';

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image"><i class="fas fa-capsules"></i></div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description || 'Suplemento de alta qualidade'}</p>
                    <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="cart-item-subtotal">${this.formatPrice(item.price * item.quantity)}</div>
                <button class="remove-item"><i class="fas fa-trash"></i> Remover</button>
            </div>
        `).join('');

        this.setupCartItemEvents();
    }

    setupEventListeners() {
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        if (applyCouponBtn) applyCouponBtn.addEventListener('click', () => this.applyCoupon());

        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) clearCartBtn.addEventListener('click', () => this.clearCart());

        const couponInput = document.getElementById('couponInput');
        if (couponInput) couponInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.applyCoupon(); });
    }

    setupCartItemEvents() {
        document.querySelectorAll('.quantity-btn').forEach(btn => btn.addEventListener('click', (e) => this.handleQuantityChange(e)));
        document.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', (e) => this.handleRemoveItem(e)));
    }

    handleQuantityChange(event) {
        const btn = event.target;
        const cartItem = btn.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        const input = cartItem.querySelector('.quantity-input');
        let quantity = parseInt(input.value, 10);

        if (btn.classList.contains('plus')) quantity++;
        else if (btn.classList.contains('minus') && quantity > 1) quantity--;

        input.value = quantity;

        const itemIndex = this.cart.findIndex(item => item.id == itemId);
        if (itemIndex > -1) { this.cart[itemIndex].quantity = quantity; this.saveCart(); }

        this.updateItemSubtotal(cartItem);
        this.updateCartSummary();
    }

    updateItemSubtotal(cartItem) {
        const priceText = cartItem.querySelector('.cart-item-price').textContent;
        const price = this.parsePrice(priceText);
        const quantity = parseInt(cartItem.querySelector('.quantity-input').value, 10);
        const subtotal = price * quantity;
        cartItem.querySelector('.cart-item-subtotal').textContent = this.formatPrice(subtotal);
    }

    handleRemoveItem(event) {
        const cartItem = event.target.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        if (!confirm('Remover este item do carrinho?')) return;

        this.cart = this.cart.filter(item => item.id != itemId);
        this.saveCart();

        cartItem.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => { cartItem.remove(); this.updateCartSummary(); this.checkEmptyCart(); }, 300);
    }

    applyCoupon() {
        const couponInput = document.getElementById('couponInput');
        if (!couponInput) return;
        const coupon = couponInput.value.trim().toUpperCase();
        if (coupon === 'STRONG10') { alert('Cupom STRONG10 aplicado! 10% de desconto.'); this.updateCartSummary(10); couponInput.disabled = true; }
        else if (coupon) alert('Cupom inválido!');
        else alert('Digite um cupom!');
    }

    clearCart() {
        if (this.cart.length === 0) { alert('Seu carrinho já está vazio!'); return; }
        if (!confirm('Tem certeza que deseja limpar todo o carrinho?')) return;
        this.cart = [];
        this.saveCart();
        this.loadCartItems();
        this.updateCartSummary();
    }

    checkEmptyCart() {
        if (this.cart.length === 0) this.loadCartItems();
    }

    updateCartSummary(discountPercent = 0) {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 200 ? 0 : 15.90;
        const discount = subtotal * (discountPercent / 100);
        const total = subtotal + shipping - discount;

        const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
        setText('subtotal', this.formatPrice(subtotal));
        setText('shipping', this.formatPrice(shipping));
        setText('discount', `-${this.formatPrice(discount)}`);
        setText('total', this.formatPrice(total));

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count'); if (cartCount) cartCount.textContent = totalItems;
    }

    loadSuggestedProducts() {
        const suggestedProducts = [
            { id: 101, name: "BCAA 4200", price: 69.90, description: "Recuperação muscular avançada" },
            { id: 102, name: "Creatina Monohidratada", price: 59.90, description: "Pura e de alta qualidade" },
            { id: 103, name: "Glutamina", price: 49.90, description: "Recuperação e imunidade" }
        ];
        const container = document.getElementById('suggestedProducts');
        if (!container) return;
        container.innerHTML = suggestedProducts.map(product => `
            <div class="product-card">
                <div class="product-image"></div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">${this.formatPrice(product.price)}</div>
                    <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', (e) => {
            const id = Number(btn.dataset.id);
            this.addSuggestedProduct(id);
        }));
    }

    addSuggestedProduct(productId) {
        const products = { 101: { name: "BCAA 4200", price: 69.90 }, 102: { name: "Creatina Monohidratada", price: 59.90 }, 103: { name: "Glutamina", price: 49.90 } };
        const product = products[productId]; if (!product) return;
        this.cart.push({ id: Date.now(), name: product.name, price: product.price, quantity: 1 });
        this.saveCart(); this.loadCartItems(); this.updateCartSummary(); alert(`${product.name} adicionado ao carrinho!`);
    }

    saveCart() { localStorage.setItem('strongUpCart', JSON.stringify(this.cart)); }

    formatPrice(price) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price); }

    parsePrice(priceString) { return parseFloat(priceString.replace('R$', '').replace('.', '').replace(',', '.').trim()); }
}

let carrinhoManager;
document.addEventListener('DOMContentLoaded', () => { carrinhoManager = new CarrinhoManager(); });
