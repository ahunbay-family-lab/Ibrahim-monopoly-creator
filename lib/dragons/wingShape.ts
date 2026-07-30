import * as THREE from "three";
import type { WingStyle } from "@/lib/dragons/types";

/**
 * Draws a flat wing outline (like tracing a wing with a pencil) in 2D — one point
 * at a time, curving between them — for a given wing style. The shape is later
 * rotated and positioned onto the dragon's shoulder.
 */
export function createWingShape(style: WingStyle): THREE.Shape {
  switch (style) {
    case "leaf":
      return createLeafWing();
    case "insect":
      return createInsectWing();
    case "butterfly":
      return createButterflyWing();
    case "classic":
    default:
      return createClassicWing();
  }
}

/** A bat-like membrane wing with three pointed "fingers", like a classic dragon. */
function createClassicWing(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.05);
  shape.lineTo(1.15, 0.85);
  shape.quadraticCurveTo(0.75, 0.5, 0.62, 0.32);
  shape.lineTo(1.25, 0.15);
  shape.quadraticCurveTo(0.8, 0.05, 0.55, 0);
  shape.lineTo(1.05, -0.45);
  shape.quadraticCurveTo(0.55, -0.28, 0.25, -0.1);
  shape.quadraticCurveTo(0.1, -0.02, 0, 0.05);
  return shape;
}

/** A single smooth, pointed leaf shape. */
function createLeafWing(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.35, 0.55, 1.1, 0.35);
  shape.quadraticCurveTo(0.55, 0.2, 0.35, -0.05);
  shape.quadraticCurveTo(0.2, -0.15, 0, 0);
  return shape;
}

/** A narrow, long oval like a dragonfly wing. */
function createInsectWing(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.5, 0.32, 1.3, 0.18);
  shape.quadraticCurveTo(0.7, 0.06, 0.45, -0.08);
  shape.quadraticCurveTo(0.2, -0.1, 0, 0);
  return shape;
}

/** A rounded, two-lobed shape like a butterfly's wing. */
function createButterflyWing(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.05);
  shape.quadraticCurveTo(0.5, 0.85, 1.05, 0.4);
  shape.quadraticCurveTo(0.75, 0.15, 0.55, 0.08);
  shape.quadraticCurveTo(0.85, -0.15, 0.7, -0.5);
  shape.quadraticCurveTo(0.35, -0.3, 0.15, -0.05);
  shape.quadraticCurveTo(0.05, 0, 0, 0.05);
  return shape;
}
