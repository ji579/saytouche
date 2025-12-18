import goToPage from "./linksys.js";

(() => {
  const $topArea = $("#top-area");
  const $bottomArea = $("#bottom-area");

  // 상단부 html넣기
  $topArea.load("./inc/header.html", () => {
    // 헤더가 로딩된 후에 링크 시스템 실행!
    goToPage(); // ← 모든 페이지에서 실행됨
  });

  // 하단부 html넣기
  $bottomArea.load("./inc/footer.html");

})();