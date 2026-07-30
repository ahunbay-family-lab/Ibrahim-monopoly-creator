"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group, MeshStandardMaterial } from "three";
import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import type { DragonSpinHandle } from "@/lib/dragons/drag";
import { DRAGON_MODEL_PATH } from "@/lib/dragons/model";

/** Radians per second the dragon spins on its own when nobody is dragging it. */
const AUTO_ROTATE_SPEED = 0.5;
/** Radians the dragon turns for every pixel the pointer drags horizontally. */
const DRAG_SENSITIVITY = 0.01;

type DragonModelProps = {
  dragon: DragonCharacter;
};

function applyTribeColors(scene: THREE.Object3D, dragon: DragonCharacter) {
  const primary = new THREE.Color(dragon.colors.primary);
  const accent = new THREE.Color(dragon.colors.accent);

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];

    child.material = materials.map((material) => {
      const next = material.clone() as MeshStandardMaterial;

      if (next.map) {
        next.map.colorSpace = THREE.SRGBColorSpace;
        next.color.set("#ffffff");
      } else if ("color" in next) {
        next.color.copy(primary);
      }

      if ("emissive" in next) {
        if (dragon.traits.hasBioluminescence || dragon.traits.hasStarryWings) {
          next.emissive.copy(accent);
          next.emissiveIntensity = 0.4;
        }
      }

      if ("metalness" in next) {
        next.metalness = dragon.id === "icewing" ? 0.35 : 0.1;
      }

      if ("roughness" in next) {
        next.roughness = 0.5;
      }

      next.side = THREE.DoubleSide;
      next.needsUpdate = true;
      return next;
    });

    if (!Array.isArray(child.material)) {
      child.material = child.material[0];
    }

    child.castShadow = true;
    child.receiveShadow = true;
  });
}

function normalizeModel(scene: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 0) {
    const scale = 2.8 / maxDim;
    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }
}

/** Renders the tribe-colored dragon and exposes drag controls so a parent can spin it. */
export const DragonModel = forwardRef<DragonSpinHandle, DragonModelProps>(
  function DragonModel({ dragon }, spinHandleRef) {
    const groupRef = useRef<Group>(null);
    const isDraggingRef = useRef(false);
    const { scene } = useGLTF(DRAGON_MODEL_PATH);

    const model = useMemo(() => {
      const clone = scene.clone(true);
      applyTribeColors(clone, dragon);
      normalizeModel(clone);
      return clone;
    }, [scene, dragon]);

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

useGLTF.preload(DRAGON_MODEL_PATH);
