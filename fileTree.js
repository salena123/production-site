const fileTree = {
  name: 'root',
  children: [
    { name: 'index.html' },
    { name: 'style.css' },
    { name: 'script.js' },
    { name: 'logs.js' },
    {
      name: 'picture',
      children: [
        { name: 'катенак.jpg' }
      ]
    }
  ]
};

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

document.querySelectorAll('a[data-view]').forEach(link => {
  link.addEventListener('click', function (e) {
    logAction(window.currentRole, 'Пользователь открыл файлы')
    e.preventDefault();
    const viewId = this.getAttribute('data-view');
    const view = document.getElementById(viewId);

    if (!view) return;

    const isHidden = view.classList.contains('hidden');

    if (isHidden && viewId === 'fileTreeView') {
      const container = document.getElementById('fileTreeContainer');
      container.innerHTML = '';
      const ul = document.createElement('ul');
      renderTree(fileTree, ul);
      container.appendChild(ul);
    }

    view.classList.toggle('hidden');
  });
});



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

