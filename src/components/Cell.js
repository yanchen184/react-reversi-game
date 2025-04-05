import React, { useState, useEffect } from 'react';
import './Cell.css';

const Cell = ({ value, isValidMove, onClick }) => {
  const [animate, setAnimate] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  // 檢測棋子顏色變化，並添加翻轉動畫
  useEffect(() => {
    if (prevValue !== value && prevValue !== null && value !== null) {
      setAnimate(true);
      
      // 動畫結束後移除動畫類
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    setPrevValue(value);
  }, [value, prevValue]);

  // 根據棋子值決定類名
  const getPieceClassName = () => {
    if (!value) return '';
    return `piece ${value} ${animate ? 'animated' : ''}`;
  };

  return (
    <div 
      className={`cell ${isValidMove ? 'valid-move' : ''}`}
      onClick={onClick}
    >
      {value && <div className={getPieceClassName()}></div>}
    </div>
  );
};

export default Cell;