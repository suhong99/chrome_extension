chrome.commands.onCommand.addListener((command) => {
  if (command === 'start_reservation') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/images/icons-32.png',
      title: '알림',
      message: 'Alt+T가 눌렸습니다!',
    });

    chrome.storage.local.get(['startTime', 'endTime'], (data) => {
      const { startTime, endTime } = data;

      if (!startTime || !endTime) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '/images/icons-32.png',
          title: '알림',
          message: '저장된 시간이 없습니다. 시간을 먼저 설정해주세요.',
        });
        return;
      }

      // 시간을 숫자로 변환
      const startNumeric = parseInt(startTime.replace(':', ''), 10);
      const endNumeric = parseInt(endTime.replace(':', ''), 10);

      // 현재 활성 탭의 ID 가져오기
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '/images/icons-32.png',
            title: '알림',
            message: '활성화된 탭이 없습니다.',
          });
          return;
        }

        const tabId = tabs[0].id;

        // 스크립트 실행
        chrome.scripting.executeScript({
          target: { tabId },
          func: executeReservation,
          args: [startNumeric, endNumeric],
        });
      });
    });
  }
});

function executeReservation(startNumeric, endNumeric) {
  const rows = document.querySelectorAll('tr');
  rows.forEach((row) => {
    const timeCell = row.querySelector('td:first-child');
    if (timeCell) {
      const timeText = timeCell.textContent.trim();
      const timeNumeric = parseInt(timeText.replace(':', ''), 10);

      // 시간 범위 내의 row에서 버튼 클릭
      if (timeNumeric >= startNumeric && timeNumeric <= endNumeric) {
        const buttons = row.querySelectorAll('td button');
        buttons.forEach((button) => {
          if (!button.disabled) {
            button.click();
            console.log(`예약 버튼 클릭됨: ${timeText}`);
          }
        });
      }
    }
  });
}
