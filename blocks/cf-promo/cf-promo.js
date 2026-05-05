export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const cfPath = link.getAttribute('href').replace(/\.html$/, '');
  const relative = cfPath.replace(/^\/?content\/dam\//, '');

  try {
    const resp = await fetch(`/api/assets/${relative}.json`);
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
