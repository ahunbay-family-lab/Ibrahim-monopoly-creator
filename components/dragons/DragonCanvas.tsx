"use client";

import { Suspense, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { Canvas } from "@react-three/fiber";
import type { DragonCharacter } from "@/lib/dragons/types";
import type { DragonSpinHandle } from "@/lib/dragons/drag";
import { DragonScene } from "@/components/dragons/DragonScene";

/** Radians an arrow-key press turns the dragon. */
const KEYBOARD_STEP = 0.18;

type DragonCanvasProps = {
  dragon: DragonCharacter;
  className?: string;
};

export function DragonCanvas({ dragon, className }: DragonCanvasProps) {
  const spinRef = useRef<DragonSpinHandle>(null);
  const isPointerDownRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const cameraDistance = dragon.visualEffects?.cameraDistance ?? 3.5;
  const cameraHeight = dragon.modelPath ? 0.45 : 0.8;

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    isPointerDownRef.current = true;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    spinRef.current?.beginDrag();
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isPointerDownRef.current) return;
    const deltaX = event.clientX - lastPointerRef.current.x;
    const deltaY = event.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    spinRef.current?.applyDrag(deltaX, deltaY);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    isPointerDownRef.current = false;
    spinRef.current?.endDrag();
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        spinRef.current?.nudge(-KEYBOARD_STEP, 0);
        break;
      case "ArrowRight":
        event.preventDefault();
        spinRef.current?.nudge(KEYBOARD_STEP, 0);
        break;
      case "ArrowUp":
        event.preventDefault();
        spinRef.current?.nudge(0, -KEYBOARD_STEP);
        break;
      case "ArrowDown":
        event.preventDefault();
        spinRef.current?.nudge(0, KEYBOARD_STEP);
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={`${className ?? ""} touch-none cursor-grab outline-none active:cursor-grabbing`}
      tabIndex={0}
      role="application"
      aria-label={`${dragon.tribe} 3D model — drag, use arrow keys, or swipe to turn it`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <Canvas
        shadows
        camera={{ position: [0, cameraHeight, cameraDistance], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <DragonScene ref={spinRef} dragon={dragon} cameraDistance={cameraDistance} />
        </Suspense>
      </Canvas>
    </div>
  );
}
