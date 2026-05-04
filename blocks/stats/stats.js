import { moveInstrumentation } from '../../scripts/scripts.js';

// Extract text/HTML from a cell regardless of whether it uses <p> wrappers or not
function cellContent(cell) {
  if (!cell) return '';
  // If there are block-level children, return innerHTML as-is
  if (cell.children.length) return cell.innerHTML;
  // Plain text node (no <p> wrapper from AEM text fields)
  return `<p>${cell.textContent.trim()}</p>`;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const ul = document.createElement('ul');
  ul.classList.add('stats-grid');

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const li = document.createElement('li');
    li.classList.add('stats-item');
    moveInstrumentation(row, li);

    if (cells.length >= 3) {
      // Three-cell delivery: value | label | description
      const valueWrapper = document.createElement('div');
      valueWrapper.classList.add('stats-value');
      valueWrapper.innerHTML = cellContent(cells[0]);

      const labelWrapper = document.createElement('div');
      labelWrapper.classList.add('stats-label');

      const labelText = document.createElement('p');
      labelText.classList.add('stats-label-text');
      labelText.innerHTML = cells[1].textContent.trim() || cells[1].innerHTML;
      labelWrapper.append(labelText);

      const descText = cells[2].textContent.trim();
      if (descText) {
        const desc = document.createElement('p');
        desc.classList.add('stats-description');
        desc.innerHTML = cells[2].innerHTML;
        labelWrapper.append(desc);
      }

      li.append(valueWrapper, labelWrapper);
    } else if (cells.length === 2) {
      // Two-cell delivery: value | label (description may be second <p> in label cell)
      const valueWrapper = document.createElement('div');
      valueWrapper.classList.add('stats-value');
      valueWrapper.innerHTML = cellContent(cells[0]);

      const labelWrapper = document.createElement('div');
      labelWrapper.classList.add('stats-label');
      labelWrapper.innerHTML = cells[1].innerHTML;

      const paras = [...labelWrapper.querySelectorAll('p')];
      if (paras[0]) paras[0].classList.add('stats-label-text');
      if (paras[1]) paras[1].classList.add('stats-description');

      // If no <p> children, wrap raw text
      if (!paras.length && labelWrapper.textContent.trim()) {
        labelWrapper.innerHTML = `<p class="stats-label-text">${labelWrapper.textContent.trim()}</p>`;
      }

      li.append(valueWrapper, labelWrapper);
    } else {
      // Single-cell fallback: paragraphs or lines map to value → label → description
      const paras = [...cells[0].querySelectorAll('p')];

      const valueWrapper = document.createElement('div');
      valueWrapper.classList.add('stats-value');
      valueWrapper.innerHTML = paras[0] ? paras[0].innerHTML : `<p>${cells[0].textContent.trim()}</p>`;
      li.append(valueWrapper);

      if (paras.length > 1) {
        const labelWrapper = document.createElement('div');
        labelWrapper.classList.add('stats-label');

        const labelText = document.createElement('p');
        labelText.classList.add('stats-label-text');
        labelText.innerHTML = paras[1].innerHTML;
        labelWrapper.append(labelText);

        if (paras[2]) {
          const desc = document.createElement('p');
          desc.classList.add('stats-description');
          desc.innerHTML = paras[2].innerHTML;
          labelWrapper.append(desc);
        }

        li.append(labelWrapper);
      }
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
