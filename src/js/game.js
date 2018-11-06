import {cards} from "./cards";

export default class Game {

  constructor(params) {
    this.startNewGame(params);
  };

  startNewGame(params) {
    this.defaultParams = {
      cardsNumber: 15,
      playersNumber: 1,
      gameContainer: document.querySelector('#game-container'),
      stateBarContainer: document.querySelector('#state-bar')
    };
    this.params = Object.assign(this.defaultParams, params);
    this.init();
    this.params.gameContainer.addEventListener('click', e => {
      e.preventDefault();
      this.clickCardHundler(e);
    });
  };

  clickCardHundler({target}) {

    if (target.hasAttribute('data-code') && !target.classList.contains('show')) {
      const getCardCode = (ind) => {
        return this.state.openCards[ind].dataset.code;
      };
      switch(this.state.stage)  {
        case 0:
          target.classList.toggle('show');
          target.dataset.ischecked = true;
          this.setTimer();
          this.state.openCards.push(target);
          this.state.flipped++;
          this.state.stage = 2;

          break;
        case 1:
          this.state.openCards.forEach(el => el.classList.toggle('show'));
          target.classList.toggle('show');
          this.state.openCards = [];
          this.state.openCards.push(target);
          this.state.flipped++;
          this.state.stage = 2;
          break;
        case 2:
          target.classList.toggle('show');
          this.state.openCards.push(target);
          this.state.flipped++;
          this.state.stage = 1;
          if (getCardCode(0) === getCardCode(1)) {
            this.state.openCards.forEach(el => el.classList.add('close'));
            this.state.score--;
            if (this.state.score <= 0 ) {
              console.log('gameOver');
              this.gameOver();
            }
          }
          break;

      }
      this.showState();
    }
  }

  init() {
    this.state = {
      stage: 0,     // 0 - init game, 1 - first flip, 2 - second flip
      score: this.params.cardsNumber,   // unclosed cards' number
      flipped: 0,  // flips number
      openCards: [],
      timeEl: this.params.stateBarContainer.querySelector('.time'),
      scoreEl: this.params.stateBarContainer.querySelector('.score'),
      flippedEl: this.params.stateBarContainer.querySelector('.flipped')
    };
    this.state.timeEl.innerHTML = `Time: 0 sec`;
    this.showState();
    this.dealCards();
  }

  showState() {
    this.state.scoreEl.innerHTML = `${this.state.score * 2} / ${this.params.cardsNumber * 2}`;
    this.state.flippedEl.innerHTML = `Flipped: ${this.state.flipped}`;
  }

  setTimer() {
    this.state.startTime = Date.now();
    const showSeconds = () => {
      const seconds = ((Date.now() - this.state.startTime) * 1e-3).toFixed();
      if (!isNaN(parseFloat(seconds)) && isFinite(seconds)) {
        this.state.timeEl.innerHTML = `Time: ${seconds} sec`;
      }
    };
    this.state.timer = setInterval(showSeconds, 1000);
  }

  stopTimer() {
    this.state.endTime = Date.now();
    clearInterval(this.state.timer);
    this.state.timeEl.innerHTML = `Time: 0 sec`;
  }

  gameOver() {
    this.stopTimer();
    const gameIsOverEvent = new CustomEvent('gameIsOver', {
      bubbles: true,
      detail: this.state
    });
    document.dispatchEvent(gameIsOverEvent);
  }

  dealCards() {
    const { gameContainer } = this.params;
    let cardsMixed = cards.slice(0, this.params.cardsNumber);
    cardsMixed = cardsMixed
      .concat(cardsMixed)
      .sort((x, y) => Math.random() - 0.5);

    let gameTemplate = ``;

    for (let i = 0; i < cardsMixed.length; i++) {
      gameTemplate += `
      <div class="card">
        <button data-code="${cardsMixed[i]}" data-ischecked="false">
          <i class="fas">&#x${cardsMixed[i]};</i>
        </button>
      </div>      
      `;
    }
    gameContainer.innerHTML = gameTemplate;
  }

};
