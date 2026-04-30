import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells[0];
  const bodyCell = cells[1];

  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      imageCell.classList.add('quote-image');
      const img = picture.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '160' }]);
        moveInstrumentation(img, optimized.querySelector('img'));
        picture.replaceWith(optimized);
      }
    } else {
      // No image — move any text content to body
      if (bodyCell) {
        bodyCell.prepend(...imageCell.childNodes);
      }
      imageCell.remove();
    }
  }

  if (bodyCell) {
    bodyCell.classList.add('quote-body');
    const paragraphs = [...bodyCell.querySelectorAll('p')];

    if (paragraphs[0]) {
      const blockquote = document.createElement('blockquote');
      blockquote.innerHTML = paragraphs[0].innerHTML;
      paragraphs[0].replaceWith(blockquote);
    }

    if (paragraphs[1]) {
      paragraphs[1].classList.add('quote-author');
    }

    if (paragraphs[2]) {
      paragraphs[2].classList.add('quote-role');
    }
  }
}
