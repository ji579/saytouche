// shop.html의 카테고리 메뉴 연동 스크립트
// 이 파일을 shop.html에서 불러오세요

document.addEventListener('DOMContentLoaded', function() {
  initCategoryMenu();
});

// 카테고리 메뉴 클릭 이벤트 설정
function initCategoryMenu() {
  const menuItems = document.querySelectorAll('.submenu li[data-category]');
  
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const category = this.getAttribute('data-category');
      
      // products.html로 이동하면서 카테고리 파라미터 전달
      if (category === 'all') {
        window.location.href = 'products.html';
      } else {
        window.location.href = `products.html?category=${category}`;
      }
    });
  });
}

// MD 키워드 메뉴 (선택사항 - 필요시 사용)
function initMDMenu() {
  const mdItems = document.querySelectorAll('.md li');
  
  mdItems.forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      let keyword = '';
      
      switch(index) {
        case 0: keyword = 'mdpick'; break;
        case 1: keyword = 'gift'; break;
        case 2: keyword = 'black'; break;
        case 3: keyword = 'deskterior'; break;
      }
      
      if (keyword) {
        window.location.href = `products.html?keyword=${keyword}`;
      }
    });
  });
}

// MD 메뉴도 활성화하려면 주석 해제
// initMDMenu();