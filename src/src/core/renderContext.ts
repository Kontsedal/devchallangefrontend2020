export class RenderContext {
  private readonly element: HTMLCanvasElement;

  private readonly context: CanvasRenderingContext2D;

  private readonly canvasWidth: number;

  private readonly canvasHeight: number;

  private offsetX: number = 0;

  constructor(selector: string) {
    this.element = document.querySelector(selector) as HTMLCanvasElement;
    this.context = this.element.getContext('2d') as CanvasRenderingContext2D;
    this.canvasWidth = this.element.clientWidth;
    this.canvasHeight = this.element.clientHeight;
  }

  getContext() {
    return this.context;
  }

  getY(originalY: number): number {
    return this.canvasHeight - originalY;
  }

  getX(originalX: number): number {
    return originalX - this.offsetX;
  }

  clear() {
    this.getContext().clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  getWidth() {
    return this.canvasWidth;
  }

  setOffsetX(offset: number) {
    this.offsetX = offset;
  }
}