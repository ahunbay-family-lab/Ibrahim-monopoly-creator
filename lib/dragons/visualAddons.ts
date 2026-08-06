import * as THREE from "three";
import type { DragonCharacter } from "@/lib/dragons/types";
import { findBone } from "@/lib/dragons/visualEffects";

function attachFierceEyes(head: THREE.Object3D) {
  for (const side of [-1, 1] as const) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.16, 0.11, 0.1);
    eyeGroup.rotation.y = side * 0.42;

    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 14, 14),
      new THREE.MeshStandardMaterial({
        color: "#ffd700",
        emissive: "#ffcc00",
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

function attachNaturalEyes(head: THREE.Object3D) {
  for (const side of [-1, 1] as const) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.15, 0.1, 0.11);
    eyeGroup.rotation.y = side * 0.38;

    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshStandardMaterial({
        color: "#1a1208",
        emissive: "#2a1a10",
        emissiveIntensity: 0.3,
        metalness: 0.1,
        roughness: 0.4,
      }),
    );
    eyeGroup.add(eye);

    const highlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 6, 6),
      new THREE.MeshBasicMaterial({ color: "#4a3828", transparent: true, opacity: 0.6 }),
    );
    highlight.position.set(side * 0.015, 0.02, 0.04);
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
        emissiveIntensity: 0.2,
        metalness: 0.15,
        roughness: 0.35,
      }),
    );
    talon.position.set(
      side === "left" ? -offset : offset,
      -reach,
      Math.abs(offset) * 0.15,
    );
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
      if (effects.eyeStyle === "natural") {
        attachNaturalEyes(head);
      } else {
        attachFierceEyes(head);
      }
    }
  }

  if (effects.talons) {
    const talonHex = effects.talonColor ?? dragon.colors.primary;
    attachTalons(model, new THREE.Color(talonHex));
  }
}
