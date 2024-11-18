import Reel from "./Reel.js";
import Symbol from "./Symbol.js";

export default class Slot {
  constructor(domElement, config = {}) {
    Symbol.preload();

    this.currentSymbols = [
      ["one", "two", "three"],
      ["three", "two", "one"],
      ["one", "three", "seven"],
      ["three", "two", "one"],
      ["seven", "three", "two"],
    ];

    this.nextSymbols = [
      ["one", "two", "three"],
      ["three", "two", "one"],
      ["one", "three", "seven"],
      ["seven", "two", "one"],
      ["one", "three", "two"],

    ];

    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName("reel")).map(
      (reelContainer, idx) =>
        new Reel(reelContainer, idx, this.currentSymbols[idx])
    );

    this.spinButton = document.getElementById("spin");
    this.spinButton.addEventListener("click", () => this.spin());

    this.autoPlayCheckbox = document.getElementById("autoplay");

    if (config.inverted) {
      this.container.classList.add("inverted");
    }

    this.config = config;
  }

  spin() {
    // Simbol tetap untuk kemenangan
    const fixedWinningCombination = [
      ["one", "two", "two"],
      ["two", "two", "two"],
      ["nine", "nine", "two"],
      ["seven", "nine", "seven"],
      ["nine", "seven", "nine"],
    ];

    // Tetapkan kombinasi berikutnya ke simbol tetap
    this.currentSymbols = this.nextSymbols;

    // Gunakan fixedWinningCombination sebagai hasil tetap
    this.nextSymbols = fixedWinningCombination;

    // Panggil logika spin
    this.onSpinStart(this.nextSymbols);

    return Promise.all(
      this.reels.map((reel) => {
        reel.renderSymbols(this.nextSymbols[reel.idx]); // Render simbol tetap
        return reel.spin();
      })
    ).then(() => this.onSpinEnd(this.nextSymbols));
  }


  onSpinStart(symbols) {
    this.spinButton.disabled = true;

    this.config.onSpinStart?.(symbols);
  }

  onSpinEnd(symbols) {
    this.spinButton.disabled = false;

    this.config.onSpinEnd?.(symbols);

    if (this.autoPlayCheckbox.checked) {
      return window.setTimeout(() => this.spin(), 200);
    }
  }
}

