document.addEventListener("DOMContentLoaded", async () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const winnerScreen = document.getElementById("winner-screen");

  const leftOption = document.getElementById("left-option");
  const rightOption = document.getElementById("right-option");
  const matchRound = document.getElementById("match-round");

  const winnerPlayer = document.getElementById("winner-player");
  const winnerTitle = document.getElementById("winner-title");
  const winnerComposer = document.getElementById("winner-composer");
  const restartBtn = document.getElementById("restart-btn");

  let allSongs = [];
  let roundSongs = [];
  let nextRoundSongs = [];
  let currentMatch = 0;
  let roundSize = 0;

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createOptionCard(song, onSelect) {
    const container = document.createElement("div");
    container.className = "vs-option-card";

    // Player
    const player = createYoutubePlayer(song.source, song.name);

    // Text container
    const textContainer = document.createElement("div");
    textContainer.className = "vs-option-text";

    // Title
    const title = document.createElement("div");
    title.className = "vs-option-title";
    title.style.fontSize = "1.1rem";
    title.textContent = song.name;

    // Composer
    const composer = document.createElement("div");
    composer.className = "vs-option-composer";
    composer.style.fontSize = "0.9rem";
    composer.textContent = song.jakgokga;

    textContainer.append(title, composer);

    // Select button
    const button = document.createElement("button");
    button.className = "button survey-retry vs-option-btn";
    button.style.fontSize = "0.95rem";
    button.textContent = "선택";
    button.type = "button";
    button.addEventListener("click", onSelect);

    container.append(player, textContainer, button);
    return container;
  }

  function startTournament(size) {
    let selected = shuffle(allSongs);

    if (size === 16) {
      while (selected.length < 16 && selected.length > 0) {
        const extraSong = selected[Math.floor(Math.random() * selected.length)];
        selected.push({ ...extraSong, id: `${extraSong.id}-dup-${selected.length}` });
      }
      selected = selected.slice(0, 16);
    } else if (size === 8) {
      while (selected.length < 8 && selected.length > 0) {
        const extraSong = selected[Math.floor(Math.random() * selected.length)];
        selected.push({ ...extraSong, id: `${extraSong.id}-dup-${selected.length}` });
      }
      selected = selected.slice(0, 8);
    } else if (size === 4) {
      while (selected.length < 4 && selected.length > 0) {
        const extraSong = selected[Math.floor(Math.random() * selected.length)];
        selected.push({ ...extraSong, id: `${extraSong.id}-dup-${selected.length}` });
      }
      selected = selected.slice(0, 4);
    }

    roundSongs = selected;
    nextRoundSongs = [];
    currentMatch = 0;
    roundSize = size;

    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
    winnerScreen.style.display = "none";

    renderMatch();
  }

  function renderMatch() {
    const totalMatches = roundSongs.length / 2;
    const roundNameText = roundSize === 2 ? "결승" : `${roundSize}강`;
    matchRound.textContent = `${roundNameText} (${currentMatch + 1}/${totalMatches})`;

    leftOption.innerHTML = "";
    rightOption.innerHTML = "";

    const songLeft = roundSongs[currentMatch * 2];
    const songRight = roundSongs[currentMatch * 2 + 1];

    leftOption.appendChild(createOptionCard(songLeft, () => handleSelect(songLeft)));
    rightOption.appendChild(createOptionCard(songRight, () => handleSelect(songRight)));
  }

  function handleSelect(selectedSong) {
    nextRoundSongs.push(selectedSong);
    currentMatch++;

    const totalMatches = roundSongs.length / 2;
    if (currentMatch < totalMatches) {
      renderMatch();
    } else {
      if (nextRoundSongs.length === 1) {
        showWinner(nextRoundSongs[0]);
      } else {
        roundSongs = shuffle(nextRoundSongs);
        nextRoundSongs = [];
        currentMatch = 0;
        roundSize = roundSongs.length;
        renderMatch();
      }
    }
  }

  function showWinner(song) {
    gameScreen.style.display = "none";
    winnerScreen.style.display = "flex";

    winnerPlayer.innerHTML = "";
    const player = createYoutubePlayer(song.source, song.name);
    winnerPlayer.appendChild(player);

    winnerTitle.textContent = song.name;
    winnerComposer.textContent = song.jakgokga;
  }

  try {
    allSongs = await loadSongData();
    
    // Set up start button event listeners
    document.getElementById("start-16").addEventListener("click", () => startTournament(16));
    document.getElementById("start-8").addEventListener("click", () => startTournament(8));
    document.getElementById("start-4").addEventListener("click", () => startTournament(4));
    
    // Restart button event listener
    restartBtn.addEventListener("click", () => {
      winnerPlayer.innerHTML = "";
      winnerScreen.style.display = "none";
      startScreen.style.display = "flex";
    });

  } catch (error) {
    console.error("데이터 로드 실패:", error);
    const container = document.querySelector(".contents");
    container.textContent = "노래 데이터를 불러오지 못했습니다.";
  }
});
