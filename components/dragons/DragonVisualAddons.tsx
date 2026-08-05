"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import { findBone } from "@/lib/dragons/visualEffects";

type DragonVisualAddonsProps = {
  model: THREE.Object3D;
  dragon: DragonCharacter;
};

type SmokePuff = {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  velocity: THREE.Vector3;
  spin: number;
};

function TalonSet({
  side,
  limb,
}: {
  side: "left" | "right";
  limb: "foot" | "hand";
}) {
  const spread = limb === "foot" ? 0.09 : 0.07;
  const length = limb === "foot" ? 0.24 : 0.18;
  const forward = limb === "foot" ? 0.07 : 0.11;
  const downward = limb === "foot" ? -0.06 : -0.04;

  return (
    <group>
      {[0, 1, 2].map((index) => {
        const offset = (index - 1) * spread;
        return (
          <mesh
            key={index}
            position={[side === "left" ? -offset : offset, downward, forward + Math.abs(offset) * 0.2]}
            rotation={[Math.PI * 0.55, 0, side === "left" ? -offset * 0.4 : offset * 0.4]}
          >
            <coneGeometry args={[0.032, length, 5]} />
            <meshStandardMaterial
              color="#0a0a0a"
              emissive="#333333"
              emissiveIntensity={0.2}
              metalness={0.35}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function NostrilSmoke() {
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const leftPuffs = useRef<SmokePuff[]>([]);
  const rightPuffs = useRef<SmokePuff[]>([]);
  const spawnTimerRef = useRef(0);

  function spawnPuff(group: THREE.Group, puffs: SmokePuff[], side: -1 | 1) {
    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), material);
    mesh.scale.set(0.06, 0.2, 0.06);
    mesh.position.set(side * 0.06, 0.15, 0.42);
    mesh.renderOrder = 10;
    group.add(mesh);

    puffs.push({
      mesh,
      life: 0,
      maxLife: 1.2 + Math.random() * 0.6,
      velocity: new THREE.Vector3(
        side * (0.05 + Math.random() * 0.04),
        0.22 + Math.random() * 0.1,
        0.03 + Math.random() * 0.05,
      ),
      spin: (Math.random() - 0.5) * 2,
    });
  }

  function updatePuffs(puffs: SmokePuff[], group: THREE.Group, delta: number) {
    for (let i = puffs.length - 1; i >= 0; i -= 1) {
      const puff = puffs[i];
      puff.life += delta;
      const t = puff.life / puff.maxLife;

      puff.mesh.position.addScaledVector(puff.velocity, delta);
      puff.mesh.position.x += Math.sin(puff.life * 5 + puff.spin) * delta * 0.04;
      puff.mesh.scale.set(0.06 + t * 0.08, 0.2 + t * 0.28, 0.06 + t * 0.08);

      const material = puff.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.75 * (1 - t);

      if (puff.life >= puff.maxLife) {
        group.remove(puff.mesh);
        puff.mesh.geometry.dispose();
        material.dispose();
        puffs.splice(i, 1);
      }
    }
  }

  useFrame((_, delta) => {
    if (!leftRef.current || !rightRef.current) return;

    spawnTimerRef.current -= delta;
    if (spawnTimerRef.current <= 0) {
      spawnPuff(leftRef.current, leftPuffs.current, -1);
      spawnPuff(rightRef.current, rightPuffs.current, 1);
      spawnTimerRef.current = 0.16;
    }

    updatePuffs(leftPuffs.current, leftRef.current, delta);
    updatePuffs(rightPuffs.current, rightRef.current, delta);
  });

  return (
    <>
      <group ref={leftRef} />
      <group ref={rightRef} />
    </>
  );
}

/** Attaches eyes, nostril smoke, and talons to Peril's flying model bones. */
export function DragonVisualAddons({ model, dragon }: DragonVisualAddonsProps) {
  const effects = dragon.visualEffects;
  const bones = useMemo(
    () => ({
      head: findBone(model, "Head"),
      leftFoot: findBone(model, "LeftFoot"),
      rightFoot: findBone(model, "RightFoot"),
      leftHand: findBone(model, "LeftHand"),
      rightHand: findBone(model, "RightHand"),
    }),
    [model],
  );

  if (!effects) {
    return null;
  }

  return (
    <>
      {effects.eyes && bones.head && (
        <primitive object={bones.head}>
          <mesh position={[0.14, 0.22, 0.34]} renderOrder={2}>
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshStandardMaterial
              color="#1a0505"
              emissive="#ffcc00"
              emissiveIntensity={1}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[-0.14, 0.22, 0.34]} renderOrder={2}>
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshStandardMaterial
              color="#1a0505"
              emissive="#ffcc00"
              emissiveIntensity={1}
              roughness={0.2}
            />
          </mesh>
          {effects.nostrilSmoke && <NostrilSmoke />}
        </primitive>
      )}

      {effects.talons && bones.leftFoot && (
        <primitive object={bones.leftFoot}>
          <TalonSet side="left" limb="foot" />
        </primitive>
      )}
      {effects.talons && bones.rightFoot && (
        <primitive object={bones.rightFoot}>
          <TalonSet side="right" limb="foot" />
        </primitive>
      )}
      {effects.talons && bones.leftHand && (
        <primitive object={bones.leftHand}>
          <TalonSet side="left" limb="hand" />
        </primitive>
      )}
      {effects.talons && bones.rightHand && (
        <primitive object={bones.rightHand}>
          <TalonSet side="right" limb="hand" />
        </primitive>
      )}
    </>
  );
}
