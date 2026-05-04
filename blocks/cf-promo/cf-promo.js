export default async function decorate(block) {
  // AEM delivers the reference field value as the text content of the first cell.
  const refCell = block.querySelector(':scope > div > div');
  const cfPath = refCell?.textContent.trim();

  if (!cfPath) return;

  // Extract the fragment name from the DAM path.
  // e.g. /content/dam/aem-shift-left-testing/fragments/homepage-hero-promo
  //   → aem-shift-left-testing/fragments/homepage-hero-promo
  const assetsApiBase = '/api/assets/';
  const damPrefix = '/content/dam/';
  const relativePath = cfPath.startsWith(damPrefix)
    ? cfPath.slice(damPrefix.length)
    : cfPath;

  let data;
  try {
    const res = await fetch(`${assetsApiBase}${relativePath}.json`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    data = await res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[cf-promo] failed to fetch CF', cfPath, err);
    return;
  }

  // CF JSON response: properties live under data.properties or
  // under data.elements (model-based CFs). Support both shapes.
  const props = data?.properties ?? {};
  const elements = data?.elements ?? {};

  const get = (key) => props[key] ?? elements[key]?.value ?? elements[key] ?? '';

  const title = get('title');
  const description = get('description');
  const ctaText = get('ctaText');
  const ctaLink = get('ctaLink');

  // Rebuild block content
  block.innerHTML = '';

  if (title) {
    const h2 = document.createElement('h2');
    h2.className = 'cf-promo-title';
    h2.textContent = title;
    block.append(h2);
  }

  if (description) {
    const p = document.createElement('p');
    p.className = 'cf-promo-description';
    p.textContent = description;
    block.append(p);
  }

  if (ctaText && ctaLink) {
    const p = document.createElement('p');
    p.className = 'cf-promo-cta button-container';
    const a = document.createElement('a');
    a.href = ctaLink;
    a.textContent = ctaText;
    a.className = 'button primary';
    p.append(a);
    block.append(p);
  }
}
