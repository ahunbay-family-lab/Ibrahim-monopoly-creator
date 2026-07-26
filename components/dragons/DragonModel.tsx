"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Float, useGLTF } from "@react-three/drei";
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
  const secondary = new THREE.Color(dragon.colors.secondary);
  const accent = new THREE.Color(dragon.colors.accent);

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];

    child.material = materials.map((material) => {
      const next = material.clone() as MeshStandardMaterial;

      if ("color" in next) {
        next.color.copy(primary);
      }

      if ("emissive" in next) {
        if (dragon.traits.hasBioluminescence || dragon.traits.hasStarryWings) {
          next.emissive.copy(accent);
          next.emissiveIntensity = 0.35;
        } else {
          next.emissive.set("#000000");
          next.emissiveIntensity = 0;
        }
      }

      if ("metalness" in next) {
        next.metalness = dragon.id === "icewing" ? 0.55 : 0.15;
      }

      if ("roughness" in next) {
        next.roughness = dragon.id === "mudwing" ? 0.75 : 0.42;
      }

      if (next.map) {
        next.map.colorSpace = THREE.SRGBColorSpace;
      }

      if (dragon.traits.hasStripes && "map" in next && next.map) {
        next.color.lerp(secondary, 0.25);
      }

      return next;
    });

    if (!Array.isArray(child.material)) {
      child.material = child.material[0];
    }

    child.castShadow = true;
    child.receiveShadow = true;
  });
}

export function DragonModel({ dragon, autoRotate = true }: DragonModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(DRAGON_MODEL_PATH);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    applyTribeColors(clone, dragon);
    return clone;
  }, [scene, dragon]);

  const scale = dragon.traits.bulky ? 1.35 : dragon.traits.slim ? 0.95 : 1.15;

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.08}>
        <Center>
          <primitive object={model} scale={scale} rotation={[0, Math.PI / 4, 0]} />
        </Center>
      </Float>
      <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.75}
        scale={6}
        blur={2.8}
        far={3}
      />
    </group>
  );
}

useGLTF.preload(DRAGON_MODEL_PATH);
