import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";

/**
 * Paints Peril's body to match her reference art: terracotta scales on top,
 * golden underbelly, and bright orange wing membranes.
 */
export function applyPerilBodyColors(scene: THREE.Object3D, dragon: DragonCharacter) {
  const top = new THREE.Color(dragon.colors.primary);
  const belly = new THREE.Color(dragon.colors.secondary);
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

      let color = top;

      // Wide, flat vertices with outward-facing normals are wing membrane.
      if (absX > bbox.max.x * 0.45 && Math.abs(ny) < 0.55) {
        color = ny > 0 ? wing : wingInner;
      } else if (ny < -0.2 || y < midY * 0.55) {
        color = belly;
      } else if (ny > 0.25) {
        color = top;
      } else {
        color = top.clone().lerp(belly, 0.45);
      }

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
