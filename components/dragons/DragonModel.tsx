"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { DragonCharacter } from "@/lib/dragons/types";

type DragonModelProps = {
  dragon: DragonCharacter;
  autoRotate?: boolean;
};

function ClassicWing({
  side,
  colors,
  starry,
}: {
  side: "left" | "right";
  colors: DragonCharacter["colors"];
  starry?: boolean;
}) {
  const x = side === "left" ? -0.55 : 0.55;
  const rotationZ = side === "left" ? 0.4 : -0.4;

  return (
    <group position={[x, 0.15, 0]} rotation={[0.2, 0, rotationZ]}>
      <mesh>
        <boxGeometry args={[0.05, 0.9, 0.6]} />
        <meshStandardMaterial color={colors.wing} side={2} />
      </mesh>
      <mesh position={[0, -0.1, -0.05]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.5]} />
        <meshStandardMaterial
          color={starry ? colors.wingInner ?? "#e8e8ff" : colors.wingInner ?? colors.accent}
          side={2}
        />
      </mesh>
      {starry &&
        [-0.2, 0, 0.2].map((offset) => (
          <mesh key={offset} position={[0, offset, -0.08]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
        ))}
    </group>
  );
}

function LeafWing({ side, colors }: { side: "left" | "right"; colors: DragonCharacter["colors"] }) {
  const x = side === "left" ? -0.45 : 0.45;
  const rotationZ = side === "left" ? 0.5 : -0.5;

  return (
    <>
      {[0.3, -0.25].map((yOffset, index) => (
        <group
          key={index}
          position={[x, yOffset, 0]}
          rotation={[0.15, 0, rotationZ + (index === 0 ? 0.2 : -0.2)]}
        >
          <mesh scale={[1, 1.3, 0.15]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color={colors.wing} side={2} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function InsectWing({ side, colors }: { side: "left" | "right"; colors: DragonCharacter["colors"] }) {
  const x = side === "left" ? -0.4 : 0.4;
  const rotationZ = side === "left" ? 0.35 : -0.35;

  return (
    <>
      {[0.25, -0.2].map((yOffset, index) => (
        <group
          key={index}
          position={[x, yOffset, 0]}
          rotation={[0.1, 0, rotationZ]}
        >
          <mesh scale={[0.6, 1.2, 0.05]}>
            <boxGeometry args={[0.5, 0.7, 0.05]} />
            <meshStandardMaterial color={colors.wing} transparent opacity={0.7} side={2} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function ButterflyWing({ side, colors }: { side: "left" | "right"; colors: DragonCharacter["colors"] }) {
  const x = side === "left" ? -0.5 : 0.5;
  const rotationZ = side === "left" ? 0.45 : -0.45;

  return (
    <group position={[x, 0.1, 0]} rotation={[0.1, 0, rotationZ]}>
      <mesh scale={[1.1, 1.4, 0.2]}>
        <sphereGeometry args={[0.4, 10, 10]} />
        <meshStandardMaterial color={colors.wing} side={2} />
      </mesh>
      <mesh position={[0, -0.15, 0]} scale={[0.7, 0.9, 0.15]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color={colors.wingInner ?? colors.accent} side={2} />
      </mesh>
    </group>
  );
}

function Wings({ dragon }: { dragon: DragonCharacter }) {
  const { colors, traits } = dragon;
  const sides: Array<"left" | "right"> = ["left", "right"];

  if (traits.wingStyle === "leaf") {
    return (
      <>
        {sides.map((side) => (
          <LeafWing key={side} side={side} colors={colors} />
        ))}
      </>
    );
  }

  if (traits.wingStyle === "insect") {
    return (
      <>
        {sides.map((side) => (
          <InsectWing key={side} side={side} colors={colors} />
        ))}
      </>
    );
  }

  if (traits.wingStyle === "butterfly") {
    return (
      <>
        {sides.map((side) => (
          <ButterflyWing key={side} side={side} colors={colors} />
        ))}
      </>
    );
  }

  return (
    <>
      {sides.map((side) => (
        <ClassicWing
          key={side}
          side={side}
          colors={colors}
          starry={traits.hasStarryWings}
        />
      ))}
    </>
  );
}

export function DragonModel({ dragon, autoRotate = true }: DragonModelProps) {
  const groupRef = useRef<Group>(null);
  const { colors, traits } = dragon;
  const bodyScale = traits.bulky ? 1.15 : traits.slim ? 0.9 : 1;

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} scale={bodyScale}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.32, 1.1, 8, 16]} />
        <meshStandardMaterial color={colors.primary} />
      </mesh>

      <mesh position={[0.65, 0.1, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color={colors.primary} />
      </mesh>

      <mesh position={[0.88, 0.05, 0]} rotation={[0, 0, -0.1]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshStandardMaterial color={colors.secondary} />
      </mesh>

      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.5, 8]} />
        <meshStandardMaterial color={colors.primary} />
      </mesh>

      {traits.hasTailBarb && (
        <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.06, 0.2, 6]} />
          <meshStandardMaterial color={colors.accent} />
        </mesh>
      )}

      <Wings dragon={dragon} />

      {traits.hasSpikes &&
        [0.55, 0.35, 0.15, -0.05, -0.25].map((y, index) => (
          <mesh key={index} position={[0.5 - index * 0.15, y, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.04, 0.15, 6]} />
            <meshStandardMaterial color={colors.accent} />
          </mesh>
        ))}

      {traits.hasAntennae && (
        <>
          <mesh position={[0.82, 0.28, 0.08]} rotation={[0.3, 0, 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
            <meshStandardMaterial color={colors.accent} />
          </mesh>
          <mesh position={[0.82, 0.28, -0.08]} rotation={[-0.3, 0, 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
            <meshStandardMaterial color={colors.accent} />
          </mesh>
        </>
      )}

      {traits.hasBioluminescence &&
        [-0.2, 0, 0.2].map((y) => (
          <mesh key={y} position={[0.1, y, 0.34]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={colors.accent}
              emissive={colors.accent}
              emissiveIntensity={1.2}
            />
          </mesh>
        ))}

      {traits.hasStripes &&
        [-0.1, 0.15, 0.4].map((x) => (
          <mesh key={x} position={[x, 0, 0.33]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.08, 0.55, 0.02]} />
            <meshStandardMaterial color={colors.secondary} />
          </mesh>
        ))}
    </group>
  );
}
