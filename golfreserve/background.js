chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      notify('활성화된 탭이 없습니다.');
      return;
    }

    const tab = tabs[0];
    const url = tab.url || '';

    // 허용된 URL에서만 명령 실행
    if (!url.startsWith('https://sillacc.co.kr/reservation/golf')) {
      notify('이 페이지에서는 확장 프로그램을 사용할 수 없습니다.');
      return;
    }

    // 명령 처리
    if (
      command === 'start_reservation' ||
      command === 'start_self_reservation'
    ) {
      chrome.storage.local.get(['startTime', 'endTime'], (data) => {
        const { startTime, endTime } = data;

        if (!startTime || !endTime) {
          notify('저장된 시간이 없습니다. 시간을 먼저 설정해주세요.');
          return;
        }

        const startNumeric = parseInt(startTime.replace(':', ''), 10);
        const endNumeric = parseInt(endTime.replace(':', ''), 10);

        // 콘텐츠 스크립트로 시간 범위를 전달
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ['content.js'],
          },
          () => {
            chrome.tabs.sendMessage(tab.id, {
              action: command,
              startNumeric,
              endNumeric,
            });
          }
        );
      });
    }

    if (command === 'fill_cert_no') {
      // 콘텐츠 스크립트에 fill_cert_no 액션 전달
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ['content.js'],
        },
        () => {
          chrome.tabs.sendMessage(tab.id, { action: 'fill_cert_no' });
        }
      );
    }
  });
});

function notify(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/images/icons-32.png',
    title: '알림',
    message: message,
  });
}
