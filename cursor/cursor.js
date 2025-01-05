// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Star Particles
const stars = [];
const starGeometry = new THREE.BufferGeometry();
const starCount = 300;
const positions = new Float32Array(starCount * 3);
const velocities = new Float32Array(starCount * 3);

// Initialize Particles
for (let i = 0; i < starCount; i++) {
  positions[i * 3] = Math.random() * 20 - 10; // x
  positions[i * 3 + 1] = Math.random() * 20 - 10; // y
  positions[i * 3 + 2] = Math.random() * 5 - 2.5; // z
  velocities[i * 3] = 0;
  velocities[i * 3 + 1] = 0;
  velocities[i * 3 + 2] = 0;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 0.15,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  color: 'yellow',
});

const starSystem = new THREE.Points(starGeometry, starMaterial);
scene.add(starSystem);

// Mouse Tracking
let mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Spawn Stars at Mouse Location
  for (let i = 0; i < starCount; i++) {
    const dx = positions[i * 3] - mouse.x * 5;
    const dy = positions[i * 3 + 1] - mouse.y * 5;
    if (dx * dx + dy * dy < 2) {
      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      positions[i * 3] = mouse.x * 5;
      positions[i * 3 + 1] = mouse.y * 5;
      positions[i * 3 + 2] = 0;
    }
  }
});

// Update Star Positions
function updateStars() {
  const positions = starGeometry.attributes.position.array;
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] += velocities[i * 3];
    positions[i * 3 + 1] += velocities[i * 3 + 1];
    positions[i * 3 + 2] += velocities[i * 3 + 2];
    velocities[i * 3] *= 0.98; // Damping for realism
    velocities[i * 3 + 1] *= 0.98;
    velocities[i * 3 + 2] *= 0.98;

    // Fade and Reset
    if (Math.abs(velocities[i * 3]) < 0.001) {
      positions[i * 3] = 1000; // Move off-screen to avoid rendering
    }
  }
  starGeometry.attributes.position.needsUpdate = true;
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  updateStars();
  renderer.render(scene, camera);
}

// Handle Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation
animate();
