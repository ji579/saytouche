// 보그 JS 링크 시스템 JS - linksys.js

export default function () {
  // ========================================
  // 사이드바 메뉴 기능
  // ========================================
  const menuToggle = document.getElementById('menuToggle');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    if (sidebarMenu && sidebarOverlay) {
      sidebarMenu.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('✅ 사이드바 열림');
    }
  }

  function closeSidebar() {
    if (sidebarMenu && sidebarOverlay) {
      sidebarMenu.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
      console.log('✅ 사이드바 닫힘');
    }
  }

  // 햄버거 메뉴 클릭
  if (menuToggle) {
    menuToggle.addEventListener('click', openSidebar);
    console.log('✅ 햄버거 메뉴 이벤트 연결됨');
  }

  // X 버튼 클릭
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
    console.log('✅ 닫기 버튼 이벤트 연결됨');
  }

  // 오버레이 클릭
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
    console.log('✅ 오버레이 이벤트 연결됨');
  }

  // ========================================
  // 사이드바 링크 시스템
  // ========================================
  document.querySelectorAll(".sidebar-nav a").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      const pm = href.substr(1); // # 제거
      
      console.log('🔗 사이드바 링크 클릭:', pm);
      
      // 사이드바 닫기
      closeSidebar();
      
      // 페이지 이동
      setTimeout(() => {
        if (pm === 'login') {
          console.log('→ login.html로 이동');
          location.href = "login.html";
        } else if (pm === 'contact') {
          console.log('→ contact.html로 이동');
          location.href = "contact.html";
        } else {
          console.log('→ category.html?pm=' + pm + '로 이동');
          location.href = "category.html?pm=" + pm;
        }
      }, 300); // 사이드바 닫히는 애니메이션 후 이동
    });
  });

  console.log('✅ 사이드바 링크 이벤트 연결 완료:', document.querySelectorAll(".sidebar-nav a").length + '개');

  // ========================================
  // [1] 로고 클릭시 홈으로 가기
  // ========================================
  const logoLink = document.querySelector(".site-header-logo");
  if (logoLink) {
    logoLink.onclick = (e) => {
      e.preventDefault();
      location.href = "index.html";
    };
  }

  // ========================================
  // [2] GNB 메뉴 링크셋팅 하기 (헤더의 ARCHIVE, SHOP, STORE)
  // ========================================
  document.querySelectorAll(".gnb-menu a").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const pm = this.getAttribute("href").substr(1);
      location.href = "category.html?pm=" + pm;
    });
  });

  // ========================================
  // [3] 메인 페이지 - .bgmenu 전체 영역 클릭
  // ========================================
  document.querySelectorAll(".menu-part .bgmenu").forEach((menu, index) => {
    // 각 메뉴에 클릭 이벤트 추가
    menu.addEventListener("click", function (e) {
      // a 태그 기본 동작 방지
      e.preventDefault();
      
      let targetPage = "";
      
      // 메뉴 순서에 따라 페이지 결정
      switch(index) {
        case 0: targetPage = "archive"; break;
        case 1: targetPage = "shop"; break;
        case 2: targetPage = "store"; break;
      }
      
      console.log(`메뉴 ${index + 1} 클릭됨, 이동: category.html?pm=${targetPage}`);
      
      if (targetPage) {
        location.href = "category.html?pm=" + targetPage;
      }
    });
    
    // 클릭 가능하도록 커서 변경
    menu.style.cursor = "pointer";
  });

  // ========================================
  // [4] 헤더 액션스 버튼 링크셋팅 하기
  // ========================================
  document.querySelectorAll(".header-actions button").forEach((el) => {
    el.addEventListener("click", function () {
      const cls = this.getAttribute("class");
      console.log("버튼클릭:", cls);
      switch (cls) {
        case "login-btn":
          console.log("로그인 페이지로 이동합니다.");
          location.href = "login.html";
          break;
        case "mem-btn":
          console.log("회원가입 페이지로 이동합니다.");
          location.href = "member.html";
          break;
      }
    });
  });
}