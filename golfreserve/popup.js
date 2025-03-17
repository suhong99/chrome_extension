document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit');
  const startInput = document.getElementById('startInput');
  const endInput = document.getElementById('endInput');

  submitButton.addEventListener('click', () => {
    const startTime = startInput.value.trim();
    const endTime = endInput.value.trim();

    if (!startTime || !endTime) {
      alert('시작 시간과 종료 시간을 모두 입력해주세요.');
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      alert('시간 형식이 잘못되었습니다. 예: 11:00');
      return;
    }

    chrome.storage.local.set({ startTime, endTime }, () => {
      alert(`희망예약시간이 ${startTime} ~ ${endTime}으로 설정되었습니다`);
    });
  });
});
