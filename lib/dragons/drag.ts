/**
 * Imperative controls a canvas uses to spin the dragon model — from a mouse/touch
 * drag (pixel deltas) or from a single key press (a fixed nudge in radians).
 */
export type DragonSpinHandle = {
  beginDrag: () => void;
  /** Rotate based on how far the pointer moved this frame, in pixels. */
  applyDrag: (deltaX: number, deltaY: number) => void;
  endDrag: () => void;
  /** Rotate by a fixed amount, in radians — used for arrow-key control. */
  nudge: (deltaYaw: number, deltaPitch: number) => void;
};
