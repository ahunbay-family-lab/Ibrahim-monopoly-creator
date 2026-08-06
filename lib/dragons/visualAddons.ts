import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import { findBone } from "@/lib/dragons/visualEffects";

const FIERCE_EYE_COLOR = new THREE.Color("#ffd700");
const FIERCE_EYE_GLOW = new THREE.Color("#ffcc00");

function attachFierceEyes(head: THREE.Object3D) {
  for (const side of [-1, 1] as const) {
    const eyeGroup = new THREE.Group();
    // Jaw sits at (0, 0.03, 0.21) on the head bone — eyes go on the cheek,
    // above the jaw and out to the side, not beneath the skull.
    eyeGroup.position.set(side * 0.16, 0.11, 0.1);
    eyeGroup.rotation.y = side * 0.42;

    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 14, 14),
      new THREE.MeshStandardMaterial({
        color: FIERCE_EYE_COLOR,
        emissive: FIERCE_EYE_GLOW,
        emissiveIntensity: 2,
        metalness: 0.05,
        roughness: 0.15,
      }),
    );
    eyeGroup.add(eye);

    const pupil = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.085, 0.012),
      new THREE.MeshBasicMaterial({ color: "#1a0505" }),
    );
    pupil.position.set(0, 0, 0.09);
    eyeGroup.add(pupil);

    const highlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ color: "#fff8dc", transparent: true, opacity: 0.9 }),
    );
    highlight.position.set(side * 0.025, 0.035, 0.07);
    eyeGroup.add(highlight);

    head.add(eyeGroup);
  }
}

function attachTalonSet(
  limb: THREE.Object3D,
  side: "left" | "right",
  kind: "foot" | "hand",
  talonColor: THREE.Color,
) {
  const spread = kind === "foot" ? 0.09 : 0.07;
  const length = kind === "foot" ? 0.34 : 0.26;
  const reach = kind === "foot" ? 0.14 : 0.1;

  for (let index = 0; index < 3; index += 1) {
    const offset = (index - 1) * spread;
    const talon = new THREE.Mesh(
      new THREE.ConeGeometry(0.048, length, 6),
      new THREE.MeshStandardMaterial({
        color: talonColor,
        emissive: talonColor,
        emissiveIntensity: 0.3,
        metalness: 0.1,
        roughness: 0.3,
      }),
    );
    talon.position.set(
      side === "left" ? -offset : offset,
      -reach,
      Math.abs(offset) * 0.15,
    );
    // Tips curl down and slightly back, like gripping talons in flight.
    talon.rotation.set(
      Math.PI * 0.62,
      0,
      side === "left" ? offset * 0.3 : -offset * 0.3,
    );
    limb.add(talon);
  }
}

function attachTalons(model: THREE.Object3D, talonColor: THREE.Color) {
  const limbs: Array<{ name: string; side: "left" | "right"; kind: "foot" | "hand" }> = [
    { name: "LeftFoot", side: "left", kind: "foot" },
    { name: "RightFoot", side: "right", kind: "foot" },
    { name: "LeftHand", side: "left", kind: "hand" },
    { name: "RightHand", side: "right", kind: "hand" },
  ];

  for (const { name, side, kind } of limbs) {
    const bone = findBone(model, name);
    if (bone) {
      attachTalonSet(bone, side, kind, talonColor);
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
  left.position.set(-0.07, 0.06, 0.2);
  head.add(left);

  const right = new THREE.Group();
  right.position.set(0.07, 0.06, 0.2);
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
    attachTalons(model, new THREE.Color(dragon.colors.primary));
  }
}
