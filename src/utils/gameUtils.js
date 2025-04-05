/**
 * 黑白棋遊戲邏輯工具函數
 */

// 棋盤大小
export const BOARD_SIZE = 8;

// 棋子顏色
export const EMPTY = null;
export const BLACK = 'black';
export const WHITE = 'white';

// 方向數組：上、右上、右、右下、下、左下、左、左上
const DIRECTIONS = [
  { row: -1, col: 0 },  // 上
  { row: -1, col: 1 },  // 右上
  { row: 0, col: 1 },   // 右
  { row: 1, col: 1 },   // 右下
  { row: 1, col: 0 },   // 下
  { row: 1, col: -1 },  // 左下
  { row: 0, col: -1 },  // 左
  { row: -1, col: -1 }  // 左上
];

/**
 * 初始化棋盤
 * @returns {Array} 初始化的棋盤
 */
export function initializeBoard() {
  // 創建空棋盤
  const board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
  
  // 設置初始四個棋子
  const mid = Math.floor(BOARD_SIZE / 2);
  board[mid-1][mid-1] = WHITE;
  board[mid-1][mid] = BLACK;
  board[mid][mid-1] = BLACK;
  board[mid][mid] = WHITE;
  
  return board;
}

/**
 * 判斷位置是否在棋盤內
 * @param {number} row - 行
 * @param {number} col - 列
 * @returns {boolean} 是否在棋盤內
 */
function isValidPosition(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/**
 * 獲取對手的棋子顏色
 * @param {string} color - 當前玩家的棋子顏色
 * @returns {string} 對手的棋子顏色
 */
export function getOpponentColor(color) {
  return color === BLACK ? WHITE : BLACK;
}

/**
 * 獲取當前玩家所有可下子的位置
 * @param {Array} board - 當前棋盤
 * @param {string} currentPlayer - 當前玩家
 * @returns {Array} 可下子的位置數組 [{row, col}, ...]
 */
export function getValidMoves(board, currentPlayer) {
  const validMoves = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, row, col, currentPlayer)) {
        validMoves.push({ row, col });
      }
    }
  }
  
  return validMoves;
}

/**
 * 判斷某個位置是否可以下子
 * @param {Array} board - 當前棋盤
 * @param {number} row - 行
 * @param {number} col - 列
 * @param {string} currentPlayer - 當前玩家
 * @returns {boolean} 是否可以下子
 */
export function isValidMove(board, row, col, currentPlayer) {
  // 位置必須是空的
  if (board[row][col] !== EMPTY) {
    return false;
  }
  
  const opponent = getOpponentColor(currentPlayer);
  
  // 檢查所有方向
  for (const dir of DIRECTIONS) {
    let r = row + dir.row;
    let c = col + dir.col;
    
    // 確保第一步是對手的棋子
    if (!isValidPosition(r, c) || board[r][c] !== opponent) {
      continue;
    }
    
    // 繼續在該方向前進
    r += dir.row;
    c += dir.col;
    
    // 尋找自己的棋子
    while (isValidPosition(r, c)) {
      if (board[r][c] === EMPTY) {
        break;
      }
      
      if (board[r][c] === currentPlayer) {
        // 找到自己的棋子，說明這個方向可以形成夾擊
        return true;
      }
      
      // 繼續在該方向前進
      r += dir.row;
      c += dir.col;
    }
  }
  
  return false;
}

/**
 * 下子並翻轉被夾的對手棋子
 * @param {Array} board - 當前棋盤
 * @param {number} row - 行
 * @param {number} col - 列
 * @param {string} currentPlayer - 當前玩家
 * @returns {Array} 新的棋盤
 */
export function makeMove(board, row, col, currentPlayer) {
  // 深拷貝棋盤
  const newBoard = board.map(row => [...row]);
  
  // 如果不是有效的落子位置，返回原棋盤
  if (!isValidMove(board, row, col, currentPlayer)) {
    return board;
  }
  
  // 放置棋子
  newBoard[row][col] = currentPlayer;
  
  const opponent = getOpponentColor(currentPlayer);
  
  // 檢查所有方向並翻轉棋子
  for (const dir of DIRECTIONS) {
    const flips = [];
    let r = row + dir.row;
    let c = col + dir.col;
    
    // 確保第一步是對手的棋子
    if (!isValidPosition(r, c) || newBoard[r][c] !== opponent) {
      continue;
    }
    
    // 記錄可能需要翻轉的棋子
    flips.push({ row: r, col: c });
    
    // 繼續在該方向前進
    r += dir.row;
    c += dir.col;
    
    // 尋找自己的棋子
    while (isValidPosition(r, c)) {
      if (newBoard[r][c] === EMPTY) {
        // 遇到空位，這個方向不需要翻轉
        flips.length = 0;
        break;
      }
      
      if (newBoard[r][c] === currentPlayer) {
        // 找到自己的棋子，翻轉中間所有對手的棋子
        for (const flip of flips) {
          newBoard[flip.row][flip.col] = currentPlayer;
        }
        break;
      }
      
      // 記錄可能需要翻轉的棋子
      flips.push({ row: r, col: c });
      
      // 繼續在該方向前進
      r += dir.row;
      c += dir.col;
    }
  }
  
  return newBoard;
}

/**
 * 計算棋盤上各顏色棋子的數量
 * @param {Array} board - 當前棋盤
 * @returns {Object} 各顏色棋子數量 {black: number, white: number}
 */
export function countPieces(board) {
  let black = 0;
  let white = 0;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === BLACK) {
        black++;
      } else if (board[row][col] === WHITE) {
        white++;
      }
    }
  }
  
  return { black, white };
}

/**
 * 判斷遊戲是否結束
 * @param {Array} board - 當前棋盤
 * @returns {boolean} 遊戲是否結束
 */
export function isGameOver(board) {
  // 如果黑白雙方都無法下子，遊戲結束
  return getValidMoves(board, BLACK).length === 0 && 
         getValidMoves(board, WHITE).length === 0;
}

/**
 * 獲取遊戲結果
 * @param {Array} board - 當前棋盤
 * @returns {string} 遊戲結果：黑勝、白勝或平局
 */
export function getGameResult(board) {
  const { black, white } = countPieces(board);
  
  if (black > white) {
    return BLACK;
  } else if (white > black) {
    return WHITE;
  } else {
    return 'tie';
  }
}

/**
 * 簡單AI：隨機選擇一個有效的落子位置
 * @param {Array} board - 當前棋盤
 * @param {string} aiColor - AI的棋子顏色
 * @returns {Object|null} 選擇的落子位置 {row, col} 或者 null（無法下子）
 */
export function getAIMoveEasy(board, aiColor) {
  const validMoves = getValidMoves(board, aiColor);
  
  if (validMoves.length === 0) {
    return null;
  }
  
  // 隨機選擇一個有效位置
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex];
}

/**
 * 中等AI：優先選擇角落和邊緣位置
 * @param {Array} board - 當前棋盤
 * @param {string} aiColor - AI的棋子顏色
 * @returns {Object|null} 選擇的落子位置 {row, col} 或者 null（無法下子）
 */
export function getAIMoveMedium(board, aiColor) {
  const validMoves = getValidMoves(board, aiColor);
  
  if (validMoves.length === 0) {
    return null;
  }
  
  // 優先級：角落 > 邊緣 > 其他
  const corners = validMoves.filter(move => 
    (move.row === 0 || move.row === BOARD_SIZE - 1) && 
    (move.col === 0 || move.col === BOARD_SIZE - 1)
  );
  
  if (corners.length > 0) {
    const randomIndex = Math.floor(Math.random() * corners.length);
    return corners[randomIndex];
  }
  
  const edges = validMoves.filter(move => 
    move.row === 0 || move.row === BOARD_SIZE - 1 || 
    move.col === 0 || move.col === BOARD_SIZE - 1
  );
  
  if (edges.length > 0) {
    const randomIndex = Math.floor(Math.random() * edges.length);
    return edges[randomIndex];
  }
  
  // 如果沒有角落和邊緣，隨機選擇
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex];
}

/**
 * 困難AI：評估每個可能的落子位置，選擇能夠翻轉最多對手棋子的位置
 * @param {Array} board - 當前棋盤
 * @param {string} aiColor - AI的棋子顏色
 * @returns {Object|null} 選擇的落子位置 {row, col} 或者 null（無法下子）
 */
export function getAIMoveHard(board, aiColor) {
  const validMoves = getValidMoves(board, aiColor);
  
  if (validMoves.length === 0) {
    return null;
  }
  
  let bestMove = null;
  let maxFlips = -1;
  
  for (const move of validMoves) {
    const newBoard = makeMove(board, move.row, move.col, aiColor);
    const { black, white } = countPieces(newBoard);
    const flips = aiColor === BLACK ? black : white;
    
    // 優先考慮角落位置
    let score = flips;
    if ((move.row === 0 || move.row === BOARD_SIZE - 1) && 
        (move.col === 0 || move.col === BOARD_SIZE - 1)) {
      score += 100; // 角落權重
    } else if (move.row === 0 || move.row === BOARD_SIZE - 1 || 
               move.col === 0 || move.col === BOARD_SIZE - 1) {
      score += 10;  // 邊緣權重
    }
    
    if (score > maxFlips) {
      maxFlips = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

/**
 * 簡單的局面評估函數
 * @param {Array} board - 當前棋盤
 * @param {string} playerColor - 玩家顏色
 * @returns {number} 局面得分
 */
export function evaluateBoard(board, playerColor) {
  const { black, white } = countPieces(board);
  return playerColor === BLACK ? black - white : white - black;
}
