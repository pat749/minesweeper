import Board from './board';
import React from 'react';
import * as Minesweeper from '../minesweeper';

const DIFFICULTIES = {
  beginner: { label: 'Beginner', gridSize: 9, numBombs: 10 },
  intermediate: { label: 'Intermediate', gridSize: 16, numBombs: 40 },
  expert: { label: 'Expert', gridSize: 22, numBombs: 99 },
};

function padTime(n) {
  return n < 10 ? `0${n}` : String(n);
}

function formatMineCount(remaining) {
  if (remaining < 0) {
    return '-' + ('00' + String(-remaining)).slice(-2);
  }
  return ('00' + String(remaining)).slice(-3);
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: 'beginner',
      board: this.makeBoard('beginner'),
      seconds: 0,
      timerOn: false,
    };
    this.timerId = null;
    this.restartGame = this.restartGame.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.setDifficulty = this.setDifficulty.bind(this);
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  makeBoard(key) {
    const { gridSize, numBombs } = DIFFICULTIES[key];
    return new Minesweeper.Board(gridSize, numBombs);
  }

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  startTimer() {
    if (this.timerId) return;
    this.timerId = setInterval(() => {
      this.setState((s) => ({ seconds: s.seconds + 1 }));
    }, 1000);
  }

  restartGame() {
    this.stopTimer();
    const { difficulty } = this.state;
    this.setState({
      board: this.makeBoard(difficulty),
      seconds: 0,
      timerOn: false,
    });
  }

  setDifficulty(e) {
    const difficulty = e.target.value;
    this.stopTimer();
    this.setState({
      difficulty,
      board: this.makeBoard(difficulty),
      seconds: 0,
      timerOn: false,
    });
  }

  updateGame(tile, flagged, chord) {
    const board = this.state.board;
    if (board.lost() || board.won()) return;

    if (!this.state.timerOn) {
      this.setState({ timerOn: true });
      this.startTimer();
    }

    if (flagged) {
      tile.toggleFlag();
    } else if (chord) {
      tile.chord();
    } else {
      tile.explore();
    }

    if (board.lost()) {
      board.revealAllMines();
    }

    if (board.lost() || board.won()) {
      this.stopTimer();
    }

    this.setState({ board });
  }

  render() {
    const { board, seconds, difficulty } = this.state;
    const remaining = board.numBombs - board.flagCount();
    const displayRem = formatMineCount(remaining);
    const displayTime = `${padTime(Math.floor(seconds / 60))}:${padTime(seconds % 60)}`;

    let modal = null;
    if (board.lost() || board.won()) {
      const text = board.won() ? 'You cleared the field!' : 'Game over';
      const sub = board.won() ? 'Nice work.' : 'A mine was revealed.';
      modal = (
        <div className="modal-screen" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <h2 id="modal-title">{text}</h2>
            <p className="modal-sub">{sub}</p>
            <p className="modal-stats">
              Time: {displayTime} · Difficulty: {DIFFICULTIES[difficulty].label}
            </p>
            <button type="button" className="btn-primary" onClick={this.restartGame}>
              Play again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="game-shell">
        {modal}
        <header className="game-header">
          <div className="lcd" aria-live="polite">
            <span className="lcd-label">MINES</span>
            <span className="lcd-value">{displayRem}</span>
          </div>
          <button
            type="button"
            className="face-btn"
            onClick={this.restartGame}
            title="New game"
            aria-label="New game"
          >
            {board.lost() ? '\u{1F635}' : board.won() ? '\u{1F60E}' : '\u{1F642}'}
          </button>
          <div className="lcd">
            <span className="lcd-label">TIME</span>
            <span className="lcd-value">{displayTime}</span>
          </div>
        </header>

        <div className="toolbar">
          <label className="difficulty-label" htmlFor="difficulty-select">
            Difficulty
          </label>
          <select
            id="difficulty-select"
            className="difficulty-select"
            value={difficulty}
            onChange={this.setDifficulty}
            disabled={board.bombsPlanted && !board.lost() && !board.won()}
          >
            {Object.keys(DIFFICULTIES).map((key) => (
              <option key={key} value={key}>
                {DIFFICULTIES[key].label} ({DIFFICULTIES[key].gridSize}×{DIFFICULTIES[key].gridSize},{' '}
                {DIFFICULTIES[key].numBombs} mines)
              </option>
            ))}
          </select>
        </div>

        <Board board={board} updateGame={this.updateGame} />

        <footer className="game-help">
          <p>
            <strong>Left-click</strong> to reveal · <strong>Right-click</strong> or <strong>Alt+click</strong> to
            flag · Click a <strong>revealed number</strong> to chord when adjacent flags match the count · First
            reveal is always safe
          </p>
        </footer>
      </div>
    );
  }
}

export default Game;
