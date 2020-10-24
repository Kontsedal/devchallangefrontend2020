import { GameObject } from '../interfaces/GameObject.ts';
import { RenderContext } from '../core/renderContext';

type Options = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  context: RenderContext;
};
export class Rocket implements GameObject {
  private x: number;

  private y: number;

  private angle: number;

  private speed: number;

  private context: RenderContext;

  constructor(options: Options) {
    this.x = options.x;
    this.y = options.y;
    this.angle = options.angle;
    this.speed = options.speed;
    this.context = options.context;
  }

  update() {
    this.x += this.speed;
    this.y += this.speed;
  }

  render() {
    const canvasContext = this.context.getContext();
    canvasContext.beginPath();
    canvasContext.arc(
      this.context.getX(this.x),
      this.context.getY(this.y),
      10,
      0,
      2 * Math.PI
    );
    canvasContext.stroke();
  }
}
