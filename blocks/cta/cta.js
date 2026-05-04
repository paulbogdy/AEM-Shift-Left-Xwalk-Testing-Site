import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Variant: AEM may deliver it as a CSS class already, or as a standalone text cell.
  // Detect the text-cell case and promote it to a class, then remove the cell.
  [...block.querySelectorAll('div > div')].forEach((cell) => {
    const text = cell.textContent.trim().toLowerCase();
    if (text === 'dark' || text === 'light') {
      if (!block.classList.contains(text)) block.classList.add(text);
      cell.closest('div').remove();
    }
  });

  // Ensure a heading exists — promote the first non-link, non-empty <p> to <h2>.
  if (!block.querySelector('h1, h2, h3, h4')) {
    const candidate = [...block.querySelectorAll('p')].find(
      (p) => p.textContent.trim() && !p.querySelector('a'),
    );
    if (candidate) {
      const h2 = document.createElement('h2');
      moveInstrumentation(candidate, h2);
      h2.innerHTML = candidate.innerHTML;
      candidate.replaceWith(h2);
    }
  }

  // Decorate links as buttons. Works whether links live in a plain <p> or richtext.
  let linkIndex = 0;
  block.querySelectorAll('a').forEach((a) => {
    a.classList.add('button', linkIndex === 0 ? 'primary' : 'secondary');
    const p = a.closest('p');
    if (p) p.classList.add('button-container');
    linkIndex += 1;
  });
}
