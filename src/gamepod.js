class Gamepod {
  constructor() {
    /** @type {any} */
    this.intervalId = 0;
    this.gameloop = () =>
      window.addEventListener("gamepadconnected", () => {
        //this.gameloop = setInterval(() => 0, 50);
      });
  }
}
