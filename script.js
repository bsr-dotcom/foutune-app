// ---- 문구 데이터 ----
const GENERAL = [
  "오늘은 막혔던 일이 자연스럽게 풀리는 하루예요.",
  "작은 행운이 여러 번 찾아오는 날입니다.",
  "차분하게 움직이면 좋은 결과가 따라와요.",
  "예상치 못한 곳에서 반가운 소식이 들려올 수 있어요.",
  "오늘 내린 결정이 나중에 큰 도움이 될 거예요.",
  "주변 사람의 도움으로 일이 수월하게 풀려요.",
  "새로운 시작을 하기에 아주 좋은 기운이 감돌아요.",
  "무리하지 않고 페이스를 지키면 순조로운 하루가 됩니다.",
  "생각보다 여유로운 시간이 생길 수 있어요.",
  "평소보다 집중력이 좋아서 성과를 내기 좋아요.",
];

const LOVE = [
  "솔직한 마음을 표현하면 관계가 한 뼘 더 가까워져요.",
  "짝사랑 중이라면 자연스러운 대화 기회가 생길 수 있어요.",
  "연인과는 작은 배려가 큰 감동으로 이어지는 날이에요.",
  "혼자만의 시간을 즐기는 것도 좋은 선택이에요.",
  "오해가 있었다면 오늘 풀기 좋은 타이밍이에요.",
  "새로운 인연의 실마리가 보일 수 있어요.",
  "가까운 사람에게 먼저 연락해보세요, 좋은 반응이 있어요.",
  "감정 표현보다 행동으로 마음을 보여주는 게 효과적이에요.",
];

const MONEY = [
  "계획했던 지출은 괜찮지만 충동구매는 조심하세요.",
  "예상치 못한 작은 수입이 생길 수 있어요.",
  "돈 관리 앱이나 가계부를 점검하기 좋은 날이에요.",
  "투자보다는 저축에 신경 쓰는 게 유리해요.",
  "협상이나 흥정에서 좋은 결과를 얻을 수 있어요.",
  "지인과의 금전 거래는 신중하게 접근하세요.",
  "생각보다 지출이 늘 수 있으니 미리 예산을 정해두세요.",
  "재정 상태를 점검하면 뜻밖의 여유를 발견해요.",
];

const HEALTH = [
  "가벼운 스트레칭이 하루 컨디션을 크게 바꿔줘요.",
  "수분 섭취를 평소보다 신경 쓰면 좋아요.",
  "충분한 수면이 오늘의 컨디션을 좌우해요.",
  "눈과 목의 피로가 쌓이기 쉬우니 자주 쉬어주세요.",
  "가벼운 산책이 기분 전환에 큰 도움이 돼요.",
  "과식하지 않도록 식사량을 조절해보세요.",
  "몸이 보내는 신호를 무시하지 말고 쉬어가세요.",
  "컨디션이 좋아 활동적으로 지내기 좋은 날이에요.",
];

const ADVICE = [
  "서두르지 않아도 충분히 잘 하고 있어요.",
  "오늘 하루, 나 자신에게 작은 칭찬을 해주세요.",
  "완벽하지 않아도 괜찮아요, 시도한 것만으로 의미 있어요.",
  "가끔은 '아니오'라고 말하는 것도 용기예요.",
  "오늘의 작은 선택이 내일의 큰 변화를 만들어요.",
  "비교하지 말고 어제의 나보다 한 걸음만 나아가요.",
  "잠깐 멈춰서 숨을 고르는 것도 전진이에요.",
  "웃는 얼굴이 오늘의 행운을 불러와요.",
];

const COLORS = ["보라색", "하늘색", "노란색", "초록색", "분홍색", "주황색", "남색", "흰색", "빨간색", "민트색"];

const ZODIACS = [
  { name: "쥐띠", emoji: "🐭" }, { name: "소띠", emoji: "🐮" }, { name: "호랑이띠", emoji: "🐯" },
  { name: "토끼띠", emoji: "🐰" }, { name: "용띠", emoji: "🐲" }, { name: "뱀띠", emoji: "🐍" },
  { name: "말띠", emoji: "🐴" }, { name: "양띠", emoji: "🐑" }, { name: "원숭이띠", emoji: "🐵" },
  { name: "닭띠", emoji: "🐔" }, { name: "개띠", emoji: "🐶" }, { name: "돼지띠", emoji: "🐷" },
];

// ---- 유틸 함수 ----
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick(list, seedNumber) {
  return list[seedNumber % list.length];
}

function getZodiac(year) {
  // 1900년은 쥐띠 기준
  const idx = ((year - 1900) % 12 + 12) % 12;
  return ZODIACS[idx];
}

function formatTodayLabel() {
  const today = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${days[today.getDay()]})`;
}

function todayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// ---- 메인 로직 ----
const birthdateInput = document.getElementById("birthdate");
const showBtn = document.getElementById("showBtn");
const backBtn = document.getElementById("backBtn");
const formCard = document.getElementById("formCard");
const resultCard = document.getElementById("resultCard");

document.getElementById("todayLabel").textContent = formatTodayLabel();

const savedBirthdate = localStorage.getItem("fortune_birthdate");
if (savedBirthdate) {
  birthdateInput.value = savedBirthdate;
}

showBtn.addEventListener("click", () => {
  const value = birthdateInput.value;
  if (!value) {
    alert("생년월일을 먼저 입력해주세요!");
    return;
  }
  localStorage.setItem("fortune_birthdate", value);
  renderFortune(value);
});

backBtn.addEventListener("click", () => {
  resultCard.hidden = true;
  formCard.hidden = false;
});

function renderFortune(birthdateStr) {
  const seedBase = simpleHash(birthdateStr + "_" + todayKey());
  const year = parseInt(birthdateStr.split("-")[0], 10);
  const zodiac = getZodiac(year);

  document.getElementById("zodiacEmoji").textContent = zodiac.emoji;
  document.getElementById("zodiacName").textContent = zodiac.name;

  document.getElementById("fortuneGeneral").textContent = pick(GENERAL, seedBase + 1);
  document.getElementById("fortuneLove").textContent = pick(LOVE, seedBase + 7);
  document.getElementById("fortuneMoney").textContent = pick(MONEY, seedBase + 13);
  document.getElementById("fortuneHealth").textContent = pick(HEALTH, seedBase + 19);
  document.getElementById("luckyColor").textContent = pick(COLORS, seedBase + 23);
  document.getElementById("luckyNumber").textContent = (seedBase % 45) + 1;
  document.getElementById("advice").textContent = pick(ADVICE, seedBase + 29);

  formCard.hidden = true;
  resultCard.hidden = false;
}

// ---- PWA 서비스워커 등록 (선택 사항, 실패해도 앱 동작에는 문제 없음) ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
