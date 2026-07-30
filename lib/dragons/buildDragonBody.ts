import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import { addJoint, addSegment, makeMaterial } from "@/lib/dragons/geometryHelpers";
import { createWingShape } from "@/lib/dragons/wingShape";
import { addOutline } from "@/lib/dragons/outline";

/** One point along the dragon's spine, from tail tip to nose, with how thick it is there. */
type SpinePoint = { position: THREE.Vector3; radius: number };

function buildSpine(dragon: DragonCharacter, bodyMaterial: THREE.Material): {
  group: THREE.Group;
  shoulder: THREE.Vector3;
  shoulderRadius: number;
  hip: THREE.Vector3;
  hipRadius: number;
  neckTop: THREE.Vector3;
  bodyRadius: number;
} {
  const { traits } = dragon;
  const group = new THREE.Group();

  const stretch = traits.bulky ? 1.25 : traits.slim ? 0.9 : 1;
  const bodyRadius = traits.bulky ? 0.5 : traits.slim ? 0.3 : 0.38;
  // The belly needs to clear the ground by more than the body's own radius, or the
  // legs underneath have nowhere to go and end up as barely-visible stubs.
  const standHeight = bodyRadius + 0.55;

  // Every dragon is built from the same recipe of spine points, but `stretch`,
  // `bodyRadius`, and `standHeight` (set above from the tribe's traits) reshape it —
  // bulky tribes get a thicker, longer, lower-slung body, slim tribes a leaner one.
  const points: SpinePoint[] = [
    { position: new THREE.Vector3(-1.35 * stretch, standHeight + 0.12, 0), radius: bodyRadius * 0.12 },
    { position: new THREE.Vector3(-0.95 * stretch, standHeight + 0.22, 0), radius: bodyRadius * 0.4 },
    { position: new THREE.Vector3(-0.5 * stretch, standHeight + 0.34, 0), radius: bodyRadius * 0.9 },
    { position: new THREE.Vector3(0.1 * stretch, standHeight + 0.4, 0), radius: bodyRadius },
    { position: new THREE.Vector3(0.6 * stretch, standHeight + 0.46, 0), radius: bodyRadius * 0.72 },
    { position: new THREE.Vector3(0.95 * stretch, standHeight + 0.68, 0), radius: bodyRadius * 0.42 },
    { position: new THREE.Vector3(1.2 * stretch, standHeight + 0.95, 0), radius: bodyRadius * 0.3 },
    { position: new THREE.Vector3(1.42 * stretch, standHeight + 1.05, 0), radius: bodyRadius * 0.24 },
  ];

  for (let i = 0; i < points.length - 1; i += 1) {
    addSegment(
      group,
      points[i].position,
      points[i + 1].position,
      points[i].radius,
      points[i + 1].radius,
      bodyMaterial,
    );
    addJoint(group, points[i + 1].position, points[i + 1].radius, bodyMaterial);
  }

  return {
    group,
    hip: points[2].position,
    hipRadius: points[2].radius,
    shoulder: points[4].position,
    shoulderRadius: points[4].radius,
    neckTop: points[6].position,
    bodyRadius,
  };
}

function buildHead(
  dragon: DragonCharacter,
  neckTop: THREE.Vector3,
  bodyRadius: number,
  bodyMaterial: THREE.Material,
  accentMaterial: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  const headSize = bodyRadius * 0.55;
  const nose = neckTop.clone().add(new THREE.Vector3(headSize * 1.8, headSize * 0.15, 0));

  addSegment(group, neckTop, nose, headSize, headSize * 0.55, bodyMaterial);
  addJoint(group, neckTop, headSize, bodyMaterial);

  // Two little horns on top of the head.
  const hornBase = neckTop.clone().add(new THREE.Vector3(headSize * 0.2, headSize * 0.6, 0));
  for (const side of [-1, 1]) {
    const hornTip = hornBase
      .clone()
      .add(new THREE.Vector3(headSize * 0.5, headSize * 1.1, side * headSize * 0.35));
    addSegment(group, hornBase, hornTip, headSize * 0.16, 0.01, accentMaterial, 6);
  }

  if (dragon.traits.hasAntennae) {
    for (const side of [-1, 1]) {
      const antennaBase = neckTop.clone().add(new THREE.Vector3(0, headSize * 0.7, side * headSize * 0.3));
      const antennaTip = antennaBase.clone().add(new THREE.Vector3(headSize * 0.3, headSize * 1.6, side * headSize * 0.2));
      addSegment(group, antennaBase, antennaTip, headSize * 0.05, 0.01, accentMaterial, 6);
      addJoint(group, antennaTip, headSize * 0.08, accentMaterial);
    }
  }

  return group;
}

function buildLegs(
  dragon: DragonCharacter,
  hip: THREE.Vector3,
  hipRadius: number,
  shoulder: THREE.Vector3,
  shoulderRadius: number,
  bodyRadius: number,
  material: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  const legRadius = dragon.traits.bulky ? bodyRadius * 0.4 : dragon.traits.slim ? bodyRadius * 0.22 : bodyRadius * 0.3;
  const stance = bodyRadius * 1.1;

  const hipJoints: Array<[THREE.Vector3, number]> = [
    [hip, hipRadius],
    [shoulder, shoulderRadius],
  ];
  for (const [joint, jointRadius] of hipJoints) {
    for (const side of [-1, 1]) {
      // Start each leg right where the body's surface is (not its center), so it
      // looks attached instead of poking out through the belly.
      const top = new THREE.Vector3(joint.x, joint.y - jointRadius * 0.85, side * stance);
      const kneeHeight = top.y * 0.55;
      const knee = new THREE.Vector3(top.x + bodyRadius * 0.12, kneeHeight, top.z);
      const foot = new THREE.Vector3(knee.x - bodyRadius * 0.05, 0, knee.z);

      addSegment(group, top, knee, legRadius, legRadius * 0.85, material);
      addJoint(group, knee, legRadius * 0.85, material);
      addSegment(group, knee, foot, legRadius * 0.8, legRadius * 0.55, material);
      addJoint(group, foot, legRadius * 0.5, material);
    }
  }

  return group;
}

function buildTailBarb(tailTip: THREE.Vector3, material: THREE.Material): THREE.Mesh {
  const barb = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 6), material);
  barb.position.copy(tailTip).add(new THREE.Vector3(-0.14, 0, 0));
  barb.rotation.z = Math.PI / 2;
  barb.castShadow = true;
  return barb;
}

function buildWingPair(
  dragon: DragonCharacter,
  attachAt: THREE.Vector3,
  scale: number,
  material: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  const shape = createWingShape(dragon.traits.wingStyle);
  // A little thickness (instead of a perfectly flat plane) keeps the wing from
  // vanishing into a thin line when the spinning dragon turns edge-on to the camera.
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });

  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(geometry, material);
    wing.position.copy(attachAt);
    wing.scale.setScalar(scale);
    // Rotating 90° around Y turns the wing's flat "outward" direction to point
    // sideways (+Z or -Z) instead of forward — one rotation per side mirrors it.
    wing.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    wing.rotation.x = -0.35;
    wing.castShadow = true;
    wing.receiveShadow = true;
    group.add(wing);
  }

  return group;
}

/** Builds one dragon out of simple 3D shapes, shaped and colored by its tribe. */
export function buildDragonBody(dragon: DragonCharacter): THREE.Group {
  const { colors, traits } = dragon;
  const dragon3d = new THREE.Group();

  const glow = traits.hasBioluminescence || traits.hasStarryWings;
  const bodyMaterial = makeMaterial(colors.primary, {
    emissive: glow ? colors.accent : "#000000",
    emissiveIntensity: glow ? 0.25 : 0,
  });
  const accentMaterial = makeMaterial(colors.secondary);
  const wingMaterial = makeMaterial(colors.wing, {
    transparent: true,
    opacity: 0.95,
    emissive: glow ? colors.accent : "#000000",
    emissiveIntensity: glow ? 0.35 : 0,
  });

  const {
    group: spine,
    hip,
    hipRadius,
    shoulder,
    shoulderRadius,
    neckTop,
    bodyRadius,
  } = buildSpine(dragon, bodyMaterial);
  dragon3d.add(spine);
  dragon3d.add(buildHead(dragon, neckTop, bodyRadius, bodyMaterial, accentMaterial));
  dragon3d.add(buildLegs(dragon, hip, hipRadius, shoulder, shoulderRadius, bodyRadius, bodyMaterial));

  if (traits.hasTailBarb) {
    const stretch = traits.bulky ? 1.25 : traits.slim ? 0.9 : 1;
    const standHeight = bodyRadius + 0.55;
    dragon3d.add(buildTailBarb(new THREE.Vector3(-1.35 * stretch, standHeight + 0.12, 0), accentMaterial));
  }

  if (traits.hasSpikes) {
    for (let i = 0; i < 5; i += 1) {
      const t = i / 4;
      const spikeBase = shoulder.clone().lerp(neckTop, t).add(new THREE.Vector3(0, bodyRadius * 0.5, 0));
      const spikeTip = spikeBase.clone().add(new THREE.Vector3(0, bodyRadius * 0.5, 0));
      addSegment(dragon3d, spikeBase, spikeTip, bodyRadius * 0.12, 0.01, accentMaterial, 5);
    }
  }

  const wingAttach = shoulder.clone().add(new THREE.Vector3(0, bodyRadius * 0.3, 0));
  const wingScale = traits.slim ? 1.1 : traits.bulky ? 0.8 : 0.95;
  dragon3d.add(buildWingPair(dragon, wingAttach, wingScale, wingMaterial));

  if (traits.wingCount === 4) {
    const backWingAttach = hip.clone().add(new THREE.Vector3(0.3, bodyRadius * 0.3, 0));
    dragon3d.add(buildWingPair(dragon, backWingAttach, wingScale * 0.7, wingMaterial));
  }

  addOutline(dragon3d);
  return dragon3d;
}
