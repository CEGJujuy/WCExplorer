const gameData = [
  { country: 'Francia', capital: 'París' },
  { country: 'Alemania', capital: 'Berlín' },
  { country: 'Italia', capital: 'Roma' },
  { country: 'España', capital: 'Madrid' },
  { country: 'Portugal', capital: 'Lisboa' },
  { country: 'Reino Unido', capital: 'Londres' },
  { country: 'Grecia', capital: 'Atenas' },
  { country: 'Países Bajos', capital: 'Ámsterdam' },
  { country: 'Bélgica', capital: 'Bruselas' },
  { country: 'Austria', capital: 'Viena' },
  { country: 'Suiza', capital: 'Berna' },
  { country: 'Polonia', capital: 'Varsovia' },
  { country: 'Suecia', capital: 'Estocolmo' },
  { country: 'Noruega', capital: 'Oslo' },
  { country: 'Dinamarca', capital: 'Copenhague' }
];

const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let draggedElement = null;
let score = 0;
let timeRemaining = 60;
let matchedCount = 0;
let correctAnswers = {};
let timerInterval = null;

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

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initializeGame() {
  console.log('Iniciando juego...');

  score = 0;
  timeRemaining = 60;
  matchedCount = 0;
  correctAnswers = {};

  clearInterval(timerInterval);

  const selectedPairs = shuffleArray(gameData).slice(0, 10);
  console.log('Pares seleccionados:', selectedPairs);

  selectedPairs.forEach(pair => {
    correctAnswers[pair.country] = pair.capital;
  });

  elements.countriesList.innerHTML = '';
  elements.capitalsList.innerHTML = '';

  const shuffledCountries = shuffleArray(selectedPairs.map(p => p.country));
  const shuffledCapitals = shuffleArray(selectedPairs.map(p => p.capital));

  console.log('Creando países...');
  shuffledCountries.forEach((country, index) => {
    const countryDiv = document.createElement('div');
    countryDiv.className = 'country-item';
    countryDiv.textContent = country;
    countryDiv.draggable = true;
    countryDiv.dataset.country = country;

    countryDiv.addEventListener('dragstart', function(e) {
      console.log('Arrastrando:', country);
      draggedElement = this;
      this.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', country);
    });

    countryDiv.addEventListener('dragend', function() {
      this.classList.remove('dragging');
    });

    elements.countriesList.appendChild(countryDiv);
    console.log(`País ${index + 1} añadido:`, country);
  });

  console.log('Creando capitales...');
  shuffledCapitals.forEach((capital, index) => {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.textContent = capital;
    dropZone.dataset.capital = capital;

    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!this.classList.contains('correct')) {
        this.classList.add('drag-over');
      }
    });

    dropZone.addEventListener('dragleave', function() {
      this.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      console.log('Soltado en:', capital);
      this.classList.remove('drag-over');

      if (!draggedElement || this.classList.contains('correct')) {
        return;
      }

      const countryName = draggedElement.dataset.country;
      const capitalName = this.dataset.capital;

      console.log('Verificando:', countryName, 'con', capitalName);
      handleDrop(countryName, capitalName, this);
    });

    elements.capitalsList.appendChild(dropZone);
    console.log(`Capital ${index + 1} añadida:`, capital);
  });

  console.log('Países en pantalla:', elements.countriesList.children.length);
  console.log('Capitales en pantalla:', elements.capitalsList.children.length);

  updateDisplay();
  startTimer();
}

function handleDrop(countryName, capitalName, dropZone) {
  const correctCapital = correctAnswers[countryName];
  console.log('Esperado:', correctCapital, 'Recibido:', capitalName);

  if (correctCapital === capitalName) {
    console.log('¡CORRECTO!');
    score += 10;
    matchedCount++;
    dropZone.classList.add('correct');
    dropZone.innerHTML = countryName;

    setTimeout(() => {
      const countryItem = Array.from(elements.countriesList.children).find(
        item => item.dataset.country === countryName
      );
      if (countryItem) {
        countryItem.style.transition = 'all 0.3s ease';
        countryItem.style.opacity = '0';
        setTimeout(() => countryItem.remove(), 300);
      }
    }, 500);

    if (matchedCount === Object.keys(correctAnswers).length) {
      setTimeout(() => endGame(), 1000);
    }
  } else {
    console.log('¡INCORRECTO!');
    score = Math.max(0, score - 2);
    dropZone.classList.add('incorrect');
    dropZone.innerHTML = countryName;

    setTimeout(() => {
      dropZone.classList.remove('incorrect');
      dropZone.innerHTML = capitalName;
    }, 500);
  }

  updateDisplay();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateDisplay();

    if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

function updateDisplay() {
  elements.score.textContent = score;
  elements.timer.textContent = timeRemaining;
}

function endGame() {
  console.log('Juego terminado. Puntuación final:', score);
  clearInterval(timerInterval);
  elements.finalScore.textContent = score;
  elements.timeBonus.textContent = timeRemaining;
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

  console.log('Enviando puntuación:', name, score, timeRemaining);

  try {
    const { error } = await supabase
      .from('leaderboard')
      .insert([
        {
          player_name: name,
          score: score,
          time_remaining: timeRemaining
        }
      ]);

    if (error) {
      console.error('Error al enviar puntuación:', error);
      alert('Error al enviar la puntuación. Por favor intenta de nuevo.');
      return;
    }

    console.log('Puntuación enviada correctamente');
    elements.playerName.value = '';
    await showLeaderboard(name);
  } catch (err) {
    console.error('Error:', err);
    alert('Error al enviar la puntuación. Por favor intenta de nuevo.');
  }
}

async function showLeaderboard(currentPlayerName = null) {
  console.log('Mostrando tabla de posiciones...');
  elements.gameOverScreen.classList.add('hidden');
  elements.gameScreen.classList.add('hidden');
  elements.leaderboardScreen.classList.remove('hidden');

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .order('time_remaining', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error al cargar tabla:', error);
      elements.leaderboardList.innerHTML = '<p>Error al cargar la tabla de posiciones.</p>';
      return;
    }

    if (!data || data.length === 0) {
      elements.leaderboardList.innerHTML = '<p>¡Aún no hay puntuaciones! ¡Sé el primero en jugar!</p>';
      return;
    }

    console.log('Datos de tabla:', data);

    elements.leaderboardList.innerHTML = data
      .map((entry, index) => {
        const isCurrentPlayer = currentPlayerName &&
          entry.player_name === currentPlayerName &&
          index < 10;

        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;

        return `
          <div class="leaderboard-item ${isCurrentPlayer ? 'current-player' : ''}">
            <div class="leaderboard-rank">${medal}</div>
            <div class="leaderboard-name">${escapeHtml(entry.player_name)}</div>
            <div class="leaderboard-score">${entry.score} pts</div>
            <div class="leaderboard-time">${entry.time_remaining}s</div>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    console.error('Error:', err);
    elements.leaderboardList.innerHTML = '<p>Error al cargar la tabla de posiciones.</p>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

console.log('Aplicación cargada. Iniciando juego...');
initializeGame();
