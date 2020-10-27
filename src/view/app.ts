import { Component } from './component';
import { Simulation } from '../simulation/simulation';
import { CONFIG } from '../config';
import { onMove } from '../simulation/utils/dom';

type State = {
  rocketPosition: {
    x: number;
    y: number;
  };
  running: boolean;
};

const SELECTORS = {
  ARROW: '.js-arrow',
  MOVER: '.js-mover',
  START_BUTTON: '.js-start',
  PAUSE_BUTTON: '.js-pause',
  CONTAINER: '.js-root',
} as const;

export class App extends Component<State> {
  private elements: Record<keyof typeof SELECTORS | string, HTMLElement> = {};

  private simulation: Simulation;

  constructor() {
    super();
    this.simulation = new Simulation();
    this.state = {
      rocketPosition: this.simulation.getRocketPosition(),
      running: false,
    };
  }

  refreshData() {
    this.setState({
      ...this.state,
      rocketPosition: this.simulation.getRocketPosition(),
    });
  }

  async init() {
    this.attachEventListeners();
    await this.simulation.init();
    this.simulation.render();
    this.render();
  }

  attachEventListeners() {
    Object.entries(SELECTORS).forEach(([name, selector]) => {
      this.elements[name] = document.querySelector(selector) as HTMLElement;
    });

    window.addEventListener('resize', () => {
      this.simulation.render();
    });
    this.elements.START_BUTTON.addEventListener('click', () => {
      this.simulation.start();
      this.setState({
        ...this.state,
        running: true,
      });
    });
    this.elements.PAUSE_BUTTON.addEventListener('click', () => {
      this.simulation.stop();
      this.setState({
        ...this.state,
        running: false,
      });
      this.refreshData();
    });
    onMove({
      target: this.elements.MOVER,
      initialPosition: this.state.rocketPosition,
      onDrag: (newPosition) => {
        this.setState({
          ...this.state,
          rocketPosition: this.normalizeMovePosition(newPosition),
        });
      },
      onDrop: (newPosition) => {
        this.simulation.setRocketPosition(
          this.normalizeMovePosition(newPosition)
        );
        this.simulation.render();
        this.refreshData();
      },
    });
  }

  normalizeMovePosition(position: { x: number; y: number }) {
    let newX = position.x;
    const newY = position.y;
    const minX = CONFIG.ROCKET.WIDTH / 2 + CONFIG.ROCKET.INITIAL_X;
    if (position.x < minX) {
      newX = minX;
    }
    return { x: newX, y: newY };
  }

  render() {
    this.effect(() => {
      this.setStyles(this.elements.ARROW, {
        left: this.state.rocketPosition.x,
        top: this.state.rocketPosition.y,
      });
      this.setStyles(this.elements.MOVER, {
        left: this.state.rocketPosition.x,
        top: this.state.rocketPosition.y,
        width: CONFIG.ROCKET.WIDTH,
        height: CONFIG.ROCKET.HEIGHT,
      });
    }, ['rocketPosition']);

    this.effect(() => {
      if (this.state.running) {
        this.elements.CONTAINER.classList.add('running');
      } else {
        this.elements.CONTAINER.classList.remove('running');
      }
    }, ['running']);
  }
}
