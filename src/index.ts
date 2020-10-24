import './index.scss';
import { RenderLoop } from './src/core/renderLoop.ts';
import { GameObject } from './src/interfaces/GameObject.ts';
import { Rocket } from './src/objects/Rocket.ts';
import { RenderContext } from './src/core/renderContext';

export class Simulation {
  private renderLoop: RenderLoop;

  private renderContext: RenderContext;

  private gameObjects: GameObject[] = [];

  constructor() {
    this.renderLoop = new RenderLoop({
      onUpdate: this.update.bind(this),
      onRender: this.render.bind(this),
    });
  }

  start() {
    this.renderContext = new RenderContext('.js-canvas');
    this.gameObjects.push(
      new Rocket({
        x: 0,
        y: 0,
        angle: 45,
        speed: 1,
        context: this.renderContext,
      })
    );
    this.renderLoop.start();
  }

  update() {
    this.gameObjects.forEach((obj) => obj.update());
  }

  render() {
    this.renderContext.clear();
    this.gameObjects.forEach((obj) => obj.render());
  }
}

const simulation = new Simulation();
simulation.start();
