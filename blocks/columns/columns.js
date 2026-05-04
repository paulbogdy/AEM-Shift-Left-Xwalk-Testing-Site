import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        col.classList.add('columns-img-col');

        // Optimize image — wide enough for a 50% column at full desktop width
        const img = pic.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [
            { width: '750' },
            { media: '(min-width: 900px)', width: '1200' },
          ]);
          moveInstrumentation(img, optimized.querySelector('img'));
          pic.replaceWith(optimized);
        }
      } else {
        col.classList.add('columns-text-col');
      }
    });
  });
}
