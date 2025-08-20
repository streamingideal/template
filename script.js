document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main');
    const category = mainContainer.id;

    // Obtener los datos de los productos de la carpeta
    async function fetchProducts() {
        const response = await fetch('./products/products_list.json');
        const productIds = await response.json();
        
        const products = [];
        for (const id of productIds) {
            const productResponse = await fetch(`./products/${id}.json`);
            const product = await productResponse.json();
            products.push(product);
        }
        return products;
    }

    // Renderizar las tarjetas de productos
    async function renderProducts() {
        const allProducts = await fetchProducts();
        const filteredProducts = allProducts.filter(p => p.categoria === category);

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Crear el contenido de la tarjeta
            productCard.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>Precio: $${product.precio.toFixed(2)}</p>
                <p class="stock-info ${product.stock === 0 ? 'out-of-stock' : ''}">
                    ${product.stock > 0 ? `Stock: ${product.stock}` : 'Sin Stock'}
                </p>
                <button class="details-button" data-id="${product.id}">Detalles</button>
                <button class="add-to-cart-button" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>Añadir al Carrito</button>
            `;
            mainContainer.appendChild(productCard);
        });

        // Añadir el listener para los botones de detalles
        document.querySelectorAll('.details-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                window.location.href = `pages/details.html?id=${productId}`;
            });
        });
    }

    // Llamar a la función para renderizar los productos
    if (mainContainer) {
        renderProducts();
    }
});
