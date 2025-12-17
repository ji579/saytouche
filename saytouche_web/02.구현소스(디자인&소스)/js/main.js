window.addEventListener("load", () => {
  const header = document.querySelector(".top");
  const menuPart = document.querySelector(".menu-part");

  let prevScroll = 0;
  let isSnapping = false;

  window.addEventListener("scroll", () => {
    let curScroll = window.scrollY;
    let scrollDirection = curScroll > prevScroll ? "down" : "up";

    // 헤더 스크롤 반응 (먼저 처리)
    if (prevScroll < curScroll && curScroll > 50) {
      header.classList.add("scrolled");
    } else if (prevScroll > curScroll && curScroll < 50) {
      header.classList.remove("scrolled");
    }

    // 현재 헤더 높이 가져오기 (190px 또는 84px)
    const headerHeight = header.offsetHeight;
    // menu-part의 실제 위치 (margin-top 84px 포함)
    const menuPartTop = menuPart.getBoundingClientRect().top + window.scrollY;
    // 헤더 바로 아래에 menu-part가 오는 스크롤 위치
    const snapPosition = menuPartTop - headerHeight;

    // 아래로 스크롤하면서 snapPosition 근처 도달
    if (
      !isSnapping &&
      scrollDirection === "down" &&
      curScroll >= snapPosition - 100 &&
      curScroll <= snapPosition + 100
    ) {
      isSnapping = true;

      // header에 border-bottom 추가
      header.style.borderBottom = "2px solid #000";

      // snapPosition으로 즉시 이동
      window.scrollTo(0, snapPosition);

      // 0.6초 동안만 고정 (짧게)
      let snapCount = 0;
      const snapInterval = setTimeout(() => {
        const currentHeaderHeight = header.offsetHeight;
        const currentMenuPartTop =
          menuPart.getBoundingClientRect().top + window.scrollY;
        const targetPosition = currentMenuPartTop - currentHeaderHeight;

        window.scrollTo(0, targetPosition);
        snapCount++;

        // 0.2초 후 해제 10회 × 20ms
        if (snapCount > 10) {
          clearTimeout(snapInterval);
          isSnapping = false;
        }
      }, 1);
    }

    // 위로 스크롤하면 즉시 해제
    if (isSnapping && scrollDirection === "up") {
      isSnapping = false;
    }

    // snapPosition에서 많이 벗어나면 border 제거
    else if (curScroll > snapPosition + 150) {
      header.style.borderBottom = "";
    }
    // 위로 많이 올라가면 border 제거 및 리셋
    else if (curScroll < snapPosition - 100) {
      header.style.borderBottom = "";
      isSnapping = false;
    }

    prevScroll = curScroll;
  });

  // Swiper 초기화
  let menuSwiper;
  
  function initSwiper() {
    // 기존 Swiper가 있으면 제거
    if (menuSwiper) {
      menuSwiper.destroy(true, true);
    }

    const windowWidth = window.innerWidth;

    // 1024px 이하에서만 Swiper 초기화
    if (windowWidth <= 1024) {
      const slidesCount = windowWidth <= 768 ? 1 : 2;
      
      menuSwiper = new Swiper(".menu-box", {
        slidesPerView: slidesCount,
        slidesPerGroup: 1, // 중요: 한 번에 1개씩만 슬라이드
        spaceBetween: 0,
        loop: true,
        loopedSlides: 3, // 전체 슬라이드 개수
        navigation: {
          nextEl: ".menu-swiper-next",
          prevEl: ".menu-swiper-prev",
        },
        pagination: {
          el: ".menu-swiper-pagination",
          clickable: true,
        },
        speed: 600, // 슬라이드 전환 속도
      });
    }
  }

  // 초기 실행
  initSwiper();

  // 리사이즈 이벤트
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initSwiper();
    }, 250);
  });
});