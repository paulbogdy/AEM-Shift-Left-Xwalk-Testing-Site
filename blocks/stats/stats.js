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

    // Cell 0: value (the big number/stat)
    if (cells[0]) {
      const valueWrapper = document.createElement('div');
      valueWrapper.classList.add('stats-value');
      valueWrapper.innerHTML = cells[0].innerHTML;
      li.append(valueWrapper);
    }

    // Cell 1: label + optional description
    if (cells[1]) {
      const labelWrapper = document.createElement('div');
      labelWrapper.classList.add('stats-label');
      labelWrapper.innerHTML = cells[1].innerHTML;

      // First <p> = label (bold), rest = description
      const paras = [...labelWrapper.querySelectorAll('p')];
      if (paras[0]) paras[0].classList.add('stats-label-text');
      if (paras[1]) paras[1].classList.add('stats-description');

      li.append(labelWrapper);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
