const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const selector = anchor.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
  const updateBackToTop = () => backToTopButton.classList.toggle('show', window.scrollY > 500);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();

const demoLightPhotos = [
  'https://images.unsplash.com/photo-1520301255226-bf5f144451c1?auto=format&fit=max&w=1200&q=80',
  'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=max&w=1200&q=80',
  'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=max&w=1200&q=80',
  'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=max&w=1200&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=max&w=1200&q=80'
];

const lightProducts = [
  {
    name: 'RGBW 80W',
    description: 'Đèn thanh RGBW cho bể thủy sinh, ánh sáng cân bằng cho cây và cá.',
    specs: ['80W', 'Bể 60–90 cm', '4 kênh màu', 'Bluetooth', 'BH 12 tháng'],
    images: [...demoLightPhotos]
  },
  {
    name: 'UFO RGBW 80W',
    description: 'Thiết kế đèn treo gọn gàng, ánh sáng tập trung cho bể mở và bố cục đá.',
    specs: ['80W', 'Bể 45–60 cm', 'LED RGBW', 'Dimmer', 'BH 12 tháng'],
    images: [...demoLightPhotos.slice(1), demoLightPhotos[0]]
  },
  {
    name: 'Supper Color 100W',
    description: 'Công suất mạnh mẽ, dải màu nổi bật cho bể cây cắt cắm và cây màu.',
    specs: ['100W', 'Bể 90–120 cm', 'RGB toàn phổ', 'Hẹn giờ', 'BH 12 tháng'],
    images: [...demoLightPhotos.slice(2), ...demoLightPhotos.slice(0, 2)]
  }
];

const lightsGrid = document.getElementById('lights-grid');
const lightDialog = document.getElementById('light-dialog');
if (lightsGrid && lightDialog) {
  const photoTrack = document.getElementById('light-photo-track');
  const photoCount = document.getElementById('light-photo-count');
  const previousPhoto = document.getElementById('light-photo-prev');
  const nextPhoto = document.getElementById('light-photo-next');
  let activeProduct = null;
  let galleryTrigger = null;

  const updatePhotoControls = () => {
    if (!activeProduct || !photoTrack.clientWidth) return;
    const index = Math.max(0, Math.min(activeProduct.images.length - 1, Math.round(photoTrack.scrollLeft / photoTrack.clientWidth)));
    photoCount.textContent = `${index + 1} / ${activeProduct.images.length}`;
    previousPhoto.disabled = index === 0;
    nextPhoto.disabled = index === activeProduct.images.length - 1;
  };

  lightProducts.forEach((product) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'light-card';
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Xem ảnh ${product.name}`);
    card.innerHTML = `
      <img src="${product.images[0]}" alt="Ảnh minh họa bể cá cho ${product.name}" loading="lazy" decoding="async" width="800" height="600">
      <span class="light-card-body">
        <span class="light-card-title">${product.name}</span>
        <span class="light-card-description">${product.description}</span>
        <span class="light-card-specs">${product.specs.map((spec) => `<span>${spec}</span>`).join('')}</span>
        <span class="light-card-bottom"><strong>Giá: Liên hệ</strong><span><i class="fas fa-images" aria-hidden="true"></i> ${product.images.length} ảnh</span></span>
      </span>`;
    card.addEventListener('click', () => {
      activeProduct = product;
      galleryTrigger = card;
      document.getElementById('light-dialog-title').textContent = product.name;
      photoTrack.replaceChildren(...product.images.map((src, index) => {
        const figure = document.createElement('figure');
        figure.className = 'light-photo';
        const image = document.createElement('img');
        image.src = src;
        image.alt = `Ảnh demo bể cá ${index + 1} — ${product.name}`;
        image.decoding = 'async';
        const caption = document.createElement('figcaption');
        caption.textContent = `${product.name} · Ảnh minh họa ${index + 1}`;
        figure.append(image, caption);
        return figure;
      }));
      lightDialog.showModal();
      document.body.classList.add('light-gallery-open');
      photoTrack.scrollLeft = 0;
      updatePhotoControls();
    });
    lightsGrid.append(card);
  });

  const movePhoto = (direction) => {
    const index = Math.round(photoTrack.scrollLeft / photoTrack.clientWidth);
    photoTrack.scrollTo({ left: (index + direction) * photoTrack.clientWidth, behavior: reduceMotion ? 'instant' : 'smooth' });
  };
  previousPhoto.addEventListener('click', () => movePhoto(-1));
  nextPhoto.addEventListener('click', () => movePhoto(1));
  photoTrack.addEventListener('scroll', updatePhotoControls, { passive: true });
  window.addEventListener('resize', updatePhotoControls);
  lightDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      lightDialog.close();
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    movePhoto(event.key === 'ArrowRight' ? 1 : -1);
  });
  document.getElementById('light-dialog-close').addEventListener('click', () => lightDialog.close());
  lightDialog.addEventListener('click', (event) => {
    const bounds = lightDialog.getBoundingClientRect();
    if (event.target === lightDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightDialog.close();
  });
  lightDialog.addEventListener('close', () => {
    document.body.classList.remove('light-gallery-open');
    galleryTrigger?.focus({ preventScroll: true });
  });
}

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener('click', () => window.gtag?.('event', 'contact_click', { method: 'phone' }));
});
document.querySelectorAll('a[href*="zalo.me"]').forEach((link) => {
  link.addEventListener('click', () => window.gtag?.('event', 'contact_click', { method: 'zalo' }));
});
