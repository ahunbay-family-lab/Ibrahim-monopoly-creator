import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import { findBone } from "@/lib/dragons/visualEffects";

const FIERCE_EYE_COLOR = new THREE.Color("#ffd700");
const FIERCE_EYE_GLOW = new THREE.Color("#ffcc00");
const TALON_COLOR = new THREE.Color("#1a1a1a");
const TALON_TIP = new THREE.Color("#f0f0f0");

function attachFierceEyes(head: THREE.Object3D) {
  for (const side of [-1, 1] as const) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.13, 0.2, 0.36);
    eyeGroup.rotation.y = side * -0.15;
    eyeGroup.rotation.z = side * 0.08;

    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 14, 14),
      new THREE.MeshStandardMaterial({
        color: FIERCE_EYE_COLOR,
        emissive: FIERCE_EYE_GLOW,
        emissiveIntensity: 1.8,
        metalness: 0.05,
        roughness: 0.2,
      }),
    );
    eyeGroup.add(eye);

    const pupil = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, 0.1, 0.015),
      new THREE.MeshBasicMaterial({ color: "#1a0505" }),
    );
    pupil.position.set(0, 0, 0.1);
    eyeGroup.add(pupil);

    const highlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.MeshBasicMaterial({ color: "#fff8dc", transparent: true, opacity: 0.85 }),
    );
    highlight.position.set(side * 0.03, 0.04, 0.08);
    eyeGroup.add(highlight);

    head.add(eyeGroup);
  }
}

function attachTalonSet(
  limb: THREE.Object3D,
  side: "left" | "right",
  kind: "foot" | "hand",
) {
  const spread = kind === "foot" ? 0.1 : 0.08;
  const length = kind === "foot" ? 0.38 : 0.28;
  const forward = kind === "foot" ? 0.1 : 0.14;
  const downward = kind === "foot" ? -0.08 : -0.05;

  for (let index = 0; index < 3; index += 1) {
    const offset = (index - 1) * spread;
    const talon = new THREE.Mesh(
      new THREE.ConeGeometry(0.052, length, 6),
      new THREE.MeshStandardMaterial({
        color: TALON_COLOR,
        emissive: TALON_TIP,
        emissiveIntensity: 0.15,
        metalness: 0.4,
        roughness: 0.25,
      }),
    );
    talon.position.set(
      side === "left" ? -offset : offset,
      downward,
      forward + Math.abs(offset) * 0.25,
    );
    talon.rotation.set(
      Math.PI * 0.58,
      0,
      side === "left" ? -offset * 0.35 : offset * 0.35,
    );
    limb.add(talon);
  }
}

function attachTalons(model: THREE.Object3D) {
  const limbs: Array<{ name: string; side: "left" | "right"; kind: "foot" | "hand" }> = [
    { name: "LeftFoot", side: "left", kind: "foot" },
    { name: "RightFoot", side: "right", kind: "foot" },
    { name: "LeftHand", side: "left", kind: "hand" },
    { name: "RightHand", side: "right", kind: "hand" },
  ];

  for (const { name, side, kind } of limbs) {
    const bone = findBone(model, name);
    if (bone) {
      attachTalonSet(bone, side, kind);
    }
  }
}

/** Creates empty groups on the head bone for animated nostril smoke. */
export function createSmokeAnchors(model: THREE.Object3D): {
  left: THREE.Group;
  right: THREE.Group;
} | null {
  const head = findBone(model, "Head");
  if (!head) {
    return null;
  }

  const left = new THREE.Group();
  left.position.set(-0.08, 0.08, 0.42);
  head.add(left);

  const right = new THREE.Group();
  right.position.set(0.08, 0.08, 0.42);
  head.add(right);

  return { left, right };
}

/** Adds eyes and talons directly onto the model's bones so they move with the animation. */
export function attachStaticVisualAddons(model: THREE.Object3D, dragon: DragonCharacter) {
  const effects = dragon.visualEffects;
  if (!effects) {
    return;
  }

  if (effects.eyes) {
    const head = findBone(model, "Head");
    if (head) {
      attachFierceEyes(head);
    }
  }

  if (effects.talons) {
    attachTalons(model);
  }
}
