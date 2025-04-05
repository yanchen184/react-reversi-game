import React from 'react';
import './GameInfo.css';
import { BLACK, WHITE } from '../utils/gameUtils';

const GameInfo = ({ 
  currentPlayer, 
  blackCount, 
  whiteCount, 
  isGameOver, 
  winner, 
  gameMode,
  skipTurn,
  playerSkipped
}) => {
  // 返回遊戲狀態信息
  const getGameMessage = () => {
    if (isGameOver) {
      return null;
    }
    
    if (playerSkipped) {
      return (
        <div className="game-message">
          沒有可以落子的位置，輪到對方。
        </div>
      );
    }
    
    if (currentPlayer === BLACK) {
      return gameMode === 'ai' ? 
        <div className="game-message">輪到您落子（黑棋）</div> : 
        <div className="game-message">輪到黑方落子</div>;
    } else {
      return gameMode === 'ai' ? 
        <div className="game-message">電腦思考中（白棋）...</div> : 
        <div className="game-message">輪到白方落子</div>;
    }
  };
  
  // 返回遊戲結果信息
  const getGameResult = () => {
    if (!isGameOver) {
      return null;
    }
    
    if (winner === 'tie') {
      return (
        <div className="game-result">
          遊戲結束！雙方平局！
        </div>
      );
    } else {
      return (
        <div className="game-result">
          遊戲結束！
          <span className={`winner ${winner}`}>
            {winner === BLACK ? '黑方' : '白方'}
          </span>
          獲勝！
        </div>
      );
    }
  };

  return (
    <div className="game-info">
      <div className="player-status">
        <div className="player">
          <div className="player-info">
            <div className="player-piece black"></div>
            <span className="player-count">{blackCount}</span>
          </div>
          <span className="player-label">黑方</span>
          {currentPlayer === BLACK && !isGameOver && (
            <div className="current-player black">當前</div>
          )}
        </div>
        
        <div className="player">
          <div className="player-info">
            <div className="player-piece white"></div>
            <span className="player-count">{whiteCount}</span>
          </div>
          <span className="player-label">白方</span>
          {currentPlayer === WHITE && !isGameOver && (
            <div className="current-player white">當前</div>
          )}
        </div>
      </div>
      
      {getGameMessage()}
      {getGameResult()}
      
      {currentPlayer && !isGameOver && skipTurn && (
        <button 
          className="skip-button"
          onClick={skipTurn}
        >
          無法落子，跳過回合
        </button>
      )}
    </div>
  );
};

export default GameInfo;