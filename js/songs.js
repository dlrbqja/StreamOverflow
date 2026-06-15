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

document.addEventListener("DOMContentLoaded", () => {
  initSongList();
  initSongDetail();
});
