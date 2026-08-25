document.addEventListener('DOMContentLoaded', async () => {
  const root = document.querySelector('[data-product-page]'); if (!root) return;
  try {
    const [products, store] = await Promise.all([loadProducts(), loadStore()]);
    const id = Number(new URLSearchParams(location.search).get('id')); const product = products.find(item => item.id === id);
    if (!product) { root.innerHTML = '<div class="empty-state">Товар не найден. <a href="catalog.html">Вернуться в каталог</a></div>'; return; }
    let selectedSize = product.sizes.find(size => product.stock[size] > 0) || ''; let selectedImage = 0;
    function render() {
      root.innerHTML = `<div class="product-detail"><div><div class="product-main-image"><img src="${assetPath(product.images[selectedImage])}" alt="${product.name}"></div><div class="product-thumbs">${product.images.map((image, index) => `<button class="${index===selectedImage?'is-active':''}" data-image="${index}" aria-label="Фото ${index+1}"><img src="${assetPath(image)}" alt=""></button>`).join('')}</div></div><div class="product-info"><p class="eyebrow">${categoryTitle(product.category)}</p><h1>${product.name}</h1><div class="price"><span>${money(product.price, store.currency)}</span>${product.oldPrice ? `<del>${money(product.oldPrice, store.currency)}</del>` : ''}</div><p>${product.description}</p><div><strong>Размер</strong><div class="choice-list" data-sizes>${product.sizes.map(size => `<button class="choice ${size===selectedSize?'is-selected':''}" data-size="${size}" ${product.stock[size] ? '' : 'disabled'}>${size}</button>`).join('')}</div></div><div><strong>Цвета</strong><p>${product.colors.join(', ')}</p></div><p class="${selectedSize ? '' : 'error'}">${selectedSize ? `В наличии (${selectedSize}): ${product.stock[selectedSize]} шт.` : 'Нет доступных размеров'}</p><button class="button" data-add ${selectedSize ? '' : 'disabled'}>Добавить в корзину</button><ul class="details-list"><li>• Доставка по Украине</li><li>• Обмен в течение 14 дней</li><li>• Артикул: NOVA-${product.id}</li></ul></div></div>`;
      root.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => { selectedSize = button.dataset.size; render(); }));
      root.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => { selectedImage = Number(button.dataset.image); render(); }));
      root.querySelector('[data-add]')?.addEventListener('click', () => { const cart = loadCart(); const row = cart.find(item => item.productId === product.id && item.size === selectedSize); if (row) row.quantity += 1; else cart.push({ productId: product.id, size: selectedSize, quantity: 1 }); saveCart(cart); updateCartCount(); root.querySelector('[data-add]').textContent = 'Добавлено ✓'; });
    } render();
  } catch (error) { root.innerHTML = `<p class="error">${error.message}</p>`; }
});
