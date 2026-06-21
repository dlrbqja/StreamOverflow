let currentPlaylistState = {
  playlist: null,
  songs: [],
  currentIndex: 0,
  playing: false,
};

function getPlaylistSongs(playlist, songs) {
  return playlist.songIds
    .map((id) => songs.find((song) => String(song.id) === String(id)))
    .filter(Boolean);
}

function getPlaylistTags(songs) {
  return [...new Set(songs.flatMap((song) => song.tag ?? []))].slice(0, 5);
}

function getPlaylistLength(songs) {
  return songs.reduce((total, song) => {
    const [minutes, seconds] = String(song.length ?? "0:00")
      .split(":")
      .map((value) => Number(value));

    return total + minutes * 60 + seconds;
  }, 0);
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function createPlaylistCard(playlist, songs) {
  const playlistSongs = getPlaylistSongs(playlist, songs);
  const coverSong = playlistSongs[0];
  const card = document.createElement("article");
  card.className = "playlist-card";

  if (coverSong) {
    card.append(createYoutubeThumbnail(coverSong.source, playlist.title));
  }

  const body = document.createElement("div");
  body.className = "playlist-summary";

  const title = document.createElement("h2");
  title.className = "playlist-title";
  title.textContent = playlist.title;

  const meta = document.createElement("p");
  meta.className = "playlist-meta";
  meta.textContent = `${playlistSongs.length}곡 · ${formatSeconds(getPlaylistLength(playlistSongs))}`;

  const desc = document.createElement("p");
  desc.className = "playlist-desc";
  desc.textContent = playlist.description;

  body.append(title, meta, desc);

  const detail = document.createElement("a");
  detail.className = "button detail-link";
  detail.href = `./playlist-detail.html?id=${encodeURIComponent(playlist.id)}`;
  detail.textContent = "상세정보";

  card.append(body, detail);
  return card;
}

function renderPlaylistList(playlistsToRender, songs) {
  const list = document.querySelector("#playlist-list");
  list.innerHTML = "";

  playlistsToRender.forEach((playlist) => {
    list.append(createPlaylistCard(playlist, songs));
  });
}

async function initPlaylistList() {
  const list = document.querySelector("#playlist-list");
  const search = document.querySelector("#playlist-search");

  if (!list) {
    return;
  }

  try {
    const [songs, playlists] = await Promise.all([
      loadSongData(),
      loadPlaylistData(),
    ]);
    const render = () => {
      const keyword = search.value.trim().toLowerCase();
      const filtered = playlists.filter((playlist) => {
        const playlistSongs = getPlaylistSongs(playlist, songs);
        const searchable = [
          playlist.title,
          playlist.description,
          ...playlistSongs.map((song) => formatValue(song.tag ?? [])),
          ...playlistSongs.map((song) => song.name),
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(keyword);
      });

      renderPlaylistList(filtered, songs);
    };

    render();
    search.addEventListener("input", render);
  } catch (error) {
    list.textContent = "플레이리스트를 불러오지 못했습니다.";
    console.error(error);
  }
}

function setCurrentTrack(index) {
  const { songs } = currentPlaylistState;

  currentPlaylistState.currentIndex = index;
  currentPlaylistState.playing = true;

  const song = songs[index];
  const current = document.querySelector("#current-track");
  const length = document.querySelector("#current-length");
  const player = document.querySelector("#playlist-player");
  const playButton = document.querySelector("#playlist-play");

  current.textContent = song.name;
  length.textContent = song.length;
  playButton.textContent = "일시정지";
  player.innerHTML = "";
  player.append(createYoutubePlayer(song.source, song.name));
}

function togglePlaylistPlayback() {
  const playButton = document.querySelector("#playlist-play");

  currentPlaylistState.playing = !currentPlaylistState.playing;
  playButton.textContent = currentPlaylistState.playing ? "일시정지" : "재생";

  if (currentPlaylistState.playing) {
    setCurrentTrack(currentPlaylistState.currentIndex);
  }
}

function createPlaylistTrack(song, index) {
  const item = document.createElement("li");
  item.className = "playlist-track";

  const info = document.createElement("button");
  info.className = "playlist-track-main";
  info.type = "button";
  info.addEventListener("click", () => setCurrentTrack(index));

  const title = document.createElement("span");
  title.className = "playlist-track-title";
  title.textContent = song.name;

  const meta = document.createElement("span");
  meta.className = "playlist-track-meta";
  meta.textContent = `${song.length} · ${formatValue(song.tag ?? [])}`;

  const detail = document.createElement("a");
  detail.className = "button playlist-track-link";
  detail.href = `./detail.html?id=${encodeURIComponent(song.id)}`;
  detail.target = "_blank";
  detail.rel = "noopener";
  detail.textContent = "상세 확인";

  info.append(title, meta);
  item.append(info, detail);
  return item;
}

function renderPlaylistDetail(playlist, songs) {
  const title = document.querySelector("#playlist-title");
  const description = document.querySelector("#playlist-description");
  const meta = document.querySelector("#playlist-meta");
  const trackList = document.querySelector("#playlist-tracks");
  const playButton = document.querySelector("#playlist-play");

  currentPlaylistState = {
    playlist,
    songs,
    currentIndex: 0,
    playing: false,
  };

  title.textContent = playlist.title;
  description.textContent = playlist.description;
  meta.textContent = `${songs.length}곡 · 총 ${formatSeconds(getPlaylistLength(songs))}`;
  trackList.innerHTML = "";
  songs.forEach((song, index) => trackList.append(createPlaylistTrack(song, index)));
  playButton.addEventListener("click", togglePlaylistPlayback);
  setCurrentTrack(0);
  currentPlaylistState.playing = false;
  playButton.textContent = "재생";
}

async function initPlaylistDetail() {
  const detail = document.querySelector("#playlist-detail");

  if (!detail) {
    return;
  }

  const params = new URLSearchParams(location.search);
  const playlistId = params.get("id");

  try {
    const playlists = await loadPlaylistData();
    const playlist = playlists.find((item) => item.id === playlistId) ?? playlists[0];
    const songs = getPlaylistSongs(playlist, await loadSongData());
    document.title = `${playlist.title} - Stream Overflow`;
    renderPlaylistDetail(playlist, songs);
  } catch (error) {
    detail.textContent = "플레이리스트 상세정보를 불러오지 못했습니다.";
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPlaylistList();
  initPlaylistDetail();
});
