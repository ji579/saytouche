// 전역 변수
let swiperInstances = [];
let currentCategory = 'all';
let allProducts = [];
let currentPage = 1;
let itemsPerPage = 12; // 페이지당 상품 수
let totalPages = 1;

// 카테고리 이름 매핑
const categoryNames = {
  'all': '전체상품',
  'edition': '커스텀제품',
  'textiles': '텍스타일',
  'home': '홈데코',
  'mirror': '거울',
  'lighting': '조명',
  'lifestyle': '라이프스타일',
  'goods': '굿즈',
  'sale': '세일'
};

// 카테고리별 배너 이미지 매핑
const categoryBanners = {
  'all': './images/all_banner.jpg',
  'edition': './images/edition_banner.jpg',
  'textiles': './images/textiles_banner.jpg',
  'home': './images/home_banner.jpg',
  'mirror': './images/mirror_banner.jpg',
  'lighting': './images/lighting_banner.jpg',
  'lifestyle': './images/lifestyle_banner.jpg',
  'goods': './images/goods_banner.jpg',
  'sale': './images/sale_banner.jpg'
};

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
  initProducts();
  initSortButtons();
  initPaginationButtons();
});

// 상품 초기화
async function initProducts() {
  const urlParams = new URLSearchParams(window.location.search);
  currentCategory = urlParams.get('category') || 'all';
  
  updateBannerImage(currentCategory);
  updateCategoryTitle(currentCategory);
  
  await loadProducts(currentCategory);
}

// 배너 이미지 업데이트
function updateBannerImage(category) {
  const bannerImg = document.querySelector('.banner-box img.bg');
  
  if (bannerImg && categoryBanners[category]) {
    bannerImg.src = categoryBanners[category];
    bannerImg.alt = `${categoryNames[category]} 배너`;
    console.log(`배너 이미지 변경: ${categoryBanners[category]}`);
  }
}

// 상품 데이터 로드
async function loadProducts(category) {
  try {
    if (category === 'all') {
      allProducts = await loadAllProducts();
    } else {
      const response = await fetch(`./data/${category}.json`);
      const data = await response.json();
      allProducts = data.products;
    }
    
    currentPage = 1;
    totalPages = Math.ceil(allProducts.length / itemsPerPage);
    
    renderCurrentPage();
    updateProductCount(allProducts.length);
    renderPagination();
    
  } catch (error) {
    console.error('상품 로드 실패:', error);
    document.getElementById('productsGrid').innerHTML = 
      '<div class="loading">상품을 불러올 수 없습니다.</div>';
  }
}

// 전체 카테고리 상품 로드
async function loadAllProducts() {
  const categories = ['edition', 'textiles', 'home', 'mirror', 'lighting', 'lifestyle', 'goods'];
  
  try {
    const promises = categories.map(cat => 
      fetch(`./data/${cat}.json`)
        .then(res => res.json())
        .catch(err => {
          console.warn(`${cat}.json 로드 실패:`, err);
          return { products: [] };
        })
    );
    
    const results = await Promise.all(promises);
    const allProducts = results.flatMap(data => data.products || []);
    
    return allProducts;
  } catch (error) {
    console.error('전체 상품 로드 실패:', error);
    return [];
  }
}

// ✅ 현재 페이지 상품만 렌더링
function renderCurrentPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = allProducts.slice(startIndex, endIndex);
  
  renderProducts(productsToShow);
  
  // 상단으로 부드럽게 스크롤
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 상품 렌더링
function renderProducts(products) {
  const productsGrid = document.getElementById('productsGrid');
  
  if (!productsGrid) {
    console.error('productsGrid not found');
    return;
  }
  
  destroySwipers();
  productsGrid.innerHTML = '';
  
  if (!products || products.length === 0) {
    productsGrid.innerHTML = '<div class="loading">해당 카테고리에 상품이 없습니다.</div>';
    return;
  }
  
  products.forEach((product, index) => {
    const card = createProductCard(product, index);
    productsGrid.appendChild(card);
  });
  
  setTimeout(() => {
    initSwipers();
  }, 100);
}

// 상품 카드 생성
function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-product-id', product.id);
  
  const imageSlides = product.images.map(imgFileName => {
    const imgPath = `./images/products/${imgFileName}`;
    return `
      <div class="swiper-slide">
        <img src="${imgPath}" alt="${product.name}" loading="lazy" />
      </div>
    `;
  }).join('');
  
  card.innerHTML = `
    <div class="product-image-wrapper">
      <div class="swiper product-swiper" data-index="${index}">
        <div class="swiper-wrapper">
          ${imageSlides}
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">${product.price}</div>
    </div>
  `;
  
  card.addEventListener('click', function(e) {
    if (
      e.target.closest('.swiper-button-prev') || 
      e.target.closest('.swiper-button-next') ||
      e.target.closest('.swiper-pagination')
    ) {
      return;
    }
    goToProductDetail(product.id);
  });
  
  return card;
}

// Swiper 초기화
function initSwipers() {
  const swiperElements = document.querySelectorAll('.product-swiper');
  
  swiperElements.forEach((swiperEl) => {
    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      loopAdditionalSlides: 1,
      autoplay: false,
      speed: 300,
      navigation: {
        nextEl: swiperEl.querySelector('.swiper-button-next'),
        prevEl: swiperEl.querySelector('.swiper-button-prev'),
      },
      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
      },
      allowTouchMove: true,
      watchSlidesProgress: true,
      observer: true,
      observeParents: true,
      centeredSlides: true,
      loopPreventsSliding: false,
    });
    
    swiperInstances.push(swiper);
  });
}

// Swiper 인스턴스 제거
function destroySwipers() {
  swiperInstances.forEach(swiper => {
    if (swiper && swiper.destroy) {
      swiper.destroy(true, true);
    }
  });
  swiperInstances = [];
}

// ✅ 페이지네이션 렌더링
function renderPagination() {
  const paginationWrapper = document.getElementById('paginationWrapper');
  const pageNumbers = document.getElementById('pageNumbers');
  
  // 상품이 없으면 페이징 숨기기
  if (allProducts.length === 0) {
    paginationWrapper.style.display = 'none';
    return;
  }
  
  // 페이징 보이기
  paginationWrapper.style.display = 'flex';
  
  // 페이지 번호 초기화
  pageNumbers.innerHTML = '';
  
  // 페이지 그룹 계산 (5개씩 묶음)
  const pageGroupSize = 5;
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  
  // 페이지 번호 생성
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'page-number';
    pageBtn.textContent = i;
    
    if (i === currentPage) {
      pageBtn.classList.add('active');
    }
    
    pageBtn.addEventListener('click', () => {
      goToPage(i);
    });
    
    pageNumbers.appendChild(pageBtn);
  }
  
  // 버튼 상태 업데이트
  updatePaginationButtons();
}

// ✅ 페이지네이션 버튼 초기화
function initPaginationButtons() {
  const firstPage = document.getElementById('firstPage');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const lastPage = document.getElementById('lastPage');
  
  // 맨 처음 (<<)
  firstPage.addEventListener('click', () => {
    goToPage(1);
  });
  
  // 이전 그룹 (<) - 5페이지씩 이동
  prevPage.addEventListener('click', () => {
    const prevGroupLastPage = Math.floor((currentPage - 1) / 5) * 5;
    goToPage(Math.max(1, prevGroupLastPage));
  });
  
  // 다음 그룹 (>) - 5페이지씩 이동
  nextPage.addEventListener('click', () => {
    const nextGroupFirstPage = Math.ceil(currentPage / 5) * 5 + 1;
    goToPage(Math.min(totalPages, nextGroupFirstPage));
  });
  
  // 맨 끝 (>>)
  lastPage.addEventListener('click', () => {
    goToPage(totalPages);
  });
}

// ✅ 페이지 이동
function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) {
    return;
  }
  
  currentPage = pageNumber;
  renderCurrentPage();
  renderPagination();
}

// ✅ 페이지네이션 버튼 상태 업데이트
function updatePaginationButtons() {
  const firstPage = document.getElementById('firstPage');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const lastPage = document.getElementById('lastPage');
  
  // 첫 페이지 그룹에 있으면 << < 비활성화
  const isFirstGroup = currentPage <= 5;
  firstPage.disabled = isFirstGroup;
  prevPage.disabled = isFirstGroup;
  
  // 마지막 페이지 그룹에 있으면 > >> 비활성화
  const lastGroupStart = Math.floor((totalPages - 1) / 5) * 5 + 1;
  const isLastGroup = currentPage >= lastGroupStart;
  nextPage.disabled = isLastGroup;
  lastPage.disabled = isLastGroup;
}

// 카테고리 제목 업데이트
function updateCategoryTitle(category) {
  const titleElement = document.getElementById('category-title-nav');
  if (titleElement && categoryNames[category]) {
    titleElement.textContent = categoryNames[category];
  }
}

// 상품 개수 업데이트
function updateProductCount(count) {
  const countElement = document.getElementById('product-count');
  if (countElement) {
    countElement.textContent = `${count} item${count !== 1 ? 's' : ''}`;
  }
}

// 정렬 버튼 초기화
function initSortButtons() {
  const sortLinks = document.querySelectorAll('.sort_link');
  
  sortLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      sortLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      const sortType = this.getAttribute('data-sort');
      sortProducts(sortType);
    });
  });
}

// 상품 정렬
function sortProducts(sortType) {
  let sortedProducts = [...allProducts];
  
  switch(sortType) {
    case 'new':
      sortedProducts.sort((a, b) => b.id - a.id);
      break;
    case 'low':
      sortedProducts.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
        return priceA - priceB;
      });
      break;
    case 'high':
      sortedProducts.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
        return priceB - priceA;
      });
      break;
    case 'popular':
      sortedProducts.sort((a, b) => a.id - b.id);
      break;
    default:
      break;
  }
  
  document.querySelectorAll('.sort_link').forEach(link => {
    link.style.borderBottom = 'none';
    link.style.fontWeight = 'normal';
  });
  
  const activeLink = document.querySelector(`[data-sort="${sortType}"]`);
  if (activeLink) {
    activeLink.style.borderBottom = '2px solid #000';
    activeLink.style.fontWeight = 'bold';
  }
  
  allProducts = sortedProducts;
  currentPage = 1;
  totalPages = Math.ceil(allProducts.length / itemsPerPage);
  
  renderCurrentPage();
  renderPagination();
}

// 상품 상세 페이지로 이동
function goToProductDetail(productId) {
  console.log(`상품 ${productId} 상세 페이지로 이동`);
}