import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];

  // Determine layout: if first cell has a picture it's the portrait, otherwise single-cell body
  const firstCellHasPicture = cells[0]?.querySelector('picture');
  const imageCell = (cells.length >= 2 || firstCellHasPicture) && firstCellHasPicture ? cells[0] : null;
  const bodyCell = imageCell ? cells[1] : cells[0];

  if (!bodyCell) return;

  if (imageCell) {
    imageCell.classList.add('quote-image');
    const img = imageCell.querySelector('picture img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '160' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      img.closest('picture').replaceWith(optimized);
    }
  }

  bodyCell.classList.add('quote-body');
  const paragraphs = [...bodyCell.querySelectorAll('p')];

  if (paragraphs[0]) {
    const blockquote = document.createElement('blockquote');
    moveInstrumentation(paragraphs[0], blockquote);
    blockquote.innerHTML = paragraphs[0].innerHTML;
    paragraphs[0].replaceWith(blockquote);
  }

  if (paragraphs[1]) paragraphs[1].classList.add('quote-author');
  if (paragraphs[2]) paragraphs[2].classList.add('quote-role');
}
