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
  difficulty,
  skipTurn,
  playerSkipped,
  thinking
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
      if (gameMode === 'ai') {
        if (thinking) {
          const thinkingClass = difficulty === 'hell' ? 'thinking-hell' : 'thinking';
          return (
            <div className={`game-message ${thinkingClass}`}>
              {difficulty === 'hell' 
                ? '強大的AI正在深度思考（白棋）...' 
                : '電腦思考中（白棋）...'}
            </div>
          );
        } else {
          return <div className="game-message">電腦準備落子（白棋）</div>;
        }
      } else {
        return <div className="game-message">輪到白方落子</div>;
      }
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
      if (gameMode === 'ai') {
        const aiLabel = difficulty === 'hell' ? '地獄級AI' : '電腦';
        
        return (
          <div className="game-result">
            遊戲結束！
            <span className={`winner ${winner}`}>
              {winner === BLACK ? '您（黑方）' : `${aiLabel}（白方）`}
            </span>
            獲勝！
            {winner === WHITE && difficulty === 'hell' && (
              <div className="hell-win-message">不要氣餒，這可是地獄級AI！</div>
            )}
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
    }
  };

  // 顯示對戰模式
  const getModeDisplay = () => {
    let modeText = gameMode === 'ai' ? '單人對戰電腦' : '雙人對戰';
    
    if (gameMode === 'ai') {
      let difficultyLabel = '';
      switch (difficulty) {
        case 'easy':
          difficultyLabel = '簡單';
          break;
        case 'medium':
          difficultyLabel = '中等';
          break;
        case 'hard':
          difficultyLabel = '困難';
          break;
        case 'hell':
          difficultyLabel = '地獄級';
          break;
        default:
          difficultyLabel = '中等';
      }
      
      modeText += ` [${difficultyLabel}]`;
    }
    
    return (
      <div className={`game-mode-display ${difficulty === 'hell' ? 'hell-mode' : ''}`}>
        {modeText}
      </div>
    );
  };

  return (
    <div className="game-info">
      {getModeDisplay()}
      
      <div className="player-status">
        <div className="player">
          <div className="player-info">
            <div className="player-piece black"></div>
            <span className="player-count">{blackCount}</span>
          </div>
          <span className="player-label">{gameMode === 'ai' ? '玩家' : '黑方'}</span>
          {currentPlayer === BLACK && !isGameOver && (
            <div className="current-player black">當前</div>
          )}
        </div>
        
        <div className="player">
          <div className="player-info">
            <div className="player-piece white"></div>
            <span className="player-count">{whiteCount}</span>
          </div>
          <span className="player-label">
            {gameMode === 'ai' 
              ? (difficulty === 'hell' ? '地獄級AI' : '電腦') 
              : '白方'}
          </span>
          {currentPlayer === WHITE && !isGameOver && (
            <div className={`current-player white ${difficulty === 'hell' && thinking ? 'hell-thinking' : ''}`}>
              {thinking && difficulty === 'hell' ? '深度思考中' : '當前'}
            </div>
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