export interface GameObject {
  update: () => void;
  render: () => void;
  x: number;
  y: number;
}
