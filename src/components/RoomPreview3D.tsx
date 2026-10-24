import { useEffect, useRef, useState } from 'react';
import { Moon, RotateCcw, Sun } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { RoomType } from '../lib/calculator';
import { grateTexture, tileTextures, woodTexture } from './room3d/textures';
import {
  concealedTapModel, disposeModelGeometries, drainModel, exposedMixerModel, handBasinModel, heatingModel, nicheModel,
  radiatorModel, rainShowerModel, showerScreenModel, socketModel, spotModel, toiletModel, vanityModel, type RoomMaterials,
} from './room3d/models';

interface RoomPreview3DProps {
  roomType: RoomType;
  /** Metres; a typical size is shown until valid dimensions are entered. */
  length: number | null;
  width: number | null;
  optionIds: string[];
  /** Text alternative for screen readers. */
  description: string;
  dimensionLabel: (value: number) => string;
  labels: { evening: string; day: string; reset: string };
}

interface Target {
  roomType: RoomType;
  length: number;
  width: number;
  options: Set<string>;
}

interface Controller {
  setTarget: (target: Target) => void;
  setEvening: (evening: boolean) => void;
  resetView: () => void;
}

const HEIGHT = 2.6;
const WALL = 0.1;
const day = { background: new THREE.Color('#efe8de'), hemi: 0.55, sun: 1.25, env: 0.3, glow: 0.7, spot: 1.4, exposure: 0.88 };
const evening = { background: new THREE.Color('#2a231d'), hemi: 0.08, sun: 0.03, env: 0.06, glow: 3.2, spot: 6, exposure: 1.2 };
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

/**
 * Indicative 3D model of the room being priced. It follows the entered size
 * and the chosen options, can be rotated, and has an evening-light mode.
 * Built with three.js and only loaded on the calculator page.
 */
export default function RoomPreview3D({ roomType, length, width, optionIds, description, dimensionLabel, labels }: RoomPreview3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const labelRef = useRef(dimensionLabel);
  labelRef.current = dimensionLabel;
  const [failed, setFailed] = useState(false);
  const [isEvening, setIsEvening] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lightweight = window.matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency ?? 4) < 4;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      setFailed(true);
      return undefined;
    }
    // Kept modest so dragging stays smooth on high-density screens.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lightweight ? 1.25 : 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Shadows are recalculated only when the room changes, not on every camera move.
    renderer.shadowMap.autoUpdate = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = day.background.clone();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = day.env;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    // No wheel zoom: scrolling over the preview must keep scrolling the page.
    controls.enableZoom = false;
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = 1.22;
    controls.minAzimuthAngle = 0.1;
    controls.maxAzimuthAngle = 1.47;

    // ── Light ──────────────────────────────────────────────────────────
    const hemisphere = new THREE.HemisphereLight('#fff8ee', '#b8a994', day.hemi);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight('#fff1dc', day.sun);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 4;
    scene.add(sun, sun.target);

    // ── Materials ──────────────────────────────────────────────────────
    const disposables: { dispose: () => void }[] = [environment];
    const keep = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };
    const floorTiles = tileTextures({ base: '#bfb29f', grout: '#9f927f', columns: 2, rows: 2, seed: 11 });
    const backTiles = tileTextures({ base: '#e2d9cc', grout: '#c4b8a8', columns: 2, rows: 4, seed: 23, variation: 6 });
    const sideTiles = tileTextures({ base: '#e2d9cc', grout: '#c4b8a8', columns: 2, rows: 4, seed: 37, variation: 6 });
    const wood = woodTexture();
    const grate = grateTexture();
    [floorTiles.map, floorTiles.bumpMap, backTiles.map, backTiles.bumpMap, sideTiles.map, sideTiles.bumpMap, wood, grate].forEach(keep);

    const floorMaterial = keep(new THREE.MeshStandardMaterial({ map: floorTiles.map, bumpMap: floorTiles.bumpMap, bumpScale: 1.2, roughness: 0.62 }));
    const backMaterial = keep(new THREE.MeshStandardMaterial({ map: backTiles.map, bumpMap: backTiles.bumpMap, bumpScale: 0.9, roughness: 0.4 }));
    const sideMaterial = keep(new THREE.MeshStandardMaterial({ map: sideTiles.map, bumpMap: sideTiles.bumpMap, bumpScale: 0.9, roughness: 0.4 }));
    const glow = keep(new THREE.MeshStandardMaterial({ color: '#ffe2b0', emissive: '#ffcf8a', emissiveIntensity: day.glow }));
    const heat = keep(new THREE.MeshStandardMaterial({ color: '#ff8a3d', emissive: '#ff6a1f', emissiveIntensity: 1.2, transparent: true, opacity: 0.55, depthWrite: false }));
    const materials: RoomMaterials = {
      ceramic: keep(new THREE.MeshPhysicalMaterial({ color: '#f8f6f2', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 })),
      brass: keep(new THREE.MeshStandardMaterial({ color: '#c39a5c', metalness: 1, roughness: 0.28 })),
      black: keep(new THREE.MeshStandardMaterial({ color: '#1f1c19', metalness: 0.4, roughness: 0.45 })),
      wood: keep(new THREE.MeshStandardMaterial({ map: wood, roughness: 0.55 })),
      stone: keep(new THREE.MeshStandardMaterial({ color: '#e3ddd3', roughness: 0.3 })),
      glass: keep(new THREE.MeshStandardMaterial({ color: '#e8f1f0', metalness: 0, roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false })),
      mirror: keep(new THREE.MeshStandardMaterial({ color: '#e7ecec', metalness: 1, roughness: 0.03 })),
      glow,
      plaster: keep(new THREE.MeshStandardMaterial({ color: '#efe9e0', roughness: 0.85 })),
      steel: keep(new THREE.MeshStandardMaterial({ color: '#7f8b90', metalness: 0.6, roughness: 0.45 })),
      grate: keep(new THREE.MeshStandardMaterial({ map: grate, metalness: 0.8, roughness: 0.35 })),
      leaf: keep(new THREE.MeshStandardMaterial({ color: '#5f7652', roughness: 0.7 })),
      pot: keep(new THREE.MeshStandardMaterial({ color: '#3a332c', roughness: 0.6 })),
      heat,
      inset: keep(new THREE.MeshStandardMaterial({ color: '#a89a87', roughness: 0.9 })),
    };
    const profileMaterial = keep(new THREE.MeshStandardMaterial({ color: '#c8ccce', metalness: 0.9, roughness: 0.25 }));

    // ── Room shell ─────────────────────────────────────────────────────
    const box = keep(new THREE.BoxGeometry(1, 1, 1));
    const shell = (material: THREE.Material) => {
      const mesh = new THREE.Mesh(box, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };
    const plinth = shell(keep(new THREE.MeshStandardMaterial({ color: '#d7cdbf', roughness: 0.9 })));
    const floor = shell(floorMaterial);
    const backWall = shell(backMaterial);
    const sideWall = shell(sideMaterial);
    const ground = new THREE.Mesh(keep(new THREE.PlaneGeometry(40, 40)), keep(new THREE.ShadowMaterial({ opacity: 0.18 })));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.16;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── Fixtures ───────────────────────────────────────────────────────
    const vanity = vanityModel(materials);
    const screen = showerScreenModel(materials);
    const rain = rainShowerModel(materials);
    const mixer = exposedMixerModel(materials);
    const concealed = concealedTapModel(materials);
    const drain = drainModel(materials);
    const niche = nicheModel(materials);
    const toilet = toiletModel(materials);
    const handBasin = handBasinModel(materials);
    const radiator = radiatorModel(materials);
    const sockets = new THREE.Group();
    sockets.add(socketModel(materials), socketModel(materials));
    const ceiling = new THREE.Group();
    const bulkheadBack = new THREE.Mesh(box, materials.plaster);
    const bulkheadSide = new THREE.Mesh(box, materials.plaster);
    const shadowGapBack = new THREE.Mesh(box, materials.black);
    const shadowGapSide = new THREE.Mesh(box, materials.black);
    [bulkheadBack, bulkheadSide].forEach((mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; });
    ceiling.add(bulkheadBack, bulkheadSide, shadowGapBack, shadowGapSide);
    const spots = Array.from({ length: 4 }, () => spotModel(materials));
    // Two real lights for the four spots: each light costs on every pixel.
    const spotLights = spots.map((_, index) => {
      const light = new THREE.SpotLight('#ffd9a0', 0, 5, 0.85, 0.75, 1.6);
      if (index % 2 === 0) scene.add(light, light.target);
      return light;
    });
    let heating: THREE.Mesh | null = null;
    let heatingSize = '';

    // Aluminium edge profiles on outside corners; mitred tiling ("verstek") has none.
    const profileGeometry = keep(new THREE.BoxGeometry(0.012, 1, 0.012));
    const toiletProfiles = [-0.45, 0.45].map((x) => {
      const mesh = new THREE.Mesh(profileGeometry, profileMaterial);
      mesh.scale.y = 1.15;
      mesh.position.set(x, 0.575, 0.24);
      toilet.add(mesh);
      return mesh;
    });
    const nicheProfiles = [-0.3, 0.3].map((x) => {
      const mesh = new THREE.Mesh(profileGeometry, profileMaterial);
      mesh.scale.y = 0.34;
      mesh.position.set(x, 0, 0.1);
      niche.add(mesh);
      return mesh;
    });

    scene.add(vanity, screen, rain, mixer, concealed, drain, niche, toilet, handBasin, radiator, sockets, ceiling, ...spots);

    // Optional parts grow in and out instead of popping.
    type Feature = { object: THREE.Object3D; value: number; target: number; base: THREE.Vector3 };
    const features = new Map<THREE.Object3D, Feature>();
    [vanity, screen, rain, mixer, concealed, drain, niche, toilet, handBasin, radiator, sockets, ceiling, ...spots].forEach((object) => {
      features.set(object, { object, value: 0, target: 0, base: new THREE.Vector3(1, 1, 1) });
    });
    const show = (object: THREE.Object3D, visible: boolean) => {
      const feature = features.get(object);
      if (feature) feature.target = visible ? 1 : 0;
    };

    // ── Dimension lines ────────────────────────────────────────────────
    const lineMaterial = keep(new THREE.LineBasicMaterial({ color: '#4a3f35', transparent: true, opacity: 0.85 }));
    const dimensionLine = () => {
      const geometry = keep(new THREE.BufferGeometry());
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Array(18).fill(0), 3));
      const line = new THREE.LineSegments(geometry, lineMaterial);
      scene.add(line);
      return line;
    };
    const setLine = (line: THREE.LineSegments, from: THREE.Vector3, to: THREE.Vector3, tick: THREE.Vector3) => {
      const position = line.geometry.getAttribute('position') as THREE.BufferAttribute;
      const values = [from, to, from.clone().sub(tick), from.clone().add(tick), to.clone().sub(tick), to.clone().add(tick)];
      values.forEach((point, index) => position.setXYZ(index, point.x, point.y, point.z));
      position.needsUpdate = true;
      line.geometry.computeBoundingSphere();
    };
    // Dimension labels are HTML on top of the canvas: crisp text, and they
    // stay out of the ambient-occlusion pass.
    const label = () => {
      const element = document.createElement('span');
      element.setAttribute('aria-hidden', 'true');
      element.style.cssText = 'position:absolute;left:0;top:0;padding:3px 10px;border-radius:999px;background:#231A12;color:#f7f2ea;font:600 12px/1.3 "DM Sans",system-ui,sans-serif;white-space:nowrap;pointer-events:none;will-change:transform';
      container.appendChild(element);
      const anchor = new THREE.Vector3();
      return {
        anchor,
        set(text: string) {
          if (element.textContent !== text) element.textContent = text;
        },
        place() {
          const projected = anchor.clone().project(camera);
          const x = ((projected.x + 1) / 2) * container.clientWidth;
          const y = ((1 - projected.y) / 2) * container.clientHeight;
          element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          element.style.visibility = projected.z < 1 ? 'visible' : 'hidden';
        },
        remove() {
          element.remove();
        },
      };
    };
    const lengthLine = dimensionLine();
    const widthLine = dimensionLine();
    const lengthLabel = label();
    const widthLabel = label();

    // ── Layout ─────────────────────────────────────────────────────────
    let target: Target = { roomType: 'badkamer', length: 3, width: 2.2, options: new Set() };
    const current = { length: 3, width: 2.2 };
    let mood = 0;
    let moodTarget = 0;

    const layout = (length: number, width: number) => {
      const halfL = length / 2;
      const halfW = width / 2;
      const bathroom = target.roomType === 'badkamer';
      const has = (id: string) => target.options.has(id);

      plinth.scale.set(length + 0.5, 0.14, width + 0.5);
      plinth.position.set(0.15, -0.15, 0.15);
      floor.scale.set(length + WALL, 0.08, width + WALL);
      floor.position.set(-WALL / 2, -0.04, -WALL / 2);
      floorTiles.map.repeat.set(length / 1.2, width / 1.2);
      floorTiles.bumpMap.repeat.copy(floorTiles.map.repeat);
      backWall.scale.set(length + WALL, HEIGHT, WALL);
      backWall.position.set(-WALL / 2, HEIGHT / 2, -halfW - WALL / 2);
      backTiles.map.repeat.set(length / 0.6, HEIGHT / 2.4);
      backTiles.bumpMap.repeat.copy(backTiles.map.repeat);
      sideWall.scale.set(WALL, HEIGHT, width);
      sideWall.position.set(-halfL - WALL / 2, HEIGHT / 2, 0);
      sideTiles.map.repeat.set(width / 0.6, HEIGHT / 2.4);
      sideTiles.bumpMap.repeat.copy(sideTiles.map.repeat);

      // Bathroom: shower in the back-left corner, vanity on the back wall,
      // toilet on the side wall when the room is deep enough.
      const showerWidth = Math.min(1.0, length * 0.38);
      const showerDepth = Math.min(1.15, width * 0.58);
      show(screen, bathroom);
      screen.position.set(-halfL + showerWidth, 0, -halfW);
      const glassPane = screen.getObjectByName('glass') as THREE.Mesh;
      glassPane.scale.z = showerDepth;
      glassPane.position.z = showerDepth / 2;
      const topProfile = screen.getObjectByName('profile') as THREE.Mesh;
      topProfile.scale.z = showerDepth;
      topProfile.position.z = showerDepth / 2;
      show(rain, bathroom);
      rain.position.set(-halfL + showerWidth / 2, 0, -halfW);
      show(mixer, bathroom && !has('inbouwkraan'));
      mixer.position.set(-halfL + showerWidth / 2, 0, -halfW);
      show(concealed, has('inbouwkraan'));
      if (bathroom) {
        concealed.position.set(-halfL, 0, -halfW + showerDepth / 2);
        concealed.rotation.y = Math.PI / 2;
      } else {
        concealed.position.set(halfL - 0.2, -0.25, -halfW);
        concealed.rotation.y = 0;
      }
      show(drain, has('drain'));
      drain.position.set(bathroom ? -halfL + showerWidth / 2 : 0, 0, bathroom ? -halfW + 0.1 : halfW - 0.15);
      (drain.getObjectByName('grate') as THREE.Mesh).scale.x = bathroom ? Math.max(0.5, showerWidth - 0.2) : Math.min(0.6, length - 0.4);

      show(vanity, bathroom);
      const vanityX = Math.min(halfL - 0.58, Math.max(-halfL + showerWidth + 0.6, halfL * 0.2));
      vanity.position.set(vanityX, 0, -halfW);
      show(radiator, bathroom && halfL - (vanityX + 0.5) > 0.6);
      radiator.position.set(halfL - 0.35, 0, -halfW);

      const wallHung = has('hangtoilet_systeem') || has('geberit_duofix') || has('inbouwreservoir');
      const boxedIn = has('hangtoilet_systeem') || has('toiletframe_ombouwen');
      show(toilet, bathroom ? width >= 1.7 : true);
      if (bathroom) {
        toilet.position.set(-halfL, 0, Math.min(halfW - 0.5, -halfW + showerDepth + 0.55));
        toilet.rotation.y = Math.PI / 2;
      } else {
        toilet.position.set(0, 0, -halfW);
        toilet.rotation.y = 0;
      }
      const wallFace = boxedIn ? 0.24 : wallHung ? 0.11 : 0.17;
      const bowl = toilet.getObjectByName('bowl') as THREE.Mesh;
      bowl.position.set(0, wallHung ? 0.15 : 0.12, wallFace + 0.27);
      (toilet.getObjectByName('lid') as THREE.Mesh).position.set(0, bowl.position.y + 0.285, wallFace + 0.28);
      (toilet.getObjectByName('pedestal') as THREE.Mesh).visible = !wallHung;
      (toilet.getObjectByName('pedestal') as THREE.Mesh).position.z = wallFace + 0.24;
      (toilet.getObjectByName('cistern') as THREE.Mesh).visible = !wallHung && !boxedIn;
      (toilet.getObjectByName('boxing') as THREE.Mesh).visible = boxedIn;
      (toilet.getObjectByName('shelf') as THREE.Mesh).visible = boxedIn;
      (toilet.getObjectByName('frame') as THREE.Mesh).visible = wallHung && !boxedIn;
      const plate = toilet.getObjectByName('plate') as THREE.Group;
      plate.visible = wallHung || boxedIn;
      plate.position.set(0, 0.95, boxedIn ? 0.247 : 0.117);
      toiletProfiles.forEach((profile) => { profile.visible = boxedIn && !has('tegelwerk_verstek'); });

      show(handBasin, !bathroom);
      handBasin.position.set(-halfL, 0, Math.max(-halfW + 0.35, halfW - 0.3));
      handBasin.rotation.y = Math.PI / 2;

      show(niche, has('niche'));
      niche.position.set(bathroom ? -halfL + showerWidth / 2 : 0, bathroom ? 1.3 : 1.62, -halfW);
      nicheProfiles.forEach((profile) => { profile.visible = !has('tegelwerk_verstek'); });

      // Ceiling: a lowered ceiling becomes a bulkhead along both walls;
      // spotlights alone sit in a slim band.
      const lowered = has('verlaagd_plafond');
      const withSpots = has('spotjes');
      show(ceiling, lowered || withSpots);
      ceiling.position.set(-halfL, HEIGHT, -halfW);
      const depth = lowered ? 0.5 : 0.18;
      const thickness = lowered ? 0.22 : 0.08;
      bulkheadBack.scale.set(length, thickness, depth);
      bulkheadBack.position.set(halfL, -thickness / 2, depth / 2);
      bulkheadSide.scale.set(depth, thickness, width - depth);
      bulkheadSide.position.set(depth / 2, -thickness / 2, depth + (width - depth) / 2);
      shadowGapBack.scale.set(length, 0.012, 0.02);
      shadowGapBack.position.set(halfL, -thickness - 0.006, depth - 0.01);
      shadowGapSide.scale.set(0.02, 0.012, width - depth);
      shadowGapSide.position.set(depth - 0.01, -thickness - 0.006, depth + (width - depth) / 2);
      spots.forEach((spot, index) => {
        show(spot, withSpots);
        const along = index < 2 ? -halfL + length * (index === 0 ? 0.3 : 0.72) : -halfW + depth + (width - depth) * (index === 2 ? 0.35 : 0.78);
        if (index < 2) spot.position.set(along, HEIGHT - thickness - 0.004, -halfW + depth / 2);
        else spot.position.set(-halfL + depth / 2, HEIGHT - thickness - 0.004, along);
        spotLights[index].position.copy(spot.position);
        spotLights[index].target.position.set(spot.position.x + 0.15, 0, spot.position.z + 0.15);
      });

      sockets.position.set(halfL - 0.3, bathroom ? 1.15 : 1.1, -halfW);
      sockets.children[1].position.x = -0.1;
      show(sockets, has('elektra'));

      // Heating cable, rebuilt only when the room size settles on a new value.
      const heatingKey = `${target.length.toFixed(2)}x${target.width.toFixed(2)}`;
      if (has('vloerverwarming') && heatingKey !== heatingSize) {
        if (heating) {
          scene.remove(heating);
          heating.geometry.dispose();
        }
        heating = heatingModel(materials, target.length, target.width);
        scene.add(heating);
        heatingSize = heatingKey;
      }
      if (heating) {
        heating.visible = has('vloerverwarming');
        heating.scale.set(length / target.length, 1, width / target.width);
      }

      // Dimension lines just in front of the floor edges.
      setLine(lengthLine, new THREE.Vector3(-halfL, 0.01, halfW + 0.3), new THREE.Vector3(halfL, 0.01, halfW + 0.3), new THREE.Vector3(0, 0, 0.08));
      setLine(widthLine, new THREE.Vector3(halfL + 0.3, 0.01, -halfW), new THREE.Vector3(halfL + 0.3, 0.01, halfW), new THREE.Vector3(0.08, 0, 0));
      lengthLabel.set(labelRef.current(target.length));
      widthLabel.set(labelRef.current(target.width));
      lengthLabel.anchor.set(0, 0.02, halfW + 0.3);
      widthLabel.anchor.set(halfL + 0.3, 0.02, 0);

      // Sun and shadow area follow the room size.
      const span = Math.max(length, width) + 1.5;
      sun.position.set(span * 0.9, span * 1.6, span * 1.2);
      sun.target.position.set(0, 0, 0);
      const shadowCamera = sun.shadow.camera;
      shadowCamera.left = -span;
      shadowCamera.right = span;
      shadowCamera.top = span;
      shadowCamera.bottom = -span;
      shadowCamera.far = span * 5;
      shadowCamera.updateProjectionMatrix();
    };

    const applyMood = () => {
      hemisphere.intensity = mix(day.hemi, evening.hemi, mood);
      sun.intensity = mix(day.sun, evening.sun, mood);
      (scene.background as THREE.Color).copy(day.background).lerp(evening.background, mood);
      renderer.toneMappingExposure = mix(day.exposure, evening.exposure, mood);
      glow.emissiveIntensity = mix(day.glow, evening.glow, mood);
      scene.environmentIntensity = mix(day.env, evening.env, mood);
      const spotStrength = mix(day.spot, evening.spot, mood);
      spots.forEach((spot, index) => { spotLights[index].intensity = spotStrength * (features.get(spot)?.value ?? 0); });
      const halo = vanity.getObjectByName('halo') as THREE.Mesh | undefined;
      if (halo) halo.visible = mood > 0.05 || target.options.has('spotjes');
    };

    // ── Camera ─────────────────────────────────────────────────────────
    const intro = { active: !reducedMotion, progress: 0 };
    // Distance that keeps the whole room in view, a little further on narrow screens.
    const framing = () => {
      const size = Math.max(target.length, target.width, 1.4);
      return (2.0 + size * 1.25) * Math.max(1, 1.5 / camera.aspect);
    };
    const restingPosition = () => {
      const distance = framing();
      return new THREE.Vector3(distance * 0.6, 0.9 + distance * 0.62, distance * 0.68);
    };
    const frameCamera = (snap: boolean) => {
      const distance = framing();
      controls.target.set(0, 0.95, 0);
      controls.minDistance = distance * 0.55;
      controls.maxDistance = distance * 1.7;
      if (snap) camera.position.copy(restingPosition());
      else {
        const direction = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(direction, distance);
      }
      controls.update();
    };

    // ── Render loop (only while something moves) ───────────────────────
    let frameRequested = false;
    let running = true;
    let introStart = 0;
    let sceneDirty = true;
    const render = (now: number) => {
      frameRequested = false;
      if (!running) return;
      let busy = false;

      const step = reducedMotion ? 1 : 0.16;
      const lengthDone = Math.abs(current.length - target.length) < 0.002;
      const widthDone = Math.abs(current.width - target.width) < 0.002;
      current.length = lengthDone ? target.length : mix(current.length, target.length, step);
      current.width = widthDone ? target.width : mix(current.width, target.width, step);
      busy ||= !lengthDone || !widthDone;

      features.forEach((feature) => {
        if (Math.abs(feature.value - feature.target) < 0.004) feature.value = feature.target;
        else {
          feature.value = reducedMotion ? feature.target : mix(feature.value, feature.target, 0.2);
          busy = true;
        }
        const eased = feature.value === 1 ? 1 : 1 - Math.pow(1 - feature.value, 3);
        feature.object.visible = feature.value > 0.01;
        feature.object.scale.copy(feature.base).multiplyScalar(Math.max(0.001, eased));
      });

      if (Math.abs(mood - moodTarget) < 0.003) mood = moodTarget;
      else {
        mood = reducedMotion ? moodTarget : mix(mood, moodTarget, 0.12);
        busy = true;
      }

      // Rebuild the room only while something in it changes; camera moves just redraw.
      if (sceneDirty || busy) {
        layout(current.length, current.width);
        applyMood();
        renderer.shadowMap.needsUpdate = true;
        sceneDirty = false;
      }

      if (intro.active) {
        if (!introStart) introStart = now;
        intro.progress = Math.min(1, (now - introStart) / 1500);
        const eased = 1 - Math.pow(1 - intro.progress, 3);
        const rest = restingPosition();
        const start = rest.clone().multiplyScalar(1.7).add(new THREE.Vector3(-1.2, 1.4, 0));
        camera.position.lerpVectors(start, rest, eased);
        camera.lookAt(controls.target);
        if (intro.progress >= 1) intro.active = false;
        busy = true;
      }

      const moved = controls.update();
      lengthLabel.place();
      widthLabel.place();
      renderer.render(scene, camera);
      if (busy || moved) requestRender();
    };
    const requestRender = () => {
      if (frameRequested || !running) return;
      frameRequested = true;
      requestAnimationFrame(render);
    };
    controls.addEventListener('change', requestRender);
    controls.addEventListener('start', () => { intro.active = false; });

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      requestRender();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    controllerRef.current = {
      setTarget(next) {
        const resized = Math.abs(next.length - target.length) > 0.01 || Math.abs(next.width - target.width) > 0.01;
        target = next;
        sceneDirty = true;
        if (resized && !intro.active) frameCamera(false);
        requestRender();
      },
      setEvening(on) {
        moodTarget = on ? 1 : 0;
        sceneDirty = true;
        requestRender();
      },
      resetView() {
        intro.active = false;
        frameCamera(true);
        requestRender();
      },
    };
    frameCamera(true);

    return () => {
      running = false;
      controllerRef.current = null;
      observer.disconnect();
      controls.dispose();
      lengthLabel.remove();
      widthLabel.remove();
      if (heating) heating.geometry.dispose();
      disposeModelGeometries();
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const optionKey = optionIds.join('|');
  useEffect(() => {
    controllerRef.current?.setTarget({
      roomType,
      length: length ?? (roomType === 'wc' ? 1.4 : 3),
      width: width ?? (roomType === 'wc' ? 0.95 : 2.2),
      options: new Set(optionKey ? optionKey.split('|') : []),
    });
  }, [roomType, length, width, optionKey]);

  useEffect(() => {
    controllerRef.current?.setEvening(isEvening);
  }, [isEvening]);

  if (failed) return null;
  return (
    <figure className="relative overflow-hidden">
      <div ref={containerRef} className="relative aspect-[4/3] w-full cursor-grab active:cursor-grabbing sm:aspect-[16/10]" />
      <div className="absolute right-2 top-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => setIsEvening((value) => !value)}
          aria-pressed={isEvening}
          className="inline-flex h-10 items-center gap-1.5 bg-denra-ivory/90 px-3 text-[13px] font-medium text-denra-ink shadow-sm backdrop-blur hover:bg-white"
        >
          {isEvening ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          {isEvening ? labels.day : labels.evening}
        </button>
        <button
          type="button"
          onClick={() => controllerRef.current?.resetView()}
          aria-label={labels.reset}
          title={labels.reset}
          className="inline-flex h-10 w-10 items-center justify-center bg-denra-ivory/90 text-denra-ink shadow-sm backdrop-blur hover:bg-white"
        >
          <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  );
}
