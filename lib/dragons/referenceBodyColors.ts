import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";

type ColorProfile = "skywing" | "mudwing";

function pickSkyWingColor(
  ny: number,
  y: number,
  absX: number,
  midY: number,
  bboxMaxX: number,
  colors: {
    top: THREE.Color;
    belly: THREE.Color;
    wing: THREE.Color;
    wingInner: THREE.Color;
  },
) {
  if (absX > bboxMaxX * 0.45 && Math.abs(ny) < 0.55) {
    return ny > 0 ? colors.wing : colors.wingInner;
  }
  if (ny < -0.2 || y < midY * 0.55) {
    return colors.belly;
  }
  if (ny > 0.25) {
    return colors.top;
  }
  return colors.top.clone().lerp(colors.belly, 0.45);
}

function pickMudWingColor(
  ny: number,
  y: number,
  absX: number,
  midY: number,
  bboxMaxX: number,
  colors: {
    top: THREE.Color;
    flank: THREE.Color;
    belly: THREE.Color;
    wing: THREE.Color;
    wingInner: THREE.Color;
  },
) {
  if (absX > bboxMaxX * 0.45 && Math.abs(ny) < 0.55) {
    return ny > 0 ? colors.wing : colors.wingInner;
  }
  if (ny < -0.2 || y < midY * 0.5) {
    return colors.belly;
  }
  if (ny > 0.3) {
    return colors.top;
  }
  return colors.flank;
}

/**
 * Paints a dragon's body in separate colors like reference artwork — top scales,
 * underbelly, wing membranes, and (for MudWings) rusty-orange flanks.
 */
export function applyReferenceBodyColors(scene: THREE.Object3D, dragon: DragonCharacter) {
  const profile: ColorProfile = dragon.visualEffects?.coloringProfile ?? "skywing";

  const top = new THREE.Color(dragon.colors.primary);
  const flank = new THREE.Color(dragon.colors.secondary);
  const belly = new THREE.Color(
    profile === "mudwing" ? dragon.colors.accent : dragon.colors.secondary,
  );
  const wing = new THREE.Color(dragon.colors.wing);
  const wingInner = new THREE.Color(dragon.colors.wingInner ?? dragon.colors.secondary);

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const geometry = child.geometry;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    const bbox = geometry.boundingBox;
    if (!bbox) {
      return;
    }

    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    const colors = new Float32Array(positions.count * 3);
    const midY = (bbox.min.y + bbox.max.y) * 0.5;

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const ny = normals.getY(i);
      const absX = Math.abs(x);

      const color =
        profile === "mudwing"
          ? pickMudWingColor(ny, y, absX, midY, bbox.max.x, {
              top,
              flank,
              belly,
              wing,
              wingInner,
            })
          : pickSkyWingColor(ny, y, absX, midY, bbox.max.x, {
              top,
              belly,
              wing,
              wingInner,
            });

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const wasArray = Array.isArray(child.material);
    const sourceMaterials = wasArray
      ? (child.material as THREE.Material[])
      : [child.material as THREE.Material];

    const nextMaterials = sourceMaterials.map((material) => {
      const next = material.clone() as THREE.MeshStandardMaterial;
      next.map = null;
      next.vertexColors = true;
      next.metalness = 0.05;
      next.roughness = 0.55;
      next.side = THREE.DoubleSide;
      next.needsUpdate = true;
      return next;
    });

    child.material = wasArray ? nextMaterials : nextMaterials[0];
  });
}
