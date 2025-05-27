function fittsLawTime(D, W, a = 0.2, b = 0.1) {
  return a + b * Math.log2(D / W + 1);
}

document.addEventListener('mousemove', function(e) {
  const button = document.getElementById('signin');
  if (!button) {
        console.log('Кнопка singin не найдена');
        return;
  } 

  const rect = button.getBoundingClientRect();

  const buttonX = rect.left + rect.width / 2;
  const buttonY = rect.top + rect.height / 2;

  const cursorX = e.clientX;
  const cursorY = e.clientY;

  const dx = buttonX - cursorX;
  const dy = buttonY - cursorY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const W = rect.width;
  const T = fittsLawTime(distance, W);

  console.log(`Время по закону Фитса: ${T.toFixed(3)} сек.`);
});
