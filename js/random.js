// 진입점 및 초기 변수
document.addEventListener("DOMContentLoaded", async () => {
  const cardElement = document.getElementById("random-card");
  const drawBtn = document.getElementById("draw-btn");

  if (!cardElement || !drawBtn) {
    return;
  }

  let songs = [];
  let currentSong = null;
  let isDrawing = false;

  // 곡 선택
  function getRandomSong(songs, currentSong) {
    if (songs.length <= 1) {
      return songs[0];
    }
    let picked;
    do {
      picked = songs[Math.floor(Math.random() * songs.length)];
    } while (picked === currentSong);
    return picked;
  }

  // 렌더링
  function displaySong(song) {
    cardElement.innerHTML = "";

    if (!song) {
      cardElement.textContent = "노래 정보를 표시할 수 없습니다.";
      return;
    }

    // 유튜브 플레이어 생성
    const player = createYoutubePlayer(song.source, song.name);
    cardElement.appendChild(player);

    // 상세정보 생성
    const details = document.createElement("div");
    details.style.display = "flex";
    details.style.flexDirection = "column";
    details.style.gap = "var(--space-2)";
    details.style.fontSize = "0.95rem";

    // 제목 & 길이
    const row1 = document.createElement("div");
    row1.className = "song-row";
    row1.style.justifyContent = "space-between";

    const col1Left = document.createElement("span");
    col1Left.className = "song-field";
    const label1Left = document.createElement("span");
    label1Left.className = "song-label";
    label1Left.textContent = "제목 ";
    const val1Left = document.createElement("span");
    val1Left.className = "song-value";
    val1Left.textContent = song.name;
    col1Left.append(label1Left, val1Left);

    const col1Right = document.createElement("span");
    col1Right.className = "song-field";
    col1Right.style.justifyContent = "flex-end";
    col1Right.style.flex = "0 0 auto";
    const label1Right = document.createElement("span");
    label1Right.className = "song-label";
    label1Right.textContent = "길이 ";
    const val1Right = document.createElement("span");
    val1Right.className = "song-value";
    val1Right.textContent = song.length;
    col1Right.append(label1Right, val1Right);

    row1.append(col1Left, col1Right);

    // 작곡가 & BPM
    const row2 = document.createElement("div");
    row2.className = "song-row";
    row2.style.justifyContent = "space-between";

    const col2Left = document.createElement("span");
    col2Left.className = "song-field";
    const label2Left = document.createElement("span");
    label2Left.className = "song-label";
    label2Left.textContent = "작곡가 ";
    const val2Left = document.createElement("span");
    val2Left.className = "song-value";
    val2Left.textContent = song.jakgokga;
    col2Left.append(label2Left, val2Left);

    const col2Right = document.createElement("span");
    col2Right.className = "song-field";
    col2Right.style.justifyContent = "flex-end";
    col2Right.style.flex = "0 0 auto";
    const label2Right = document.createElement("span");
    label2Right.className = "song-label";
    label2Right.textContent = "BPM ";
    const val2Right = document.createElement("span");
    val2Right.className = "song-value";
    val2Right.textContent = song.bpm;
    col2Right.append(label2Right, val2Right);

    row2.append(col2Left, col2Right);

    // 태그
    const row3 = document.createElement("div");
    row3.className = "song-row";

    const col3Left = document.createElement("span");
    col3Left.className = "song-field";
    const label3Left = document.createElement("span");
    label3Left.className = "song-label";
    label3Left.textContent = "태그 ";
    const val3Left = document.createElement("span");
    val3Left.className = "song-value";
    val3Left.textContent = formatValue(song.tag);
    col3Left.append(label3Left, val3Left);

    row3.append(col3Left);

    details.append(row1, row2, row3);
    cardElement.appendChild(details);
  }
  
  // 뽑기 실행
  function drawSong() {
    if (songs.length === 0) {
      return;
    }
    const finalSong = getRandomSong(songs, currentSong);
    displaySong(finalSong);
    currentSong = finalSong;
  }
// 초기 로드
  try {
    songs = await loadSongData();
    if (songs.length > 0) {
      currentSong = getRandomSong(songs, null);
      displaySong(currentSong);
    } else {
      cardElement.textContent = "노래 데이터가 비어 있습니다.";
    }
  } catch (error) {
    cardElement.textContent = "노래 데이터를 불러오는데 실패했습니다.";
    console.error(error);
  }

  drawBtn.addEventListener("click", drawSong);
});
