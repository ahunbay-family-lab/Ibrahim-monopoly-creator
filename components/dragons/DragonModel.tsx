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
import { DRAGON_CHARACTERS } from "@/lib/dragons/characters";
import { DragonVisualAddons } from "@/components/dragons/DragonVisualAddons";

/** Radians per second the dragon spins on its own when nobody is turning it. */
const AUTO_ROTATE_SPEED = 0.5;
/** Radians the dragon turns for every pixel the pointer drags. */
const DRAG_SENSITIVITY = 0.01;
/** How far up/down the dragon can be tilted, so it never flips upside down. */
const MAX_PITCH = 0.6;
/** Color of the outline drawn around the dragon so it stands out from any background. */
const OUTLINE_COLOR = "#050505";
/** How much bigger the outline is than the dragon itself (a 4.5% halo). */
const OUTLINE_SCALE = 1.045;

type DragonModelProps = {
  dragon: DragonCharacter;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
      // solid tribe color instead — bold and clearly readable for every tribe.
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
        // without one it renders almost black, so we keep metalness low and let
        // the tribe color show clearly.
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
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: OUTLINE_COLOR,
      side: THREE.BackSide,
    });

    // A dragon with a flying animation (like Peril) needs its outline bound to the
    // same skeleton, so the outline moves and flaps in sync with the real mesh
    // instead of staying frozen in the rest pose.
    const outline =
      mesh instanceof THREE.SkinnedMesh
        ? Object.assign(new THREE.SkinnedMesh(mesh.geometry, outlineMaterial), {
            bindMode: mesh.bindMode,
          })
        : new THREE.Mesh(mesh.geometry, outlineMaterial);

    if (outline instanceof THREE.SkinnedMesh && mesh instanceof THREE.SkinnedMesh) {
      outline.bind(mesh.skeleton, mesh.bindMatrix);
    }

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

/** Renders the tribe-colored dragon and exposes turn controls so a parent can spin it. */
export const DragonModel = forwardRef<DragonSpinHandle, DragonModelProps>(
  function DragonModel({ dragon }, spinHandleRef) {
    const groupRef = useRef<Group>(null);
    const isDraggingRef = useRef(false);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const modelPath = dragon.modelPath ?? DRAGON_MODEL_PATH;
    const { scene, animations } = useGLTF(modelPath);

    const model = useMemo(() => {
      const clone = SkeletonUtils.clone(scene);
      applyTribeColors(clone, dragon);
      normalizeModel(clone);

      const showOutline = dragon.visualEffects?.outline !== false;
      if (showOutline) {
        addOutline(clone);
      }

      const clip = dragon.animationName
        ? THREE.AnimationClip.findByName(animations, dragon.animationName)
        : null;

      if (clip) {
        const mixer = new THREE.AnimationMixer(clone);
        mixer.clipAction(clip).play();
        mixerRef.current = mixer;
      } else {
        mixerRef.current = null;
      }

      return clone;
    }, [scene, animations, dragon]);

    useImperativeHandle(
      spinHandleRef,
      () => ({
        beginDrag() {
          isDraggingRef.current = true;
        },
        applyDrag(deltaX: number, deltaY: number) {
          const group = groupRef.current;
          if (!group) return;
          group.rotation.y += deltaX * DRAG_SENSITIVITY;
          group.rotation.x = clamp(
            group.rotation.x + deltaY * DRAG_SENSITIVITY,
            -MAX_PITCH,
            MAX_PITCH,
          );
        },
        endDrag() {
          isDraggingRef.current = false;
        },
        nudge(deltaYaw: number, deltaPitch: number) {
          const group = groupRef.current;
          if (!group) return;
          group.rotation.y += deltaYaw;
          group.rotation.x = clamp(group.rotation.x + deltaPitch, -MAX_PITCH, MAX_PITCH);
        },
      }),
      [],
    );

    useFrame((_, delta) => {
      mixerRef.current?.update(delta);

      if (groupRef.current && !isDraggingRef.current) {
        groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;
      }
    });

    return (
      <group ref={groupRef} rotation={[0, Math.PI / 5, 0]}>
        <primitive object={model} />
        <DragonVisualAddons model={model} dragon={dragon} />
      </group>
    );
  },
);

useGLTF.preload(DRAGON_MODEL_PATH);
DRAGON_CHARACTERS.filter((dragon) => dragon.modelPath).forEach((dragon) =>
  useGLTF.preload(dragon.modelPath as string),
);
