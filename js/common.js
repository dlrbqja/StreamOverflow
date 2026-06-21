const songFiles = ["./data/songs.json"];
const playlistFile = "./data/playlists-data.json";

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

async function loadPlaylistData() {
  const response = await fetch(playlistFile);

  if (!response.ok) {
    throw new Error(`${playlistFile} 파일을 불러오지 못했습니다.`);
  }

  return response.json();
}
