/* =========================================================
   GUESS THE NUMBER — game logic
   Vanilla JS. No dependencies.
   ========================================================= */

(() => {
  "use strict";

  /* ---------------- constants ---------------- */

  const MIN_NUM = 1;
  const MAX_NUM = 20;
  const MAX_LIVES = 5;
  const STORAGE_KEY = "guessTheNumber.bestScore";

  /* ---------------- dom refs ---------------- */

  const el = {
    card: document.getElementById("gameCard"),
    form: document.getElementById("guessForm"),
    input: document.getElementById("guessInput"),
    guessBtn: document.getElementById("guessBtn"),
    feedback: document.getElementById("feedback"),
    lives: document.querySelectorAll(".life"),
    bestScore: document.getElementById("bestScore"),
    attemptsUsed: document.getElementById("attemptsUsed"),
    attemptsLeft: document.getElementById("attemptsLeft"),
    historyCount: document.getElementById("historyCount"),
    historyList: document.getElementById("historyList"),
    historyEmpty: document.getElementById("historyEmpty"),
    trail: document.getElementById("trail"),
    restartLink: document.getElementById("restartLink"),

    winModal: document.getElementById("winModal"),
    winNumber: document.getElementById("winNumber"),
    winTries: document.getElementById("winTries"),
    winNewBest: document.getElementById("winNewBest"),
    winPlayAgain: document.getElementById("winPlayAgain"),

    loseModal: document.getElementById("loseModal"),
    loseNumber: document.getElementById("loseNumber"),
    losePlayAgain: document.getElementById("losePlayAgain"),

    confettiCanvas: document.getElementById("confettiCanvas"),
  };

  /* ---------------- state ---------------- */

  let state = {
    secret: 0,
    livesLeft: MAX_LIVES,
    attempts: 0,
    guessedValues: new Set(),
    isOver: false,
  };

  /* ---------------- init ---------------- */

  function init() {
    state = {
      secret: randomInt(MIN_NUM, MAX_NUM),
      livesLeft: MAX_LIVES,
      attempts: 0,
      guessedValues: new Set(),
      isOver: false,
    };

    renderLives();
    renderBestScore();
    renderStats();
    clearHistory();
    clearTrail();
    setFeedback("Enter a number to begin the scan.", null);

    el.input.value = "";
    el.input.disabled = false;
    el.guessBtn.disabled = false;
    el.input.focus();

    closeModal(el.winModal);
    closeModal(el.loseModal);
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* ---------------- guess handling ---------------- */

  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleGuess();
  });

  function handleGuess() {
    if (state.isOver) return;

    const raw = el.input.value.trim();

    if (raw === "") {
      setFeedback("Type a number first.", "error");
      shakeCard();
      return;
    }

    const guess = Number(raw);

    if (!Number.isInteger(guess) || guess < MIN_NUM || guess > MAX_NUM) {
      setFeedback(`Out of range. Enter a number between ${MIN_NUM} and ${MAX_NUM}.`, "error");
      shakeCard();
      el.input.value = "";
      return;
    }

    if (state.guessedValues.has(guess)) {
      setFeedback(`Already tried ${guess}. Pick a new value.`, "error");
      shakeCard();
      return;
    }

    state.attempts += 1;
    state.guessedValues.add(guess);

    if (guess === state.secret) {
      resolveCorrect(guess);
    } else if (guess < state.secret) {
      resolveWrong(guess, "low");
    } else {
      resolveWrong(guess, "high");
    }

    el.input.value = "";
    el.input.focus();
    renderStats();
  }

  function resolveWrong(guess, direction) {
    state.livesLeft -= 1;

    const message =
      direction === "low"
        ? "Too low. Signal suggests a higher value."
        : "Too high. Signal suggests a lower value.";

    setFeedback(message, direction === "low" ? "low" : "high");
    addHistoryItem(guess, direction);
    addTrailMarker(guess, direction);
    renderLives();
    shakeCard();

    if (state.livesLeft <= 0) {
      endGame(false);
    }
  }

  function resolveCorrect(guess) {
    setFeedback(`Correct! The number was ${guess}.`, "correct");
    addHistoryItem(guess, "correct");
    addTrailMarker(guess, "correct");
    endGame(true);
  }

  /* ---------------- end of game ---------------- */

  function endGame(won) {
    state.isOver = true;
    el.input.disabled = true;
    el.guessBtn.disabled = true;

    if (won) {
      const best = getBestScore();
      const isNewBest = best === null || state.attempts < best;
      if (isNewBest) setBestScore(state.attempts);
      renderBestScore();

      el.winNumber.textContent = state.secret;
      el.winTries.textContent = state.attempts;
      el.winNewBest.style.visibility = isNewBest ? "visible" : "hidden";

      setTimeout(() => {
        openModal(el.winModal);
        launchConfetti();
      }, 550);
    } else {
      el.loseNumber.textContent = state.secret;
      setTimeout(() => openModal(el.loseModal), 550);
    }
  }

  el.winPlayAgain.addEventListener("click", init);
  el.losePlayAgain.addEventListener("click", init);
  el.restartLink.addEventListener("click", init);

  /* ---------------- rendering helpers ---------------- */

  function setFeedback(text, type) {
    el.feedback.textContent = text;
    el.feedback.className = "feedback";
    if (type === "low") el.feedback.classList.add("is-low");
    if (type === "high") el.feedback.classList.add("is-high");
    if (type === "correct") el.feedback.classList.add("is-correct");
    if (type === "error") el.feedback.classList.add("is-error");
  }

  function renderLives() {
    el.lives.forEach((heart, i) => {
      heart.classList.toggle("is-lost", i >= state.livesLeft);
    });
  }

  function renderStats() {
    el.attemptsUsed.textContent = state.attempts;
    el.attemptsLeft.textContent = Math.max(state.livesLeft, 0);
    el.historyCount.textContent = state.guessedValues.size;
  }

  function renderBestScore() {
    const best = getBestScore();
    el.bestScore.textContent = best === null ? "—" : `${best} tries`;
  }

  function shakeCard() {
    el.card.classList.remove("is-shaking");
    // force reflow so the animation can restart
    void el.card.offsetWidth;
    el.card.classList.add("is-shaking");
  }

  /* ---------------- history list ---------------- */

  function clearHistory() {
    el.historyList.innerHTML = "";
    el.historyList.appendChild(el.historyEmpty);
    el.historyEmpty.style.display = "block";
  }

  function addHistoryItem(guess, type) {
    el.historyEmpty.style.display = "none";

    const li = document.createElement("li");
    li.className = "history__item";

    const num = document.createElement("span");
    num.className = "history__item-num";
    num.textContent = `#${state.attempts.toString().padStart(2, "0")} → ${guess}`;

    const tag = document.createElement("span");
    const labelMap = { low: "Too Low", high: "Too High", correct: "Correct" };
    tag.className = `history__item-tag history__item-tag--${type}`;
    tag.textContent = labelMap[type];

    li.appendChild(num);
    li.appendChild(tag);
    el.historyList.prepend(li);
  }

  /* ---------------- guess trail (signature element) ---------------- */

  function clearTrail() {
    el.trail.querySelectorAll(".trail__marker").forEach((m) => m.remove());
  }

  function addTrailMarker(guess, type) {
    const marker = document.createElement("div");
    const pct = ((guess - MIN_NUM) / (MAX_NUM - MIN_NUM)) * 100;
    marker.style.left = `${pct}%`;
    marker.className = `trail__marker trail__marker--${type}`;
    marker.textContent = guess;
    marker.title = `Guess ${guess}`;
    el.trail.appendChild(marker);
  }

  /* ---------------- local storage ---------------- */

  function getBestScore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function setBestScore(value) {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (err) {
      // localStorage may be unavailable (private browsing, etc). Fail silently.
    }
  }

  /* ---------------- modals ---------------- */

  function openModal(modal) {
    modal.classList.add("is-visible");
  }

  function closeModal(modal) {
    modal.classList.remove("is-visible");
  }

  [el.winModal, el.loseModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  /* ---------------- keyboard support ---------------- */

  el.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGuess();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(el.winModal);
      closeModal(el.loseModal);
    }
  });

  /* ---------------- confetti engine ---------------- */

  const confettiColors = ["#4cc9ff", "#b366ff", "#ffd166", "#eef1fb"];

  function launchConfetti() {
    const canvas = el.confettiCanvas;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = prefersReduced ? 0 : 140;

    const particles = Array.from({ length: count }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight * 0.3,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -9 - 4,
      size: Math.random() * 7 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.28 + Math.random() * 0.1,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let frame = 0;
    const maxFrames = 220;

    function tick() {
      frame += 1;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p) => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (frame < maxFrames) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }

    if (count > 0) requestAnimationFrame(tick);
  }

  /* ---------------- boot ---------------- */

  init();
})();
