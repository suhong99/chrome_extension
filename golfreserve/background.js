chrome.commands.onCommand.addListener((command) => {
  if (command === 'start_reservation') {
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

  // Alt + U 커맨드 처리
  if (command === 'fill_cert_no') {
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

      chrome.scripting.executeScript({
        target: { tabId },
        func: fillCertNo,
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
          }
        });
      }
    }
  });
}

function fillCertNo() {
  const certNoElement = document.getElementById('golfTimeDiv2CertNo');
  if (certNoElement) {
    const certNo = certNoElement.textContent.trim();

    // certNoChk 입력 필드에 값 설정
    const inputField = document.getElementById('certNoChk');
    if (inputField) {
      inputField.value = certNo;
      console.log(`certNo (${certNo})가 입력 필드에 설정되었습니다.`);

      // 입력이 완료된 후 예약 버튼 클릭
      const reservationButton = document.querySelector('.btn.btn-res03');
      if (reservationButton) {
        reservationButton.click();
        console.log('예약 버튼이 클릭되었습니다.');
      } else {
        console.error('예약 버튼을 찾을 수 없습니다.');
      }
    } else {
      console.error('certNoChk 입력 필드를 찾을 수 없습니다.');
    }
  } else {
    console.error('golfTimeDiv2CertNo 요소를 찾을 수 없습니다.');
  }
}
