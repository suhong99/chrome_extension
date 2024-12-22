chrome.commands.onCommand.addListener((command) => {
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

    const tab = tabs[0];
    const url = tab.url || '';

    // 허용된 URL에서만 명령 실행
    if (!url.startsWith('https://sillacc.co.kr/reservation/golf')) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/images/icons-32.png',
        title: '알림',
        message: '이 페이지에서는 확장 프로그램을 사용할 수 없습니다.',
      });
      return;
    }

    // 명령 처리
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

        const startNumeric = parseInt(startTime.replace(':', ''), 10);
        const endNumeric = parseInt(endTime.replace(':', ''), 10);

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: executeReservation,
          args: [startNumeric, endNumeric],
        });
      });
    }

    if (command === 'fill_cert_no') {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: fillCertNo,
      });
    }
  });
});
