const songFiles = ["./data/tetonam_alphamale_gay.json"];

const labels = {
  id: "ID",
  name: "제목",
  jakgokga: "작곡가",
  vocal: "보컬",
  bpm: "BPM",
  length: "길이",
  author: "작성자",
  tag: "태그",
  songs: "수록곡",
  illust: "그림/MV",
};

const surveyQuestions = [
  {
    title: "당신의 현재 기분은?",
    options: [
      { text: "너무 행복해서 주울 지경이다", tags: ["밝음", "신남", "경쾌한", "귀여움"] },
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
      { text: "몸이 먼저 반응하는 비트", tags: ["비트", "통통 튀는 비트", "중독성", "타격감"] },
      { text: "마음이 식는 시원함", tags: ["시원시원함", "청량감", "해소", "타격감"] },
      { text: "어딘가로 빨려 들어가는 몰입감", tags: ["몰입", "드라마틱", "긴장감"] },
    ],
  },
  {
    title: "노래를 들은 뒤 원하는 상태는?",
    options: [
      { text: "다시 움직일 힘을 얻고 싶다", tags: ["위로", "밝은", "시원시원한"] },
      { text: "생각을 비우고 싶다", tags: ["몽환", "잔잔한", "공허감"] },
      { text: "짜증을 날려버리고 싶다", tags: ["전투", "빠른", "해소", "쾌감"] },
      { text: "그냥 재미있는 걸 보고 싶다", tags: ["귀여운", "그림체가 맛있는", "경쾌한"] },
    ],
  },
  {
    title: "오늘의 템포 취향은?",
    options: [
      { text: "숨 돌릴 틈 없이 빠른 곡", tags: ["빠른", "정신없이 몰아치는", "에너지틱"] },
      { text: "적당히 고개가 끄덕여지는 곡", tags: ["비트", "통통 튀는 비트", "경쾌한", "타격감"] },
      { text: "천천히 잠기는 곡", tags: ["잔잔한", "몽환", "공허감"] },
      { text: "긴장감 있게 몰아치는 곡", tags: ["전투", "긴장감", "드라마틱"] },
    ],
  },
  {
    title: "지금 끌리는 분위기는?",
    options: [
      { text: "화면까지 알록달록한 느낌", tags: ["밝음", "귀여운", "그림체가 맛있는"] },
      { text: "현실을 한 번 꼬집는 느낌", tags: ["현실비판", "서사", "위로"] },
      { text: "게임 보스전 같은 압박감", tags: ["전투", "웅장한", "긴장감"] },
      { text: "새벽에 혼자 듣는 공허함", tags: ["공허감", "몽환적", "잔잔한"] },
    ],
  },
  {
    title: "보컬은 어떤 쪽이 좋아?",
    options: [
      { text: "여자 보컬이 확실히 좋다", tags: ["여자", "밝음", "귀여운"] },
      { text: "보컬보다 비트가 중요하다", tags: ["비트", "EDM", "통통 튀는 비트"] },
      { text: "목소리가 많으면 더 좋다", tags: ["신나는", "경쾌한", "시원시원한"] },
      { text: "보컬 없어도 분위기만 좋으면 된다", tags: ["전투", "몰입", "드라마틱"] },
    ],
  },
  {
    title: "지금 가장 피하고 싶은 건?",
    options: [
      { text: "너무 축 처지는 노래", tags: ["밝음", "신나는", "빠른"] },
      { text: "너무 정신없는 노래", tags: ["잔잔한", "청량감", "몽환"] },
      { text: "가벼운 분위기", tags: ["드라마틱", "웅장한", "현실비판"] },
      { text: "너무 진지한 분위기", tags: ["귀여운", "경쾌한", "통통 튀는 비트"] },
    ],
  },
  {
    title: "마지막으로, 지금 필요한 한 방은?",
    options: [
      { text: "기분을 위로하는 한 방", tags: ["위로", "청량감", "잔잔한"] },
      { text: "심장을 두드리는 한 방", tags: ["빠른", "전투", "EDM"] },
      { text: "귀에 계속 남는 한 방", tags: ["중독성", "비트", "경쾌한", ] },
      { text: "세상을 잠깐 잊는 한 방", tags: ["몽환적", "몰입", "공허감"] },
    ],
  },
];

function getYoutubeVideoId(source) {
  if (!source) {
    return "";
  }

  try {
    const url = new URL(source);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1);
    }

    if (url.searchParams.has("v")) {
      return url.searchParams.get("v");
    }

    return url.pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return String(source).split("?")[0];
  }
}

function createYoutubePlayer(source, title) {
  const videoId = getYoutubeVideoId(source);
  const iframe = document.createElement("iframe");

  iframe.className = "youtube-player";
  iframe.title = `${title} YouTube player`;
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  return iframe;
}

function createYoutubeThumbnail(source, title) {
  const videoId = getYoutubeVideoId(source);
  const thumbnail = document.createElement("img");

  thumbnail.className = "youtube-thumbnail";
  thumbnail.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  thumbnail.alt = `${title} YouTube thumbnail`;

  return thumbnail;
}

function formatValue(value) {
  return Array.isArray(value) ? value.join(", ") : value;
}

function createField(key, value) {
  const field = document.createElement("span");
  field.className = "song-field";

  const label = document.createElement("span");
  label.className = "song-label";
  label.textContent = `${labels[key] ?? key}: `;

  const content = document.createElement("span");
  content.className = "song-value";
  content.textContent = formatValue(value ?? "");

  field.append(label, content);
  return field;
}

function createSongItem(song, scoreText = "") {
  const item = document.createElement("div");
  item.className = "song-card";

  const summary = document.createElement("div");
  summary.className = "song-summary";

  ["name", "jakgokga", "vocal"].forEach((key) => {
    const row = document.createElement("div");
    row.className = "song-row";
    row.append(createField(key, song[key]));
    summary.append(row);
  });

  if (scoreText) {
    const row = document.createElement("div");
    row.className = "song-row";
    row.append(createField("추천", scoreText));
    summary.append(row);
  }

  const actions = document.createElement("div");
  actions.className = "song-actions";

  const detailLink = document.createElement("a");
  detailLink.className = "button detail-link";
  detailLink.href = `./detail.html?id=${encodeURIComponent(song.id)}`;
  detailLink.textContent = "상세정보";

  actions.append(detailLink);
  summary.append(actions);
  item.append(createYoutubeThumbnail(song.source, song.name), summary);

  return item;
}

function renderSongs(songs, list, keyword = "") {
  const searchText = keyword.trim().toLowerCase();
  list.innerHTML = "";

  songs
    .filter((song) =>
      Object.entries(song)
        .filter(([key]) => key !== "source")
        .some(([, value]) =>
          String(formatValue(value)).toLowerCase().includes(searchText),
        ),
    )
    .forEach((song) => list.append(createSongItem(song)));
}

async function loadSongData() {
  const files = await Promise.all(
    songFiles.map(async (file) => {
      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(`${file} 파일을 불러오지 못했습니다.`);
      }

      return response.json();
    }),
  );

  return files.flat();
}

async function initSongList() {
  const list = document.querySelector("#list");
  const search = document.querySelector("#search");

  if (!list) {
    return;
  }

  try {
    const songs = await loadSongData();

    renderSongs(songs, list, search?.value ?? "");
    search?.addEventListener("input", () => {
      renderSongs(songs, list, search.value);
    });
  } catch (error) {
    list.textContent = "노래 데이터를 불러오지 못했습니다.";
    console.error(error);
  }
}

function createDetailRow(key, value) {
  const row = document.createElement("div");
  row.className = "detail-row";

  const label = document.createElement("span");
  label.className = "song-label";
  label.textContent = labels[key] ?? key;

  const content = document.createElement("span");
  content.className = "song-value";
  content.textContent = formatValue(value);

  row.append(label, content);
  return row;
}

async function initSongDetail() {
  const detail = document.querySelector("#detail");

  if (!detail) {
    return;
  }

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  try {
    const songs = await loadSongData();
    const song = songs.find((item) => String(item.id) === id);

    if (!song) {
      detail.textContent = "노래 정보를 찾지 못했습니다.";
      return;
    }

    document.title = `${song.name} - Stream Overflow`;
    detail.innerHTML = "";
    detail.append(createYoutubePlayer(song.source, song.name));

    const info = document.createElement("div");
    info.className = "detail-info";

    Object.entries(song)
      .filter(([key]) => key !== "source" && key !== "id")
      .forEach(([key, value]) => {
        info.append(createDetailRow(key, value));
      });

    detail.append(info);
  } catch (error) {
    detail.textContent = "상세정보를 불러오지 못했습니다.";
    console.error(error);
  }
}

function addTagScore(scores, tags, amount = 1) {
  tags.forEach((tag) => {
    scores.set(tag, (scores.get(tag) ?? 0) + amount);
  });
}

function getBestMatchedTags(songTags, scores) {
  return songTags.filter((tag) => scores.has(tag));
}

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

document.addEventListener("DOMContentLoaded", () => {
  initSongList();
  initSongDetail();
  initRecommendation();
});
