# 黑白棋 (React Reversi)
[![Deploy to GitHub Pages](https://github.com/yanchen184/react-reversi-game/actions/workflows/deploy.yml/badge.svg)](https://github.com/yanchen184/react-reversi-game/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yanchen184/react-reversi-game)

一款用React開發的經典黑白棋（奧賽羅）遊戲，支持玩家對戰和AI模式。

## 在線演示

🎮 [黑白棋遊戲](https://yanchen184.github.io/react-reversi-game)

## 遊戲介紹

黑白棋（也稱為奧賽羅或反轉棋）是一款經典的策略棋盤遊戲。

### 遊戲規則

- 遊戲在8x8的棋盤上進行
- 棋子一面白色，一面黑色
- 黑方先行
- 必須下在能夠翻轉對方棋子的位置
- 放置棋子後，夾在新放置的棋子和已有的同色棋子之間的所有對方棋子都會被翻轉
- 如果一方無法下子，則跳過該回合
- 當雙方都無法下子或棋盤填滿時，遊戲結束
- 棋子數量較多的一方獲勝

## 功能特點

- 兩種遊戲模式：玩家對戰和AI對戰
- 不同難度的AI對手
- 顯示當前可行的落子位置
- 實時顯示黑白棋子數量
- 遊戲結束時顯示獲勝方
- 支持遊戲重置
- 響應式設計，適配不同設備

## 技術棧

- React.js
- JavaScript ES6+
- HTML5/CSS3
- GitHub Actions (CI/CD)
- GitHub Pages (部署)

## 本地開發

克隆倉庫：
```
git clone https://github.com/yanchen184/react-reversi-game.git
cd react-reversi-game
```

安裝依賴：
```
npm install
```

啟動開發服務器：
```
npm start
```

構建生產版本：
```
npm run build
```

部署到 GitHub Pages：
```
npm run deploy
```

## 自動部署

本項目使用 GitHub Actions 進行自動部署。每當推送到 main 分支時，將自動構建並部署到 GitHub Pages。

## 許可證

MIT License