/**
 * Copyright (c) Twin:te team.
 * This source code is licensed under the AGPL v3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Written by SIY1121, takonasu
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
  Object.assign(b.style, {
    border: "none",
    position: "fixed",
    width: "90%",
    height: "46px",
    bottom: "3rem",
    color: "#ffffff",
    left: "50%",
    background: "linear-gradient(91.58deg, #6bcedc -8.01%, #71e2dc 105.39%)",
    transform: "translateX(-50%)",
    "-webkit-transform": "translateX(-50%)",
    "-ms-transform": "translateX(-50%)",
    "font-weight": "bold",
    "box-shadow":
      "-5px -5px 10px rgba(255, 255, 255, 0.6),2px 3px 8px rgba(165, 186, 199, 0.45)",
    "border-radius": "25px",
    "font-family": "Noto Sans JP",
  });
  b.onclick = async () => {
    const now = document.querySelector("[name=TimeoutForm]+table td").innerText;
    if (window.confirm(`${now}の時間割をインポートします`)) {
      const lectures = Array.from(
        document.querySelectorAll(".rishu-koma td td")
      )
        .map((el) => el.innerText.split("\n")[0])
        .filter((el, i, self) => el !== "\u00A0" && self.indexOf(el) === i);

      postToSwift(
        lectures,
        document.querySelector("table td").textContent.match(/(\d{4})年度/)[1]
      );
    }
  };
  insertAfter(b, document.querySelector("#footer-span"));
}

const postToSwift = async (lectures, year) => {
  const lecturesArray = lectures.map((lecture) => {
    return {
      code: lecture,
      year: year,
    };
  });

  window.webkit.messageHandlers.returnFromTwins.postMessage(
    JSON.stringify(lecturesArray)
  );
};
