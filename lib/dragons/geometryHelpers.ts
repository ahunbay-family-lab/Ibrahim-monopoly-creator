import * as THREE from "three";

/** A simple, non-shiny material in the given color — the building block for every part. */
export function makeMaterial(
  color: string,
  extra?: Partial<THREE.MeshStandardMaterialParameters>,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.08,
    side: THREE.DoubleSide,
    ...extra,
  });
}

/**
 * Connects two points with a tapered cylinder — like connecting two dots with a
 * cone-shaped tube. Chaining a few of these together (tail tip → tail base → body →
 * neck → head) is how we build the dragon's curved spine and legs out of straight
 * pieces.
 */
export function addSegment(
  group: THREE.Group,
  from: THREE.Vector3,
  to: THREE.Vector3,
  radiusFrom: number,
  radiusTo: number,
  material: THREE.Material,
  radialSegments = 8,
): THREE.Mesh {
  const direction = new THREE.Vector3().subVectors(to, from);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radiusTo, radiusFrom, length, radialSegments);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(from).addScaledVector(direction, 0.5);

  // CylinderGeometry points along Y by default — rotate Y to face `direction`.
  const up = new THREE.Vector3(0, 1, 0);
  mesh.quaternion.setFromUnitVectors(up, direction.clone().normalize());

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

/** A rounded cap (sphere) at a joint, so two segments meeting there don't show a gap. */
export function addJoint(
  group: THREE.Group,
  at: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 8), material);
  mesh.position.copy(at);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

/** Scales and centers a group so every dragon fills the camera view the same amount. */
export function fitToView(group: THREE.Object3D, targetSize = 2.8) {
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 0) {
    const scale = targetSize / maxDim;
    group.scale.setScalar(scale);
    group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }
}
