import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells[0];
  const bodyCell = cells[1];

  if (imageCell) {
    imageCell.classList.add('teaser-image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]);
        moveInstrumentation(img, optimized.querySelector('img'));
        picture.replaceWith(optimized);
      }
    }
  }

  if (bodyCell) {
    bodyCell.classList.add('teaser-body');

    const heading = bodyCell.querySelector('h1, h2, h3, h4');
    const paragraphs = [...bodyCell.querySelectorAll('p')];

    // Eyebrow: first short <p> that appears before the heading, with no links
    const allContent = [...bodyCell.querySelectorAll('h1,h2,h3,h4,p')];
    const eyebrow = paragraphs.find((p) => {
      const text = p.textContent.trim();
      if (!text || text.length > 80 || p.querySelector('a')) return false;
      if (!heading) return false;
      // p must come before the heading in DOM order
      return allContent.indexOf(p) < allContent.indexOf(heading);
    });
    if (eyebrow) eyebrow.classList.add('teaser-eyebrow');

    // CTA links: decorate standalone <p><a> as buttons
    paragraphs.forEach((p) => {
      const links = [...p.querySelectorAll('a')];
      if (links.length && p.textContent.trim() === links.map((a) => a.textContent).join('')) {
        links.forEach((a, i) => {
          a.classList.add('button', i === 0 ? 'primary' : 'secondary');
        });
        p.classList.add('button-container');
      }
    });
  }
}
