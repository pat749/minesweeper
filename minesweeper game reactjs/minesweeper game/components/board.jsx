import Tile from './tile';
import React from 'react';

class Board extends React.Component {
  render() {
    const board = this.props.board;
    const size = board.gridSize;
    return (
      <div id="board" className="minefield">
        {board.grid.map((row, i) => (
          <div className="row" key={`row-${i}`}>
            {row.map((tile, j) => (
              <Tile
                tile={tile}
                board={board}
                updateGame={this.props.updateGame}
                key={i * size + j}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Board;
