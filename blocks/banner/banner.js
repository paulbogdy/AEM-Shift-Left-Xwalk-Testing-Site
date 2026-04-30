export default function decorate(block) {
  // Generate a stable key from the block text for sessionStorage
  const bannerText = block.textContent.trim();
  const storageKey = `banner-dismissed-${btoa(encodeURIComponent(bannerText)).slice(0, 16)}`;

  // Suppress if already dismissed this session
  if (sessionStorage.getItem(storageKey)) {
    block.remove();
    return;
  }

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('banner-close');
  closeBtn.setAttribute('aria-label', 'Close announcement');
  closeBtn.textContent = '×';

  closeBtn.addEventListener('click', () => {
    sessionStorage.setItem(storageKey, '1');
    block.remove();
  });

  block.append(closeBtn);
}
