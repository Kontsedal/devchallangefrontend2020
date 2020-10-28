import { Position } from '../interfaces/position';

type NewPosition = Position & { xDiff: number; yDiff: number };
export const onMove = ({
  target,
  onDrag,
  onDrop,
  initialPosition,
}: {
  target: HTMLElement | void;
  onDrag?: (newPosition: NewPosition) => void;
  onDrop?: (newPosition: NewPosition) => void;
  initialPosition?: Position;
}) => {
  if (!target) {
    return;
  }
  target.addEventListener('mousedown', (event) => {
    const initialX = event.clientX;
    const initialY = event.clientY;
    let xDiff = 0;
    let yDiff = 0;
    let resultX = 0;
    let resultY = 0;
    const moveHandler = (moveEvent: MouseEvent) => {
      xDiff = moveEvent.clientX - initialX;
      yDiff = moveEvent.clientY - initialY;
      if (typeof onDrag === 'function') {
        resultX = ((initialPosition && initialPosition.x) || initialX) + xDiff;
        resultY = ((initialPosition && initialPosition.y) || initialY) + yDiff;
        onDrag({ x: resultX, y: resultY, xDiff, yDiff });
      }
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', function handleUp() {
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mousemove', moveHandler);
      if (typeof onDrop === 'function') {
        onDrop({ x: resultX, y: resultY, xDiff, yDiff });
      }
    });
  });
};
