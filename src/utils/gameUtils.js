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
 * 高級的局面評估函數
 * @param {Array} board - 當前棋盤
 * @param {string} playerColor - 玩家顏色
 * @returns {number} 局面得分
 */
export function advancedEvaluateBoard(board, playerColor) {
  const opponent = getOpponentColor(playerColor);
  const { black, white } = countPieces(board);
  const playerPieces = playerColor === BLACK ? black : white;
  const opponentPieces = playerColor === BLACK ? white : black;
  
  // 棋子差異
  const pieceDiff = playerPieces - opponentPieces;
  
  // 移動性（可行動數）
  const playerMobility = getValidMoves(board, playerColor).length;
  const opponentMobility = getValidMoves(board, opponent).length;
  const mobilityScore = playerMobility - opponentMobility;
  
  // 角落控制得分
  let cornerScore = 0;
  const corners = [
    [0, 0], [0, BOARD_SIZE-1], 
    [BOARD_SIZE-1, 0], [BOARD_SIZE-1, BOARD_SIZE-1]
  ];
  
  for (const [row, col] of corners) {
    if (board[row][col] === playerColor) cornerScore += 25;
    else if (board[row][col] === opponent) cornerScore -= 25;
  }
  
  // 穩定性（無法被翻轉的棋子）
  let stabilityScore = 0;
  // 這裡用簡化版：擁有角落的邊緣棋子較穩定
  for (const [cornerRow, cornerCol] of corners) {
    if (board[cornerRow][cornerCol] === playerColor) {
      // 檢查與該角落相鄰的邊緣
      if (cornerRow === 0) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (board[cornerRow][c] === playerColor) stabilityScore += 2;
        }
      }
      if (cornerRow === BOARD_SIZE - 1) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (board[cornerRow][c] === playerColor) stabilityScore += 2;
        }
      }
      if (cornerCol === 0) {
        for (let r = 0; r < BOARD_SIZE; r++) {
          if (board[r][cornerCol] === playerColor) stabilityScore += 2;
        }
      }
      if (cornerCol === BOARD_SIZE - 1) {
        for (let r = 0; r < BOARD_SIZE; r++) {
          if (board[r][cornerCol] === playerColor) stabilityScore += 2;
        }
      }
    }
  }
  
  // 危險位置（角落旁邊的位置，容易讓對方拿到角落）
  let dangerScore = 0;
  const dangerSpots = [
    [0, 1], [1, 0], [1, 1], // 左上角附近
    [0, BOARD_SIZE-2], [1, BOARD_SIZE-2], [1, BOARD_SIZE-1], // 右上角附近
    [BOARD_SIZE-2, 0], [BOARD_SIZE-1, 1], [BOARD_SIZE-2, 1], // 左下角附近
    [BOARD_SIZE-2, BOARD_SIZE-1], [BOARD_SIZE-1, BOARD_SIZE-2], [BOARD_SIZE-2, BOARD_SIZE-2] // 右下角附近
  ];
  
  for (const [row, col] of dangerSpots) {
    // 如果相鄰的角落已經被佔據，則不再是危險位置
    const adjacentCorner = getAdjacentCorner(row, col);
    if (board[adjacentCorner[0]][adjacentCorner[1]] === EMPTY) {
      if (board[row][col] === playerColor) dangerScore -= 10;
      else if (board[row][col] === opponent) dangerScore += 10;
    }
  }
  
  // 綜合評分，各因素權重不同
  const totalPieces = black + white;
  
  // 根據遊戲階段調整權重
  let pieceWeight, mobilityWeight, cornerWeight, stabilityWeight, dangerWeight;
  
  if (totalPieces < 20) {
    // 開局階段：重視移動性和戰略位置
    pieceWeight = 1;
    mobilityWeight = 5;
    cornerWeight = 30;
    stabilityWeight = 1;
    dangerWeight = 15;
  } else if (totalPieces < 40) {
    // 中盤階段：重視角落和穩定性
    pieceWeight = 1;
    mobilityWeight = 3;
    cornerWeight = 25;
    stabilityWeight = 10;
    dangerWeight = 10;
  } else {
    // 終盤階段：重視棋子數量
    pieceWeight = 10;
    mobilityWeight = 1;
    cornerWeight = 15;
    stabilityWeight = 15;
    dangerWeight = 5;
  }
  
  return (
    pieceWeight * pieceDiff +
    mobilityWeight * mobilityScore +
    cornerWeight * cornerScore +
    stabilityWeight * stabilityScore +
    dangerWeight * dangerScore
  );
}

/**
 * 獲取與給定位置相鄰的角落
 * @param {number} row - 行
 * @param {number} col - 列
 * @returns {Array} 角落位置 [row, col]
 */
function getAdjacentCorner(row, col) {
  const cornerRow = row < BOARD_SIZE / 2 ? 0 : BOARD_SIZE - 1;
  const cornerCol = col < BOARD_SIZE / 2 ? 0 : BOARD_SIZE - 1;
  return [cornerRow, cornerCol];
}

/**
 * 使用Minimax算法和Alpha-Beta剪枝尋找最佳走法
 * @param {Array} board - 當前棋盤
 * @param {string} aiColor - AI的棋子顏色
 * @param {number} depth - 搜索深度
 * @returns {Object|null} 最佳落子位置 {row, col} 或者 null（無法下子）
 */
function minimax(board, depth, isMaximizing, alpha, beta, currentPlayer, aiColor) {
  // 如果達到終止條件（遊戲結束或深度限制）
  if (depth === 0 || isGameOver(board)) {
    return advancedEvaluateBoard(board, aiColor);
  }
  
  const validMoves = getValidMoves(board, currentPlayer);
  
  // 如果無子可下，則跳過當前玩家
  if (validMoves.length === 0) {
    return minimax(
      board, 
      depth - 1, 
      !isMaximizing, 
      alpha, 
      beta, 
      getOpponentColor(currentPlayer), 
      aiColor
    );
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move.row, move.col, currentPlayer);
      const eval = minimax(
        newBoard, 
        depth - 1, 
        false, 
        alpha, 
        beta, 
        getOpponentColor(currentPlayer), 
        aiColor
      );
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break; // Beta剪枝
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move.row, move.col, currentPlayer);
      const eval = minimax(
        newBoard, 
        depth - 1, 
        true, 
        alpha, 
        beta, 
        getOpponentColor(currentPlayer), 
        aiColor
      );
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) break; // Alpha剪枝
    }
    return minEval;
  }
}

/**
 * 地獄模式AI：使用Minimax算法和更複雜的評估函數
 * @param {Array} board - 當前棋盤
 * @param {string} aiColor - AI的棋子顏色
 * @returns {Object|null} 選擇的落子位置 {row, col} 或者 null（無法下子）
 */
export function getAIMoveHell(board, aiColor) {
  const validMoves = getValidMoves(board, aiColor);
  
  if (validMoves.length === 0) {
    return null;
  }
  
  let bestMove = null;
  let bestScore = -Infinity;
  
  // 調整搜索深度（根據棋盤上的棋子數量）
  const { black, white } = countPieces(board);
  const totalPieces = black + white;
  let searchDepth;
  
  if (totalPieces < 20) {
    searchDepth = 4; // 開局階段深度較小以提高速度
  } else if (totalPieces < 45) {
    searchDepth = 5; // 中盤可以適當增加深度
  } else {
    searchDepth = 6; // 終盤更深的搜索
  }
  
  // 優化：先評估所有移動並排序，以提高剪枝效率
  const scoredMoves = [];
  for (const move of validMoves) {
    const newBoard = makeMove(board, move.row, move.col, aiColor);
    const score = advancedEvaluateBoard(newBoard, aiColor);
    scoredMoves.push({ move, score });
  }
  
  // 按初步評分排序，優先評估更有希望的移動
  scoredMoves.sort((a, b) => b.score - a.score);
  
  // 對每個可能的移動進行Minimax搜索
  for (const { move } of scoredMoves) {
    const newBoard = makeMove(board, move.row, move.col, aiColor);
    const score = minimax(
      newBoard, 
      searchDepth - 1, 
      false, 
      -Infinity, 
      Infinity, 
      getOpponentColor(aiColor), 
      aiColor
    );
    
    if (score > bestScore) {
      bestScore = score;
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