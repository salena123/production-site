const role = window.currentRole;

function logAction(username, action) {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({
    username: username,
    action: action,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('logs', JSON.stringify(logs));
}


function downloadLogs() {
  const logs = localStorage.getItem('logs');
  if (!logs || logs === '[]') {
    alert('Лог пуст или не создан.');
    return;
  }

  const blob = new Blob([logs], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'logs.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}


document.getElementById('downloadLogBtn').addEventListener('click', downloadLogs);

document.getElementById('clearLogsBtn').addEventListener('click', () => {
  localStorage.removeItem('logs');
  alert('Логи удалены!');
});

