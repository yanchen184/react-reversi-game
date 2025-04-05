import React from 'react';
import './Controls.css';

const Controls = ({ 
  onRestart, 
  onGameModeChange,
  onDifficultyChange,
  gameMode,
  difficulty,
  isGameOver
}) => {
  return (
    <div className="controls">
      <div className="controls-row">
        <div className="control-group">
          <label className="control-option-label">遊戲模式</label>
          <select 
            className="control-select"
            value={gameMode}
            onChange={(e) => onGameModeChange(e.target.value)}
          >
            <option value="pvp">雙人對戰</option>
            <option value="ai">單人對戰電腦</option>
          </select>
        </div>
        
        {gameMode === 'ai' && (
          <div className="control-group">
            <label className="control-option-label">電腦難度</label>
            <select 
              className="control-select"
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <option value="easy">簡單</option>
              <option value="medium">中等</option>
              <option value="hard">困難</option>
              <option value="hell" className="hell-option">地獄模式</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="controls-row">
        <button 
          className="game-button primary-button"
          onClick={onRestart}
        >
          {isGameOver ? '新遊戲' : '重新開始'}
        </button>
      </div>
      
      {difficulty === 'hell' && (
        <div className="hell-mode-warning">
          ⚠️ 地獄模式：使用Minimax算法和高級評估，非常強大！
        </div>
      )}
    </div>
  );
};

export default Controls;