import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      nextPlayer: 'X',
      turns: 0,
      dimension: 3
    };
  }

  calcWinner(squares) {
    const dimension = 3
    const checks = [
      () => this.horizontalCheck(squares, dimension),
      () => this.verticalCheck(squares, dimension),
      //() => this.horizontalCheck(squares, dimension),
    ]
    for (const check of checks) {
      const winner = check()
      if (winner)
        return winner
    }
    return null
  }

  horizontalCheck(squares, dimension) {
    for (var i = 0; i < dimension; i++) {
      var streak = true;
      var index = i*dimension
      var prevChar = squares[index]
      const limit = index + dimension
      while (index < limit && streak) {
        const currChar = squares[index++]
        streak = (prevChar === currChar) && currChar != null
      }
      if (streak) {
        return prevChar
      }
    }
    return null
  }

  verticalCheck(squares, dimension) {
    for (var i = 0; i < dimension; i++) {
      var streak = true;
      var index = i
      var prevChar = squares[index]
      const limit = dimension * dimension
      while (index < limit && streak) {
        const currChar = squares[index]
        streak = (prevChar === currChar) && currChar != null
        index += dimension
      }
      if (streak) {
        return prevChar
      }
    }
    return null
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.turns + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice()
    if (this.calcWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.nextPlayer
    const nextPlayer = this.state.nextPlayer === 'X' ? 'O' : 'X'
    this.setState({
      nextPlayer: nextPlayer,
      turns: this.state.turns + 1,
      history: history.concat([{
        squares: squares
      }])
    })
  }

  jumpTo(step) {
    this.setState({
      turns: step,
      nextPlayer: (step % 2) === 0 ? 'O':'X' ,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.turns];
    const winner = this.calcWinner(current.squares);


    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + this.state.nextPlayer
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
