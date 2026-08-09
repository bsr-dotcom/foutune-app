// ================== 사주(四柱) 계산 ==================
const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const STEMS_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const STEM_ELEMENT = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];

const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const BRANCHES_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const BRANCH_ELEMENT = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];

const ELEMENT_COLOR = { 목: "#5fbf7a", 화: "#ff7a5c", 토: "#d9a441", 금: "#c9c9d9", 수: "#5b9bd9" };
const ELEMENT_ORDER = ["목", "화", "토", "금", "수"];

const ELEMENT_GENERATES = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
const ELEMENT_OVERCOMES = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" };

// 일간(dme) 오행 기준으로 상대 오행(other)과의 관계를 단순화한 십성 그룹으로 분류
function elementRelation(dme, other) {
  if (dme === other) return "비화";
  if (ELEMENT_GENERATES[dme] === other) return "식상";
  if (ELEMENT_GENERATES[other] === dme) return "인성";
  if (ELEMENT_OVERCOMES[dme] === other) return "재성";
  return "관성";
}

const RELATION_LABEL = { 비화: "동행", 식상: "표현", 재성: "결실", 관성: "긴장", 인성: "지원" };

// 오늘의 운세로 뽑은 MBTI(재미용): 오늘의 일진 관계(E/I), 오행 분포(S/N), 일간 음양(T/F), 대운 방향(J/P)
const MBTI_DESC = {
  INTJ: "치밀한 전략가의 기운이에요. 오늘은 큰 그림을 그리며 차분히 계획을 세우기 좋아요.",
  INTP: "호기심 가득한 사색가의 기운이에요. 오늘은 새로운 아이디어를 파고들기 좋아요.",
  ENTJ: "추진력 있는 지휘관의 기운이에요. 오늘은 목표를 향해 거침없이 나아가기 좋아요.",
  ENTP: "재기발랄한 발명가의 기운이에요. 오늘은 새로운 시도와 토론을 즐기기 좋아요.",
  INFJ: "통찰력 있는 조언가의 기운이에요. 오늘은 깊이 있는 대화가 잘 통해요.",
  INFP: "따뜻한 몽상가의 기운이에요. 오늘은 감성적인 영감이 잘 떠올라요.",
  ENFJ: "다정한 주인공의 기운이에요. 오늘은 주변 사람을 이끌고 챙기기 좋아요.",
  ENFP: "활기찬 활동가의 기운이에요. 오늘은 새로운 인연과 경험에 열려있기 좋아요.",
  ISTJ: "성실한 관리자의 기운이에요. 오늘은 꼼꼼하게 마무리 짓기 좋아요.",
  ISFJ: "헌신적인 수호자의 기운이에요. 오늘은 주변을 세심하게 챙기기 좋아요.",
  ESTJ: "체계적인 경영자의 기운이에요. 오늘은 효율적으로 일을 처리하기 좋아요.",
  ESFJ: "사교적인 집정관의 기운이에요. 오늘은 사람들과 어울리며 힘을 얻어요.",
  ISTP: "차분한 장인의 기운이에요. 오늘은 손으로 뭔가를 만들거나 문제를 해결하기 좋아요.",
  ISFP: "온화한 예술가의 기운이에요. 오늘은 감각적인 것에 끌리기 좋아요.",
  ESTP: "즉흥적인 사업가의 기운이에요. 오늘은 몸을 움직이며 기회를 잡기 좋아요.",
  ESFP: "유쾌한 연예인의 기운이에요. 오늘은 즐겁게 분위기를 띄우기 좋아요.",
};

function deriveTodayMBTI(dayMasterElement, relation, elementCounts, dayStemIndex, daeunDirection) {
  let ei;
  if (relation === "식상" || relation === "재성") ei = "E";
  else if (relation === "관성" || relation === "인성") ei = "I";
  else ei = (dayMasterElement === "화" || dayMasterElement === "목") ? "E" : "I";

  const practical = elementCounts.토 + elementCounts.금;
  const imaginative = elementCounts.목 + elementCounts.화;
  let sn;
  if (practical > imaginative) sn = "S";
  else if (imaginative > practical) sn = "N";
  else sn = elementCounts.수 > 0 ? "N" : "S";

  const tf = dayStemIndex % 2 === 0 ? "T" : "F";
  const jp = daeunDirection === "순행" ? "J" : "P";

  return ei + sn + tf + jp;
}

function renderMBTI(dayMasterElement, relation, elementCounts, dayStemIndex, daeunDirection) {
  const code = deriveTodayMBTI(dayMasterElement, relation, elementCounts, dayStemIndex, daeunDirection);
  document.getElementById("mbtiCode").textContent = code;
  document.getElementById("mbtiText").textContent = MBTI_DESC[code];
}

function toJulianDayNumber(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

// 일주(日柱): 기준식 (JDN + 49) % 60 => 60갑자 인덱스
function getDayGanzhiIndex(y, m, d) {
  const jdn = toJulianDayNumber(y, m, d);
  return ((jdn + 49) % 60 + 60) % 60;
}

// 입춘(2/4) 기준 절입년도 계산: 그 해 2/4 이전 생일이면 전년도로 취급
function getSajuYear(y, m, d) {
  if (m < 2 || (m === 2 && d < 4)) return y - 1;
  return y;
}

// 년주: 1984년 = 갑자년(인덱스0) 기준
function getYearGanzhiIndex(sajuYear) {
  return ((sajuYear - 1984) % 60 + 60) % 60;
}

// 월지 결정: 절기 경계값을 기준으로 어느 지지월에 속하는지 찾기
// 자월(대설, 12/7~) ~ 축월(소한, 1/6~2/3)은 연말/연초를 걸치므로 별도 처리
function getMonthBranchIndex(m, d) {
  const dateVal = m * 100 + d; // 예: 3월6일 -> 306, 비교용 정수
  if (dateVal >= 204 && dateVal < 306) return 2;   // 인월 2/4~3/5
  if (dateVal >= 306 && dateVal < 405) return 3;   // 묘월 3/6~4/4
  if (dateVal >= 405 && dateVal < 506) return 4;   // 진월 4/5~5/5
  if (dateVal >= 506 && dateVal < 606) return 5;   // 사월 5/6~6/5
  if (dateVal >= 606 && dateVal < 707) return 6;   // 오월 6/6~7/6
  if (dateVal >= 707 && dateVal < 808) return 7;   // 미월 7/7~8/7
  if (dateVal >= 808 && dateVal < 908) return 8;   // 신월 8/8~9/7
  if (dateVal >= 908 && dateVal < 1008) return 9;  // 유월 9/8~10/7
  if (dateVal >= 1008 && dateVal < 1107) return 10; // 술월 10/8~11/6
  if (dateVal >= 1107 && dateVal < 1207) return 11; // 해월 11/7~12/6
  if (dateVal >= 1207 || dateVal < 106) return 0;   // 자월 12/7~1/5 (연말/연초)
  return 1; // 축월 1/6~2/3
}

// 월간: 년간에 따른 인월(寅月) 기준 천간(오호둔법)
function getMonthStemIndex(yearStemIndex, monthBranchIndex) {
  const baseForYin = (2 * (yearStemIndex % 5) + 2) % 10; // 인월(2)의 천간
  const order = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]; // 인묘진사오미신유술해자축
  const k = order.indexOf(monthBranchIndex);
  return (baseForYin + k) % 10;
}

// 시지: 30분 단위까지 고려한 2시간 단위 구간 (23:00~00:59 = 자시)
function getHourBranchIndex(hour) {
  return Math.floor(((hour + 1) % 24) / 2);
}

// 시간: 일간에 따른 자시(子時) 기준 천간(오서둔법)
function getHourStemIndex(dayStemIndex, hourBranchIndex) {
  const baseForZi = (2 * (dayStemIndex % 5)) % 10;
  return (baseForZi + hourBranchIndex) % 10;
}

function calcSaju(birthdateStr, timeStr, timeUnknown) {
  const [y, m, d] = birthdateStr.split("-").map(Number);

  const sajuYear = getSajuYear(y, m, d);
  const yearIdx = getYearGanzhiIndex(sajuYear);
  const yearStem = yearIdx % 10;
  const yearBranch = yearIdx % 12;

  const monthBranch = getMonthBranchIndex(m, d);
  const monthStem = getMonthStemIndex(yearStem, monthBranch);

  const dayIdx = getDayGanzhiIndex(y, m, d);
  const dayStem = dayIdx % 10;
  const dayBranch = dayIdx % 12;

  let hourStem = null, hourBranch = null;
  if (!timeUnknown && timeStr) {
    let hour = parseInt(timeStr.split(":")[0], 10);
    let dStem = dayStem;
    if (hour === 23) {
      // 23시는 다음날 자시로 취급 -> 일주는 다음날 기준
      const nextDayIdx = ((toJulianDayNumber(y, m, d) + 1 + 49) % 60 + 60) % 60;
      dStem = nextDayIdx % 10;
    }
    hourBranch = getHourBranchIndex(hour);
    hourStem = getHourStemIndex(dStem, hourBranch);
  }

  return {
    year: { stem: yearStem, branch: yearBranch },
    month: { stem: monthStem, branch: monthBranch },
    day: { stem: dayStem, branch: dayBranch },
    hour: hourStem === null ? null : { stem: hourStem, branch: hourBranch },
  };
}

function pillarText(pillar) {
  if (!pillar) return { hanja: "-", hangul: "모름" };
  return {
    hanja: STEMS_HANJA[pillar.stem] + BRANCHES_HANJA[pillar.branch],
    hangul: STEMS[pillar.stem] + BRANCHES[pillar.branch],
  };
}

const DAY_MASTER_TEXT = [
  "큰 나무(甲)처럼 곧고 리더십이 있어요. 정직하고 성장 지향적인 성향이에요.",
  "화초(乙)처럼 유연하고 적응력이 좋아요. 부드럽지만 은근히 강단이 있어요.",
  "태양(丙)처럼 밝고 열정적이에요. 존재감이 뚜렷한 리더 기질이 있어요.",
  "촛불(丁)처럼 섬세하고 따뜻해요. 은은하지만 꾸준한 영향력을 가져요.",
  "큰 산(戊)처럼 묵직하고 신뢰감이 있어요. 안정적이고 포용력이 커요.",
  "기름진 땅(己)처럼 부드럽고 포용력이 있어요. 실용적이고 헌신적이에요.",
  "무쇠(庚)처럼 강직하고 결단력이 있어요. 원칙을 중시하는 타입이에요.",
  "보석(辛)처럼 섬세하고 예리해요. 완벽을 추구하는 성향이 있어요.",
  "큰 바다(壬)처럼 지혜롭고 스케일이 커요. 포용력 있고 유연한 사고를 해요.",
  "이슬비(癸)처럼 섬세하고 직관이 발달했어요. 조용히 스며드는 영향력이 있어요.",
];

// 대운 방향: 양간(짝수 인덱스)+남성 또는 음간(홀수)+여성 -> 순행, 그 반대는 역행
function getDaeunDirection(yearStemIndex, gender) {
  const isYang = yearStemIndex % 2 === 0;
  const forward = (isYang && gender === "남성") || (!isYang && gender === "여성");
  return forward ? "순행" : "역행";
}

// ================== 오늘의 운세 문구 데이터 ==================
// 일간(나) 오행과 오늘의 일간 오행 사이의 관계(비화/식상/재성/관성/인성)에 따른 핵심 문장
const RELATION_MAIN = {
  총운: {
    비화: "오늘은 나와 비슷한 기운이 흘러서 평소의 페이스를 유지하기 좋은 날이에요.",
    식상: "생각과 아이디어가 자연스럽게 밖으로 표현되는 기운이 강한 날이에요.",
    재성: "노력한 만큼 눈에 보이는 결실로 이어지기 쉬운 날이에요.",
    관성: "책임과 부담이 조금 늘어날 수 있는 날이니 무리한 확장은 피하는 게 좋아요.",
    인성: "주변의 도움과 배움의 기회가 많이 따라오는 날이에요.",
  },
  애정운: {
    비화: "비슷한 성향의 사람과 편안하게 마음이 통하는 날이에요.",
    식상: "감정 표현이 자연스러워져서 마음을 전하기 좋은 날이에요.",
    재성: "상대에게 정성을 쏟으면 관계가 결실을 맺기 쉬운 날이에요.",
    관성: "관계에서 오는 부담감이나 긴장감을 느낄 수 있어 여유를 갖는 게 좋아요.",
    인성: "누군가의 따뜻한 배려나 위로를 받기 좋은 날이에요.",
  },
  금전운: {
    비화: "안정적인 흐름 속에서 지출과 수입의 균형을 잡기 좋은 날이에요.",
    식상: "아이디어나 재능을 활용한 수입 기회가 보일 수 있는 날이에요.",
    재성: "실질적인 재물 성과를 기대할 수 있는 날이에요.",
    관성: "예상치 못한 지출이나 부담이 생길 수 있어 지출 계획을 점검하세요.",
    인성: "재정 관리에 도움이 되는 정보나 조언을 얻기 좋은 날이에요.",
  },
  건강운: {
    비화: "몸과 마음의 균형이 잘 맞아 컨디션을 유지하기 좋은 날이에요.",
    식상: "활동적으로 움직이면 에너지가 잘 발산되는 날이에요.",
    재성: "몸을 부지런히 움직인 만큼 성취감을 느낄 수 있는 날이에요.",
    관성: "피로나 스트레스가 쌓이기 쉬우니 충분한 휴식이 필요해요.",
    인성: "휴식과 재충전에 특히 좋은 기운이 흐르는 날이에요.",
  },
};

// 관계별 핵심 문장 뒤에 붙는 보충 설명 (다양성을 위해 오늘 날짜로 랜덤 선택)
const GENERAL_DETAIL = [
  "작은 행운이 여러 번 찾아올 수 있어요.",
  "예상치 못한 곳에서 반가운 소식이 들려올 수 있어요.",
  "오늘 내린 결정이 나중에 큰 도움이 될 거예요.",
  "주변 사람의 도움으로 일이 수월하게 풀려요.",
  "새로운 시작을 하기에 나쁘지 않은 흐름이에요.",
  "생각보다 여유로운 시간이 생길 수 있어요.",
  "평소보다 집중력이 좋아서 성과를 내기 좋아요.",
  "차분하게 움직이면 좋은 결과가 따라와요.",
];

const LOVE_DETAIL = [
  "짝사랑 중이라면 자연스러운 대화 기회가 생길 수 있어요.",
  "연인과는 작은 배려가 큰 감동으로 이어지는 날이에요.",
  "혼자만의 시간을 즐기는 것도 좋은 선택이에요.",
  "오해가 있었다면 오늘 풀기 좋은 타이밍이에요.",
  "새로운 인연의 실마리가 보일 수 있어요.",
  "가까운 사람에게 먼저 연락해보세요, 좋은 반응이 있어요.",
  "감정 표현보다 행동으로 마음을 보여주는 게 효과적이에요.",
];

const MONEY_DETAIL = [
  "계획했던 지출은 괜찮지만 충동구매는 조심하세요.",
  "돈 관리 앱이나 가계부를 점검하기 좋은 날이에요.",
  "투자보다는 저축에 신경 쓰는 게 유리해요.",
  "협상이나 흥정에서 좋은 결과를 얻을 수 있어요.",
  "지인과의 금전 거래는 신중하게 접근하세요.",
  "생각보다 지출이 늘 수 있으니 미리 예산을 정해두세요.",
  "재정 상태를 점검하면 뜻밖의 여유를 발견해요.",
];

const HEALTH_DETAIL = [
  "가벼운 스트레칭이 하루 컨디션을 크게 바꿔줘요.",
  "수분 섭취를 평소보다 신경 쓰면 좋아요.",
  "충분한 수면이 오늘의 컨디션을 좌우해요.",
  "눈과 목의 피로가 쌓이기 쉬우니 자주 쉬어주세요.",
  "가벼운 산책이 기분 전환에 큰 도움이 돼요.",
  "과식하지 않도록 식사량을 조절해보세요.",
  "몸이 보내는 신호를 무시하지 말고 쉬어가세요.",
];

// 월별 운세: 그 달의 지지 오행과 일간의 관계(RELATION_LABEL)에 따른 문장 풀
const MONTHLY_TEXT = {
  비화: [
    "이 달은 나와 비슷한 기운이 흘러 안정적으로 자기 페이스를 지키기 좋아요.",
    "협업과 동료 관계에서 힘을 얻기 좋은 달이에요.",
    "무리한 변화보다 꾸준함이 통하는 시기예요.",
  ],
  식상: [
    "생각과 아이디어가 자연스럽게 표현되는 달이에요.",
    "창작, 발표, 소통과 관련된 일에 유리해요.",
    "새로운 시도를 해보기 좋은 활동적인 흐름이에요.",
  ],
  재성: [
    "노력한 만큼 결과로 이어지기 쉬운 달이에요.",
    "재물이나 성과 면에서 실속을 챙기기 좋아요.",
    "계획했던 일을 마무리 짓기 좋은 시기예요.",
  ],
  관성: [
    "책임과 부담이 늘어날 수 있는 달이에요.",
    "무리한 확장보다 내실을 다지는 게 좋아요.",
    "중요한 결정은 신중하게 접근하세요.",
  ],
  인성: [
    "주변의 도움과 배움의 기회가 많은 달이에요.",
    "휴식과 재충전에도 좋은 시기예요.",
    "공부나 자기계발에 집중하기 좋은 흐름이에요.",
  ],
};

// 일간(나의 타고난) 오행에 따른 오늘의 추천 - 매일 조금씩 바뀌도록 여러 항목 중 하나를 선택
// id는 해당 곡의 공식/대표 유튜브 영상 ID (1분 미리듣기 재생용)
const SONG_BY_ELEMENT = {
  목: [
    { title: "이름에게", artist: "아이유", id: "8zsYZFvKniw" },
    { title: "주저하는 연인들을 위해", artist: "잔나비", id: "GpQ222I1ULc" },
    { title: "여행", artist: "볼빨간사춘기", id: "xRbPAVnqtcs" },
  ],
  화: [
    { title: "Dynamite", artist: "방탄소년단", id: "gdZLi9oWNZg" },
    { title: "HIP", artist: "마마무", id: "KhTeiaCezwM" },
    { title: "Uptown Funk", artist: "Bruno Mars", id: "OPf0YbXqDm0" },
  ],
  토: [
    { title: "모든 날, 모든 순간", artist: "폴킴", id: "nq0BYGyH2Do" },
    { title: "헤픈 우연", artist: "헤이즈", id: "AJPLgrfBiBo" },
    { title: "눈사람", artist: "정승환", id: "gPNu9OIj4Zo" },
  ],
  금: [
    { title: "Blueming", artist: "아이유", id: "D1PvIWdJ8xo" },
    { title: "Come Away With Me", artist: "Norah Jones", id: "lbjZPFBD6JU" },
    { title: "re:member", artist: "Ólafur Arnalds", id: "oAhO5eegMfY" },
  ],
  수: [
    { title: "밤편지", artist: "아이유", id: "BzYnNdJhZQw" },
    { title: "Kiss the Rain", artist: "이루마", id: "imGaOIm5HOk" },
    { title: "안녕", artist: "폴킴", id: "_niSIiVMEos" },
  ],
};

const BOOK_BY_ELEMENT = {
  목: [
    { title: "연금술사", author: "파울로 코엘료" },
    { title: "아몬드", author: "손원평" },
    { title: "미움받을 용기", author: "기시미 이치로" },
  ],
  화: [
    { title: "달러구트 꿈 백화점", author: "이미예" },
    { title: "불편한 편의점", author: "김호연" },
    { title: "데일 카네기 인간관계론", author: "데일 카네기" },
  ],
  토: [
    { title: "여행의 이유", author: "김영하" },
    { title: "보통의 존재", author: "이석원" },
    { title: "살아있는 것은 다 행복하라", author: "법정" },
  ],
  금: [
    { title: "사피엔스", author: "유발 하라리" },
    { title: "팩트풀니스", author: "한스 로슬링" },
    { title: "생각에 관한 생각", author: "대니얼 카너먼" },
  ],
  수: [
    { title: "데미안", author: "헤르만 헤세" },
    { title: "어린 왕자", author: "생텍쥐페리" },
    { title: "나미야 잡화점의 기적", author: "히가시노 게이고" },
  ],
};

const HOBBY_BY_ELEMENT = {
  목: ["화분 가꾸기", "가벼운 산책이나 등산", "새로운 것 배우기", "식물원·수목원 나들이"],
  화: ["댄스나 운동", "친구들과의 모임", "공연·콘서트 관람", "액티비티 스포츠"],
  토: ["요리나 베이킹", "집 정리·인테리어 꾸미기", "반신욕이나 명상", "가까운 사람과의 여유로운 티타임"],
  금: ["손으로 만드는 공예", "정리정돈", "사진 촬영", "악기 연습"],
  수: ["일기 쓰기", "혼자만의 독서 시간", "물멍(수족관·바다 감상)", "명상이나 요가"],
};

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

// ================== 화면 로직 ==================
const birthdateInput = document.getElementById("birthdate");
const birthtimeInput = document.getElementById("birthtime");
const timeUnknownCheckbox = document.getElementById("timeUnknown");
const showBtn = document.getElementById("showBtn");
const backBtn = document.getElementById("backBtn");
const formCard = document.getElementById("formCard");
const resultCard = document.getElementById("resultCard");

document.getElementById("todayLabel").textContent = formatTodayLabel();

const saved = JSON.parse(localStorage.getItem("fortune_profile") || "null");
if (saved) {
  birthdateInput.value = saved.birthdate || "";
  birthtimeInput.value = saved.birthtime || "";
  timeUnknownCheckbox.checked = !!saved.timeUnknown;
  if (saved.gender) {
    const radio = document.querySelector(`input[name="gender"][value="${saved.gender}"]`);
    if (radio) radio.checked = true;
  }
}

timeUnknownCheckbox.addEventListener("change", () => {
  birthtimeInput.disabled = timeUnknownCheckbox.checked;
});
birthtimeInput.disabled = timeUnknownCheckbox.checked;

showBtn.addEventListener("click", () => {
  const birthdate = birthdateInput.value;
  if (!birthdate) {
    alert("생년월일을 먼저 입력해주세요!");
    return;
  }
  const timeUnknown = timeUnknownCheckbox.checked;
  const birthtime = timeUnknown ? "" : birthtimeInput.value;
  const gender = document.querySelector('input[name="gender"]:checked').value;

  localStorage.setItem("fortune_profile", JSON.stringify({ birthdate, birthtime, timeUnknown, gender }));
  renderAll(birthdate, birthtime, timeUnknown, gender);
});

// ---- 음악/책 추천 & 1회 재추천 ----
const recState = { element: null, songIndex: -1, bookIndex: -1, songId: null };

let musicPreviewTimer = null;

function stopMusicPreview() {
  if (musicPreviewTimer) {
    clearTimeout(musicPreviewTimer);
    musicPreviewTimer = null;
  }
  document.getElementById("recMusicIframe").src = "";
  document.getElementById("recMusicPlayer").hidden = true;
  document.getElementById("recMusicPlay").textContent = "▶ 1분 미리듣기";
}

function renderSong(element, index) {
  const song = SONG_BY_ELEMENT[element][index];
  recState.songId = song.id;
  document.getElementById("recMusic").textContent = `${song.title} - ${song.artist}`;
  document.getElementById("recMusicLink").href =
    `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + " " + song.title)}`;
  stopMusicPreview();
}

document.getElementById("recMusicPlay").addEventListener("click", () => {
  const player = document.getElementById("recMusicPlayer");
  const iframe = document.getElementById("recMusicIframe");
  const btn = document.getElementById("recMusicPlay");

  if (!player.hidden) {
    stopMusicPreview();
    return;
  }
  iframe.src = `https://www.youtube-nocookie.com/embed/${recState.songId}?autoplay=1&start=0`;
  player.hidden = false;
  btn.textContent = "⏸ 정지 (1분 후 자동정지)";
  musicPreviewTimer = setTimeout(stopMusicPreview, 60000);
});

function renderBook(element, index) {
  const book = BOOK_BY_ELEMENT[element][index];
  document.getElementById("recBook").textContent = `《${book.title}》 - ${book.author}`;
  document.getElementById("recBookLink").href =
    `https://www.google.com/search?q=${encodeURIComponent(book.title + " " + book.author)}`;
}

// 이미 나온 index를 피해서 다른 항목의 index를 고른다
function pickIndexExcluding(length, excludeIndex) {
  if (length <= 1) return excludeIndex;
  let idx;
  do {
    idx = Math.floor(Math.random() * length);
  } while (idx === excludeIndex);
  return idx;
}

document.getElementById("recMusicRetry").addEventListener("click", () => {
  const btn = document.getElementById("recMusicRetry");
  if (btn.disabled) return;
  recState.songIndex = pickIndexExcluding(SONG_BY_ELEMENT[recState.element].length, recState.songIndex);
  renderSong(recState.element, recState.songIndex);
  btn.disabled = true;
  btn.textContent = "재추천 완료";
});

document.getElementById("recBookRetry").addEventListener("click", () => {
  const btn = document.getElementById("recBookRetry");
  if (btn.disabled) return;
  recState.bookIndex = pickIndexExcluding(BOOK_BY_ELEMENT[recState.element].length, recState.bookIndex);
  renderBook(recState.element, recState.bookIndex);
  btn.disabled = true;
  btn.textContent = "재추천 완료";
});

backBtn.addEventListener("click", () => {
  stopMusicPreview();
  resultCard.hidden = true;
  formCard.hidden = false;
});

function renderSaju(saju, gender) {
  const grid = document.getElementById("sajuGrid");
  const pillars = [
    { label: "년주", data: saju.year },
    { label: "월주", data: saju.month },
    { label: "일주", data: saju.day },
    { label: "시주", data: saju.hour },
  ];
  grid.innerHTML = pillars.map((p) => {
    const t = pillarText(p.data);
    return `<div class="saju__pillar">
      <span class="saju__pillar-label">${p.label}</span>
      <div class="saju__pillar-hanja">${t.hanja}</div>
      <span class="saju__pillar-hangul">${t.hangul}</span>
    </div>`;
  }).join("");

  document.getElementById("sajuTimeNote").textContent = saju.hour
    ? "※ 간단 계산식 기반 참고용 사주이며, 절기 경계일 근처는 실제와 다를 수 있어요."
    : "※ 태어난 시간이 없어 시주는 계산하지 않았어요. (참고용 계산이며 절기 경계일 근처는 실제와 다를 수 있어요)";

  document.getElementById("dayMasterText").textContent = DAY_MASTER_TEXT[saju.day.stem];

  // 오행 분포 계산
  const counts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const parts = [saju.year, saju.month, saju.day, saju.hour].filter(Boolean);
  parts.forEach((p) => {
    counts[STEM_ELEMENT[p.stem]]++;
    counts[BRANCH_ELEMENT[p.branch]]++;
  });
  const total = parts.length * 2;

  const bar = document.getElementById("elementsBar");
  bar.innerHTML = ELEMENT_ORDER.map((el) => {
    const pct = total ? (counts[el] / total) * 100 : 0;
    if (pct === 0) return "";
    return `<div style="width:${pct}%; background:${ELEMENT_COLOR[el]}"></div>`;
  }).join("");

  const legend = document.getElementById("elementsLegend");
  legend.innerHTML = ELEMENT_ORDER.map((el) =>
    `<span><span class="dot" style="background:${ELEMENT_COLOR[el]}"></span>${el} ${counts[el]}개</span>`
  ).join("");

  const direction = getDaeunDirection(saju.year.stem, gender);
  const directionDetail = direction === "순행"
    ? "순행은 시간이 흐르는 방향과 같은 흐름이라, 비교적 완만하고 예측 가능한 변화 곡선을 그리는 경향이 있어요."
    : "역행은 시간의 흐름과 반대 방향으로 대운이 진행돼서, 예상 밖의 전환점이 상대적으로 자주 찾아올 수 있어요.";
  document.getElementById("daeunText").textContent =
    `${gender} · ${STEMS[saju.year.stem]}(${STEM_ELEMENT[saju.year.stem]}) 년간 기준으로 대운은 ${direction}합니다. ${directionDetail} 실제 대운이 시작되는 나이는 절기 시각까지 정밀하게 계산해야 나오기 때문에, 이 앱에서는 방향만 참고용으로 안내해요.`;

  return { elementCounts: counts, daeunDirection: direction };
}

function renderAll(birthdateStr, timeStr, timeUnknown, gender) {
  const saju = calcSaju(birthdateStr, timeStr, timeUnknown);
  const { elementCounts, daeunDirection } = renderSaju(saju, gender);

  const dayMasterElement = STEM_ELEMENT[saju.day.stem];
  const today = new Date();
  const todayDayIdx = getDayGanzhiIndex(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayElement = STEM_ELEMENT[todayDayIdx % 10];
  const relation = elementRelation(dayMasterElement, todayElement);

  renderMBTI(dayMasterElement, relation, elementCounts, saju.day.stem, daeunDirection);

  const seedBase = simpleHash(birthdateStr + "_" + gender + "_" + todayKey());
  const year = parseInt(birthdateStr.split("-")[0], 10);
  const zodiac = getZodiac(year);

  document.getElementById("zodiacEmoji").textContent = zodiac.emoji;
  document.getElementById("zodiacName").textContent = zodiac.name;

  recState.element = dayMasterElement;
  recState.songIndex = (seedBase + 31) % SONG_BY_ELEMENT[dayMasterElement].length;
  renderSong(recState.element, recState.songIndex);
  recState.bookIndex = (seedBase + 37) % BOOK_BY_ELEMENT[dayMasterElement].length;
  renderBook(recState.element, recState.bookIndex);

  const musicRetryBtn = document.getElementById("recMusicRetry");
  musicRetryBtn.disabled = false;
  musicRetryBtn.textContent = "🔄 다른 곡 추천 (1회)";
  const bookRetryBtn = document.getElementById("recBookRetry");
  bookRetryBtn.disabled = false;
  bookRetryBtn.textContent = "🔄 다른 책 추천 (1회)";

  document.getElementById("recHobby").textContent = pick(HOBBY_BY_ELEMENT[dayMasterElement], seedBase + 41);

  document.getElementById("fortuneGeneral").textContent = `${RELATION_MAIN.총운[relation]} ${pick(GENERAL_DETAIL, seedBase + 1)}`;
  document.getElementById("fortuneLove").textContent = `${RELATION_MAIN.애정운[relation]} ${pick(LOVE_DETAIL, seedBase + 7)}`;
  document.getElementById("fortuneMoney").textContent = `${RELATION_MAIN.금전운[relation]} ${pick(MONEY_DETAIL, seedBase + 13)}`;
  document.getElementById("fortuneHealth").textContent = `${RELATION_MAIN.건강운[relation]} ${pick(HEALTH_DETAIL, seedBase + 19)}`;
  document.getElementById("luckyColor").textContent = pick(COLORS, seedBase + 23);
  document.getElementById("luckyNumber").textContent = (seedBase % 45) + 1;
  renderMonthly(dayMasterElement);
  document.getElementById("advice").textContent = pick(ADVICE, seedBase + 29);

  formCard.hidden = true;
  resultCard.hidden = false;
}

function renderMonthly(dayMasterElement) {
  const year = new Date().getFullYear();
  document.getElementById("monthlyYearLabel").textContent = `${year}년 기준 (양력, 절기 근사치 적용)`;

  const grid = document.getElementById("monthlyGrid");
  const toggleBtn = document.getElementById("monthlyToggleBtn");
  grid.hidden = true;
  toggleBtn.textContent = "월별 운세 펼쳐보기 ▾";

  let html = "";
  for (let m = 1; m <= 12; m++) {
    const branch = getMonthBranchIndex(m, 15);
    const element = BRANCH_ELEMENT[branch];
    const relation = elementRelation(dayMasterElement, element);
    const seed = simpleHash(`${year}-${m}-monthly`);
    const text = pick(MONTHLY_TEXT[relation], seed);
    html += `<div class="monthly__card">
      <div class="monthly__card-head">
        <span class="monthly__card-month">${m}월</span>
        <span class="monthly__card-tag">${RELATION_LABEL[relation]}</span>
      </div>
      <p class="monthly__card-text">${text}</p>
    </div>`;
  }
  grid.innerHTML = html;
}

document.getElementById("monthlyToggleBtn").addEventListener("click", () => {
  const grid = document.getElementById("monthlyGrid");
  const btn = document.getElementById("monthlyToggleBtn");
  grid.hidden = !grid.hidden;
  btn.textContent = grid.hidden ? "월별 운세 펼쳐보기 ▾" : "월별 운세 접기 ▴";
});

// ---- PWA 서비스워커 등록 (선택 사항, 실패해도 앱 동작에는 문제 없음) ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
