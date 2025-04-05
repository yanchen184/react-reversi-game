import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';

// 遊戲版本
const GAME_VERSION = 'v1.0.0';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">黑白棋</h1>
        <div className="app-version">{GAME_VERSION}</div>
      </header>
      
      <div className="game-container">
        <Game />
      </div>
      
      <footer className="app-footer">
        <p>&copy; 2025 黑白棋遊戲 | <a href="https://github.com/yanchen184/react-reversi-game" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;