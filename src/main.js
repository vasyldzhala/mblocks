import Game from './js/game';
import GameOverModal from './js/game-over-modal';
import Http from './js/http';

const game = new Game();

const http = new Http();
http.loadAllResults();
document.addEventListener('resultsAreLoaded', event => {
  console.log(event.detail);
});
http.loadAllUsers();
document.addEventListener('usersAreLoaded', event => {
  console.log(event.detail);
});

document.addEventListener('gameIsOver', (event) => {
  gameOverHundler(event.detail);
});

document.querySelector('#new-game-button').addEventListener('click', (event) => {
  event.preventDefault();
  startNewGame();
});

const startNewGame = () => {
    game.startNewGame();
};

const gameOverHundler = (results) => {
  const message = GameOverModal.parseResults(results);

  const modal = new GameOverModal({content: message});
  modal.init();

  document.querySelector('.confirm-btn').addEventListener('click', (event) => {
    event.preventDefault();
    startNewGame();
    modal.closeModal(modal.modalEl);
  });
};


