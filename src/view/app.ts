import { Component } from './component';
import { Simulation } from '../simulation/simulation';
import { CONFIG } from '../config';
import { onMove } from '../simulation/utils/dom';
import { denormalizeAngle, getOnePointAngle } from '../simulation/utils/math';

type State = {
  rocketPosition: {
    x: number;
    y: number;
  };
  running: boolean;
  rocketAngle: number;
  rocketInitialAngle: number;
  rocketSpeed: number;
  rocketInOppositeDirection: boolean;
};

const SELECTORS = {
  arrow: '.js-arrow',
  mover: '.js-mover',
  startButton: '.js-start',
  pauseButton: '.js-pause',
  container: '.js-root',
  arrowHead: '.js-arrow-head',
} as const;

export class App extends Component<State> {
  private elements: Record<keyof typeof SELECTORS | string, HTMLElement> = {};

  private simulation: Simulation;

  constructor() {
    super();
    this.simulation = new Simulation();
    this.state = {
      rocketPosition: this.simulation.getRocketPosition(),
      rocketAngle: this.simulation.getRocketAngle(),
      rocketInitialAngle: this.simulation.getRocketInitialAngle(),
      rocketSpeed: this.simulation.getRocketSpeed(),
      running: false,
    };
  }

  refreshData() {
    this.setState({
      rocketPosition: this.simulation.getRocketPosition(),
      rocketAngle: this.simulation.getRocketAngle(),
      rocketInitialAngle: this.simulation.getRocketInitialAngle(),
      rocketSpeed: this.simulation.getRocketSpeed(),
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
      this.refreshData();
    });
    this.elements.startButton.addEventListener('click', () => {
      this.simulation.start();
      this.setState({
        running: true,
      });
    });
    this.elements.pauseButton.addEventListener('click', () => {
      this.simulation.stop();
      this.setState({
        running: false,
      });
      this.refreshData();
    });
    onMove(this.elements.mover, this.handleRocketMove.bind(this));
    onMove(this.elements.arrowHead, this.handleSpeedChange.bind(this));
  }

  handleRocketMove(newPosition: { x: number; y: number }) {
    this.simulation.setRocketPosition(this.normalizeMovePosition(newPosition));
    this.simulation.render();
    this.refreshData();
  }

  handleSpeedChange(newPosition: {
    x: number;
    y: number;
    xDiff: number;
    yDiff: number;
  }) {
    const distance = Math.sqrt(
      (newPosition.x - this.state.rocketPosition.x) ** 2 +
        (newPosition.y - this.state.rocketPosition.y) ** 2
    );
    let newSpeed =
      (distance / CONFIG.MOVE_ARROW.MAX_HEIGHT) * CONFIG.MOVE_ARROW.MAX_SPEED;
    if (newSpeed < CONFIG.MOVE_ARROW.MIN_SPEED) {
      newSpeed = CONFIG.MOVE_ARROW.MIN_SPEED;
    }
    if (newSpeed > CONFIG.MOVE_ARROW.MAX_SPEED) {
      newSpeed = CONFIG.MOVE_ARROW.MAX_SPEED;
    }
    const newAngle = getOnePointAngle(this.state.rocketPosition, newPosition);
    this.setState({
      rocketSpeed: newSpeed,
      rocketAngle: newAngle,
      rocketInitialAngle: newAngle,
    });
    this.simulation.setRocketSpeed(newSpeed);
    this.simulation.setRocketAngle(newAngle);
    this.simulation.render();
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
      this.setStyles(this.elements.arrow, {
        left: this.state.rocketPosition.x,
        top: this.state.rocketPosition.y,
      });
      this.setStyles(this.elements.mover, {
        left: this.state.rocketPosition.x,
        top: this.state.rocketPosition.y,
        width: CONFIG.ROCKET.WIDTH,
        height: CONFIG.ROCKET.HEIGHT,
      });
    }, ['rocketPosition']);

    this.effect(() => {
      if (this.state.running) {
        this.elements.container.classList.add('running');
      } else {
        this.elements.container.classList.remove('running');
      }
    }, ['running']);

    this.effect(() => {
      this.setStyles(this.elements.arrow, {
        height:
          CONFIG.MOVE_ARROW.MIN_HEIGHT +
          ((CONFIG.MOVE_ARROW.MAX_HEIGHT - CONFIG.MOVE_ARROW.MIN_HEIGHT) /
            CONFIG.MOVE_ARROW.MAX_SPEED) *
            this.state.rocketSpeed,
        transform: `translateY(-100%) rotate(${denormalizeAngle(
          this.state.rocketAngle,
          this.state.rocketInitialAngle
        )}deg)`,
      });
    }, [
      'rocketAngle',
      'rocketInOppositeDirection',
      'rocketSpeed',
      'rocketInitialAngle',
    ]);
  }
}
