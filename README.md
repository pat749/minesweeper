# Minesweeper

A browser-based Minesweeper built with React and webpack. Clear the field using numeric clues, flag suspected mines, and avoid detonations.

![Preview banner](docs/preview.svg)

## Play online (GitHub Pages)

After you enable GitHub Pages for this repository, the game is published automatically on every push to `main`.

1. Push these changes to GitHub (remote `origin` on the `main` branch).
2. In the repo on GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**. Ignore the **Configure** buttons for “Static HTML” or “Jekyll” — this repo already includes **`.github/workflows/pages.yml`**.
4. Confirm that file exists on GitHub under **Code** → `.github/workflows/pages.yml`. If it is missing, push your local `main` branch (see below).
5. Open the **Actions** tab, select **Deploy to GitHub Pages**, and either wait for the latest run or use **Run workflow** (manual runs are enabled).
6. The first run may ask you to **approve** the `github-pages` environment (GitHub will show a prompt in the workflow run).
7. When the run is green, the site is live at:

   `https://<your-username>.github.io/minesweeper/`

   Replace `<your-username>` with your GitHub username or organization name (for **pat749** / repo **minesweeper**, that is `https://pat749.github.io/minesweeper/`).

## Prerequisites

You need **Node.js** (includes `npm`). If `zsh: command not found: npm`, install Node and ensure your shell can see it.

**macOS (Homebrew):**

```bash
brew install node
```

If `brew` itself is not found, install Homebrew from [brew.sh](https://brew.sh), then add it to your PATH (Apple Silicon often needs this once):

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Open a **new** terminal tab, then run `node -v` and `npm -v` to confirm.

This project uses webpack 4; the npm scripts set `NODE_OPTIONS=--openssl-legacy-provider` so the build works on current Node (OpenSSL 3).

## Run locally

```bash
cd "minesweeper game reactjs/minesweeper game"
npm install
npm run build
open dist/index.html
```

On macOS, `open dist/index.html` launches the built game in your default browser. On other systems, open `dist/index.html` manually or serve the `dist` folder with any static file server.

For development with rebuild on save:

```bash
npm start
```

Then refresh the browser after webpack writes `dist/bundle.js`. Use **`dist/index.html`** as the page you open (the `prestart` script copies HTML/CSS into `dist/` first).

## Controls

| Action | Input |
|--------|--------|
| Reveal a tile | Left-click |
| Flag / unflag | Right-click, or Alt + left-click |
| Chord (reveal neighbors) | Left-click a **revealed** number when the number of adjacent flags matches that number |
| New game | Smiley button or **Play again** after win/loss |

## Features

- **Difficulties**: Beginner (9×9, 10 mines), Intermediate (16×16, 40), Expert (22×22, 99).
- **First click safe**: Mines are placed after your first reveal, with a clear zone around that tile.
- **Timer** and **mine counter** (mines minus flags).
- **Chord** on numbers when flags match the clue (wrong flags can still detonate a mine).
- **Win / loss** modal with time and difficulty; on loss, all mines are shown.
- **Visuals**: Dark theme, colored clues (1–8), gradient tiles, LCD-style readouts.

## Project layout

- `minesweeper game reactjs/minesweeper game/` — React app, webpack config, and production build output in `dist/`.
- `.github/workflows/pages.yml` — Builds with Node 20 and deploys `dist` to GitHub Pages.
- `docs/preview.svg` — Vector preview graphic for the README.

## Rules (quick reference)

- Numbers show how many mines touch that cell (including diagonals).
- You win when every **non-mine** cell is revealed.
- You lose if you reveal a mine.

Enjoy, and good luck clearing the field.
