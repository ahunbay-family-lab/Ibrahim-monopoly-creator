"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SmokePuff = {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  velocity: THREE.Vector3;
  spin: number;
};

type NostrilSmokeProps = {
  left: THREE.Group;
  right: THREE.Group;
};

function NostrilSmoke({ left, right }: NostrilSmokeProps) {
  const leftPuffs = useRef<SmokePuff[]>([]);
  const rightPuffs = useRef<SmokePuff[]>([]);
  const spawnTimerRef = useRef(0);

  function spawnPuff(group: THREE.Group, puffs: SmokePuff[], side: -1 | 1) {
    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), material);
    mesh.scale.set(0.05, 0.16, 0.05);
    mesh.position.set(0, 0.08, 0);
    mesh.renderOrder = 10;
    group.add(mesh);

    puffs.push({
      mesh,
      life: 0,
      maxLife: 1.1 + Math.random() * 0.5,
      velocity: new THREE.Vector3(
        side * (0.04 + Math.random() * 0.03),
        0.18 + Math.random() * 0.08,
        0.02 + Math.random() * 0.04,
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
      puff.mesh.position.x += Math.sin(puff.life * 5 + puff.spin) * delta * 0.03;
      puff.mesh.scale.set(0.05 + t * 0.07, 0.16 + t * 0.22, 0.05 + t * 0.07);

      const material = puff.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.7 * (1 - t);

      if (puff.life >= puff.maxLife) {
        group.remove(puff.mesh);
        puff.mesh.geometry.dispose();
        material.dispose();
        puffs.splice(i, 1);
      }
    }
  }

  useFrame((_, delta) => {
    spawnTimerRef.current -= delta;
    if (spawnTimerRef.current <= 0) {
      spawnPuff(left, leftPuffs.current, -1);
      spawnPuff(right, rightPuffs.current, 1);
      spawnTimerRef.current = 0.18;
    }

    updatePuffs(leftPuffs.current, left, delta);
    updatePuffs(rightPuffs.current, right, delta);
  });

  return null;
}

type DragonVisualAddonsProps = {
  smokeAnchors: { left: THREE.Group; right: THREE.Group } | null;
};

/** Animated nostril smoke that follows Peril's head while she flies. */
export function DragonVisualAddons({ smokeAnchors }: DragonVisualAddonsProps) {
  if (!smokeAnchors) {
    return null;
  }

  return <NostrilSmoke left={smokeAnchors.left} right={smokeAnchors.right} />;
}
