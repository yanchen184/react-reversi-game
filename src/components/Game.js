import React, { useState, useEffect } from 'react';
import Board from './Board';
import GameInfo from './GameInfo';
import Controls from './Controls';
import './Game.css';
import { 
  initializeBoard, 
  getValidMoves, 
  makeMove, 
  countPieces, 
  BLACK, 
  WHITE, 
  isGameOver, 
  getGameResult,
  getAIMoveEasy,
  getAIMoveMedium,
  getAIMoveHard,
  getAIMoveHell
} from '../utils/gameUtils';

const Game = () => {
  // 遊戲狀態
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState(BLACK); // 黑方先手
  const [validMoves, setValidMoves] = useState([]);
  const [isOver, setIsOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [pieces, setPieces] = useState({ black: 2, white: 2 }); // 初始棋子數量
  const [gameMode, setGameMode] = useState('ai'); // 默認為 AI 模式
  const [difficulty, setDifficulty] = useState('medium'); // 默認中等難度
  const [playerSkipped, setPlayerSkipped] = useState(false);
  const [thinking, setThinking] = useState(false); // 增加一個狀態標記 AI 是否在思考

  // 初始化遊戲
  useEffect(() => {
    startNewGame();
  }, []);

  // 在當前玩家變更時更新有效的移動位置
  useEffect(() => {
    if (isOver) return;
    
    const moves = getValidMoves(board, currentPlayer);
    setValidMoves(moves);
    
    // 檢查是否無法移動
    if (moves.length === 0) {
      handleNoValidMoves();
    }
    
    // 如果是AI模式且輪到AI（白方）
    if (gameMode === 'ai' && currentPlayer === WHITE && !isOver) {
      // 延遲一下，讓玩家能夠看到棋盤變化
      setThinking(true); // 設置思考狀態為 true
      
      // 對於地獄模式，給予更長的延遲，讓玩家感受到它的"思考"
      const delay = difficulty === 'hell' ? 1000 : 500;
      
      const timer = setTimeout(() => {
        makeAIMove();
        setThinking(false); // AI 移動完成後設置思考狀態為 false
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, isOver, gameMode, difficulty]);

  // 檢查遊戲結束條件
  useEffect(() => {
    if (isGameOver(board)) {
      const result = getGameResult(board);
      setIsOver(true);
      setWinner(result);
    }
  }, [board]);

  // 統計棋子數量
  useEffect(() => {
    const counts = countPieces(board);
    setPieces(counts);
  }, [board]);

  // 處理無有效移動的情況
  const handleNoValidMoves = () => {
    // 檢查對手是否也無法移動
    const opponent = currentPlayer === BLACK ? WHITE : BLACK;
    const opponentMoves = getValidMoves(board, opponent);
    
    if (opponentMoves.length === 0) {
      // 雙方都無法移動，遊戲結束
      setIsOver(true);
      setWinner(getGameResult(board));
    } else {
      // 當前玩家無法移動，自動跳到對方回合
      setPlayerSkipped(true);
      const timer = setTimeout(() => {
        setCurrentPlayer(opponent);
        setPlayerSkipped(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  };

  // 處理玩家落子
  const handleCellClick = (row, col) => {
    // 如果AI正在思考，遊戲結束或者不是有效的移動位置，則不做任何處理
    if (thinking || isOver || !validMoves.some(move => move.row === row && move.col === col)) {
      return;
    }
    
    // 落子並更新棋盤
    const newBoard = makeMove(board, row, col, currentPlayer);
    setBoard(newBoard);
    
    // 切換到對方回合
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
  };

  // AI落子
  const makeAIMove = () => {
    let move;
    
    // 根據難度選擇不同的AI策略
    switch (difficulty) {
      case 'easy':
        move = getAIMoveEasy(board, WHITE);
        break;
      case 'medium':
        move = getAIMoveMedium(board, WHITE);
        break;
      case 'hard':
        move = getAIMoveHard(board, WHITE);
        break;
      case 'hell':
        move = getAIMoveHell(board, WHITE);
        break;
      default:
        move = getAIMoveMedium(board, WHITE);
    }
    
    if (move) {
      // AI落子並更新棋盤
      const newBoard = makeMove(board, move.row, move.col, WHITE);
      setBoard(newBoard);
      
      // 切換回玩家回合
      setCurrentPlayer(BLACK);
    } else {
      // AI無法移動，切換回玩家回合
      setCurrentPlayer(BLACK);
    }
  };

  // 手動跳過回合
  const skipTurn = () => {
    if (validMoves.length === 0 && !isOver && !thinking) {
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    }
  };

  // 重新開始遊戲
  const startNewGame = () => {
    setBoard(initializeBoard());
    setCurrentPlayer(BLACK);
    setIsOver(false);
    setWinner(null);
    setPlayerSkipped(false);
    setThinking(false);
  };

  // 切換遊戲模式
  const handleGameModeChange = (mode) => {
    setGameMode(mode);
    startNewGame();
  };

  // 切換AI難度
  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    startNewGame();
  };

  return (
    <div className="game">
      <GameInfo 
        currentPlayer={currentPlayer}
        blackCount={pieces.black}
        whiteCount={pieces.white}
        isGameOver={isOver}
        winner={winner}
        gameMode={gameMode}
        difficulty={difficulty}
        skipTurn={validMoves.length === 0 && !isOver && !thinking ? skipTurn : null}
        playerSkipped={playerSkipped}
        thinking={thinking}
      />
      
      <Board 
        board={board}
        validMoves={validMoves}
        onCellClick={handleCellClick}
      />
      
      <Controls 
        onRestart={startNewGame}
        onGameModeChange={handleGameModeChange}
        onDifficultyChange={handleDifficultyChange}
        gameMode={gameMode}
        difficulty={difficulty}
        isGameOver={isOver}
      />
    </div>
  );
};

export default Game;