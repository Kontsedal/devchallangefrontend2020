import { Component } from './component';
import { Simulation } from '../simulation/simulation';

type State = {};
export class App extends Component<State> {
  private selectors = {};

  private simulation: Simulation;

  constructor() {
    super();
    this.state = {};
    this.simulation = new Simulation();
  }

  async init() {
    this.attachEventListeners();
    this.render();
    await this.simulation.init();
    this.simulation.update();
    this.simulation.render();
  }

  attachEventListeners() {
    window.addEventListener('resize', () => {
      this.simulation.render();
    });
  }

  render() {}
}
