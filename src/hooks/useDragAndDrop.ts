import { useRef, useState } from 'react';

type DragAndDropResult<T> = {
  onTouchStart: (item: T) => (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: (e: React.TouchEvent) => void;
  isDragging: boolean;
  draggedItem: T | null;
  dragPosition: { x: number; y: number } | null;
  setDropZoneRef: (el: HTMLElement | null) => void;
};

export function useDragAndDrop<T>(onDrop: (item: T) => void): DragAndDropResult<T> {
  const [dragging, setDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const touchTimeout = useRef<number | null>(null);
  const dropZoneRef = useRef<HTMLElement | null>(null);

  const setDropZoneRef = (el: HTMLElement | null) => {
    dropZoneRef.current = el;
  };

  const onTouchStart = (item: T) => (e: React.TouchEvent) => {
    touchTimeout.current = window.setTimeout(() => {
      setDraggedItem(item);
      setDragging(true);
      setDragPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, 200);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (dragging) {
      setDragPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const onTouchEnd = (_e: React.TouchEvent) => {
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
    }

    if (dragging && draggedItem && dragPosition && dropZoneRef.current) {
      const { left, top, right, bottom } = dropZoneRef.current.getBoundingClientRect();
      const { x, y } = dragPosition;
      if (x >= left && x <= right && y >= top && y <= bottom) {
        onDrop(draggedItem);
      }
    }

    setDragging(false);
    setDraggedItem(null);
    setDragPosition(null);
  };

  const onTouchCancel = (_e: React.TouchEvent) => {
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
    }
    setDragging(false);
    setDraggedItem(null);
    setDragPosition(null);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    isDragging: dragging,
    draggedItem,
    dragPosition,
    setDropZoneRef,
  };
}
