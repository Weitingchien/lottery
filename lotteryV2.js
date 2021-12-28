/* 01~38中任選六個號碼，再從第二個選號區的01~08任選一個號碼
總共這七個碼為投注號碼
*/
function random() {
  const winningNumbers = [];
  let first = null;
  let second = Math.floor(Math.random() * 8) + 1; // 01~08
  for (let i = 1; i <= 6; i++) {
    first = Math.floor(Math.random() * 38) + 1;
    if (winningNumbers.includes(`${first}`)) {
      //console.log(i);
      i -= 1;
      continue;
    }
    winningNumbers.push(`${first}`);
  }
  winningNumbers.push(`${second}`);
  //console.log(winningNumbers);
  if (winningNumbers.length === 7) {
    //console.log(winningNumbers);
    return winningNumbers;
  }
}

//手動選號
function pick(e, mainPackage) {
  const {
    firstRegionBtn,
    secondRegionBtn,
    firstRegionBtnNum,
    secondRegionBtnNum,
    resultsOfTheFirstRegion,
    resultsOfTheSecondRegion,
    firstRegionAlert,
    secondRegionAlert,
    SubmitBtn
  } = mainPackage;
  let currentBtn = e.target;
  //因為使用者可能會點到按鈕中間的空隙，所以沒點到時要直接return
  if (!currentBtn.dataset.num) {
    return;
  }
  //console.log(currentBtn.dataset.num.length);
  // 按鈕data-num的值總長度為3代表是r11~r19，如果總長度不等於3代表是r110~r138
  let btnId =
    currentBtn.dataset.num.length === 3
      ? currentBtn.dataset.num.substring(2, 3) //substring(開始位置 , 結束位置)
      : currentBtn.dataset.num.substring(2, 4);

  let btnReg = parseInt(currentBtn.dataset.num.substring(1, 2), 16); //parseInt的第二個參數16代表16進位

  if (currentBtn.getAttribute('class') === 'btn btn-warning') return;
  //判斷按鈕有沒有被點擊過，有被點擊過的話要取消，並且從陣列中找到這筆資料的索引，找到之後再刪除
  if (currentBtn.getAttribute('class') === 'btn btn-info') {
    currentBtn.setAttribute('class', 'btn btn-outline-dark');
    //從陣列中找按鈕的索引
    let pickIndex =
      btnReg === 1
        ? resultsOfTheFirstRegion.indexOf(btnId)
        : resultsOfTheSecondRegion.indexOf(btnId);

    if (btnReg === 1) {
      resultsOfTheFirstRegion.splice(pickIndex, 1);
      firstRegionAlert.textContent = 6 - resultsOfTheFirstRegion.length;
      if (resultsOfTheFirstRegion.length < 6) {
        SubmitBtn.setAttribute('disabled', true);
        //當第一區不足六碼，其他已被禁用的按鈕要解除禁用
        for (let i = 1; i <= firstRegionBtnNum; i++) {
          if (firstRegionBtn[i - 1].getAttribute('disabled') === 'true') {
            firstRegionBtn[i - 1].removeAttribute('disabled');
          }
        }
      }
      return;
    } else if (btnReg === 2) {
      resultsOfTheSecondRegion.splice(pickIndex, 1);
      secondRegionAlert.textContent = 1 - resultsOfTheSecondRegion.length;
      if (resultsOfTheSecondRegion.length < 1) {
        SubmitBtn.setAttribute('disabled', true);
        //當第二區不足一碼時，其他已被禁用的按鈕要解除禁用
        for (let i = 1; i <= secondRegionBtnNum; i++) {
          if (secondRegionBtn[i - 1].getAttribute('disabled') === 'true') {
            secondRegionBtn[i - 1].removeAttribute('disabled');
          }
        }
      }
      return;
    }
  }

  currentBtn.setAttribute('class', 'btn btn-info');
  if (btnReg === 1) {
    resultsOfTheFirstRegion.push(btnId);
    console.log(resultsOfTheFirstRegion);
    firstRegionAlert.textContent = 6 - resultsOfTheFirstRegion.length;
    if (resultsOfTheFirstRegion.length === 6) {
      //第一取選滿六碼之後，所選的這些號碼，以外的都要被禁用
      for (let i = 1; i <= firstRegionBtnNum; i++) {
        if (resultsOfTheFirstRegion.includes(`${i}`)) {
          continue;
        }
        firstRegionBtn[i - 1].setAttribute('disabled', true);
      }
    }
  } else if (btnReg === 2) {
    resultsOfTheSecondRegion.push(btnId);
    secondRegionAlert.textContent = 1 - resultsOfTheSecondRegion.length;
    if (resultsOfTheSecondRegion.length === 1) {
      //第二區選滿一碼，所選的這些號碼，以外的都要被禁用
      for (let i = 1; i <= secondRegionBtnNum; i++) {
        if (resultsOfTheSecondRegion.includes(`${i}`)) {
          continue;
        }
        secondRegionBtn[i - 1].setAttribute('disabled', true);
      }
    }
  }
  // 檢查是否兩個區的號碼都已選滿，如果已選滿就解除完成選號按鈕的禁用狀態
  if (
    resultsOfTheFirstRegion.length === 6 &&
    resultsOfTheSecondRegion.length === 1
  )
    SubmitBtn.removeAttribute('disabled');
}

//電腦選號
function autoPick(
  e,
  mainPackage,
  quickPickArr,
  quickPickOfTheFirstRegion,
  quickPickOfTheSecondRegion
) {
  const {
    firstRegionBtn,
    secondRegionBtn,
    firstRegionBtnNum,
    secondRegionBtnNum,
    firstRegionAlert,
    secondRegionAlert,
    SubmitBtn
  } = mainPackage;
  //重複按下電腦選號時，要把上次禁用狀態的按鈕給恢復成非禁用狀態
  reset(
    mainPackage,
    quickPickArr,
    quickPickOfTheFirstRegion,
    quickPickOfTheSecondRegion
  );

  quickPickArr.push(random());
  quickPickOfTheSecondRegion.push([quickPickArr[0].pop()]);
  quickPickOfTheFirstRegion.push(quickPickArr[0]);
  for (let i = 1; i <= firstRegionBtnNum; i++) {
    if (quickPickOfTheFirstRegion[0].includes(`${i}`)) {
      firstRegionBtn[i - 1].setAttribute('class', 'btn btn-warning');
      firstRegionAlert.textContent = 6 - quickPickOfTheFirstRegion[0].length;
    }
  }
  for (let j = 1; j <= secondRegionBtnNum; j++) {
    if (quickPickOfTheSecondRegion[0].includes(`${j}`)) {
      secondRegionBtn[j - 1].setAttribute('class', 'btn btn-warning');
      secondRegionAlert.textContent = 1 - quickPickOfTheSecondRegion[0].length;
    }
  }
  if (quickPickOfTheFirstRegion[0].length === 6) {
    //第一取選滿六碼之後，所選的這些號碼，以外的都要被禁用
    for (let i = 1; i <= firstRegionBtnNum; i++) {
      if (quickPickOfTheFirstRegion[0].includes(`${i}`)) {
        continue;
      }
      firstRegionBtn[i - 1].setAttribute('disabled', true);
    }
  }
  if (quickPickOfTheSecondRegion[0].length === 1) {
    //第二區選滿一碼，所選的這些號碼，以外的都要被禁用
    for (let j = 1; j <= secondRegionBtnNum; j++) {
      if (quickPickOfTheSecondRegion[0].includes(`${j}`)) {
        continue;
      }
      secondRegionBtn[j - 1].setAttribute('disabled', true);
    }
  }
  if (
    quickPickOfTheFirstRegion[0].length === 6 &&
    quickPickOfTheSecondRegion[0].length === 1
  ) {
    SubmitBtn.removeAttribute('disabled');
  }
  //return quickPickArr;
}

function buttonDataSet(mainPackage) {
  const {
    firstRegionBtn,
    firstRegionBtnNum,
    secondRegionBtn,
    secondRegionBtnNum
  } = mainPackage;

  for (let i = 0; i < firstRegionBtnNum; i++) {
    firstRegionBtn[i].setAttribute('data-num', `r1${i + 1}`); //r1(第一區) + 按鈕的id
  }
  for (let j = 0; j < secondRegionBtnNum; j++) {
    secondRegionBtn[j].setAttribute('data-num', `r2${j + 1}`); //r2(第二區) + 按鈕的id
  }
}

function main() {
  const resultsOfTheFirstRegion = []; //客戶所選的號碼會存在這個陣列裡面
  const resultsOfTheSecondRegion = [];
  const quickPickArr = [];
  const quickPickOfTheSecondRegion = [];
  const quickPickOfTheFirstRegion = [];
  const firstRegionAlert = document.querySelector('.firstregionAlert > span');
  const secondRegionAlert = document.querySelector('.secondregionAlert > span');
  const firstRegion = document.querySelector('.firstregion');
  const secondRegion = document.querySelector('.secondregion');
  const firstRegionBtn = document.querySelectorAll('.firstregion .btn'); //選取第一區的按鈕，選取之後會回傳一個陣列，裡面包含我們每一個按鈕
  const secondRegionBtn = document.querySelectorAll('.secondregion .btn');
  const SubmitBtn = document.querySelector('footer .btn-primary');
  const quickPickBtn = document.querySelector('footer .btn-danger');
  const clear = document.querySelector('footer .btn-success');
  const pickAgain = document.querySelector('.result > button');
  const main = document.querySelector('.main');
  const result = document.querySelector('.result');
  const prize = document.querySelector('.prize > span');
  const firstRegionBtnNum = firstRegionBtn.length; //第一區按鈕總數量
  const secondRegionBtnNum = secondRegionBtn.length;

  const mainPackage = {
    firstRegionBtn,
    secondRegionBtn,
    firstRegionBtnNum,
    secondRegionBtnNum,
    resultsOfTheFirstRegion,
    resultsOfTheSecondRegion,
    firstRegionAlert,
    secondRegionAlert,
    SubmitBtn
  };

  buttonDataSet(mainPackage);

  //電腦選號按鈕註冊監聽器
  quickPickBtn.addEventListener('click', function (e) {
    autoPick(
      e,
      mainPackage,
      quickPickArr,
      quickPickOfTheFirstRegion,
      quickPickOfTheSecondRegion
    );
  });

  //第一區 與 第二區註冊監聽器
  firstRegion.addEventListener('click', function (e) {
    pick(e, mainPackage);
  });
  secondRegion.addEventListener('click', function (e) {
    pick(e, mainPackage);
  });

  result.style.display = 'none';
  //再次選號按鈕註冊監聽器
  pickAgain.addEventListener('click', function send(e) {
    main.style.display = 'flex';
    result.style.display = 'none';
    reset(
      mainPackage,
      quickPickArr,
      quickPickOfTheFirstRegion,
      quickPickOfTheSecondRegion
    );
  });

  //完成選號按鈕註冊監聽器
  SubmitBtn.addEventListener('click', function send(e) {
    if (
      resultsOfTheFirstRegion.length === 6 &&
      resultsOfTheSecondRegion.length === 1
    ) {
      console.log('手動選號');
      renderResult(
        check(resultsOfTheFirstRegion, resultsOfTheSecondRegion),
        main,
        result,
        prize
      );
    } else {
      console.log('電腦選號');
      renderResult(
        check(quickPickOfTheFirstRegion, quickPickOfTheSecondRegion),
        main,
        result,
        prize
      );
    }
  });

  //清除全部按鈕註冊監聽器
  clear.addEventListener('click', function (e) {
    reset(
      mainPackage,
      quickPickArr,
      quickPickOfTheFirstRegion,
      quickPickOfTheSecondRegion
    );
  });
}

function reset(
  mainPackage,
  quickPickArr,
  quickPickOfTheFirstRegion,
  quickPickOfTheSecondRegion
) {
  const {
    firstRegionBtn,
    secondRegionBtn,
    firstRegionBtnNum,
    secondRegionBtnNum,
    resultsOfTheFirstRegion,
    resultsOfTheSecondRegion,
    firstRegionAlert,
    secondRegionAlert,
    SubmitBtn
  } = mainPackage;
  //清空原本的陣列;
  resultsOfTheFirstRegion.length = 0;
  resultsOfTheSecondRegion.length = 0;
  quickPickArr.length = 0;
  quickPickOfTheFirstRegion.length = 0;
  quickPickOfTheSecondRegion.length = 0;
  //計算按鈕未選次數重置
  firstRegionAlert.textContent = 6;
  secondRegionAlert.textContent = 1;
  //完成選號按鈕回到禁用狀態
  SubmitBtn.setAttribute('disabled', true);
  //兩區的按鈕重置
  for (let i = 0; i < firstRegionBtnNum; i++) {
    firstRegionBtn[i].removeAttribute('disabled');
    firstRegionBtn[i].setAttribute('class', 'btn btn-outline-dark');
  }
  for (let i = 0; i < secondRegionBtnNum; i++) {
    secondRegionBtn[i].removeAttribute('disabled');
    secondRegionBtn[i].setAttribute('class', 'btn btn-outline-dark');
  }
}

function check(firstRegionArr, secondRegionArr) {
  console.log(firstRegionArr, secondRegionArr);
  let times = 0;
  const winningNumbersOfFirstRegion = ['1', '22', '9', '38', '10', '5'];
  const winningNumbersOfSecondRegion = ['1'];
  const strWinningNumbersOfFirstRegion = JSON.stringify(
    winningNumbersOfFirstRegion
  );
  const strWinningNumbersOfSecondRegion = JSON.stringify(
    winningNumbersOfSecondRegion
  );
  const firstResult = JSON.stringify(firstRegionArr);
  const secondResult = JSON.stringify(secondRegionArr);
  if (
    firstResult === strWinningNumbersOfFirstRegion &&
    secondResult === strWinningNumbersOfSecondRegion
  ) {
    //頭獎
    return 119708348;
  } else if (
    firstResult === strWinningNumbersOfFirstRegion &&
    secondResult !== strWinningNumbersOfSecondRegion
  ) {
    //貳獎
    return 4284446;
  } else {
    winningNumbersOfFirstRegion.forEach((item, index) => {
      if (firstRegionArr.includes(item)) {
        times += 1;
      }
    });
    if (times === 5 && secondResult === strWinningNumbersOfSecondRegion) {
      //參獎
      return 150000;
    } else if (times === 5) {
      //肆獎
      return 20000;
    } else if (
      times === 4 &&
      secondResult === strWinningNumbersOfSecondRegion
    ) {
      // 伍獎
      return 4000;
    } else if (times === 4) {
      // 陸獎
      return 800;
    } else if (
      times === 3 &&
      secondResult === strWinningNumbersOfSecondRegion
    ) {
      //柒獎
      return 400;
    } else if (
      times === 2 &&
      secondResult === strWinningNumbersOfSecondRegion
    ) {
      // 捌獎
      return 200;
    } else if (times === 3) {
      // 玖獎
      return 100;
    } else if (
      times === 1 &&
      secondResult === strWinningNumbersOfSecondRegion
    ) {
      // 普獎
      return 100;
    } else {
      return 0;
    }
  }
}

function renderResult(total, main, result, prize) {
  main.style.display = 'none';
  result.style.display = 'flex';
  prize.textContent = total;
}

main();
