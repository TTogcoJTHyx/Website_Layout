const STORAGE_KEYS = { products: 'nova_products', cart: 'nova_cart', orders: 'nova_orders' };

function basePath() { return window.location.pathname.includes('/admin/') ? '../' : ''; }

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function writeLocal(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// LocalStorage имеет приоритет: так изменения из demo-админки не пропадут
// после обновления страницы. JSON нужен только как стартовая база проекта.
async function loadProducts() {
  const saved = readLocal(STORAGE_KEYS.products, null);
  if (saved) return saved;
  const response = await fetch(`${basePath()}data/products.json`);
  if (!response.ok) throw new Error('Не удалось загрузить products.json');
  return response.json();
}
function saveProducts(products) { writeLocal(STORAGE_KEYS.products, products); }
function loadCart() { return readLocal(STORAGE_KEYS.cart, []); }
function saveCart(cart) { writeLocal(STORAGE_KEYS.cart, cart); }
function loadOrders() { return readLocal(STORAGE_KEYS.orders, []); }
function saveOrders(orders) { writeLocal(STORAGE_KEYS.orders, orders); }
async function loadStore() {
  const response = await fetch(`${basePath()}data/store.json`);
  if (!response.ok) throw new Error('Не удалось загрузить store.json');
  return response.json();
}
