// 설문 데이터
const surveyQuestions = [
  {
    title: "당신의 현재 기분은?",
    options: [
      { text: "너무 행복해서 주울 지경이다", tags: ["밝음", "신남", "경쾌함", "귀여움"] },
      { text: "기분 좋다", tags: ["밝음", "청량감", "통통 튀는 비트"] },
      { text: "그저 그렇다", tags: ["잔잔함", "몽환", "비트"] },
      { text: "슬퍼서 눈물로 홍수를 일으켰다", tags: ["공허감", "위로", "몽환"] },
      { text: "화나서 범죄에 가담할것만 같다", tags: ["빠른", "전투", "해소", "정신없이 몰아치는"] },
    ],
  },
  {
    title: "지금 필요한 에너지는?",
    options: [
      { text: "머리가 깨질 정도의 속도", tags: ["빠른", "에너지틱", "EDM"] },
      { text: "몸이 먼저 반응하는 비트", tags: ["비트", "통통 튀는 비트", "중독성"] },
      { text: "마음이 식는 시원함", tags: ["시원시원함", "청량감", "해소"] },
      { text: "어딘가로 빨려 들어가는 몰입감", tags: ["몰입", "드라마틱", "긴장감"] },
    ],
  },
  {
    title: "노래를 들은 뒤 원하는 상태는?",
    options: [
      { text: "다시 움직일 힘을 얻고 싶다", tags: ["위로", "밝음", "시원시원함"] },
      { text: "생각을 비우고 싶다", tags: ["몽환", "잔잔함", "공허감"] },
      { text: "짜증을 날려버리고 싶다", tags: ["전투", "빠른", "해소"] },
      { text: "그냥 재미있는 걸 보고 싶다", tags: ["귀여움", "그림체가 맛있음", "경쾌함"] },
    ],
  },
  {
    title: "오늘의 템포 취향은?",
    options: [
      { text: "숨 돌릴 틈 없이 빠른 곡", tags: ["빠른", "정신없이 몰아치는", "에너지틱"] },
      { text: "적당히 고개가 끄덕여지는 곡", tags: ["비트", "통통 튀는 비트", "경쾌함"] },
      { text: "천천히 잠기는 곡", tags: ["잔잔함", "몽환", "공허감"] },
      { text: "긴장감 있게 몰아치는 곡", tags: ["전투", "긴장감", "드라마틱"] },
    ],
  },
  {
    title: "지금 끌리는 분위기는?",
    options: [
      { text: "화면까지 알록달록한 느낌", tags: ["밝음", "귀여움", "그림체가 맛있음"] },
      { text: "현실을 한 번 꼬집는 느낌", tags: ["현실비판", "서사", "위로"] },
      { text: "게임 보스전 같은 압박감", tags: ["전투", "웅장함", "긴장감"] },
      { text: "새벽에 혼자 듣는 공허함", tags: ["공허감", "몽환", "잔잔함"] },
    ],
  },
  {
    title: "보컬은 어떤 쪽이 좋아?",
    options: [
      { text: "여자 보컬이 확실히 좋다", tags: ["여자", "밝음", "귀여움"] },
      { text: "보컬보다 비트가 중요하다", tags: ["비트", "EDM", "통통 튀는 비트"] },
      { text: "목소리가 많으면 더 좋다", tags: ["신남", "경쾌함", "시원시원함"] },
      { text: "보컬 없어도 분위기만 좋으면 된다", tags: ["전투", "몰입", "드라마틱"] },
    ],
  },
  {
    title: "지금 가장 피하고 싶은 건?",
    options: [
      { text: "너무 축 처지는 노래", tags: ["밝음", "신남", "빠른"] },
      { text: "너무 정신없는 노래", tags: ["잔잔함", "청량감", "몽환"] },
      { text: "가벼운 분위기", tags: ["드라마틱", "웅장함", "현실비판"] },
      { text: "너무 진지한 분위기", tags: ["귀여움", "경쾌함", "통통 튀는 비트"] },
    ],
  },
  {
    title: "마지막으로, 지금 필요한 한 방은?",
    options: [
      { text: "기분을 위로하는 한 방", tags: ["위로", "청량감", "잔잔함"] },
      { text: "심장을 두드리는 한 방", tags: ["빠른", "전투", "EDM"] },
      { text: "귀에 계속 남는 한 방", tags: ["중독성", "비트", "경쾌함"] },
      { text: "세상을 잠깐 잊는 한 방", tags: ["몽환", "몰입", "공허감"] },
    ],
  },
];
// 점수 계산 유틸
function addTagScore(scores, tags, amount = 1) {
  tags.forEach((tag) => {
    scores.set(tag, (scores.get(tag) ?? 0) + amount);
  });
}

function getBestMatchedTags(songTags, scores) {
  return songTags.filter((tag) => scores.has(tag));
}

// 추천 알고리즘
function recommendSongs(songs, answers) {
  const scores = new Map();

  answers.forEach((answer) => {
    addTagScore(scores, answer.tags, 2);
  });

  return songs
    .map((song) => {
      const matchedTags = getBestMatchedTags(song.tag ?? [], scores);
      const score = matchedTags.reduce((total, tag) => total + scores.get(tag), 0);

      return { song, score, matchedTags };
    })
    .sort((a, b) => b.score - a.score || Number(a.song.id) - Number(b.song.id))
    .slice(0, 3);
}

// 화면 렌더링
function renderSurveyQuestion(index, answers, songs) {
  const survey = document.querySelector("#survey");
  const question = surveyQuestions[index];

  if (!survey || !question) {
    return;
  }

  survey.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "survey-title";
  title.textContent = question.title;

  const panel = document.createElement("div");
  panel.className = "survey-panel";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "button survey-option";
    button.type = "button";
    button.textContent = option.text;
    button.addEventListener("click", () => {
      const nextAnswers = [...answers, option];

      if (index + 1 >= surveyQuestions.length) {
        renderRecommendations(songs, nextAnswers);
        return;
      }

      renderSurveyQuestion(index + 1, nextAnswers, songs);
    });

    panel.append(button);
  });

  const progress = document.createElement("p");
  progress.className = "survey-progress";
  progress.textContent = `${index + 1} / ${surveyQuestions.length}`;

  survey.append(title, panel, progress);
}

// 결과 렌더링
function renderRecommendations(songs, answers) {
  const survey = document.querySelector("#survey");
  const results = recommendSongs(songs, answers);

  if (!survey) {
    return;
  }

  survey.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "survey-title";
  title.textContent = "당신을 위한 노래";

  const list = document.createElement("div");
  list.className = "list recommend-list";

  results.forEach(({ song, score, matchedTags }) => {
    const reason =
      matchedTags.length > 0
        ? `${matchedTags.join(", ")} 태그와 맞음`
        : `기본 추천 점수 ${score}`;

    list.append(createSongItem(song, reason));
  });

  const retry = document.createElement("button");
  retry.className = "button survey-retry";
  retry.type = "button";
  retry.textContent = "다시 설문하기";
  retry.addEventListener("click", () => {
    renderSurveyQuestion(0, [], songs);
  });

  survey.append(title, list, retry);
}

// 초기화
async function initRecommendation() {
  const survey = document.querySelector("#survey");

  if (!survey) {
    return;
  }

  try {
    const songs = await loadSongData();
    renderSurveyQuestion(0, [], songs);
  } catch (error) {
    survey.textContent = "추천 데이터를 불러오지 못했습니다.";
    console.error(error);
  }

}

document.addEventListener("DOMContentLoaded", initRecommendation);
