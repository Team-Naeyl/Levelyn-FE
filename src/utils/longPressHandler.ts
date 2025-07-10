type LongPressHandlerProp<T = void> = (payload: T) => void;

export function longPressHandler<T = void>(onLongPress: LongPressHandlerProp<T>, payload: T, ms = 200) {
  let timer: number | null = null;

  const onStart = () => {
    timer = window.setTimeout(() => {
      onLongPress(payload);
    }, ms);
  };

  const onClear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    onTouchStart: onStart,
    onTouchEnd: onClear,
    onTouchCancel: onClear,
  };
}
