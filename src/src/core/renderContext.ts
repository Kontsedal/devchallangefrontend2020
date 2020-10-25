export class RenderContext {
  private readonly element: HTMLCanvasElement;

  private readonly context: CanvasRenderingContext2D;

  private canvasWidth: number;

  private canvasHeight: number;

  public offsetX: number = 0;

  private offsetY: number = 0;

  constructor(selector: string) {
    this.element = document.querySelector(selector) as HTMLCanvasElement;
    this.context = this.element.getContext('2d') as CanvasRenderingContext2D;
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
    this.canvasWidth = this.element.clientWidth;
    this.canvasHeight = this.element.clientHeight;

    window.addEventListener('resize', () => {
      this.element.width = window.innerWidth;
      this.element.height = window.innerHeight;
      this.canvasWidth = this.element.clientWidth;
      this.canvasHeight = this.element.clientHeight;
    });
  }

  getContext() {
    return this.context;
  }

  getCurrentY(originalY: number): number {
    return this.canvasHeight - originalY + this.offsetY;
  }

  getCurrentX(originalX: number): number {
    return originalX + this.offsetX;
  }

  clear() {
    this.getContext().clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  getWidth() {
    return this.canvasWidth;
  }

  getHeight() {
    return this.canvasHeight;
  }

  setOffsetX(offset: number) {
    this.offsetX = offset;
  }

  setOffsetY(offset: number) {
    this.offsetY = offset;
  }
}
