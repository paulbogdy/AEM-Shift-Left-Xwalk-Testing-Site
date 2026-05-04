import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.classList.add('profiles-grid');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    li.classList.add('profile-card');
    moveInstrumentation(row, li);

    // Cell 0: portrait photo
    const photoCell = cells[0];
    if (photoCell) {
      const picture = photoCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
          moveInstrumentation(img, optimized.querySelector('img'));
          picture.replaceWith(optimized);
        }
        const photoWrapper = document.createElement('div');
        photoWrapper.classList.add('profile-photo');
        photoWrapper.append(photoCell.querySelector('picture'));
        li.append(photoWrapper);
      }
    }

    // Cell 1: structured info
    const infoCell = cells[1];
    if (infoCell) {
      const infoWrapper = document.createElement('div');
      infoWrapper.classList.add('profile-info');

      const elements = [...infoCell.children];
      elements.forEach((el) => {
        const tag = el.tagName.toLowerCase();

        // Heading = name
        if (/^h[1-6]$/.test(tag)) {
          el.classList.add('profile-name');
        }

        const text = el.textContent.trim();
        const paras = infoCell.querySelectorAll('p');

        // First <p> after heading = title/role
        // Second <p> = department
        // Longer <p> (>60 chars) = bio
        // <p> with only <a> = social/links
        if (tag === 'p') {
          const links = el.querySelectorAll('a');
          if (links.length && el.textContent.trim() === [...links].map((a) => a.textContent).join('')) {
            el.classList.add('profile-links');
          } else if (text.length > 60) {
            el.classList.add('profile-bio');
          }
        }

        infoWrapper.append(el);
      });

      // Label first two plain <p> elements as title and department
      const plainParas = [...infoWrapper.querySelectorAll('p:not(.profile-bio):not(.profile-links)')];
      if (plainParas[0]) plainParas[0].classList.add('profile-title');
      if (plainParas[1]) plainParas[1].classList.add('profile-department');

      li.append(infoWrapper);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
