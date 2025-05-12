chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start_reservation") {
    const { startNumeric, endNumeric } = message;

    // 예약 실행 로직
    executeReservation(startNumeric, endNumeric);
  }

  if (message.action === "start_self_reservation") {
    const { startNumeric, endNumeric } = message;

    executeSelfReservation(startNumeric, endNumeric);
  }

  if (message.action === "fill_cert_no") {
    // 인증 번호 입력 로직
    fillCertNo();
  }
});

// 예약 실행 함수
function executeReservation(startNumeric, endNumeric) {
  const rows = document.querySelectorAll("tr");
  for (const row of rows) {
    const timeCell = row.querySelector("td:first-child");
    if (timeCell) {
      const timeText = timeCell.textContent.trim();
      const timeNumeric = parseInt(timeText.replace(":", ""), 10);

      if (timeNumeric >= startNumeric && timeNumeric <= endNumeric) {
        const buttons = row.querySelectorAll("td button");
        for (const button of buttons) {
          if (!button.disabled) {
            button.click();
            return; // 하나 실행되면 멈춤
          }
        }
      }
    }
  }
}

// 셀프 예약만 하기
function executeSelfReservation(startNumeric, endNumeric) {
  const rows = document.querySelectorAll("tr");
  for (const row of rows) {
    const timeCell = row.querySelector("td:first-child");
    if (timeCell) {
      const timeText = timeCell.textContent.trim();
      const timeNumeric = parseInt(timeText.replace(":", ""), 10);

      if (timeNumeric >= startNumeric && timeNumeric <= endNumeric) {
        const buttons = row.querySelectorAll("td button");

        // '셀프신청'이 포함된 버튼만 클릭
        for (const button of buttons) {
          if (button.textContent.includes("셀프신청") && !button.disabled) {
            button.click();
            return;
          }
        }
      }
    }
  }
}

// 인증 번호 입력 함수
function fillCertNo() {
  const certNoElement = document.getElementById("golfTimeDiv2CertNo");
  if (certNoElement) {
    const certNo = certNoElement.textContent.trim();
    const inputField = document.getElementById("certNoChk");
    if (inputField) {
      inputField.value = certNo;
      // console.log(`인증 번호 (${certNo})가 입력되었습니다.`);
      const reservationButton = document.querySelector(".btn.btn-res03");
      if (reservationButton) {
        reservationButton.click();
        // console.log("예약 버튼이 클릭되었습니다.");
      }
    } else {
      // console.error("입력 필드를 찾을 수 없습니다.");
    }
  } else {
    // console.error("인증 번호 요소를 찾을 수 없습니다.");
  }
}
