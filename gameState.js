export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.timeRemaining = 60;
    this.matchedCount = 0;
    this.correctAnswers = {};
  }
}
