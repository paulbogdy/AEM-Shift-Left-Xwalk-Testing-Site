import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.classList.add('pricing-tiers');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('pricing-card');
    moveInstrumentation(row, li);

    // Move all content from row cells into the li
    [...row.children].forEach((cell) => {
      while (cell.firstElementChild) li.append(cell.firstElementChild);
    });

    // Detect "featured" state — look for "Popular" text or "Most Popular"
    const allText = li.textContent;
    if (allText.toLowerCase().includes('popular') || allText.toLowerCase().includes('featured')) {
      li.classList.add('pricing-featured');
    }

    // Wrap the last <a> as a full-width CTA
    const links = li.querySelectorAll('a');
    if (links.length) {
      const lastLink = links[links.length - 1];
      lastLink.classList.add('button', 'primary', 'pricing-cta');
      const p = lastLink.closest('p');
      if (p) p.classList.add('pricing-cta-container');
    }

    // Style checkmark list items inside the card
    const innerUls = li.querySelectorAll('ul');
    innerUls.forEach((innerUl) => {
      innerUl.classList.add('pricing-features');
    });

    ul.append(li);
  });

  block.replaceChildren(ul);
}
