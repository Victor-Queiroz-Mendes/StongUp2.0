// Sistema Strong Up
const STRONG_UP = {
    cart: JSON.parse(localStorage.getItem('strongUpCart')) || [],
    
    init: function() {
        this.setupEventListeners();
        this.updateCartCount();
        console.log('Strong Up - Sistema inicializado!');
    },
    
    setupEventListeners: function() {
        // Menu Lateral
        const menuToggle = document.getElementById('menuToggle');
        const closeMenu = document.getElementById('closeMenu');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                console.log('Abrindo menu');
                sidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeMenu && overlay) {
            closeMenu.addEventListener('click', this.closeAll);
            overlay.addEventListener('click', this.closeAll);
        }
        
        // Barra de Pesquisa
        const searchBtn = document.querySelector('.search-btn');
        const searchBar = document.getElementById('searchBar');
        const searchClose = document.querySelector('.search-close');
        
        if (searchBtn && searchBar) {
            searchBtn.addEventListener('click', () => {
                console.log('Abrindo busca');
                searchBar.classList.toggle('active');
            });
        }
        
        if (searchClose && searchBar) {
            searchClose.addEventListener('click', () => {
                searchBar.classList.remove('active');
            });
        }
        
        // Delegação de evento para Add to Cart (suporta botões dinâmicos)
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.addEventListener('click', (e) => {
                const btn = e.target.closest('.add-to-cart');
                if (btn) {
                    e.preventDefault();
                    this.handleAddToCart({ target: btn });
                }
            });
        }
        
        // Tecla ESC para fechar tudo
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    },
    
    closeAll: function() {
        console.log('Fechando tudo');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const searchBar = document.getElementById('searchBar');
        
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (searchBar) searchBar.classList.remove('active');
        
        document.body.style.overflow = 'auto';
    },
    
    handleAddToCart: function(event) {
        const button = event.target;
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        
        // Simular adição ao carrinho
        this.cart.push({
            id: Date.now(),
            name: productName,
            price: productPrice,
            quantity: 1
        });
        
        this.saveCart();
        this.showAddToCartFeedback(button);
    },
    
    showAddToCartFeedback: function(button) {
        const originalText = button.textContent;
        const originalBg = button.style.background;
        const originalColor = button.style.color;
        
        // Feedback visual
        button.textContent = '✓ Adicionado!';
        button.style.background = '#22c55e';
        button.style.color = '#000000';
        button.disabled = true;
        
        // Reverter após 2 segundos
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBg;
            button.style.color = originalColor;
            button.disabled = false;
        }, 2000);
    },
    
    saveCart: function() {
        localStorage.setItem('strongUpCart', JSON.stringify(this.cart));
        this.updateCartCount();
    },
    
    updateCartCount: function() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            console.log('Carrinho atualizado:', totalItems, 'itens');
        }
    },
    
    formatPrice: (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    STRONG_UP.init();
});

// Prevenir erros de console
window.addEventListener('error', function(e) {
    console.log('Erro capturado:', e.error);
});