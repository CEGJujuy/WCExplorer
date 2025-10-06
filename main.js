import { createClient } from '@supabase/supabase-js';
import { gameData } from './gameData.js';
import { GameState } from './gameState.js';
import { LeaderboardManager } from './leaderboardManager.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const gameState = new GameState();
const leaderboardManager = new LeaderboardManager(supabase);

const elements = {
  score: document.getElementById('score'),
  timer: document.getElementById('timer'),
  countriesList: document.getElementById('countries-list'),
  capitalsList: document.getElementById('capitals-list'),
  gameScreen: document.getElementById('game-screen'),
  gameOverScreen: document.getElementById('game-over-screen'),
  leaderboardScreen: document.getElementById('leaderboard-screen'),
  finalScore: document.getElementById('final-score'),
  timeBonus: document.getElementById('time-bonus'),
  playerName: document.getElementById('player-name'),
  submitScore: document.getElementById('submit-score'),
  playAgain: document.getElementById('play-again'),
  showLeaderboard: document.getElementById('show-leaderboard'),
  backToMenu: document.getElementById('back-to-menu'),
  leaderboardList: document.getElementById('leaderboard-list')
};

let timerInterval;
let draggedElement = null;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initializeGame() {
  gameState.reset();
  clearInterval(timerInterval);

  const selectedPairs = shuffleArray(gameData).slice(0, 10);

  gameState.correctAnswers = {};
  selectedPairs.forEach(pair => {
    gameState.correctAnswers[pair.country] = pair.capital;
  });

  elements.countriesList.innerHTML = '';
  elements.capitalsList.innerHTML = '';

  const shuffledCountries = shuffleArray(selectedPairs.map(p => p.country));
  const shuffledCapitals = shuffleArray(selectedPairs.map(p => p.capital));

  shuffledCountries.forEach(country => {
    const countryDiv = document.createElement('div');
    countryDiv.className = 'country-item';
    countryDiv.textContent = country;
    countryDiv.draggable = true;
    countryDiv.dataset.country = country;

    countryDiv.addEventListener('dragstart', (e) => {
      draggedElement = countryDiv;
      countryDiv.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    countryDiv.addEventListener('dragend', () => {
      countryDiv.classList.remove('dragging');
    });

    elements.countriesList.appendChild(countryDiv);
  });

  shuffledCapitals.forEach(capital => {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.textContent = capital;
    dropZone.dataset.capital = capital;

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!dropZone.classList.contains('correct')) {
        dropZone.classList.add('drag-over');
      }
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      if (!draggedElement || dropZone.classList.contains('correct')) {
        return;
      }

      const countryName = draggedElement.dataset.country;
      const capitalName = dropZone.dataset.capital;

      handleDrop(countryName, capitalName, dropZone);
    });

    elements.capitalsList.appendChild(dropZone);
  });

  updateDisplay();
  startTimer();
}

function handleDrop(countryName, capitalName, dropZone) {
  const correctCapital = gameState.correctAnswers[countryName];

  if (correctCapital === capitalName) {
    gameState.score += 10;
    gameState.matchedCount++;
    dropZone.classList.add('correct');
    dropZone.innerHTML = countryName;

    setTimeout(() => {
      const countryItem = [...elements.countriesList.children].find(
        item => item.dataset.country === countryName
      );
      if (countryItem) {
        countryItem.style.transition = 'all 0.3s ease';
        countryItem.style.opacity = '0';
        setTimeout(() => countryItem.remove(), 300);
      }
    }, 500);

    if (gameState.matchedCount === Object.keys(gameState.correctAnswers).length) {
      endGame();
    }
  } else {
    gameState.score = Math.max(0, gameState.score - 2);
    dropZone.classList.add('incorrect');
    dropZone.innerHTML = countryName;

    setTimeout(() => {
      dropZone.classList.remove('incorrect', 'filled');
      dropZone.innerHTML = capitalName;
    }, 500);
  }

  updateDisplay();
}

function startTimer() {
  timerInterval = setInterval(() => {
    gameState.timeRemaining--;
    updateDisplay();

    if (gameState.timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

function updateDisplay() {
  elements.score.textContent = gameState.score;
  elements.timer.textContent = gameState.timeRemaining;
}

function endGame() {
  clearInterval(timerInterval);
  elements.finalScore.textContent = gameState.score;
  elements.timeBonus.textContent = gameState.timeRemaining;
  elements.gameScreen.classList.add('hidden');
  elements.gameOverScreen.classList.remove('hidden');
}

function resetToGame() {
  elements.gameOverScreen.classList.add('hidden');
  elements.leaderboardScreen.classList.add('hidden');
  elements.gameScreen.classList.remove('hidden');
  initializeGame();
}

function backToMainMenu() {
  elements.gameOverScreen.classList.add('hidden');
  elements.leaderboardScreen.classList.add('hidden');
  elements.gameScreen.classList.remove('hidden');
  initializeGame();
}

async function submitScore() {
  const name = elements.playerName.value.trim();

  if (!name) {
    alert('¡Por favor ingresa tu nombre!');
    return;
  }

  const totalScore = gameState.score;
  await leaderboardManager.submitScore(name, totalScore, gameState.timeRemaining);

  elements.playerName.value = '';
  await showLeaderboard(name);
}

async function showLeaderboard(currentPlayerName = null) {
  elements.gameOverScreen.classList.add('hidden');
  elements.gameScreen.classList.add('hidden');
  elements.leaderboardScreen.classList.remove('hidden');

  await leaderboardManager.displayLeaderboard(elements.leaderboardList, currentPlayerName);
}

elements.submitScore.addEventListener('click', submitScore);
elements.playAgain.addEventListener('click', resetToGame);
elements.showLeaderboard.addEventListener('click', () => showLeaderboard());
elements.backToMenu.addEventListener('click', backToMainMenu);

elements.playerName.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitScore();
  }
});

initializeGame();
