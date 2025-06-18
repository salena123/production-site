function renderTree(node, parent) {
  const li = document.createElement('li');

  if (node.children) {
    const folderName = document.createElement('span');
    folderName.textContent = node.name;
    folderName.style.fontWeight = 'bold';
    folderName.style.cursor = 'pointer';

    const ul = document.createElement('ul');
    ul.style.display = 'none';

    node.children.forEach(child => renderTree(child, ul));

    folderName.addEventListener('click', () => {
      ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
    });

    li.appendChild(folderName);
    li.appendChild(ul);
  } else {
    li.textContent = node.name;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      alert(` ${window.currentRole}, Вы выбрали файл: ${node.name}`);
    });
  }

  parent.appendChild(li);
}


function convertToTree(obj, name = "root") {
  const result = {
    name,
    children: []
  };

  for (const key in obj) {
    if (obj[key] === null) {
      result.children.push({ name: key });
    } else {
      result.children.push(convertToTree(obj[key], key));
    }
  }

  return result;
}

