document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit');

  submitButton.addEventListener('click', () => {
    const dateInput = document.getElementById('dateInput').value.trim();
    const timeInput = document.getElementById('timeInput').value.trim();

    // 입력값 검증
    if (dateInput.length !== 6 || isNaN(dateInput)) {
      alert('연월일시를 올바르게 입력해주세요. (예: 241218)');
      return;
    }
    if (timeInput.length !== 6 || isNaN(timeInput)) {
      alert('시분초를 올바르게 입력해주세요. (예: 180000)');
      return;
    }

    // 날짜와 시간 파싱
    const year = parseInt(`20${dateInput.slice(0, 2)}`, 10); // 2자리 연도를 4자리로 변환
    const month = parseInt(dateInput.slice(2, 4), 10);
    const day = parseInt(dateInput.slice(4, 6), 10);
    const hour = parseInt(timeInput.slice(0, 2), 10);
    const minute = parseInt(timeInput.slice(2, 4), 10);
    const second = parseInt(timeInput.slice(4, 6), 10);

    // 값 검증
    if (
      year < 2000 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59 ||
      second < 0 ||
      second > 59
    ) {
      alert('올바른 날짜와 시간을 입력해주세요.');
      return;
    }

    // 날짜를 Date 객체로 변환
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(
      minute
    ).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    const targetTime = new Date(formattedDate).getTime();

    if (isNaN(targetTime)) {
      alert('유효하지 않은 날짜입니다.');
      return;
    }

    // background.js에서 사용할 수 있도록 시간 기록 (chrome.storage 사용)
    chrome.storage.local.set({ targetTime: targetTime }, () => {
      alert(`${targetTime} 시간이 기록되었습니다!`);
    });
  });
});
