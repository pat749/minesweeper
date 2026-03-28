export class Tile {
  constructor(board, pos) {
    this.board = board;
    this.pos = pos;
    this.bombed = false;
    this.explored = false;
    this.flagged = false;
  }

  adjacentBombCount() {
    let bombCount = 0;
    this.neighbors().forEach((neighbor) => {
      if (neighbor.bombed) {
        bombCount++;
      }
    });
    return bombCount;
  }

  adjacentFlagCount() {
    let c = 0;
    this.neighbors().forEach((n) => {
      if (n.flagged) c++;
    });
    return c;
  }

  explore() {
    if (this.flagged || this.explored) {
      return this;
    }

    if (!this.board.bombsPlanted) {
      this.board.plantBombs(this);
    }

    this.explored = true;
    if (!this.bombed && this.adjacentBombCount() === 0) {
      this.neighbors().forEach((tile) => {
        tile.explore();
      });
    }
  }

  /** Reveal unflagged neighbors when flag count matches the clue (classic chord). */
  chord() {
    if (!this.explored || this.bombed) return false;
    const n = this.adjacentBombCount();
    if (n === 0) return false;
    if (this.adjacentFlagCount() !== n) return false;
    this.neighbors().forEach((neighbor) => {
      if (!neighbor.flagged && !neighbor.explored) {
        neighbor.explore();
      }
    });
    return true;
  }

  neighbors() {
    const adjacentCoords = [];
    Tile.DELTAS.forEach((delta) => {
      const newPos = [delta[0] + this.pos[0], delta[1] + this.pos[1]];
      if (this.board.onBoard(newPos)) {
        adjacentCoords.push(newPos);
      }
    });

    return adjacentCoords.map((coord) => this.board.grid[coord[0]][coord[1]]);
  }

  plantBomb() {
    this.bombed = true;
  }

  toggleFlag() {
    if (!this.explored) {
      this.flagged = !this.flagged;
      return true;
    }

    return false;
  }
}

Tile.DELTAS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export class Board {
  constructor(gridSize, numBombs) {
    this.gridSize = gridSize;
    this.grid = [];
    this.numBombs = numBombs;
    this.bombsPlanted = false;
    this.generateBoard();
  }

  generateBoard() {
    for (let i = 0; i < this.gridSize; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.gridSize; j++) {
        const tile = new Tile(this, [i, j]);
        this.grid[i].push(tile);
      }
    }
  }

  onBoard(pos) {
    return (
      pos[0] >= 0 &&
      pos[0] < this.gridSize &&
      pos[1] >= 0 &&
      pos[1] < this.gridSize
    );
  }

  plantBombs(safeTile) {
    if (this.bombsPlanted) return;
    const safe = new Set();
    if (safeTile) {
      safe.add(`${safeTile.pos[0]},${safeTile.pos[1]}`);
      safeTile.neighbors().forEach((n) => safe.add(`${n.pos[0]},${n.pos[1]}`));
    }
    let planted = 0;
    while (planted < this.numBombs) {
      const row = Math.floor(Math.random() * this.gridSize);
      const col = Math.floor(Math.random() * this.gridSize);
      const key = `${row},${col}`;
      if (safe.has(key)) continue;
      const tile = this.grid[row][col];
      if (!tile.bombed) {
        tile.plantBomb();
        planted++;
      }
    }
    this.bombsPlanted = true;
  }

  flagCount() {
    let c = 0;
    this.grid.forEach((row) => {
      row.forEach((t) => {
        if (t.flagged) c++;
      });
    });
    return c;
  }

  lost() {
    let lost = false;
    this.grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.bombed && tile.explored) {
          lost = true;
        }
      });
    });
    return lost;
  }

  won() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const tile = this.grid[i][j];
        if (!tile.bombed && !tile.explored) return false;
      }
    }
    return true;
  }

  revealAllMines() {
    this.grid.forEach((row) => {
      row.forEach((t) => {
        if (t.bombed) t.explored = true;
      });
    });
  }
}
