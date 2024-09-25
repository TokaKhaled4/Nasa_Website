import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


const pins = [
  { lat: 29.7749, lon: -148, name: "Cairo, Egypt", description: "Cairo is facing severe challenges from rising temperatures, water scarcity, and urban pollution. The city has initiated several climate adaptation projects, including improving water management and promoting renewable energy sources to tackle the impacts of climate change." },
  { lat: -30, lon: 330.278, name: "Sydney, Australia", description: "Sydney is experiencing increased droughts and wildfires due to climate change. The Sustainable Sydney 2030 plan aims for a 70% reduction in greenhouse gas emissions, emphasizing energy efficiency and sustainable transport options." },
  { lat: 40.6895, lon: 320.6917, name: "Tokyo, Japan", description: "Tokyo is addressing urban heat islands and enhancing disaster preparedness as climate change intensifies. The city's Climate Change Strategy targets a reduction of greenhouse gas emissions by 30% by 2030, focusing on renewable energy and smart infrastructure.Tokyo is the capital of Japan." },
  { lat: 53.7749, lon: -180, name: "London, UK", description: "London faces flood risks and air pollution challenges. Its London Environment Strategy aims for a 60% reduction in greenhouse gas emissions by 2025, promoting green spaces, clean transportation, and energy-efficient buildings." },
  { lat: 55.7749, lon: -168, name: "Copenhagen, Denmark", description: "Copenhagen is a global leader in climate action, aiming to become carbon-neutral by 2025. The city has implemented extensive cycling infrastructure and promotes renewable energy, with over 60% of its energy coming from wind power." },
  { lat: 45.7749, lon: -168, name: "Venice, Italy", description: "Venice is increasingly threatened by rising sea levels and frequent flooding. The city is implementing the MOSE project, a series of barriers designed to protect it from high tides, while also focusing on sustainable tourism and reducing its carbon footprint." },
  { lat: 19.7749, lon: -108, name: "Mumbai, India", description: "Mumbai is vulnerable to monsoon flooding, heatwaves, and water scarcity. The Climate Action Plan focuses on enhancing urban resilience, with initiatives to improve drainage systems and promote green building practices." },
  { lat: 39.7749, lon: 295.6917, name: "Beijing, China", description: "Beijing struggles with poor air quality and high greenhouse gas emissions. The city has implemented strict air quality regulations and is investing heavily in renewable energy and electric public transportation to improve sustainability." },
  { lat: -20.7749, lon: -225, name: "São Paulo, Brazil", description: "São Paulo faces significant air pollution and water shortages. The city is enhancing its public transport system and promoting green initiatives to achieve a more sustainable future and reduce its carbon footprint."},
  { lat: 40.7749, lon: -260, name: "New York City, USA", description: "New York City faces significant challenges from rising sea levels and extreme weather events. The city has committed to reducing greenhouse gas emissions by 80% by 2050 through its OneNYC plan, which emphasizes sustainability, energy efficiency, and climate resilience."},
];


const iconTexture = loader.load('./textures/loc3.png'); 
const pinMaterial = new THREE.SpriteMaterial({ map: iconTexture });

function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}


function addPin(lat, lon, name, description) {
  const pinSprite = new THREE.Sprite(pinMaterial);
  const pinPosition = latLongToVector3(lat, lon, 1.05);
  pinSprite.position.copy(pinPosition);
  pinSprite.scale.set(0.1, 0.1, 1);
  pinSprite.userData = { name, description }; 
  earthGroup.add(pinSprite);
}

pins.forEach(pin => addPin(pin.lat, pin.lon, pin.name, pin.description));

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);


const infoBox = document.createElement('div');

infoBox.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
infoBox.style.opacity = '0'; 
infoBox.style.transform = 'translateX(-100%)'; 
infoBox.style.left = '100px';  
infoBox.style.top = '180px'; 
infoBox.style.width = '400px';  
infoBox.style.height = '30%';  
infoBox.style.position = 'fixed';  
infoBox.style.backgroundColor = 'rgba(0, 0, 0, 0)';  
infoBox.style.color = 'white';
infoBox.style.fontSize = '30px'; 
infoBox.style.padding = '20px';
infoBox.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
infoBox.style.display = 'none';  


document.body.appendChild(infoBox);


window.addEventListener('click', onDocumentMouseClick, false);

function onDocumentMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(earthGroup.children);

  if (intersects.length > 0) {
    const pin = intersects[0].object;
    if (pin.userData.name) {
      // Show the name and description in the infoBox
      infoBox.textContent = `${pin.userData.name}: ${pin.userData.description}`;
      infoBox.style.display = 'block';

      // Trigger the animation: slide in from the left and fade in
      setTimeout(() => {
        infoBox.style.opacity = '1';
        infoBox.style.transform = 'translateX(0)';  // Slide into view from the left
      }, 10);  // Slight delay to trigger the transition
    }
  } else {
    // Hide with slide and fade out transitions
    infoBox.style.opacity = '0';
    infoBox.style.transform = 'translateX(-100%)';  // Slide out to the left
    
    // Set a timeout to hide it after the transition
    setTimeout(() => {
      infoBox.style.display = 'none';
    }, 500);  // Match the transition duration (0.5s)
  }
}

window.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
  // Update the mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with the pins
  const intersects = raycaster.intersectObjects(earthGroup.children);

  if (intersects.length > 0 && intersects[0].object.userData.name) {
    // If a pin is hovered, change the cursor to pointer
    document.body.style.cursor = 'pointer';
  } else {
    // If no pin is hovered, revert the cursor to default
    document.body.style.cursor = 'default';
  }
}

