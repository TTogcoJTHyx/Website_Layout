document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('[data-catalog-grid]'); if (!grid) return;
  try {
    const [products, store] = await Promise.all([loadProducts(), loadStore()]);
    const category = document.querySelector('[data-filter-category]'); const size = document.querySelector('[data-filter-size]'); const color = document.querySelector('[data-filter-color]');
    getCategories(products).forEach(value => category.insertAdjacentHTML('beforeend', `<option value="${value}">${categoryTitle(value)}</option>`));
    [...new Set(products.flatMap(item => item.sizes))].sort().forEach(value => size.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`));
    [...new Set(products.flatMap(item => item.colors))].sort().forEach(value => color.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`));
    const params = new URLSearchParams(location.search); document.querySelector('[data-filter-search]').value = params.get('q') || ''; if (params.get('category')) category.value = params.get('category');
    function render() {
      const query = document.querySelector('[data-filter-search]').value.toLowerCase(); const maxPrice = Number(document.querySelector('[data-filter-price]').value) || Infinity; const inStock = document.querySelector('[data-filter-stock]').checked; const sort = document.querySelector('[data-sort]').value;
      let result = products.filter(item => (!query || `${item.name} ${item.description}`.toLowerCase().includes(query)) && (!category.value || item.category === category.value) && (!size.value || item.sizes.includes(size.value)) && (!color.value || item.colors.includes(color.value)) && item.price <= maxPrice && (!inStock || totalStock(item) > 0));
      result.sort((a,b) => sort === 'price-up' ? a.price-b.price : sort === 'price-down' ? b.price-a.price : sort === 'name' ? a.name.localeCompare(b.name) : sort === 'new' ? Number(b.new)-Number(a.new) : Number(b.featured)-Number(a.featured));
      document.querySelector('[data-result-count]').textContent = `Найдено: ${result.length}`; grid.innerHTML = result.length ? result.map(item => productCard(item, store.currency)).join('') : '<div class="empty-state">Товаров не найдено. Попробуйте изменить фильтры.</div>';
    }
    document.querySelectorAll('[data-filter]').forEach(element => element.addEventListener('input', render)); render();
  } catch (error) { grid.innerHTML = `<p class="error">${error.message}</p>`; }
});
