let USERS = JSON.parse(localStorage.getItem('USERS')) || [
  { username: 'user', password: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', role: 'User' },
  { username: 'admin', password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', role: 'Admin' }
];

  const dataSets = {
    set1: [
      { id: 1, name: 'токарная обработка 1', value: 0 },
      { id: 2, name: 'токарная обработка 2', value: 0 },
      { id: 3, name: 'токарная обработка 3', value: 0 },
    ],
    set2: [
      { id: 1, name: 'шлифование 1', value: 0 },
      { id: 2, name: 'шлифование 2', value: 0 },
      { id: 3, name: 'шлифование 3', value: 0 },
    ],
    set3: [
      { id: 1, name: 'замер 1', value: 0 },
      { id: 2, name: 'замер 2', value: 0 },
      { id: 3, name: 'замер 3', value: 0 },
    ]
  };
  let currentItems = [];

 window.currentRole = null;
  
  const loginView = document.getElementById('loginView');
  const mainView  = document.getElementById('mainView');
  const loginForm = document.getElementById('loginForm');
  const loginError= document.getElementById('loginError');
  
  const logoutBtn = document.getElementById('logoutBtn');
  const adminMenu = document.getElementById('adminMenu');
  const panels    = document.querySelectorAll('.panel');
  const navLinks  = document.querySelectorAll('nav a[data-view]');
  
  const itemsTable = document.querySelector('#itemsTable tbody');
  const usersTable = document.querySelector('#usersTable tbody');
  const addUserBtn = document.getElementById('addUserBtn');
  
  const contextMenu = document.getElementById('contextMenu');
  let ctxTarget = null;
  
loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  const u = loginForm.username.value.trim();
  const p = loginForm.password.value.trim();
  const hashed = await hashPassword(p);

  const loginWrapper = document.querySelector('.login-wrapper');
  const passwordWrapper = document.querySelector('.password-wrapper');

  loginWrapper.classList.remove('error');
  passwordWrapper.classList.remove('error');

  const user = USERS.find(x => x.username === u && x.password === hashed);

  if (!user) {
    const usernameExists = USERS.some(x => x.username === u);

    if (!usernameExists) {
      loginWrapper.classList.add('error');
    } else {
      passwordWrapper.classList.add('error');
    }

    logAction(window.currentRole, `Ошибка входа: ${u}`);
    return;
  }

  // Успешный вход
  logAction(window.currentRole, `Успешный вход: ${u}`);
  window.currentRole = user.role;
  showMain();
  document.body.classList.remove('backOn');
});

window.addEventListener('DOMContentLoaded', async () => {
  const remembered = JSON.parse(localStorage.getItem('rememberedUser'));
  if (remembered) {
    const user = USERS.find(u => u.username === remembered.username && u.password === remembered.password);
    if (user) {
      window.currentRole = user.role;
      showMain();
      logAction(window.currentRole, `Автоматический вход: ${user.username}`);
    }
  }
});
  
  function showMain() {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');
    adminMenu.style.display = window.currentRole==='Admin' ? 'inline-block' : 'none';
    switchView(window.currentRole==='Admin' ? 'adminView' : 'userView');
    renderUsers(usersTable, USERS);
  }
  
  logoutBtn.addEventListener('click', () => {
    logAction(window.currentRole, `Выход пользователя: ${loginForm.username.value}`);
      document.body.classList.add('backOn');
    loginView.classList.remove('hidden');
    mainView.classList.add('hidden');
    loginForm.reset();
    loginError.textContent = '';
  });
  
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      switchView(a.dataset.view);
    });
  });
  function switchView(id) {
    panels.forEach(p=>p.id===id ? p.classList.remove('hidden') : p.classList.add('hidden'));
  }
  

  const select = document.getElementById('option');
  const container = document.getElementById('dataContainer');
  
  select.addEventListener('change', () => {
    const key = select.value;

    container.innerHTML = '';
  
    if (!key) {
      container.textContent = 'Пожалуйста, выберите набор данных.';
      return;
    }

    currentItems = dataSets[key] || [];
    const table = document.createElement('table');
    renderTable(table, currentItems)
    container.appendChild(table);

  });
  const clearBtn = document.getElementById('clearBtn');
  const saveBtn  = document.getElementById('saveBtn');


const STORAGE_KEY = 'savedDataSets';

select.addEventListener('change', () => {
  const key = select.value;
  container.innerHTML = '';

  if (!key) {
    container.textContent = 'Пожалуйста, выберите набор данных.';
    return;
  }

  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (savedData[key]) {
    currentItems = savedData[key];
  } else {
    currentItems = dataSets[key].map(item => ({ ...item }));
  }

  const table = document.createElement('table');
  renderTable(table, currentItems);
  container.appendChild(table);

  addInputListeners(table);
});

function addInputListeners(table) {
  const inputs = table.querySelectorAll('.value-input');
  inputs.forEach(input => {
    input.addEventListener('input', e => {
      const id = Number(e.target.dataset.id);
      const val = Number(e.target.value);
      const item = currentItems.find(i => i.id === id);
      if (item) {
        item.value = val;
      }
    });
  });
}

  clearBtn.addEventListener('click', () => {
  logAction(window.currentRole, `Пользователь очистил значения в таблице`);
  currentItems.forEach(item => item.value = 0);
  const table = container.querySelector('table');
  renderTable(table, currentItems);
  addInputListeners(table);
});

saveBtn.addEventListener('click', () => {
  logAction(window.currentRole, `Пользователь сохранил значения в таблице`);

  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  const key = select.value;
  if (!key) {
    alert('Выберите набор данных для сохранения');
    return;
  }
  savedData[key] = currentItems;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
  alert('Данные успешно сохранены');
});

  function renderTable(table, items){
    table.innerHTML = `
      <thead>
        <tr><th>ID</th><th>Название</th><th>Значение</th></tr>
      </thead>
      <tbody>
        ${items.map(item =>
          `<tr>
             <td>${item.id}</td>
             <td>${item.name}</td>
             <td><input type="number" class="value-input" data-id="${item.id}" value="${item.value}" style="width: 80px; padding: 4px;"></td>
           </tr>`
        ).join('')}
      </tbody>
    `;
  }

  function renderUsers(tbody, users){
    tbody.innerHTML = users.map(item =>
      `<tr>
         <td>${item.username}</td>
         <td>${item.role}</td>
         <td>
           <button class="btn-small" data-action="edit" data-user="${item.username}">✏</button>
           <button class="btn-small" data-action="delete" data-user="${item.username}">🗑</button>
         </td>
       </tr>`
    ).join('');
  }

  document.addEventListener('contextmenu', e => {
    if (e.target.closest('#itemsTable tr') || e.target.closest('#usersTable tr')) {
      e.preventDefault();
      ctxTarget = e.target.closest('tr');
      contextMenu.style.top = e.pageY + 'px';
      contextMenu.style.left= e.pageX + 'px';
      contextMenu.classList.remove('hidden');
    }
  });
  document.addEventListener('click', () => contextMenu.classList.add('hidden'));
  
  contextMenu.addEventListener('click', e => {
    const action = e.target.dataset.action;
    const isItem = ctxTarget.closest('#itemsTable');
    const id = ctxTarget.dataset.id || ctxTarget.querySelector('[data-user]').dataset.user;
    alert(`${action === 'edit' ? 'Редактировать' : 'Удалить'} ` +
          `${isItem ? 'измерение' : 'пользователя'}: ${id}`);
    contextMenu.classList.add('hidden');
  });
  
addUserBtn.addEventListener('click', async () => {
  logAction(window.currentRole, 'Администратор добавил нового пользователя');
  const name = prompt('Новый логин:');
  if (!name) return;
  const password = prompt('Пароль:');
  if (!password) return;
  const hashed = await hashPassword(password);
  USERS.push({ username: name, password: hashed, role: 'User' });
  localStorage.setItem('USERS', JSON.stringify(USERS));
  renderUsers(usersTable, USERS);
});

//хэширование
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

