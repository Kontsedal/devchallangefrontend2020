import { Component } from './component';
import { Simulation } from '../simulation/simulation';
import { CONFIG } from '../config';
import { onMove } from '../simulation/utils/dom';

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
    START_BUTTON: '.js-start',
  };

  private simulation: Simulation;

  private arrowElement: HTMLElement | undefined;

  private moverElement: HTMLElement | undefined;

  private startButtonElement: HTMLElement | undefined;

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

    this.startButtonElement = document.querySelector(
      this.selectors.START_BUTTON
    ) as HTMLElement;

    window.addEventListener('resize', () => {
      this.simulation.render();
    });

    this.startButtonElement.addEventListener('click', () => {
      this.simulation.start();
    });
    onMove({
      target: this.moverElement,
      initialPosition: this.state.rocketPosition,
      callback: (newPosition) => {
        this.setState({
          ...this.state,
          rocketPosition: newPosition,
        });
        this.simulation.setRocketPosition(newPosition);
        this.simulation.render();
      },
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
        width: CONFIG.ROCKET.WIDTH,
        height: CONFIG.ROCKET.HEIGHT,
      });
    }, ['rocketPosition']);
  }
}
