import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

//Loaders
const textureLoader = new THREE.TextureLoader();
const circleTexture = textureLoader.load('/1.png');
// Points
const count = 5000;
const particleArray = new Float32Array(count);
const particleGeometry = new THREE.BufferGeometry();
for (let i = 0; i < count * 3; i++) {
	particleArray[i] = (Math.random() - 0.5) * 10;
}
particleGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(particleArray, 3)
);
const particleMaterial = new THREE.PointsMaterial({
	size: 0.05,
	alphaMap: circleTexture,
	transparent: true,
});
particleMaterial.alphaTest = 0.1;
// particleMaterial.alphaTest = 0.1;
const particle = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particle);

// particleGeometry.attributes.real = particleGeometry.attributes.position.array;
console.log(particleGeometry.attributes);
// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
	// Update objects
	// particle.position.z += 0.01;
	// if (particle.position.z > 2) {
	// 	particle.position.z = 0;
	// }
	for (let i = 0; i < count; i++) {
		let i3 = i * 3;
		let { array } = particleGeometry.attributes.position;
		array[i3 + 2] += 0.03;
		particleGeometry.attributes.position.needsUpdate = true;
		if (array[i3 + 2] > 5) {
			array[i3 + 2] = -5;
		}
	}
	particle.rotation.z += 0.001;
	// Update Orbital Controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
