import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const ul = document.createElement('ul');
  ul.classList.add('stats-grid');

  rows.forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    li.classList.add('stats-item');
    moveInstrumentation(row, li);

    if (cells.length >= 2) {
      // Two-cell delivery: cell[0] = value, cell[1] = label + optional description
      const valueWrapper = document.createElement('div');
      valueWrapper.classList.add('stats-value');
      valueWrapper.innerHTML = cells[0].innerHTML;
      li.append(valueWrapper);

      const labelWrapper = document.createElement('div');
      labelWrapper.classList.add('stats-label');
      labelWrapper.innerHTML = cells[1].innerHTML;
      const paras = [...labelWrapper.querySelectorAll('p')];
      if (paras[0]) paras[0].classList.add('stats-label-text');
      if (paras[1]) paras[1].classList.add('stats-description');
      li.append(labelWrapper);
    } else if (cells[0]) {
      // Single-cell delivery: paragraphs map to value → label → description in order
      const paras = [...cells[0].querySelectorAll('p')];

      const valueWrapper = document.createElement('div');
      valueWrapper.classList.add('stats-value');
      valueWrapper.innerHTML = paras[0] ? paras[0].innerHTML : cells[0].innerHTML;
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
