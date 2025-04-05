import React from 'react';
import Cell from './Cell';
import './Board.css';
import { BOARD_SIZE } from '../utils/gameUtils';

const Board = ({ board, validMoves, onCellClick }) => {
  // 將有效移動轉換為映射，以便更快地查找
  const validMovesMap = validMoves.reduce((map, move) => {
    const key = `${move.row}-${move.col}`;
    map[key] = true;
    return map;
  }, {});

  // 檢查是否是有效的移動
  const isValidMove = (row, col) => {
    const key = `${row}-${col}`;
    return validMovesMap[key] || false;
  };

  // 生成棋盤座標標籤
  const renderCoordinates = () => {
    const letters = Array.from({ length: BOARD_SIZE }, (_, i) => 
      String.fromCharCode('A'.charCodeAt(0) + i)
    );
    
    const numbers = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1);
    
    return (
      <>
        <div className="board-coordinates">
          <div className="board-coordinates-letters">
            {letters.map((letter, i) => (
              <span key={letter}>{letter}</span>
            ))}
          </div>
        </div>
        
        <div className="board-container">
          <div className="board-coordinates-numbers">
            {numbers.map((number) => (
              <span key={number}>{number}</span>
            ))}
          </div>
          
          <div className="board">
            {board.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <Cell 
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  isValidMove={isValidMove(rowIndex, colIndex)}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                />
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  return renderCoordinates();
};

export default Board;