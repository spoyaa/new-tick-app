import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';

import './index.css';
import './App.css';


function Tick() {
// Action Types
  const SQUARE_CLICK = 'SQUARE_CLICK';
  const JUMP_TO = 'JUMP_TO';

// Action Creators
  const squareClick = (index) => ({
    type: SQUARE_CLICK,
    payload: {
      index,
    },
  });

  const jumpTo = (step) => ({
    type: JUMP_TO,
    payload: {
      step,
    },
  });

// Reducer
  const initialState = {
    history: [
      {
        squares: Array(9).fill(null),
      },
    ],
    stepNumber: 0,
    xIsNext: true,
  };

  const ticTacToeReducer = (state = initialState, action) => {
    switch (action.type) {
      case SQUARE_CLICK:
        const {index} = action.payload;
        const newHistory = state.history.slice(0, state.stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[index]) {
          return state;
        }
        squares[index] = state.xIsNext ? 'X' : 'O';
        return {
          ...state,
          history: newHistory.concat([{squares}]),
          stepNumber: newHistory.length,
          xIsNext: !state.xIsNext,
        };
      case JUMP_TO:
        const {step} = action.payload;
        return {
          ...state,
          stepNumber: step,
          xIsNext: step % 2 === 0,
        };
      default:
        return state;
    }
  };

// Store
  const store = createStore(ticTacToeReducer);

// Components
  function Square({value, onClick}) {
    return (
        <button className="square" onClick={onClick}>
          {value}
        </button>
    );
  }

  function Board({squares, onClick}) {
    const renderSquare = (i) => {
      return <Square value={squares[i]} onClick={() => onClick(i)}/>;
    };

    return (
        <div>
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
    );
  }

  function Game({history, stepNumber, xIsNext, squareClick, jumpTo}) {
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Ход #' + move : 'Начать сначала';
      return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{desc}</button>
          </li>
      );
    });

    let status;
    if (winner) {
      status = 'Победитель: ' + winner + '!';
    } else {
      status = 'Следующий игрок: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => squareClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
    );
  }

// Redux Connect
  const mapStateToProps = (state) => ({
    history: state.history,
    stepNumber: state.stepNumber,
    xIsNext: state.xIsNext,
  });

  const mapDispatchToProps = (dispatch) => ({
    squareClick: (index) => dispatch(squareClick(index)),
    jumpTo: (step) => dispatch(jumpTo(step)),
  });

  const ConnectedGame = connect(mapStateToProps, mapDispatchToProps)(Game);

// Render
  ReactDOM.render(
      <Provider store={store}>
        <ConnectedGame/>
      </Provider>,
      document.getElementById('root')
  );

// Helper Function
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
}

export default Tick;