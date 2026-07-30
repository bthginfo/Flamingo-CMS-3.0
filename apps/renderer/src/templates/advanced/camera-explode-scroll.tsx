'use client';

import { useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Aperture, ArrowUpRight, Box, Cuboid, Eye, Layers3, ScanLine, View } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { visibleText } from '@/lib/visible-content';
import { AdvancedIntro, AdvancedLink, type AdvancedCta } from './advanced-shared';

type CameraPart = {
  id?: string;
  label?: string;
  text?: string;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
  color?: string;
};

type Props = { data: Record<string, unknown> };
type ThreeModule = typeof import('three');
type ExplodeNode = {
  object: import('three').Object3D;
  start: import('three').Vector3;
  end: import('three').Vector3;
  startRotation: import('three').Euler;
  endRotation: import('three').Euler;
};

const FALLBACK_PARTS: CameraPart[] = [
  { id: 'briefing', label: 'Briefing', text: 'Ziel, Zielgruppe und Einsatzkanäle geben der Produktion Richtung.', offsetX: -160, offsetY: 0, offsetZ: -40 },
  { id: 'look', label: 'Bildsprache', text: 'Licht, Farbe, Perspektive und Raum werden als klare visuelle Linie geplant.', offsetX: 160, offsetY: -40, offsetZ: 150 },
  { id: 'production', label: 'Produktion', text: 'Menschen, Bewegung und Timing werden geführt statt dem Zufall überlassen.', offsetX: 80, offsetY: -140, offsetZ: 70 },
  { id: 'postproduction', label: 'Postproduktion', text: 'Auswahl, Retusche, Schnitt und Grading halten die Serie zusammen.', offsetX: 170, offsetY: 60, offsetZ: -120 },
  { id: 'approval', label: 'Auswahl', text: 'Die stärksten Motive werden nach Wirkung und Nutzbarkeit kuratiert.', offsetX: -135, offsetY: 130, offsetZ: -130 },
  { id: 'output', label: 'Assets', text: 'Fertige Formate für Website, Social, Kampagne, Recruiting und Print.', offsetX: 135, offsetY: 140, offsetZ: 130 },
];

const SCHUKTUEW_CAMERA_COPY = {
  badge: 'Arbeitsweise',
  headline: 'Gute Bilder beginnen lange vor dem Auslösen.',
  subline: 'Ich verbinde Ziel, Bildsprache, Führung und Finish zu einer Produktion, die Menschen glaubwürdig zeigt und Marken unverwechselbar macht.',
  parts: [
    { id: 'briefing', label: 'Konzept', text: 'Ich kläre Ziel, Zielgruppe, Einsatzkanäle und gewünschte Wirkung, bevor die Kamera ins Spiel kommt.', offsetX: -174, offsetY: -8, offsetZ: -42 },
    { id: 'look', label: 'Bildsprache', text: 'Licht, Farbe, Perspektive und Setting formen eine klare visuelle Linie für Marke, Mensch oder Kampagne.', offsetX: 164, offsetY: -46, offsetZ: 154 },
    { id: 'direction', label: 'Führung', text: 'Vor der Kamera geht es um Haltung, Ausdruck und Sicherheit. Ich führe Menschen so, dass der Auftritt glaubwürdig wirkt.', offsetX: 82, offsetY: -146, offsetZ: 86 },
    { id: 'ai-workflow', label: 'Looktests', text: 'Mit kontrollierten AI-Tests prüfe ich Varianten und Formate, bevor wir Zeit in die Produktion investieren.', offsetX: 180, offsetY: 72, offsetZ: -132 },
    { id: 'finish', label: 'Finish', text: 'Auswahl, Retusche, Schnitt und Grading bringen Foto, Film und Reel-Material auf denselben visuellen Anspruch.', offsetX: -142, offsetY: 134, offsetZ: -148 },
    { id: 'assets', label: 'Ausgabe', text: 'Sie erhalten fertige Bilder und Filme für Website, Social Media, Kampagnen, Recruiting und Print.', offsetX: 150, offsetY: 150, offsetZ: 142 },
  ],
  cta: { label: 'Workflow ansehen', href: '/ai-workflows' },
};

const PART_ICONS = [Cuboid, Aperture, Eye, ScanLine, View, Box, Layers3];

function clampOffset(value: unknown, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(-260, Math.min(260, numeric));
}

function normalizedParts(value: unknown) {
  const parts = Array.isArray(value) ? (value as CameraPart[]).filter((part) => visibleText(part?.label || '')) : [];
  return (parts.length ? parts : FALLBACK_PARTS).slice(0, 7).map((part, index) => ({
    ...FALLBACK_PARTS[index % FALLBACK_PARTS.length],
    ...part,
    label: visibleText(part.label || FALLBACK_PARTS[index % FALLBACK_PARTS.length].label || `Part ${index + 1}`),
    text: visibleText(part.text || FALLBACK_PARTS[index % FALLBACK_PARTS.length].text || ''),
    offsetX: clampOffset(part.offsetX, FALLBACK_PARTS[index % FALLBACK_PARTS.length].offsetX || 0),
    offsetY: clampOffset(part.offsetY, FALLBACK_PARTS[index % FALLBACK_PARTS.length].offsetY || 0),
    offsetZ: clampOffset(part.offsetZ, FALLBACK_PARTS[index % FALLBACK_PARTS.length].offsetZ || 0),
  }));
}

function shouldUseSchuktuewCameraCopy(data: Record<string, unknown>, parts: CameraPart[]) {
  const headline = visibleText(String(data.headline || '')).toLowerCase();
  const cta = data.cta as AdvancedCta | undefined;
  const ctaLabel = visibleText(cta?.label || '').toLowerCase();
  const labels = parts.map((part) => visibleText(part.label || '').toLowerCase()).join(' ');
  const oldHeadline = /kamera zerlegt|blick wird klarer|was leicht wirkt|aus einem motiv wird ein kompletter auftritt/.test(headline);
  const oldLabels = /gehäuse|gehaeuse|objektiv|verschluss|sensor|monitor|dateien|haltung|perspektive|moment|look|output/.test(labels);
  const oldCta = /system ansehen|workflow ansehen|mit alex sprechen/.test(ctaLabel);
  return oldHeadline && oldLabels && oldCta;
}

function isLikelyModelUrl(url: string) {
  return /\.(glb|gltf)(\?|#|$)/i.test(url);
}

function isBlockedLegacyModelUrl(url: string) {
  return /gltf-sample-models\/.*\/AntiqueCamera/i.test(url) || /AntiqueCamera\.glb/i.test(url);
}

function makeMaterial(THREE: ThreeModule, color: string, metalness = 0.45, roughness = 0.34) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    envMapIntensity: 0.7,
  });
}

function makeGlassMaterial(THREE: ThreeModule, color = '#1f3550') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.05,
    roughness: 0.12,
    transmission: 0,
    transparent: false,
    opacity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.2,
  });
}

function roundedRectShape(THREE: ThreeModule, width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function addBox(THREE: ThreeModule, group: import('three').Group, size: [number, number, number], position: [number, number, number], color: string, radiusLabel?: string) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), makeMaterial(THREE, color));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.radiusLabel = radiusLabel;
  group.add(mesh);
  return mesh;
}

function addRoundedBox(THREE: ThreeModule, group: import('three').Group, size: [number, number, number], position: [number, number, number], color: string, radius = 0.18, metalness = 0.45, roughness = 0.34) {
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape(THREE, size[0], size[1], radius), { depth: size[2], bevelEnabled: true, bevelSize: Math.min(radius * 0.25, 0.045), bevelThickness: Math.min(radius * 0.18, 0.035), bevelSegments: 3 });
  geometry.center();
  const mesh = new THREE.Mesh(geometry, makeMaterial(THREE, color, metalness, roughness));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(THREE: ThreeModule, group: import('three').Group, radiusTop: number, radiusBottom: number, depth: number, position: [number, number, number], color: string) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, depth, 64), makeMaterial(THREE, color, 0.62, 0.24));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addGlassCylinder(THREE: ThreeModule, group: import('three').Group, radius: number, depth: number, position: [number, number, number], color = '#23384f') {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 96), makeGlassMaterial(THREE, color));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addTorus(THREE: ThreeModule, group: import('three').Group, radius: number, tube: number, position: [number, number, number], color: string) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 18, 96), makeMaterial(THREE, color, 0.7, 0.22));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function makeGeneratedCamera(THREE: ThreeModule, parts: CameraPart[]): ExplodeNode[] {
  const nodes: ExplodeNode[] = [];
  const materialSoft = '#f4eee3';
  const materialRed = '#d11224';
  const materialLime = '#c7ff4a';

  function createPart(name: string, partIndex: number, build: (group: import('three').Group) => void, fallback: [number, number, number]) {
    const group = new THREE.Group();
    group.name = name;
    build(group);
    const part = parts[partIndex] || FALLBACK_PARTS[partIndex % FALLBACK_PARTS.length];
    const start = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(
      (Number(part.offsetX) || fallback[0] * 100) / 88,
      -(Number(part.offsetY) || fallback[1] * 100) / 88,
      (Number(part.offsetZ) || fallback[2] * 100) / 78,
    );
    const startRotation = new THREE.Euler(0, 0, 0);
    const endRotation = new THREE.Euler((partIndex % 2 ? -0.12 : 0.12), (partIndex - 2) * 0.1, (partIndex % 3 - 1) * 0.08);
    nodes.push({ object: group, start, end, startRotation, endRotation });
    return group;
  }

  createPart('camera-body', 0, (group) => {
    addRoundedBox(THREE, group, [4.75, 2.55, 0.96], [-0.08, 0, 0], '#262626', 0.26, 0.58, 0.26);
    addRoundedBox(THREE, group, [4.22, 2.06, 1.0], [-0.26, -0.03, 0.08], '#111111', 0.16, 0.52, 0.28);
    addRoundedBox(THREE, group, [2.04, 1.42, 0.12], [0.18, -0.02, 0.66], '#050505', 0.2, 0.5, 0.22);
    addRoundedBox(THREE, group, [0.92, 2.24, 1.28], [2.1, -0.12, 0.18], '#050505', 0.32, 0.55, 0.26);
    addRoundedBox(THREE, group, [0.42, 1.58, 0.42], [2.66, -0.24, 0.42], '#111111', 0.18, 0.5, 0.32);
    addRoundedBox(THREE, group, [1.18, 0.48, 0.56], [-1.5, 1.35, 0.12], '#181818', 0.14, 0.5, 0.32);
    addRoundedBox(THREE, group, [1.2, 0.34, 0.52], [0.46, 1.38, 0.14], '#030303', 0.1, 0.58, 0.3);
    addRoundedBox(THREE, group, [0.72, 0.2, 0.5], [1.28, 1.42, 0.16], materialRed, 0.09, 0.2, 0.18);
    addRoundedBox(THREE, group, [0.24, 0.88, 0.18], [-2.18, 0.82, 0.26], '#2b2b2b', 0.08, 0.4, 0.36);
    addRoundedBox(THREE, group, [0.24, 0.88, 0.18], [-2.18, -0.82, 0.26], '#2b2b2b', 0.08, 0.4, 0.36);
    addRoundedBox(THREE, group, [1.42, 0.58, 0.72], [-0.38, 1.56, 0.16], '#141414', 0.18, 0.55, 0.26);
    addRoundedBox(THREE, group, [0.86, 0.24, 0.78], [-0.38, 1.88, 0.2], '#050505', 0.08, 0.6, 0.24);
    addRoundedBox(THREE, group, [0.58, 0.22, 0.12], [-0.38, 1.34, 0.62], '#23384f', 0.06, 0.08, 0.08);
    addRoundedBox(THREE, group, [0.78, 0.12, 0.4], [-0.34, 1.96, 0.12], '#050505', 0.04, 0.55, 0.26);
    addGlassCylinder(THREE, group, 0.46, 0.08, [-0.34, 1.55, 0.53], '#192536');
    addRoundedBox(THREE, group, [0.36, 0.08, 0.16], [-1.95, 1.12, 0.58], '#737373', 0.03, 0.75, 0.18);
    addRoundedBox(THREE, group, [0.36, 0.08, 0.16], [1.85, 1.12, 0.58], '#737373', 0.03, 0.75, 0.18);
  }, [-1.6, 0, -0.45]);

  createPart('lens-barrel', 1, (group) => {
    addCylinder(THREE, group, 1.24, 1.24, 0.16, [0, 0, 0.16], '#2c2c2c');
    addCylinder(THREE, group, 1.18, 1.06, 0.78, [0, 0, 0.62], '#040404');
    addCylinder(THREE, group, 1.04, 1.12, 0.62, [0, 0, 1.18], '#1a1a1a');
    addCylinder(THREE, group, 0.92, 1.02, 0.52, [0, 0, 1.72], '#070707');
    addCylinder(THREE, group, 0.7, 0.84, 0.36, [0, 0, 2.12], '#050505');
    addCylinder(THREE, group, 0.86, 1.05, 0.22, [0, 0, 2.42], '#030303');
    addGlassCylinder(THREE, group, 0.56, 0.1, [0, 0, 2.34], '#1b314d');
    addGlassCylinder(THREE, group, 0.34, 0.05, [0.04, 0.04, 2.54], '#385072');
    addTorus(THREE, group, 1.18, 0.055, [0, 0, 0.22], '#323232');
    addTorus(THREE, group, 1.05, 0.038, [0, 0, 0.72], '#545454');
    addTorus(THREE, group, 1.0, 0.026, [0, 0, 0.94], '#2d2d2d');
    addTorus(THREE, group, 0.93, 0.03, [0, 0, 1.44], '#3d3d3d');
    addTorus(THREE, group, 0.72, 0.028, [0, 0, 2.26], '#748096');
    for (let i = 0; i < 18; i += 1) {
      const angle = (Math.PI * 2 * i) / 18;
      const rib = addBox(THREE, group, [0.035, 0.2, 0.06], [Math.cos(angle) * 1.12, Math.sin(angle) * 1.12, 1.02], '#383838');
      rib.rotation.z = angle;
    }
  }, [1.65, -0.35, 1.35]);

  createPart('aperture-stack', 2, (group) => {
    addCylinder(THREE, group, 0.78, 0.78, 0.08, [0, 0, 0.12], '#050505');
    addTorus(THREE, group, 0.72, 0.024, [0, 0, 0.18], '#575757');
    for (let i = 0; i < 9; i += 1) {
      const blade = addRoundedBox(THREE, group, [0.64, 0.14, 0.035], [0, 0, 0.19], i % 2 ? '#222222' : '#303030', 0.035, 0.35, 0.42);
      blade.rotation.z = (Math.PI * 2 * i) / 9;
      blade.position.x = Math.cos(blade.rotation.z) * 0.18;
      blade.position.y = Math.sin(blade.rotation.z) * 0.18;
    }
  }, [0.8, -1.45, 0.9]);

  createPart('sensor-plane', 3, (group) => {
    addRoundedBox(THREE, group, [1.7, 1.16, 0.08], [0, 0, -0.58], '#111827', 0.08, 0.42, 0.26);
    addRoundedBox(THREE, group, [1.24, 0.84, 0.1], [0, 0, -0.52], '#3d536b', 0.06, 0.1, 0.12);
    for (let i = 0; i < 8; i += 1) {
      addBox(THREE, group, [0.04, 0.86, 0.12], [-0.43 + i * 0.12, 0, -0.45], '#728094');
    }
    for (let i = 0; i < 5; i += 1) {
      addBox(THREE, group, [1.0, 0.028, 0.122], [0, -0.31 + i * 0.15, -0.44], '#242f40');
    }
  }, [1.75, 0.65, -1.4]);

  createPart('rear-display', 4, (group) => {
    addRoundedBox(THREE, group, [2.3, 1.56, 0.14], [-0.48, -0.05, -0.75], materialSoft, 0.16, 0.18, 0.24);
    addRoundedBox(THREE, group, [1.72, 1.02, 0.16], [-0.62, -0.04, -0.64], '#050505', 0.1, 0.2, 0.12);
    addRoundedBox(THREE, group, [1.4, 0.68, 0.17], [-0.62, -0.04, -0.54], '#142033', 0.08, 0.05, 0.08);
    addRoundedBox(THREE, group, [0.42, 0.22, 0.16], [0.86, 0.5, -0.62], '#262626', 0.06, 0.3, 0.36);
    addRoundedBox(THREE, group, [0.26, 0.22, 0.16], [0.86, 0.12, -0.62], '#303030', 0.05, 0.3, 0.36);
    addRoundedBox(THREE, group, [0.26, 0.22, 0.16], [0.86, -0.25, -0.62], materialRed, 0.05, 0.2, 0.18);
  }, [-1.45, 1.25, -1.35]);

  createPart('top-controls', 5, (group) => {
    addCylinder(THREE, group, 0.38, 0.38, 0.22, [1.08, 1.52, 0.16], materialRed);
    addCylinder(THREE, group, 0.5, 0.5, 0.24, [-1.08, 1.48, 0.13], '#0b0b0b');
    addCylinder(THREE, group, 0.26, 0.26, 0.16, [-1.08, 1.48, 0.32], '#2f2f2f');
    addCylinder(THREE, group, 0.42, 0.42, 0.22, [0.9, 1.5, 0.34], '#171717');
    addRoundedBox(THREE, group, [0.82, 0.28, 0.48], [0.08, 1.58, 0.12], '#111111', 0.08, 0.45, 0.34);
    addRoundedBox(THREE, group, [0.62, 0.12, 0.34], [0.08, 1.8, 0.2], '#050505', 0.04, 0.55, 0.28);
  }, [1.25, -1.35, 0.75]);

  createPart('output-cards', 6, (group) => {
    addRoundedBox(THREE, group, [1.12, 0.72, 0.055], [-0.28, -1.05, 0.62], materialLime, 0.08, 0.12, 0.18);
    addRoundedBox(THREE, group, [0.88, 0.58, 0.06], [0.62, -1.22, 0.82], materialSoft, 0.07, 0.12, 0.2);
    addRoundedBox(THREE, group, [0.64, 0.42, 0.065], [1.18, -0.8, 1.02], materialRed, 0.06, 0.12, 0.18);
    addRoundedBox(THREE, group, [0.72, 0.06, 0.08], [-0.28, -0.86, 0.68], '#111111', 0.02, 0.2, 0.2);
    addRoundedBox(THREE, group, [0.56, 0.04, 0.08], [0.62, -1.08, 0.88], '#111111', 0.02, 0.2, 0.2);
  }, [1.5, 1.48, 1.5]);

  return nodes;
}

async function loadModelNodes(THREE: ThreeModule, modelUrl: string, parts: CameraPart[]): Promise<ExplodeNode[] | null> {
  if (!modelUrl) return null;
  try {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const gltf = await new GLTFLoader().loadAsync(modelUrl);
    const sourceScene = gltf.scene;
    sourceScene.updateWorldMatrix(true, true);
    const meshes: import('three').Mesh[] = [];
    sourceScene.traverse((object) => {
      const maybeMesh = object as import('three').Mesh & { isMesh?: boolean };
      if (maybeMesh.isMesh) meshes.push(maybeMesh);
    });
    if (!meshes.length) return null;
    const box = new THREE.Box3().setFromObject(sourceScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = 4 / Math.max(size.x || 1, size.y || 1, size.z || 1);
    return meshes.slice(0, Math.max(4, Math.min(meshes.length, 18))).map((mesh, index) => {
      const geometry = mesh.geometry.clone();
      const material = Array.isArray(mesh.material) ? mesh.material.map((entry) => entry.clone()) : mesh.material.clone();
      const clone = new THREE.Mesh(geometry, material);
      const world = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      const meshScale = new THREE.Vector3();
      mesh.matrixWorld.decompose(world, rotation, meshScale);
      clone.position.copy(world.sub(center).multiplyScalar(scale));
      clone.quaternion.copy(rotation);
      clone.scale.copy(meshScale.multiplyScalar(scale));
      clone.castShadow = true;
      clone.receiveShadow = true;
      const part = parts[index % parts.length] || FALLBACK_PARTS[index % FALLBACK_PARTS.length];
      const direction = clone.position.clone().normalize();
      if (direction.lengthSq() < 0.1) direction.set((index % 3) - 1, index % 2 ? 0.6 : -0.4, 0.8);
      const start = clone.position.clone();
      const end = start.clone().add(new THREE.Vector3(
        (Number(part.offsetX) || direction.x * 160) / 90,
        -(Number(part.offsetY) || direction.y * 160) / 90,
        (Number(part.offsetZ) || direction.z * 160) / 80,
      ));
      return {
        object: clone,
        start,
        end,
        startRotation: clone.rotation.clone(),
        endRotation: new THREE.Euler(clone.rotation.x + 0.08, clone.rotation.y + 0.18, clone.rotation.z + (index % 2 ? -0.12 : 0.12)),
      };
    });
  } catch {
    return null;
  }
}

function useProgressRef(progress: MotionValue<number>) {
  const progressRef = useRef(0);
  useEffect(() => progress.on('change', (value) => { progressRef.current = value; }), [progress]);
  return progressRef;
}

function cleanCameraBadge(value: unknown) {
  const badge = visibleText(String(value || ''));
  if (/^3d\s+camera\s+system$/i.test(badge)) return 'Exploded View';
  if (/^glb\s+exploded\s+view$/i.test(badge)) return 'Exploded View';
  if (/^3d\s+exploded\s+camera$/i.test(badge)) return '3D Kamera';
  return badge;
}

function CameraThreeScene({ parts, modelUrl, progress }: { parts: CameraPart[]; modelUrl: string; progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useProgressRef(progress);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const canvasElement = canvas;
    const wrapElement = wrap;
    let disposed = false;
    let frame = 0;
    let renderer: import('three').WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const cleanup: Array<() => void> = [];

    async function setup() {
      const THREE = await import('three');
      if (disposed) return;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x070707, 0.055);
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(0, 0.25, 11.2);
      renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.22;

      const root = new THREE.Group();
      root.scale.setScalar(0.82);
      root.rotation.x = -0.08;
      root.rotation.y = -0.28;
      scene.add(root);

      const ambient = new THREE.AmbientLight(0xffffff, 1.45);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(0xffffff, 3.1);
      key.position.set(4, 5, 7);
      key.castShadow = true;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xbfd7ff, 1.35);
      fill.position.set(-5, 2, 4);
      scene.add(fill);
      const top = new THREE.PointLight(0xffffff, 18, 14);
      top.position.set(0, 4, 3);
      scene.add(top);
      const rim = new THREE.PointLight(0xd11224, 24, 12);
      rim.position.set(-4, 1.8, 4);
      scene.add(rim);
      const lime = new THREE.PointLight(0xc7ff4a, 8, 10);
      lime.position.set(3, -2, 3);
      scene.add(lime);

      const nodes = await loadModelNodes(THREE, modelUrl, parts) || makeGeneratedCamera(THREE, parts);
      if (disposed) return;
      nodes.forEach((node) => root.add(node.object));
      setStatus('ready');

      const resize = () => {
        if (!renderer) return;
        const rect = wrapElement.getBoundingClientRect();
        const width = Math.max(320, Math.round(rect.width));
        const height = Math.max(320, Math.round(rect.height));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(wrapElement);
      resize();

      const animate = () => {
        if (!renderer) return;
        const p = Math.max(0, Math.min(1, progressRef.current));
        const eased = 1 - Math.pow(1 - p, 3);
        root.rotation.y = -0.32 + eased * 0.56;
        root.rotation.x = -0.08 + Math.sin(eased * Math.PI) * 0.08;
        nodes.forEach((node, index) => {
          node.object.position.lerpVectors(node.start, node.end, eased);
          node.object.rotation.x = node.startRotation.x + (node.endRotation.x - node.startRotation.x) * eased;
          node.object.rotation.y = node.startRotation.y + (node.endRotation.y - node.startRotation.y) * eased;
          node.object.rotation.z = node.startRotation.z + (node.endRotation.z - node.startRotation.z) * eased;
          node.object.visible = index < 16 || p > 0.2;
        });
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(animate);
      };
      animate();

      cleanup.push(() => {
        window.cancelAnimationFrame(frame);
        resizeObserver?.disconnect();
        nodes.forEach((node) => {
          node.object.traverse((object) => {
            const mesh = object as import('three').Mesh;
            if (mesh.geometry && typeof mesh.geometry.dispose === 'function') mesh.geometry.dispose();
            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((material) => material?.dispose?.());
            }
          });
        });
        renderer?.dispose();
      });
    }

    setup().catch(() => setStatus('fallback'));
    return () => {
      disposed = true;
      cleanup.forEach((fn) => fn());
    };
  }, [modelUrl, parts, progressRef]);

  return (
    <div ref={wrapRef} className="relative h-full min-h-[22rem] w-full sm:min-h-[30rem] md:min-h-[34rem]">
      <canvas ref={canvasRef} className="h-full w-full" aria-label="3D Exploded View einer Kamera" />
      {status === 'loading' && <div className="absolute inset-0 grid place-items-center text-xs font-bold uppercase tracking-[.2em] text-[color:var(--token-on-dark-muted)]">3D Kamera lädt</div>}
      {status === 'fallback' && <div className="absolute inset-0 grid place-items-center text-xs font-bold uppercase tracking-[.2em] text-[color:var(--token-on-dark-muted)]">3D nicht verfügbar</div>}
    </div>
  );
}

function PartCopy({ part, index, compact = false }: { part: CameraPart; index: number; compact?: boolean }) {
  const Icon = PART_ICONS[index % PART_ICONS.length];
  return (
    <article className={`rounded-[var(--token-card-radius)] border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_7%,transparent)] ${compact ? 'p-4' : 'p-5'} text-[color:var(--token-on-dark-body)] shadow-[0_18px_54px_rgba(0,0,0,.22)] backdrop-blur-xl`} data-card data-color-context="dark" data-edit-collection="parts" data-edit-index={index}>
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--token-accent)_18%,white_10%)] text-[color:var(--token-on-dark-heading)] shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_14px_32px_rgba(0,0,0,.22)]">
          <Icon size={19} strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]">{String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-1 text-base font-black text-[color:var(--token-on-dark-heading)]" data-edit-path="label">{part.label}</h3>
          {part.text && <p className="mt-1.5 text-xs leading-5 text-[color:var(--token-on-dark-body)]" data-edit-path="text">{plain(part.text)}</p>}
        </div>
      </div>
    </article>
  );
}

function CameraStickyIntro({ data }: Props) {
  const badge = cleanCameraBadge(data.badge);
  const headline = visibleText(String(data.headline || ''));
  const subline = visibleText(String(data.subline || ''));
  return (
    <div className="max-w-[36rem]">
      {badge && <p className="section-badge mb-5 w-fit" data-edit-path="badge">{badge}</p>}
      {headline && (
        <h2
          className="text-[clamp(2.25rem,4.4vw,5.2rem)] font-black leading-[.88] tracking-[-.06em] text-[color:var(--token-heading)] [overflow-wrap:normal]"
          data-edit-path="headline"
        >
          {headline}
        </h2>
      )}
      {subline && <p className="mt-6 max-w-md text-base leading-7 text-[color:var(--token-muted)]" data-edit-path="subline">{plain(subline)}</p>}
    </div>
  );
}

function StaticCameraVisual({ brandImage }: { brandImage: string }) {
  return (
    <div className="relative mx-auto aspect-[4/3] max-w-sm">
      <div className="absolute left-[10%] top-[34%] h-[35%] w-[64%] rounded-[2rem] border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_84%,white_8%)] shadow-2xl" />
      <div className="absolute left-[27%] top-[25%] h-[18%] w-[23%] rounded-t-[1.2rem] bg-[color:color-mix(in_srgb,var(--token-card-bg)_92%,black_8%)] shadow-xl" />
      <div className="absolute left-[69%] top-[37%] h-[28%] w-[14%] rounded-[1.25rem] bg-[var(--token-card-bg)] shadow-2xl" />
      <div className="absolute left-[43%] top-[27%] h-[46%] w-[33%] rounded-full bg-black shadow-[0_20px_70px_rgba(0,0,0,.65)] ring-[10px] ring-white/10" />
      <div className="absolute left-[47.5%] top-[34%] h-[32%] w-[24%] rounded-full border-[10px] border-[color:color-mix(in_srgb,var(--token-card-border)_28%,transparent)] bg-[var(--token-card-bg)]" />
      <div className="absolute left-[53%] top-[43%] h-[15%] w-[11%] rounded-full bg-[color:color-mix(in_srgb,var(--token-accent)_22%,var(--token-card-bg))]" />
      <div className="absolute left-[56%] top-[46%] h-[6%] w-[4%] rounded-full bg-[color:color-mix(in_srgb,var(--token-card-bg)_45%,transparent)]" />
      <div className="absolute left-[16%] top-[27%] h-[9%] w-[19%] rounded-2xl bg-[var(--token-card-bg)]" />
      <div className="absolute right-[3%] top-[51%] h-[18%] w-[25%] translate-x-6 rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] bg-[color:var(--token-accent)] shadow-xl" />
      <div className="absolute left-[8%] top-[66%] h-[17%] w-[29%] -translate-x-5 rotate-[-8deg] rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] bg-[var(--token-btn-bg)] shadow-xl" />
      <div className="absolute left-[49%] top-[72%] h-[13%] w-[28%] rotate-[5deg] rounded-2xl bg-[color:color-mix(in_srgb,var(--token-accent)_78%,var(--token-btn-bg))] shadow-xl" />
      {brandImage && <img src={brandImage} alt="" loading="lazy" className="absolute right-0 top-0 h-20 w-20 rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] object-cover" data-edit-image="brandImage" />}
    </div>
  );
}

function MobileCameraExperience({ data, parts, brandImage, modelUrl, cta, reduceMotion }: { data: Record<string, unknown>; parts: CameraPart[]; brandImage: string; modelUrl: string; cta: AdvancedCta; reduceMotion: boolean | null }) {
  const mobileRef = useRef<HTMLElement>(null);
  const shouldLoadScene = useInView(mobileRef, { once: true, margin: '500px 0px 500px 0px' });
  const { scrollYProgress } = useScroll({ target: mobileRef, offset: ['start 75%', 'end 20%'] });
  const progress = useTransform(scrollYProgress, [0, 1], [0.08, 0.96]);
  const badge = cleanCameraBadge(data.badge);
  return (
    <section ref={mobileRef} className="bg-[var(--token-section-bg)] [--_quote-role:var(--token-quote)] px-5 py-16 md:hidden">
      <AdvancedIntro badge={badge} headline={String(data.headline || '')} subline={String(data.subline || '')} compact />
      <div className="mt-10 overflow-hidden rounded-[calc(var(--token-card-radius)*1.25)] border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[radial-gradient(circle_at_48%_35%,rgba(255,255,255,.13),transparent_42%),radial-gradient(circle_at_88%_16%,color-mix(in_srgb,var(--token-accent)_28%,transparent),transparent_34%),var(--token-card-bg)] p-2 shadow-[0_28px_90px_rgba(0,0,0,.32)]">
        <div className="relative h-[24rem] w-full sm:h-[30rem]">
          {brandImage && <img src={brandImage} alt="" loading="lazy" decoding="async" className="absolute right-3 top-3 z-20 h-16 w-16 rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] object-cover opacity-80 shadow-2xl" data-edit-image="brandImage" />}
          {reduceMotion ? (
            <StaticCameraVisual brandImage={brandImage} />
          ) : shouldLoadScene ? (
            <CameraThreeScene parts={parts} modelUrl={modelUrl} progress={progress} />
          ) : (
            <div className="grid h-full place-items-center text-xs font-black uppercase tracking-[.22em] text-[color:var(--token-on-dark-muted)]">3D wird geladen</div>
          )}
        </div>
      </div>
      <div className="mt-10 space-y-3">{parts.map((part, index) => <PartCopy key={`${part.label}-${index}`} part={part} index={index} />)}</div>
      <AdvancedLink cta={cta} className="mt-8" />
    </section>
  );
}

export function CameraExplodeScrollSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const shouldLoadScene = useInView(ref, { once: true, margin: '900px 0px 900px 0px' });
  const rawParts = normalizedParts(data.parts);
  const displayData = shouldUseSchuktuewCameraCopy(data, rawParts) ? { ...data, ...SCHUKTUEW_CAMERA_COPY } : data;
  const parts = displayData === data ? rawParts : normalizedParts(SCHUKTUEW_CAMERA_COPY.parts);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useTransform(scrollYProgress, [0.08, 0.72], [0, 1]);
  const brandImage = safeContentUrl(String(displayData.brandImage || ''));
  const modelUrlRaw = safeContentUrl(String(displayData.modelUrl || displayData.gltfUrl || displayData.glbUrl || ''));
  const modelUrl = isLikelyModelUrl(modelUrlRaw) && !isBlockedLegacyModelUrl(modelUrlRaw) ? modelUrlRaw : '';
  const cta = displayData.cta as AdvancedCta;
  const ctaHref = safeContentUrl(cta?.href || '');
  const ctaLabel = visibleText(cta?.label || '');

  return (
    <>
      <MobileCameraExperience data={displayData} parts={parts} brandImage={brandImage} modelUrl={modelUrl} cta={cta} reduceMotion={reduceMotion} />
      <section ref={ref} className="advanced-motion-experience relative hidden bg-[var(--token-section-bg)] [--_quote-role:var(--token-quote)] text-[color:var(--token-on-dark-body)] md:block" style={{ height: `${reduceMotion ? 120 : Math.max(220, parts.length * 42)}vh` }}>
        <div className="sticky top-0 grid h-[100svh] overflow-hidden px-8 py-8 lg:grid-cols-[minmax(25rem,.7fr)_minmax(34rem,1.3fr)] lg:gap-10 lg:px-14">
          <div className="relative z-20 flex min-w-0 flex-col py-6" data-color-context="dark">
            <CameraStickyIntro data={displayData} />
            <div className="mt-10 grid gap-3 pb-6 xl:grid-cols-2">{parts.slice(0, 6).map((part, index) => <PartCopy key={`${part.label}-${index}`} part={part} index={index} compact />)}</div>
          </div>
          <div className="relative grid min-h-0 place-items-center">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_48%_44%,rgba(255,255,255,.18),transparent_38%),radial-gradient(circle_at_86%_18%,color-mix(in_srgb,var(--token-accent)_34%,transparent),transparent_30%)]" />
            {brandImage && <img src={brandImage} alt="" loading="lazy" decoding="async" className="absolute right-6 top-6 z-20 h-24 w-24 rounded-2xl border border-[color:color-mix(in_srgb,var(--token-card-border)_22%,transparent)] object-cover opacity-80 shadow-2xl" data-edit-image="brandImage" />}
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[28rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:color-mix(in_srgb,var(--token-card-bg)_45%,transparent)] blur-3xl" />
            {reduceMotion ? (
              <div className="relative grid h-[min(68vh,42rem)] w-full max-w-4xl place-items-center rounded-[calc(var(--token-card-radius)*1.5)] border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.12),transparent_45%),var(--token-card-bg)] p-8">
                <StaticCameraVisual brandImage={brandImage} />
              </div>
            ) : shouldLoadScene ? (
              <div className="relative h-[min(78vh,48rem)] w-full max-w-5xl">
                <CameraThreeScene parts={parts} modelUrl={modelUrl} progress={progress} />
              </div>
            ) : (
              <div className="relative grid h-[min(78vh,48rem)] w-full max-w-5xl place-items-center rounded-[calc(var(--token-card-radius)*1.5)] border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.12),transparent_45%),var(--token-card-bg)] p-8 text-xs font-black uppercase tracking-[.22em] text-[color:var(--token-on-dark-muted)]">
                3D wird geladen
              </div>
            )}
            <div className="pointer-events-none absolute bottom-8 left-8 z-20 rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--token-card-bg)_35%,transparent)] px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-[color:var(--token-on-dark-muted)] backdrop-blur">
              {modelUrl ? '3D Kamera' : 'Kamera-System'}
            </div>
            {ctaHref && ctaLabel && <a href={ctaHref} className="absolute bottom-8 right-8 z-30 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 text-sm font-black text-[color:var(--token-btn-text)] shadow-2xl transition hover:-translate-y-0.5" data-edit-link="cta"><span data-edit-path="cta.label">{ctaLabel}</span><ArrowUpRight size={16} /></a>}
          </div>
        </div>
      </section>
    </>
  );
}
