"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import type { DragonSpinHandle } from "@/lib/dragons/drag";
import { buildDragonBody } from "@/lib/dragons/buildDragonBody";
import { fitToView } from "@/lib/dragons/geometryHelpers";

/** Radians per second the dragon spins on its own when nobody is dragging it. */
const AUTO_ROTATE_SPEED = 0.5;
/** Radians the dragon turns for every pixel the pointer drags horizontally. */
const DRAG_SENSITIVITY = 0.01;

type DragonModelProps = {
  dragon: DragonCharacter;
};

/** Builds the tribe-shaped dragon and exposes drag controls so a parent can spin it. */
export const DragonModel = forwardRef<DragonSpinHandle, DragonModelProps>(
  function DragonModel({ dragon }, spinHandleRef) {
    const groupRef = useRef<Group>(null);
    const isDraggingRef = useRef(false);

    const model = useMemo(() => {
      const body = buildDragonBody(dragon);
      fitToView(body);
      return body;
    }, [dragon]);

    useImperativeHandle(
      spinHandleRef,
      () => ({
        beginDrag() {
          isDraggingRef.current = true;
        },
        applyDrag(deltaX: number) {
          if (groupRef.current) {
            groupRef.current.rotation.y += deltaX * DRAG_SENSITIVITY;
          }
        },
        endDrag() {
          isDraggingRef.current = false;
        },
      }),
      [],
    );

    useFrame((_, delta) => {
      if (groupRef.current && !isDraggingRef.current) {
        groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;
      }
    });

    return (
      <group ref={groupRef} rotation={[0, Math.PI / 5, 0]}>
        <primitive object={model} />
      </group>
    );
  },
);
