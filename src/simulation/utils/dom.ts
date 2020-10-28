import { Position } from '../interfaces/position';

type NewPosition = Position & { xDiff: number; yDiff: number };
export const onMove = (
  target: HTMLElement | void,
  onDrag: (newPosition: NewPosition) => void
) => {
  if (!target) {
    return;
  }
  target.addEventListener('mousedown', (event) => {
    const initialX = event.clientX;
    const initialY = event.clientY;
    let xDiff = 0;
    let yDiff = 0;
    const moveHandler = (moveEvent: MouseEvent) => {
      xDiff = moveEvent.clientX - initialX;
      yDiff = moveEvent.clientY - initialY;
      if (typeof onDrag === 'function') {
        onDrag({ x: initialX + xDiff, y: initialY + yDiff, xDiff, yDiff });
      }
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', function handleUp() {
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mousemove', moveHandler);
    });
  });
};
