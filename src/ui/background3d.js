
import * as THREE from 'three';

export function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // --- REVERTED TO: DYNAMIC WAVE ---
    const particlesGeometry = new THREE.BufferGeometry();
    // Ensure we have enough particles for a dense wave
    const count = 2500;

    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    let i = 0;
    let j = 0;

    // Grid parameters
    const separation = 1.2;
    const numX = 70;
    const numY = 35;

    for (let x = 0; x < numX; x++) {
        for (let y = 0; y < numY; y++) {
            positions[i] = (x - numX / 2) * separation; // x
            positions[i + 1] = 0; // y
            positions[i + 2] = (y - numY / 2) * separation; // z

            scales[j] = 1;

            i += 3;
            j++;
        }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
        color: 0x3b82f6,
        size: 0.12,
        transparent: true,
        opacity: 0.7,
    });

    const particles = new THREE.Points(particlesGeometry, material);
    scene.add(particles);

    camera.position.y = 12;
    camera.position.z = 35;
    camera.lookAt(0, -5, 0);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    });

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.03;

        const positions = particles.geometry.attributes.position.array;
        let index = 0;

        for (let x = 0; x < numX; x++) {
            for (let y = 0; y < numY; y++) {
                const xPos = positions[index];
                // Complex wave function
                const yHeight = (Math.sin((x * 0.2) + time) * 2.5) + (Math.cos((y * 0.3) + time) * 2.0);

                positions[index + 1] = yHeight;
                index += 3;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;

        // Smooth camera sway
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 + 12 - camera.position.y) * 0.05;
        camera.lookAt(0, -2, 0);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
