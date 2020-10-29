import { Component } from './component';
import { Simulation } from '../simulation/simulation';
import { CONFIG } from '../config';
import { EnhancedDomElement, enhanceDom } from '../utils/dom';
import { denormalizeAngle, getOnePointAngle } from '../utils/math';

type State = {
  rocketPosition: {
    x: number;
    y: number;
  };
  running: boolean;
  rocketAngle: number;
  rocketInitialAngle: number;
  rocketSpeed: number;
  cameraXOffset: number;
  simulationSpeed: number;
  rocketInOppositeDirection: boolean;
};

const SELECTORS = {
  arrow: '.js-arrow',
  mover: '.js-mover',
  startButton: '.js-start',
  pauseButton: '.js-pause',
  container: '.js-root',
  arrowHead: '.js-arrow-head',
  speedIndicator: '.js-speed-indicator',
  angleIndicator: '.js-angle-indicator',
  distanceIndicator: '.js-distance-indicator',
  speedInput: '.js-speed-input',
} as const;

export class App extends Component<State> {
  private elements: Record<
    keyof typeof SELECTORS | string,
    EnhancedDomElement
  > = {};

  private simulation: Simulation;

  private updateIntervalId: number | undefined;

  constructor() {
    super();
    this.simulation = new Simulation();
    this.state = {
      rocketPosition: this.simulation.getRocketPosition(),
      rocketAngle: this.simulation.getRocketAngle(),
      rocketInitialAngle: this.simulation.getRocketInitialAngle(),
      rocketSpeed: this.simulation.getRocketSpeed(),
      simulationSpeed: this.simulation.getSimulationSpeed(),
      cameraXOffset: this.simulation.getCameraXOffset(),
      running: false,
    };
  }

  refreshData() {
    this.setState({
      rocketPosition: this.simulation.getRocketPosition(),
      rocketAngle: this.simulation.getRocketAngle(),
      rocketInitialAngle: this.simulation.getRocketInitialAngle(),
      cameraXOffset: this.simulation.getCameraXOffset(),
      rocketSpeed: this.simulation.getRocketSpeed(),
      simulationSpeed: this.simulation.getSimulationSpeed(),
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
      this.elements[name] = enhanceDom(selector);
    });

    window.addEventListener('resize', () => {
      this.simulation.render();
      this.refreshData();
    });
    this.elements.startButton.on('click', this.handleStart.bind(this));
    this.elements.pauseButton.on('click', this.handlePause.bind(this));
    this.elements.speedInput.on(
      'change',
      this.handleSimulationSpeedChange.bind(this)
    );
    this.elements.mover.onMove(this.handleRocketMove.bind(this));
    this.elements.arrowHead.onMove(this.handleSpeedChange.bind(this));
  }

  handleSimulationSpeedChange(event: Event) {
    let newSpeed = Number((event.target as HTMLInputElement).value);
    if (newSpeed > CONFIG.ROCKET.MAX_SIMULATION_SPEED) {
      newSpeed = CONFIG.ROCKET.MAX_SIMULATION_SPEED;
    }
    if (newSpeed < CONFIG.ROCKET.MIN_SIMULATION_SPEED) {
      newSpeed = CONFIG.ROCKET.MIN_SIMULATION_SPEED;
    }
    this.setState({
      simulationSpeed: newSpeed,
    });
    this.simulation.setSimulationSpeed(newSpeed);
  }

  handleStart() {
    this.simulation.start();
    this.setState({
      running: true,
    });
    this.updateIntervalId = (setInterval(
      this.refreshData.bind(this),
      CONFIG.VIEW_REFRESH_SPEED_MS
    ) as unknown) as number;
  }

  handlePause() {
    this.simulation.stop();
    this.setState({
      running: false,
    });
    clearInterval(this.updateIntervalId);
    this.refreshData();
  }

  handleRocketMove(newPosition: {
    x: number;
    y: number;
    xDiff: number;
    yDiff: number;
  }) {
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
    let newY = position.y;
    const minX = CONFIG.ROCKET.WIDTH / 2 + CONFIG.ROCKET.INITIAL_X;
    const maxY = window.innerHeight + CONFIG.CAMERA.INITIAL_Y;
    if (position.x < minX) {
      newX = minX;
    }
    if (position.y > maxY) {
      newY = maxY;
    }
    return { x: newX, y: newY };
  }

  render() {
    this.effect(
      () => {
        this.elements.arrow.css({
          left: this.state.rocketPosition.x,
          top: this.state.rocketPosition.y,
        });
        this.elements.mover.css({
          left: this.state.rocketPosition.x,
          top: this.state.rocketPosition.y,
          width: CONFIG.ROCKET.WIDTH,
          height: CONFIG.ROCKET.HEIGHT,
        });
      },
      ['rocketPosition'],
      !this.state.running
    );

    this.effect(() => {
      this.elements.container.classNames({
        running: this.state.running,
        'root--loading': false,
      });
    }, ['running']);

    this.effect(
      () => {
        this.elements.arrow.css({
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
      },
      [
        'rocketAngle',
        'rocketInOppositeDirection',
        'rocketSpeed',
        'rocketInitialAngle',
      ],
      !this.state.running
    );

    this.effect(() => {
      this.elements.speedIndicator.element.innerText = this.state.rocketSpeed.toFixed(
        0
      );
    }, ['rocketSpeed']);

    this.effect(() => {
      const angle = denormalizeAngle(
        denormalizeAngle(this.state.rocketAngle, this.state.rocketInitialAngle)
      );
      this.elements.angleIndicator.element.innerText = angle.toFixed(0);
    }, ['rocketAngle']);

    this.effect(() => {
      this.elements.distanceIndicator.element.innerText = (
        this.state.rocketPosition.x -
        CONFIG.ROCKET.INITIAL_X -
        this.state.cameraXOffset
      ).toFixed(0);
    }, ['rocketPosition.x', 'cameraXOffset']);

    (this.elements.speedInput.element as HTMLInputElement).value = String(
      this.state.simulationSpeed
    );
  }
}
