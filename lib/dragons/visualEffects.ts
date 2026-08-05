import * as THREE from "three";

/** Finds a named bone or node anywhere inside a loaded 3D model. */
export function findBone(root: THREE.Object3D, name: string): THREE.Object3D | null {
  let found: THREE.Object3D | null = null;
  root.traverse((child) => {
    if (child.name === name) {
      found = child;
    }
  });
  return found;
}
