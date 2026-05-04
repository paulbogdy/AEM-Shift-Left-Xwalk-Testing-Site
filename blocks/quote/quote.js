import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];

  // Model field order: image(0) | imageAlt(1) | quote(2) | author(3) | role(4)
  // imageAlt is already baked into the img element by AEM — skip cells[1].
  // When no image is set AEM delivers only 3 cells (quote|author|role), not 5.
  // Use cells.length >= 5 to distinguish the two cases — not >= 3, which
  // would incorrectly map cells[2] to role when no image is present.
  const hasImageFields = cells.length >= 5;

  const imageCell = hasImageFields ? cells[0] : null;
  const quoteCell = hasImageFields ? cells[2] : cells[0];
  const authorCell = hasImageFields ? cells[3] : cells[1];
  const roleCell = hasImageFields ? cells[4] : cells[2];

  if (!quoteCell?.textContent.trim() && !quoteCell?.querySelector('*')) return;

  // Portrait image — only use if the cell actually contains a picture
  const hasPicture = imageCell?.querySelector('picture');
  if (hasPicture) {
    imageCell.classList.add('quote-image');
    const img = imageCell.querySelector('picture img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '160' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      img.closest('picture').replaceWith(optimized);
    }
  }

  // Build the quote body div
  const body = document.createElement('div');
  body.classList.add('quote-body');
  moveInstrumentation(quoteCell, body);

  // Quote text → <blockquote>
  const blockquote = document.createElement('blockquote');
  // richtext field delivers HTML; plain text field delivers a text node
  const quoteHTML = quoteCell.innerHTML.trim();
  const quoteText = quoteCell.textContent.trim();
  blockquote.innerHTML = quoteHTML || `<p>${quoteText}</p>`;
  body.append(blockquote);

  // Author
  const authorText = authorCell?.textContent.trim();
  if (authorText) {
    const p = document.createElement('p');
    p.classList.add('quote-author');
    p.textContent = authorText;
    body.append(p);
  }

  // Role / company
  const roleText = roleCell?.textContent.trim();
  if (roleText) {
    const p = document.createElement('p');
    p.classList.add('quote-role');
    p.textContent = roleText;
    body.append(p);
  }

  // Rebuild row cleanly
  row.replaceChildren(...(hasPicture ? [imageCell, body] : [body]));
}
