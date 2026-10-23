import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { RoomType } from '../lib/calculator';

interface RoomPreview3DProps {
  roomType: RoomType;
  /** Metres; falls back to a typical size until valid dimensions are entered. */
  length: number | null;
  width: number | null;
  optionIds: string[];
  /** Text alternative for screen readers. */
  description: string;
  dimensionLabel: (value: number) => string;
}

interface Target {
  roomType: RoomType;
  length: number;
  width: number;
  options: Set<string>;
}

const HEIGHT = 2.6;
const WALL = 0.1;
const colors = {
  floor: '#cfc5b6',
  floorLine: '#bdb2a2',
  wall: '#ebe4d9',
  wallLine: '#dcd3c6',
  wood: '#8a6a4b',
  white: '#f6f4f0',
  brass: '#b38d55',
  dark: '#2b241d',
  warm: '#ffcf8a',
};

/** A tile pattern drawn on a canvas, so no image files are needed. */
function tileTexture(base: string, line: string, columns: number, rows: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.fillStyle = base;
  context.fillRect(0, 0, 256, 256);
  context.strokeStyle = line;
  context.lineWidth = 3;
  for (let column = 0; column <= columns; column += 1) {
    context.beginPath();
    context.moveTo((column * 256) / columns, 0);
    context.lineTo((column * 256) / columns, 256);
    context.stroke();
  }
  for (let row = 0; row <= rows; row += 1) {
    context.beginPath();
    context.moveTo(0, (row * 256) / rows);
    context.lineTo(256, (row * 256) / rows);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function labelSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true }));
  sprite.scale.set(0.8, 0.3, 1);
  sprite.renderOrder = 10;
  let current = '';
  const setText = (text: string) => {
    if (text === current) return;
    current = text;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, 256, 96);
    context.fillStyle = 'rgba(35, 26, 18, 0.88)';
    context.beginPath();
    context.roundRect(16, 14, 224, 68, 8);
    context.fill();
    context.fillStyle = '#f7f2ea';
    context.font = '500 40px "DM Sans", system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 128, 50);
    texture.needsUpdate = true;
  };
  return { sprite, setText };
}

/**
 * Indicative 3D preview of the room being priced: it follows the entered
 * size and shows the chosen options. Built with plain three.js and loaded
 * only on the calculator page.
 */
export default function RoomPreview3D({ roomType, length, width, optionIds, description, dimensionLabel }: RoomPreview3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setTargetRef = useRef<((target: Target) => void) | null>(null);
  const labelRef = useRef(dimensionLabel);
  labelRef.current = dimensionLabel;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      setFailed(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 1.2;
    controls.minAzimuthAngle = 0.12;
    controls.maxAzimuthAngle = 1.45;
    controls.autoRotate = false;

    // Light: soft daylight plus a sun for gentle shadows.
    scene.add(new THREE.HemisphereLight('#fff8ee', '#b9ab98', 1.6));
    const sun = new THREE.DirectionalLight('#fff4e2', 1.6);
    sun.position.set(4, 7, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -6;
    sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -6;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const disposables: { dispose: () => void }[] = [];
    const material = (options: THREE.MeshStandardMaterialParameters) => {
      const created = new THREE.MeshStandardMaterial(options);
      disposables.push(created);
      return created;
    };
    const box = new THREE.BoxGeometry(1, 1, 1);
    const cylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const sphere = new THREE.SphereGeometry(0.5, 32, 16);
    disposables.push(box, cylinder, sphere);
    const mesh = (geometry: THREE.BufferGeometry, meshMaterial: THREE.Material, parent: THREE.Object3D = scene) => {
      const created = new THREE.Mesh(geometry, meshMaterial);
      created.castShadow = true;
      created.receiveShadow = true;
      parent.add(created);
      return created;
    };

    const floorTexture = tileTexture(colors.floor, colors.floorLine, 2, 2);
    const backWallTexture = tileTexture(colors.wall, colors.wallLine, 2, 4);
    const sideWallTexture = tileTexture(colors.wall, colors.wallLine, 2, 4);
    disposables.push(floorTexture, backWallTexture, sideWallTexture);

    const floorMaterial = material({ map: floorTexture, roughness: 0.75, emissive: '#ff8a3d', emissiveIntensity: 0 });
    const floor = mesh(box, floorMaterial);
    const backWall = mesh(box, material({ map: backWallTexture, roughness: 0.9 }));
    const sideWall = mesh(box, material({ map: sideWallTexture, roughness: 0.9 }));
    const plainWhite = material({ color: colors.white, roughness: 0.25 });
    const wood = material({ color: colors.wood, roughness: 0.6 });
    const brass = material({ color: colors.brass, metalness: 0.85, roughness: 0.3 });
    const dark = material({ color: colors.dark, roughness: 0.5 });
    const glow = material({ color: colors.warm, emissive: colors.warm, emissiveIntensity: 2.2 });
    const glass = new THREE.MeshPhysicalMaterial({ color: '#dfe9e8', transparent: true, opacity: 0.22, roughness: 0.05, transmission: 0.6, thickness: 0.01 });
    // No environment map to reflect, so the mirror gets a soft glow instead of metalness.
    const mirror = material({ color: '#dfe6e6', metalness: 0.1, roughness: 0.12, emissive: '#e8eeee', emissiveIntensity: 0.35 });
    disposables.push(glass);

    // Vertical mitred corner: a fine light edge where the two walls meet.
    const corner = mesh(box, material({ color: '#fbf8f2', roughness: 0.3 }));

    // Bathroom furniture.
    const vanity = new THREE.Group();
    scene.add(vanity);
    mesh(box, wood, vanity).scale.set(1, 0.5, 0.46);
    vanity.children[0].position.y = 0.6;
    const basin = mesh(cylinder, plainWhite, vanity);
    basin.scale.set(0.42, 0.14, 0.36);
    basin.position.set(0, 0.92, 0.02);
    const vanityMirror = mesh(box, mirror, vanity);
    vanityMirror.scale.set(0.8, 0.9, 0.02);
    vanityMirror.position.set(0, 1.6, -0.21);
    const vanityTap = mesh(cylinder, brass, vanity);
    vanityTap.scale.set(0.03, 0.22, 0.03);
    vanityTap.position.set(0, 1.08, -0.16);

    const shower = new THREE.Group();
    scene.add(shower);
    const showerGlass = mesh(box, glass, shower);
    showerGlass.scale.set(0.012, 2.0, 1);
    showerGlass.castShadow = false;
    const showerHead = mesh(cylinder, brass, shower);
    showerHead.scale.set(0.24, 0.02, 0.24);
    const showerArm = mesh(cylinder, brass, shower);
    showerArm.scale.set(0.02, 0.32, 0.02);
    showerArm.rotation.x = Math.PI / 2;
    const drain = mesh(box, dark, shower);
    drain.scale.set(0.8, 0.012, 0.06);
    const concealedTap = new THREE.Group();
    shower.add(concealedTap);
    mesh(box, brass, concealedTap).scale.set(0.16, 0.16, 0.012);
    const tapLever = mesh(cylinder, brass, concealedTap);
    tapLever.scale.set(0.025, 0.12, 0.025);
    tapLever.rotation.x = Math.PI / 2;
    tapLever.position.z = 0.06;

    const niche = new THREE.Group();
    scene.add(niche);
    mesh(box, material({ color: '#d8cfc2', roughness: 0.9 }), niche).scale.set(0.6, 0.32, 0.06);
    const nicheLight = mesh(box, glow, niche);
    nicheLight.scale.set(0.58, 0.012, 0.012);
    nicheLight.position.set(0, 0.155, 0.02);
    const nicheBottle = mesh(cylinder, dark, niche);
    nicheBottle.scale.set(0.05, 0.14, 0.05);
    nicheBottle.position.set(-0.15, -0.09, 0.02);

    // Toilet variants.
    const toilet = new THREE.Group();
    scene.add(toilet);
    const bowl = mesh(sphere, plainWhite, toilet);
    bowl.scale.set(0.38, 0.32, 0.55);
    const pedestal = mesh(cylinder, plainWhite, toilet);
    pedestal.scale.set(0.24, 0.36, 0.3);
    pedestal.position.y = 0.18;
    const cistern = mesh(box, plainWhite, toilet);
    cistern.scale.set(0.4, 0.4, 0.17);
    const boxing = mesh(box, material({ color: '#e1d8cb', roughness: 0.85 }), toilet);
    boxing.scale.set(0.9, 1.15, 0.22);
    const flushPlate = mesh(box, brass, toilet);
    flushPlate.scale.set(0.24, 0.16, 0.012);
    const frame = mesh(box, material({ color: '#7d8a8f', metalness: 0.4, roughness: 0.5 }), toilet);
    frame.scale.set(0.5, 1.1, 0.1);

    const handBasin = mesh(box, plainWhite);
    handBasin.scale.set(0.36, 0.12, 0.24);

    // Ceiling details along the two walls (a section through the room).
    const bulkhead = new THREE.Group();
    scene.add(bulkhead);
    const bulkheadBack = mesh(box, material({ color: '#f1ece4', roughness: 0.9 }), bulkhead);
    const bulkheadSide = mesh(box, bulkheadBack.material as THREE.Material, bulkhead);
    const spots: THREE.Mesh[] = [];
    const spotLights: THREE.PointLight[] = [];
    const disc = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 20);
    disposables.push(disc);
    for (let index = 0; index < 4; index += 1) {
      spots.push(mesh(disc, glow));
      const light = new THREE.PointLight(colors.warm, 0, 3, 2);
      spotLights.push(light);
      scene.add(light);
    }

    const sockets = [mesh(box, plainWhite), mesh(box, plainWhite)];
    sockets.forEach((socket) => socket.scale.set(0.09, 0.09, 0.015));

    const lengthLabel = labelSprite();
    const widthLabel = labelSprite();
    scene.add(lengthLabel.sprite, widthLabel.sprite);
    disposables.push(lengthLabel.sprite.material, widthLabel.sprite.material, (lengthLabel.sprite.material as THREE.SpriteMaterial).map as THREE.Texture, (widthLabel.sprite.material as THREE.SpriteMaterial).map as THREE.Texture);

    let target: Target = { roomType: 'badkamer', length: 3, width: 2.2, options: new Set() };
    const current = { length: 3, width: 2.2 };
    let options = target.options;
    let cameraFramed = false;

    const layout = (length: number, width: number) => {
      const halfL = length / 2;
      const halfW = width / 2;
      const bathroom = target.roomType === 'badkamer';
      const has = (id: string) => options.has(id);

      floor.scale.set(length + WALL, 0.08, width + WALL);
      floor.position.set(0, -0.04, 0);
      floorTexture.repeat.set(length / 0.6, width / 0.6);
      backWall.scale.set(length + WALL, HEIGHT, WALL);
      backWall.position.set(0, HEIGHT / 2, -halfW - WALL / 2);
      backWallTexture.repeat.set(length / 0.6, HEIGHT / 0.6);
      sideWall.scale.set(WALL, HEIGHT, width);
      sideWall.position.set(-halfL - WALL / 2, HEIGHT / 2, WALL / 2 - WALL / 2);
      sideWallTexture.repeat.set(width / 0.6, HEIGHT / 0.6);
      corner.visible = has('tegelwerk_verstek');
      corner.scale.set(0.025, HEIGHT, 0.025);
      corner.position.set(-halfL + 0.012, HEIGHT / 2, -halfW + 0.012);

      floorMaterial.emissiveIntensity = has('vloerverwarming') ? 0.16 : 0;

      // Shower in the back-left corner of a bathroom; toilet and basin elsewhere.
      const showerDepth = Math.min(1.2, width * 0.6);
      const showerWidth = Math.min(1.1, length * 0.4);
      shower.visible = bathroom;
      showerGlass.scale.z = showerDepth;
      showerGlass.position.set(-halfL + showerWidth, 1.0, -halfW + showerDepth / 2);
      showerHead.position.set(-halfL + showerWidth / 2, 2.05, -halfW + 0.32);
      showerArm.position.set(-halfL + showerWidth / 2, 2.07, -halfW + 0.16);
      drain.visible = has('drain');
      drain.scale.x = Math.max(0.5, showerWidth - 0.2);
      drain.position.set(-halfL + showerWidth / 2, 0.006, -halfW + 0.12);
      concealedTap.visible = has('inbouwkraan');
      concealedTap.position.set(-halfL + 0.008, 1.1, -halfW + showerDepth / 2);
      concealedTap.rotation.y = Math.PI / 2;

      vanity.visible = bathroom;
      vanity.position.set(Math.min(halfL - 0.65, Math.max(-halfL + showerWidth + 0.6, halfL * 0.25)), 0, -halfW + 0.23);

      niche.visible = has('niche');
      niche.position.set(bathroom ? -halfL + showerWidth / 2 : 0, bathroom ? 1.25 : 1.55, -halfW + 0.02);
      nicheLight.visible = true;

      const wallHung = has('hangtoilet_systeem') || has('geberit_duofix') || has('inbouwreservoir');
      const boxedIn = has('hangtoilet_systeem') || has('toiletframe_ombouwen');
      const toiletOnSide = bathroom;
      toilet.visible = bathroom ? width >= 1.7 : true;
      if (toiletOnSide) {
        toilet.position.set(-halfL, 0, Math.min(halfW - 0.5, -halfW + showerDepth + 0.55));
        toilet.rotation.y = Math.PI / 2;
      } else {
        toilet.position.set(0, 0, -halfW);
        toilet.rotation.y = 0;
      }
      bowl.position.set(0, wallHung ? 0.42 : 0.4, boxedIn ? 0.5 : 0.36);
      pedestal.visible = !wallHung;
      pedestal.position.z = 0.34;
      cistern.visible = !wallHung && !boxedIn;
      cistern.position.set(0, 0.62, 0.1);
      boxing.visible = boxedIn;
      boxing.position.set(0, 0.575, 0.11);
      flushPlate.visible = boxedIn || wallHung;
      flushPlate.position.set(0, 0.95, boxedIn ? 0.225 : 0.02);
      frame.visible = wallHung && !boxedIn;
      frame.position.set(0, 0.55, 0.06);

      handBasin.visible = !bathroom;
      handBasin.position.set(halfL - 0.2, 0.85, -halfW + 0.42);

      const lowered = has('verlaagd_plafond');
      const withSpots = has('spotjes');
      bulkhead.visible = lowered || withSpots;
      const depth = lowered ? 0.42 : 0.16;
      bulkheadBack.scale.set(length, 0.2, depth);
      bulkheadBack.position.set(0, HEIGHT - 0.1, -halfW + depth / 2);
      bulkheadSide.scale.set(depth, 0.2, width - depth);
      bulkheadSide.position.set(-halfL + depth / 2, HEIGHT - 0.1, depth / 2);
      spots.forEach((spot, index) => {
        spot.visible = withSpots;
        const along = index < 2 ? -halfL + length * (index === 0 ? 0.3 : 0.72) : -halfW + width * (index === 2 ? 0.45 : 0.8);
        if (index < 2) spot.position.set(along, HEIGHT - 0.205, -halfW + depth / 2);
        else spot.position.set(-halfL + depth / 2, HEIGHT - 0.205, along);
        spotLights[index].intensity = withSpots ? 1.2 : 0;
        spotLights[index].position.copy(spot.position).y -= 0.15;
      });

      sockets.forEach((socket, index) => {
        socket.visible = has('elektra');
        socket.position.set(halfL - 0.25 - index * 0.12, bathroom ? 1.15 : 1.1, -halfW + 0.008);
      });

      lengthLabel.setText(labelRef.current(target.length));
      widthLabel.setText(labelRef.current(target.width));
      lengthLabel.sprite.position.set(0, 0.08, halfW + 0.35);
      widthLabel.sprite.position.set(halfL + 0.45, 0.08, 0);
    };

    // Keeps the whole room in view: same viewing angle, distance follows the size.
    const frameCamera = (immediate: boolean) => {
      const size = Math.max(target.length, target.width, 1.4);
      const distance = 2.2 + size * 1.25;
      controls.target.set(0, 1.0, 0);
      controls.minDistance = distance * 0.6;
      controls.maxDistance = distance * 1.6;
      if (immediate || !cameraFramed) {
        camera.position.set(distance * 0.62, 1.0 + distance * 0.62, distance * 0.62);
        cameraFramed = true;
      } else {
        const direction = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(direction, distance);
      }
      controls.update();
    };

    let frameRequested = false;
    let running = true;
    const render = () => {
      frameRequested = false;
      if (!running) return;
      const done = Math.abs(current.length - target.length) < 0.002 && Math.abs(current.width - target.width) < 0.002;
      if (done) {
        current.length = target.length;
        current.width = target.width;
      } else {
        current.length += (target.length - current.length) * 0.16;
        current.width += (target.width - current.width) * 0.16;
      }
      layout(current.length, current.width);
      const moved = controls.update();
      renderer.render(scene, camera);
      if (!done || moved) requestRender();
    };
    const requestRender = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(render);
    };
    controls.addEventListener('change', requestRender);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      requestRender();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    setTargetRef.current = (next) => {
      const resized = Math.abs(next.length - target.length) > 0.01 || Math.abs(next.width - target.width) > 0.01;
      target = next;
      options = next.options;
      if (reducedMotion) {
        current.length = next.length;
        current.width = next.width;
      }
      if (resized) frameCamera(false);
      requestRender();
    };
    frameCamera(true);

    return () => {
      running = false;
      setTargetRef.current = null;
      observer.disconnect();
      controls.dispose();
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const optionKey = optionIds.join('|');
  useEffect(() => {
    setTargetRef.current?.({
      roomType,
      length: length ?? (roomType === 'wc' ? 1.4 : 3),
      width: width ?? (roomType === 'wc' ? 0.95 : 2.2),
      options: new Set(optionKey ? optionKey.split('|') : []),
    });
  }, [roomType, length, width, optionKey]);

  if (failed) return null;
  return (
    <figure className="relative">
      <div ref={containerRef} className="aspect-[4/3] w-full cursor-grab bg-[radial-gradient(circle_at_50%_35%,#fbf8f3,#e9e1d5)] active:cursor-grabbing" />
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  );
}
