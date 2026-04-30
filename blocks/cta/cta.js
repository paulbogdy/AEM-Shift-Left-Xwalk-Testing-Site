import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Decorate links as buttons
  const links = block.querySelectorAll('a');
  links.forEach((a, index) => {
    const p = a.closest('p') || a.parentElement;
    if (index === 0) {
      a.classList.add('button', 'primary');
    } else if (index === 1) {
      a.classList.add('button', 'secondary');
    }
    // Ensure parent p gets button-container class for proper spacing
    if (p && p.tagName === 'P') {
      p.classList.add('button-container');
    }
    moveInstrumentation(a, a);
  });
}
