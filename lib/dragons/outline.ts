import * as THREE from "three";

/** Color of the outline drawn around the dragon so it stands out from any background. */
const OUTLINE_COLOR = "#050505";
/** How much bigger the outline is than the dragon itself (a 4.5% halo). */
const OUTLINE_SCALE = 1.045;

/**
 * Draws a black silhouette just behind every mesh in `group` (like the thick outlines
 * in comic-book art) by cloning each mesh, flipping it inside-out, and making it
 * slightly bigger. Only the sliver that peeks out past the real mesh's edges ends up
 * visible, which is what makes the outline appear — so the dragon reads clearly no
 * matter what's behind it.
 */
export function addOutline(group: THREE.Object3D) {
  const meshes: THREE.Mesh[] = [];
  group.traverse((child) => {
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
