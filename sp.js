/**
 * Copyright (c) Twin:te team.
 * This source code is licensed under the AGPL v3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Written by SIY1121
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
      if (!(await checkTwinteLogin())) {
        alert("エラー\nアプリ側でTwin:teにログインしてからご利用いただけます");
        return;
      }

      const lectures = Array.from(
        document.querySelectorAll(".rishu-koma td td")
      )
        .map(el => el.innerText.split("\n")[0])
        .filter((el, i, self) => el !== "\u00A0" && self.indexOf(el) === i);

      postToTwinte(
        lectures,
        document.querySelector("table td").textContent.match(/(\d{4})年度/)[1]
      );
    }
  };
  insertAfter(b, document.querySelector("#main-portlet-title"));
}

const checkTwinteLogin = async () => {
  const { ok } = await fetch("https://app.twinte.net/api/v3/users/me", {
    credentials: "include"
  });
  return ok;
};

const postToTwinte = async (lectures, year) => {
  const res = await Promise.all(
    lectures.map(async l => {
      const { ok } = await fetch("https://app.twinte.net/api/v3/registered-courses/", {
        method: "POST",
        body: JSON.stringify({ code: l, year }),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        credentials: "include"
      });
      return ok;
    })
  );
  alert(
    `Twin:teへのインポートが完了しました\n新規追加：${
      res.filter(el => el).length
    }件`
  );
};
