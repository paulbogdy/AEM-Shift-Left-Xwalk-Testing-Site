import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const tabList = document.createElement('ul');
  tabList.setAttribute('role', 'tablist');
  tabList.classList.add('tabs-nav');

  const panels = [];

  rows.forEach((row, index) => {
    const labelCell = row.children[0];
    const contentCell = row.children[1];
    if (!labelCell || !contentCell) return;

    const tabId = `tab-${index}`;
    const panelId = `tab-panel-${index}`;

    // Tab button
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');

    const button = document.createElement('button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('id', tabId);
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    button.innerHTML = labelCell.innerHTML;
    li.append(button);
    tabList.append(li);

    // Panel
    const panel = document.createElement('div');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', panelId);
    panel.setAttribute('aria-labelledby', tabId);
    panel.classList.add('tabs-panel');
    if (index !== 0) panel.setAttribute('hidden', '');
    moveInstrumentation(row, panel);
    panel.innerHTML = contentCell.innerHTML;
    panels.push(panel);
  });

  // Click + keyboard handling
  tabList.addEventListener('click', (e) => {
    const button = e.target.closest('[role="tab"]');
    if (!button) return;
    activateTab(button, tabList, panels);
  });

  tabList.addEventListener('keydown', (e) => {
    const buttons = [...tabList.querySelectorAll('[role="tab"]')];
    const current = buttons.indexOf(document.activeElement);
    if (current === -1) return;

    let next = -1;
    if (e.key === 'ArrowRight') next = (current + 1) % buttons.length;
    if (e.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = buttons.length - 1;

    if (next !== -1) {
      e.preventDefault();
      buttons[next].focus();
      activateTab(buttons[next], tabList, panels);
    }
  });

  block.replaceChildren(tabList, ...panels);
}

function activateTab(button, tabList, panels) {
  tabList.querySelectorAll('[role="tab"]').forEach((btn, i) => {
    const isSelected = btn === button;
    btn.setAttribute('aria-selected', String(isSelected));
    btn.setAttribute('tabindex', isSelected ? '0' : '-1');
    const panel = panels[i];
    if (panel) {
      if (isSelected) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    }
  });
}
