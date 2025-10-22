// Carregar produtos na home
class HomeProducts {
    constructor() {
        this.produtos = PRODUTOS_DATABASE;
        this.init();
    }

    init() {
        this.loadFeaturedProducts();
        this.loadNewProducts();
        this.loadSaleProducts();
    }

    getFallbackImage(category) {
        // Primeiro tenta imagens locais por categoria
        const localFallbackImages = {
            'proteinas': 'images/produtos/proteinas/placeholder.jpg',
            'pre-treino': 'images/produtos/pre-treino/placeholder.jpg',
            'aminoacidos': 'images/produtos/aminoacidos/placeholder.jpg',
            'creatinas': 'images/produtos/creatinas/placeholder.jpg',
            'termogenicos': 'images/produtos/termogenicos/placeholder.jpg',
            'vitaminas': 'images/produtos/vitaminas/placeholder.jpg',
            'omega': 'images/produtos/omega/placeholder.jpg',
            'naturais': 'images/produtos/naturais/placeholder.jpg',
            'hipercaloricos': 'images/produtos/hipercaloricos/placeholder.jpg',
            'kits': 'images/produtos/kits/placeholder.jpg',
            'lanches': 'images/produtos/lanches/placeholder.jpg',
            'acessorios': 'images/produtos/acessorios/placeholder.jpg',
            'default': 'images/produtos/placeholder.jpg'
        };
        
        return localFallbackImages[category] || localFallbackImages.default;
    }

    loadFeaturedProducts() {
        const featured = this.produtos
            .filter(p => p.inStock)
            .slice(0, 8); // 8 produtos em destaque

        this.renderProducts('featuredProducts', featured);
    }

    loadNewProducts() {
        const newProducts = this.produtos
            .filter(p => p.new && p.inStock)
            .slice(0, 6); // 6 novos produtos

        this.renderProducts('newProducts', newProducts);
    }

    loadSaleProducts() {
        const saleProducts = this.produtos
            .filter(p => p.discount && p.inStock)
            .slice(0, 6); // 6 produtos em promoção

        this.renderProducts('saleProducts', saleProducts);
    }

    renderProducts(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${this.getFallbackImage(product.category)}';" />
                    ${product.discount ? `<span class="discount-tag">-${product.discount}%</span>` : ''}
                    ${product.new ? `<span class="new-tag">NOVO</span>` : ''}
                    ${!product.inStock ? `<span class="out-of-stock-tag">ESGOTADO</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">
                        ${product.discount ? 
                            `<span class="old-price">${this.formatPrice(product.price)}</span>
                             ${this.formatPrice(this.calculateDiscountPrice(product.price, product.discount))}`
                            : this.formatPrice(product.price)
                        }
                    </div>
                    <button class="add-to-cart" ${!product.inStock ? 'disabled' : ''}>
                        ${!product.inStock ? 'ESGOTADO' : 'Adicionar ao Carrinho'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.produtos.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        if (typeof STRONG_UP !== 'undefined' && STRONG_UP.addProductById) {
            STRONG_UP.addProductById(productId);
        }
    }

    calculateDiscountPrice(price, discount) {
        return price * (1 - discount / 100);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
}

// CSS adicional para produtos esgotados
const style = document.createElement('style');
style.textContent = `
    .out-of-stock-tag {
        position: absolute;
        top: 10px;
        left: 10px;
        background: #666;
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 11px;
        font-weight: bold;
    }
    
    .old-price {
        text-decoration: line-through;
        color: #999;
        font-size: 14px;
        margin-right: 8px;
    }
    
    .add-to-cart:disabled {
        background: #666;
        cursor: not-allowed;
    }
    
    .add-to-cart:disabled:hover {
        background: #666;
        transform: none;
    }
`;
document.head.appendChild(style);

// Inicializar e delegar evento de clique para os botões da home
let homeProducts;
document.addEventListener('DOMContentLoaded', () => {
    homeProducts = new HomeProducts();
    // Delegação para todos os grids de produtos da home
    ['featuredProducts', 'newProducts', 'saleProducts'].forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (grid) {
            grid.addEventListener('click', function(e) {
                const btn = e.target.closest('.add-to-cart');
                if (btn && !btn.disabled) {
                    const card = btn.closest('.product-card');
                    if (card && card.dataset.id) {
                        if (typeof STRONG_UP !== 'undefined' && STRONG_UP.addProductById) {
                            STRONG_UP.addProductById(Number(card.dataset.id));
                        }
                    }
                }
            });
        }
    });
});