import { useRef, useState } from 'react';

export function useDragAndDrop<T>() {
  const draggedItem = useRef<T | null>(null);
  const [dragging, setDragging] = useState(false);
  const touchTimeout = useRef<number | null>(null);

  const onTouchStart = (item: T) => () => {
    touchTimeout.current = window.setTimeout(() => {
      draggedItem.current = item;
      setDragging(true);
    }, 200);
  };

  const onTouchEnd = (cb: (item: T) => void) => () => {
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
    }
    if (dragging && draggedItem.current) {
      cb(draggedItem.current);
    }
    setDragging(false);
    draggedItem.current = null;
  };

  const onTouchCancel = () => {
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
    }
    setDragging(false);
    draggedItem.current = null;
  };

  return {
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    isDragging: dragging,
  };
}
