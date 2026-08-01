# 🎯 Guess The Number

A dark, neon-lit number deduction game built with pure HTML, CSS, and vanilla JavaScript. The core has locked a value between **1** and **20** — decode it in five attempts or less.

> Originally a small Python CLI exercise, rebuilt as a fully interactive, polished browser game with a cyber/glassmorphism aesthetic.

![Status](https://img.shields.io/badge/status-complete-4cc9ff)
![No Frameworks](https://img.shields.io/badge/frameworks-none-b366ff)
![License](https://img.shields.io/badge/license-MIT-ffd166)

---

## 📸 Screenshots

> _Add screenshots or a GIF of gameplay here._

| Game Board | Victory | Defeat |
|---|---|---|
| `screenshots/board.png` | `screenshots/win.png` | `screenshots/lose.png` |

## 🔗 Live Demo

> _Add your deployed link here (GitHub Pages, Netlify, Vercel, etc.)_

`https://your-username.github.io/guess-the-number/`

---

## ✨ Features

- **Neon cyber UI** — dark theme, glassmorphism card, animated ambient glow
- **Guess Trail** — a live visual rail that plots every guess along the 1–20 range, color-coded by direction
- **5 lives system** with animated heart indicators
- **Guess history log** with per-attempt tags (Too Low / Too High / Correct)
- **Best score tracking** persisted via `localStorage`
- **Attempts + guesses counters**
- **Win modal** with confetti burst animation
- **Lose modal** revealing the secret number
- **Shake animation** on invalid or incorrect guesses
- **Input glow & focus states**, floating hero title, smooth transitions throughout
- **Full keyboard support** — press `Enter` to guess, `Esc` to dismiss modals
- **Fully responsive**, down to small mobile widths
- **Accessible** — semantic markup, `aria-live` feedback region, visible focus states, `prefers-reduced-motion` respected

---

## 🛠 Technologies

- **HTML5** — semantic structure
- **CSS3** — custom properties, glassmorphism, keyframe animations, CSS Grid/Flexbox
- **JavaScript (ES6+)** — vanilla, no dependencies, modular functions
- **Canvas API** — confetti animation engine
- **Web Storage API** — best score persistence
- **Google Fonts** — Orbitron, Rajdhani, JetBrains Mono

No frameworks. No build step. No dependencies.

---

## 📁 Folder Structure

```
guess-the-number/
├── index.html      # Markup & game structure
├── style.css        # Theme, layout, and all animations
├── script.js         # Game logic, state, storage, confetti engine
└── README.md
```

---

## 🚀 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/guess-the-number.git
   cd guess-the-number
   ```
2. Open `index.html` directly in your browser — or serve it locally:
   ```bash
   npx serve .
   ```
3. That's it. No build tools, no `npm install`.

---

## 🎮 How to Play

1. The game secretly locks a random number between **1 and 20**.
2. Type a number into the input field and press **Fire Guess** (or hit `Enter`).
3. The scan tells you if your guess was **too high** or **too low**.
4. Each guess appears on the **Guess Trail** and in the **Guess Log**.
5. You have **5 lives** — every wrong guess costs one.
6. Guess correctly before your lives run out to win, and try to beat your **best score**.
7. Click **Play Again** or **Restart Session** to start a new round.

---

## 🔭 Future Improvements

- Difficulty modes (wider ranges, fewer lives)
- Sound effects and background ambience toggle
- Global leaderboard via a lightweight backend
- Daily challenge mode with a shared seed
- Animated "hot/cold" proximity meter
- Light theme toggle

---

## 📄 License

Released under the [MIT License](https://opensource.org/licenses/MIT). Free to use, modify, and distribute.

---

Made with ❤️ by Ayush
