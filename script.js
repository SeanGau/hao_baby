const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08,
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('.lightbox__image');
const lightboxCaption = lightbox.querySelector('.lightbox__caption');
const lightboxCounter = lightbox.querySelector('.lightbox__counter');
const closeButton = lightbox.querySelector('.lightbox__close');
const previousButton = lightbox.querySelector('.lightbox__prev');
const nextButton = lightbox.querySelector('.lightbox__next');
const photoButtons = [...document.querySelectorAll('[data-lightbox]')];
let currentPhotoIndex = 0;
let touchStartX = null;
let lightboxTrigger = null;

function renderPhoto(index) {
  currentPhotoIndex = (index + photoButtons.length) % photoButtons.length;
  const photoButton = photoButtons[currentPhotoIndex];
  const sourceImage = photoButton.querySelector('img');

  lightboxImage.src = photoButton.dataset.lightbox;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = photoButton.dataset.title;
  lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photoButtons.length}`;
}

function openLightbox(index) {
  lightboxTrigger = photoButtons[index];
  renderPhoto(index);
  lightbox.showModal();
  document.body.classList.add('lightbox-open');
  closeButton.focus();
}

function closeLightbox() {
  lightbox.close();
}

photoButtons.forEach((button, index) => {
  button.addEventListener('click', () => openLightbox(index));
});

closeButton.addEventListener('click', closeLightbox);
previousButton.addEventListener('click', () => renderPhoto(currentPhotoIndex - 1));
nextButton.addEventListener('click', () => renderPhoto(currentPhotoIndex + 1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  lightboxTrigger?.focus();
  lightboxImage.removeAttribute('src');
});

lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') renderPhoto(currentPhotoIndex - 1);
  if (event.key === 'ArrowRight') renderPhoto(currentPhotoIndex + 1);
});

lightboxImage.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

lightboxImage.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const distance = event.changedTouches[0].clientX - touchStartX;
  touchStartX = null;

  if (Math.abs(distance) < 48) return;
  renderPhoto(currentPhotoIndex + (distance < 0 ? 1 : -1));
}, { passive: true });
