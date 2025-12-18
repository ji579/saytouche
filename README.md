# Saytouche Website

패션 브랜드 Saytouche의 감성을 담은 웹사이트 프로젝트입니다.

[Live Demo](https://ji579.github.io/saytouche/index.html) | [GitHub](https://github.com/ji579/saytouche.git)

---

## 프로젝트 배경

Saytouche 공식 쇼핑몰을 참고해서 디자인부터 퍼블리싱까지 직접 진행했습니다.  
기존 사이트의 구조를 그대로 따라하기보다는, 브랜드가 가진 트렌디하고 감각적인 분위기를 웹에서 어떻게 표현할 수 있을지 고민하면서 만들었습니다.

메인 페이지와 여러 서브 페이지로 구성했고, 각 페이지의 목적에 맞춰 레이아웃을 다르게 설계했습니다.

---

## 구현 내용

**페이지 구성**
- 메인 / 제품 소개 / 브랜드 스토리 / 컬렉션 페이지
- 각 페이지마다 콘텐츠 성격에 맞는 레이아웃 적용
- 페이지 간 이동이 자연스럽도록 일관된 네비게이션 유지

**디자인 방향**
- 이미지를 전면에 배치해서 제품과 브랜드 무드를 강조
- 여백을 충분히 활용해 깔끔하고 세련된 느낌 표현
- 미니멀한 타이포그래피로 가독성 확보

**인터랙션**
- 스크롤하면 콘텐츠가 부드럽게 나타나는 페이드인 효과
- 제품 이미지 호버 시 확대 및 정보 표시
- 부드러운 페이지 전환 애니메이션

---

## 기술 스택

**HTML5**  
각 페이지를 시맨틱 태그로 구조화했습니다. `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` 등으로 역할을 명확하게 구분했고, 나중에 유지보수할 때 어떤 부분이 어떤 역할인지 바로 알 수 있도록 작성했습니다.

**CSS3**  
Flexbox와 Grid를 상황에 맞게 사용했습니다. 이미지 배치는 Grid로, 네비게이션이나 카드 정렬은 Flexbox로 처리했습니다. 반복되는 스타일은 공통 클래스로 만들어서 코드 중복을 줄였습니다.

**JavaScript (ES6)**  
스크롤 기반 애니메이션과 이미지 슬라이더를 직접 구현했습니다. Intersection Observer API를 사용해서 요소가 화면에 들어올 때 애니메이션이 실행되도록 했습니다.

---

## 주요 구현 사항

### 1. 스크롤 페이드인 효과
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.scroll-animate').forEach(el => {
  observer.observe(el);
});
```
```css
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.scroll-animate.fade-in {
  opacity: 1;
  transform: translateY(0);
}
```
페이지를 스크롤하면 콘텐츠가 아래에서 위로 올라오면서 나타납니다. Intersection Observer로 요소가 뷰포트에 들어오는 시점을 감지했습니다.

### 2. 이미지 중심 레이아웃
```css
.hero-section {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
```
메인 비주얼은 전체 화면을 채우도록 했고, 제품 그리드는 화면 크기에 따라 자동으로 열 개수가 조정됩니다.

### 3. 공통 컴포넌트 관리
```css
/* 버튼 공통 스타일 */
.btn {
  padding: 14px 32px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  border: 1px solid #000;
}
```
버튼, 카드, 섹션 타이틀 같은 반복되는 UI 요소를 클래스로 정리했습니다. 디자인을 수정할 때 한 곳만 바꾸면 되도록 구조를 짰습니다.

### 4. 반응형 타이포그래피
```css
:root {
  --font-xl: clamp(2.5rem, 5vw, 4rem);
  --font-lg: clamp(1.5rem, 3vw, 2.5rem);
  --font-md: clamp(1rem, 2vw, 1.25rem);
}

h1 { font-size: var(--font-xl); }
h2 { font-size: var(--font-lg); }
p { font-size: var(--font-md); }
```
`clamp()` 함수로 화면 크기에 따라 폰트 크기가 자동으로 조정되도록 했습니다. 미디어 쿼리 없이도 자연스럽게 반응합니다.

---

## 디자인 포인트

**색상 시스템**
```css
:root {
  --primary: #000000;
  --secondary: #ffffff;
  --accent: #f5f5f5;
  --text-dark: #1a1a1a;
  --text-light: #666666;
}
```
모노톤 베이스에 포인트 컬러를 최소한으로 사용해서 세련된 느낌을 냈습니다.

**여백 관리**
섹션 간 여백을 넉넉하게 줘서 답답하지 않도록 했습니다. 패션 브랜드 특성상 여백이 곧 고급스러움을 만든다고 생각했습니다.

**타이포그래피**
헤드라인은 크고 굵게, 본문은 가독성 있게 설정했습니다. 폰트 크기와 행간을 세심하게 조절했습니다.

---

## 배운 점

**브랜드 아이덴티티 표현**  
패션 브랜드의 감성을 웹에서 어떻게 전달할지 고민했습니다. 이미지 선택부터 레이아웃, 애니메이션 속도까지 모든 요소가 브랜드 무드를 만든다는 걸 느꼈습니다.

**페이지 간 일관성 유지**  
여러 페이지를 만들면서 전체적인 통일감을 유지하는 게 중요하다는 걸 알게 됐습니다. CSS 변수와 공통 클래스를 적극 활용했습니다.

**성능 최적화**  
이미지가 많은 사이트라서 최적화에 신경 썼습니다. 이미지 포맷을 WebP로 변환하고, lazy loading을 적용했습니다.

---

## 개선하고 싶은 부분

- 실제 쇼핑몰처럼 장바구니나 결제 기능까지 구현해보고 싶습니다
- 더 다양한 인터랙션 효과를 추가하고 싶습니다
- 관리자 페이지를 만들어서 콘텐츠를 동적으로 관리할 수 있게 하고 싶습니다

---

## 프로젝트 구조

```
saytouche/
├── index.html           # 메인 페이지
├── products.html        # 제품 목록
├── brand.html           # 브랜드 스토리
├── collection.html      # 컬렉션
├── css/
│   ├── reset.css
│   ├── common.css
│   └── pages.css
├── js/
│   ├── main.js
│   └── scroll-animation.js
└── images/
```

---

## 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.  
Saytouche 브랜드의 저작권은 해당 회사에 있습니다.