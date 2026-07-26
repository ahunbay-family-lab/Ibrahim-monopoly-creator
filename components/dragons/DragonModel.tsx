"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group, MeshStandardMaterial } from "three";
import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import { DRAGON_MODEL_PATH } from "@/lib/dragons/model";

type DragonModelProps = {
  dragon: DragonCharacter;
  autoRotate?: boolean;
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
        next.color.set("#ffffff");
        next.map.colorSpace = THREE.SRGBColorSpace;
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
    const scale = 2.2 / maxDim;
    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }
}

export function DragonModel({ dragon, autoRotate = true }: DragonModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(DRAGON_MODEL_PATH);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    applyTribeColors(clone, dragon);
    normalizeModel(clone);
    return clone;
  }, [scene, dragon]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI / 5, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(DRAGON_MODEL_PATH);
