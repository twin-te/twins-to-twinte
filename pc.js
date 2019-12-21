/**
 * Copyright (c) Twin:te team.
 * This source code is licensed under the AGPL v3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Written by SIY1121
 */

/* 
  urlが
  https://twins.tsukuba.ac.jp/campusweb/campusportal.do?page=main&tabId=rs
  の時にこのスクリプトを読み込む
*/

const iframe = document.querySelector("#main-frame-if");
iframe.onload = () => {
  /* 
    ダウンロードページにはOutputForm内の要素が存在しているので
    それを利用して判定/ボタンを追加する
  */
  if (iframe.contentDocument.OutputForm.childElementCount > 0) modify();
};

/**
 * ページにインポートボタンを追加
 */
const modify = () => {
  const b = iframe.contentDocument.createElement("button");
  b.appendChild(iframe.contentDocument.createTextNode("Twinteにインポート"));

  b.onclick = e => {
    e.preventDefault();

    // FormDataを再現
    fData = new FormData();
    fData.append(
      "_flowExecutionKey",
      iframe.contentDocument.getElementsByName("_flowExecutionKey")[0].value
    );
    fData.append("_eventId", "output");
    fData.append("logicalDeleteFlg", "0");
    fData.append("outputType", "csv");
    fData.append("fileEncoding", "UTF8");

    $.ajax({
      url: iframe.contentDocument.OutputForm.action,
      type: "POST",
      data: fData,
      contentType: false,
      processData: false,
      success: data => {
        console.log(data);
        postToTwinte(data);
      },
      error: () => {
        alert("error");
      }
    });
  };

  iframe.contentDocument.OutputForm.append(b);
};

/**
 * twinsから取得したcsvをtwinteにインポート
 * @param {string} csv
 */
const postToTwinte = csv => {
  const matches = csv.matchAll(/"(.*?)"/gm);
  for (const match of matches) {
    $.ajax({
      url: "https://dev.api.twinte.net/v1/timetables/",
      type: "POST",
      data: JSON.stringify({ lectureCode: match[1], year: 2019 }),
      contentType: "application/json",
      dataType: "json",
      xhrFields: {
        withCredentials: true
      }
    });
  }
  alert("Twin:teへのインポートが完了しました");
};
