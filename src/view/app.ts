import { Component } from './component';
import { Simulation } from '../simulation/simulation';
import { CONFIG } from '../config';

type State = {
  rocketPosition: {
    x: number;
    y: number;
  };
};
export class App extends Component<State> {
  private selectors = {
    ARROW: '.js-arrow',
    MOVER: '.js-mover',
  };

  private simulation: Simulation;

  private arrowElement: HTMLElement | undefined;

  private moverElement: HTMLElement | undefined;

  constructor() {
    super();
    this.simulation = new Simulation();
    this.state = {
      rocketPosition: this.simulation.getRocketPosition(),
    };
  }

  async init() {
    this.attachEventListeners();
    await this.simulation.init();
    this.simulation.render();
    this.render();
  }

  attachEventListeners() {
    this.arrowElement = document.querySelector(
      this.selectors.ARROW
    ) as HTMLElement;

    this.moverElement = document.querySelector(
      this.selectors.MOVER
    ) as HTMLElement;
    window.addEventListener('resize', () => {
      this.simulation.render();
    });
  }

  render() {
    this.effect(() => {
      this.setStyles(this.arrowElement, {
        left: this.state.rocketPosition.x,
        top: this.state.rocketPosition.y,
      });
      this.setStyles(this.moverElement, {
        left: this.state.rocketPosition.x,
        top: this.state.rocketPosition.y,
      });
    }, ['rocketPosition']);
  }
}
