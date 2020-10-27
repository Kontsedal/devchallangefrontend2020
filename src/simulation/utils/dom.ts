type Position = { x: number; y: number };
export const onMove = ({
  target,
  onDrag,
  onDrop,
}: {
  target: HTMLElement | void;
  onDrag: (newPosition: Position) => void;
  onDrop: (newPosition: Position) => void;
  initialPosition: Position;
}) => {
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
      onDrag({ x: initialX + xDiff, y: initialY + yDiff });
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', function handleUp() {
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mousemove', moveHandler);
      onDrop({ x: initialX + xDiff, y: initialY + yDiff });
    });
  });
};
