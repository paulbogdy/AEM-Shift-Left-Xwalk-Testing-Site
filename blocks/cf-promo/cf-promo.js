/**
 * Converts the AEM DAM link delivered by the reference field into the EDS
 * overlay URL where json2html has pre-rendered the fragment as public HTML.
 *
 * e.g. /content/dam/aem-shift-left-testing/fragments/homepage-hero-promo.html
 *   →  /fragments/homepage-hero-promo
 *
 * This fetch hits the EDS CDN — no auth required, works in every context
 * (Universal Editor, author preview, published page).
 */
function fragmentUrl(href) {
  return href
    .replace(/\.html$/, '')
    .replace(/^\/content\/dam\/aem-shift-left-testing/, '');
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const url = fragmentUrl(link.getAttribute('href'));

  try {
    const resp = await fetch(url);
    if (!resp.ok) return;

    const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');

    const title = doc.querySelector('.cf-promo-title')?.textContent.trim() ?? '';
    const description = doc.querySelector('.cf-promo-description')?.textContent.trim() ?? '';
    const ctaEl = doc.querySelector('.cf-promo-cta a');
    const ctaText = ctaEl?.textContent.trim() ?? '';
    const ctaHref = ctaEl?.getAttribute('href') ?? '';

    if (!title && !description) return;

    block.innerHTML = `
      <h2 class="cf-promo-title">${title}</h2>
      <p class="cf-promo-description">${description}</p>
      <p class="cf-promo-cta button-container">
        <a class="button primary" href="${ctaHref}">${ctaText}</a>
      </p>
    `;
  } catch (e) {
    // silently no-op — raw link stays as fallback
  }
}
