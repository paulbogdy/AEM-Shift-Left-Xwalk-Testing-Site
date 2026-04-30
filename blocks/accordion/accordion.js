import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    const cells = [...row.children];
    const questionCell = cells[0];
    const answerCell = cells[1];

    if (!questionCell || !answerCell) return;

    const item = document.createElement('div');
    item.classList.add('accordion-item');
    moveInstrumentation(row, item);

    const panelId = `accordion-panel-${index}`;
    const buttonId = `accordion-button-${index}`;

    // Build trigger button
    const trigger = document.createElement('button');
    trigger.classList.add('accordion-trigger');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panelId);
    trigger.setAttribute('id', buttonId);
    trigger.innerHTML = questionCell.innerHTML;

    // Build panel
    const panel = document.createElement('div');
    panel.classList.add('accordion-panel');
    panel.setAttribute('id', panelId);
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', buttonId);
    panel.setAttribute('hidden', '');
    panel.innerHTML = answerCell.innerHTML;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other open items
      block.querySelectorAll('.accordion-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.accordion-panel').setAttribute('hidden', '');
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.removeAttribute('hidden');
      }
    });

    item.append(trigger, panel);
    row.replaceWith(item);
  });
}
