"use client";

import { Suspense, useRef, type PointerEvent } from "react";
import { Canvas } from "@react-three/fiber";
import type { DragonCharacter } from "@/lib/dragons/types";
import type { DragonSpinHandle } from "@/lib/dragons/drag";
import { DragonScene } from "@/components/dragons/DragonScene";

type DragonCanvasProps = {
  dragon: DragonCharacter;
  className?: string;
};

export function DragonCanvas({ dragon, className }: DragonCanvasProps) {
  const spinRef = useRef<DragonSpinHandle>(null);
  const isPointerDownRef = useRef(false);
  const lastXRef = useRef(0);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    isPointerDownRef.current = true;
    lastXRef.current = event.clientX;
    spinRef.current?.beginDrag();
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isPointerDownRef.current) return;
    const deltaX = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    spinRef.current?.applyDrag(deltaX);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    isPointerDownRef.current = false;
    spinRef.current?.endDrag();
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      className={`${className ?? ""} touch-none cursor-grab active:cursor-grabbing`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <DragonScene ref={spinRef} dragon={dragon} />
        </Suspense>
      </Canvas>
    </div>
  );
}
