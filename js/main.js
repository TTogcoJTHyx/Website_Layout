function assetPath(path) { return basePath() + path; }
function money(value, currency = 'грн') { return `${Number(value).toLocaleString('uk-UA')} ${currency}`; }
function categoryTitle(category) { return ({ 't-shirts':'Футболки', hoodies:'Худи', pants:'Брюки', jeans:'Джинсы', jackets:'Куртки', accessories:'Аксессуары' })[category] || category; }
function getCategories(products) { return [...new Set(products.map(product => product.category))]; }
function totalStock(product) { return Object.values(product.stock || {}).reduce((sum, quantity) => sum + Number(quantity), 0); }
function productCard(product, currency) {
  const sale = product.oldPrice && product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const stock = totalStock(product);
  return `<article class="product-card"><a href="${basePath()}product.html?id=${product.id}" class="product-card__image" aria-label="Открыть ${product.name}"><img loading="lazy" src="${assetPath(product.images[0])}" alt="${product.name}"></a><div class="product-card__meta"><span>${categoryTitle(product.category)}</span>${sale ? `<span class="badge badge--sale">−${sale}%</span>` : ''}</div><a class="product-card__name" href="${basePath()}product.html?id=${product.id}">${product.name}</a><div class="price"><span>${money(product.price, currency)}</span>${product.oldPrice ? `<del>${money(product.oldPrice, currency)}</del>` : ''}</div><span class="badge ${stock ? '' : 'badge--out'}">${stock ? `В наличии: ${stock}` : 'Нет в наличии'}</span></article>`;
}

async function renderLayout() {
  const store = await loadStore();
  const footer = document.querySelector('[data-footer]');
  document.querySelectorAll('[data-store-name]').forEach(item => item.textContent = store.name);
  document.querySelectorAll('[data-store-description]').forEach(item => item.textContent = store.description);
  if (footer) footer.innerHTML = `<div class="container footer-grid"><div><strong class="brand">${store.name}</strong><p style="margin-top:12px">${store.description}</p></div><div><strong>Навигация</strong><ul><li><a href="${basePath()}index.html">Главная</a></li><li><a href="${basePath()}catalog.html">Каталог</a></li><li><a href="${basePath()}cart.html">Корзина</a></li></ul></div><div><strong>Контакты</strong><ul><li><a href="tel:${store.phone.replace(/\s/g,'')}">${store.phone}</a></li><li><a href="mailto:${store.email}">${store.email}</a></li></ul></div><div><strong>Соцсети</strong><ul><li><a href="${store.instagram}">Instagram</a></li><li><a href="${store.telegram}">Telegram</a></li><li><a href="#">Политика конфиденциальности</a></li></ul></div></div><div class="container copyright">© ${new Date().getFullYear()} ${store.name}. Demo template.</div>`;
  updateCartCount();
}
function updateCartCount() { document.querySelectorAll('[data-cart-count]').forEach(item => item.textContent = loadCart().reduce((sum, item) => sum + item.quantity, 0)); }
function setupHeader() {
  const toggle = document.querySelector('[data-menu-toggle]'); const mobile = document.querySelector('[data-mobile-nav]');
  if (toggle && mobile) toggle.addEventListener('click', () => { const open = mobile.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', open); });
  document.querySelectorAll('[data-search-form]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); const query = new FormData(form).get('q').trim(); window.location.href = `${basePath()}catalog.html?q=${encodeURIComponent(query)}`; }));
}
document.addEventListener('DOMContentLoaded', async () => { try { await renderLayout(); setupHeader(); } catch (error) { console.error(error); } });
