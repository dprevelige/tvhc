export default function decorate(block) {
  const textCell = block.querySelector(':scope div:nth-child(1) > div');

  const content = document.createElement('div');
  content.classList.add('defaultoffer-content');

  if (textCell && textCell.innerHTML?.hasChildNodes()) {
    content.innerHTML = textCell.innerHTML;
  } else {
    content.innerHTML = "PLACEHOLDER";
  }

  block.innerHTML = '';
  block.append(content);
}
