import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  let startIndex = 0;

  // Check if first row is a single-cell heading row
  const firstRow = rows[0];
  if (firstRow && firstRow.children.length === 1) {
    const firstCell = firstRow.children[0];
    if (firstCell.querySelector('h1, h2, h3, h4')) {
      const heading = firstCell.querySelector('h1, h2, h3, h4');
      const headingEl = document.createElement(heading.tagName);
      headingEl.classList.add('list-heading');
      headingEl.innerHTML = heading.innerHTML;
      block.before(headingEl);
      startIndex = 1;
    }
  }

  const ul = document.createElement('ul');
  ul.classList.add('list-items');

  rows.slice(startIndex).forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const contentCell = cells[1];

    const li = document.createElement('li');
    li.classList.add('list-item');
    moveInstrumentation(row, li);

    if (iconCell) {
      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add('list-item-icon');
      iconWrapper.innerHTML = iconCell.innerHTML;
      li.append(iconWrapper);
    }

    if (contentCell) {
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('list-item-content');
      contentWrapper.innerHTML = contentCell.innerHTML;
      li.append(contentWrapper);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
