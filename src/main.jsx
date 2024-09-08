import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from './assets/img/stars.jpg';
import sunTexture from './assets/img/sun.jpg';
import mercuryTexture from './assets/img/mercury.jpg';
import venusTexture from './assets/img/venus.jpg';
import earthTexture from './assets/img/earth.jpg';
import marsTexture from './assets/img/mars.jpg';
import jupiterTexture from './assets/img/jupiter.jpg';
import saturnTexture from './assets/img/saturn.jpg';
import saturnRingTexture from './assets/img/saturn ring.png';
import uranusTexture from './assets/img/uranus.jpg';
import uranusRingTexture from './assets/img/uranus ring.png';
import neptuneTexture from './assets/img/neptune.jpg';
import plutoTexture from './assets/img/pluto.jpg';

// Setting up orbit control
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// Creating a scene to add all elements
const scene = new THREE.Scene();


// Creating a camera instance
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-90, 140, 140); // Set camera position


// Setting up texture loader
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load(starsTexture);
scene.background = backgroundTexture;

// Setting up orbit control
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Setting up light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Loading planets
const textureload = new THREE.TextureLoader();
// Sun
const sunGeo = new THREE.SphereGeometry(12, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureload.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Adding point light

const pointLight = new THREE.PointLight(0xffffff, 10, 1000);
pointLight.position.set(0, 0, 0); // Position at the center (where the sun is)
scene.add(pointLight);

// Additional directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-100, 100, 100);
scene.add(directionalLight);

// Load the audio
const listener = new THREE.AudioListener(); // Create an AudioListener
camera.add(listener); // Add it to the camera

const sound = new THREE.Audio(listener); // Pass listener to the audio object
const audioLoader = new THREE.AudioLoader();

audioLoader.load('./assets/backgroundmusic.MP3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true); // Enable looping
    sound.setVolume(0.5); // Adjust volume

    // Wait for user interaction before playing
    const playAudio = () => {
        sound.play(); // Play the audio
        // Remove event listeners after playing to prevent multiple triggers
        window.removeEventListener('click', playAudio);
        window.removeEventListener('touchstart', playAudio);
    };

    // Add event listeners for click or touch to trigger audio
    window.addEventListener('click', playAudio);
    window.addEventListener('touchstart', playAudio);
});



// Loading other planets
function createPlanet(size, texture, position, ring) {
  const geometry = new THREE.SphereGeometry(size, 25, 20);
  const material = new THREE.MeshBasicMaterial({  // Changed to MeshBasicMaterial
    map: textureload.load(texture)
  });
  const planet = new THREE.Mesh(geometry, material);
  const planetObj = new THREE.Object3D;
  planetObj.add(planet);
  scene.add(planetObj);
  planet.position.x = position;

  if (ring) {
    const RingGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius, 30
    );
    const RingMat = new THREE.MeshStandardMaterial({
      map: textureload.load(ring.texture),
      side: THREE.DoubleSide
    });
    const Ring = new THREE.Mesh(RingGeo, RingMat);
    planetObj.add(Ring);

    Ring.position.x = position;
    Ring.rotation.x = -0.5 * Math.PI;
  }
  return { planet, planetObj };
}

const mercury = createPlanet(4, mercuryTexture, 20);
const venus = createPlanet(5, venusTexture, 40);
const earth = createPlanet(5.56, earthTexture, 60);
const mars = createPlanet(5, marsTexture, 80);
const jupiter = createPlanet(6, jupiterTexture, 100);
const saturn = createPlanet(8, saturnTexture, 150, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
});
const uranus = createPlanet(8.2, uranusTexture, 200, {
  innerRadius: 10,
  outerRadius: 20,
  texture: uranusRingTexture
});
const neptune = createPlanet(5, neptuneTexture, 240);

function animate() {
  sun.rotateY(0.002);
  mercury.planet.rotateY(0.001);
  mercury.planetObj.rotateY(0.001);
  venus.planet.rotateY(0.0012);
  venus.planetObj.rotateY(0.0015);
  earth.planet.rotateY(0.012);
  earth.planetObj.rotateY(0.0012);
  mars.planet.rotateY(0.013);
  mars.planetObj.rotateY(0.0019);
  jupiter.planet.rotateY(0.04);
  jupiter.planetObj.rotateY(0.0023);
  saturn.planet.rotateY(0.01);
  saturn.planetObj.rotateY(0.0021);
  uranus.planet.rotateY(0.01);
  uranus.planetObj.rotateY(0.0015);
  neptune.planet.rotateY(0.01);
  neptune.planetObj.rotateY(0.001);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Handling window resize
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
