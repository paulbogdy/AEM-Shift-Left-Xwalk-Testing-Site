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
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
        moveInstrumentation(img, optimized.querySelector('img'));
        picture.replaceWith(optimized);
      }
    }
  }

  if (bodyCell) {
    bodyCell.classList.add('teaser-body');

    // First non-empty <p> that has no block-level children = eyebrow label
    const paragraphs = [...bodyCell.querySelectorAll('p')];
    const firstPara = paragraphs.find((p) => p.textContent.trim().length > 0 && !p.querySelector('a'));
    if (firstPara) {
      firstPara.classList.add('teaser-eyebrow');
    }

    // Any <a> in a standalone <p> gets button class for CTA decoration
    bodyCell.querySelectorAll('p > a').forEach((a) => {
      a.classList.add('button');
    });
  }
}
