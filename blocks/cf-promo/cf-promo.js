/**
 * Resolves the AEM author origin from the Universal Editor connection meta tag.
 * The tag content is in the form "aem:https://author-pXXX-eYYY.adobeaemcloud.com".
 * Falls back to an empty string so the fetch path stays relative (same-origin).
 */
function getAemOrigin() {
  const meta = document.querySelector('meta[name="urn:adobe:aue:system:aemconnection"]');
  if (!meta) return '';
  // Strip the "aem:" scheme prefix — everything after the first colon+slashes.
  const content = meta.getAttribute('content') || '';
  const match = content.match(/^aem:(https?:\/\/.+)/);
  return match ? match[1].replace(/\/$/, '') : '';
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const cfPath = link.getAttribute('href').replace(/\.html$/, '');
  const relative = cfPath.replace(/^\/?content\/dam\//, '');
  const origin = getAemOrigin();

  try {
    const resp = await fetch(`${origin}/api/assets/${relative}.json`, {
      credentials: 'include',
    });
    if (!resp.ok) return;
    const data = await resp.json();
    const els = data?.properties?.elements || {};
    const get = (name) => els[name]?.value || '';

    block.innerHTML = `
      <h2>${get('title')}</h2>
      <p>${get('description')}</p>
      <a class="button primary" href="${get('ctaLink')}">${get('ctaText')}</a>
    `;
  } catch (e) {
    // silently no-op — raw link stays as fallback
  }
}
