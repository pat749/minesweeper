import React from 'react';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  handleContextMenu(e) {
    e.preventDefault();
    if (this.props.board.lost() || this.props.board.won()) return;
    this.props.updateGame(this.props.tile, true);
  }

  handleClick(e) {
    if (this.props.board.lost() || this.props.board.won()) return;
    const tile = this.props.tile;
    const flagged = e.altKey === true;

    if (flagged) {
      this.props.updateGame(tile, true);
      return;
    }

    if (tile.explored && !tile.bombed && tile.adjacentBombCount() > 0) {
      this.props.updateGame(tile, false, true);
      return;
    }

    if (!tile.explored) {
      this.props.updateGame(tile, false, false);
    }
  }

  render() {
    const tile = this.props.tile;
    let klass;
    let text;
    let count = 0;
    if (tile.explored) {
      if (tile.bombed) {
        klass = 'bombed';
        text = '\u{1F4A3}';
      } else {
        klass = 'explored';
        count = tile.adjacentBombCount();
        if (count > 0) {
          klass += ` n-${count}`;
        }
        text = count > 0 ? String(count) : '';
      }
    } else if (tile.flagged) {
      klass = 'flagged';
      text = '\u{1F6A9}';
    } else {
      klass = 'unexplored';
    }
    klass = `tile ${klass}`;

    return (
      <div
        className={klass}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
        role="button"
        tabIndex={0}
        aria-label={
          tile.flagged
            ? 'Flagged'
            : tile.explored
              ? tile.bombed
                ? 'Mine'
                : count
                  ? `${count} adjacent mines`
                  : 'Empty'
              : 'Hidden'
        }
      >
        {text}
      </div>
    );
  }
}

export default Tile;
