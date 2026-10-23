import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Fixtures for the 3D room preview, built from simple shapes. Every builder
// returns a group whose origin is where it attaches (floor or wall), facing
// +z, so the scene can place and animate it as one piece.

export interface RoomMaterials {
  ceramic: THREE.Material;
  brass: THREE.Material;
  black: THREE.Material;
  wood: THREE.Material;
  stone: THREE.Material;
  glass: THREE.Material;
  mirror: THREE.Material;
  glow: THREE.MeshStandardMaterial;
  plaster: THREE.Material;
  steel: THREE.Material;
  grate: THREE.Material;
  leaf: THREE.Material;
  pot: THREE.Material;
  heat: THREE.MeshStandardMaterial;
  inset: THREE.Material;
}

const geometries: THREE.BufferGeometry[] = [];
function keep<T extends THREE.BufferGeometry>(geometry: T): T {
  geometries.push(geometry);
  return geometry;
}
export function disposeModelGeometries() {
  geometries.splice(0).forEach((geometry) => geometry.dispose());
}

function add(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number], shadows = true) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = shadows;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

const rounded = (w: number, h: number, d: number, r = 0.015) => keep(new RoundedBoxGeometry(w, h, d, 3, r));

function lathe(points: [number, number][], segments = 48) {
  return keep(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments));
}

function tube(points: [number, number, number][], radius: number) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  return keep(new THREE.TubeGeometry(curve, 32, radius, 12, false));
}

function curvedTap(reach = 0.14) {
  return tube([[0, 0, 0], [0, 0.17, 0], [0, 0.23, 0.04], [0, 0.22, reach]], 0.011);
}

/** Wall-hung vanity with two drawers, stone top, vessel basin, tap and mirror. */
export function vanityModel(m: RoomMaterials) {
  const group = new THREE.Group();
  add(group, rounded(1.0, 0.46, 0.46, 0.02), m.wood, [0, 0.62, 0.23]);
  // Drawer gap and handles.
  add(group, keep(new THREE.BoxGeometry(0.96, 0.006, 0.01)), m.black, [0, 0.62, 0.462], false);
  for (const y of [0.74, 0.51]) add(group, rounded(0.22, 0.012, 0.02, 0.005), m.brass, [0, y, 0.47], false);
  add(group, rounded(1.04, 0.035, 0.5, 0.008), m.stone, [0, 0.87, 0.25]);
  const basinProfile: [number, number][] = [[0, 0], [0.15, 0], [0.19, 0.03], [0.205, 0.12], [0.198, 0.13], [0.188, 0.125], [0.176, 0.04], [0.14, 0.018], [0, 0.018]];
  const basin = add(group, lathe(basinProfile), m.ceramic, [0, 0.888, 0.26]);
  basin.scale.set(1, 1, 0.85);
  const tap = add(group, curvedTap(), m.brass, [0, 0.888, 0.05]);
  tap.scale.setScalar(1.15);
  // Mirror with a soft LED halo behind it.
  const halo = add(group, rounded(0.86, 0.96, 0.01, 0.12), m.glow, [0, 1.62, 0.012], false);
  halo.name = 'halo';
  add(group, rounded(0.8, 0.9, 0.02, 0.12), m.mirror, [0, 1.62, 0.03]);
  // Plant on the counter.
  const plant = new THREE.Group();
  plant.position.set(0.36, 0.888, 0.32);
  add(plant, keep(new THREE.CylinderGeometry(0.05, 0.04, 0.11, 24)), m.pot, [0, 0.055, 0]);
  const leaf = keep(new THREE.SphereGeometry(0.05, 12, 8));
  for (let index = 0; index < 7; index += 1) {
    const angle = (index / 7) * Math.PI * 2;
    const mesh = add(plant, leaf, m.leaf, [Math.cos(angle) * 0.05, 0.15 + (index % 3) * 0.035, Math.sin(angle) * 0.05]);
    mesh.scale.set(0.5, 1.2, 0.25);
    mesh.rotation.set(Math.sin(angle) * 0.6, angle, Math.cos(angle) * 0.6);
  }
  group.add(plant);
  return group;
}

/** Glass screen with brass profile; origin at the floor where it meets the back wall. */
export function showerScreenModel(m: RoomMaterials) {
  const group = new THREE.Group();
  const glass = add(group, keep(new THREE.BoxGeometry(0.01, 2.0, 1)), m.glass, [0, 1.0, 0.5], false);
  glass.name = 'glass';
  const profile = add(group, keep(new THREE.BoxGeometry(0.025, 0.025, 1)), m.brass, [0, 2.0, 0.5], false);
  profile.name = 'profile';
  const wallProfile = add(group, keep(new THREE.BoxGeometry(0.025, 2.0, 0.03)), m.brass, [0, 1.0, 0.015], false);
  wallProfile.name = 'wallProfile';
  return group;
}

/** Rain shower head on an arm from the back wall. */
export function rainShowerModel(m: RoomMaterials) {
  const group = new THREE.Group();
  add(group, tube([[0, 0, 0], [0, 0.02, 0.15], [0, 0, 0.3]], 0.012), m.brass, [0, 2.12, 0]);
  add(group, keep(new THREE.CylinderGeometry(0.15, 0.15, 0.015, 40)), m.brass, [0, 2.11, 0.3]);
  return group;
}

/** Exposed thermostatic mixer with riser, used when there is no concealed tap. */
export function exposedMixerModel(m: RoomMaterials) {
  const group = new THREE.Group();
  add(group, rounded(0.32, 0.06, 0.06, 0.025), m.brass, [0, 1.05, 0.06]);
  add(group, keep(new THREE.CylinderGeometry(0.012, 0.012, 1.0, 12)), m.brass, [0, 1.58, 0.06]);
  return group;
}

/** Concealed tap: flush plate with lever (option "inbouwkraan"). */
export function concealedTapModel(m: RoomMaterials) {
  const group = new THREE.Group();
  add(group, rounded(0.16, 0.16, 0.012, 0.01), m.brass, [0, 1.1, 0.006]);
  const lever = add(group, keep(new THREE.CylinderGeometry(0.014, 0.014, 0.1, 12)), m.brass, [0, 1.1, 0.06]);
  lever.rotation.x = Math.PI / 2;
  return group;
}

/** Linear drain with steel grate (option "drain"); origin at its centre. */
export function drainModel(m: RoomMaterials) {
  const group = new THREE.Group();
  const grate = add(group, keep(new THREE.BoxGeometry(1, 0.006, 0.07)), m.grate, [0, 0.003, 0], false);
  grate.name = 'grate';
  return group;
}

/** Recessed niche with LED strip and bottles (option "niche"). */
export function nicheModel(m: RoomMaterials) {
  const group = new THREE.Group();
  add(group, keep(new THREE.BoxGeometry(0.6, 0.32, 0.02)), m.inset, [0, 0, 0.01], false);
  add(group, keep(new THREE.BoxGeometry(0.6, 0.02, 0.1)), m.plaster, [0, -0.15, 0.05]);
  add(group, keep(new THREE.BoxGeometry(0.6, 0.02, 0.1)), m.plaster, [0, 0.15, 0.05]);
  for (const x of [-0.29, 0.29]) add(group, keep(new THREE.BoxGeometry(0.02, 0.32, 0.1)), m.plaster, [x, 0, 0.05]);
  const led = add(group, keep(new THREE.BoxGeometry(0.56, 0.008, 0.01)), m.glow, [0, 0.135, 0.07], false);
  led.name = 'led';
  const bottle = keep(new THREE.CylinderGeometry(0.03, 0.03, 0.13, 16));
  add(group, bottle, m.black, [-0.14, -0.07, 0.05]);
  add(group, bottle, m.ceramic, [-0.06, -0.075, 0.05]).scale.set(0.9, 0.9, 0.9);
  return group;
}

/** Toilet; the variant follows the chosen options. Origin at the wall. */
export function toiletModel(m: RoomMaterials) {
  const group = new THREE.Group();
  const bowlProfile: [number, number][] = [[0, 0.02], [0.1, 0], [0.16, 0.07], [0.185, 0.2], [0.18, 0.27], [0.17, 0.28], [0.15, 0.22], [0.08, 0.15], [0, 0.14]];
  const bowl = add(group, lathe(bowlProfile), m.ceramic, [0, 0.15, 0.33]);
  bowl.scale.set(1, 1, 1.45);
  bowl.name = 'bowl';
  const lid = add(group, keep(new THREE.SphereGeometry(0.19, 32, 12)), m.ceramic, [0, 0.43, 0.34]);
  lid.scale.set(1, 0.08, 1.4);
  lid.name = 'lid';
  const pedestal = add(group, keep(new THREE.CylinderGeometry(0.11, 0.14, 0.3, 32)), m.ceramic, [0, 0.15, 0.3]);
  pedestal.name = 'pedestal';
  const cistern = add(group, rounded(0.42, 0.42, 0.17, 0.03), m.ceramic, [0, 0.66, 0.09]);
  cistern.name = 'cistern';
  const boxing = add(group, rounded(0.9, 1.15, 0.24, 0.01), m.plaster, [0, 0.575, 0.12]);
  boxing.name = 'boxing';
  const shelf = add(group, rounded(0.92, 0.03, 0.26, 0.006), m.stone, [0, 1.165, 0.13]);
  shelf.name = 'shelf';
  const frame = add(group, keep(new THREE.BoxGeometry(0.5, 1.1, 0.1)), m.steel, [0, 0.55, 0.06]);
  frame.name = 'frame';
  const plate = new THREE.Group();
  plate.name = 'plate';
  add(plate, rounded(0.25, 0.16, 0.012, 0.01), m.brass, [0, 0, 0]);
  add(plate, rounded(0.1, 0.12, 0.006, 0.006), m.black, [-0.06, 0, 0.008], false);
  add(plate, rounded(0.1, 0.12, 0.006, 0.006), m.black, [0.06, 0, 0.008], false);
  group.add(plate);
  return group;
}

/** Small hand basin with tap for a WC. */
export function handBasinModel(m: RoomMaterials) {
  const group = new THREE.Group();
  add(group, rounded(0.4, 0.12, 0.24, 0.03), m.ceramic, [0, 0.82, 0.12]);
  add(group, curvedTap(0.09), m.brass, [0.1, 0.88, 0.04]).scale.setScalar(0.8);
  return group;
}

/** Black towel radiator on a wall. */
export function radiatorModel(m: RoomMaterials) {
  const group = new THREE.Group();
  const vertical = keep(new THREE.CylinderGeometry(0.015, 0.015, 1.3, 12));
  for (const x of [-0.25, 0.25]) add(group, vertical, m.black, [x, 1.05, 0.06]);
  const bar = keep(new THREE.CylinderGeometry(0.011, 0.011, 0.5, 10));
  for (let index = 0; index < 9; index += 1) {
    const mesh = add(group, bar, m.black, [0, 0.45 + index * 0.15, 0.06]);
    mesh.rotation.z = Math.PI / 2;
  }
  return group;
}

/** Wall socket with two holes (option "elektra"). */
export function socketModel(m: RoomMaterials) {
  const group = new THREE.Group();
  add(group, rounded(0.085, 0.085, 0.014, 0.012), m.ceramic, [0, 0, 0.007], false);
  const hole = keep(new THREE.CylinderGeometry(0.005, 0.005, 0.004, 8));
  for (const x of [-0.012, 0.012]) add(group, hole, m.black, [x, 0, 0.015], false).rotation.x = Math.PI / 2;
  return group;
}

/** Recessed spotlight: brass ring and glowing lens, facing down. */
export function spotModel(m: RoomMaterials) {
  const group = new THREE.Group();
  const ring = add(group, keep(new THREE.TorusGeometry(0.045, 0.008, 8, 24)), m.brass, [0, 0, 0], false);
  ring.rotation.x = Math.PI / 2;
  add(group, keep(new THREE.CylinderGeometry(0.038, 0.038, 0.006, 20)), m.glow, [0, 0.002, 0], false);
  return group;
}

/** Serpentine heating cable, shown as if seen through the floor. */
export function heatingModel(m: RoomMaterials, length: number, width: number) {
  const points: THREE.Vector3[] = [];
  const loops = Math.max(3, Math.round(width / 0.25));
  const usable = length - 0.5;
  for (let index = 0; index <= loops; index += 1) {
    const z = -width / 2 + 0.25 + (index * (width - 0.5)) / loops;
    const forward = index % 2 === 0;
    points.push(new THREE.Vector3(forward ? -usable / 2 : usable / 2, 0, z));
    points.push(new THREE.Vector3(forward ? usable / 2 : -usable / 2, 0, z));
  }
  const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.05), loops * 24, 0.008, 6, false);
  const mesh = new THREE.Mesh(geometry, m.heat);
  mesh.position.y = 0.006;
  return mesh;
}
