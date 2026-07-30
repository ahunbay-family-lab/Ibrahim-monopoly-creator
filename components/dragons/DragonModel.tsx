"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group, MeshStandardMaterial } from "three";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { DragonCharacter } from "@/lib/dragons/types";
import type { DragonSpinHandle } from "@/lib/dragons/drag";
import { DRAGON_MODEL_PATH } from "@/lib/dragons/model";

/** Radians per second the dragon spins on its own when nobody is dragging it. */
const AUTO_ROTATE_SPEED = 0.5;
/** Radians the dragon turns for every pixel the pointer drags horizontally. */
const DRAG_SENSITIVITY = 0.01;
/** Color of the outline drawn around the dragon so it stands out from any background. */
const OUTLINE_COLOR = "#050505";
/** How much bigger the outline is than the dragon itself (a 4.5% halo). */
const OUTLINE_SCALE = 1.045;

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

    const wasArray = Array.isArray(child.material);
    const materials: THREE.Material[] = wasArray
      ? (child.material as THREE.Material[])
      : [child.material as THREE.Material];

    const nextMaterials = materials.map((material) => {
      const next = material.clone() as MeshStandardMaterial;

      // The model's baked-in texture is warm tan/bronze. Multiplying it by a
      // tribe's color would muddy cool colors (a blue tint over a tan texture
      // turns gray-green, not blue), so we drop the texture and use a flat,
      // solid tribe color instead — bold and clearly readable for every tribe,
      // like the artwork you showed me.
      next.map = null;
      if ("color" in next) {
        next.color.copy(primary);
      }

      if ("emissive" in next) {
        if (dragon.traits.hasBioluminescence || dragon.traits.hasStarryWings) {
          next.emissive.copy(accent);
          next.emissiveIntensity = 0.4;
        }
      }

      if ("metalness" in next) {
        // A metallic material only looks good with an environment map to reflect —
        // without one it renders almost black, which is why IceWing used to look
        // gray instead of icy blue. Keeping metalness low lets the tribe color show.
        next.metalness = 0.1;
      }

      if ("roughness" in next) {
        next.roughness = 0.5;
      }

      next.side = THREE.DoubleSide;
      next.needsUpdate = true;
      return next;
    });

    child.material = wasArray ? nextMaterials : nextMaterials[0];

    child.castShadow = true;
    child.receiveShadow = true;
  });
}

/**
 * Draws a black silhouette just behind the dragon (like the thick outlines in comic-book
 * art) by cloning each mesh, flipping it inside-out, and making it slightly bigger. Only
 * the sliver that peeks out past the real dragon's edges ends up visible, which is what
 * makes the outline appear — so the dragon reads clearly no matter what's behind it.
 */
function addOutline(scene: THREE.Object3D) {
  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  for (const mesh of meshes) {
    const outline = new THREE.Mesh(
      mesh.geometry,
      new THREE.MeshBasicMaterial({ color: OUTLINE_COLOR, side: THREE.BackSide }),
    );
    outline.position.copy(mesh.position);
    outline.rotation.copy(mesh.rotation);
    outline.scale.copy(mesh.scale).multiplyScalar(OUTLINE_SCALE);
    outline.castShadow = false;
    outline.receiveShadow = false;
    mesh.parent?.add(outline);
  }
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
      // Plain Object3D.clone() doesn't reconnect a rigged model's bones to its
      // skeleton, which made the dragon invisible. SkeletonUtils.clone() clones
      // the skeleton correctly too, so the model actually renders.
      const clone = SkeletonUtils.clone(scene);
      applyTribeColors(clone, dragon);
      normalizeModel(clone);
      addOutline(clone);
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
