import React, { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import '../Components/ChessGame.css'; 

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveLog, setMoveLog] = useState([]);
  const [winner, setWinner] = useState(null); 

  const onDrop = useCallback((sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move) {
        const updatedGame = new Chess(game.fen());
        setGame(updatedGame);

        const moveNotation = `${updatedGame.turn() === 'w' ? 'Black' : 'White'}: ${move.san}`;
        setMoveLog((prev) => [...prev, moveNotation]);

        if (updatedGame.isGameOver() && updatedGame.isCheckmate()) {
          setWinner(updatedGame.turn() === 'w' ? 'Black' : 'White');
        }

        return true;
      }
    } catch {
      return false;
    }

    return false;
  }, [game]);

  const resetGame = () => {
    setGame(new Chess());
    setMoveLog([]);
    setWinner(null);
  };

  const getGameStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        return `${winner} wins by checkmate!`;
      }
      if (game.isDraw()) return 'Draw!';
      if (game.isStalemate()) return 'Stalemate!';
      return 'Game Over!';
    }
    if (game.inCheck()) return `${game.turn() === 'w' ? 'White' : 'Black'} is in check!`;
    return `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
  };

  return (
    <div className="container">
      {winner && (
        <div className="winner-overlay">
          <h1 className="winner-text">{winner} Wins!</h1>
          <button className="play-again-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      <div className="board-area">
        <div className="status">{getGameStatus()}</div>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#779952' }}
          customLightSquareStyle={{ backgroundColor: '#edeed1' }}
        />
        <button onClick={resetGame} className="reset-button">
          New Game
        </button>
      </div>

      <div className="move-log">
        <h2>Move History</h2>
        <div className="move-list">
          {moveLog.length > 0 ? (
            moveLog.map((move, index) => (
              <div key={index} className="move-item">
                {`${Math.floor(index / 2) + 1}. ${move}`}
              </div>
            ))
          ) : (
            <div className="no-moves">No moves yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
