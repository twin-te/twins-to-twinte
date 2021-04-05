/**
 * Copyright (c) Twin:te team.
 * This source code is licensed under the AGPL v3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Written by SIY1121
 * 
 */

if (
  document
    .querySelector("#main-portlet-title")
    .textContent.includes("履修登録・登録状況照会")
) {
  const insertAfter = (newNode, referenceNode) =>
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  const b = document.createElement("button");
  b.append(document.createTextNode("Twin:teにインポート"));
  b.onclick = async () => {
    const now = document.querySelector("[name=TimeoutForm]+table td").innerText;
    if (window.confirm(`${now}の時間割をインポートします`)) {
      const lectures = Array.from(
        document.querySelectorAll(".rishu-koma td td")
      )
        .map(el => el.innerText.split("\n")[0])
        .filter((el, i, self) => el !== "\u00A0" && self.indexOf(el) === i);

      postToSwift(
        lectures,
        document.querySelector("table td").textContent.match(/(\d{4})年度/)[1]
      );
    }
  };
  insertAfter(b, document.querySelector("#main-portlet-title"));
}

const postToSwift = async (lectures, year) => {
    let lecturesArray = [];
    lectures.forEach(lecture => {
        lecturesArray.push({
            code: lecture,
            year: year
        })
    })
    window.webkit.messageHandlers.returnFromTwins.postMessage(JSON.stringify(lecturesArray))
};
