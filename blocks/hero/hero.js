import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Move the picture to be a direct child of the block so CSS can
  // absolutely position it as a full-bleed background.
  const picture = block.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }, { width: '1200' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      picture.replaceWith(optimized);
    }

    // Prepend the (possibly replaced) picture directly onto the block
    block.prepend(block.querySelector('picture'));

    // Remove the now-empty image cell; remove its parent row if also empty
    const emptyCell = [...block.querySelectorAll(':scope > div > div')].find(
      (div) => !div.children.length && !div.textContent.trim(),
    );
    if (emptyCell) {
      const row = emptyCell.parentElement;
      emptyCell.remove();
      if (!row.hasChildNodes() || !row.textContent.trim()) row.remove();
    }
  }
}
