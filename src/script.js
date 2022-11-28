import './style.css';
import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Base
 */
// Debug
const debugObject = {};
const gui = new dat.GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
/**
 * Textures
 */

const portalTexture = textureLoader.load('finalBaked.jpg');
portalTexture.flipY = false;
portalTexture.encoding = THREE.sRGBEncoding;
/**
 * Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: portalTexture });
const lampMaterial = new THREE.MeshBasicMaterial({ color: 0x5db3f9 });
const portalMaterial = new THREE.MeshBasicMaterial({ color: 0xeb48dc });

/**
 * Model
 */
gltfLoader.load('PortalScene.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial;
  });
  let pole_light_one = gltf.scene.children.find(
    (child) => child.name == 'pole_light_one'
  );
  let pole_light_two = gltf.scene.children.find(
    (child) => child.name == 'pole_light_two'
  );
  let portal_light = gltf.scene.children.find(
    (child) => child.name == 'portal_light'
  );

  pole_light_one.material = lampMaterial;
  pole_light_two.material = lampMaterial;
  portal_light.material = portalMaterial;
  scene.add(gltf.scene);
});

/**
 * Fire Flies
 */

//Geometry
const fireFliesGeometry = new THREE.BufferGeometry();
const fireFliesCount = 30;
const positionArray = new Float32Array(fireFliesCount * 3);

for (let i = 0; i < fireFliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
}
fireFliesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionArray, 3)
);

//Material

const fireFliesMaterial = new THREE.PointsMaterial({
  color: 0x888888,
  size: 0.1,
  sizeAttenuation: true,
});

const fireFlies = new THREE.Points(fireFliesGeometry, fireFliesMaterial);

scene.add(fireFlies);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
debugObject.clearColor = '#544f4f';

renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, 'clearColor').onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
