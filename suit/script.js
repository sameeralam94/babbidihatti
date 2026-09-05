const grid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
let activeFilter = new URLSearchParams(window.location.search).get('category') || 'new-arrivals';
function renderProducts() {
  const query = document.querySelector('#search-input').value.toLowerCase().trim();
  const visible = products.filter((product) => {
    const matchesFilter = activeFilter === 'new-arrivals'
      ? true
      : activeFilter === 'sale'
        ? product.tag === 'Limited run'
        : product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.detail}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
  grid.innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <a class="product-image-link" href="product-detail.html?product=${encodeURIComponent(product.name)}" aria-label="View details for ${product.name}">
          <img class="product-image" src="${product.image}" alt="${product.name}, ${product.detail}" loading="lazy" />
          <span class="view-photo">View full photo</span>
        </a>
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
      </div>
      <div class="product-info"><div><h3 class="product-name">${product.name}</h3><p class="product-detail">${product.detail}</p></div><span class="product-price">${product.price}</span></div>
      <button class="inquiry-button" data-product="${product.name}"><i data-lucide="message-circle"></i> Inquire on WhatsApp</button>
    </article>`).join('');
  emptyState.hidden = visible.length > 0;
  lucide.createIcons();
  document.querySelectorAll('.inquiry-button').forEach((button) => button.addEventListener('click', () => {
    const product = products.find((item) => item.name === button.dataset.product);
    const productLink = new URL(`product-detail.html?product=${encodeURIComponent(product.name)}`, window.location.href).href;
    const message = `Hello babbi di hatti , I'm interested in:\n${product.name}\n${product.detail}\nPrice: ${product.price}\n\nProduct details: ${productLink}\nProduct image: ${product.image}\n\nCould you tell me more about availability and sizing?`;
    window.open(`https://wa.me/917508308601?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }));
}
document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter-button.active').classList.remove('active');
  button.classList.add('active');
  activeFilter = button.dataset.filter;
  renderProducts();
}));
document.querySelector('#search-input').addEventListener('input', renderProducts);
renderProducts();
lucide.createIcons();

const heroImage = document.querySelector('.hero-image');
const heroSlideCount = document.querySelector('.hero-slide-count');
const heroSlideLocation = document.querySelector('.hero-slide-location');
const heroPrevious = document.querySelector('.hero-prev');
const heroNext = document.querySelector('.hero-next');
if (heroImage && heroSlideCount && heroSlideLocation) {
  const heroSlides = [
    { image: './image/shopping.webp', location: 'New arrivals — Salwar suits' },
    { image: './image/shopping (1).webp', location: 'Featured — Festive edit' },
    { image: './image/s1.webp', location: 'Signature — Embroidered edit' }
  ];
  let heroSlide = 0;
  const showHeroSlide = (nextSlide) => {
    heroSlide = (nextSlide + heroSlides.length) % heroSlides.length;
    const slide = heroSlides[heroSlide];
    heroImage.classList.add('is-changing');
    window.setTimeout(() => {
      heroImage.src = slide.image;
      heroImage.alt = `Suit collection look ${heroSlide + 1}`;
      heroSlideCount.textContent = `${String(heroSlide + 1).padStart(2, '0')} / ${String(heroSlides.length).padStart(2, '0')}`;
      heroSlideLocation.textContent = slide.location;
      heroImage.classList.remove('is-changing');
    }, 250);
  };
  const autoAdvance = window.setInterval(() => showHeroSlide(heroSlide + 1), 4000);
  heroPrevious?.addEventListener('click', () => showHeroSlide(heroSlide - 1));
  heroNext?.addEventListener('click', () => showHeroSlide(heroSlide + 1));
  let swipeStartX = 0;
  heroImage.addEventListener('touchstart', (event) => {
    swipeStartX = event.touches[0].clientX;
  }, { passive: true });
  heroImage.addEventListener('touchend', (event) => {
    const swipeDistance = event.changedTouches[0].clientX - swipeStartX;
    if (Math.abs(swipeDistance) > 45) showHeroSlide(heroSlide + (swipeDistance < 0 ? 1 : -1));
  }, { passive: true });
  window.addEventListener('pagehide', () => window.clearInterval(autoAdvance));
}
