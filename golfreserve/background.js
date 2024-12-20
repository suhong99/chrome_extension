// chrome.runtime.onInstalled.addListener(() => {
//   // Command가 호출되었을 때 실행되는 리스너
//   chrome.commands.onCommand.addListener((command) => {
//     if (command === 'start-reservation') {
//       chrome.storage.local.get(['startTime', 'endTime'], (data) => {
//         const { startTime, endTime } = data;

//         if (!startTime || !endTime) {
//           alert('저장된 시간이 없습니다. 시간을 먼저 설정해주세요.');
//           return;
//         }

//         // 시간을 숫자로 변환 (11:00 -> 1100)
//         const startNumeric = parseInt(startTime.replace(':', ''), 10);
//         const endNumeric = parseInt(endTime.replace(':', ''), 10);

//         chrome.scripting.executeScript({
//           target: { tabId: sender.tab.id },
//           func: executeReservation,
//           args: [startNumeric, endNumeric],
//         });
//       });
//     }
//   });
// });

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

chrome.commands.onCommand.addListener((command) => {
  if (command === 'show_alert') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/images/icons-16.png',
      title: '알림',
      message: 'Alt+T가 눌렸습니다!',
    });
  }
});
