/** Imperative controls a canvas uses to make a dragon model spin as you drag it. */
export type DragonSpinHandle = {
  beginDrag: () => void;
  applyDrag: (deltaX: number) => void;
  endDrag: () => void;
};
