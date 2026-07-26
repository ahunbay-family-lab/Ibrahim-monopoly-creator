"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float, useTexture } from "@react-three/drei";
import type { Group } from "three";
import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";

type DragonModelProps = {
  dragon: DragonCharacter;
  autoRotate?: boolean;
};

function curvedPlaneGeometry(width: number, height: number) {
  const geometry = new THREE.PlaneGeometry(width, height, 64, 48);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const curve = Math.cos(x * 1.1) * 0.1 + Math.sin(y * 1.4) * 0.03;
    positions.setZ(index, curve);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function DragonTexturedMesh({
  texture,
  dragon,
}: {
  texture: THREE.Texture;
  dragon: DragonCharacter;
}) {
  const geometry = useMemo(() => curvedPlaneGeometry(3.4, 1.92), []);

  const displayTexture = useMemo(() => {
    const configured = texture.clone();
    configured.colorSpace = THREE.SRGBColorSpace;
    configured.anisotropy = 16;
    return configured;
  }, [texture]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        map={displayTexture}
        transparent
        roughness={0.38}
        metalness={dragon.id === "icewing" ? 0.4 : 0.05}
        clearcoat={0.35}
        clearcoatRoughness={0.25}
        envMapIntensity={1.4}
        emissive={
          dragon.traits.hasBioluminescence ? new THREE.Color(dragon.colors.accent) : "#000000"
        }
        emissiveIntensity={dragon.traits.hasBioluminescence ? 0.15 : 0}
      />
    </mesh>
  );
}

export function DragonModel({ dragon, autoRotate = true }: DragonModelProps) {
  const groupRef = useRef<Group>(null);
  const texture = useTexture(dragon.imageUrl);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.1}>
        <DragonTexturedMesh texture={texture} dragon={dragon} />
      </Float>
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.6}
        scale={5}
        blur={2.5}
        far={2.8}
      />
    </group>
  );
}
